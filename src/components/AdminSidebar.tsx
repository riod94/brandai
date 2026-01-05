"use client";
import { Link } from "@heroui/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
	LayoutDashboard,
	Users,
	CreditCard,
	Settings,
	Menu,
	X,
	Shield,
	Sun,
	Moon,
} from "lucide-react";
import { useState, useEffect } from "react";

const navItems = [
	{ label: "Dashboard", href: "/admin", icon: LayoutDashboard },
	{ label: "Users", href: "/admin/users", icon: Users },
	{ label: "Transactions", href: "/admin/transactions", icon: CreditCard },
	{ label: "Pricing", href: "/admin/pricing", icon: Settings },
];

export default function AdminSidebar() {
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

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
					<div className="p-6 border-b border-gray-200 dark:border-gray-800">
						<Link href="/admin" className="flex items-center gap-2">
							<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
								<Shield className="w-5 h-5 text-white" />
							</div>
							<div>
								<span className="text-xl font-bold text-gray-900 dark:text-white">
									BerandAI
								</span>
								<span className="text-xs text-red-500 block">
									Admin Panel
								</span>
							</div>
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
											? "bg-red-500/10 text-red-500 font-semibold"
											: "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
									}`}
								>
									<Icon
										className={`w-5 h-5 ${
											isActive ? "text-red-500" : ""
										}`}
									/>
									{item.label}
								</Link>
							);
						})}
					</nav>

					{/* Footer */}
					<div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
						{/* Theme Toggle */}
						<button
							onClick={() =>
								setTheme(theme === "dark" ? "light" : "dark")
							}
							className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
						>
							{mounted && (
								<>
									{theme === "dark" ? (
										<Sun className="w-4 h-4" />
									) : (
										<Moon className="w-4 h-4" />
									)}
									<span className="text-sm">
										{theme === "dark" ? "Light Mode" : "Dark Mode"}
									</span>
								</>
							)}
						</button>

						{/* Back to App */}
						<Link
							href="/app"
							className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
						>
							← Back to App
						</Link>
					</div>
				</div>
			</aside>
		</>
	);
}
