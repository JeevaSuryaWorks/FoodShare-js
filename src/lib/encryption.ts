/**
 * Simple End-to-End Encryption utility for FeedReach.
 * This implementation uses Web Crypto API for secure AES-GCM encryption.
 */

const ENCRYPTION_KEY_PREFIX = 'feedreach_key_';

// Generate or retrieve a consistent key for the user
// In a real app, this would be derived from a password or stored securely/recovery-phrase based
export const getEncryptionKey = async (userId: string): Promise<CryptoKey> => {
    const storedKey = localStorage.getItem(`${ENCRYPTION_KEY_PREFIX}${userId}`);

    if (storedKey) {
        const keyData = JSON.parse(storedKey);
        return await crypto.subtle.importKey(
            'jwk',
            keyData,
            { name: 'AES-GCM', length: 256 },
            true,
            ['encrypt', 'decrypt']
        );
    }

    // Generate new key
    const key = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );

    const exported = await crypto.subtle.exportKey('jwk', key);
    localStorage.setItem(`${ENCRYPTION_KEY_PREFIX}${userId}`, JSON.stringify(exported));

    return key;
};

export const encryptMessage = async (text: string, userId: string): Promise<string> => {
    try {
        const key = await getEncryptionKey(userId);
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encoded = new TextEncoder().encode(text);

        const encrypted = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            key,
            encoded
        );

        const result = {
            iv: btoa(String.fromCharCode(...iv)),
            data: btoa(String.fromCharCode(...new Uint8Array(encrypted)))
        };

        return `e2e:${JSON.stringify(result)}`;
    } catch (err) {
        console.error("Encryption failed:", err);
        return text; // Fallback to plain text if encryption fails
    }
};

export const decryptMessage = async (encryptedData: string, userId: string): Promise<string> => {
    try {
        if (!encryptedData.startsWith('e2e:')) return encryptedData;

        const key = await getEncryptionKey(userId);
        const { iv, data } = JSON.parse(encryptedData.slice(4));

        const ivArray = new Uint8Array(atob(iv).split('').map(c => c.charCodeAt(0)));
        const dataArray = new Uint8Array(atob(data).split('').map(c => c.charCodeAt(0)));

        const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: ivArray },
            key,
            dataArray
        );

        return new TextDecoder().decode(decrypted);
    } catch (err) {
        console.error("Decryption failed:", err);
        return "[Encrypted Message - Unable to Decrypt]";
    }
};
