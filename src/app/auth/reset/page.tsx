"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardFooter, CardHeader, CardBody } from "@heroui/card";
import { Link } from "@heroui/link";
import { Mail, ArrowLeft } from "lucide-react";
import { Form } from "@heroui/form";

export default function ResetPage() {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | undefined>("");
	const [success, setSuccess] = useState<string | undefined>("");

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");
		setSuccess("");

		try {
			const res = await fetch("/api/auth/reset", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});

			const data = await res.json();

			if (res.ok) {
				setSuccess("Email sent! Check your inbox.");
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
		<div className="flex justify-center items-center min-h-[80vh] px-4">
			<Card className="w-full max-w-[400px] shadow-lg">
				<CardHeader className="flex flex-col gap-1 items-center text-center pb-0">
					<h1 className="text-2xl font-bold">Forgot Password?</h1>
					<p className="text-sm text-default-500">
						Enter your email to reset your password
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
							label="Email"
							placeholder="Enter your email"
							type="email"
							startContent={
								<Mail className="w-4 h-4 text-default-400" />
							}
							variant="bordered"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
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
						>
							Send Reset Link
						</Button>
					</Form>
				</CardBody>
				<CardFooter className="flex justify-center pt-0">
					<Link
						href="/auth/sign-in"
						className="text-sm flex items-center gap-1 text-default-500 hover:text-primary"
					>
						<ArrowLeft className="w-3 h-3" />
						Back to Login
					</Link>
				</CardFooter>
			</Card>
		</div>
	);
}
