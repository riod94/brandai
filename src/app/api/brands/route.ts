import { auth } from "@/lib/auth";
import { db } from "@/db";
import { brands } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userBrands = await db.query.brands.findMany({
            where: eq(brands.userId, session.user.id),
            orderBy: (brands, { desc }) => [desc(brands.createdAt)],
        });

        return Response.json({ brands: userBrands });
    } catch (error) {
        console.error("Get brands error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return Response.json({
            error: "Failed to get brands",
            details: message
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await request.json();

        // Validate required fields
        if (!data.name || data.name.trim().length === 0) {
            return Response.json({
                error: "Brand name is required"
            }, { status: 400 });
        }

        const [newBrand] = await db
            .insert(brands)
            .values({
                userId: session.user.id,
                name: data.name.trim(),
                tagline: data.tagline?.trim() || null,
                industry: data.industry || null,
                description: data.description?.trim() || null,
                primaryColor: data.primaryColor || "#3B82F6",
                secondaryColor: data.secondaryColor || "#60A5FA",
                accentColor: data.accentColor || "#1E40AF",
                primaryFont: data.primaryFont || "Inter",
                secondaryFont: data.secondaryFont || "Inter",
            })
            .returning();

        return Response.json({ brand: newBrand }, { status: 201 });
    } catch (error) {
        console.error("Create brand error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return Response.json({
            error: "Failed to create brand",
            details: message
        }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await request.json();

        if (!data.id) {
            return Response.json({ error: "Brand ID required" }, { status: 400 });
        }

        const [updatedBrand] = await db
            .update(brands)
            .set({
                name: data.name,
                tagline: data.tagline || null,
                industry: data.industry || null,
                description: data.description || null,
                primaryColor: data.primaryColor,
                secondaryColor: data.secondaryColor,
                accentColor: data.accentColor,
                primaryFont: data.primaryFont,
                secondaryFont: data.secondaryFont,
                updatedAt: new Date(),
            })
            .where(eq(brands.id, data.id))
            .returning();

        return Response.json({ brand: updatedBrand });
    } catch (error) {
        console.error("Update brand error:", error);
        return Response.json({ error: "Failed to update brand" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return Response.json({ error: "Brand ID required" }, { status: 400 });
        }

        await db.delete(brands).where(eq(brands.id, id));

        return Response.json({ success: true });
    } catch (error) {
        console.error("Delete brand error:", error);
        return Response.json({ error: "Failed to delete brand" }, { status: 500 });
    }
}
