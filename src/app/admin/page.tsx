import { db } from "@/db";
import { users, transactions, logos } from "@/db/schema";
import { count, sum, eq } from "drizzle-orm";
import { Card, CardBody } from "@heroui/card";
import { Users, CreditCard, ImageIcon, Coins } from "lucide-react";

async function getStats() {
	const [userCount] = await db.select({ count: count() }).from(users);
	const [txCount] = await db.select({ count: count() }).from(transactions);
	const [logoCount] = await db.select({ count: count() }).from(logos);
	const [revenue] = await db
		.select({ total: sum(transactions.amount) })
		.from(transactions)
		.where(eq(transactions.status, "success"));

	return {
		users: userCount.count,
		transactions: txCount.count,
		logos: logoCount.count,
		revenue: Number(revenue.total) || 0,
	};
}

export default async function AdminDashboard() {
	const stats = await getStats();

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
		}).format(price);
	};

	return (
		<div className="max-w-7xl mx-auto space-y-8">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
					Admin Dashboard
				</h1>
				<p className="text-gray-500 mt-1">Overview of your platform</p>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
				<Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20">
					<CardBody className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-500">Total Users</p>
								<p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
									{stats.users}
								</p>
							</div>
							<div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
								<Users className="w-6 h-6 text-white" />
							</div>
						</div>
					</CardBody>
				</Card>

				<Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
					<CardBody className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-500">Total Revenue</p>
								<p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
									{formatPrice(stats.revenue)}
								</p>
							</div>
							<div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center">
								<Coins className="w-6 h-6 text-white" />
							</div>
						</div>
					</CardBody>
				</Card>

				<Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
					<CardBody className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-500">Transactions</p>
								<p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
									{stats.transactions}
								</p>
							</div>
							<div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center">
								<CreditCard className="w-6 h-6 text-white" />
							</div>
						</div>
					</CardBody>
				</Card>

				<Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
					<CardBody className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-500">Logos Created</p>
								<p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
									{stats.logos}
								</p>
							</div>
							<div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center">
								<ImageIcon className="w-6 h-6 text-white" />
							</div>
						</div>
					</CardBody>
				</Card>
			</div>

			{/* Quick Actions */}
			<Card className="border border-gray-200 dark:border-gray-800">
				<CardBody className="p-6">
					<h2 className="text-xl font-bold mb-4">Quick Actions</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<a
							href="/admin/users"
							className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
						>
							<Users className="w-6 h-6 text-blue-500 mb-2" />
							<h3 className="font-semibold">Manage Users</h3>
							<p className="text-sm text-gray-500">
								View and manage all users
							</p>
						</a>
						<a
							href="/admin/transactions"
							className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
						>
							<CreditCard className="w-6 h-6 text-emerald-500 mb-2" />
							<h3 className="font-semibold">View Transactions</h3>
							<p className="text-sm text-gray-500">
								Review and approve payments
							</p>
						</a>
						<a
							href="/admin/pricing"
							className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
						>
							<Coins className="w-6 h-6 text-amber-500 mb-2" />
							<h3 className="font-semibold">Setup Pricing</h3>
							<p className="text-sm text-gray-500">
								Configure credit prices
							</p>
						</a>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
