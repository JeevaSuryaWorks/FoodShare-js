import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { config } from 'dotenv';
import fs from 'fs';

// Load .env manually since we are running with bun/node directly
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, '../../.env');
const envConfig = config({ path: envPath });

const apiKey = process.env.VITE_GROQ_API_KEY || envConfig.parsed?.VITE_GROQ_API_KEY;

if (!apiKey) {
    console.error("No GROQ_API_KEY found.");
    process.exit(1);
}

async function listModels() {
    try {
        const response = await fetch('https://api.groq.com/openai/v1/models', {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error(`Error: ${response.status} ${response.statusText}`);
            console.error(await response.text());
            return;
        }

        const data = await response.json();
        console.log("--- ALL GROQ MODELS ---");
        data.data.forEach((model: any) => {
            console.log(model.id);
        });
        console.log("--- END GROQ MODELS ---");
    } catch (err) {
        console.error("Failed to fetch models:", err);
    }
}

listModels();
