import { auth } from "@/lib/auth";
import { db } from "@/db";
import { logos } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const logo = await db.query.logos.findFirst({
            where: and(
                eq(logos.id, id),
                eq(logos.userId, session.user.id)
            ),
        });

        if (!logo) {
            return Response.json({ error: "Logo not found" }, { status: 404 });
        }

        return Response.json({ logo });
    } catch (error) {
        console.error("Get logo error:", error);
        return Response.json({ error: "Failed to get logo" }, { status: 500 });
    }
}
