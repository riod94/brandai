import { auth } from "@/lib/auth";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return Response.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { orderId } = body;

        if (!orderId) {
            return Response.json(
                { error: "Missing Order ID" },
                { status: 400 }
            );
        }

        // Find transaction
        const transaction = await db.query.transactions.findFirst({
            where: and(
                eq(transactions.orderId, orderId),
                eq(transactions.userId, session.user.id)
            ),
        });

        if (!transaction) {
            return Response.json({ error: "Transaction not found" }, { status: 404 });
        }

        if (transaction.status !== "pending") {
            return Response.json({ error: "Only pending transactions can be cancelled" }, { status: 400 });
        }

        // Update transaction
        await db.update(transactions)
            .set({
                status: "cancelled",
                updatedAt: new Date(),
            })
            .where(eq(transactions.id, transaction.id));

        return Response.json({
            success: true,
            message: "Transaction cancelled successfully",
        });

    } catch (error) {
        console.error("Cancel Transaction Error:", error);
        return Response.json(
            { error: "Failed to cancel transaction" },
            { status: 500 }
        );
    }
}
