import { db } from "./index";
import { users, settings } from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
    console.log("🌱 Seeding database...");

    // Create admin user
    const adminEmail = "admin@brandai.com";
    const existingAdmin = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, adminEmail),
    });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash("admin123", 10);

        await db.insert(users).values({
            name: "Super Admin",
            email: adminEmail,
            password: hashedPassword,
            role: "admin",
            credits: 999,
            plan: "admin",
        });

        console.log("✅ Admin user created: admin@brandai.com / admin123");
    } else {
        console.log("ℹ️  Admin user already exists");
    }

    // Create default settings
    const defaultSettings = [
        { key: "credit_price", value: "2000" },
        { key: "min_credits", value: "5" },
        { key: "free_credits", value: "5" },
    ];

    for (const setting of defaultSettings) {
        await db
            .insert(settings)
            .values({ ...setting, updatedAt: new Date() })
            .onConflictDoNothing();
    }

    console.log("✅ Default settings created");
    console.log("🎉 Seeding complete!");
}

seed()
    .catch((e) => {
        console.error("❌ Seeding failed:", e);
        process.exit(1);
    })
    .finally(() => {
        process.exit(0);
    });
