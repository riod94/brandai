import { Link } from "@heroui/link";

function CTASection() {
	return (
		<section className="py-20 bg-gradient-to-r from-primary/50 to-secondary/50 ">
			<div className="container mx-auto px-6 text-center">
				<h2 className="text-3xl md:text-4xl font-bold mb-6">
					Ready to Create Your Perfect Logo?
				</h2>
				<p className="text-gray/60 max-w-2xl mx-auto mb-8">
					Join thousands of businesses who have created their brand
					identity with our AI-powered logo maker
				</p>
				<Link
					href="/create"
					className="inline-block bg-white/80 text-primary/80 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-medium transition-colors"
				>
					Start Creating Now
				</Link>
			</div>
		</section>
	);
}

export default CTASection;
