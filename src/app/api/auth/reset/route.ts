import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return Response.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (!existingUser) {
            // For security, do not reveal if email exists
            return Response.json({ success: true, message: "Email sent" });
        }

        // Generate token
        const token = await generatePasswordResetToken(email);

        // Send email
        await sendPasswordResetEmail(email, token);

        return Response.json({ success: true, message: "Email sent" });
    } catch (error) {
        console.error("Reset password error:", error);
        return Response.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
