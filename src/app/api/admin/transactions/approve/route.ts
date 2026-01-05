import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users, transactions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

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
        const { transactionId } = await request.json();

        if (!transactionId) {
            return Response.json({ error: "Transaction ID required" }, { status: 400 });
        }

        // Get transaction
        const transaction = await db.query.transactions.findFirst({
            where: eq(transactions.id, transactionId),
        });

        if (!transaction) {
            return Response.json({ error: "Transaction not found" }, { status: 404 });
        }

        if (transaction.status === "success") {
            return Response.json({ error: "Transaction already approved" }, { status: 400 });
        }

        // Update transaction status
        await db
            .update(transactions)
            .set({
                status: "success",
                updatedAt: new Date(),
            })
            .where(eq(transactions.id, transactionId));

        // Add credits to user
        await db
            .update(users)
            .set({
                credits: sql`${users.credits} + ${transaction.credits}`,
                updatedAt: new Date(),
            })
            .where(eq(users.id, transaction.userId));

        return Response.json({ success: true });
    } catch (error) {
        console.error("Approve error:", error);
        return Response.json({ error: "Failed to approve" }, { status: 500 });
    }
}
