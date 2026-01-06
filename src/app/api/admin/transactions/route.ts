import { auth } from "@/lib/auth";
import { db } from "@/db";
import { transactions, users, paymentMethods } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: Request) {
    try {
        const session = await auth();

        if (session?.user?.role !== "admin") {
            return Response.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const txs = await db.query.transactions.findMany({
            with: {
                user: true,
                // Include payment method if possible, but schema relations might be needed or just manual join/fetch if relation not defined
            },
            orderBy: (transactions, { desc }) => [desc(transactions.createdAt)],
        });

        // If relation 'paymentMethod' not defined in schema (it wasn't explicitly added), 
        // we might want to fetch associated method names or join.
        // For now, let's just return what we have. If we need method name, we can fetch all methods and map, or update schema relation.

        // Let's fetch all payment methods to map names efficiently
        const methods = await db.query.paymentMethods.findMany();
        const methodMap = new Map(methods.map(m => [m.id, m]));

        const enrichedTxs = txs.map(tx => ({
            ...tx,
            paymentMethodName: tx.paymentMethodId ? methodMap.get(tx.paymentMethodId)?.name : "Midtrans/Unknown",
            paymentMethodType: tx.paymentMethodId ? methodMap.get(tx.paymentMethodId)?.type : "gateway",
        }));

        return Response.json({ transactions: enrichedTxs });

    } catch (error) {
        console.error("Failed to fetch transactions:", error);
        return Response.json(
            { error: "Failed to fetch transactions" },
            { status: 500 }
        );
    }
}
