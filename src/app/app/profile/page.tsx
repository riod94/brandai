"use client";
import { Suspense, useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Avatar } from "@heroui/avatar";
import { Skeleton } from "@heroui/skeleton";
import { useSession } from "next-auth/react";
import { User, Mail, Camera, Save, Shield, Key } from "lucide-react";

function ProfileContent() {
	const { data: session, update } = useSession();
	const [isLoading, setIsLoading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
	});
	const [passwordData, setPasswordData] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	useEffect(() => {
		if (session?.user) {
			setFormData({
				name: session.user.name || "",
				email: session.user.email || "",
			});
		}
	}, [session]);

	const handleUpdateProfile = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSaving(true);
		setMessage(null);

		try {
			const res = await fetch("/api/user/profile", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Failed to update profile");
			}

			await update({ name: formData.name });
			setMessage({ type: "success", text: "Profile updated successfully!" });
		} catch (error) {
			setMessage({
				type: "error",
				text:
					error instanceof Error
						? error.message
						: "Failed to update profile",
			});
		} finally {
			setIsSaving(false);
		}
	};

	const handleChangePassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSaving(true);
		setMessage(null);

		if (passwordData.newPassword !== passwordData.confirmPassword) {
			setMessage({ type: "error", text: "Passwords do not match" });
			setIsSaving(false);
			return;
		}

		try {
			const res = await fetch("/api/user/password", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					currentPassword: passwordData.currentPassword,
					newPassword: passwordData.newPassword,
				}),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Failed to change password");
			}

			setPasswordData({
				currentPassword: "",
				newPassword: "",
				confirmPassword: "",
			});
			setMessage({
				type: "success",
				text: "Password changed successfully!",
			});
		} catch (error) {
			setMessage({
				type: "error",
				text:
					error instanceof Error
						? error.message
						: "Failed to change password",
			});
		} finally {
			setIsSaving(false);
		}
	};

	const initials = session?.user?.name
		? session.user.name
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2)
		: "U";

	return (
		<div className="max-w-6xl mx-auto space-y-8">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
					Profile Settings
				</h1>
				<p className="text-gray-500 mt-1">Manage your account settings</p>
			</div>

			{/* Message */}
			{message && (
				<div
					className={`p-4 rounded-xl ${
						message.type === "success"
							? "bg-emerald-50 text-emerald-700 border border-emerald-200"
							: "bg-red-50 text-red-700 border border-red-200"
					}`}
				>
					{message.text}
				</div>
			)}

			{/* Profile Card */}
			<Card className="border border-gray-200 dark:border-gray-800 shadow-xl">
				<CardHeader className="px-6 pt-6 pb-0">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
							<User className="w-5 h-5 text-white" />
						</div>
						<div>
							<h2 className="text-xl font-bold">Profile Information</h2>
							<p className="text-sm text-gray-500">
								Update your personal details
							</p>
						</div>
					</div>
				</CardHeader>
				<CardBody className="p-6">
					<form onSubmit={handleUpdateProfile} className="space-y-6">
						{/* Avatar */}
						<div className="flex items-center gap-6">
							<div className="relative">
								{session?.user?.image ? (
									<Avatar
										src={session.user.image}
										className="w-24 h-24"
										isBordered
										color="primary"
									/>
								) : (
									<div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">
										{initials}
									</div>
								)}
								<button
									type="button"
									className="absolute bottom-0 right-0 p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
								>
									<Camera className="w-4 h-4" />
								</button>
							</div>
							<div>
								<h3 className="font-semibold">
									{session?.user?.name || "User"}
								</h3>
								<p className="text-sm text-gray-500">
									{session?.user?.email}
								</p>
							</div>
						</div>

						{/* Form Fields */}
						<div className="grid gap-4">
							<Input
								label="Full Name"
								placeholder="Enter your name"
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
								startContent={
									<User className="w-4 h-4 text-gray-400" />
								}
								variant="bordered"
								radius="lg"
							/>
							<Input
								label="Email Address"
								placeholder="Enter your email"
								type="email"
								value={formData.email}
								onChange={(e) =>
									setFormData({ ...formData, email: e.target.value })
								}
								startContent={
									<Mail className="w-4 h-4 text-gray-400" />
								}
								variant="bordered"
								radius="lg"
								isReadOnly
								description="Email cannot be changed"
							/>
						</div>

						<Button
							type="submit"
							color="primary"
							variant="shadow"
							radius="full"
							size="lg"
							isLoading={isSaving}
							startContent={<Save className="w-5 h-5" />}
						>
							Save Changes
						</Button>
					</form>
				</CardBody>
			</Card>

			{/* Password Card */}
			<Card className="border border-gray-200 dark:border-gray-800 shadow-xl">
				<CardHeader className="px-6 pt-6 pb-0">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
							<Shield className="w-5 h-5 text-white" />
						</div>
						<div>
							<h2 className="text-xl font-bold">Security</h2>
							<p className="text-sm text-gray-500">
								Change your password
							</p>
						</div>
					</div>
				</CardHeader>
				<CardBody className="p-6">
					<form onSubmit={handleChangePassword} className="space-y-4">
						<Input
							label="Current Password"
							type="password"
							value={passwordData.currentPassword}
							onChange={(e) =>
								setPasswordData({
									...passwordData,
									currentPassword: e.target.value,
								})
							}
							startContent={<Key className="w-4 h-4 text-gray-400" />}
							variant="bordered"
							radius="lg"
						/>
						<Input
							label="New Password"
							type="password"
							value={passwordData.newPassword}
							onChange={(e) =>
								setPasswordData({
									...passwordData,
									newPassword: e.target.value,
								})
							}
							startContent={<Key className="w-4 h-4 text-gray-400" />}
							variant="bordered"
							radius="lg"
						/>
						<Input
							label="Confirm New Password"
							type="password"
							value={passwordData.confirmPassword}
							onChange={(e) =>
								setPasswordData({
									...passwordData,
									confirmPassword: e.target.value,
								})
							}
							startContent={<Key className="w-4 h-4 text-gray-400" />}
							variant="bordered"
							radius="lg"
						/>
						<Button
							type="submit"
							color="warning"
							variant="shadow"
							radius="full"
							size="lg"
							isLoading={isSaving}
							startContent={<Shield className="w-5 h-5" />}
						>
							Change Password
						</Button>
					</form>
				</CardBody>
			</Card>
		</div>
	);
}

export default function ProfilePage() {
	return (
		<Suspense
			fallback={
				<div className="flex items-center justify-center min-h-[50vh]">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
				</div>
			}
		>
			<ProfileContent />
		</Suspense>
	);
}
