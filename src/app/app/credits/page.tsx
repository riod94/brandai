"use client";
import { Suspense, useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Skeleton } from "@heroui/skeleton";
import { Spinner } from "@heroui/spinner";
import { useRouter } from "next/navigation";
import {
	Coins,
	Zap,
	Minus,
	Plus,
	CreditCard,
	Clock,
	CheckCircle,
	XCircle,
	Sparkles,
	Banknote,
	QrCode,
	Upload,
	ArrowRight,
	Copy,
	AlertCircle,
} from "lucide-react";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
} from "@heroui/modal";
import {
	Table,
	TableHeader,
	TableBody,
	TableColumn,
	TableRow,
	TableCell,
} from "@heroui/table"; // Chip import is problematic from here based on previous errors
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import ConfirmationModal from "@/components/Modals/ConfirmationModal";

interface PaymentMethod {
	id: string;
	name: string;
	type: "manual_bank" | "qris" | "gateway";
	accountNumber?: string;
	accountName?: string;
	instructions?: string;
	isActive?: boolean;
}

interface Transaction {
	id: string;
	orderId: string;
	amount: number;
	credits: number;
	status: string;
	type: string;
	createdAt: string;
	paymentMethodId?: string;
	paymentMethod?: PaymentMethod | null;
	snapToken?: string;
}

interface UserCredits {
	credits: number;
	plan: string;
}

interface PricingData {
	creditPrice: number;
	minCredits: number;
}

function CreditsContent() {
	const router = useRouter();
	const [userData, setUserData] = useState<UserCredits | null>(null);
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [pricing, setPricing] = useState<PricingData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [creditAmount, setCreditAmount] = useState(5);
	const [isPurchasing, setIsPurchasing] = useState(false);
	const [cancellingId, setCancellingId] = useState<string | null>(null);
	const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
	const [transactionToCancel, setTransactionToCancel] =
		useState<Transaction | null>(null);

	// Payment Methods State
	const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
	const [selectedMethodId, setSelectedMethodId] = useState<string>("");
	const [proofUrl, setProofUrl] = useState("");

	// Transaction State for Manual Payment Resume
	const [currentTransaction, setCurrentTransaction] = useState<{
		orderId: string;
		amount: number;
		paymentMethodId?: string;
	} | null>(null);
	const [manualStep, setManualStep] = useState<"instructions" | "proof">(
		"instructions"
	);

	// Modal State
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [paymentStatus, setPaymentStatus] = useState<
		"success" | "pending" | "error" | "manual_flow"
	>("success");

	useEffect(() => {
		fetchData();

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
		const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
		if (!clientKey) {
			console.error("Midtrans Client Key is missing!");
		}

		console.log(
			"Loading Midtrans Snap with key:",
			clientKey ? "Present" : "Missing"
		);

		const script = document.createElement("script");
		script.src =
			process.env.NODE_ENV === "production"
				? "https://app.midtrans.com/snap/snap.js"
				: "https://app.sandbox.midtrans.com/snap/snap.js";
		script.setAttribute("data-client-key", clientKey || "");
		script.async = true;
		document.body.appendChild(script);

		return () => {
			if (document.body.contains(script)) {
				document.body.removeChild(script);
			}
		};
	}, []);

	const fetchData = async () => {
		try {
			const [creditsRes, txRes, pricingRes] = await Promise.all([
				fetch("/api/user/credits"),
				fetch("/api/user/transactions"),
				fetch("/api/pricing"),
			]);
			const creditsData = await creditsRes.json();
			const txData = await txRes.json();
			const pricingData = await pricingRes.json();

			if (!creditsData.error) setUserData(creditsData);
			if (!txData.error) setTransactions(txData.transactions || []);
			if (pricingData) {
				setPricing(pricingData);
				setCreditAmount(pricingData.minCredits);
			}
		} catch (error) {
			console.error("Failed to fetch data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleBuyCredits = async () => {
		if (!pricing || creditAmount < pricing.minCredits) return;

		const selectedMethod = paymentMethods.find(
			(m) => m.id === selectedMethodId
		);
		if (!selectedMethod) {
			alert("Please select a payment method.");
			return;
		}

		setIsPurchasing(true);

		// MANUAL PAYMENT LOGIC
		if (
			selectedMethod.type === "manual_bank" ||
			selectedMethod.type === "qris"
		) {
			try {
				const res = await fetch("/api/payment/manual", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						type: "credit",
						credits: creditAmount,
						amount: creditAmount * pricing.creditPrice,
						paymentMethodId: selectedMethodId,
						// No proofUrl initially
					}),
				});
				const data = await res.json();
				if (res.ok) {
					setPaymentStatus("manual_flow"); // New status for UI flow
					setManualStep("instructions");
					setCurrentTransaction({
						orderId: data.orderId,
						amount: creditAmount * pricing.creditPrice,
						paymentMethodId: selectedMethodId,
					});
					// Clear proof url
					setProofUrl("");
					onOpen();
					fetchData(); // Update history even if pending
				} else {
					throw new Error(
						data.error || "Failed to initiate manual payment."
					);
				}
			} catch (error) {
				console.error("Failed manual payment init:", error);
				setPaymentStatus("error");
				onOpen();
			} finally {
				setIsPurchasing(false);
			}
			return;
		}

		// MIDTRANS GATEWAY LOGIC
		try {
			const res = await fetch("/api/payment/create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					type: "credit",
					credits: creditAmount,
					amount: creditAmount * pricing.creditPrice,
					paymentMethodId: selectedMethodId,
				}),
			});

			const data = await res.json();
			if (data.token && window.snap) {
				window.snap.pay(data.token, {
					onSuccess: () => {
						fetchData();
						setPaymentStatus("success");
						onOpen();
					},
					onPending: () => {
						setPaymentStatus("pending");
						onOpen();
						fetchData();
					},
					onError: () => {
						setPaymentStatus("error");
						onOpen();
					},
					onClose: () => {
						setIsPurchasing(false);
					},
				});
			} else {
				if (!window.snap) {
					alert(
						"Payment system (Snap) failed to load. Please check your connection or AdBlocker."
					);
				}
				setPaymentStatus("error");
				onOpen();
			}
		} catch (error) {
			console.error("Failed to create payment:", error);
			setPaymentStatus("error");
			onOpen();
		} finally {
			setIsPurchasing(false);
		}
	};

	const handleSubmitProof = async () => {
		if (!currentTransaction || !proofUrl) return;
		setIsPurchasing(true);
		try {
			const res = await fetch("/api/payment/confirm", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					orderId: currentTransaction.orderId,
					proofUrl: proofUrl,
				}),
			});
			const data = await res.json();
			if (res.ok) {
				setPaymentStatus("pending"); // Now strictly pending verification
				fetchData();
			} else {
				throw new Error(data.error || "Failed to submit proof.");
			}
		} catch (error) {
			console.error("Failed proof submission:", error);
			alert("Failed to submit proof. Please try again.");
			// Don't close modal, let them retry
		} finally {
			setIsPurchasing(false);
		}
	};

	// New Action Handler: Resume Payment
	const handleResumePayment = (tx: Transaction) => {
		// Checks for Snap Payment first (Gateway)
		if (tx.snapToken && window.snap) {
			window.snap.pay(tx.snapToken, {
				onSuccess: () => {
					fetchData();
					setPaymentStatus("success");
					onOpen();
				},
				onPending: () => {
					setPaymentStatus("pending");
					onOpen();
					fetchData();
				},
				onError: () => {
					setPaymentStatus("error");
					onOpen();
				},
			});
			return;
		}

		if (!tx.paymentMethod) return;

		// Setup state to resume manual flow
		setPaymentStatus("manual_flow");
		setManualStep("instructions");
		setCurrentTransaction({
			orderId: tx.orderId,
			amount: tx.amount,
			paymentMethodId: tx.paymentMethod.id,
		});

		// Need to make sure selectedMethodId matches so UI renders correct bank info
		setSelectedMethodId(tx.paymentMethod.id);

		setProofUrl("");
		onOpen();
	};

	// New Action Handler: Cancel Payment (Open Modal)
	const handleCancelPayment = (tx: Transaction) => {
		setTransactionToCancel(tx);
		setIsCancelModalOpen(true);
	};

	// Actual Cancel Logic
	const confirmCancelPayment = async () => {
		if (!transactionToCancel) return;
		setCancellingId(transactionToCancel.orderId);
		try {
			const res = await fetch("/api/payment/cancel", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ orderId: transactionToCancel.orderId }),
			});
			if (res.ok) {
				fetchData();
				setIsCancelModalOpen(false);
			} else {
				const data = await res.json();
				alert(data.error || "Failed to cancel transaction");
			}
		} catch (error) {
			console.error("Cancel failed:", error);
		} finally {
			setCancellingId(null);
			setTransactionToCancel(null);
		}
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
		}).format(price);
	};

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		// Could show toast here
	};

	// Quick buy options
	const quickBuyOptions = [5, 10, 20, 50];
	const selectedMethod = paymentMethods.find((m) => m.id === selectedMethodId);

	return (
		<div className="max-w-6xl mx-auto space-y-8">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
					Buy Credits
				</h1>
				<p className="text-gray-500 mt-1">
					Purchase credits to generate amazing AI logos
				</p>
			</div>

			{/* Current Balance Card */}
			<Card className="bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-orange-500/10 border border-amber-500/20 shadow-xl overflow-hidden">
				<CardBody className="p-8">
					<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
						<div className="flex items-center gap-6">
							<div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-xl">
								<Coins className="w-10 h-10 text-white" />
							</div>
							<div>
								<p className="text-sm text-gray-500 font-medium">
									Your Balance
								</p>
								<div className="text-5xl font-bold text-amber-600 dark:text-amber-400">
									{isLoading ? (
										<Skeleton className="h-12 w-32" />
									) : (
										<>
											{userData?.credits ?? 0}
											<span className="text-lg font-normal text-gray-500 ml-2">
												credits
											</span>
										</>
									)}
								</div>
							</div>
						</div>
						<div className="text-right">
							<p className="text-sm text-gray-500">1 credit = 1 logo</p>
							{pricing ? (
								<p className="text-2xl font-bold text-amber-600">
									{formatPrice(pricing.creditPrice)}/credit
								</p>
							) : (
								<Skeleton className="h-8 w-32" />
							)}
						</div>
					</div>
				</CardBody>
			</Card>

			{/* Buy Credits Section */}
			<Card className="border border-gray-200 dark:border-gray-800 shadow-xl">
				<CardHeader className="px-6 pt-6 pb-0">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
							<Zap className="w-5 h-5 text-white" />
						</div>
						<div>
							<h2 className="text-xl font-bold">Purchase Credits</h2>
							<p className="text-sm text-gray-500">
								Minimum {pricing?.minCredits ?? 5} credits
							</p>
						</div>
					</div>
				</CardHeader>
				<CardBody className="p-6 space-y-6">
					{/* Quick Select */}
					<div>
						<p className="text-sm text-gray-500 mb-3">Quick select:</p>
						<div className="flex flex-wrap gap-2">
							{quickBuyOptions.map((amount) => (
								<Button
									key={amount}
									variant={creditAmount === amount ? "solid" : "flat"}
									color={
										creditAmount === amount ? "primary" : "default"
									}
									radius="full"
									onPress={() => setCreditAmount(amount)}
								>
									{amount} credits
								</Button>
							))}
						</div>
					</div>

					{/* Credit Amount Selector */}
					<div className="flex items-center justify-center gap-4">
						<Button
							isIconOnly
							variant="flat"
							radius="full"
							size="lg"
							onPress={() =>
								setCreditAmount(
									Math.max(pricing?.minCredits ?? 5, creditAmount - 5)
								)
							}
							isDisabled={creditAmount <= (pricing?.minCredits ?? 5)}
						>
							<Minus className="w-5 h-5" />
						</Button>
						<div className="w-32 text-center">
							<Input
								type="number"
								value={creditAmount.toString()}
								onChange={(e) => {
									const val =
										parseInt(e.target.value) ||
										(pricing?.minCredits ?? 5);
									setCreditAmount(
										Math.max(pricing?.minCredits ?? 5, val)
									);
								}}
								classNames={{
									input: "text-center text-2xl font-bold",
								}}
								min={pricing?.minCredits ?? 5}
							/>
						</div>
						<Button
							isIconOnly
							variant="flat"
							radius="full"
							size="lg"
							onPress={() => setCreditAmount(creditAmount + 5)}
						>
							<Plus className="w-5 h-5" />
						</Button>
					</div>

					{/* Price Display */}
					<div className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10">
						<p className="text-sm text-gray-500 mb-2">Total Price</p>
						<div className="text-4xl font-bold text-primary">
							{pricing ? (
								formatPrice(creditAmount * pricing.creditPrice)
							) : (
								<Skeleton className="h-10 w-40 mx-auto" />
							)}
						</div>
						<p className="text-sm text-gray-500 mt-2">
							= {creditAmount} logo generations
						</p>
					</div>

					{/* PAYMENT METHODS SELECTION */}
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
											<p className="font-semibold">{method.name}</p>
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

					<Button
						color="primary"
						variant="shadow"
						size="lg"
						radius="full"
						className="w-full bg-gradient-to-r from-primary to-secondary"
						onPress={handleBuyCredits}
						isLoading={isPurchasing}
						isDisabled={!selectedMethodId || isLoading}
						startContent={<CreditCard className="w-5 h-5" />}
					>
						{isPurchasing
							? "Processing..."
							: selectedMethod?.type === "gateway"
							? `Pay with Midtrans`
							: `Proceed to Payment`}
					</Button>
				</CardBody>
			</Card>

			{/* Transaction History */}
			<Card className="border border-gray-200 dark:border-gray-800 shadow-xl">
				<CardHeader className="px-6 pt-6 pb-0">
					<h2 className="text-xl font-bold">Transaction History</h2>
				</CardHeader>
				<CardBody className="p-6 overflow-x-auto">
					<Table aria-label="Transaction history" removeWrapper>
						<TableHeader>
							<TableColumn>TRANSACTION ID</TableColumn>
							<TableColumn>DATE</TableColumn>
							<TableColumn>CREDITS</TableColumn>
							<TableColumn>AMOUNT</TableColumn>
							<TableColumn>PAYMENT</TableColumn>
							<TableColumn>STATUS</TableColumn>
							<TableColumn align="center">ACTION</TableColumn>
						</TableHeader>
						<TableBody emptyContent="No transactions found">
							{transactions.map((tx) => (
								<TableRow key={tx.id}>
									<TableCell className="font-mono text-xs">
										{tx.orderId || tx.id.slice(0, 8)}
									</TableCell>
									<TableCell>
										{new Date(tx.createdAt).toLocaleDateString(
											"id-ID",
											{
												day: "numeric",
												month: "short",
												year: "numeric",
												hour: "2-digit",
												minute: "2-digit",
											}
										)}
									</TableCell>
									<TableCell>{tx.credits} Credits</TableCell>
									<TableCell>{formatPrice(tx.amount)}</TableCell>
									<TableCell>
										{tx.paymentMethod ? (
											<div className="text-xs">
												<span className="font-semibold">
													{tx.paymentMethod.name}
												</span>
											</div>
										) : (
											<span className="text-gray-400 text-xs">
												-
											</span>
										)}
									</TableCell>
									<TableCell>
										<Chip
											size="sm"
											color={
												tx.status === "success"
													? "success"
													: tx.status === "pending_verification"
													? "primary"
													: tx.status === "cancelled"
													? "default"
													: tx.status === "pending"
													? "warning"
													: "danger"
											}
											variant="flat"
											className="capitalize"
										>
											{tx.status === "pending_verification"
												? "Verifying"
												: tx.status}
										</Chip>
									</TableCell>
									<TableCell>
										{tx.status === "pending" && (
											<div className="flex items-center gap-2 justify-end">
												{((tx.paymentMethod &&
													(tx.paymentMethod.type ===
														"manual_bank" ||
														tx.paymentMethod.type === "qris")) ||
													tx.snapToken) && (
													<Tooltip content="Resume Payment">
														<Button
															size="sm"
															color="primary"
															variant="flat"
															onPress={() =>
																handleResumePayment(tx)
															}
														>
															Pay
														</Button>
													</Tooltip>
												)}
												<Tooltip content="Cancel and Create New">
													<Button
														size="sm"
														color="danger"
														variant="light"
														isIconOnly
														isLoading={
															cancellingId === tx.orderId
														}
														onPress={() =>
															handleCancelPayment(tx)
														}
													>
														<XCircle className="w-4 h-4" />
													</Button>
												</Tooltip>
											</div>
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardBody>
			</Card>

			{/* Cancel Confirmation Modal */}
			<ConfirmationModal
				isOpen={isCancelModalOpen}
				onClose={() => setIsCancelModalOpen(false)}
				onConfirm={confirmCancelPayment}
				title="Cancel Transaction"
				description="Are you sure you want to cancel this transaction? You can create a new one afterwards."
				isLoading={!!cancellingId}
				color="danger"
				icon={<XCircle className="w-8 h-8 text-white" />}
				confirmText="Yes, Cancel"
				cancelText="No, Keep It"
			/>

			{/* Payment Result Modal */}
			<Modal
				isOpen={isOpen}
				onClose={() => {
					// Prevent closing if uploading
					if (!isPurchasing) onClose();
				}}
				isDismissable={!isPurchasing}
				size="lg" // Larger modal for manual instructions
			>
				<ModalContent>
					<ModalHeader>
						{paymentStatus === "manual_flow"
							? manualStep === "instructions"
								? "Payment Instructions"
								: "Submit Payment Proof"
							: "Payment Status"}
					</ModalHeader>
					<ModalBody className="text-center py-6">
						{/* MANUAL FLOW */}
						{paymentStatus === "manual_flow" &&
							manualStep === "instructions" &&
							selectedMethod && (
								<div className="space-y-6">
									<div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800">
										<p className="text-blue-800 dark:text-blue-200 mb-4">
											Please transfer the exact amount to:
										</p>
										<div className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-1">
											{currentTransaction
												? formatPrice(currentTransaction.amount)
												: "..."}
										</div>
										<p className="text-sm text-blue-600 dark:text-blue-300 mb-6">
											Order ID: {currentTransaction?.orderId}
										</p>

										<div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-left relative">
											<div className="flex justify-between items-start">
												<div>
													<p className="text-xs text-gray-500 uppercase tracking-wider">
														Bank Name
													</p>
													<p className="font-semibold text-lg">
														{selectedMethod.name}
													</p>
												</div>
												{selectedMethod.accountNumber && (
													<Button
														size="sm"
														isIconOnly
														variant="flat"
														onClick={() =>
															copyToClipboard(
																selectedMethod.accountNumber!
															)
														}
													>
														<Copy className="w-4 h-4" />
													</Button>
												)}
											</div>
											{selectedMethod.accountNumber && (
												<div className="mt-3">
													<p className="text-xs text-gray-500 uppercase tracking-wider">
														Account Number
													</p>
													<p className="font-mono text-xl font-bold tracking-widest">
														{selectedMethod.accountNumber}
													</p>
												</div>
											)}
											{selectedMethod.accountName && (
												<div className="mt-3">
													<p className="text-xs text-gray-500 uppercase tracking-wider">
														Account Name
													</p>
													<p className="font-medium">
														{selectedMethod.accountName}
													</p>
												</div>
											)}
											<div className="mt-4 pt-3 border-t dark:border-gray-700">
												<p className="text-xs text-gray-500">
													{selectedMethod.instructions}
												</p>
											</div>
										</div>
									</div>
									<div className="flex gap-3 justify-end">
										<Button variant="light" onClick={onClose}>
											I'll pay later
										</Button>
										<Button
											color="primary"
											endContent={<ArrowRight className="w-4 h-4" />}
											onClick={() => setManualStep("proof")}
										>
											I Have Paid
										</Button>
									</div>
								</div>
							)}

						{paymentStatus === "manual_flow" &&
							manualStep === "proof" && (
								<div className="space-y-6">
									<div className="text-left space-y-2">
										<label className="text-sm font-medium">
											Payment Proof URL
										</label>
										<Input
											placeholder="https://..."
											value={proofUrl}
											onChange={(e) => setProofUrl(e.target.value)}
											startContent={
												<Upload className="w-4 h-4 text-gray-400" />
											}
											description="Paste the link to your uploaded payment receipt"
										/>
									</div>
									<div className="flex gap-3 justify-end">
										<Button
											variant="light"
											onClick={() => setManualStep("instructions")}
										>
											Back
										</Button>
										<Button
											color="primary"
											isLoading={isPurchasing}
											onClick={handleSubmitProof}
											isDisabled={!proofUrl}
										>
											Submit Proof
										</Button>
									</div>
								</div>
							)}

						{/* SUCCESS / PENDING / ERROR */}
						{paymentStatus === "success" && (
							<div className="flex flex-col items-center gap-4">
								<CheckCircle className="w-16 h-16 text-success" />
								<h3 className="text-xl font-bold">
									Payment Successful!
								</h3>
								<p className="text-gray-500">
									Your credits have been added to your balance.
								</p>
							</div>
						)}
						{paymentStatus === "pending" && (
							<div className="flex flex-col items-center gap-4">
								<Clock className="w-16 h-16 text-warning" />
								<h3 className="text-xl font-bold">Payment Verifying</h3>
								<p className="text-gray-500">
									We have received your proof. Credits will be added
									once approved by admin.
								</p>
							</div>
						)}
						{paymentStatus === "error" && (
							<div className="flex flex-col items-center gap-4">
								<XCircle className="w-16 h-16 text-danger" />
								<h3 className="text-xl font-bold">Payment Failed</h3>
								<p className="text-gray-500">
									Something went wrong. Please try again.
								</p>
							</div>
						)}
					</ModalBody>

					{paymentStatus !== "manual_flow" && (
						<ModalFooter>
							<Button color="primary" onPress={onClose}>
								Close
							</Button>
						</ModalFooter>
					)}
				</ModalContent>
			</Modal>
		</div>
	);
}

declare global {
	interface Window {
		snap: any;
	}
}

export default function CreditsPage() {
	return (
		<Suspense
			fallback={
				<div className="flex items-center justify-center min-h-[50vh]">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
				</div>
			}
		>
			<CreditsContent />
		</Suspense>
	);
}
