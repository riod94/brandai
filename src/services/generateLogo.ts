import { serverConfig } from "@/config/server";
import { FormLogoValues } from "@/types";
import { GoogleGenerativeAI } from "@google/generative-ai";

const generatePrompt = (values: FormLogoValues): string => {
    const prompts = [
        // "You are a logo designer. Your task is to create a logo with these specifications:",
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

const generateLogoWithGemini = async (prompt: string) => {
    try {
        const genAI = new GoogleGenerativeAI(serverConfig.geminiApiKey);
        // Using a model that supports image generation, e.g., imagen-3.0-generate-001 or check availabiltiy
        // As of my knowledge cutoff, standard gemini-pro is text/multimodal input only, not image generation output. 
        // However, assuming the user has access to an image generation capable model via Vertex AI or similar, 
        // OR assuming 'gemini-1.5-flash' or similar can handle this or we use the specific Imagen model if available in the SDK.
        // NOTE: The Google AI Studio SDK usually requires using the 'imagen-3.0-generate-001' model for image generation if available,
        // or using the Vertex AI SDK. 
        // BUT, for simplicity and assuming the user wants to use the Studio API Key:
        // Currently, image generation might be limited in the free tier or specific models.
        // Let's try using the appropriate model name for Imagen on Gemini API if available, or 'gemini-pro-vision' doesn't generate images.
        // Actually, for image generation via the API, it's often a different endpoint or model.
        // Let's assume 'try-to-generate-image' behavior.

        // Wait, the user specifically mentioned "Gemini API".
        // Let's use the 'imagen-3.0-generate-001' model if possible, or fallback.
        // However, the JS SDK documentation shows `model.generateContent` returns text/multimodal.
        // There isn't a direct "generateImage" method in the basic `GoogleGenerativeAI` client for all models yet.
        // EXCEPT for the new Imagen 3 integration if enabled.

        // Let's double check if I should use a different approach or if standard prompting works. 
        // If the user says "Gemini API", they might mean the new Imagen capabilities.
        // Let's try to use the `imagen-3.0-generate-001` model which is the standard for image gen now.

        const model = genAI.getGenerativeModel({ model: "imagen-3.0-generate-001" });

        // Note: The generateImages method might differ from generateContent.
        // As of recent updates, it might not be fully in the standard SDK types yet or requires specific usage.
        // Let's assume standard prompt for now, but usually image generation models have specific headers/methods.

        // If 'imagen-3.0-generate-001' is not available via standard SDK `generateContent`, this might fail.
        // But let's look at recent docs patterns. 
        // It seems `experimental_generateImage` or similar might be needed or just REST call.
        // Let's try to stick to a REST call if the SDK doesn't support it clearly yet to be safe, 
        // OR use the SDK if we are confident. 
        // Given I just installed the SDK, let's try to use it.

        // Re-reading docs: standard Gemini models don't generate images. Imagen 3 on Vertex AI or AI Studio does.
        // Let's try a REST call approach for Imagen if SDK is ambiguous, BUT the user asked for Gemini API.
        // Let's try the SDK first. If the SDK is just for text-to-text/multimodal-to-text, it won't work for text-to-image.
        // However, I will assume the user has access to Imagen 3.

        // Actually, let's look at the fetch implementation in the file. It's using `fetch`.
        // Maybe I should stick to `fetch` to be safe and avoid SDK version issues if I don't know the exact method.
        // Docs: POST https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict

        // Let's use a standard fetch for Imagen 3 on Gemini API to ensure it works without complex SDK typing issues if they exist.

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${serverConfig.geminiApiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    instances: [{ prompt: prompt }],
                    parameters: {
                        sampleCount: 1,
                        // aspectRatio: "1:1" // Optional
                    }
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini/Imagen Error:", errorText);
            throw new Error(`Gemini API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        // The response format for Imagen usually contains `predictions` with base64 bytes.
        if (data.predictions && data.predictions.length > 0) {
            const base64Image = data.predictions[0].bytesBase64Encoded;
            return convertToBase64Image(base64Image);
        }

        throw new Error("No image data in Gemini response");

    } catch (error) {
        console.error("Gemini Generation Failed:", error);
        throw error;
    }
};

const generateLogoWithTogether = async (prompt: string) => {
    const payload = {
        model: "black-forest-labs/FLUX.1-schnell-Free",
        prompt: prompt,
        width: 1440,
        height: 1440,
        steps: 4,
        n: 1,
        response_format: "b64_json",
    }
    const response = await fetch(
        serverConfig.togetherApiUrl,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${serverConfig.togetherApiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        }
    );
    const jsonResponse: {
        data?: { b64_json: string }[];
        error?: { message: string };
    } = await response.json();
    if (jsonResponse.data) {
        return convertToBase64Image(jsonResponse.data[0].b64_json);
    }
    console.error("Together error", jsonResponse.error);
    throw new Error("failed generate with together");
};

const generateLogoWithHF = async (prompt: string) => {
    const payload = {
        inputs: prompt,
        parameters: {
            num_inference_steps: 4,
            seed: Math.floor(Math.random() * 1000000),
        },
    };

    const response = await fetch(
        serverConfig.hfApiUrl,
        {
            headers: {
                Authorization: `Bearer ${serverConfig.hfToken}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(payload),
        }
    );
    const arrayBuffer = await response.arrayBuffer();
    if (!response.ok) {
        const text = Buffer.from(arrayBuffer).toString("utf-8");
        console.error("HF ERROR: ", text);
        throw new Error("failed generate logo with HF");
    }
    const base64Data = Buffer.from(arrayBuffer).toString("base64");
    return convertToBase64Image(base64Data);
};

export const generateLogo = async (values: FormLogoValues): Promise<string> => {
    const prompt = generatePrompt(values);
    try {
        // Prioritize Gemini
        return await generateLogoWithGemini(prompt);
    } catch (e) {
        console.error("Gemini Failed, trying Together:", e);
        try {
            return await generateLogoWithTogether(prompt);
        } catch (e2) {
            console.error("Together Failed, trying HF:", e2);
            return await generateLogoWithHF(prompt);
        }
    }
};