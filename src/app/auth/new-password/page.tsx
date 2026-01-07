"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Link } from "@heroui/link";
import { Lock } from "lucide-react";
import { Form } from "@heroui/form";

function NewPasswordForm() {
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const router = useRouter();

	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | undefined>("");
	const [success, setSuccess] = useState<string | undefined>("");

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");
		setSuccess("");

		if (!token) {
			setError("Missing token!");
			setIsLoading(false);
			return;
		}

		try {
			const res = await fetch("/api/auth/new-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ password, token }),
			});

			const data = await res.json();

			if (res.ok) {
				setSuccess("Password updated! Redirecting to login...");
				setTimeout(() => {
					router.push("/auth/sign-in");
				}, 2000);
			} else {
				setError(data.error);
			}
		} catch (err) {
			setError("Something went wrong");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className="w-full max-w-[400px] shadow-lg">
			<CardHeader className="flex flex-col gap-1 items-center text-center pb-0">
				<h1 className="text-2xl font-bold">New Password</h1>
				<p className="text-sm text-default-500">
					Enter your new password below
				</p>
			</CardHeader>
			<CardBody className="gap-4">
				<Form
					onSubmit={onSubmit}
					className="space-y-4"
					validationBehavior="native"
				>
					<Input
						isRequired
						label="New Password"
						placeholder="******"
						type="password"
						startContent={<Lock className="w-4 h-4 text-default-400" />}
						variant="bordered"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						errorMessage="Minimum 8 characters"
						minLength={8}
					/>
					{error && (
						<div className="p-3 rounded-lg bg-danger-50 text-danger text-sm text-center">
							{error}
						</div>
					)}
					{success && (
						<div className="p-3 rounded-lg bg-success-50 text-success text-sm text-center">
							{success}
						</div>
					)}
					<Button
						fullWidth
						color="primary"
						type="submit"
						isLoading={isLoading}
						isDisabled={!!success}
					>
						Reset Password
					</Button>
				</Form>
				<div className="text-center mt-2">
					<Link
						href="/auth/sign-in"
						size="sm"
						className="text-default-500"
					>
						Back to Login
					</Link>
				</div>
			</CardBody>
		</Card>
	);
}

export default function NewPasswordPage() {
	return (
		<div className="flex justify-center items-center min-h-[80vh] px-4">
			<Suspense>
				<NewPasswordForm />
			</Suspense>
		</div>
	);
}
