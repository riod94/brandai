import { generateLogo } from "@/services/generateLogo";
import { validateFormLogo } from "@/lib/validators";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users, logos } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { uploadLogo } from "@/lib/storage";

export const maxDuration = 60;

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return Response.json(
                { error: "Unauthorized", message: "Please sign in to generate logos" },
                { status: 401 }
            );
        }

        // Check user credits
        const user = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
        });

        if (!user) {
            return Response.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        if (user.credits <= 0) {
            return Response.json(
                {
                    error: "Insufficient credits",
                    message: "You have no credits remaining. Please purchase more credits to continue.",
                    credits: 0
                },
                { status: 402 }
            );
        }

        const body = await request.json();

        // Validate payload
        const validation = validateFormLogo(body);

        if (!validation.success) {
            const errors = validation.issues.map(issue => ({
                field: issue.path?.map(p => p.key).join('.') || 'unknown',
                message: issue.message,
            }));

            return Response.json(
                { error: 'Validation failed', details: errors },
                { status: 400 }
            );
        }

        const payload = validation.output;

        // Generate logo
        const base64Image = await generateLogo(payload);

        // Upload to storage
        const fileName = `${session.user.id}-${Date.now()}`;
        const uploadResult = await uploadLogo(base64Image, fileName);

        // Save to database
        const [savedLogo] = await db.insert(logos).values({
            userId: session.user.id,
            name: payload.name,
            slogan: payload.slogan,
            imageUrl: uploadResult.url,
            prompt: `${payload.name} ${payload.slogan || ''} ${payload.styles.join(' ')} ${payload.colors.join(' ')}`.trim(),
        }).returning();

        // Deduct credit
        await db
            .update(users)
            .set({
                credits: sql`${users.credits} - 1`,
                updatedAt: new Date()
            })
            .where(eq(users.id, session.user.id));

        return Response.json({
            success: true,
            imgSrc: uploadResult.url,
            logoId: savedLogo.id,
            creditsRemaining: user.credits - 1
        });

    } catch (e) {
        console.error("Failed to generate logo:", e);

        const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';

        return Response.json(
            {
                error: 'Failed to generate logo',
                message: errorMessage,
                hint: 'Please try again. If the problem persists, the AI service may be temporarily unavailable.'
            },
            { status: 500 }
        );
    }
}