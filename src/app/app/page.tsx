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
	TrendingUp,
	Crown,
} from "lucide-react";
import Image from "next/image";

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

	const handleDelete = async (logoId: string) => {
		if (!confirm("Are you sure you want to delete this logo?")) return;

		setDeletingId(logoId);
		try {
			const res = await fetch(`/api/logos?id=${logoId}`, {
				method: "DELETE",
			});
			if (res.ok && data) {
				setData({
					...data,
					logos: data.logos.filter((l) => l.id !== logoId),
				});
			}
		} catch (error) {
			console.error("Failed to delete logo:", error);
		} finally {
			setDeletingId(null);
		}
	};

	return (
		<div className="max-w-6xl mx-auto space-y-8">
			{/* Header */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
						Dashboard
					</h1>
					<p className="text-gray-500 mt-1">
						Manage your logos and track your credits
					</p>
				</div>
				<Button
					as={Link}
					href="/create/logo"
					color="primary"
					variant="shadow"
					size="lg"
					radius="full"
					startContent={<Sparkles className="w-5 h-5" />}
					className="bg-gradient-to-r from-primary to-secondary"
				>
					Create New Logo
				</Button>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Credits Card */}
				<Card className="bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-orange-500/10 border border-amber-500/20 shadow-xl">
					<CardBody className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-500 font-medium">
									Available Credits
								</p>
								<div className="text-4xl font-bold text-amber-600 dark:text-amber-400 mt-1">
									{isLoading ? (
										<Skeleton className="h-10 w-20" />
									) : data?.hasUnlimited ? (
										<span className="text-3xl">∞</span>
									) : (
										data?.credits ?? 0
									)}
								</div>
							</div>
							<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
								<Coins className="w-7 h-7 text-white" />
							</div>
						</div>
						<Button
							as={Link}
							href="/app/credits"
							size="sm"
							variant="flat"
							className="mt-4 w-full bg-amber-500/10 text-amber-600 dark:text-amber-400"
						>
							Buy More Credits
						</Button>
					</CardBody>
				</Card>

				{/* Logos Card */}
				<Card className="bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-purple-500/10 border border-blue-500/20 shadow-xl">
					<CardBody className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-500 font-medium">
									Total Logos
								</p>
								<div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-1">
									{isLoading ? (
										<Skeleton className="h-10 w-20" />
									) : (
										data?.logos.length ?? 0
									)}
								</div>
							</div>
							<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
								<ImageIcon className="w-7 h-7 text-white" />
							</div>
						</div>
						<div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
							<TrendingUp className="w-4 h-4 text-emerald-500" />
							<span>Create more logos today!</span>
						</div>
					</CardBody>
				</Card>
			</div>

			{/* Logo Gallery */}
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-bold">Your Logos</h2>
					<span className="text-sm text-gray-500">
						{data?.logos.length ?? 0} total
					</span>
				</div>

				{isLoading ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{[...Array(4)].map((_, i) => (
							<Skeleton key={i} className="aspect-square rounded-2xl" />
						))}
					</div>
				) : data?.logos.length === 0 ? (
					<Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-dashed border-gray-300 dark:border-gray-700">
						<CardBody className="py-16 text-center">
							<div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
								<ImageIcon className="w-10 h-10 text-gray-400" />
							</div>
							<h3 className="text-xl font-semibold mb-2">
								No logos yet
							</h3>
							<p className="text-gray-500 mb-6 max-w-sm mx-auto">
								Create your first AI-powered logo and start building
								your brand!
							</p>
							<Button
								as={Link}
								href="/create/logo"
								color="primary"
								variant="shadow"
								size="lg"
								radius="full"
								startContent={<Plus className="w-5 h-5" />}
							>
								Create Your First Logo
							</Button>
						</CardBody>
					</Card>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{data?.logos.map((logo) => (
							<Card
								key={logo.id}
								className="group overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
							>
								<div className="aspect-square relative overflow-hidden bg-gray-100 dark:bg-gray-800">
									<Image
										src={logo.imageUrl}
										alt={logo.name}
										fill
										className="object-cover transition-transform duration-300 group-hover:scale-110"
									/>
									{/* Hover Overlay */}
									<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6 gap-3">
										<Button
											as={Link}
											href={logo.imageUrl}
											target="_blank"
											isIconOnly
											radius="full"
											variant="solid"
											className="bg-white text-gray-900 hover:bg-gray-100"
										>
											<Download className="w-5 h-5" />
										</Button>
										<Button
											isIconOnly
											radius="full"
											variant="solid"
											color="danger"
											onPress={() => handleDelete(logo.id)}
											isLoading={deletingId === logo.id}
										>
											<Trash2 className="w-5 h-5" />
										</Button>
									</div>
								</div>
								<CardBody className="p-4">
									<h3 className="font-semibold truncate">
										{logo.name}
									</h3>
									<p className="text-xs text-gray-500 mt-1">
										{new Date(logo.createdAt).toLocaleDateString(
											"id-ID",
											{
												day: "numeric",
												month: "long",
												year: "numeric",
											}
										)}
									</p>
								</CardBody>
							</Card>
						))}
					</div>
				)}
			</div>
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
