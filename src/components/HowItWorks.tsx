import { Wand2, Paintbrush, Download } from "lucide-react";

const steps = [
	{
		icon: <Wand2 className="w-8 h-8" />,
		title: "Generate Ideas",
		description:
			"Tell us about your brand and let our AI generate unique logo concepts",
	},
	{
		icon: <Paintbrush className="w-8 h-8" />,
		title: "Customize Design",
		description:
			"Fine-tune colors, fonts, and layouts until your logo is perfect",
	},
	{
		icon: <Download className="w-8 h-8" />,
		title: "Download Files",
		description: "Get your logo in multiple formats ready for web and print",
	},
];

function HowItWorks() {
	return (
		<section className="py-20 bg-white dark:bg-gray-800">
			<div className="container mx-auto px-6">
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary/80 dark:text-primary/60">
						How It Works
					</h2>
					<p className="max-w-2xl mx-auto">
						Create your perfect logo in three simple steps
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
					{steps.map((step, index) => (
						<div key={index} className="text-center">
							<div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 text-primary">
								{step.icon}
							</div>
							<h3 className="text-xl font-semibold mb-3 text-primary/80">
								{step.title}
							</h3>
							<p>{step.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default HowItWorks;
