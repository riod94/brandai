import { db } from "@/db";
import { verificationTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export const generatePasswordResetToken = async (email: string) => {
    const token = crypto.randomUUID();
    const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour from now

    // Check if token already exists for this email
    const existingToken = await db.query.verificationTokens.findFirst({
        where: eq(verificationTokens.identifier, email),
    });

    if (existingToken) {
        // Delete existing token
        await db
            .delete(verificationTokens)
            .where(eq(verificationTokens.identifier, email));
    }

    // Create new token
    await db.insert(verificationTokens).values({
        identifier: email,
        token,
        expires,
    });

    return token;
};

export const getPasswordResetToken = async (token: string) => {
    try {
        const verificationToken = await db.query.verificationTokens.findFirst({
            where: eq(verificationTokens.token, token),
        });
        return verificationToken;
    } catch {
        return null;
    }
};
