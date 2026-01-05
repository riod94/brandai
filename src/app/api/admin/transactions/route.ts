import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users, transactions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

async function isAdmin() {
    const session = await auth();
    if (!session?.user?.id) return false;

    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
        columns: { role: true },
    });

    return user?.role === "admin";
}

export async function GET() {
    if (!(await isAdmin())) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const allTransactions = await db.query.transactions.findMany({
            orderBy: [desc(transactions.createdAt)],
            with: {
                user: {
                    columns: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return Response.json({ transactions: allTransactions });
    } catch (error) {
        console.error("Get transactions error:", error);
        return Response.json({ error: "Failed to get transactions" }, { status: 500 });
    }
}
