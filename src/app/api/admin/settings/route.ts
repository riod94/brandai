import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users, settings } from "@/db/schema";
import { eq } from "drizzle-orm";

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
        const allSettings = await db.query.settings.findMany();

        const settingsMap: Record<string, string> = {};
        allSettings.forEach((s) => {
            settingsMap[s.key] = s.value;
        });

        return Response.json({ settings: settingsMap });
    } catch (error) {
        console.error("Get settings error:", error);
        return Response.json({ error: "Failed to get settings" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    if (!(await isAdmin())) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const data = await request.json();

        // Upsert each setting
        for (const [key, value] of Object.entries(data)) {
            await db
                .insert(settings)
                .values({ key, value: String(value), updatedAt: new Date() })
                .onConflictDoUpdate({
                    target: settings.key,
                    set: { value: String(value), updatedAt: new Date() },
                });
        }

        return Response.json({ success: true });
    } catch (error) {
        console.error("Update settings error:", error);
        return Response.json({ error: "Failed to update settings" }, { status: 500 });
    }
}
