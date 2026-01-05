import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();

	if (!session?.user?.id) {
		redirect("/auth/sign-in?callbackUrl=/admin");
	}

	// Check if user is admin
	const user = await db.query.users.findFirst({
		where: eq(users.id, session.user.id),
		columns: { role: true },
	});

	if (user?.role !== "admin") {
		redirect("/app");
	}

	return (
		<div className="min-h-screen bg-gray-100 dark:bg-gray-950">
			<AdminSidebar />
			<main className="lg:ml-72 min-h-screen">
				<div className="p-6 lg:p-8">{children}</div>
			</main>
		</div>
	);
}
