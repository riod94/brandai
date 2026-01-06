"use client";

import * as v from "valibot";
import { useContext, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FormLogoContext } from "./FormLogoContext";
import { ArrowRight, Palette, ChevronDown } from "lucide-react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

interface Brand {
	id: string;
	name: string;
	primaryColor: string | null;
	secondaryColor: string | null;
	accentColor: string | null;
}

const formSchema = v.object({
	name: v.pipe(
		v.string("Name is required"),
		v.minLength(3, "Name must be at least 3 characters")
	),
	slogan: v.optional(v.string()),
});

type FormSchemaType = v.InferInput<typeof formSchema>;

export default function FormLogoName() {
	const params = useSearchParams();
	const logoName = params.get("name") || params.get("logoName") || "";
	const logoSlogan = params.get("slogan") || "";
	const brandIdParam = params.get("brandId") || "";

	const formLogoCtx = useContext(FormLogoContext);
	const [brands, setBrands] = useState<Brand[]>([]);
	const [selectedBrandId, setSelectedBrandId] = useState<string>(brandIdParam);
	const [showBrandDropdown, setShowBrandDropdown] = useState(false);
	const [state, setState] = useState<FormSchemaType>({
		name: logoName || formLogoCtx.values.name,
		slogan: logoSlogan || formLogoCtx.values.slogan,
	});

	useEffect(() => {
		// Fetch user's brands
		fetch("/api/brands")
			.then((res) => res.json())
			.then((data) => {
				if (data.brands) {
					setBrands(data.brands);
					// If brandId in URL, auto-select and apply colors
					if (brandIdParam) {
						const brand = data.brands.find(
							(b: Brand) => b.id === brandIdParam
						);
						if (brand) {
							applyBrandColors(brand);
						}
					}
				}
			})
			.catch(console.error);
	}, [brandIdParam]);

	const applyBrandColors = (brand: Brand) => {
		const colors: string[] = [];
		if (brand.primaryColor) colors.push(brand.primaryColor);
		if (brand.secondaryColor) colors.push(brand.secondaryColor);
		if (brand.accentColor) colors.push(brand.accentColor);

		formLogoCtx.setState({
			values: {
				...formLogoCtx.values,
				colors: colors,
			},
		});
	};

	const handleBrandSelect = (brand: Brand) => {
		setSelectedBrandId(brand.id);
		applyBrandColors(brand);
		setShowBrandDropdown(false);
	};

	const selectedBrand = brands.find((b) => b.id === selectedBrandId);

	function handleOnSubmit() {
		formLogoCtx.setState({
			step: "colors",
			values: {
				...formLogoCtx.values,
				name: state.name,
				slogan: state.slogan,
			},
		});
	}

	return (
		<Card
			radius="lg"
			shadow="lg"
			className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-900"
		>
			<CardHeader className="flex flex-col items-center justify-center pt-8 pb-4">
				<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
					<Palette className="w-8 h-8 text-white" />
				</div>
				<h1 className="text-3xl font-bold text-center">Create Your Logo</h1>
				<p className="text-gray-500 mt-2 text-center">
					Step 1 of 3: Basic Information
				</p>
			</CardHeader>
			<CardBody className="p-6 pt-2">
				<Form onSubmit={handleOnSubmit}>
					{/* Brand Selector */}
					{brands.length > 0 && (
						<div className="mb-6">
							<label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
								Use Brand (Optional)
							</label>
							<div className="relative">
								<button
									type="button"
									onClick={() =>
										setShowBrandDropdown(!showBrandDropdown)
									}
									className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between hover:border-primary transition-colors"
								>
									{selectedBrand ? (
										<div className="flex items-center gap-3">
											<div className="flex gap-1">
												<div
													className="w-4 h-4 rounded-full"
													style={{
														backgroundColor:
															selectedBrand.primaryColor ||
															"#3B82F6",
													}}
												/>
												<div
													className="w-4 h-4 rounded-full"
													style={{
														backgroundColor:
															selectedBrand.secondaryColor ||
															"#60A5FA",
													}}
												/>
											</div>
											<span className="font-medium">
												{selectedBrand.name}
											</span>
										</div>
									) : (
										<span className="text-gray-500">
											Select a brand to use its colors
										</span>
									)}
									<ChevronDown className="w-4 h-4 text-gray-400" />
								</button>

								{showBrandDropdown && (
									<div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
										{brands.map((brand) => (
											<button
												key={brand.id}
												type="button"
												onClick={() => handleBrandSelect(brand)}
												className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
													selectedBrandId === brand.id
														? "bg-primary/10"
														: ""
												}`}
											>
												<div className="flex gap-1">
													<div
														className="w-4 h-4 rounded-full"
														style={{
															backgroundColor:
																brand.primaryColor || "#3B82F6",
														}}
													/>
													<div
														className="w-4 h-4 rounded-full"
														style={{
															backgroundColor:
																brand.secondaryColor ||
																"#60A5FA",
														}}
													/>
												</div>
												<span className="font-medium">
													{brand.name}
												</span>
											</button>
										))}
									</div>
								)}
							</div>
							{selectedBrand && (
								<p className="text-xs text-primary mt-2">
									✓ Brand colors will be pre-selected
								</p>
							)}
						</div>
					)}

					{/* Logo Name & Slogan */}
					<div className="space-y-4 mb-8">
						<div>
							<label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
								Logo Name *
							</label>
							<Input
								type="text"
								radius="lg"
								variant="bordered"
								size="lg"
								name="logoName"
								value={state.name}
								placeholder="e.g., Acme Corp"
								onChange={(e) =>
									setState({ ...state, name: e.target.value })
								}
							/>
						</div>
						<div>
							<label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
								Tagline / Slogan (Optional)
							</label>
							<Input
								type="text"
								radius="lg"
								variant="bordered"
								size="lg"
								name="logoSlogan"
								value={state.slogan || ""}
								placeholder="e.g., Building Tomorrow Today"
								onChange={(e) =>
									setState({ ...state, slogan: e.target.value })
								}
							/>
						</div>
					</div>

					<div className="flex justify-end w-full">
						<Button
							radius="full"
							color="primary"
							type="submit"
							size="lg"
							isDisabled={!state.name || state.name.length < 3}
							className="bg-gradient-to-r from-primary to-secondary font-semibold px-8"
							endContent={<ArrowRight className="w-5 h-5" />}
						>
							Continue
						</Button>
					</div>
				</Form>
			</CardBody>
		</Card>
	);
}
