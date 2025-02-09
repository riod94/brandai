"use client";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { useState } from "react";

export default function Hero() {
	const [company, setCompany] = useState("");

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800">
			<div className="container mx-auto px-6">
				<div className="flex flex-col items-center text-center max-w-4xl mx-auto animate-fade-in">
					<Chip color="secondary" variant="flat">
						AI-Powered Logo Generator
					</Chip>
					<h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-primary/80 to-secondary/80 dark:from-primary/95 dark:to-secondary/95 inline-block text-transparent bg-clip-text">
						Create Your Perfect Logo in Minutes
					</h1>
					<p className="text-lg mb-8 max-w-2xl">
						Design a professional logo for your brand with our easy-to-use
						AI logo maker. No design experience needed.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl">
						<Input
							name="logoName"
							type="text"
							radius="full"
							variant="flat"
							size="lg"
							color="primary"
							value={company}
							placeholder="Enter your company name"
							onChange={(e) => setCompany(e.target.value)}
						/>
						<Button
							variant="shadow"
							color="primary"
							radius="full"
							size="lg"
							className="px-8"
							as={Link}
							href={
								company
									? `/create/logo?logoName=${encodeURIComponent(company)}`
									: "#"
							}
						>
							Create Your Logo
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
