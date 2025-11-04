import { redirect } from "next/navigation";

export default async function DashboardPage() {
	// Redirect to the main dashboard/home page
	redirect("/");
}
