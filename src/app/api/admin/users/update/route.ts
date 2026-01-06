import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (session?.user?.role !== "admin") {
            return Response.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { userId, name, email, isBlocked } = body;

        if (!userId) {
            return Response.json({ error: "User ID required" }, { status: 400 });
        }

        const updateData: Partial<typeof users.$inferSelect> = {
            updatedAt: new Date(),
        };

        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email; // Note: Changing email might affect login if using OAuth without re-verification logic, but for now simple update.
        if (isBlocked !== undefined) updateData.isBlocked = isBlocked;

        await db
            .update(users)
            .set(updateData)
            .where(eq(users.id, userId));

        return Response.json({ success: true });

    } catch (error) {
        console.error("User Update Error:", error);
        return Response.json(
            { error: "Failed to update user" },
            { status: 500 }
        );
    }
}
