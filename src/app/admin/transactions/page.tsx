"use client";
import { useEffect, useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import {
	CheckCircle,
	XCircle,
	Clock,
	Search,
	ExternalLink,
	Filter,
} from "lucide-react";
import { Link } from "@heroui/link";
import ConfirmationModal from "@/components/Modals/ConfirmationModal";

interface Transaction {
	id: string;
	orderId: string;
	amount: number;
	credits: number;
	status: string;
	type: string;
	plan: string;
	paymentMethodName?: string;
	proofUrl?: string;
	createdAt: string;
	user: {
		name: string;
		email: string;
	};
}

export default function AdminTransactionsPage() {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [filterStatus, setFilterStatus] = useState("all");

	// Modal State
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [actionType, setActionType] = useState<"success" | "failed">(
		"success"
	);
	const [selectedTxId, setSelectedTxId] = useState<string | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);

	useEffect(() => {
		fetchTransactions();
	}, []);

	const fetchTransactions = async () => {
		try {
			const res = await fetch("/api/admin/transactions");
			const data = await res.json();
			if (data.transactions) {
				setTransactions(data.transactions);
			}
		} catch (error) {
			console.error("Failed to fetch transactions:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleActionClick = (id: string, type: "success" | "failed") => {
		setSelectedTxId(id);
		setActionType(type);
		setIsConfirmOpen(true);
	};

	const confirmAction = async () => {
		if (!selectedTxId) return;

		setIsProcessing(true);
		try {
			const res = await fetch(`/api/admin/transactions/${selectedTxId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status: actionType }),
			});

			if (res.ok) {
				fetchTransactions();
				setIsConfirmOpen(false);
			}
		} catch (error) {
			console.error("Failed to update status:", error);
		} finally {
			setIsProcessing(false);
			setSelectedTxId(null);
		}
	};

	const filteredTransactions = transactions.filter((tx) => {
		if (filterStatus === "all") return true;
		return tx.status === filterStatus;
	});

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
		}).format(amount);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "success":
				return "success";
			case "pending":
				return "warning";
			case "failed":
				return "danger";
			default:
				return "default";
		}
	};

	return (
		<div className="max-w-7xl mx-auto space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold">Transactions</h1>
					<p className="text-gray-500">View and manage purchases</p>
				</div>
				<div className="flex gap-4">
					{/* Hydration fix: Select component uses random IDs so we only render it on client */}
					{isLoading ? (
						<div className="w-40 h-10 bg-gray-100 rounded-xl animate-pulse" />
					) : (
						<Select
							className="w-40"
							selectedKeys={[filterStatus]}
							disallowEmptySelection
							aria-label="Filter status"
							onSelectionChange={(keys) => {
								const selected = Array.from(keys)[0] as string;
								setFilterStatus(selected || "all");
							}}
							startContent={<Filter className="w-4 h-4 text-gray-500" />}
						>
							<SelectItem key="all">All Status</SelectItem>
							<SelectItem key="pending">Pending</SelectItem>
							<SelectItem key="success">Success</SelectItem>
							<SelectItem key="failed">Failed</SelectItem>
						</Select>
					)}
				</div>
			</div>

			<Card className="border border-gray-200 dark:border-gray-800">
				<CardBody className="p-0">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50 dark:bg-gray-800/50">
								<tr>
									<th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
										Date/ID
									</th>
									<th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
										User
									</th>
									<th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
										Amount
									</th>
									<th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
										Payment
									</th>
									<th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
										Status
									</th>
									<th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 dark:text-gray-400">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
								{filteredTransactions.map((tx) => (
									<tr
										key={tx.id}
										className="hover:bg-gray-50 dark:hover:bg-gray-800/30"
									>
										<td className="px-6 py-4">
											<div className="flex flex-col">
												<span className="font-mono text-xs text-gray-500">
													{tx.orderId}
												</span>
												<span className="text-sm">
													{new Date(
														tx.createdAt
													).toLocaleDateString()}
												</span>
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="flex flex-col">
												<span className="font-medium text-sm">
													{tx.user?.name}
												</span>
												<span className="text-xs text-gray-500">
													{tx.user?.email}
												</span>
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="flex flex-col">
												<span className="font-bold text-sm">
													{formatCurrency(tx.amount)}
												</span>
												<span className="text-xs text-gray-500">
													{tx.credits} Credits
												</span>
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="flex flex-col gap-1">
												<span className="text-sm font-medium">
													{tx.paymentMethodName || "Unknown"}
												</span>
												{tx.proofUrl && (
													<a
														href={tx.proofUrl}
														target="_blank"
														rel="noopener noreferrer"
														className="text-xs text-blue-500 hover:underline flex items-center gap-1"
													>
														View Proof{" "}
														<ExternalLink className="w-3 h-3" />
													</a>
												)}
											</div>
										</td>
										<td className="px-6 py-4">
											<Chip
												color={getStatusColor(tx.status) as any}
												size="sm"
												variant="flat"
												className="capitalize"
											>
												{tx.status}
											</Chip>
										</td>
										<td className="px-6 py-4">
											<div className="flex justify-end gap-2">
												{tx.status === "pending" && (
													<>
														<Button
															size="sm"
															color="success"
															variant="flat"
															isIconOnly
															title="Approve"
															onPress={() =>
																handleActionClick(
																	tx.id,
																	"success"
																)
															}
														>
															<CheckCircle className="w-4 h-4" />
														</Button>
														<Button
															size="sm"
															color="danger"
															variant="flat"
															isIconOnly
															title="Reject"
															onPress={() =>
																handleActionClick(
																	tx.id,
																	"failed"
																)
															}
														>
															<XCircle className="w-4 h-4" />
														</Button>
													</>
												)}
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					{filteredTransactions.length === 0 && (
						<div className="text-center py-8 text-gray-500">
							No transactions found.
						</div>
					)}
				</CardBody>
			</Card>

			<ConfirmationModal
				isOpen={isConfirmOpen}
				onClose={() => setIsConfirmOpen(false)}
				onConfirm={confirmAction}
				title={
					actionType === "success"
						? "Approve Transaction?"
						: "Reject Transaction?"
				}
				description={
					actionType === "success"
						? "Are you sure you want to approve this transaction? Credits will be added to the user's account."
						: "Are you sure you want to reject this transaction? No credits will be added."
				}
				isLoading={isProcessing}
				color={actionType === "success" ? "success" : "danger"}
				icon={
					actionType === "success" ? (
						<CheckCircle className="w-8 h-8 text-white" />
					) : (
						<XCircle className="w-8 h-8 text-white" />
					)
				}
				confirmText={actionType === "success" ? "Approve" : "Reject"}
			/>
		</div>
	);
}
