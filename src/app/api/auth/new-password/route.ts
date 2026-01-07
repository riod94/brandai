import { db } from "@/db";
import { users, verificationTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { getPasswordResetToken } from "@/lib/tokens";

export async function POST(request: Request) {
    try {
        const { password, token } = await request.json();

        if (!password || !token) {
            return Response.json(
                { error: "Missing fields" },
                { status: 400 }
            );
        }

        const existingToken = await getPasswordResetToken(token);

        if (!existingToken) {
            return Response.json({ error: "Invalid token" }, { status: 400 });
        }

        const hasExpired = new Date(existingToken.expires) < new Date();

        if (hasExpired) {
            return Response.json({ error: "Token has expired" }, { status: 400 });
        }

        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, existingToken.identifier),
        });

        if (!existingUser) {
            return Response.json({ error: "User does not exist" }, { status: 404 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Update password
        await db
            .update(users)
            .set({ password: hashedPassword })
            .where(eq(users.id, existingUser.id));

        // Delete used token
        await db
            .delete(verificationTokens)
            .where(eq(verificationTokens.identifier, existingToken.identifier));

        return Response.json({ success: true, message: "Password updated" });
    } catch (error) {
        console.error("New password error:", error);
        return Response.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
