"use client";
import { useState, useEffect, Suspense } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody } from "@heroui/card";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
} from "@heroui/modal";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
	Sparkles,
	ArrowRight,
	ArrowLeft,
	Palette,
	Type,
	ImageIcon,
	Check,
	AlertTriangle,
} from "lucide-react";

interface Brand {
	id: string;
	name: string;
	primaryColor: string | null;
	secondaryColor: string | null;
	accentColor: string | null;
}

const colorOptions = [
	{ name: "Blue", color: "#3B82F6" },
	{ name: "Purple", color: "#8B5CF6" },
	{ name: "Green", color: "#22C55E" },
	{ name: "Orange", color: "#F97316" },
	{ name: "Red", color: "#EF4444" },
	{ name: "Pink", color: "#EC4899" },
	{ name: "Teal", color: "#14B8A6" },
	{ name: "Yellow", color: "#EAB308" },
	{ name: "Gray", color: "#6B7280" },
];

const styleOptions = [
	{
		name: "Abstract",
		description: "Modern & artistic",
		image: "/images/styles/abstract.png",
	},
	{
		name: "Cartoon",
		description: "Fun & playful",
		image: "/images/styles/cartoon.png",
	},
	{
		name: "Classic",
		description: "Timeless design",
		image: "/images/styles/classic.png",
	},
	{
		name: "Corporate",
		description: "Professional",
		image: "/images/styles/corporate.png",
	},
	{
		name: "Emblem",
		description: "Badge style",
		image: "/images/styles/emblem.png",
	},
	{
		name: "Mascot",
		description: "Character based",
		image: "/images/styles/mascot.png",
	},
	{
		name: "Vintage",
		description: "Retro look",
		image: "/images/styles/vintage.png",
	},
	{
		name: "Wordmark",
		description: "Text focused",
		image: "/images/styles/wordmark.png",
	},
];

function CreateLogoContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const brandIdParam = searchParams.get("brandId") || "";
	const nameParam =
		searchParams.get("name") || searchParams.get("logoName") || "";
	const sloganParam = searchParams.get("slogan") || "";

	const [step, setStep] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [brands, setBrands] = useState<Brand[]>([]);
	const [errorMessage, setErrorMessage] = useState("");
	const {
		isOpen: isErrorOpen,
		onOpen: onErrorOpen,
		onClose: onErrorClose,
	} = useDisclosure();

	const [formData, setFormData] = useState({
		name: nameParam,
		slogan: sloganParam,
		brandId: brandIdParam,
		colors: [] as string[],
		styles: [] as string[],
	});

	// Has brand = skip color step (2 steps total), no brand = 3 steps
	const hasBrand = formData.brandId.length > 0;
	const totalSteps = hasBrand ? 2 : 3;

	useEffect(() => {
		fetch("/api/brands")
			.then((res) => res.json())
			.then((data) => {
				if (data.brands) {
					setBrands(data.brands);
					if (brandIdParam) {
						const brand = data.brands.find(
							(b: Brand) => b.id === brandIdParam
						);
						if (brand) {
							const colors: string[] = [];
							if (brand.primaryColor) colors.push(brand.primaryColor);
							if (brand.secondaryColor)
								colors.push(brand.secondaryColor);
							if (brand.accentColor) colors.push(brand.accentColor);
							setFormData((prev) => ({
								...prev,
								colors,
								brandId: brand.id,
							}));
						}
					}
				}
			})
			.catch(console.error);
	}, [brandIdParam]);

	const updateForm = (key: string, value: any) => {
		setFormData((prev) => ({ ...prev, [key]: value }));
	};

	const toggleColor = (color: string) => {
		if (formData.colors.includes(color)) {
			updateForm(
				"colors",
				formData.colors.filter((c) => c !== color)
			);
		} else if (formData.colors.length < 3) {
			updateForm("colors", [...formData.colors, color]);
		}
	};

	const toggleStyle = (style: string) => {
		if (formData.styles.includes(style)) {
			updateForm(
				"styles",
				formData.styles.filter((s) => s !== style)
			);
		} else if (formData.styles.length < 3) {
			updateForm("styles", [...formData.styles, style]);
		}
	};

	const selectBrand = (brand: Brand) => {
		const colors: string[] = [];
		if (brand.primaryColor) colors.push(brand.primaryColor);
		if (brand.secondaryColor) colors.push(brand.secondaryColor);
		if (brand.accentColor) colors.push(brand.accentColor);
		setFormData((prev) => ({ ...prev, colors, brandId: brand.id }));
	};

	const clearBrand = () => {
		setFormData((prev) => ({ ...prev, colors: [], brandId: "" }));
	};

	const handleGenerate = async () => {
		setIsLoading(true);
		try {
			const res = await fetch("/api/generate/logo", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			const data = await res.json();
			if (data.logoId) {
				router.push(`/app/logo/${data.logoId}`);
			} else if (data.error) {
				setErrorMessage(data.error);
				onErrorOpen();
			}
		} catch (error) {
			console.error("Error generating logo:", error);
			setErrorMessage("Failed to generate logo. Please try again.");
			onErrorOpen();
		} finally {
			setIsLoading(false);
		}
	};

	const canProceed = () => {
		if (step === 1) return formData.name.length >= 3;
		if (hasBrand) {
			// With brand: step 2 is styles
			if (step === 2) return formData.styles.length > 0;
		} else {
			// Without brand: step 2 is colors, step 3 is styles
			if (step === 2) return formData.colors.length > 0;
			if (step === 3) return formData.styles.length > 0;
		}
		return true;
	};

	const handleNext = () => {
		if (step === 1 && hasBrand) {
			setStep(2); // Skip to styles
		} else {
			setStep(step + 1);
		}
	};

	const handleBack = () => {
		if (step === 2 && hasBrand) {
			setStep(1); // Go back to name
		} else {
			setStep(step - 1);
		}
	};

	const selectedBrand = brands.find((b) => b.id === formData.brandId);
	const isLastStep = step === totalSteps;
	const showColorsStep = !hasBrand && step === 2;
	const showStylesStep = (hasBrand && step === 2) || (!hasBrand && step === 3);

	return (
		<div className="min-h-screen py-20 px-6">
			<div className="max-w-2xl mx-auto">
				{/* Header */}
				<div className="text-center mb-12">
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
						<Sparkles className="w-4 h-4" />
						AI Logo Generator
					</div>
					<h1 className="text-3xl md:text-4xl font-bold mb-4">
						Create Your Logo
					</h1>
					<p className="text-gray-500">
						Step {step} of {totalSteps}
					</p>
				</div>

				{/* Progress Bar */}
				<div className="flex gap-2 mb-8">
					{Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
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

				{/* Step 1: Name & Brand */}
				{step === 1 && (
					<Card className="shadow-xl">
						<CardBody className="p-8">
							<div className="flex items-center gap-3 mb-6">
								<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
									<ImageIcon className="w-5 h-5 text-primary" />
								</div>
								<div>
									<h2 className="text-xl font-bold">Basic Info</h2>
									<p className="text-sm text-gray-500">
										Enter your logo details
									</p>
								</div>
							</div>

							<div className="space-y-4">
								<Input
									label="Logo Name *"
									placeholder="e.g., Acme Corp"
									value={formData.name}
									onChange={(e) => updateForm("name", e.target.value)}
									size="lg"
								/>
								<Input
									label="Tagline (optional)"
									placeholder="e.g., Building Tomorrow Today"
									value={formData.slogan}
									onChange={(e) =>
										updateForm("slogan", e.target.value)
									}
									size="lg"
								/>

								{/* Brand Selector */}
								{brands.length > 0 && (
									<div className="pt-4 border-t border-gray-200 dark:border-gray-700">
										<div className="flex items-center justify-between mb-3">
											<p className="text-sm text-gray-500">
												Use Brand Colors:
											</p>
											{selectedBrand && (
												<button
													onClick={clearBrand}
													className="text-xs text-red-500 hover:text-red-600"
												>
													Clear selection
												</button>
											)}
										</div>
										<div className="grid grid-cols-2 gap-2">
											{brands.map((brand) => (
												<button
													key={brand.id}
													onClick={() => selectBrand(brand)}
													className={`p-3 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
														formData.brandId === brand.id
															? "border-primary bg-primary/5"
															: "border-gray-200 dark:border-gray-700 hover:border-primary/50"
													}`}
												>
													<div className="flex gap-1">
														<div
															className="w-5 h-5 rounded-full"
															style={{
																backgroundColor:
																	brand.primaryColor ||
																	"#3B82F6",
															}}
														/>
														<div
															className="w-5 h-5 rounded-full"
															style={{
																backgroundColor:
																	brand.secondaryColor ||
																	"#60A5FA",
															}}
														/>
													</div>
													<span className="font-medium text-sm truncate">
														{brand.name}
													</span>
												</button>
											))}
										</div>
										{selectedBrand && (
											<p className="text-xs text-primary mt-2">
												✓ Using {selectedBrand.name} colors — Color
												step will be skipped
											</p>
										)}
									</div>
								)}
							</div>
						</CardBody>
					</Card>
				)}

				{/* Step 2 (no brand): Colors */}
				{showColorsStep && (
					<Card className="shadow-xl">
						<CardBody className="p-8">
							<div className="flex items-center gap-3 mb-6">
								<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
									<Palette className="w-5 h-5 text-primary" />
								</div>
								<div>
									<h2 className="text-xl font-bold">Colors</h2>
									<p className="text-sm text-gray-500">
										Select up to 3 colors ({formData.colors.length}/3)
									</p>
								</div>
							</div>

							<div className="grid grid-cols-3 gap-3">
								{colorOptions.map((option) => (
									<button
										key={option.color}
										onClick={() => toggleColor(option.color)}
										className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
											formData.colors.includes(option.color)
												? "border-primary ring-2 ring-primary/20"
												: "border-gray-200 dark:border-gray-700 hover:border-primary/50"
										}`}
									>
										<div
											className="w-12 h-12 rounded-xl shadow-md"
											style={{ backgroundColor: option.color }}
										/>
										<span className="text-sm font-medium">
											{option.name}
										</span>
									</button>
								))}
							</div>

							{formData.colors.length > 0 && (
								<div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
									<p className="text-sm text-gray-500 mb-3">
										Selected colors:
									</p>
									<div className="flex gap-2">
										{formData.colors.map((color) => (
											<div
												key={color}
												className="w-10 h-10 rounded-lg shadow-md"
												style={{ backgroundColor: color }}
											/>
										))}
									</div>
								</div>
							)}
						</CardBody>
					</Card>
				)}

				{/* Styles Step */}
				{showStylesStep && (
					<Card className="shadow-xl">
						<CardBody className="p-8">
							<div className="flex items-center gap-3 mb-6">
								<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
									<Type className="w-5 h-5 text-primary" />
								</div>
								<div>
									<h2 className="text-xl font-bold">Style</h2>
									<p className="text-sm text-gray-500">
										Select up to 3 styles ({formData.styles.length}/3)
									</p>
								</div>
							</div>

							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								{styleOptions.map((option) => (
									<button
										key={option.name}
										onClick={() => toggleStyle(option.name)}
										className={`rounded-xl border-2 overflow-hidden transition-all ${
											formData.styles.includes(option.name)
												? "border-primary ring-2 ring-primary/20"
												: "border-gray-200 dark:border-gray-700 hover:border-primary/50"
										}`}
									>
										<div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
											<Image
												src={option.image}
												alt={option.name}
												fill
												className="object-cover"
											/>
											{formData.styles.includes(option.name) && (
												<div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
													<Check className="w-4 h-4 text-white" />
												</div>
											)}
										</div>
										<div className="p-3 text-center">
											<p className="font-bold text-sm">
												{option.name}
											</p>
											<p className="text-xs text-gray-500">
												{option.description}
											</p>
										</div>
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
							step > 1 ? handleBack() : router.replace("/")
						}
					>
						{step > 1 ? "Back" : "Cancel"}
					</Button>

					{!isLastStep ? (
						<Button
							color="primary"
							size="lg"
							radius="full"
							endContent={<ArrowRight className="w-4 h-4" />}
							onPress={handleNext}
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
							onPress={handleGenerate}
							isLoading={isLoading}
							isDisabled={!canProceed()}
						>
							Generate Logo (1 Credit)
						</Button>
					)}
				</div>
			</div>

			{/* Error Modal */}
			<Modal isOpen={isErrorOpen} onClose={onErrorClose}>
				<ModalContent>
					<ModalHeader className="flex items-center gap-2">
						<AlertTriangle className="w-5 h-5 text-danger" />
						Error
					</ModalHeader>
					<ModalBody>
						<p>{errorMessage}</p>
					</ModalBody>
					<ModalFooter>
						<Button color="primary" onPress={onErrorClose}>
							OK
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
}

export default function CreateLogoPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen flex items-center justify-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
				</div>
			}
		>
			<CreateLogoContent />
		</Suspense>
	);
}
