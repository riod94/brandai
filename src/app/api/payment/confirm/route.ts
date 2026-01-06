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
        const { orderId, proofUrl } = body;

        if (!orderId || !proofUrl) {
            return Response.json(
                { error: "Missing required fields" },
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

        // Update transaction
        await db.update(transactions)
            .set({
                proofUrl: proofUrl,
                status: "pending_verification", // Update status to indicate proof is uploaded
                updatedAt: new Date(),
            })
            .where(eq(transactions.id, transaction.id));

        return Response.json({
            success: true,
            message: "Payment proof submitted successfully",
        });

    } catch (error) {
        console.error("Payment Confirmation Error:", error);
        return Response.json(
            { error: "Failed to submit proof" },
            { status: 500 }
        );
    }
}
