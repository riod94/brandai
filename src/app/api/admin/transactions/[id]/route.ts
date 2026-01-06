import { auth } from "@/lib/auth";
import { db } from "@/db";
import { transactions, users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (session?.user?.role !== "admin") {
            return Response.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const id = (await params).id;
        const body = await request.json();
        const { status } = body; // 'success' | 'failed'

        if (!status || !['success', 'failed'].includes(status)) {
            return Response.json({ error: "Invalid status" }, { status: 400 });
        }

        const transaction = await db.query.transactions.findFirst({
            where: eq(transactions.id, id),
        });

        if (!transaction) {
            return Response.json({ error: "Transaction not found" }, { status: 404 });
        }

        if (transaction.status === status) {
            return Response.json({ message: "Status already updated" });
        }

        // Update transaction
        await db
            .update(transactions)
            .set({
                status,
                updatedAt: new Date()
            })
            .where(eq(transactions.id, id));

        // If approving, add credits
        if (status === "success" && transaction.status !== "success") {
            await db
                .update(users)
                .set({
                    credits: sql`${users.credits} + ${transaction.credits}`,
                    updatedAt: new Date(),
                })
                .where(eq(users.id, transaction.userId));
        }

        return Response.json({ success: true });

    } catch (error) {
        console.error("Failed to update transaction:", error);
        return Response.json(
            { error: "Failed to update transaction" },
            { status: 500 }
        );
    }
}
