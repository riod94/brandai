"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { PLANS, PlanType } from "@/lib/midtrans";
import { Link } from "@heroui/link";

declare global {
	interface Window {
		snap: any;
	}
}

export default function CheckoutPage() {
	const params = useParams();
	const router = useRouter();
	const planId = params.planId as PlanType;
	const plan = PLANS[planId];

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		// Load Midtrans Snap script
		const script = document.createElement("script");
		script.src =
			process.env.NODE_ENV === "production"
				? "https://app.midtrans.com/snap/snap.js"
				: "https://app.sandbox.midtrans.com/snap/snap.js";
		script.setAttribute(
			"data-client-key",
			process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ""
		);
		script.async = true;
		document.body.appendChild(script);

		return () => {
			document.body.removeChild(script);
		};
	}, []);

	if (!plan || planId === "free") {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Card className="max-w-md">
					<CardBody className="text-center p-8">
						<h2 className="text-xl font-bold mb-4">Invalid Plan</h2>
						<p className="text-gray-500 mb-4">
							The selected plan is not available for purchase.
						</p>
						<Button
							as={Link}
							href="/#pricing"
							color="primary"
							variant="shadow"
						>
							View Plans
						</Button>
					</CardBody>
				</Card>
			</div>
		);
	}

	const handleCheckout = async () => {
		setIsLoading(true);
		setError("");

		try {
			const res = await fetch("/api/payment/create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ planId }),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Failed to create payment");
			}

			// Open Midtrans Snap popup
			window.snap.pay(data.token, {
				onSuccess: () => {
					router.push("/dashboard?payment=success");
				},
				onPending: () => {
					router.push("/dashboard?payment=pending");
				},
				onError: () => {
					setError("Payment failed. Please try again.");
					setIsLoading(false);
				},
				onClose: () => {
					setIsLoading(false);
				},
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
			setIsLoading(false);
		}
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
		}).format(price);
	};

	return (
		<div className="min-h-screen py-20 px-6">
			<div className="max-w-2xl mx-auto">
				<Button
					as={Link}
					href="/#pricing"
					variant="light"
					startContent={<ArrowLeft className="w-4 h-4" />}
					className="mb-6"
				>
					Back to Plans
				</Button>

				<Card className="shadow-xl">
					<CardHeader className="flex flex-col gap-2 px-6 pt-6">
						<h1 className="text-2xl font-bold">Checkout</h1>
						<p className="text-gray-500">
							Complete your purchase to get started
						</p>
					</CardHeader>
					<CardBody className="p-6">
						{/* Plan Summary */}
						<div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-6">
							<div className="flex justify-between items-start mb-4">
								<div>
									<h2 className="text-xl font-bold text-primary">
										{plan.name} Plan
									</h2>
									<p className="text-gray-500">
										{plan.credits} logo credits
									</p>
								</div>
								<div className="text-right">
									<p className="text-2xl font-bold">
										{formatPrice(plan.price)}
									</p>
									<p className="text-sm text-gray-500">one-time</p>
								</div>
							</div>

							<div className="border-t dark:border-gray-700 pt-4">
								<h3 className="font-semibold mb-2">Includes:</h3>
								<ul className="space-y-2">
									{plan.features.map((feature) => (
										<li
											key={feature}
											className="flex items-center gap-2 text-sm"
										>
											<CheckCircle className="w-4 h-4 text-success" />
											{feature}
										</li>
									))}
								</ul>
							</div>
						</div>

						{error && (
							<div className="bg-danger-50 text-danger-500 p-3 rounded-lg text-sm mb-4">
								{error}
							</div>
						)}

						{/* Payment Button */}
						<Button
							color="primary"
							variant="shadow"
							size="lg"
							radius="full"
							className="w-full"
							onPress={handleCheckout}
							isDisabled={isLoading}
						>
							{isLoading ? (
								<Spinner color="white" size="sm" />
							) : (
								`Pay ${formatPrice(plan.price)}`
							)}
						</Button>

						<p className="text-xs text-center text-gray-500 mt-4">
							Secured by Midtrans. By purchasing, you agree to our{" "}
							<Link href="/legal/terms" className="underline">
								Terms of Service
							</Link>
							.
						</p>
					</CardBody>
				</Card>
			</div>
		</div>
	);
}
