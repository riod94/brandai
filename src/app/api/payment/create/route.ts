import { auth } from "@/lib/auth";
import { db } from "@/db";
import { transactions, users } from "@/db/schema";
import { createTransaction, PLANS, PlanType } from "@/lib/midtrans";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return Response.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { planId } = await request.json();

        if (!planId || !["basic", "pro"].includes(planId)) {
            return Response.json(
                { error: "Invalid plan" },
                { status: 400 }
            );
        }

        const plan = PLANS[planId as PlanType];
        const orderId = `BRANDAI-${session.user.id.slice(0, 8)}-${Date.now()}`;

        // Get user details
        const user = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
        });

        if (!user) {
            return Response.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Create Midtrans transaction
        const midtransResponse = await createTransaction({
            orderId,
            amount: plan.price,
            planName: plan.name,
            customerEmail: user.email!,
            customerName: user.name || "Customer",
        });

        // Save transaction to database
        await db.insert(transactions).values({
            userId: session.user.id,
            orderId,
            amount: plan.price,
            credits: plan.credits,
            plan: planId,
            status: "pending",
        });

        return Response.json({
            success: true,
            token: midtransResponse.token,
            redirectUrl: midtransResponse.redirect_url,
            orderId,
        });
    } catch (error) {
        console.error("Payment create error:", error);
        return Response.json(
            { error: "Failed to create payment" },
            { status: 500 }
        );
    }
}
