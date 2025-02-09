function About() {
	return (
		<div className="min-h-screen bg-white dark:bg-gray-900">
			<div className="pt-20 container mx-auto px-6">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-4xl font-bold mb-8">About Us</h1>
					<div className="prose prose-lg">
						<p className="text-lg mb-6">
							We're passionate about helping businesses create stunning,
							professional logos that truly represent their brand. Our
							AI-powered logo maker combines cutting-edge technology with
							intuitive design principles to deliver exceptional results.
						</p>
						<h2 className="text-2xl font-bold mt-12 mb-4">Our Mission</h2>
						<p className="text-lg mb-6">
							To democratize professional logo design by making it
							accessible, affordable, and effortless for businesses of
							all sizes.
						</p>
						<h2 className="text-2xl font-bold mt-12 mb-4">
							How It Works
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
							<div className="text-center">
								<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
									<span className="text-2xl font-bold text-primary">
										1
									</span>
								</div>
								<h3 className="text-xl font-semibold mb-2">
									Describe Your Brand
								</h3>
								<p>
									Tell us about your business and design preferences
								</p>
							</div>
							<div className="text-center">
								<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
									<span className="text-2xl font-bold text-primary">
										2
									</span>
								</div>
								<h3 className="text-xl font-semibold mb-2">
									Generate Options
								</h3>
								<p>
									Our AI creates multiple logo designs based on your
									input
								</p>
							</div>
							<div className="text-center">
								<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
									<span className="text-2xl font-bold text-primary">
										3
									</span>
								</div>
								<h3 className="text-xl font-semibold mb-2">
									Customize & Download
								</h3>
								<p>
									Fine-tune your favorite design and download the files
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default About;
