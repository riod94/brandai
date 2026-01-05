"use client";
import React from "react";
import { ThemeProvider, ThemeProviderProps } from "next-themes";
import { HeroUIProvider } from "@heroui/system";
import { SessionProvider } from "next-auth/react";

export interface ProvidersProps {
	children: React.ReactNode;
	themeProps?: ThemeProviderProps;
}

export default function Provider({ children, themeProps }: ProvidersProps) {
	return (
		<SessionProvider>
			<HeroUIProvider>
				<ThemeProvider {...themeProps}>
					<main className="bg-white dark:bg-gray-900">{children}</main>
				</ThemeProvider>
			</HeroUIProvider>
		</SessionProvider>
	);
}
