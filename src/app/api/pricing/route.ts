import { db } from "@/db";

export async function GET() {
    try {
        const allSettings = await db.query.settings.findMany();

        const settingsMap: Record<string, string> = {};
        allSettings.forEach((s) => {
            settingsMap[s.key] = s.value;
        });

        return Response.json({
            creditPrice: parseInt(settingsMap.credit_price) || 2000,
            minCredits: parseInt(settingsMap.min_credits) || 5,
            freeCredits: parseInt(settingsMap.free_credits) || 5,
            monthlyPrice: parseInt(settingsMap.monthly_price) || 99000,
            yearlyPrice: parseInt(settingsMap.yearly_price) || 899000,
        });
    } catch (error) {
        console.error("Get pricing error:", error);
        return Response.json({
            creditPrice: 2000,
            minCredits: 5,
            monthlyPrice: 99000,
            yearlyPrice: 899000,
        });
    }
}
