import { db } from "@/db";
import { paymentMethods } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
    try {
        const methods = await db.query.paymentMethods.findMany({
            where: eq(paymentMethods.isActive, true),
        });

        // Group by type for easier frontend consumption? Or just return list
        return Response.json({ paymentMethods: methods });
    } catch (error) {
        console.error("Failed to fetch payment methods:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
