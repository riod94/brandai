"use client";
import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import { Card, CardBody } from "@heroui/card";
import { useRouter, useParams } from "next/navigation";
import {
	Sparkles,
	ArrowLeft,
	Palette,
	Type,
	Building2,
	Check,
	Save,
	Loader2,
} from "lucide-react";
import Link from "next/link";

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

export default function EditBrandPage() {
	const router = useRouter();
	const params = useParams();
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [formData, setFormData] = useState({
		id: "",
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

	useEffect(() => {
		if (params.id) {
			fetchBrand(params.id as string);
		}
	}, [params.id]);

	const fetchBrand = async (id: string) => {
		try {
			const res = await fetch("/api/brands");
			const data = await res.json();
			const brand = data.brands.find((b: any) => b.id === id);

			if (brand) {
				setFormData({
					id: brand.id,
					name: brand.name,
					tagline: brand.tagline || "",
					industry: brand.industry || "",
					description: brand.description || "",
					primaryColor: brand.primaryColor || "#3B82F6",
					secondaryColor: brand.secondaryColor || "#60A5FA",
					accentColor: brand.accentColor || "#1E40AF",
					primaryFont: brand.primaryFont || "Inter",
					secondaryFont: brand.secondaryFont || "Inter",
				});
				setIsLoading(false);
			} else {
				router.push("/app/brands");
			}
		} catch (error) {
			console.error("Failed to fetch brand:", error);
			router.push("/app/brands");
		}
	};

	const updateForm = (key: string, value: string) => {
		setFormData((prev) => ({ ...prev, [key]: value }));
	};

	const selectFonts = (pair: (typeof fontPairs)[0]) => {
		setFormData((prev) => ({
			...prev,
			primaryFont: pair.primary,
			secondaryFont: pair.secondary,
		}));
	};

	const handleSubmit = async () => {
		setIsSaving(true);
		try {
			const res = await fetch("/api/brands", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			if (res.ok) {
				router.push("/app/brands");
			}
		} catch (error) {
			console.error("Error updating brand:", error);
		} finally {
			setIsSaving(false);
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen py-20 flex items-center justify-center">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<div className="min-h-screen py-12 px-6 pb-20">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="flex items-center gap-4 mb-8">
					<Button
						as={Link}
						href="/app/brands"
						variant="flat"
						radius="full"
						startContent={<ArrowLeft className="w-4 h-4" />}
					>
						Back
					</Button>
					<div className="flex-1">
						<h1 className="text-2xl font-bold">Edit Brand</h1>
						<p className="text-gray-500">Update your brand identity</p>
					</div>
					<Button
						color="primary"
						radius="full"
						size="lg"
						className="bg-gradient-to-r from-primary to-secondary"
						startContent={!isSaving && <Save className="w-4 h-4" />}
						isLoading={isSaving}
						onPress={handleSubmit}
					>
						Save Changes
					</Button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{/* Left Column: Basic Info & Industry */}
					<div className="space-y-6">
						<Card className="shadow-lg">
							<CardBody className="p-6 text-sm">
								{" "}
								{/* Reduced padding and font size slightly if needed, keeping standard */}
								<div className="flex items-center gap-3 mb-6">
									<div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
										<Building2 className="w-4 h-4 text-primary" />
									</div>
									<h2 className="text-lg font-bold">Brand Details</h2>
								</div>
								<div className="space-y-4">
									<Input
										label="Brand Name"
										value={formData.name}
										onChange={(e) =>
											updateForm("name", e.target.value)
										}
										variant="bordered"
									/>
									<Input
										label="Tagline"
										value={formData.tagline}
										onChange={(e) =>
											updateForm("tagline", e.target.value)
										}
										variant="bordered"
									/>
									<Textarea
										label="Description"
										value={formData.description}
										onChange={(e) =>
											updateForm("description", e.target.value)
										}
										minRows={3}
										variant="bordered"
									/>
									<div>
										<label className="text-small font-medium text-foreground-500 mb-2 block">
											Industry
										</label>
										<select
											className="w-full h-10 px-3 rounded-xl bg-default-100 hover:bg-default-200 transition-colors text-small outline-none focus:ring-2 focus:ring-primary/50"
											value={formData.industry}
											onChange={(e) =>
												updateForm("industry", e.target.value)
											}
										>
											<option value="">Select industry...</option>
											{industries.map((ind) => (
												<option key={ind} value={ind}>
													{ind}
												</option>
											))}
										</select>
									</div>
								</div>
							</CardBody>
						</Card>
					</div>

					{/* Right Column: Colors & Fonts */}
					<div className="space-y-6">
						<Card className="shadow-lg">
							<CardBody className="p-6">
								<div className="flex items-center gap-3 mb-6">
									<div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
										<Palette className="w-4 h-4 text-primary" />
									</div>
									<h2 className="text-lg font-bold">Colors</h2>
								</div>
								<div className="grid grid-cols-3 gap-4">
									<div>
										<label className="text-xs text-gray-500 block mb-2">
											Primary
										</label>
										<div className="flex gap-2">
											<input
												type="color"
												value={formData.primaryColor}
												onChange={(e) =>
													updateForm(
														"primaryColor",
														e.target.value
													)
												}
												className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
											/>
											<Input
												value={formData.primaryColor}
												onChange={(e) =>
													updateForm(
														"primaryColor",
														e.target.value
													)
												}
												className="w-20"
												size="sm"
											/>
										</div>
									</div>
									<div>
										<label className="text-xs text-gray-500 block mb-2">
											Secondary
										</label>
										<div className="flex gap-2">
											<input
												type="color"
												value={formData.secondaryColor}
												onChange={(e) =>
													updateForm(
														"secondaryColor",
														e.target.value
													)
												}
												className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
											/>
											<Input
												value={formData.secondaryColor}
												onChange={(e) =>
													updateForm(
														"secondaryColor",
														e.target.value
													)
												}
												className="w-20"
												size="sm"
											/>
										</div>
									</div>
									<div>
										<label className="text-xs text-gray-500 block mb-2">
											Accent
										</label>
										<div className="flex gap-2">
											<input
												type="color"
												value={formData.accentColor}
												onChange={(e) =>
													updateForm("accentColor", e.target.value)
												}
												className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
											/>
											<Input
												value={formData.accentColor}
												onChange={(e) =>
													updateForm("accentColor", e.target.value)
												}
												className="w-20"
												size="sm"
											/>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>

						<Card className="shadow-lg">
							<CardBody className="p-6">
								<div className="flex items-center gap-3 mb-6">
									<div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
										<Type className="w-4 h-4 text-primary" />
									</div>
									<h2 className="text-lg font-bold">Typography</h2>
								</div>
								<div className="space-y-2 max-h-60 overflow-y-auto pr-2">
									{fontPairs.map((pair) => (
										<button
											key={pair.primary}
											onClick={() => selectFonts(pair)}
											className={`w-full p-3 rounded-xl border-2 text-left transition-all flex items-center justify-between ${
												formData.primaryFont === pair.primary
													? "border-primary bg-primary/5"
													: "border-gray-200 dark:border-gray-700 hover:border-primary/50"
											}`}
										>
											<div>
												<p
													className="font-bold text-base"
													style={{ fontFamily: pair.primary }}
												>
													{pair.primary}
												</p>
												<p className="text-xs text-gray-500">
													{pair.style}
												</p>
											</div>
											{formData.primaryFont === pair.primary && (
												<Check className="w-4 h-4 text-primary" />
											)}
										</button>
									))}
								</div>
							</CardBody>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
