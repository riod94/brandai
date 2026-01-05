"use client";
import { Suspense, useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Skeleton } from "@heroui/skeleton";
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
} from "lucide-react";

interface Transaction {
	id: string;
	orderId: string;
	amount: number;
	credits: number;
	status: string;
	type: string;
	createdAt: string;
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
	const [userData, setUserData] = useState<UserCredits | null>(null);
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [pricing, setPricing] = useState<PricingData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [creditAmount, setCreditAmount] = useState(5);
	const [isPurchasing, setIsPurchasing] = useState(false);

	useEffect(() => {
		fetchData();
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
		setIsPurchasing(true);

		try {
			const res = await fetch("/api/payment/create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					type: "credit",
					credits: creditAmount,
					amount: creditAmount * pricing.creditPrice,
				}),
			});

			const data = await res.json();
			if (data.token && window.snap) {
				window.snap.pay(data.token);
			}
		} catch (error) {
			console.error("Failed to create payment:", error);
		} finally {
			setIsPurchasing(false);
		}
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
		}).format(price);
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "success":
				return <CheckCircle className="w-4 h-4 text-emerald-500" />;
			case "pending":
				return <Clock className="w-4 h-4 text-amber-500" />;
			default:
				return <XCircle className="w-4 h-4 text-red-500" />;
		}
	};

	// Quick buy options
	const quickBuyOptions = [5, 10, 20, 50];

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

					<Button
						color="primary"
						variant="shadow"
						size="lg"
						radius="full"
						className="w-full bg-gradient-to-r from-primary to-secondary"
						onPress={handleBuyCredits}
						isLoading={isPurchasing}
						startContent={<CreditCard className="w-5 h-5" />}
					>
						Buy {creditAmount} Credits
					</Button>
				</CardBody>
			</Card>

			{/* Transaction History */}
			<Card className="border border-gray-200 dark:border-gray-800 shadow-xl">
				<CardHeader className="px-6 pt-6 pb-0">
					<h2 className="text-xl font-bold">Transaction History</h2>
				</CardHeader>
				<CardBody className="p-6">
					{isLoading ? (
						<div className="space-y-3">
							{[...Array(3)].map((_, i) => (
								<Skeleton key={i} className="h-16 rounded-xl" />
							))}
						</div>
					) : transactions.length === 0 ? (
						<div className="text-center py-8 text-gray-500">
							<Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
							<p>No transactions yet</p>
							<p className="text-sm mt-1">
								Your purchase history will appear here
							</p>
						</div>
					) : (
						<div className="space-y-3">
							{transactions.map((tx) => (
								<div
									key={tx.id}
									className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50"
								>
									<div className="flex items-center gap-4">
										{getStatusIcon(tx.status)}
										<div>
											<p className="font-medium">
												{tx.credits} Credits
											</p>
											<p className="text-sm text-gray-500">
												{new Date(tx.createdAt).toLocaleDateString(
													"en-US",
													{
														day: "numeric",
														month: "short",
														year: "numeric",
													}
												)}
											</p>
										</div>
									</div>
									<div className="text-right">
										<p className="font-semibold">
											{formatPrice(tx.amount)}
										</p>
										<p className="text-xs text-gray-500 capitalize">
											{tx.status}
										</p>
									</div>
								</div>
							))}
						</div>
					)}
				</CardBody>
			</Card>
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
