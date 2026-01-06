"use client";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { useState } from "react";
import { Sparkles, ArrowRight, Zap, Shield, Palette } from "lucide-react";

export default function Hero() {
	const [company, setCompany] = useState("");

	const features = [
		{ icon: Zap, text: "Instant Generation" },
		{ icon: Shield, text: "Commercial Rights" },
		{ icon: Palette, text: "Unique Designs" },
	];

	return (
		<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
			{/* Animated Background */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
			<div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
			<div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />

			{/* Grid Pattern */}
			<div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

			<div className="container mx-auto px-6 relative z-10">
				<div className="flex flex-col items-center text-center max-w-4xl mx-auto">
					{/* Badge */}
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-8">
						<Sparkles className="w-4 h-4 text-primary" />
						<span className="text-sm font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
							AI-Powered Logo Generator
						</span>
					</div>

					{/* Headline */}
					<h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
						<span className="text-gray-900 dark:text-white">
							Create Your
						</span>
						<br />
						<span className="bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent">
							Perfect Logo
						</span>
						<br />
						<span className="text-gray-900 dark:text-white">
							in Seconds
						</span>
					</h1>

					{/* Subtitle */}
					<p className="text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl">
						Design professional logos for your brand with our AI-powered
						generator. No design skills needed. Just describe your vision.
					</p>

					{/* CTA Form */}
					<div className="w-full max-w-xl mb-8">
						<div className="flex flex-col sm:flex-row gap-3 p-2 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
							<Input
								name="logoName"
								type="text"
								radius="lg"
								variant="flat"
								size="lg"
								value={company}
								placeholder="Enter your brand name..."
								onChange={(e) => setCompany(e.target.value)}
								classNames={{
									input: "text-lg",
									inputWrapper:
										"bg-white dark:bg-gray-900 shadow-none",
								}}
							/>
							<Button
								variant="shadow"
								color="primary"
								radius="lg"
								size="lg"
								className="px-8 bg-gradient-to-r from-primary to-secondary font-semibold min-w-[180px]"
								as={Link}
								href={
									company
										? `/create/logo?logoName=${encodeURIComponent(
												company
										  )}`
										: "/create/logo"
								}
								endContent={<ArrowRight className="w-5 h-5" />}
							>
								Create Logo
							</Button>
						</div>
					</div>

					{/* Feature Pills */}
					<div className="flex flex-wrap justify-center gap-4 mb-12">
						{features.map((feature) => {
							const Icon = feature.icon;
							return (
								<div
									key={feature.text}
									className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
								>
									<Icon className="w-4 h-4 text-primary" />
									<span className="text-sm font-medium">
										{feature.text}
									</span>
								</div>
							);
						})}
					</div>

					{/* Social Proof */}
					<div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
						<div className="flex -space-x-2">
							{[1, 2, 3, 4, 5].map((i) => (
								<div
									key={i}
									className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-white dark:border-gray-900"
								/>
							))}
						</div>
						<p className="text-sm">
							<span className="font-semibold text-gray-900 dark:text-white">
								5,000+
							</span>{" "}
							logos created
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
