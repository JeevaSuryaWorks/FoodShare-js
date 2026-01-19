const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const APP_URL = 'https://foodshare-jscorp.firebaseapp.com';
const APP_TITLE = 'FeedReach';

export interface AIAnalysisResult {
    freshnessScore: number;
    isEdible: boolean;
    tags: string[];
    safetyNotes: string;
    estimatedShelfLife: string;
}

// Helper for OpenRouter calls
const callOpenRouter = async (model: string, messages: any[], responseFormat: any = null) => {
    if (!OPENROUTER_API_KEY) throw new Error("OpenRouter Key Missing");

    const body: any = {
        model,
        messages,
        temperature: 0.2,
    };
    if (responseFormat) body.response_format = responseFormat;

    const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': APP_URL,
            'X-Title': APP_TITLE,
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const errText = await response.text();
        if (errText.includes("data policy") || response.status === 404) {
            throw new Error(`OpenRouter Error: Please enable 'Allow models to train on my prompts' in your OpenRouter settings to use free models. Details: ${errText}`);
        }
        throw new Error(`OpenRouter (${model}) failed: ${response.statusText} - ${errText}`);
    }
    return response.json();
};

// Helper for Groq calls
const callGroq = async (model: string, messages: any[], responseFormat: any = null) => {
    if (!GROQ_API_KEY) throw new Error("Groq Key Missing");

    const body: any = {
        model,
        messages,
        temperature: 0.2,
        max_tokens: 500,
    };
    if (responseFormat) body.response_format = responseFormat;

    const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Groq (${model}) failed: ${response.statusText} - ${errText}`);
    }
    return response.json();
};

export const analyzeFoodImage = async (imageBase64: string): Promise<AIAnalysisResult> => {
    const prompt = `
    Analyze this image strictly for food donation safety.
    
    CRITICAL RULES:
    1. If the image is NOT real food (e.g., logos, text, people, buildings, non-food objects), you MUST set "isEdible": false, "freshnessScore": 0, and add tag "NON_FOOD".
    2. If the food appears rotten, moldy, or unsafe, set "isEdible": false.
    3. If it is packaged food, check for visible damage (dents, seals broken).
    
    Provide a JSON response with:
    {
      "freshnessScore": number (0-100),
      "isEdible": boolean,
      "tags": string[] (e.g., "cooked", "raw", "packaged", "NON_FOOD", "fresh"),
      "safetyNotes": string (short observation, e.g. "Detected logo only, not food" or "Fresh fruits visible"),
      "estimatedShelfLife": string (e.g., "24 hours", "N/A")
    }
  `;

    const messages = [
        {
            role: "user",
            content: [
                { type: "text", text: prompt },
                { type: "image_url", image_url: { url: imageBase64 } }
            ]
        }
    ];

    // 1. Try OpenRouter (Gemini 2.0 Flash - Best for Vision)
    try {
        if (!OPENROUTER_API_KEY) throw new Error("OpenRouter API Key is missing in .env");

        console.log("Attempting OpenRouter (Gemini 2.0)...");
        const data = await callOpenRouter('google/gemini-2.0-flash-exp:free', messages, { type: "json_object" });
        return JSON.parse(data.choices[0].message.content);
    } catch (orError: any) {
        console.warn("OpenRouter Gemini 2.0 failed:", orError.message);

        // Specific user-friendly message for training policy error
        const isTrainingError = orError.message.includes("data policy") || orError.message.includes("train on my prompts");
        const safetyMessage = isTrainingError
            ? "AI Analysis requires enabling 'Allow models to train' in OpenRouter settings for free models."
            : "AI Service temporarily unavailable.";

        // 1.1 Retry with Stable Gemini 1.5 Flash
        try {
            if (OPENROUTER_API_KEY) {
                console.log("Attempting OpenRouter fallback (Gemini 1.5 Flash)...");
                const data = await callOpenRouter('google/gemini-flash-1.5', messages, { type: "json_object" });
                return JSON.parse(data.choices[0].message.content);
            }
        } catch (backupError: any) {
            console.warn("OpenRouter fallback failed:", backupError.message);
        }

        console.warn("AI Services unavailable. Defaulting to Manual Verification.");
        return {
            freshnessScore: 0,
            isEdible: false,
            tags: ["AI Unavailable", "Manual Verify"],
            safetyNotes: safetyMessage,
            estimatedShelfLife: "Manual Check Required"
        };
    }
};

export const generateSmartRecipes = async (ingredients: string[]): Promise<any[]> => {
    const prompt = `
      Suggest 3 creative "Zero Waste" recipes using: ${ingredients.join(', ')}.
      Return JSON array of objects: 
      { 
        "title": string, 
        "description": string, 
        "difficulty": string, 
        "time": string,
        "ingredients": string[],
        "instructions": string[]
      }
    `;
    const messages = [{ role: "user", content: prompt }];

    // 1. Try OpenRouter
    try {
        console.log("Recipes: Attempting OpenRouter...");
        const data = await callOpenRouter('google/gemini-2.0-flash-exp:free', messages, { type: "json_object" });
        let content = data.choices[0].message.content.replace(/```json/g, '').replace(/```/g, '').trim();
        const result = JSON.parse(content);
        return Array.isArray(result) ? result : result.recipes || [];
    } catch (orError) {
        console.warn("OpenRouter recipes failed, switching to Groq...", orError);
    }

    // 2. Try Groq
    try {
        console.log("Recipes: Attempting Groq...");
        if (GROQ_API_KEY) {
            const data = await callGroq('llama-3.3-70b-versatile', messages, { type: "json_object" });
            let content = data.choices[0].message.content.replace(/```json/g, '').replace(/```/g, '').trim();
            const result = JSON.parse(content);
            return Array.isArray(result) ? result : result.recipes || [];
        }
    } catch (groqError) {
        console.error("Groq recipes failed:", groqError);
    }

    return [];
};
