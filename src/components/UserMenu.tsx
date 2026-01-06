"use client";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import {
	LogOut,
	User,
	CreditCard,
	LayoutDashboard,
	Coins,
	Settings,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

interface UserCredits {
	credits: number;
	plan: string;
	hasUnlimited: boolean;
	role: string;
}

const navItems = [
	{ label: "Dashboard", href: "/app", icon: LayoutDashboard },
	{ label: "Credits", href: "/app/credits", icon: Coins },
	{ label: "Profile", href: "/app/profile", icon: User },
	{ label: "Admin Panel", href: "/admin", icon: Settings },
];

export default function UserMenu() {
	const { data: session, status } = useSession();
	const [isOpen, setIsOpen] = useState(false);
	const [userCredits, setUserCredits] = useState<UserCredits | null>(null);
	const menuRef = useRef<HTMLDivElement>(null);
	const router = useRouter();
	const pathname = usePathname();

	// filter navItems based on user role
	const filteredNavItems = navItems.filter((item) => {
		if (item.href === "/admin") {
			return userCredits?.role === "admin";
		}
		return true;
	});

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		if (session?.user) {
			fetch("/api/user/credits")
				.then((res) => res.json())
				.then((data) => {
					if (!data.error) {
						setUserCredits(data);
					}
				})
				.catch(console.error);
		}
	}, [session]);

	if (status === "loading") {
		return (
			<div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
		);
	}

	if (!session?.user) {
		return (
			<div className="flex gap-2">
				<Button
					as={Link}
					href="/auth/sign-in"
					variant="light"
					radius="full"
					color="primary"
				>
					Sign In
				</Button>
				<Button
					as={Link}
					href="/auth/sign-up"
					variant="shadow"
					radius="full"
					color="primary"
				>
					Get Started
				</Button>
			</div>
		);
	}

	const initials = session.user.name
		? session.user.name
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2)
		: session.user.email?.slice(0, 2).toUpperCase() || "U";

	const handleNavClick = ({ href }: { href: string }) => {
		setIsOpen(false);
		router.push(href);
	};

	return (
		<div className="flex items-center gap-3">
			{/* Credit Badge */}
			<Link
				href="/app/credits"
				className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 hover:border-amber-500/40 transition-colors"
			>
				<Coins className="w-4 h-4 text-amber-500" />
				<span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
					{userCredits?.hasUnlimited ? (
						<span className="text-emerald-500">∞</span>
					) : (
						userCredits?.credits ?? 0
					)}
				</span>
			</Link>

			{/* User Avatar Dropdown */}
			<div className="relative" ref={menuRef}>
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
				>
					{session.user.image ? (
						<img
							src={session.user.image}
							alt={session.user.name || "User"}
							className="w-10 h-10 rounded-full object-cover border-2 border-primary"
						/>
					) : (
						<div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
							{initials}
						</div>
					)}
				</button>

				{isOpen && (
					<div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50 overflow-hidden">
						{/* User Info */}
						<div className="px-4 py-3 bg-gradient-to-br from-primary/5 to-secondary/5">
							<p className="text-sm font-semibold truncate">
								{session.user.name || "User"}
							</p>
							<p className="text-xs text-gray-500 truncate">
								{session.user.email}
							</p>
							{/* Mobile Credit Display */}
							<div className="mt-2 sm:hidden flex items-center gap-2">
								<Coins className="w-4 h-4 text-amber-500" />
								<span className="text-sm font-semibold">
									{userCredits?.hasUnlimited
										? "Unlimited"
										: `${userCredits?.credits ?? 0} credits`}
								</span>
							</div>
						</div>

						<div className="py-2">
							{filteredNavItems.map((item) => {
								const Icon = item.icon;
								const isActive = pathname === item.href;

								return (
									<Link
										key={item.href}
										href={item.href}
										onPress={() => handleNavClick(item)}
										className={`flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
											isActive
												? "bg-gray-100 dark:bg-gray-800 text-primary font-semibold"
												: "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
										}`}
									>
										<Icon
											className={`w-4 h-4 ${
												isActive ? "text-primary" : ""
											}`}
										/>
										{item.label}
									</Link>
								);
							})}
						</div>

						<div className="border-t border-gray-100 dark:border-gray-700 pt-2">
							<button
								onClick={() => signOut({ callbackUrl: "/" })}
								className="flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full"
							>
								<LogOut className="w-4 h-4" />
								Sign Out
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
