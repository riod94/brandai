"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { Input } from "@heroui/input";
import {
	CheckCircle,
	ArrowLeft,
	CreditCard,
	Banknote,
	QrCode,
	Upload,
} from "lucide-react";
import { PLANS, PlanType } from "@/lib/midtrans";
import { Link } from "@heroui/link";
import { RadioGroup, Radio } from "@heroui/radio";

declare global {
	interface Window {
		snap: any;
	}
}

interface PaymentMethod {
	id: string;
	name: string;
	type: "manual_bank" | "qris" | "gateway";
	accountNumber?: string;
	accountName?: string;
	instructions?: string;
}

export default function CheckoutPage() {
	const params = useParams();
	const router = useRouter();
	const planId = params.planId as PlanType;
	const plan = PLANS[planId];

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
	const [selectedMethodId, setSelectedMethodId] = useState<string>("");
	const [proofUrl, setProofUrl] = useState(""); // Temporary: URL input for MVP, consider File Upload later

	useEffect(() => {
		// Load Payment Methods
		fetch("/api/payment-methods")
			.then((res) => res.json())
			.then((data) => {
				if (data.paymentMethods && data.paymentMethods.length > 0) {
					setPaymentMethods(data.paymentMethods);
					setSelectedMethodId(data.paymentMethods[0].id);
				}
			})
			.catch(console.error);

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

		const selectedMethod = paymentMethods.find(
			(m) => m.id === selectedMethodId
		);

		if (!selectedMethod) {
			setError("Please select a payment method.");
			setIsLoading(false);
			return;
		}

		// LOGIC FOR MANUAL PAYMENT
		if (
			selectedMethod.type === "manual_bank" ||
			selectedMethod.type === "qris"
		) {
			if (!proofUrl) {
				setError(
					"Please provide a proof of payment (URL) for manual transfer verification."
				);
				setIsLoading(false);
				return;
			}
			try {
				const res = await fetch("/api/payment/manual", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						planId,
						paymentMethodId: selectedMethodId,
						proofUrl,
					}),
				});
				const data = await res.json();
				if (res.ok) {
					router.push("/app?payment=manual_pending");
				} else {
					throw new Error(
						data.error || "Failed to submit manual payment."
					);
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "An error occurred");
			} finally {
				setIsLoading(false);
			}
			return;
		}

		// LOGIC FOR AUTOMATED GATEWAY (MIDTRANS)
		try {
			const res = await fetch("/api/payment/create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ planId, paymentMethodId: selectedMethodId }),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Failed to create payment");
			}

			// Open Midtrans Snap popup
			if (window.snap) {
				window.snap.pay(data.token, {
					onSuccess: () => {
						router.push("/app?payment=success");
					},
					onPending: () => {
						router.push("/app?payment=pending");
					},
					onError: () => {
						setError("Payment failed. Please try again.");
						setIsLoading(false);
					},
					onClose: () => {
						setIsLoading(false);
					},
				});
			} else {
				setError("Payment gateway not loaded. Please refresh.");
				setIsLoading(false);
			}
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

	const selectedMethod = paymentMethods.find((m) => m.id === selectedMethodId);

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
					<CardBody className="p-6 space-y-8">
						{/* Plan Summary */}
						<div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
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

						{/* Payment Methods */}
						{paymentMethods.length > 0 ? (
							<div>
								<h3 className="text-lg font-semibold mb-3">
									Select Payment Method
								</h3>
								<div className="grid gap-3">
									{paymentMethods.map((method) => (
										<div
											key={method.id}
											onClick={() => setSelectedMethodId(method.id)}
											className={`cursor-pointer border-2 rounded-xl p-4 flex items-center gap-4 transition-all ${
												selectedMethodId === method.id
													? "border-primary bg-primary/5 ring-1 ring-primary"
													: "border-gray-200 dark:border-gray-700 hover:border-primary/50"
											}`}
										>
											<div
												className={`p-2 rounded-lg ${
													method.type === "gateway"
														? "bg-blue-100 text-blue-600"
														: method.type === "qris"
														? "bg-purple-100 text-purple-600"
														: "bg-green-100 text-green-600"
												}`}
											>
												{method.type === "gateway" ? (
													<CreditCard className="w-5 h-5" />
												) : method.type === "qris" ? (
													<QrCode className="w-5 h-5" />
												) : (
													<Banknote className="w-5 h-5" />
												)}
											</div>
											<div className="flex-1">
												<p className="font-semibold">
													{method.name}
												</p>
												{method.type === "manual_bank" && (
													<p className="text-xs text-gray-500">
														Manual Transfer
													</p>
												)}
											</div>
											<div
												className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
													selectedMethodId === method.id
														? "border-primary"
														: "border-gray-300"
												}`}
											>
												{selectedMethodId === method.id && (
													<div className="w-2.5 h-2.5 rounded-full bg-primary" />
												)}
											</div>
										</div>
									))}
								</div>
							</div>
						) : (
							<div className="text-center p-4 bg-gray-50 rounded-lg">
								<Spinner size="sm" /> Loading payment methods...
							</div>
						)}

						{/* Manual Payment Details */}
						{selectedMethod &&
							(selectedMethod.type === "manual_bank" ||
								selectedMethod.type === "qris") && (
								<div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 space-y-4">
									<div>
										<h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
											Payment Instructions
										</h4>
										<div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
											<p>
												Please transfer{" "}
												<strong>{formatPrice(plan.price)}</strong>{" "}
												to:
											</p>
											{selectedMethod.type === "manual_bank" && (
												<div className="bg-white dark:bg-gray-800 p-3 rounded-lg my-2 border border-blue-200 dark:border-blue-700">
													<p className="text-xs text-gray-500">
														Bank / Account
													</p>
													<p className="font-mono text-lg font-bold">
														{selectedMethod.accountNumber}
													</p>
													<p className="font-medium">
														{selectedMethod.accountName}
													</p>
												</div>
											)}
											<p className="text-xs mt-2 opacity-80">
												{selectedMethod.instructions}
											</p>
										</div>
									</div>

									<div className="space-y-2">
										<label className="text-sm font-medium">
											Payment Proof (URL)
										</label>
										<Input
											placeholder="https://imgur.com/..."
											value={proofUrl}
											onChange={(e) => setProofUrl(e.target.value)}
											startContent={
												<Upload className="w-4 h-4 text-gray-400" />
											}
											description="Paste the link to your screenshot/receipt"
										/>
										{/* <p className="text-xs text-gray-500">Future update: File upload support</p> */}
									</div>
								</div>
							)}

						{error && (
							<div className="bg-danger-50 text-danger-500 p-3 rounded-lg text-sm">
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
							isDisabled={isLoading || !selectedMethodId}
						>
							{isLoading ? (
								<Spinner color="white" size="sm" />
							) : selectedMethod?.type === "gateway" ? (
								`Pay with Midtrans`
							) : (
								`Submit Payment Proof`
							)}
						</Button>

						<p className="text-xs text-center text-gray-500 mt-4">
							By purchasing, you agree to our{" "}
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
