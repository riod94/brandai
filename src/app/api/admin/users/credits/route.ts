import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users, transactions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (session?.user?.role !== "admin") {
            return Response.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { userId, credits, type, notes } = body;
        // type: 'add' | 'deduct'
        // credits: positive integer

        if (!userId || !credits || !type || credits <= 0) {
            return Response.json({ error: "Invalid data" }, { status: 400 });
        }

        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
        });

        if (!user) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }

        const adjustmentAmount = type === 'add' ? credits : -credits;

        // Prevent negative total credits? Optional, but good practice
        if (type === 'deduct' && user.credits < credits) {
            return Response.json({ error: "Insufficient user credits to deduct" }, { status: 400 });
        }

        // 1. Create Transaction Record
        const orderId = `ADMIN-ADJ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        await db.insert(transactions).values({
            userId,
            orderId,
            amount: 0, // No monetary value for manual adjustment usually
            credits: adjustmentAmount, // Can be negative in DB? Schema is integer. Yes.
            status: "success",
            type: "adjustment", // administrative adjustment
            plan: "admin_adjustment",
            notes: notes || `Admin adjusted credits: ${type} ${credits}`,
            paymentMethodId: null,
        });

        // 2. Update User Credits
        await db
            .update(users)
            .set({
                credits: sql`${users.credits} + ${adjustmentAmount}`,
                updatedAt: new Date(),
            })
            .where(eq(users.id, userId));

        return Response.json({ success: true, newCredits: user.credits + adjustmentAmount });

    } catch (error) {
        console.error("Credit Adjustment Error:", error);
        return Response.json(
            { error: "Failed to adjust credits" },
            { status: 500 }
        );
    }
}
