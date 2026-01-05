"use client";
import { Link } from "@heroui/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Coins, User, Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
	{ label: "Dashboard", href: "/app", icon: LayoutDashboard },
	{ label: "Credits", href: "/app/credits", icon: Coins },
	{ label: "Profile", href: "/app/profile", icon: User },
];

export default function AppSidebar() {
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			{/* Mobile Toggle */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="fixed top-20 left-4 z-50 p-2 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 lg:hidden"
			>
				{isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
			</button>

			{/* Overlay */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-40 lg:hidden"
					onClick={() => setIsOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40 transform transition-transform duration-300 lg:translate-x-0 ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="flex flex-col h-full">
					{/* Logo */}
					<div className="p-6 border-b border-gray-100 dark:border-gray-800">
						<Link href="/" className="flex items-center gap-2">
							<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
								<Sparkles className="w-5 h-5 text-white" />
							</div>
							<span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
								BerandAI
							</span>
						</Link>
					</div>

					{/* Navigation */}
					<nav className="flex-1 p-4 space-y-2">
						{navItems.map((item) => {
							const Icon = item.icon;
							const isActive = pathname === item.href;

							return (
								<Link
									key={item.href}
									href={item.href}
									onClick={() => setIsOpen(false)}
									className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
										isActive
											? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-semibold"
											: "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
									}`}
								>
									<Icon
										className={`w-5 h-5 ${
											isActive ? "text-primary" : ""
										}`}
									/>
									{item.label}
								</Link>
							);
						})}
					</nav>

					{/* Create Button */}
					<div className="p-4 border-t border-gray-100 dark:border-gray-800">
						<Link
							href="/create/logo"
							className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:opacity-90 transition-opacity"
						>
							<Sparkles className="w-5 h-5" />
							Create Logo
						</Link>
					</div>
				</div>
			</aside>
		</>
	);
}
