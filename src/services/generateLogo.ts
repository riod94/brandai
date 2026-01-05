import { serverConfig } from "@/config/server";
import { FormLogoValues } from "@/types";
import { InferenceClient } from "@huggingface/inference";

const generatePrompt = (values: FormLogoValues): string => {
    const prompts = [
        `Create a logo for "${values.name}"`,
    ];
    if (values.slogan) {
        prompts.push(`and a slogan "${values.slogan}"`);
    }
    if (values.styles.length > 0) {
        prompts.push(`showcasing a stylized of "${values.styles}" style`);
    }
    if (values.colors.length > 0) {
        prompts.push(`with colors "${values.colors}"`);
    }
    return prompts.join(" ");
};

const convertToBase64Image = (base64ImageData: string) => {
    return `data:image/png;base64,${base64ImageData}`;
};

const generateLogoWithPollinations = async (prompt: string) => {
    try {
        const seed = Math.floor(Math.random() * 1000000);
        const encodedPrompt = encodeURIComponent(prompt);

        // Remove trailing slash if present to avoid double slash
        const baseUrl = serverConfig.pollinationsApiUrl.replace(/\/$/, "");
        const url = `${baseUrl}/${encodedPrompt}?width=1024&height=1024&seed=${seed}&nologo=true&model=flux`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Pollinations API Error: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const base64Data = Buffer.from(arrayBuffer).toString("base64");
        return convertToBase64Image(base64Data);
    } catch (error) {
        console.error("Pollinations Failed:", error);
        throw new Error("failed generate with pollinations");
    }
};

const generateLogoWithHF = async (prompt: string) => {
    try {
        const client = new InferenceClient(serverConfig.hfToken);
        const seed = Math.floor(Math.random() * 1000000);

        const response: any = await client.textToImage({
            provider: "auto",
            model: serverConfig.hfModel,
            inputs: prompt,
            parameters: {
                num_inference_steps: 4,
                seed: seed,
            },
        });

        const buffer = await response.arrayBuffer();
        const base64Data = Buffer.from(buffer).toString("base64");
        return convertToBase64Image(base64Data);
    } catch (error) {
        console.error("HF Inference Failed:", error);
        throw error;
    }
};


export const generateLogo = async (values: FormLogoValues): Promise<string> => {
    const prompt = generatePrompt(values);

    // Priority Chain:
    // 1. Hugging Face (Official SDK)
    // 2. Pollinations.ai (Fallback)

    try {
        return await generateLogoWithHF(prompt);
    } catch (e) {
        console.warn("HF Failed, trying Pollinations fallback:", e);
        try {
            return await generateLogoWithPollinations(prompt);
        } catch (e2) {
            console.error("All generation methods failed:", e2);
            throw new Error("Failed to generate logo with all available services.");
        }
    }
};