import { auth } from "@/lib/auth";
import { db } from "@/db";
import { transactions, users, paymentMethods } from "@/db/schema";
import { PLANS, PlanType } from "@/lib/midtrans";
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

        const body = await request.json();
        const { planId, paymentMethodId, proofUrl, type, credits: customCredits, amount: customAmount } = body;

        // Custom validation based on type
        if (!paymentMethodId) {
            return Response.json({ error: "Missing payment method" }, { status: 400 });
        }

        let amount: number;
        let creditCount: number;
        let planName: string = "credit";
        let finalPlanId: string = "credit";

        // Logic for Custom Credits
        if (type === "credit" && customCredits && customAmount) {
            amount = customAmount;
            creditCount = customCredits;
            finalPlanId = "credit";
            planName = `${customCredits} Credits`;
        }
        // Logic for Fixed Plans
        else if (planId) {
            const plan = PLANS[planId as PlanType];
            if (!plan) {
                return Response.json({ error: "Invalid plan" }, { status: 400 });
            }
            amount = plan.price;
            creditCount = plan.credits;
            finalPlanId = planId;
            planName = plan.name;
        } else {
            return Response.json({ error: "Invalid payment request" }, { status: 400 });
        }

        // Validate payment method
        const method = await db.query.paymentMethods.findFirst({
            where: eq(paymentMethods.id, paymentMethodId),
        });

        if (!method || !method.isActive) {
            return Response.json({ error: "Invalid or inactive payment method" }, { status: 400 });
        }

        const orderId = `MANUAL-${session.user.id.slice(0, 8)}-${Date.now()}`;

        // Create Transaction
        await db.insert(transactions).values({
            userId: session.user.id,
            orderId,
            amount: amount,
            credits: creditCount,
            plan: finalPlanId,
            status: "pending", // Initially pending, waiting for user to click "I Have Paid" -> "proof submitted"
            type: "credit",
            paymentMethodId,
            proofUrl: proofUrl || null, // Optional now
            notes: `Manual Payment via ${method.name}`,
        });

        return Response.json({
            success: true,
            orderId,
        });

    } catch (error) {
        console.error("Manual Payment Error:", error);
        return Response.json(
            { error: "Failed to submit payment" },
            { status: 500 }
        );
    }
}
