import { NextRequest, NextResponse } from "next/server";
import { downloadImageToBuffer, vectorizeImage } from "@/services/vectorizer";
import { auth } from "@/lib/auth";


export async function POST(req: NextRequest) {
    try {
        const session = await auth();

        // Basic auth check - allow robust usage later
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { imageUrl } = body;

        if (!imageUrl) {
            return NextResponse.json({ error: "Missing imageUrl" }, { status: 400 });
        }

        // 1. Download the image
        const buffer = await downloadImageToBuffer(imageUrl);

        // 2. Vectorize
        const svg = await vectorizeImage(buffer);

        // 3. Return SVG
        return NextResponse.json({ svg });

    } catch (error: any) {
        console.error("API Vectorize Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
