"use client";
import { useState } from "react";
import { Mail } from "lucide-react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Form } from "@heroui/form";

function ForgotPassword() {
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState("");

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		// Add password reset logic here
		setTimeout(() => {
			alert("Password reset link sent to your email!");
			setIsLoading(false);
		}, 1000);
	};

	return (
		<div className="lg:p-8">
			<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
				<div className="flex flex-col space-y-2 text-center">
					<h1 className="text-2xl font-semibold tracking-tight">
						Forgot password?
					</h1>
					<p className="text-sm text-gray-500">
						Enter your email and we'll send you a reset link
					</p>
				</div>
				<Form
					onSubmit={onSubmit}
					className="space-y-4 flex items-center justify-center"
                    validationBehavior="native"
				>
					<div className="space-y-4">
						<div className="space-y-2">
							<label
								htmlFor="email"
								className="text-sm font-medium leading-none ml-5"
							>
								Email
							</label>
							<div className="relative">
								<Input
									isRequired
                                    errorMessage="Please enter a valid email address"
									size="lg"
									variant="flat"
									color="primary"
									name="email"
									type="email"
									radius="full"
									placeholder="Enter your email"
									startContent={<Mail className="h-5 w-5" />}
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
						</div>
						<Button
							type="submit"
							size="lg"
							variant="shadow"
							color="primary"
							radius="full"
							className="w-full"
							isDisabled={isLoading}
						>
							{isLoading ? <Spinner color="white" /> : "Send Reset Link"}
						</Button>
					</div>
				</Form>
			</div>
		</div>
	);
}

export default ForgotPassword;
