const validateEnv = () => {
    const required = ['HF_TOKEN'];
    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        console.warn(`⚠️ Missing environment variables: ${missing.join(', ')}`);
        console.warn('Logo generation may fall back to Pollinations.ai');
    }
};

// Validate on module load
validateEnv();

export const serverConfig = {
    hfToken: process.env.HF_TOKEN || '',
    hfProvider: process.env.HF_PROVIDER || "auto",
    hfModel: process.env.HF_MODEL || "black-forest-labs/FLUX.1-schnell",
    pollinationsApiUrl: process.env.POLLINATIONS_API_URL || "https://image.pollinations.ai/prompt",
};

export const fetcher = (url: string, init?: RequestInit) => {
    const fullUrl = url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}${url}`;
    return fetch(fullUrl, init).then((res) => res.json());
};