const testimonials = [
	{
		name: "Sarah Johnson",
		role: "Startup Founder",
		content:
			"The AI logo maker helped me create a professional logo for my startup in minutes. Couldn't be happier with the results!",
		avatar:
			"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=256&h=256&fit=crop",
	},
	{
		name: "David Chen",
		role: "Creative Director",
		content:
			"I was skeptical about AI-generated logos, but the quality and customization options really impressed me. Great tool!",
		avatar:
			"https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=256&h=256&fit=crop",
	},
	{
		name: "Emily Rodriguez",
		role: "Small Business Owner",
		content:
			"Affordable, fast, and professional. This platform made getting a logo for my business so much easier than I expected.",
		avatar:
			"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop",
	},
];

function Testimonials() {
	return (
		<section className="py-20 bg-gray-50 dark:bg-gray-900">
			<div className="container mx-auto px-6">
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold text-primary/80 dark:text-primary/60 mb-4">
						What Our Customers Say
					</h2>
					<p className="max-w-2xl mx-auto">
						Join thousands of satisfied customers who have created their
						perfect logo with us
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{testimonials.map((testimonial) => (
						<div
							key={testimonial.name}
							className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
						>
							<div className="flex items-center mb-6">
								<img
									src={testimonial.avatar}
									alt={testimonial.name}
									className="w-12 h-12 rounded-full object-cover mr-4"
								/>
								<div>
									<h3 className="text-lg font-semibold text-primary/80">
										{testimonial.name}
									</h3>
									<p className="text-primary/60 text-sm">
										{testimonial.role}
									</p>
								</div>
							</div>
							<p className="italic">"{testimonial.content}"</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default Testimonials;
