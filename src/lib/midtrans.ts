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
    // 1. Get server key (make sure to handle production/sandbox properly)
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) {
        throw new Error("Midtrans Server Key is missing in environment variables");
    }

    // 2. Extract necessary fields
    const {
        order_id,
        status_code,
        gross_amount,
        signature_key,
        transaction_status,
        fraud_status,
        transaction_id
    } = notificationJson;

    if (!signature_key || !order_id || !status_code || !gross_amount) {
        throw new Error("Invalid notification payload: missing signature fields");
    }

    // 3. Create SHA512 hash of order_id + status_code + gross_amount + ServerKey
    // Note: gross_amount usually comes as a string (e.g., "10000.00"), verify format if needed.
    // Midtrans requires the exact string value sent in the payload.
    const rawString = `${order_id}${status_code}${gross_amount}${serverKey}`;

    // We can use the crypto module from Node or Web Crypto API
    const crypto = await import("crypto");
    const expectedSignature = crypto
        .createHash("sha512")
        .update(rawString)
        .digest("hex");

    // 4. Compare
    if (signature_key !== expectedSignature) {
        throw new Error("Invalid Signature: Potential Webhook Spoofing Attempt");
    }

    return {
        order_id,
        transaction_status,
        fraud_status,
        transaction_id,
    };
};
