import { db } from "@/db";
import { transactions, users } from "@/db/schema";
import { verifyNotification } from "@/lib/midtrans";
import { eq, sql } from "drizzle-orm";

export async function POST(request: Request) {
    try {
        const notificationJson = await request.json();

        console.log("Midtrans webhook received:", notificationJson);

        // Verify the notification
        const statusResponse = await verifyNotification(notificationJson);

        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;

        console.log(`Order ${orderId}: status=${transactionStatus}, fraud=${fraudStatus}`);

        // Find the transaction
        const transaction = await db.query.transactions.findFirst({
            where: eq(transactions.orderId, orderId),
        });

        if (!transaction) {
            console.error(`Transaction not found: ${orderId}`);
            return Response.json({ error: "Transaction not found" }, { status: 404 });
        }

        let newStatus = transaction.status;

        // Handle different transaction statuses
        if (transactionStatus === "capture") {
            if (fraudStatus === "accept") {
                newStatus = "success";
            } else if (fraudStatus === "challenge") {
                newStatus = "challenge";
            }
        } else if (transactionStatus === "settlement") {
            newStatus = "success";
        } else if (transactionStatus === "pending") {
            newStatus = "pending";
        } else if (["cancel", "deny", "expire"].includes(transactionStatus)) {
            newStatus = "failed";
        } else if (transactionStatus === "refund") {
            newStatus = "refunded";
        }

        // Update transaction status
        await db
            .update(transactions)
            .set({
                status: newStatus,
                paymentId: statusResponse.transaction_id,
                updatedAt: new Date(),
            })
            .where(eq(transactions.id, transaction.id));

        // If payment successful, add credits to user
        if (newStatus === "success" && transaction.status !== "success") {
            await db
                .update(users)
                .set({
                    credits: sql`${users.credits} + ${transaction.credits}`,
                    plan: transaction.plan,
                    updatedAt: new Date(),
                })
                .where(eq(users.id, transaction.userId));

            console.log(`Credits added to user ${transaction.userId}: +${transaction.credits}`);
        }

        return Response.json({ success: true });
    } catch (error) {
        console.error("Webhook error:", error);
        return Response.json({ error: "Webhook processing failed" }, { status: 500 });
    }
}

// Midtrans may also send GET request for verification
export async function GET() {
    return Response.json({ status: "ok" });
}
