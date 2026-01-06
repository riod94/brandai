import fs from 'fs';

// Use require to ensure proper loading of the native binding
import { vectorize, ColorMode, PathSimplifyMode, Hierarchical } from '@neplex/vectorizer';

interface VectorizerOptions {
    colorMode?: "color" | "binary";
    filterSpeckle?: number;
    colorPrecision?: number;
    layerDifference?: number;
    cornerThreshold?: number;
    lengthThreshold?: number;
    spliceThreshold?: number;
    mode?: "spline" | "polygon" | "none";
    hierarchical?: "stacked" | "cutout";
    maxIterations?: number;
}

export const vectorizeImage = async (input: Buffer | string, options: VectorizerOptions = {}): Promise<string> => {
    try {
        // 1. Ensure we have a Buffer
        let buffer: Buffer;
        if (Buffer.isBuffer(input)) {
            buffer = input;
        } else if (typeof input === 'string') {
            if (input.startsWith('data:')) {
                buffer = Buffer.from(input.split(',')[1], 'base64');
            } else {
                if (fs.existsSync(input)) {
                    buffer = fs.readFileSync(input);
                } else {
                    // If it's a URL, we should have probably downloaded it via helper before.
                    // But if a string is passed here, assume it might be binary string or fail.
                    // Ideally callers use downloadImageToBuffer for URLs.
                    buffer = Buffer.from(input);
                }
            }
        } else {
            throw new Error("Invalid input type");
        }

        // 2. Map options to VTracer Config
        const config = {
            colorMode: ColorMode.Color,
            hierarchical: Hierarchical.Stacked,
            mode: PathSimplifyMode.Spline,
            filterSpeckle: options.filterSpeckle || 4,
            colorPrecision: options.colorPrecision || 6,
            layerDifference: options.layerDifference || 16,
            cornerThreshold: options.cornerThreshold || 60,
            lengthThreshold: options.lengthThreshold || 5,
            spliceThreshold: options.spliceThreshold || 45,
            maxIterations: options.maxIterations || 10,
        };

        // 3. Vectorize directly from Buffer
        const svg = await vectorize(buffer, config);
        return svg;

    } catch (error: any) {
        console.error("Vectorizer Error:", error);
        throw new Error(`Vectorization failed: ${error.message}`);
    }
};

export const downloadImageToBuffer = async (url: string): Promise<Buffer> => {
    // If URL is base64
    if (url.startsWith('data:')) {
        return Buffer.from(url.split(',')[1], 'base64');
    }

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
};
