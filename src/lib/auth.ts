import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: DrizzleAdapter(db),
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/auth/sign-in",
        error: "/auth/error",
    },
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }

                const email = credentials.email as string;
                const password = credentials.password as string;

                // Password complexity check
                const isStrongPassword =
                    password.length >= 8 &&
                    /[A-Z]/.test(password) &&
                    /[a-z]/.test(password) &&
                    /[0-9]/.test(password);

                if (!isStrongPassword) {
                    throw new Error("Password must be at least 8 characters long and contain uppercase, lowercase, and numbers");
                }

                const user = await db.query.users.findFirst({
                    where: eq(users.email, email),
                });

                if (!user || !user.password) {
                    throw new Error("Invalid email or password");
                }

                const isValid = await bcrypt.compare(password, user.password);

                if (!isValid) {
                    throw new Error("Invalid email or password");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;

                // Fetch latest user data to ensure role is up to date
                const dbUser = await db.query.users.findFirst({
                    where: eq(users.id, token.id as string),
                });

                if (dbUser) {
                    session.user.role = dbUser.role as "admin" | "user";
                }
            }
            return session;
        },
    },
});
