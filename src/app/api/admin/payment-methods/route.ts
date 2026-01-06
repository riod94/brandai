import { auth } from "@/lib/auth";
import { db } from "@/db";
import { paymentMethods } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
    try {
        const session = await auth();
        console.log("Admin Payment API: Session:", JSON.stringify(session, null, 2));

        if (session?.user?.role !== "admin") {
            console.log("Admin Payment API: Unauthorized access attempt", session?.user);
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const methods = await db.query.paymentMethods.findMany({
            orderBy: (methods, { desc }) => [desc(methods.createdAt)],
        });

        return Response.json({ paymentMethods: methods });
    } catch (error) {
        console.error("Failed to fetch payment methods:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (session?.user?.role !== "admin") {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { name, type, accountNumber, accountName, isActive, instructions } = body;

        // Basic validation
        if (!name || !type) {
            return Response.json({ error: "Name and Type are required" }, { status: 400 });
        }

        const [newMethod] = await db.insert(paymentMethods).values({
            name,
            type,
            accountNumber,
            accountName,
            isActive: isActive ?? true,
            instructions,
        }).returning();

        return Response.json({ success: true, paymentMethod: newMethod });
    } catch (error) {
        console.error("Failed to create payment method:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
