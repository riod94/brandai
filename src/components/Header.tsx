"use client";
import React from "react";
import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenuToggle,
	NavbarMenu,
	NavbarMenuItem,
} from "@heroui/navbar";
import { Link } from "@heroui/link";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { usePathname } from "next/navigation";
import { Divider } from "@heroui/divider";
import UserMenu from "./UserMenu";
import { Sparkles } from "lucide-react";

export const BrandLogo = () => {
	return (
		<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
			<Sparkles className="w-4 h-4 text-white" />
		</div>
	);
};

export default function Header() {
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);
	const pathname = usePathname();
	const menuItems = [
		{ label: "Create Logo", link: "/create/logo" },
		{ label: "Create Brand", link: "/create/brand" },
		{ label: "Pricing", link: "/#pricing" },
		{ label: "About", link: "/about" },
	];

	return (
		<Navbar
			onMenuOpenChange={setIsMenuOpen}
			maxWidth="xl"
			className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-800/50"
		>
			<NavbarContent>
				<NavbarMenuToggle
					aria-label={isMenuOpen ? "Close menu" : "Open menu"}
					className="sm:hidden"
				/>
				<Link href="/">
					<NavbarBrand className="gap-2">
						<BrandLogo />
						<span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
							BerandAI
						</span>
					</NavbarBrand>
				</Link>
			</NavbarContent>

			<NavbarContent className="hidden sm:flex gap-6" justify="center">
				{menuItems.map((item, index) => (
					<NavbarItem key={`${item}-${index}`}>
						<Link
							color={pathname === item.link ? "primary" : "foreground"}
							href={item.link}
							className="font-medium hover:text-primary transition-colors"
						>
							{item.label}
						</Link>
					</NavbarItem>
				))}
			</NavbarContent>
			<NavbarContent justify="end">
				<NavbarItem className="hidden md:flex">
					<ThemeSwitcher />
				</NavbarItem>
				<NavbarItem>
					<UserMenu />
				</NavbarItem>
			</NavbarContent>
			<NavbarMenu className="pt-6">
				<NavbarMenuItem className="flex justify-between items-center">
					<ThemeSwitcher />
				</NavbarMenuItem>
				<Divider className="my-2" />
				{menuItems.map((item, index) => (
					<NavbarMenuItem key={`${item}-${index}`}>
						<Link
							className="w-full py-2"
							color={pathname === item.link ? "primary" : "foreground"}
							href={item.link}
							size="lg"
						>
							{item.label}
						</Link>
					</NavbarMenuItem>
				))}
			</NavbarMenu>
		</Navbar>
	);
}
