function PrivacyPolicy() {
	return (
		<div className="min-h-screen">
			<div className="container mx-auto px-4 py-24">
				<div className="max-w-3xl mx-auto">
					<h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
					<div className="prose prose-lg">
						<p className="text-gray-600 mb-6">
							Last updated: {new Date().toLocaleDateString()}
						</p>

						<section className="mb-8">
							<h2 className="text-2xl font-semibold mb-4">
								1. Information We Collect
							</h2>
							<p className="mb-4">
								We collect information you provide directly to us when
								you:
							</p>
							<ul className="list-disc pl-6 mb-4">
								<li>Create an account</li>
								<li>Use our logo creation services</li>
								<li>Contact our support team</li>
								<li>Subscribe to our newsletter</li>
							</ul>
						</section>

						<section className="mb-8">
							<h2 className="text-2xl font-semibold mb-4">
								2. How We Use Your Information
							</h2>
							<p className="mb-4">
								We use the information we collect to:
							</p>
							<ul className="list-disc pl-6 mb-4">
								<li>Provide and improve our services</li>
								<li>Process your transactions</li>
								<li>Send you updates and marketing communications</li>
								<li>Respond to your comments and questions</li>
							</ul>
						</section>

						<section className="mb-8">
							<h2 className="text-2xl font-semibold mb-4">
								3. Information Sharing
							</h2>
							<p className="mb-4">
								We do not sell or rent your personal information to
								third parties. We may share your information in the
								following situations:
							</p>
							<ul className="list-disc pl-6 mb-4">
								<li>With your consent</li>
								<li>To comply with legal obligations</li>
								<li>To protect our rights and prevent fraud</li>
							</ul>
						</section>

						<section className="mb-8">
							<h2 className="text-2xl font-semibold mb-4">
								4. Security
							</h2>
							<p className="mb-4">
								We implement appropriate technical and organizational
								measures to protect your personal information against
								unauthorized access, alteration, disclosure, or
								destruction.
							</p>
						</section>

						<section className="mb-8">
							<h2 className="text-2xl font-semibold mb-4">
								5. Contact Us
							</h2>
							<p className="mb-4">
								If you have any questions about this Privacy Policy,
								please contact us at: support@brandai.com
							</p>
						</section>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PrivacyPolicy;
