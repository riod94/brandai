import { auth } from "@/lib/auth";
import { db } from "@/db";
import { transactions, users, settings } from "@/db/schema";
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

        const body = await request.json();
        const { planId, type, credits, amount: customAmount } = body;

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

        let amount: number;
        let creditCount: number;
        let planName: string;

        // Handle credit purchase (custom amount)
        if (type === "credit" && credits) {
            // Fetch dynamic price from settings
            const priceSetting = await db.query.settings.findFirst({
                where: eq(settings.key, "credit_price"),
            });
            const PRICE_PER_CREDIT = priceSetting ? parseInt(priceSetting.value) : 2000;

            amount = credits * PRICE_PER_CREDIT;
            creditCount = credits;
            planName = `${credits} Credits`;
        }
        // Handle plan purchase
        else if (planId && ["basic", "pro"].includes(planId)) {
            const plan = PLANS[planId as PlanType];
            amount = plan.price;
            creditCount = plan.credits;
            planName = plan.name;
        }
        else {
            return Response.json(
                { error: "Invalid payment request" },
                { status: 400 }
            );
        }

        const orderId = `BERANDAI-${session.user.id.slice(0, 8)}-${Date.now()}`;

        // Create Midtrans transaction
        const midtransResponse = await createTransaction({
            orderId,
            amount,
            planName,
            customerEmail: user.email!,
            customerName: user.name || "Customer",
        });

        // Save transaction to database
        await db.insert(transactions).values({
            userId: session.user.id,
            orderId,
            amount,
            credits: creditCount,
            plan: planId || "credit",
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
            { error: "Failed to create payment", details: error instanceof Error ? error.message : "Unknown" },
            { status: 500 }
        );
    }
}
