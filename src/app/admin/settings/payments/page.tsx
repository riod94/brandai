"use client";
import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Switch } from "@heroui/switch";
import {
	Plus,
	Trash2,
	Edit,
	CreditCard,
	QrCode,
	Banknote,
	Save,
	X,
} from "lucide-react";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
} from "@heroui/modal";

interface PaymentMethod {
	id: string;
	name: string;
	type: "manual_bank" | "qris" | "gateway";
	accountNumber?: string;
	accountName?: string;
	isActive: boolean;
	instructions?: string;
}

export default function PaymentSettingsPage() {
	const [methods, setMethods] = useState<PaymentMethod[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [editingId, setEditingId] = useState<string | null>(null);

	const [formData, setFormData] = useState<Partial<PaymentMethod>>({
		name: "",
		type: "manual_bank",
		isActive: true,
	});

	useEffect(() => {
		fetchMethods();
	}, []);

	const fetchMethods = async () => {
		try {
			const res = await fetch("/api/admin/payment-methods");
			const data = await res.json();
			if (data.paymentMethods) {
				setMethods(data.paymentMethods);
			}
		} catch (error) {
			console.error("Failed to fetch methods:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSave = async () => {
		const url = editingId
			? `/api/admin/payment-methods/${editingId}`
			: "/api/admin/payment-methods";
		const method = editingId ? "PATCH" : "POST";

		try {
			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			if (res.ok) {
				fetchMethods();
				onClose();
				resetForm();
			}
		} catch (error) {
			console.error("Failed to save:", error);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure?")) return;
		try {
			await fetch(`/api/admin/payment-methods/${id}`, { method: "DELETE" });
			fetchMethods();
		} catch (error) {
			console.error("Failed to delete:", error);
		}
	};

	const handleEdit = (method: PaymentMethod) => {
		setEditingId(method.id);
		setFormData(method);
		onOpen();
	};

	const resetForm = () => {
		setEditingId(null);
		setFormData({ name: "", type: "manual_bank", isActive: true });
	};

	const handleToggleActive = async (id: string, currentStatus: boolean) => {
		try {
			const res = await fetch(`/api/admin/payment-methods/${id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ isActive: !currentStatus }),
			});
			if (res.ok) fetchMethods();
		} catch (error) {
			console.error("Error toggling status:", error);
		}
	};

	return (
		<div className="max-w-5xl mx-auto space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold">Payment Methods</h1>
					<p className="text-gray-500">
						Manage payment options for checkout
					</p>
				</div>
				<Button
					color="primary"
					onPress={() => {
						resetForm();
						onOpen();
					}}
					startContent={<Plus className="w-4 h-4" />}
				>
					Add Method
				</Button>
			</div>

			<div className="grid gap-4">
				{methods.map((method) => (
					<Card
						key={method.id}
						className="border border-gray-200 dark:border-gray-800"
					>
						<CardBody className="flex flex-row items-center justify-between p-4">
							<div className="flex items-center gap-4">
								<div
									className={`p-3 rounded-xl ${
										method.type === "gateway"
											? "bg-blue-100 text-blue-600"
											: method.type === "qris"
											? "bg-purple-100 text-purple-600"
											: "bg-green-100 text-green-600"
									}`}
								>
									{method.type === "gateway" ? (
										<CreditCard className="w-6 h-6" />
									) : method.type === "qris" ? (
										<QrCode className="w-6 h-6" />
									) : (
										<Banknote className="w-6 h-6" />
									)}
								</div>
								<div>
									<div className="flex items-center gap-2">
										<h3 className="font-semibold text-lg">
											{method.name}
										</h3>
										{!method.isActive && (
											<span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
												Inactive
											</span>
										)}
									</div>
									<div className="text-sm text-gray-500">
										{method.type === "manual_bank" &&
											`${method.accountName} - ${method.accountNumber}`}
										{method.type === "gateway" &&
											"Automated Payment Gateway"}
										{method.type === "qris" && "Scan QR Code"}
									</div>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<Switch
									isSelected={method.isActive}
									color="primary"
									aria-label="Toggle active status"
									onValueChange={() =>
										handleToggleActive(method.id, method.isActive)
									}
								/>
								<Button
									isIconOnly
									variant="light"
									onPress={() => handleEdit(method)}
								>
									<Edit className="w-4 h-4" />
								</Button>
								<Button
									isIconOnly
									variant="light"
									color="danger"
									onPress={() => handleDelete(method.id)}
								>
									<Trash2 className="w-4 h-4" />
								</Button>
							</div>
						</CardBody>
					</Card>
				))}

				{methods.length === 0 && !isLoading && (
					<div className="text-center py-12 text-gray-500">
						No payment methods configured.
					</div>
				)}
			</div>

			<Modal isOpen={isOpen} onClose={onClose} size="2xl">
				<ModalContent>
					<ModalHeader>
						{editingId ? "Edit Payment Method" : "Add Payment Method"}
					</ModalHeader>
					<ModalBody className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<Input
								label="Method Name"
								placeholder="e.g. BCA Transfer"
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
							/>
							<Select
								label="Type"
								placeholder="Select Payment Type"
								selectedKeys={formData.type ? [formData.type] : []}
								onSelectionChange={(keys) => {
									const selected = Array.from(keys)[0] as
										| "manual_bank"
										| "qris"
										| "gateway";
									setFormData({
										...formData,
										type: selected,
									});
								}}
							>
								<SelectItem key="manual_bank">
									Manual Bank Transfer
								</SelectItem>
								<SelectItem key="qris">QRIS (Manual)</SelectItem>
								<SelectItem key="gateway">
									Payment Gateway (Midtrans)
								</SelectItem>
							</Select>
						</div>

						{formData.type === "manual_bank" && (
							<div className="grid grid-cols-2 gap-4">
								<Input
									label="Account Name"
									placeholder="e.g. PT BerandAI Indonesia"
									value={formData.accountName || ""}
									onChange={(e) =>
										setFormData({
											...formData,
											accountName: e.target.value,
										})
									}
								/>
								<Input
									label="Account Number"
									placeholder="e.g. 1234567890"
									value={formData.accountNumber || ""}
									onChange={(e) =>
										setFormData({
											...formData,
											accountNumber: e.target.value,
										})
									}
								/>
							</div>
						)}

						<Textarea
							label="Instructions"
							placeholder="Enter payment instructions shown to user..."
							value={formData.instructions || ""}
							onChange={(e) =>
								setFormData({
									...formData,
									instructions: e.target.value,
								})
							}
							minRows={3}
						/>
					</ModalBody>
					<ModalFooter>
						<Button variant="flat" onPress={onClose}>
							Cancel
						</Button>
						<Button color="primary" onPress={handleSave}>
							Save Method
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
}
