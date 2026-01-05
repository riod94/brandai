import midtransClient from "midtrans-client";

const isProduction = process.env.NODE_ENV === "production";

// Snap API for frontend payment popup
export const snap = new midtransClient.Snap({
    isProduction,
    serverKey: process.env.MIDTRANS_SERVER_KEY!,
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
});

// Core API for backend operations
export const coreApi = new midtransClient.CoreApi({
    isProduction,
    serverKey: process.env.MIDTRANS_SERVER_KEY!,
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
});

export type PlanType = "free" | "basic" | "pro";

export const PLANS: Record<PlanType, {
    name: string;
    price: number;
    credits: number;
    features: string[];
}> = {
    free: {
        name: "Free",
        price: 0,
        credits: 1,
        features: [
            "1 Logo Design",
            "Basic File Formats",
            "2 Revisions",
            "24/7 Support",
        ],
    },
    basic: {
        name: "Basic",
        price: 49000, // IDR
        credits: 3,
        features: [
            "3 Logo Designs",
            "All File Formats",
            "5 Revisions",
            "Priority Support",
            "Brand Guidelines",
        ],
    },
    pro: {
        name: "Pro",
        price: 149000, // IDR
        credits: 10,
        features: [
            "10 Logo Designs",
            "All File Formats",
            "Unlimited Revisions",
            "Priority Support",
            "Brand Guidelines",
            "+Rp15.000 for 5 additional Logo Designs",
        ],
    },
};

export const createTransaction = async (params: {
    orderId: string;
    amount: number;
    planName: string;
    customerEmail: string;
    customerName: string;
}) => {
    const parameter = {
        transaction_details: {
            order_id: params.orderId,
            gross_amount: params.amount,
        },
        item_details: [
            {
                id: params.planName.toLowerCase(),
                price: params.amount,
                quantity: 1,
                name: `BerandAI ${params.planName} Plan`,
            },
        ],
        customer_details: {
            email: params.customerEmail,
            first_name: params.customerName,
        },
        callbacks: {
            finish: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
            error: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=error`,
            pending: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=pending`,
        },
    };

    const transaction = await snap.createTransaction(parameter);
    return transaction;
};

export const verifyNotification = async (notificationJson: any) => {
    // Midtrans notification verification using snap
    const orderId = notificationJson.order_id;
    const transactionStatus = notificationJson.transaction_status;
    const fraudStatus = notificationJson.fraud_status;

    return {
        order_id: orderId,
        transaction_status: transactionStatus,
        fraud_status: fraudStatus,
        transaction_id: notificationJson.transaction_id,
    };
};
