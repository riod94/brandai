"use client";
import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import { Card, CardBody } from "@heroui/card";
import { useRouter } from "next/navigation";
import {
	Sparkles,
	ArrowRight,
	ArrowLeft,
	Palette,
	Type,
	Building2,
	Check,
} from "lucide-react";

const industries = [
	"Technology",
	"E-commerce",
	"Healthcare",
	"Education",
	"Finance",
	"Food & Beverage",
	"Fashion",
	"Real Estate",
	"Entertainment",
	"Travel",
	"Sports",
	"Other",
];

const colorPalettes = [
	{ name: "Professional", colors: ["#1E40AF", "#3B82F6", "#60A5FA"] },
	{ name: "Creative", colors: ["#7C3AED", "#A855F7", "#C084FC"] },
	{ name: "Nature", colors: ["#166534", "#22C55E", "#4ADE80"] },
	{ name: "Warm", colors: ["#EA580C", "#F97316", "#FB923C"] },
	{ name: "Elegant", colors: ["#1F2937", "#4B5563", "#9CA3AF"] },
	{ name: "Fresh", colors: ["#0891B2", "#22D3EE", "#67E8F9"] },
];

const fontPairs = [
	{ primary: "Inter", secondary: "Inter", style: "Modern & Clean" },
	{
		primary: "Playfair Display",
		secondary: "Lato",
		style: "Elegant & Classic",
	},
	{
		primary: "Poppins",
		secondary: "Open Sans",
		style: "Friendly & Approachable",
	},
	{ primary: "Montserrat", secondary: "Roboto", style: "Bold & Professional" },
	{ primary: "Outfit", secondary: "Work Sans", style: "Contemporary" },
];

export default function CreateBrandPage() {
	const router = useRouter();
	const [step, setStep] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		tagline: "",
		industry: "",
		description: "",
		primaryColor: "#3B82F6",
		secondaryColor: "#60A5FA",
		accentColor: "#1E40AF",
		primaryFont: "Inter",
		secondaryFont: "Inter",
	});

	const updateForm = (key: string, value: string) => {
		setFormData((prev) => ({ ...prev, [key]: value }));
	};

	const selectPalette = (palette: (typeof colorPalettes)[0]) => {
		setFormData((prev) => ({
			...prev,
			primaryColor: palette.colors[0],
			secondaryColor: palette.colors[1],
			accentColor: palette.colors[2],
		}));
	};

	const selectFonts = (pair: (typeof fontPairs)[0]) => {
		setFormData((prev) => ({
			...prev,
			primaryFont: pair.primary,
			secondaryFont: pair.secondary,
		}));
	};

	const handleSubmit = async () => {
		setIsLoading(true);
		try {
			const res = await fetch("/api/brands", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			if (res.ok) {
				router.push("/app?tab=brands");
			}
		} catch (error) {
			console.error("Error creating brand:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const canProceed = () => {
		if (step === 1) return formData.name.length > 0;
		if (step === 2) return formData.industry.length > 0;
		return true;
	};

	return (
		<div className="min-h-screen py-20 px-6">
			<div className="max-w-2xl mx-auto">
				{/* Header */}
				<div className="text-center mb-12">
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
						<Sparkles className="w-4 h-4" />
						Brand Kit Creator
					</div>
					<h1 className="text-3xl md:text-4xl font-bold mb-4">
						Create Your Brand Identity
					</h1>
					<p className="text-gray-500">Step {step} of 4</p>
				</div>

				{/* Progress Bar */}
				<div className="flex gap-2 mb-8">
					{[1, 2, 3, 4].map((s) => (
						<div
							key={s}
							className={`h-2 flex-1 rounded-full transition-colors ${
								s <= step
									? "bg-primary"
									: "bg-gray-200 dark:bg-gray-700"
							}`}
						/>
					))}
				</div>

				{/* Step 1: Basic Info */}
				{step === 1 && (
					<Card className="shadow-xl">
						<CardBody className="p-8">
							<div className="flex items-center gap-3 mb-6">
								<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
									<Building2 className="w-5 h-5 text-primary" />
								</div>
								<div>
									<h2 className="text-xl font-bold">Brand Basics</h2>
									<p className="text-sm text-gray-500">
										Tell us about your brand
									</p>
								</div>
							</div>
							<div className="space-y-4">
								<Input
									label="Brand Name"
									placeholder="e.g., BerandAI"
									value={formData.name}
									onChange={(e) => updateForm("name", e.target.value)}
									size="lg"
								/>
								<Input
									label="Tagline (optional)"
									placeholder="e.g., Create stunning logos with AI"
									value={formData.tagline}
									onChange={(e) =>
										updateForm("tagline", e.target.value)
									}
									size="lg"
								/>
								<Textarea
									label="Description (optional)"
									placeholder="Briefly describe what your brand does..."
									value={formData.description}
									onChange={(e) =>
										updateForm("description", e.target.value)
									}
									minRows={3}
								/>
							</div>
						</CardBody>
					</Card>
				)}

				{/* Step 2: Industry */}
				{step === 2 && (
					<Card className="shadow-xl">
						<CardBody className="p-8">
							<div className="flex items-center gap-3 mb-6">
								<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
									<Building2 className="w-5 h-5 text-primary" />
								</div>
								<div>
									<h2 className="text-xl font-bold">Industry</h2>
									<p className="text-sm text-gray-500">
										Select your industry
									</p>
								</div>
							</div>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
								{industries.map((industry) => (
									<button
										key={industry}
										onClick={() => updateForm("industry", industry)}
										className={`p-4 rounded-xl border-2 text-left transition-all ${
											formData.industry === industry
												? "border-primary bg-primary/5"
												: "border-gray-200 dark:border-gray-700 hover:border-primary/50"
										}`}
									>
										<span className="font-medium">{industry}</span>
									</button>
								))}
							</div>
						</CardBody>
					</Card>
				)}

				{/* Step 3: Colors */}
				{step === 3 && (
					<Card className="shadow-xl">
						<CardBody className="p-8">
							<div className="flex items-center gap-3 mb-6">
								<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
									<Palette className="w-5 h-5 text-primary" />
								</div>
								<div>
									<h2 className="text-xl font-bold">Color Palette</h2>
									<p className="text-sm text-gray-500">
										Choose your brand colors
									</p>
								</div>
							</div>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
								{colorPalettes.map((palette) => (
									<button
										key={palette.name}
										onClick={() => selectPalette(palette)}
										className={`p-4 rounded-xl border-2 transition-all ${
											formData.primaryColor === palette.colors[0]
												? "border-primary ring-2 ring-primary/20"
												: "border-gray-200 dark:border-gray-700 hover:border-primary/50"
										}`}
									>
										<div className="flex gap-1 mb-3">
											{palette.colors.map((color) => (
												<div
													key={color}
													className="w-8 h-8 rounded-lg"
													style={{ backgroundColor: color }}
												/>
											))}
										</div>
										<span className="text-sm font-medium">
											{palette.name}
										</span>
									</button>
								))}
							</div>

							{/* Custom Colors */}
							<div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
								<p className="text-sm text-gray-500 mb-4">
									Or customize your colors:
								</p>
								<div className="grid grid-cols-3 gap-4">
									<div>
										<label className="text-xs text-gray-500 block mb-1">
											Primary
										</label>
										<input
											type="color"
											value={formData.primaryColor}
											onChange={(e) =>
												updateForm("primaryColor", e.target.value)
											}
											className="w-full h-10 rounded-lg cursor-pointer"
										/>
									</div>
									<div>
										<label className="text-xs text-gray-500 block mb-1">
											Secondary
										</label>
										<input
											type="color"
											value={formData.secondaryColor}
											onChange={(e) =>
												updateForm("secondaryColor", e.target.value)
											}
											className="w-full h-10 rounded-lg cursor-pointer"
										/>
									</div>
									<div>
										<label className="text-xs text-gray-500 block mb-1">
											Accent
										</label>
										<input
											type="color"
											value={formData.accentColor}
											onChange={(e) =>
												updateForm("accentColor", e.target.value)
											}
											className="w-full h-10 rounded-lg cursor-pointer"
										/>
									</div>
								</div>
							</div>
						</CardBody>
					</Card>
				)}

				{/* Step 4: Fonts */}
				{step === 4 && (
					<Card className="shadow-xl">
						<CardBody className="p-8">
							<div className="flex items-center gap-3 mb-6">
								<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
									<Type className="w-5 h-5 text-primary" />
								</div>
								<div>
									<h2 className="text-xl font-bold">Typography</h2>
									<p className="text-sm text-gray-500">
										Choose your font pairing
									</p>
								</div>
							</div>
							<div className="space-y-3">
								{fontPairs.map((pair) => (
									<button
										key={pair.primary}
										onClick={() => selectFonts(pair)}
										className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${
											formData.primaryFont === pair.primary
												? "border-primary bg-primary/5"
												: "border-gray-200 dark:border-gray-700 hover:border-primary/50"
										}`}
									>
										<div>
											<p
												className="font-bold text-lg"
												style={{ fontFamily: pair.primary }}
											>
												{pair.primary}
											</p>
											<p className="text-sm text-gray-500">
												{pair.style}
											</p>
										</div>
										{formData.primaryFont === pair.primary && (
											<Check className="w-5 h-5 text-primary" />
										)}
									</button>
								))}
							</div>
						</CardBody>
					</Card>
				)}

				{/* Navigation Buttons */}
				<div className="flex justify-between mt-8">
					<Button
						variant="flat"
						size="lg"
						radius="full"
						startContent={<ArrowLeft className="w-4 h-4" />}
						onPress={() =>
							step > 1 ? setStep(step - 1) : router.replace("/")
						}
					>
						{step > 1 ? "Back" : "Cancel"}
					</Button>

					{step < 4 ? (
						<Button
							color="primary"
							size="lg"
							radius="full"
							endContent={<ArrowRight className="w-4 h-4" />}
							onPress={() => setStep(step + 1)}
							isDisabled={!canProceed()}
						>
							Continue
						</Button>
					) : (
						<Button
							color="primary"
							size="lg"
							radius="full"
							className="bg-gradient-to-r from-primary to-secondary"
							endContent={<Sparkles className="w-4 h-4" />}
							onPress={handleSubmit}
							isLoading={isLoading}
						>
							Create Brand Kit
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
