export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 dark:bg-gray-900">
			<div className="relative hidden h-full flex-col bg-primary/10 p-10 text-gray-500 dark:border-r lg:flex rounded-tr-[25rem]">
				<div className="absolute inset-0 bg-gray/80" />
				<div className="relative z-20 mt-auto">
					<blockquote className="space-y-2">
						<p className="text-md">
							Create stunning logos in minutes with our AI-powered
							BrandAI.
						</p>
					</blockquote>
				</div>
			</div>
			{children}
		</div>
	);
}
