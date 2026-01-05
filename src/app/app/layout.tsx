import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AppLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();

	if (!session?.user) {
		redirect("/auth/sign-in?callbackUrl=/app");
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-950">
			<main className="min-h-screen">
				<div className="container mx-auto px-4 py-8">{children}</div>
			</main>
		</div>
	);
}
