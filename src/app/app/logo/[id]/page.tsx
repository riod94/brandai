"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Skeleton } from "@heroui/skeleton";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
} from "@heroui/modal";
import {
	Download,
	ArrowLeft,
	Trash2,
	Copy,
	Check,
	RotateCw,
	Loader2,
	Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ConfirmationModal from "@/components/Modals/ConfirmationModal";

interface Logo {
	id: string;
	name: string;
	slogan?: string;
	imageUrl: string;
	prompt: string;
	createdAt: string;
}

type PreviewBg = "checkered" | "white" | "dark" | "gradient";

export default function LogoDetailPage() {
	const params = useParams();
	const router = useRouter();
	const [logo, setLogo] = useState<Logo | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isRemovingBg, setIsRemovingBg] = useState(false);
	const [transparentUrl, setTransparentUrl] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);
	const [previewBg, setPreviewBg] = useState<PreviewBg>("checkered");
	const {
		isOpen: isDeleteOpen,
		onOpen: onDeleteOpen,
		onClose: onDeleteClose,
	} = useDisclosure();

	useEffect(() => {
		if (params.id) {
			fetch(`/api/logos/${params.id}`)
				.then((res) => res.json())
				.then((data) => {
					if (data.logo) {
						setLogo(data.logo);
					}
					setIsLoading(false);
				})
				.catch(() => setIsLoading(false));
		}
	}, [params.id]);

	const handleDownload = async (transparent: boolean = false) => {
		const url =
			transparent && transparentUrl ? transparentUrl : logo?.imageUrl;
		if (!url || !logo) return;

		try {
			if (transparent && transparentUrl) {
				const a = document.createElement("a");
				a.href = transparentUrl;
				a.download = `${logo.name
					.toLowerCase()
					.replace(/\s+/g, "-")}-transparent.png`;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
			} else {
				const response = await fetch(url);
				const blob = await response.blob();
				const blobUrl = window.URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = blobUrl;
				a.download = `${logo.name.toLowerCase().replace(/\s+/g, "-")}.png`;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				window.URL.revokeObjectURL(blobUrl);
			}
		} catch (error) {
			console.error("Download failed:", error);
		}
	};

	const handleRemoveBg = async () => {
		if (!logo || isRemovingBg) return;

		setIsRemovingBg(true);
		try {
			const res = await fetch("/api/remove-bg", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ imageUrl: logo.imageUrl }),
			});

			const data = await res.json();
			if (data.success && data.imageBase64) {
				setTransparentUrl(data.imageBase64);
			}
		} catch (error) {
			console.error("BG removal failed:", error);
		} finally {
			setIsRemovingBg(false);
		}
	};

	const handleDelete = async () => {
		if (!logo) return;

		setIsDeleting(true);
		try {
			const res = await fetch(`/api/logos?id=${logo.id}`, {
				method: "DELETE",
			});
			if (res.ok) {
				router.push("/app");
			}
		} catch (error) {
			console.error("Delete failed:", error);
		} finally {
			setIsDeleting(false);
		}
	};

	const copyToClipboard = () => {
		if (logo) {
			navigator.clipboard.writeText(logo.imageUrl);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const [isVectorizing, setIsVectorizing] = useState(false);

	const handleDownloadSvg = async () => {
		if (!logo || isVectorizing) return;

		setIsVectorizing(true);
		try {
			const res = await fetch("/api/vectorize", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ imageUrl: logo.imageUrl }),
			});

			const data = await res.json();
			if (data.svg) {
				const blob = new Blob([data.svg], { type: "image/svg+xml" });
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = `${logo.name.toLowerCase().replace(/\s+/g, "-")}.svg`;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				window.URL.revokeObjectURL(url);
			}
		} catch (error) {
			console.error("Vectorize failed:", error);
		} finally {
			setIsVectorizing(false);
		}
	};

	const getBgClass = () => {
		switch (previewBg) {
			case "white":
				return "bg-white";
			case "dark":
				return "bg-gray-900";
			case "gradient":
				return "bg-gradient-to-br from-primary via-purple-500 to-secondary";
			default:
				return "bg-[linear-gradient(45deg,#e5e5e5_25%,transparent_25%),linear-gradient(-45deg,#e5e5e5_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e5e5e5_75%),linear-gradient(-45deg,transparent_75%,#e5e5e5_75%)] bg-[size:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px] dark:bg-[linear-gradient(45deg,#333_25%,transparent_25%),linear-gradient(-45deg,#333_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#333_75%),linear-gradient(-45deg,transparent_75%,#333_75%)]";
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen py-20 px-6">
				<div className="max-w-4xl mx-auto">
					<Skeleton className="h-8 w-48 mb-8" />
					<Skeleton className="h-96 w-full rounded-2xl" />
				</div>
			</div>
		);
	}

	if (!logo) {
		return (
			<div className="min-h-screen py-20 px-6 flex items-center justify-center">
				<Card className="max-w-md">
					<CardBody className="p-8 text-center">
						<h2 className="text-2xl font-bold mb-4">Logo Not Found</h2>
						<p className="text-gray-500 mb-6">
							The logo you're looking for doesn't exist or has been
							deleted.
						</p>
						<Button as={Link} href="/app" color="primary" radius="full">
							Back to Dashboard
						</Button>
					</CardBody>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen pb-20 px-6 pt-8">
			<div className="max-w-5xl mx-auto">
				{/* Header */}
				<div className="flex items-center gap-4 mb-8">
					<Button
						as={Link}
						href="/app"
						variant="flat"
						radius="full"
						startContent={<ArrowLeft className="w-4 h-4" />}
					>
						Back
					</Button>
					<div className="flex-1">
						<h1 className="text-2xl font-bold">{logo.name}</h1>
						{logo.slogan && (
							<p className="text-gray-500">{logo.slogan}</p>
						)}
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Logo Preview */}
					<div className="lg:col-span-2">
						<Card className="shadow-xl overflow-hidden">
							<CardBody className="p-0">
								<div
									className={`relative aspect-square ${getBgClass()} transition-all duration-300`}
								>
									<Image
										src={transparentUrl || logo.imageUrl}
										alt={logo.name}
										fill
										unoptimized
										className="object-contain p-8"
									/>
								</div>
							</CardBody>
						</Card>

						{/* Background Preview Options */}
						<div className="mt-4">
							<p className="text-sm text-gray-500 mb-3">
								Preview background:
							</p>
							<div className="flex gap-2">
								<button
									onClick={() => setPreviewBg("checkered")}
									className={`w-10 h-10 rounded-lg bg-[linear-gradient(45deg,#e5e5e5_25%,#fff_25%,#fff_50%,#e5e5e5_50%,#e5e5e5_75%,#fff_75%)] bg-[size:8px_8px] border-2 transition-all ${
										previewBg === "checkered"
											? "border-primary ring-2 ring-primary/20 scale-110"
											: "border-gray-300 hover:border-gray-400"
									}`}
									title="Transparent"
								/>
								<button
									onClick={() => setPreviewBg("white")}
									className={`w-10 h-10 rounded-lg bg-white border-2 transition-all ${
										previewBg === "white"
											? "border-primary ring-2 ring-primary/20 scale-110"
											: "border-gray-300 hover:border-gray-400"
									}`}
									title="White"
								/>
								<button
									onClick={() => setPreviewBg("dark")}
									className={`w-10 h-10 rounded-lg bg-gray-900 border-2 transition-all ${
										previewBg === "dark"
											? "border-primary ring-2 ring-primary/20 scale-110"
											: "border-gray-600 hover:border-gray-500"
									}`}
									title="Dark"
								/>
								<button
									onClick={() => setPreviewBg("gradient")}
									className={`w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary border-2 transition-all ${
										previewBg === "gradient"
											? "border-white ring-2 ring-primary/20 scale-110"
											: "border-transparent hover:border-white/50"
									}`}
									title="Gradient"
								/>
							</div>
						</div>
					</div>

					{/* Actions Sidebar */}
					<div className="space-y-4">
						{/* Download */}
						<Card className="shadow-lg">
							<CardBody className="p-5 space-y-3">
								<Button
									className="w-full font-semibold"
									color="primary"
									size="lg"
									radius="lg"
									startContent={<Download className="w-5 h-5" />}
									onPress={() => handleDownload(false)}
								>
									Download PNG
								</Button>
								<Button
									className="w-full font-semibold"
									color="primary"
									size="lg"
									radius="lg"
									variant="ghost"
									startContent={
										isVectorizing ? (
											<Loader2 className="w-5 h-5 animate-spin" />
										) : (
											<Download className="w-5 h-5" />
										)
									}
									onPress={handleDownloadSvg}
									isDisabled={isVectorizing}
								>
									{isVectorizing ? "Vectorizing..." : "Download SVG"}
								</Button>
								{transparentUrl ? (
									<Button
										className="w-full font-semibold"
										color="secondary"
										size="lg"
										radius="lg"
										variant="bordered"
										startContent={<Sparkles className="w-5 h-5" />}
										onPress={() => handleDownload(true)}
									>
										Download Transparent
									</Button>
								) : (
									<Button
										className="w-full"
										variant="ghost"
										size="lg"
										radius="lg"
										startContent={
											isRemovingBg ? (
												<Loader2 className="w-5 h-5 animate-spin" />
											) : (
												<Sparkles className="w-5 h-5" />
											)
										}
										onPress={handleRemoveBg}
										isDisabled={isRemovingBg}
									>
										{isRemovingBg
											? "Removing Background..."
											: "Make Transparent"}
									</Button>
								)}
							</CardBody>
						</Card>

						{/* Quick Actions */}
						<Card className="shadow-lg">
							<CardBody className="p-5 space-y-3">
								<Button
									className="w-full justify-start"
									variant="flat"
									startContent={
										copied ? (
											<Check className="w-4 h-4 text-green-500" />
										) : (
											<Copy className="w-4 h-4" />
										)
									}
									onClick={copyToClipboard}
								>
									{copied ? "Copied!" : "Copy Image URL"}
								</Button>
								<Button
									as={Link}
									href={`/create/logo?name=${encodeURIComponent(
										logo.name
									)}&slogan=${encodeURIComponent(logo.slogan || "")}`}
									className="w-full justify-start"
									variant="flat"
									color="secondary"
									startContent={<RotateCw className="w-4 h-4" />}
								>
									Generate Variation
								</Button>
							</CardBody>
						</Card>

						{/* Danger Zone */}
						<Card className="shadow-lg border border-red-200 dark:border-red-900/50">
							<CardBody className="p-5">
								<Button
									className="w-full"
									variant="flat"
									color="danger"
									startContent={<Trash2 className="w-4 h-4" />}
									onClick={onDeleteOpen}
								>
									Delete Logo
								</Button>
							</CardBody>
						</Card>

						{/* Info */}
						<div className="text-center text-sm text-gray-500 py-2">
							Created on{" "}
							{new Date(logo.createdAt).toLocaleDateString("id-ID", {
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</div>
					</div>
				</div>
			</div>

			{/* Delete Confirmation Modal */}
			<ConfirmationModal
				isOpen={isDeleteOpen}
				onClose={onDeleteClose}
				onConfirm={handleDelete}
				title="Delete Logo?"
				description={`Are you sure you want to delete "${logo.name}"? This action cannot be undone.`}
				isLoading={isDeleting}
				color="danger"
				confirmText="Delete"
			/>
		</div>
	);
}
