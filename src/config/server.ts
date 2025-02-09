export const serverConfig = {
    togetherApiKey: process.env.TOGETHER_API_KEY!,
    hfToken: process.env.HF_TOKEN!,
};

export const fetcher = (url: string, init?: RequestInit) => {
    const fullUrl = url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}${url}`;
    return fetch(fullUrl, init).then((res) => res.json());
};