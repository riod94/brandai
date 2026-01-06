"use client";
import { useState, useEffect } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Skeleton } from "@heroui/skeleton";
import { useDisclosure } from "@heroui/modal";
import { Input, Textarea } from "@heroui/input";
import {
	Plus,
	Palette,
	Type,
	Sparkles,
	Building2,
	Trash2,
	Edit,
	ImageIcon,
	AlertTriangle,
} from "lucide-react";
import ConfirmationModal from "@/components/Modals/ConfirmationModal";

interface Brand {
	id: string;
	name: string;
	tagline: string | null;
	industry: string | null;
	description: string | null;
	primaryColor: string | null;
	secondaryColor: string | null;
	accentColor: string | null;
	primaryFont: string | null;
	createdAt: string;
}

export default function BrandsPage() {
	const [brands, setBrands] = useState<Brand[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
	const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => {
		fetch("/api/brands")
			.then((res) => res.json())
			.then((data) => {
				if (data.brands) {
					setBrands(data.brands);
				}
				setIsLoading(false);
			})
			.catch((err) => {
				console.error("Failed to fetch brands:", err);
				setIsLoading(false);
			});
	}, []);

	const {
		isOpen: isDeleteOpen,
		onOpen: onDeleteOpen,
		onClose: onDeleteClose,
	} = useDisclosure();

	const openDeleteModal = (brand: Brand) => {
		setBrandToDelete(brand);
		onDeleteOpen();
	};

	const handleDelete = async () => {
		if (!brandToDelete) return;

		setIsDeleting(true);
		try {
			const res = await fetch(`/api/brands?id=${brandToDelete.id}`, {
				method: "DELETE",
			});
			if (res.ok) {
				setBrands(brands.filter((b) => b.id !== brandToDelete.id));
				onDeleteClose();
			}
		} catch (error) {
			console.error("Failed to delete brand:", error);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<div className="min-h-screen py-12 px-6">
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
					<div>
						<h1 className="text-3xl font-bold mb-2">My Brands</h1>
						<p className="text-gray-500">Manage your brand identities</p>
					</div>
					<Button
						as={Link}
						href="/create/brand"
						color="primary"
						size="lg"
						radius="full"
						className="bg-gradient-to-r from-primary to-secondary"
						startContent={<Plus className="w-5 h-5" />}
					>
						Create Brand
					</Button>
				</div>

				{/* Brands Grid */}
				{isLoading ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{[1, 2, 3].map((i) => (
							<Card key={i} className="shadow-lg">
								<CardBody className="p-6">
									<Skeleton className="h-6 w-32 mb-2" />
									<Skeleton className="h-4 w-48 mb-4" />
									<Skeleton className="h-8 w-full" />
								</CardBody>
							</Card>
						))}
					</div>
				) : brands.length === 0 ? (
					<Card className="shadow-xl">
						<CardBody className="p-12 text-center">
							<div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
								<Sparkles className="w-10 h-10 text-primary" />
							</div>
							<h2 className="text-2xl font-bold mb-2">No Brands Yet</h2>
							<p className="text-gray-500 mb-6">
								Create your first brand kit to get started
							</p>
							<Button
								as={Link}
								href="/create/brand"
								color="primary"
								size="lg"
								radius="full"
								className="bg-gradient-to-r from-primary to-secondary"
								startContent={<Plus className="w-5 h-5" />}
							>
								Create Your First Brand
							</Button>
						</CardBody>
					</Card>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{brands.map((brand) => (
							<Card
								key={brand.id}
								className="shadow-lg hover:shadow-xl transition-shadow"
							>
								<CardBody className="p-6">
									{/* Color Preview */}
									<div className="flex gap-2 mb-4">
										<div
											className="w-10 h-10 rounded-lg shadow-sm"
											style={{
												backgroundColor:
													brand.primaryColor || "#3B82F6",
											}}
										/>
										<div
											className="w-10 h-10 rounded-lg shadow-sm"
											style={{
												backgroundColor:
													brand.secondaryColor || "#60A5FA",
											}}
										/>
										<div
											className="w-10 h-10 rounded-lg shadow-sm"
											style={{
												backgroundColor:
													brand.accentColor || "#1E40AF",
											}}
										/>
									</div>

									{/* Brand Info */}
									<h3 className="text-xl font-bold mb-1">
										{brand.name}
									</h3>
									{brand.tagline && (
										<p className="text-gray-500 text-sm mb-3">
											{brand.tagline}
										</p>
									)}

									{/* Tags */}
									<div className="flex flex-wrap gap-2 mb-4">
										{brand.industry && (
											<span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs">
												<Building2 className="w-3 h-3" />
												{brand.industry}
											</span>
										)}
										{brand.primaryFont && (
											<span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs">
												<Type className="w-3 h-3" />
												{brand.primaryFont}
											</span>
										)}
									</div>

									{/* Actions */}
									<div className="flex gap-2">
										<Button
											as={Link}
											href={`/create/logo?brandId=${brand.id}`}
											variant="flat"
											color="primary"
											size="sm"
											radius="full"
											className="flex-1"
											startContent={
												<ImageIcon className="w-4 h-4" />
											}
										>
											Create Logo
										</Button>
										<Button
											as={Link}
											href={`/app/brands/${brand.id}/edit`}
											variant="flat"
											size="sm"
											radius="full"
											isIconOnly
										>
											<Edit className="w-4 h-4" />
										</Button>
										<Button
											variant="flat"
											color="danger"
											size="sm"
											radius="full"
											isIconOnly
											onClick={() => openDeleteModal(brand)}
										>
											<Trash2 className="w-4 h-4" />
										</Button>
									</div>
								</CardBody>
							</Card>
						))}
					</div>
				)}

				{/* Delete Confirmation Modal */}
				<ConfirmationModal
					isOpen={isDeleteOpen}
					onClose={onDeleteClose}
					onConfirm={handleDelete}
					title="Delete Brand?"
					description={`Are you sure you want to delete "${
						brandToDelete?.name || "Brand"
					}"? This will also unlink any associated logos and cannot be undone.`}
					isLoading={isDeleting}
					color="danger"
					confirmText="Delete"
				/>
			</div>
		</div>
	);
}
