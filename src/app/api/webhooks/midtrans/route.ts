import { db } from "@/db";
import { transactions, users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { headers } from "next/headers";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { order_id, transaction_status, fraud_status } = body;

        console.log(`Midtrans Webhook: ${order_id} - ${transaction_status}`);

        if (!order_id) {
            return Response.json({ error: "Invalid payload" }, { status: 400 });
        }

        // Find transaction
        const transaction = await db.query.transactions.findFirst({
            where: eq(transactions.orderId, order_id),
        });

        if (!transaction) {
            return Response.json({ error: "Transaction not found" }, { status: 404 });
        }

        // Determine new status
        let newStatus = "pending";
        if (transaction_status === "capture") {
            if (fraud_status === "challenge") {
                newStatus = "challenge"; // TODO: Handle challenge
            } else if (fraud_status === "accept") {
                newStatus = "success";
            }
        } else if (transaction_status === "settlement") {
            newStatus = "success";
        } else if (
            transaction_status === "cancel" ||
            transaction_status === "deny" ||
            transaction_status === "expire"
        ) {
            newStatus = "failed";
        } else if (transaction_status === "pending") {
            newStatus = "pending";
        }

        // If status hasn't changed to success/failed, do nothing if already similar
        // But here we just update for sync

        // Update transaction status
        if (newStatus !== transaction.status) {
            await db
                .update(transactions)
                .set({
                    status: newStatus,
                    updatedAt: new Date(),
                    paymentId: body.transaction_id // Save midtrans transaction ID
                })
                .where(eq(transactions.orderId, order_id));

            // If success and was not previously success, add credits
            if (newStatus === "success" && transaction.status !== "success") {
                console.log(`Adding ${transaction.credits} credits to user ${transaction.userId}`);
                await db
                    .update(users)
                    .set({
                        credits: sql`${users.credits} + ${transaction.credits}`,
                        updatedAt: new Date(),
                    })
                    .where(eq(users.id, transaction.userId));
            }
        }

        return Response.json({ success: true });
    } catch (error) {
        console.error("Webhook Error:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
