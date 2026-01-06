import { auth } from "@/lib/auth";
import { db } from "@/db";
import { paymentMethods } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (session?.user?.role !== "admin") {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const id = (await params).id;
        await db.delete(paymentMethods).where(eq(paymentMethods.id, id));

        return Response.json({ success: true });
    } catch (error) {
        console.error("Failed to delete payment method:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (session?.user?.role !== "admin") {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const id = (await params).id;
        const body = await request.json();

        // Remove id and timestamps from update body to be safe
        const { id: _, createdAt, updatedAt, ...updateData } = body;

        const [updatedMethod] = await db
            .update(paymentMethods)
            .set({
                ...updateData,
                updatedAt: new Date()
            })
            .where(eq(paymentMethods.id, id))
            .returning();

        return Response.json({ success: true, paymentMethod: updatedMethod });
    } catch (error) {
        console.error("Failed to update payment method:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
