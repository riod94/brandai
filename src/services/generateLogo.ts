import { serverConfig } from "@/config/server";
import { FormLogoValues } from "@/types";
import { InferenceClient } from "@huggingface/inference";

const generatePrompt = (values: FormLogoValues): string => {
    // FLUX models respond better to natural language descriptions
    let prompt = `A professional, modern, and minimalist vector logo design for a brand named "${values.name}". `;

    if (values.slogan) {
        prompt += `Include the text "${values.slogan}" in a complementary elegant font. `;
    }

    if (values.styles.length > 0) {
        prompt += `The design aesthetic should be ${values.styles.join(", ")}. `;
    }

    if (values.colors.length > 0) {
        prompt += `Use a color palette consisting of ${values.colors.join(", ")}. `;
    }

    prompt += `The logo should be centered on a clean background. High quality, 4k resolution, vector graphics style, confident lines, scalable vector art.`;

    return prompt;
};

const convertToBase64Image = (base64ImageData: string) => {
    return `data:image/png;base64,${base64ImageData}`;
};

const generateLogoWithPollinations = async (prompt: string) => {
    try {
        const seed = Math.floor(Math.random() * 1000000);
        const encodedPrompt = encodeURIComponent(prompt);

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
            provider: serverConfig.hfProvider as any,
            model: serverConfig.hfModel,
            inputs: prompt,
            parameters: {
                num_inference_steps: 5,
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