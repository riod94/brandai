"use client";
import React from "react";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider, ThemeProviderProps } from "next-themes";

export interface ProvidersProps {
	children: React.ReactNode;
	themeProps?: ThemeProviderProps;
}

export default function Provider({ children, themeProps }: ProvidersProps) {
	return (
		<HeroUIProvider>
			<ThemeProvider {...themeProps}>
				<main className="bg-white dark:bg-gray-900">{children}</main>
			</ThemeProvider>
		</HeroUIProvider>
	);
}
