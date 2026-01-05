"use client";
import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Skeleton } from "@heroui/skeleton";
import {
	Users,
	Search,
	Coins,
	MoreVertical,
	Crown,
	Shield,
} from "lucide-react";

interface User {
	id: string;
	name: string;
	email: string;
	credits: number;
	plan: string;
	role: string;
	createdAt: string;
}

export default function AdminUsersPage() {
	const [users, setUsers] = useState<User[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [topupUserId, setTopupUserId] = useState<string | null>(null);
	const [topupAmount, setTopupAmount] = useState(5);
	const [isTopping, setIsTopping] = useState(false);

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			const res = await fetch("/api/admin/users");
			const data = await res.json();
			if (!data.error) {
				setUsers(data.users);
			}
		} catch (error) {
			console.error("Failed to fetch users:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleTopup = async (userId: string) => {
		setIsTopping(true);
		try {
			const res = await fetch("/api/admin/users/topup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId, credits: topupAmount }),
			});

			if (res.ok) {
				setUsers((prev) =>
					prev.map((u) =>
						u.id === userId
							? { ...u, credits: u.credits + topupAmount }
							: u
					)
				);
				setTopupUserId(null);
				setTopupAmount(5);
			}
		} catch (error) {
			console.error("Failed to topup:", error);
		} finally {
			setIsTopping(false);
		}
	};

	const handleSetAdmin = async (userId: string, isAdmin: boolean) => {
		try {
			const res = await fetch("/api/admin/users/role", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId, role: isAdmin ? "admin" : "user" }),
			});

			if (res.ok) {
				setUsers((prev) =>
					prev.map((u) =>
						u.id === userId
							? { ...u, role: isAdmin ? "admin" : "user" }
							: u
					)
				);
			}
		} catch (error) {
			console.error("Failed to update role:", error);
		}
	};

	const filteredUsers = users.filter(
		(user) =>
			user.name?.toLowerCase().includes(search.toLowerCase()) ||
			user.email?.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<div className="max-w-7xl mx-auto space-y-6">
			{/* Header */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						User Management
					</h1>
					<p className="text-gray-500 mt-1">
						Manage users, topup credits, and assign roles
					</p>
				</div>
				<Input
					placeholder="Search users..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					startContent={<Search className="w-4 h-4 text-gray-400" />}
					className="w-full md:w-72"
					variant="bordered"
					radius="lg"
				/>
			</div>

			{/* Users Table */}
			<Card className="border border-gray-200 dark:border-gray-800">
				<CardBody className="p-0">
					{isLoading ? (
						<div className="p-6 space-y-4">
							{[...Array(5)].map((_, i) => (
								<Skeleton key={i} className="h-16 rounded-xl" />
							))}
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-gray-50 dark:bg-gray-800/50">
									<tr>
										<th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
											User
										</th>
										<th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
											Credits
										</th>
										<th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
											Plan
										</th>
										<th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
											Role
										</th>
										<th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
											Joined
										</th>
										<th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 dark:text-gray-400">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
									{filteredUsers.map((user) => (
										<tr
											key={user.id}
											className="hover:bg-gray-50 dark:hover:bg-gray-800/30"
										>
											<td className="px-6 py-4">
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
														{user.name?.[0]?.toUpperCase() || "U"}
													</div>
													<div>
														<p className="font-semibold flex items-center gap-2">
															{user.name || "No Name"}
															{user.role === "admin" && (
																<Shield className="w-4 h-4 text-red-500" />
															)}
														</p>
														<p className="text-sm text-gray-500">
															{user.email}
														</p>
													</div>
												</div>
											</td>
											<td className="px-6 py-4">
												<div className="flex items-center gap-2">
													<Coins className="w-4 h-4 text-amber-500" />
													<span className="font-semibold">
														{user.credits}
													</span>
												</div>
											</td>
											<td className="px-6 py-4">
												<span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary capitalize">
													{user.plan}
												</span>
											</td>
											<td className="px-6 py-4">
												<span
													className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
														user.role === "admin"
															? "bg-red-500/10 text-red-500"
															: "bg-gray-500/10 text-gray-500"
													}`}
												>
													{user.role}
												</span>
											</td>
											<td className="px-6 py-4 text-sm text-gray-500">
												{new Date(
													user.createdAt
												).toLocaleDateString("id-ID")}
											</td>
											<td className="px-6 py-4">
												<div className="flex items-center justify-end gap-2">
													{topupUserId === user.id ? (
														<div className="flex items-center gap-2">
															<Input
																type="number"
																value={topupAmount.toString()}
																onChange={(e) =>
																	setTopupAmount(
																		parseInt(
																			e.target.value
																		) || 0
																	)
																}
																className="w-20"
																size="sm"
																min={1}
															/>
															<Button
																size="sm"
																color="success"
																onPress={() =>
																	handleTopup(user.id)
																}
																isLoading={isTopping}
															>
																Add
															</Button>
															<Button
																size="sm"
																variant="flat"
																onPress={() =>
																	setTopupUserId(null)
																}
															>
																Cancel
															</Button>
														</div>
													) : (
														<>
															<Button
																size="sm"
																variant="flat"
																color="warning"
																onPress={() =>
																	setTopupUserId(user.id)
																}
																startContent={
																	<Coins className="w-4 h-4" />
																}
															>
																Topup
															</Button>
															<Button
																size="sm"
																variant="flat"
																color={
																	user.role === "admin"
																		? "default"
																		: "danger"
																}
																onPress={() =>
																	handleSetAdmin(
																		user.id,
																		user.role !== "admin"
																	)
																}
																startContent={
																	<Shield className="w-4 h-4" />
																}
															>
																{user.role === "admin"
																	? "Remove Admin"
																	: "Make Admin"}
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
					)}
				</CardBody>
			</Card>
		</div>
	);
}
