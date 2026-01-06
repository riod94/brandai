import { auth } from "@/lib/auth";
import { removeBackground } from "@imgly/background-removal-node";

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { imageUrl } = await request.json();

        if (!imageUrl) {
            return Response.json({ error: "Image URL required" }, { status: 400 });
        }

        console.log("Starting background removal for:", imageUrl);

        // Fetch the image
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
            return Response.json({ error: "Failed to fetch image" }, { status: 400 });
        }

        const arrayBuffer = await imageResponse.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: "image/png" });

        // Remove background
        const resultBlob = await removeBackground(blob, {
            debug: false,
            progress: (key, current, total) => {
                console.log(`BG removal: ${key} ${current}/${total}`);
            },
        });

        // Convert to base64
        const resultArrayBuffer = await resultBlob.arrayBuffer();
        const base64 = Buffer.from(resultArrayBuffer).toString("base64");

        return Response.json({
            success: true,
            imageBase64: `data:image/png;base64,${base64}`
        });
    } catch (error) {
        console.error("Background removal error:", error);
        return Response.json({
            error: "Failed to remove background",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
