"use client";
import { Accordion, AccordionItem } from "@heroui/accordion";

const faqs = [
	{
		question: "How does the AI logo maker work?",
		answer:
			"Our AI logo maker uses advanced algorithms to generate unique logo designs based on your brand preferences, industry, and style choices. You can then customize the generated logos to perfectly match your vision.",
	},
	{
		question: "What file formats do I get?",
		answer:
			"You'll receive your logo in multiple formats including PNG, JPG, and SVG. Premium plans include additional formats and variations suitable for different use cases.",
	},
	{
		question: "Can I modify my logo after purchasing?",
		answer:
			"Yes! You can make unlimited modifications to your logo design after purchase. Our tool provides extensive customization options for colors, fonts, layouts, and more.",
	},
	{
		question: "Do I own the rights to my logo?",
		answer:
			"Absolutely! Once you purchase a logo, you receive full commercial rights to use it however you want for your business.",
	},
];

function Faq() {
	return (
		<section className="py-20 bg-gradient-to-b dark:from-gray-900 dark:to-primary/50">
			<div className="container mx-auto px-6">
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold text-primary/80 mb-4">
						Frequently Asked Questions
					</h2>
					<p className="max-w-2xl mx-auto">
						Find answers to common questions about our logo maker
					</p>
				</div>

				<div className="max-w-3xl mx-auto">
					<Accordion variant="splitted" selectionMode="multiple">
						{faqs.map((faq, index) => (
							<AccordionItem
								key={faq.question}
								aria-label={`Accordion ${index + 1}`}
								title={faq.question}
								className="bg-gradient-to-r from-primary/50 to-secondary/50"
							>
								{faq.answer}
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</div>
		</section>
	);
}

export default Faq;
