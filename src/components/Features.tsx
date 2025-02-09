import { CircleCheck, Sparkles, Clock, Palette } from "lucide-react";

const features = [
	{
		icon: <Sparkles className="w-6 h-6" />,
		title: "AI-Powered Design",
		description:
			"Our advanced AI creates unique, professional logos tailored to your brand",
	},
	{
		icon: <Clock className="w-6 h-6" />,
		title: "Quick & Easy",
		description: "Create your logo in minutes with our intuitive interface",
	},
	{
		icon: <Palette className="w-6 h-6" />,
		title: "Customizable",
		description: "Fine-tune every aspect of your logo until it's perfect",
	},
	{
		icon: <CircleCheck className="w-6 h-6" />,
		title: "Professional Quality",
		description: "Get high-resolution files ready for web and print",
	},
];

function Features() {
	return (
		<section className="py-20 bg-white dark:bg-gray-800">
			<div className="container mx-auto px-6">
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary/80">
						Why Choose BrandAI
					</h2>
					<p className=" max-w-2xl mx-auto">
						Create stunning logos effortlessly with our powerful features
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{features.map((feature) => (
						<div
							key={feature.title}
							className="p-6 rounded-2xl bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-950 hover:shadow-lg transition-all duration-300 group"
						>
							<div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/80 group-hover:text-white transition-all duration-300">
								{feature.icon}
							</div>
							<h3 className="text-xl font-semibold mb-2 text-primary/60 dark:text-white/80 group-hover:text-primary dark:hover:text-primary/80">
								{feature.title}
							</h3>
							<p>{feature.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default Features;
