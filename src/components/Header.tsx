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
import { Button } from "@heroui/button";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { usePathname } from "next/navigation";
import { Divider } from "@heroui/divider";

export const AcmeLogo = () => {
	return (
		<svg fill="none" height="36" viewBox="0 0 32 32" width="36">
			<path
				clipRule="evenodd"
				d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
				fill="currentColor"
				fillRule="evenodd"
			/>
		</svg>
	);
};

export default function App() {
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);
	const pathname = usePathname();
	const menuItems = [
		{ label: "Create Logo", link: "/create/logo" },
		{ label: "Create Brand", link: "/create/brand" },
		{ label: "About", link: "/about" },
	];

	return (
		<Navbar onMenuOpenChange={setIsMenuOpen} maxWidth="xl">
			<NavbarContent>
				<NavbarMenuToggle
					aria-label={isMenuOpen ? "Close menu" : "Open menu"}
					className="sm:hidden"
				/>
				<Link href="/">
					<NavbarBrand>
						<AcmeLogo />
						<p className="font-bold text-inherit">BrandAI</p>
					</NavbarBrand>
				</Link>
			</NavbarContent>

			<NavbarContent className="hidden sm:flex gap-4" justify="center">
				{menuItems.map((item, index) => (
					<NavbarItem key={`${item}-${index}`}>
						<Link
							color={pathname === item.link ? "primary" : "foreground"}
							href={item.link}
							className="hover:text-primary-700"
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
				{/* <NavbarItem className="hidden lg:flex">
					<Link href="/auth/sign-in">Sign In</Link>
				</NavbarItem>
				<NavbarItem>
					<Button
						as={Link}
						color="primary"
						href="/auth/sign-up"
						variant="shadow"
						radius="full"
					>
						Get Started
					</Button>
				</NavbarItem> */}
			</NavbarContent>
			<NavbarMenu>
				<NavbarMenuItem className="flex justify-between items-center">
					{/* <Link
						className="w-full"
						color={
							pathname === "/auth/sign-in" ? "primary" : "foreground"
						}
						href="/auth/sign-in"
						size="lg"
					>
						Sign In
					</Link> */}
					<ThemeSwitcher />
				</NavbarMenuItem>
				<Divider />
				{menuItems.map((item, index) => (
					<NavbarMenuItem key={`${item}-${index}`}>
						<Link
							className="w-full"
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
