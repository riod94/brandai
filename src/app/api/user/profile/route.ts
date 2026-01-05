import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name } = await request.json();

        if (!name || name.trim().length < 2) {
            return Response.json(
                { error: "Name must be at least 2 characters" },
                { status: 400 }
            );
        }

        await db
            .update(users)
            .set({
                name: name.trim(),
                updatedAt: new Date()
            })
            .where(eq(users.id, session.user.id));

        return Response.json({ success: true });
    } catch (error) {
        console.error("Update profile error:", error);
        return Response.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
