import { WhopApp } from "@whop/react/components";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { DarkModeToggle } from "@/components/DarkModeToggle";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Meditation App",
	description: "A calm, mindful meditation tracking app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
			>
				<WhopApp>
					<div className="min-h-screen pb-24 relative z-10">
						<div className="fixed top-4 right-4 z-50">
							<DarkModeToggle />
						</div>
						{children}
						<Navigation />
					</div>
				</WhopApp>
			</body>
		</html>
	);
}
