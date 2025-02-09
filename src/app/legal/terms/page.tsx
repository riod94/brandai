function Terms() {
	return (
		<div className="min-h-screen">
			<div className="container mx-auto px-4 py-24">
				<div className="max-w-3xl mx-auto">
					<h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
					<div className="prose prose-lg">
						<p className="text-gray-600 mb-6">
							Last updated: {new Date().toLocaleDateString()}
						</p>

						<section className="mb-8">
							<h2 className="text-2xl font-semibold mb-4">
								1. Acceptance of Terms
							</h2>
							<p className="mb-4">
								By accessing and using this website, you accept and
								agree to be bound by the terms and provision of this
								agreement.
							</p>
						</section>

						<section className="mb-8">
							<h2 className="text-2xl font-semibold mb-4">
								2. Use License
							</h2>
							<p className="mb-4">
								Upon purchasing a logo, you are granted:
							</p>
							<ul className="list-disc pl-6 mb-4">
								<li>Full commercial usage rights</li>
								<li>Unlimited revisions during the design process</li>
								<li>High-resolution files in multiple formats</li>
								<li>Full ownership rights to the final design</li>
							</ul>
						</section>

						<section className="mb-8">
							<h2 className="text-2xl font-semibold mb-4">
								3. Restrictions
							</h2>
							<p className="mb-4">You may not:</p>
							<ul className="list-disc pl-6 mb-4">
								<li>Resell or redistribute our logo design tools</li>
								<li>Use our service for illegal purposes</li>
								<li>Attempt to reverse engineer our software</li>
								<li>Share your account credentials</li>
							</ul>
						</section>

						<section className="mb-8">
							<h2 className="text-2xl font-semibold mb-4">
								4. Payment Terms
							</h2>
							<p className="mb-4">
								All payments are processed securely through our payment
								providers. Prices are subject to change without notice.
							</p>
						</section>

						<section className="mb-8">
							<h2 className="text-2xl font-semibold mb-4">
								5. Refund Policy
							</h2>
							<p className="mb-4">
								We offer a 100% satisfaction guarantee. If you're not
								happy with your logo, we'll work with you to make it
								right or provide a full refund.
							</p>
						</section>

						<section className="mb-8">
							<h2 className="text-2xl font-semibold mb-4">
								6. Contact Information
							</h2>
							<p className="mb-4">
								Questions about the Terms of Service should be sent to
								us at: support@brandai.com
							</p>
						</section>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Terms;
