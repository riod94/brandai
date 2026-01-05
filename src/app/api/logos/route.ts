import { auth } from "@/lib/auth";
import { db } from "@/db";
import { logos, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { deleteLogo as deleteFromStorage } from "@/lib/storage";

// GET - List user's logos
export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userLogos = await db.query.logos.findMany({
            where: eq(logos.userId, session.user.id),
            orderBy: [desc(logos.createdAt)],
        });

        // Also get user credits
        const user = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
            columns: { credits: true, plan: true },
        });

        return Response.json({
            logos: userLogos,
            credits: user?.credits || 0,
            plan: user?.plan || "free",
        });
    } catch (error) {
        console.error("Get logos error:", error);
        return Response.json({ error: "Failed to get logos" }, { status: 500 });
    }
}

// DELETE - Delete a logo
export async function DELETE(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const logoId = searchParams.get("id");

        if (!logoId) {
            return Response.json({ error: "Logo ID required" }, { status: 400 });
        }

        // Find the logo and verify ownership
        const logo = await db.query.logos.findFirst({
            where: eq(logos.id, logoId),
        });

        if (!logo) {
            return Response.json({ error: "Logo not found" }, { status: 404 });
        }

        if (logo.userId !== session.user.id) {
            return Response.json({ error: "Forbidden" }, { status: 403 });
        }

        // Delete from storage (extract public_id from URL)
        try {
            const urlParts = logo.imageUrl.split("/");
            const publicId = `brandai/logos/${urlParts[urlParts.length - 1].split(".")[0]}`;
            await deleteFromStorage(publicId);
        } catch (e) {
            console.warn("Failed to delete from storage:", e);
        }

        // Delete from database
        await db.delete(logos).where(eq(logos.id, logoId));

        return Response.json({ success: true });
    } catch (error) {
        console.error("Delete logo error:", error);
        return Response.json({ error: "Failed to delete logo" }, { status: 500 });
    }
}
