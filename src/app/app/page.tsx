"use client";
import { Suspense, useEffect, useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Skeleton } from "@heroui/skeleton";
import { Link } from "@heroui/link";
import {
	Download,
	Trash2,
	Plus,
	Coins,
	ImageIcon,
	Sparkles,
	Palette,
	ArrowRight,
	Eye,
	CheckCircle,
	Clock,
	XCircle,
} from "lucide-react";
import Image from "next/image";
import NextLink from "next/link";
import ConfirmationModal from "@/components/Modals/ConfirmationModal";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
} from "@heroui/modal";
import { useSearchParams, useRouter } from "next/navigation";

interface Logo {
	id: string;
	name: string;
	slogan?: string;
	imageUrl: string;
	createdAt: string;
}

interface UserData {
	logos: Logo[];
	credits: number;
	plan: string;
	hasUnlimited?: boolean;
}

function DashboardContent() {
	const [data, setData] = useState<UserData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const {
		isOpen: isDeleteOpen,
		onOpen: onDeleteOpen,
		onClose: onDeleteClose,
	} = useDisclosure();
	const [logoToDelete, setLogoToDelete] = useState<Logo | null>(null);

	// Payment Modal State
	const searchParams = useSearchParams();
	const router = useRouter();
	const {
		isOpen: isPaymentOpen,
		onOpen: onPaymentOpen,
		onClose: onPaymentClose,
	} = useDisclosure();
	const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

	useEffect(() => {
		const payment = searchParams.get("payment");
		if (payment) {
			setPaymentStatus(payment);
			onPaymentOpen();
			// Clean up URL after a delay or let user see it?
			// Better to keep logic simple for now.
			// router.replace("/app");
		}
	}, [searchParams]);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			const res = await fetch("/api/logos");
			const result = await res.json();
			if (res.ok) {
				setData(result);
			}
		} catch (error) {
			console.error("Failed to fetch data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const openDeleteModal = (logo: Logo, e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setLogoToDelete(logo);
		onDeleteOpen();
	};

	const handleDeleteConfirm = async () => {
		if (!logoToDelete) return;

		setDeletingId(logoToDelete.id);
		try {
			const res = await fetch(`/api/logos?id=${logoToDelete.id}`, {
				method: "DELETE",
			});
			if (res.ok && data) {
				setData({
					...data,
					logos: data.logos.filter((l) => l.id !== logoToDelete.id),
				});
				onDeleteClose();
			}
		} catch (error) {
			console.error("Failed to delete logo:", error);
		} finally {
			setDeletingId(null);
			setLogoToDelete(null);
		}
	};

	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<div className="bg-gradient-to-br from-primary/5 via-purple-500/5 to-secondary/5 border-b border-gray-200/50 dark:border-gray-800/50">
				<div className="max-w-6xl mx-auto px-6 py-12">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
						<div>
							<h1 className="text-4xl font-bold mb-2">
								Welcome back! 👋
							</h1>
							<p className="text-gray-500 text-lg">
								Create stunning logos for your brand
							</p>
						</div>
						<div className="flex gap-3">
							<Button
								as={Link}
								href="/create/brand"
								variant="bordered"
								size="lg"
								radius="full"
								startContent={<Palette className="w-5 h-5" />}
							>
								Create Brand
							</Button>
							<Button
								as={Link}
								href="/create/logo"
								color="primary"
								size="lg"
								radius="full"
								className="bg-gradient-to-r from-primary to-secondary font-semibold shadow-lg"
								startContent={<Sparkles className="w-5 h-5" />}
							>
								Create Logo
							</Button>
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-6xl mx-auto px-6 py-8 space-y-10">
				{/* Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-16">
					{/* Credits Card */}
					<Card className="shadow-xl bg-white dark:bg-gray-900 border-0">
						<CardBody className="p-6">
							<div className="flex items-start justify-between">
								<div>
									<p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
										Credits
									</p>
									<div className="text-5xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mt-2">
										{isLoading ? (
											<Skeleton className="h-12 w-24" />
										) : data?.hasUnlimited ? (
											"∞"
										) : (
											data?.credits ?? 0
										)}
									</div>
								</div>
								<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
									<Coins className="w-7 h-7 text-white" />
								</div>
							</div>
							<Button
								as={Link}
								href="/app/credits"
								size="sm"
								variant="flat"
								className="mt-4 w-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium"
								endContent={<ArrowRight className="w-4 h-4" />}
							>
								Buy Credits
							</Button>
						</CardBody>
					</Card>

					{/* Logos Card */}
					<Card className="shadow-xl bg-white dark:bg-gray-900 border-0">
						<CardBody className="p-6">
							<div className="flex items-start justify-between">
								<div>
									<p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
										Logos
									</p>
									<div className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent mt-2">
										{isLoading ? (
											<Skeleton className="h-12 w-24" />
										) : (
											data?.logos.length ?? 0
										)}
									</div>
								</div>
								<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
									<ImageIcon className="w-7 h-7 text-white" />
								</div>
							</div>
							<Button
								as={Link}
								href="/create/logo"
								size="sm"
								variant="flat"
								className="mt-4 w-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium"
								endContent={<ArrowRight className="w-4 h-4" />}
							>
								Create New
							</Button>
						</CardBody>
					</Card>

					{/* Brands Card */}
					<Card className="shadow-xl bg-white dark:bg-gray-900 border-0">
						<CardBody className="p-6">
							<div className="flex items-start justify-between">
								<div>
									<p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
										Brands
									</p>
									<div className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mt-2">
										{isLoading ? (
											<Skeleton className="h-12 w-24" />
										) : (
											"—"
										)}
									</div>
								</div>
								<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
									<Palette className="w-7 h-7 text-white" />
								</div>
							</div>
							<Button
								as={Link}
								href="/app/brands"
								size="sm"
								variant="flat"
								className="mt-4 w-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-medium"
								endContent={<ArrowRight className="w-4 h-4" />}
							>
								View Brands
							</Button>
						</CardBody>
					</Card>
				</div>

				{/* Recent Logos */}
				<div>
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-bold">Recent Logos</h2>
						{(data?.logos.length ?? 0) > 0 && (
							<span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
								{data?.logos.length} total
							</span>
						)}
					</div>

					{isLoading ? (
						<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
							{[...Array(5)].map((_, i) => (
								<div key={i} className="aspect-square">
									<Skeleton className="w-full h-full rounded-2xl" />
								</div>
							))}
						</div>
					) : data?.logos.length === 0 ? (
						<Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-dashed border-gray-300 dark:border-gray-700">
							<CardBody className="py-20 text-center">
								<div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
									<Sparkles className="w-12 h-12 text-primary" />
								</div>
								<h3 className="text-2xl font-semibold mb-2">
									No logos yet
								</h3>
								<p className="text-gray-500 mb-8 max-w-sm mx-auto">
									Create your first AI-powered logo and start building
									your brand identity
								</p>
								<Button
									as={Link}
									href="/create/logo"
									color="primary"
									size="lg"
									radius="full"
									className="bg-gradient-to-r from-primary to-secondary font-semibold"
									startContent={<Plus className="w-5 h-5" />}
								>
									Create Your First Logo
								</Button>
							</CardBody>
						</Card>
					) : (
						<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
							{data?.logos.map((logo) => (
								<NextLink key={logo.id} href={`/app/logo/${logo.id}`}>
									<div className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer">
										<Image
											src={logo.imageUrl}
											alt={logo.name}
											fill
											className="object-cover"
										/>
										{/* Overlay */}
										<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
											{/* Actions */}
											<div className="absolute top-3 right-3 flex gap-2">
												<Button
													isIconOnly
													size="sm"
													radius="full"
													variant="solid"
													className="bg-white/90 text-gray-900"
													onClick={(e) => {
														e.preventDefault();
														window.open(logo.imageUrl, "_blank");
													}}
												>
													<Download className="w-4 h-4" />
												</Button>
												<Button
													isIconOnly
													size="sm"
													radius="full"
													variant="solid"
													color="danger"
													onClick={(e) => openDeleteModal(logo, e)}
													isLoading={deletingId === logo.id}
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
											{/* Info */}
											<div className="absolute bottom-0 left-0 right-0 p-4">
												<h3 className="font-semibold text-white truncate">
													{logo.name}
												</h3>
												<p className="text-xs text-gray-300">
													{new Date(
														logo.createdAt
													).toLocaleDateString("id-ID", {
														day: "numeric",
														month: "short",
														year: "numeric",
													})}
												</p>
											</div>
										</div>
									</div>
								</NextLink>
							))}

							{/* Create More Card */}
							<NextLink href="/create/logo">
								<div className="aspect-square rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-colors flex flex-col items-center justify-center gap-3 cursor-pointer group">
									<div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
										<Plus className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
									</div>
									<span className="text-sm text-gray-500 group-hover:text-primary transition-colors font-medium">
										Create Logo
									</span>
								</div>
							</NextLink>
						</div>
					)}
				</div>
			</div>

			<ConfirmationModal
				isOpen={isDeleteOpen}
				onClose={onDeleteClose}
				onConfirm={handleDeleteConfirm}
				title="Delete Logo?"
				description={`Are you sure you want to delete "${
					logoToDelete?.name || "Logo"
				}"? This action cannot be undone.`}
				isLoading={deletingId === logoToDelete?.id}
				color="danger"
				confirmText="Delete"
			/>

			{/* Payment Status Modal */}
			<Modal isOpen={isPaymentOpen} onClose={onPaymentClose}>
				<ModalContent>
					<ModalHeader>Payment Status</ModalHeader>
					<ModalBody className="text-center py-6">
						{paymentStatus === "success" && (
							<div className="flex flex-col items-center gap-4">
								<CheckCircle className="w-16 h-16 text-success" />
								<h3 className="text-xl font-bold">
									Payment Successful!
								</h3>
								<p className="text-gray-500">
									Your purchase has been confirmed.
								</p>
							</div>
						)}
						{(paymentStatus === "pending" ||
							paymentStatus === "manual_pending") && (
							<div className="flex flex-col items-center gap-4">
								<Clock className="w-16 h-16 text-warning" />
								<h3 className="text-xl font-bold">Payment Pending</h3>
								<p className="text-gray-500">
									{paymentStatus === "manual_pending"
										? "Your manual payment is being reviewed."
										: "Waiting for payment confirmation."}
								</p>
							</div>
						)}
					</ModalBody>
					<ModalFooter>
						<Button
							color="primary"
							onPress={() => {
								onPaymentClose();
								router.replace("/app"); // Clean URL on close
							}}
						>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
}

export default function AppPage() {
	return (
		<Suspense
			fallback={
				<div className="flex items-center justify-center min-h-[50vh]">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
				</div>
			}
		>
			<DashboardContent />
		</Suspense>
	);
}
