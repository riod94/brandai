"use client";
import { Suspense, useState } from "react";
import { Mail, Lock, EyeIcon, EyeOffIcon } from "lucide-react";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Form } from "@heroui/form";
import { Divider } from "@heroui/divider";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function SignInContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || "/create/logo";
	const error = searchParams.get("error");

	const [isLoading, setIsLoading] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [errorMessage, setErrorMessage] = useState(
		error ? "Invalid credentials" : ""
	);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const toggleVisibility = () => setIsVisible(!isVisible);

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setErrorMessage("");

		try {
			const result = await signIn("credentials", {
				email: formData.email,
				password: formData.password,
				redirect: false,
			});

			if (result?.error) {
				setErrorMessage("Invalid email or password");
			} else {
				router.push(callbackUrl);
				router.refresh();
			}
		} catch (error) {
			setErrorMessage("An error occurred. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleOAuthSignIn = async (provider: string) => {
		setIsLoading(true);
		await signIn(provider, { callbackUrl });
	};

	return (
		<div className="lg:p-8">
			<Link
				href="/auth/sign-up"
				className="absolute right-4 top-4 md:right-8 md:top-8"
			>
				<Button variant="light" radius="full" color="primary">
					Create account
				</Button>
			</Link>
			<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
				<div className="flex flex-col space-y-2 text-center">
					<h1 className="text-2xl font-semibold tracking-tight">
						Welcome back
					</h1>
					<p className="text-sm text-gray-500">
						Enter your email to sign in to your account
					</p>
				</div>

				{errorMessage && (
					<div className="bg-danger-50 text-danger-500 p-3 rounded-lg text-sm text-center">
						{errorMessage}
					</div>
				)}

				{/* OAuth Buttons */}
				<div className="grid grid-cols-2 gap-4">
					<Button
						variant="bordered"
						radius="full"
						onPress={() => handleOAuthSignIn("google")}
						isDisabled={isLoading}
					>
						<svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							/>
							<path
								fill="currentColor"
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							/>
							<path
								fill="currentColor"
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							/>
							<path
								fill="currentColor"
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							/>
						</svg>
						Google
					</Button>
					<Button
						variant="bordered"
						radius="full"
						onPress={() => handleOAuthSignIn("github")}
						isDisabled={isLoading}
					>
						<svg
							className="w-5 h-5 mr-2"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
						</svg>
						GitHub
					</Button>
				</div>

				<div className="relative">
					<Divider />
					<span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-sm text-gray-500">
						or continue with
					</span>
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
									value={formData.email}
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
							{isLoading ? <Spinner color="white" /> : "Sign In"}
						</Button>
					</div>
				</Form>
				<div className="text-center">
					<Link
						href="/auth/reset"
						className="text-sm text-gray-500 hover:text-primary/80"
					>
						Forgot your password?
					</Link>
				</div>
			</div>
		</div>
	);
}

export default function SignIn() {
	return (
		<Suspense
			fallback={
				<div className="flex items-center justify-center min-h-screen">
					<Spinner size="lg" />
				</div>
			}
		>
			<SignInContent />
		</Suspense>
	);
}
