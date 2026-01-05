export const serverConfig = {
    togetherApiKey: process.env.TOGETHER_API_KEY!,
    hfToken: process.env.HF_TOKEN!,
    geminiApiKey: process.env.GEMINI_API_KEY!,
    togetherApiUrl: process.env.TOGETHER_API_URL || "https://api.together.xyz/v1/images/generations",
    hfApiUrl: process.env.HF_API_URL || "https://router.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
    geminiApiUrl: process.env.GEMINI_API_URL || "https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict",
};

export const fetcher = (url: string, init?: RequestInit) => {
    const fullUrl = url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}${url}`;
    return fetch(fullUrl, init).then((res) => res.json());
};