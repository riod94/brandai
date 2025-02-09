"use client";
import { useState } from "react";
import { Mail, Lock, EyeOffIcon, EyeIcon } from "lucide-react";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { Form } from "@heroui/form";

function SignUp() {
	const [isLoading, setIsLoading] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const toggleVisibility = () => setIsVisible(!isVisible);

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		// Add login logic here
		setTimeout(() => setIsLoading(false), 1000);
	};

	return (
		<div className="lg:p-8">
			<Link
				href="/auth/sign-in"
				className="absolute right-4 top-4 md:right-8 md:top-8"
			>
				<Button variant="light" radius="full" color="primary">
					Already have an account?
				</Button>
			</Link>
			<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
				<div className="flex flex-col space-y-2 text-center">
					<h1 className="text-2xl font-semibold tracking-tight">
						Create an account
					</h1>
					<p className="text-sm text-gray-500">
						Enter your details below to create your account
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
									size="lg"
									variant="flat"
									color="primary"
									name="email"
									type="email"
									radius="full"
									placeholder="Enter your email"
									startContent={<Mail className="h-5 w-5" />}
									value={formData.email}
									errorMessage="Please enter a valid email address"
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											email: e.target.value,
										}))
									}
								/>
							</div>
						</div>
						<div className="space-y-2">
							<label
								htmlFor="password"
								className="text-sm font-medium leading-none ml-5"
							>
								Password
							</label>
							<div className="relative">
								<Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
								<Input
									isRequired
									errorMessage="Password must be at least 8 characters"
									size="lg"
									variant="flat"
									color="primary"
									name="password"
									radius="full"
									type={isVisible ? "text" : "password"}
									placeholder="Enter your password"
									startContent={<Lock className="h-5 w-5" />}
									endContent={
										<Button
											isIconOnly
											variant="light"
											radius="full"
											aria-label="toggle password visibility"
											className="focus:outline-none w-2"
											onPress={toggleVisibility}
										>
											{isVisible ? (
												<EyeOffIcon className=" w-5 h-5 pointer-events-none" />
											) : (
												<EyeIcon className=" w-5 h-5 pointer-events-none" />
											)}
										</Button>
									}
									value={formData.password}
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											password: e.target.value,
										}))
									}
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
							{isLoading ? <Spinner color="white" /> : "Sign Up"}
						</Button>
					</div>
				</Form>
				<p className="px-8 text-center text-sm text-gray-500">
					By clicking continue, you agree to our{" "}
					<Link
						href="/legal/terms"
						className="hover:text-purple-500 underline underline-offset-4"
					>
						Terms of Service
					</Link>{" "}
					and{" "}
					<Link
						href="/legal/privacy-policy"
						className="hover:text-purple-500 underline underline-offset-4"
					>
						Privacy Policy
					</Link>
					.
				</p>
			</div>
		</div>
	);
}

export default SignUp;
