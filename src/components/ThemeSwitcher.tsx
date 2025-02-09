"use client";

import { Button } from "@heroui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<Button
			isIconOnly
			onPress={() => setTheme(theme === "light" ? "dark" : "light")}
			variant="shadow"
            radius="full"
		>
			{theme === "dark" ? (
				<SunIcon className="h-4 w-4" />
			) : (
				<MoonIcon className="h-4 w-4" />
			)}
		</Button>
	);
}
