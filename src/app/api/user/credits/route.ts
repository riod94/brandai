import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users, subscriptions } from "@/db/schema";
import { eq, and, gte } from "drizzle-orm";

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
            columns: {
                credits: true,
                plan: true,
                role: true,
            },
        });

        if (!user) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }

        // Check for active subscription
        const activeSubscription = await db.query.subscriptions.findFirst({
            where: and(
                eq(subscriptions.userId, session.user.id),
                eq(subscriptions.status, "active"),
                gte(subscriptions.endDate, new Date())
            ),
        });

        const hasUnlimited = !!activeSubscription;
        const subscriptionPlan = activeSubscription?.plan || null;
        const subscriptionEndDate = activeSubscription?.endDate || null;

        return Response.json({
            credits: user.credits,
            plan: user.plan,
            role: user.role,
            hasUnlimited,
            subscriptionPlan,
            subscriptionEndDate,
        });
    } catch (error) {
        console.error("Get credits error:", error);
        return Response.json({ error: "Failed to get credits" }, { status: 500 });
    }
}
