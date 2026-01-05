"use client";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Skeleton } from "@heroui/skeleton";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Check, Zap, Sparkles } from "lucide-react";

interface PricingData {
	creditPrice: number;
	minCredits: number;
	freeCredits: number;
}

function Pricing() {
	const { data: session } = useSession();
	const [pricing, setPricing] = useState<PricingData | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetch("/api/pricing")
			.then((res) => res.json())
			.then((data) => {
				setPricing(data);
				setIsLoading(false);
			})
			.catch(() => setIsLoading(false));
	}, []);

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("id-ID", {
			minimumFractionDigits: 0,
		}).format(price);
	};

	const getButtonHref = () => {
		if (!session) {
			return `/auth/sign-in?callbackUrl=/app/credits`;
		}
		return `/app/credits`;
	};

	const creditPacks = [
		{
			id: "starter",
			name: "Starter",
			credits: 5,
			popular: false,
			description: "Perfect for trying out",
		},
		{
			id: "pro",
			name: "Pro",
			credits: 15,
			popular: true,
			description: "Most popular choice",
			bonus: "+2 free",
		},
		{
			id: "business",
			name: "Business",
			credits: 50,
			popular: false,
			description: "Best value for teams",
			bonus: "+10 free",
		},
	];

	const features = [
		"AI-powered logo generation",
		"High-resolution downloads",
		"Commercial usage rights",
		"Multiple format exports (PNG, SVG)",
		"Unlimited revisions per credit",
		"No watermarks",
	];

	return (
		<section
			className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950"
			id="pricing"
		>
			<div className="container mx-auto px-6">
				<div className="text-center mb-16">
					<span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
						Simple Pricing
					</span>
					<h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
						Pay Only for What You Use
					</h2>
					<p className="text-lg text-gray-500 max-w-2xl mx-auto">
						No subscriptions. No hidden fees. Just buy credits and create
						amazing logos.
					</p>
				</div>

				{/* Welcome Bonus Banner */}
				<div className="max-w-2xl mx-auto mb-12">
					<div className="p-1 rounded-2xl bg-gradient-to-r from-primary to-secondary">
						<div className="bg-white dark:bg-gray-900 rounded-xl p-4 text-center">
							<p className="font-semibold text-lg flex items-center justify-center gap-2">
								<Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
								<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold">
									New User Special Offer
								</span>
								<Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
							</p>
							<p className="text-gray-600 dark:text-gray-400 mt-1">
								Sign up today and get{" "}
								<span className="font-bold text-primary">
									{pricing?.freeCredits ?? 5} FREE credits
								</span>{" "}
								to generate your first logos!
							</p>
						</div>
					</div>
				</div>

				{/* Credit Price Banner */}
				<div className="max-w-md mx-auto mb-12 text-center">
					<div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
						<Zap className="w-6 h-6 text-primary" />
						<div className="text-left">
							<p className="text-sm text-gray-500">Price per credit</p>
							{isLoading || !pricing ? (
								<Skeleton className="h-8 w-24" />
							) : (
								<p className="text-2xl font-bold text-primary">
									Rp{formatPrice(pricing.creditPrice)}
								</p>
							)}
						</div>
					</div>
					<p className="text-sm text-gray-500 mt-3">
						1 credit = 1 logo generation
					</p>
				</div>

				{/* Credit Packs */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
					{creditPacks.map((pack) => {
						const totalPrice = pricing
							? pack.credits * pricing.creditPrice
							: 0;

						return (
							<div
								key={pack.id}
								className={`relative rounded-3xl p-8 transition-all duration-300 hover:scale-105 ${
									pack.popular
										? "bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10 border-2 border-primary shadow-2xl shadow-primary/20"
										: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl"
								}`}
							>
								{pack.popular && (
									<div className="absolute -top-4 left-1/2 -translate-x-1/2">
										<span className="bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold px-4 py-1.5 rounded-full shadow-lg">
											Most Popular
										</span>
									</div>
								)}
								{pack.bonus && (
									<div className="absolute top-4 right-4">
										<span className="bg-emerald-500/10 text-emerald-600 text-xs font-semibold px-2 py-1 rounded-full">
											{pack.bonus}
										</span>
									</div>
								)}

								<div className="flex items-center gap-3 mb-4">
									<div
										className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
											pack.popular
												? "bg-gradient-to-br from-primary to-secondary"
												: "bg-gray-100 dark:bg-gray-700"
										}`}
									>
										<Sparkles
											className={`w-6 h-6 ${
												pack.popular ? "text-white" : "text-primary"
											}`}
										/>
									</div>
									<div>
										<h3 className="text-2xl font-bold">
											{pack.name}
										</h3>
										<p className="text-sm text-gray-500">
											{pack.description}
										</p>
									</div>
								</div>

								<div className="mb-6">
									<span className="text-5xl font-bold">
										{pack.credits}
									</span>
									<span className="text-gray-500 ml-2">credits</span>
								</div>

								<div className="mb-8">
									{isLoading || !pricing ? (
										<Skeleton className="h-10 w-32" />
									) : (
										<p className="text-3xl font-bold text-primary">
											Rp{formatPrice(totalPrice)}
										</p>
									)}
								</div>

								<Button
									as={Link}
									href={getButtonHref()}
									variant={pack.popular ? "shadow" : "bordered"}
									radius="full"
									size="lg"
									color="primary"
									className={`w-full font-semibold ${
										pack.popular
											? "bg-gradient-to-r from-primary to-secondary text-white"
											: ""
									}`}
								>
									Get {pack.credits} Credits
								</Button>
							</div>
						);
					})}
				</div>

				{/* Features */}
				<div className="max-w-3xl mx-auto">
					<h3 className="text-xl font-bold text-center mb-8">
						Every credit includes
					</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{features.map((feature) => (
							<div
								key={feature}
								className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50"
							>
								<div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
									<Check className="w-4 h-4 text-emerald-500" />
								</div>
								<span className="text-gray-700 dark:text-gray-300">
									{feature}
								</span>
							</div>
						))}
					</div>
				</div>

				<p className="text-center text-gray-500 mt-12">
					Secure payments powered by Midtrans
				</p>
			</div>
		</section>
	);
}

export default Pricing;
