import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

async function isAdmin() {
    const session = await auth();
    if (!session?.user?.id) return false;

    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
        columns: { role: true },
    });

    return user?.role === "admin";
}

export async function GET() {
    if (!(await isAdmin())) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const allUsers = await db.query.users.findMany({
            orderBy: [desc(users.createdAt)],
            columns: {
                id: true,
                name: true,
                email: true,
                credits: true,
                plan: true,
                role: true,
                createdAt: true,
            },
        });

        return Response.json({ users: allUsers });
    } catch (error) {
        console.error("Get users error:", error);
        return Response.json({ error: "Failed to get users" }, { status: 500 });
    }
}
