"use client";
import { Link } from "@heroui/link";
import { Sparkles, Mail, Instagram, Twitter, Github } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
			<div className="container mx-auto px-6 py-16">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-12">
					{/* Brand */}
					<div className="md:col-span-2">
						<Link href="/" className="flex items-center gap-2 mb-4">
							<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
								<Sparkles className="w-5 h-5 text-white" />
							</div>
							<span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
								BerandAI
							</span>
						</Link>
						<p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">
							Create stunning, professional logos for your brand in
							seconds with the power of artificial intelligence.
						</p>
						<div className="flex items-center gap-4">
							<a
								href={siteConfig.links.instagram}
								target="_blank"
								rel="noopener noreferrer"
								className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors"
							>
								<Instagram className="w-5 h-5" />
							</a>
							<a
								href={siteConfig.links.twitter}
								target="_blank"
								rel="noopener noreferrer"
								className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors"
							>
								<Twitter className="w-5 h-5" />
							</a>
							<a
								href={siteConfig.links.github}
								target="_blank"
								rel="noopener noreferrer"
								className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors"
							>
								<Github className="w-5 h-5" />
							</a>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h4 className="font-semibold text-gray-900 dark:text-white mb-4">
							Quick Links
						</h4>
						<ul className="space-y-3">
							<li>
								<Link
									href="/"
									className="text-gray-500 hover:text-primary transition-colors"
								>
									Home
								</Link>
							</li>
							<li>
								<Link
									href="/#pricing"
									className="text-gray-500 hover:text-primary transition-colors"
								>
									Pricing
								</Link>
							</li>
							<li>
								<Link
									href="/about"
									className="text-gray-500 hover:text-primary transition-colors"
								>
									About
								</Link>
							</li>
							<li>
								<Link
									href="/app"
									className="text-gray-500 hover:text-primary transition-colors"
								>
									Dashboard
								</Link>
							</li>
						</ul>
					</div>

					{/* Legal */}
					<div>
						<h4 className="font-semibold text-gray-900 dark:text-white mb-4">
							Legal
						</h4>
						<ul className="space-y-3">
							<li>
								<Link
									href="/legal/privacy-policy"
									className="text-gray-500 hover:text-primary transition-colors"
								>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									href="/legal/terms"
									className="text-gray-500 hover:text-primary transition-colors"
								>
									Terms of Service
								</Link>
							</li>
						</ul>
						<h4 className="font-semibold text-gray-900 dark:text-white mt-6 mb-4">
							Contact
						</h4>
						<a
							href="mailto:hello@berandai.com"
							className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors"
						>
							<Mail className="w-4 h-4" />
							hello@berandai.com
						</a>
					</div>
				</div>

				{/* Bottom */}
				<div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
					<p className="text-gray-500 text-sm">
						© {currentYear} BerandAI. All rights reserved.
					</p>
					<p className="text-gray-400 text-sm">
						Made with ❤️ in Indonesia
					</p>
				</div>
			</div>
		</footer>
	);
}
