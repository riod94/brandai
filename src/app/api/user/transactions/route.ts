import { auth } from "@/lib/auth";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userTransactions = await db.query.transactions.findMany({
            where: eq(transactions.userId, session.user.id),
            orderBy: [desc(transactions.createdAt)],
            limit: 20,
            with: {
                paymentMethod: true,
            },
        });

        return Response.json({ transactions: userTransactions });
    } catch (error) {
        console.error("Get transactions error:", error);
        return Response.json({ error: "Failed to get transactions" }, { status: 500 });
    }
}
