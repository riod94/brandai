"use client";
import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Skeleton } from "@heroui/skeleton";
import { Save, Coins, Gift, Info } from "lucide-react";

interface PricingSettings {
	creditPrice: number;
	minCredits: number;
	freeCredits: number;
}

export default function AdminPricingPage() {
	const [settings, setSettings] = useState<PricingSettings>({
		creditPrice: 2000,
		minCredits: 5,
		freeCredits: 5,
	});
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	useEffect(() => {
		fetchSettings();
	}, []);

	const fetchSettings = async () => {
		try {
			const res = await fetch("/api/admin/settings");
			const data = await res.json();
			if (!data.error && data.settings) {
				setSettings({
					creditPrice: parseInt(data.settings.credit_price) || 2000,
					minCredits: parseInt(data.settings.min_credits) || 5,
					freeCredits: parseInt(data.settings.free_credits) || 5,
				});
			}
		} catch (error) {
			console.error("Failed to fetch settings:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSave = async () => {
		setIsSaving(true);
		setMessage(null);

		try {
			const res = await fetch("/api/admin/settings", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					credit_price: settings.creditPrice.toString(),
					min_credits: settings.minCredits.toString(),
					free_credits: settings.freeCredits.toString(),
				}),
			});

			if (res.ok) {
				setMessage({
					type: "success",
					text: "Settings saved successfully!",
				});
			} else {
				throw new Error("Failed to save");
			}
		} catch (error) {
			setMessage({ type: "error", text: "Failed to save settings" });
		} finally {
			setIsSaving(false);
		}
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
		}).format(price);
	};

	if (isLoading) {
		return (
			<div className="max-w-3xl mx-auto space-y-6">
				<Skeleton className="h-10 w-48" />
				<Skeleton className="h-64 rounded-xl" />
			</div>
		);
	}

	return (
		<div className="max-w-3xl mx-auto space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
					Pricing Settings
				</h1>
				<p className="text-gray-500 mt-1">
					Configure credit pricing and promotional settings
				</p>
			</div>

			{/* Message */}
			{message && (
				<div
					className={`p-4 rounded-xl ${
						message.type === "success"
							? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
							: "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
					}`}
				>
					{message.text}
				</div>
			)}

			{/* Credit Pricing */}
			<Card className="border border-gray-200 dark:border-gray-700">
				<CardHeader className="px-6 pt-6 pb-0">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
							<Coins className="w-5 h-5 text-white" />
						</div>
						<div>
							<h2 className="text-xl font-bold">Credit Pricing</h2>
							<p className="text-sm text-gray-500">
								Set per-credit pricing for logo generation
							</p>
						</div>
					</div>
				</CardHeader>
				<CardBody className="p-6 space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Input
							label="Price per Credit (IDR)"
							type="number"
							value={settings.creditPrice.toString()}
							onChange={(e) =>
								setSettings({
									...settings,
									creditPrice: parseInt(e.target.value) || 0,
								})
							}
							startContent={
								<span className="text-gray-400 text-sm">Rp</span>
							}
							description="Price for 1 credit = 1 logo"
							variant="bordered"
							radius="lg"
						/>
						<Input
							label="Minimum Purchase"
							type="number"
							value={settings.minCredits.toString()}
							onChange={(e) =>
								setSettings({
									...settings,
									minCredits: parseInt(e.target.value) || 1,
								})
							}
							description={`Min: ${formatPrice(
								settings.creditPrice * settings.minCredits
							)}`}
							endContent={
								<span className="text-gray-400 text-sm">credits</span>
							}
							variant="bordered"
							radius="lg"
						/>
					</div>
				</CardBody>
			</Card>

			{/* Free Credits */}
			<Card className="border border-gray-200 dark:border-gray-700">
				<CardHeader className="px-6 pt-6 pb-0">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
							<Gift className="w-5 h-5 text-white" />
						</div>
						<div>
							<h2 className="text-xl font-bold">Welcome Bonus</h2>
							<p className="text-sm text-gray-500">
								Free credits for new users on registration
							</p>
						</div>
					</div>
				</CardHeader>
				<CardBody className="p-6 space-y-4">
					<Input
						label="Free Credits on Registration"
						type="number"
						value={settings.freeCredits.toString()}
						onChange={(e) =>
							setSettings({
								...settings,
								freeCredits: parseInt(e.target.value) || 0,
							})
						}
						description="Number of free credits given to new users"
						endContent={
							<span className="text-gray-400 text-sm">credits</span>
						}
						variant="bordered"
						radius="lg"
						className="max-w-xs"
					/>
					<div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm">
						<Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
						<span>
							New users will receive {settings.freeCredits} free credits
							when they sign up. This helps them try the service before
							purchasing.
						</span>
					</div>
				</CardBody>
			</Card>

			{/* Save Button */}
			<Button
				color="primary"
				variant="shadow"
				size="lg"
				radius="full"
				className="w-full"
				onPress={handleSave}
				isLoading={isSaving}
				startContent={<Save className="w-5 h-5" />}
			>
				Save Settings
			</Button>
		</div>
	);
}
