import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

async function isAdmin() {
    const session = await auth();
    if (!session?.user?.id) return false;

    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
        columns: { role: true },
    });

    return user?.role === "admin";
}

export async function POST(request: Request) {
    if (!(await isAdmin())) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const { userId, role } = await request.json();

        if (!userId || !["user", "admin"].includes(role)) {
            return Response.json({ error: "Invalid input" }, { status: 400 });
        }

        await db
            .update(users)
            .set({
                role,
                updatedAt: new Date(),
            })
            .where(eq(users.id, userId));

        return Response.json({ success: true });
    } catch (error) {
        console.error("Update role error:", error);
        return Response.json({ error: "Failed to update role" }, { status: 500 });
    }
}
