import { db } from "@/db";
import { users, settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();

        if (!email || !password) {
            return Response.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // Password complexity check
        const isStrongPassword =
            password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /[0-9]/.test(password);

        if (!isStrongPassword) {
            return Response.json(
                { error: "Password must be at least 8 characters long and contain uppercase, lowercase, and numbers" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, email),
        });

        if (existingUser) {
            return Response.json(
                { error: "User with this email already exists" },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Get free credits setting
        const freeCreditsSetting = await db.query.settings.findFirst({
            where: eq(settings.key, "free_credits"),
        });
        const freeCredits = parseInt(freeCreditsSetting?.value || "5");

        // Create user
        const [newUser] = await db
            .insert(users)
            .values({
                name: name || email.split("@")[0],
                email,
                password: hashedPassword,
                credits: freeCredits, // Free welcome credits from settings
                plan: "free",
            })
            .returning();

        return Response.json({
            success: true,
            message: "Account created successfully",
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
            },
        });
    } catch (error) {
        console.error("Registration error:", error);
        return Response.json(
            { error: "Failed to create account" },
            { status: 500 }
        );
    }
}
