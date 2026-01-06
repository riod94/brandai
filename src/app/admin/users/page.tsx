"use client";
import { useEffect, useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import {
	Table,
	TableHeader,
	TableBody,
	TableColumn,
	TableRow,
	TableCell,
} from "@heroui/table";
import { Chip } from "@heroui/chip";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
} from "@heroui/modal";
import {
	Search,
	Plus,
	UserCog,
	Ban,
	CheckCircle,
	Shield,
	Coins,
	Minus,
} from "lucide-react";
import { Tabs, Tab } from "@heroui/tabs";

interface User {
	id: string;
	name: string;
	email: string;
	role: "user" | "admin";
	credits: number;
	image: string | null;
	createdAt: string;
	isBlocked?: boolean;
}

export default function AdminUsersPage() {
	const [users, setUsers] = useState<User[]>([]);
	const [search, setSearch] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	// Edit User Modal
	const {
		isOpen: isEditOpen,
		onOpen: onEditOpen,
		onClose: onEditClose,
	} = useDisclosure();
	const [editingUser, setEditingUser] = useState<User | null>(null);
	const [editForm, setEditForm] = useState({
		name: "",
		email: "",
		isBlocked: false,
	});

	// Credits Modal
	const {
		isOpen: isCreditsOpen,
		onOpen: onCreditsOpen,
		onClose: onCreditsClose,
	} = useDisclosure();
	const [creditUser, setCreditUser] = useState<User | null>(null);
	const [creditForm, setCreditForm] = useState({
		amount: 10,
		notes: "",
		type: "add" as "add" | "deduct",
	});

	const [loadingAction, setLoadingAction] = useState(false);

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			const res = await fetch("/api/admin/users");
			const data = await res.json();
			if (data.users) {
				setUsers(data.users);
			}
		} catch (error) {
			console.error("Failed to fetch users:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const filteredUsers = users.filter(
		(user) =>
			user.name?.toLowerCase().includes(search.toLowerCase()) ||
			user.email?.toLowerCase().includes(search.toLowerCase())
	);

	// --- EDIT USER HANDLERS ---
	const handleEditClick = (user: User) => {
		setEditingUser(user);
		setEditForm({
			name: user.name || "",
			email: user.email || "",
			isBlocked: user.isBlocked || false,
		});
		onEditOpen();
	};

	const handleSaveUser = async () => {
		if (!editingUser) return;
		setLoadingAction(true);
		try {
			const res = await fetch("/api/admin/users/update", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId: editingUser.id, ...editForm }),
			});
			if (res.ok) {
				fetchUsers();
				onEditClose();
			}
		} catch (error) {
			console.error("Failed to update user:", error);
		} finally {
			setLoadingAction(false);
		}
	};

	const handleToggleBlock = (blocked: boolean) => {
		setEditForm((prev) => ({ ...prev, isBlocked: blocked }));
	};

	// --- CREDIT ADJUSTMENT HANDLERS ---
	const handleCreditsClick = (user: User) => {
		setCreditUser(user);
		setCreditForm({ amount: 10, notes: "", type: "add" });
		onCreditsOpen();
	};

	const handleSaveCredits = async () => {
		if (!creditUser) return;
		setLoadingAction(true);
		try {
			const res = await fetch("/api/admin/users/credits", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					userId: creditUser.id,
					credits: Number(creditForm.amount),
					type: creditForm.type,
					notes: creditForm.notes,
				}),
			});
			if (res.ok) {
				fetchUsers();
				onCreditsClose();
			} else {
				alert("Failed to adjust credits");
			}
		} catch (error) {
			console.error("Failed to adjust credits:", error);
		} finally {
			setLoadingAction(false);
		}
	};

	return (
		<div className="max-w-7xl mx-auto space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold">Users</h1>
					<p className="text-gray-500">Manage user accounts and credits</p>
				</div>
				<Input
					className="w-64"
					placeholder="Search users..."
					startContent={<Search className="w-4 h-4 text-gray-500" />}
					value={search}
					onValueChange={setSearch}
				/>
			</div>

			<Card className="border border-gray-200 dark:border-gray-800">
				<CardBody className="p-0">
					<Table aria-label="Users table" removeWrapper shadow="none">
						<TableHeader>
							<TableColumn>USER</TableColumn>
							<TableColumn>ROLE</TableColumn>
							<TableColumn>CREDITS</TableColumn>
							<TableColumn>STATUS</TableColumn>
							<TableColumn>JOINED</TableColumn>
							<TableColumn align="end">ACTIONS</TableColumn>
						</TableHeader>
						<TableBody
							emptyContent={"No users found"}
							loadingState={isLoading ? "loading" : "idle"}
						>
							{filteredUsers.map((user) => (
								<TableRow key={user.id}>
									<TableCell>
										<div className="flex flex-col">
											<span className="font-medium text-sm">
												{user.name}
											</span>
											<span className="text-xs text-gray-500">
												{user.email}
											</span>
										</div>
									</TableCell>
									<TableCell>
										<Chip
											size="sm"
											variant="flat"
											color={
												user.role === "admin"
													? "secondary"
													: "default"
											}
											startContent={
												user.role === "admin" ? (
													<Shield className="w-3 h-3" />
												) : undefined
											}
										>
											{user.role}
										</Chip>
									</TableCell>
									<TableCell>
										<div className="font-semibold text-primary">
											{user.credits}
										</div>
									</TableCell>
									<TableCell>
										{user.isBlocked ? (
											<Chip
												size="sm"
												color="danger"
												variant="flat"
												startContent={<Ban className="w-3 h-3" />}
											>
												Blocked
											</Chip>
										) : (
											<Chip size="sm" color="success" variant="dot">
												Active
											</Chip>
										)}
									</TableCell>
									<TableCell>
										<span className="text-xs text-gray-500">
											{new Date(user.createdAt).toLocaleDateString()}
										</span>
									</TableCell>
									<TableCell>
										<div className="flex justify-end gap-2">
											<Button
												size="sm"
												variant="light"
												color="primary"
												onPress={() => handleCreditsClick(user)}
												title="Adjust Credits"
												isIconOnly
											>
												<Coins className="w-4 h-4" />
											</Button>
											<Button
												size="sm"
												variant="light"
												onPress={() => handleEditClick(user)}
												title="Edit User"
												isIconOnly
											>
												<UserCog className="w-4 h-4" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardBody>
			</Card>

			{/* Edit User Modal */}
			<Modal isOpen={isEditOpen} onClose={onEditClose}>
				<ModalContent>
					<ModalHeader>Edit User</ModalHeader>
					<ModalBody className="space-y-4">
						<Input
							label="Name"
							value={editForm.name}
							onChange={(e) =>
								setEditForm({ ...editForm, name: e.target.value })
							}
						/>
						<Input
							label="Email"
							value={editForm.email}
							onChange={(e) =>
								setEditForm({ ...editForm, email: e.target.value })
							}
						/>
						<div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
							<div>
								<p className="font-semibold">Block User</p>
								<p className="text-xs text-gray-500">
									Prevent login and access
								</p>
							</div>
							<Button
								size="sm"
								color={editForm.isBlocked ? "danger" : "default"}
								variant={editForm.isBlocked ? "solid" : "bordered"}
								onPress={() => handleToggleBlock(!editForm.isBlocked)}
							>
								{editForm.isBlocked ? "Blocked" : "Active"}
							</Button>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button variant="flat" onPress={onEditClose}>
							Cancel
						</Button>
						<Button
							color="primary"
							onPress={handleSaveUser}
							isLoading={loadingAction}
						>
							Save Changes
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{/* Credits Adjustment Modal */}
			<Modal isOpen={isCreditsOpen} onClose={onCreditsClose}>
				<ModalContent>
					<ModalHeader>Adjust Credits: {creditUser?.name}</ModalHeader>
					<ModalBody>
						<Tabs
							fullWidth
							selectedKey={creditForm.type}
							onSelectionChange={(key) =>
								setCreditForm({
									...creditForm,
									type: key as "add" | "deduct",
								})
							}
						>
							<Tab
								key="add"
								title={
									<div className="flex items-center gap-2">
										<Plus className="w-4 h-4" /> Add Credits
									</div>
								}
							/>
							<Tab
								key="deduct"
								title={
									<div className="flex items-center gap-2">
										<Minus className="w-4 h-4" /> Deduct Credits
									</div>
								}
							/>
						</Tabs>

						<div className="space-y-4 mt-4">
							<Input
								type="number"
								label="Amount"
								placeholder="0"
								value={String(creditForm.amount)}
								onChange={(e) =>
									setCreditForm({
										...creditForm,
										amount: Number(e.target.value),
									})
								}
							/>
							<Textarea
								label="Notes (Optional)"
								placeholder="Reason for adjustment..."
								value={creditForm.notes}
								onChange={(e) =>
									setCreditForm({
										...creditForm,
										notes: e.target.value,
									})
								}
							/>
							<p className="text-sm text-gray-500">
								Current Balance:{" "}
								<span className="font-bold">{creditUser?.credits}</span>
								{creditForm.amount > 0 && (
									<span>
										{" "}
										- New Balance:{" "}
										<span
											className={
												creditForm.type === "add"
													? "text-success font-bold"
													: "text-danger font-bold"
											}
										>
											{creditForm.type === "add"
												? (creditUser?.credits || 0) +
												  creditForm.amount
												: (creditUser?.credits || 0) -
												  creditForm.amount}
										</span>
									</span>
								)}
							</p>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button variant="flat" onPress={onCreditsClose}>
							Cancel
						</Button>
						<Button
							color={creditForm.type === "add" ? "primary" : "danger"}
							onPress={handleSaveCredits}
							isLoading={loadingAction}
						>
							{creditForm.type === "add"
								? "Add Credits"
								: "Deduct Credits"}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
}
