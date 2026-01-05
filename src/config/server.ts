export const serverConfig = {
    hfToken: process.env.HF_TOKEN!,
    hfApiUrl: process.env.HF_API_URL || "https://router.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
    hfModel: process.env.HF_MODEL || "black-forest-labs/FLUX.1-schnell",
    pollinationsApiUrl: process.env.POLLINATIONS_API_URL || "https://image.pollinations.ai/prompt",
};

export const fetcher = (url: string, init?: RequestInit) => {
    const fullUrl = url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}${url}`;
    return fetch(fullUrl, init).then((res) => res.json());
};