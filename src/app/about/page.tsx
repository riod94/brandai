import { Sparkles, Target, Zap, Users, Heart, Globe } from "lucide-react";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";

export default function AboutPage() {
	const values = [
		{
			icon: Target,
			title: "Innovation",
			description:
				"Pushing the boundaries of AI to create tools that were once impossible.",
			color: "from-blue-500 to-cyan-500",
		},
		{
			icon: Zap,
			title: "Speed",
			description:
				"Delivering professional results in seconds, not days or weeks.",
			color: "from-amber-500 to-orange-500",
		},
		{
			icon: Users,
			title: "Accessibility",
			description:
				"Making professional design accessible to everyone, regardless of skill level.",
			color: "from-emerald-500 to-teal-500",
		},
		{
			icon: Heart,
			title: "Passion",
			description:
				"We love what we do, and it shows in every logo we help create.",
			color: "from-pink-500 to-rose-500",
		},
	];

	const stats = [
		{ value: "10K+", label: "Logos Created" },
		{ value: "5K+", label: "Happy Users" },
		{ value: "99%", label: "Satisfaction Rate" },
		{ value: "24/7", label: "AI Available" },
	];

	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="relative pt-32 pb-20 overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
				<div className="container mx-auto px-6 relative">
					<div className="max-w-3xl mx-auto text-center">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
							<Sparkles className="w-4 h-4" />
							About BerandAI
						</div>
						<h1 className="text-4xl md:text-6xl font-bold mb-6">
							<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
								Empowering Brands
							</span>
							<br />
							with AI
						</h1>
						<p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
							We believe every business deserves a stunning logo. That's
							why we built BerandAI — to make professional logo design
							accessible, affordable, and instant.
						</p>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-16 bg-gray-50 dark:bg-gray-900/50">
				<div className="container mx-auto px-6">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
						{stats.map((stat) => (
							<div key={stat.label} className="text-center">
								<p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
									{stat.value}
								</p>
								<p className="text-gray-500 dark:text-gray-400">
									{stat.label}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Mission Section */}
			<section className="py-24">
				<div className="container mx-auto px-6">
					<div className="max-w-4xl mx-auto">
						<div className="grid md:grid-cols-2 gap-12 items-center">
							<div>
								<h2 className="text-3xl md:text-4xl font-bold mb-6">
									Our Mission
								</h2>
								<p className="text-lg text-gray-500 dark:text-gray-400 mb-6">
									To democratize professional logo design by harnessing
									the power of artificial intelligence.
								</p>
								<p className="text-gray-500 dark:text-gray-400">
									We understand that a great logo is the foundation of
									any successful brand. But working with designers can
									be expensive and time-consuming. BerandAI bridges
									that gap by offering instant, AI-powered logo
									generation at a fraction of the cost.
								</p>
							</div>
							<div className="relative">
								<div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 p-8 flex items-center justify-center">
									<Globe className="w-32 h-32 text-primary/50" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Values Section */}
			<section className="py-24 bg-gray-50 dark:bg-gray-900/50">
				<div className="container mx-auto px-6">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							Our Values
						</h2>
						<p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
							The principles that guide everything we do at BerandAI.
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
						{values.map((value) => {
							const Icon = value.icon;
							return (
								<div
									key={value.title}
									className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
								>
									<div
										className={`w-12 h-12 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-4`}
									>
										<Icon className="w-6 h-6 text-white" />
									</div>
									<h3 className="text-xl font-bold mb-2">
										{value.title}
									</h3>
									<p className="text-gray-500 dark:text-gray-400">
										{value.description}
									</p>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* How It Works */}
			<section className="py-24">
				<div className="container mx-auto px-6">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							How It Works
						</h2>
						<p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
							Create your perfect logo in just three simple steps.
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
						<div className="text-center">
							<div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mx-auto mb-6">
								<span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
									1
								</span>
							</div>
							<h3 className="text-xl font-bold mb-2">
								Describe Your Brand
							</h3>
							<p className="text-gray-500 dark:text-gray-400">
								Tell us your brand name, industry, and preferred style
								and colors.
							</p>
						</div>
						<div className="text-center">
							<div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mx-auto mb-6">
								<span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
									2
								</span>
							</div>
							<h3 className="text-xl font-bold mb-2">
								AI Generates Options
							</h3>
							<p className="text-gray-500 dark:text-gray-400">
								Our AI creates unique, professional logo designs based
								on your input.
							</p>
						</div>
						<div className="text-center">
							<div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mx-auto mb-6">
								<span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
									3
								</span>
							</div>
							<h3 className="text-xl font-bold mb-2">Download & Use</h3>
							<p className="text-gray-500 dark:text-gray-400">
								Download your logo in multiple formats, ready for any
								use case.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-24 bg-gradient-to-br from-primary to-secondary">
				<div className="container mx-auto px-6 text-center">
					<h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
						Ready to Create Your Logo?
					</h2>
					<p className="text-white/80 max-w-xl mx-auto mb-8">
						Join thousands of businesses who have already created their
						perfect logo with BerandAI.
					</p>
					<Button
						as={Link}
						href="/auth/sign-up"
						size="lg"
						radius="full"
						className="bg-white text-primary font-semibold px-8"
					>
						Get Started Free
					</Button>
				</div>
			</section>
		</div>
	);
}
