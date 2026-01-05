"use client";
import { useEffect, useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Skeleton } from "@heroui/skeleton";
import {
	CreditCard,
	CheckCircle,
	Clock,
	XCircle,
	RefreshCw,
} from "lucide-react";

interface Transaction {
	id: string;
	orderId: string;
	amount: number;
	credits: number;
	status: string;
	plan: string;
	type: string;
	createdAt: string;
	user: {
		name: string;
		email: string;
	};
}

export default function AdminTransactionsPage() {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [processingId, setProcessingId] = useState<string | null>(null);

	useEffect(() => {
		fetchTransactions();
	}, []);

	const fetchTransactions = async () => {
		try {
			const res = await fetch("/api/admin/transactions");
			const data = await res.json();
			if (!data.error) {
				setTransactions(data.transactions);
			}
		} catch (error) {
			console.error("Failed to fetch transactions:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleApprove = async (txId: string) => {
		setProcessingId(txId);
		try {
			const res = await fetch("/api/admin/transactions/approve", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ transactionId: txId }),
			});

			if (res.ok) {
				setTransactions((prev) =>
					prev.map((tx) =>
						tx.id === txId ? { ...tx, status: "success" } : tx
					)
				);
			}
		} catch (error) {
			console.error("Failed to approve:", error);
		} finally {
			setProcessingId(null);
		}
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
		}).format(price);
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "success":
				return <CheckCircle className="w-5 h-5 text-emerald-500" />;
			case "pending":
				return <Clock className="w-5 h-5 text-amber-500" />;
			default:
				return <XCircle className="w-5 h-5 text-red-500" />;
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "success":
				return "bg-emerald-500/10 text-emerald-600";
			case "pending":
				return "bg-amber-500/10 text-amber-600";
			default:
				return "bg-red-500/10 text-red-600";
		}
	};

	return (
		<div className="max-w-7xl mx-auto space-y-6">
			{/* Header */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						Transactions
					</h1>
					<p className="text-gray-500 mt-1">
						View and manage all payment transactions
					</p>
				</div>
				<Button
					variant="flat"
					startContent={<RefreshCw className="w-4 h-4" />}
					onPress={fetchTransactions}
				>
					Refresh
				</Button>
			</div>

			{/* Transactions List */}
			<Card className="border border-gray-200 dark:border-gray-800">
				<CardBody className="p-0">
					{isLoading ? (
						<div className="p-6 space-y-4">
							{[...Array(5)].map((_, i) => (
								<Skeleton key={i} className="h-20 rounded-xl" />
							))}
						</div>
					) : transactions.length === 0 ? (
						<div className="p-12 text-center text-gray-500">
							<CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
							<p>No transactions yet</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-gray-50 dark:bg-gray-800/50">
									<tr>
										<th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
											Order ID
										</th>
										<th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
											User
										</th>
										<th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
											Type
										</th>
										<th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
											Amount
										</th>
										<th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
											Status
										</th>
										<th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
											Date
										</th>
										<th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 dark:text-gray-400">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
									{transactions.map((tx) => (
										<tr
											key={tx.id}
											className="hover:bg-gray-50 dark:hover:bg-gray-800/30"
										>
											<td className="px-6 py-4">
												<p className="font-mono text-sm">
													{tx.orderId}
												</p>
											</td>
											<td className="px-6 py-4">
												<div>
													<p className="font-semibold">
														{tx.user?.name || "Unknown"}
													</p>
													<p className="text-sm text-gray-500">
														{tx.user?.email}
													</p>
												</div>
											</td>
											<td className="px-6 py-4">
												<span className="capitalize">
													{tx.type === "subscription"
														? `${tx.plan} Subscription`
														: `${tx.credits} Credits`}
												</span>
											</td>
											<td className="px-6 py-4 font-semibold">
												{formatPrice(tx.amount)}
											</td>
											<td className="px-6 py-4">
												<span
													className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(
														tx.status
													)}`}
												>
													{getStatusIcon(tx.status)}
													{tx.status}
												</span>
											</td>
											<td className="px-6 py-4 text-sm text-gray-500">
												{new Date(tx.createdAt).toLocaleDateString(
													"id-ID",
													{
														day: "numeric",
														month: "short",
														year: "numeric",
														hour: "2-digit",
														minute: "2-digit",
													}
												)}
											</td>
											<td className="px-6 py-4 text-right">
												{tx.status === "pending" && (
													<Button
														size="sm"
														color="success"
														onPress={() => handleApprove(tx.id)}
														isLoading={processingId === tx.id}
													>
														Approve
													</Button>
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</CardBody>
			</Card>
		</div>
	);
}
