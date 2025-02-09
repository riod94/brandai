import { Button } from "@heroui/button";

function Pricing() {
	const plans = [
		{
			name: "Free",
			price: "$0",
			features: [
				"1 Logo Design",
				"Basic File Formats",
				"2 Revisions",
				"24/7 Support",
			],
		},
		{
			name: "Basic",
			price: "$3",
			features: [
				"3 Logo Designs",
				"All File Formats",
				"5 Revisions",
				"Priority Support",
				"Brand Guidelines",
			],
		},
		{
			name: "Pro",
			price: "$12",
			features: [
				"10 Logo Designs",
				"All File Formats",
				"Unlimited Revisions",
				"Priority Support",
				"Brand Guidelines",
				"+$1 for 5 additional Logo Designs",
			],
		},
	];

	return (
		<section className="py-20 bg-gray-50 dark:bg-gray-900" id="pricing">
			<div className="container mx-auto px-6">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">
						Pricing Plans
					</h2>
					<p className="text-lg max-w-2xl mx-auto">
						Choose the perfect plan for your business needs
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
					{plans.map((plan) => (
						<div
							key={plan.name}
							className="border rounded-xl p-6 hover:shadow-lg transition-shadow"
						>
							<h2 className="text-2xl font-bold mb-4">{plan.name}</h2>
							<p className="text-4xl font-bold mb-6 text-primary/80">
								{plan.price}
							</p>
							<ul className="space-y-3">
								{plan.features.map((feature) => (
									<li key={feature} className="flex items-center">
										<svg
											className="w-5 h-5 mr-2"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M5 13l4 4L19 7"
											></path>
										</svg>
										{feature}
									</li>
								))}
							</ul>
							<Button
								variant="shadow"
								radius="full"
								size="lg"
								color="primary"
								className="w-full mt-8"
							>
								Choose {plan.name}
							</Button>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default Pricing;
