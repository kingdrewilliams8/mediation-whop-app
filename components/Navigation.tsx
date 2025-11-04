"use client";

import { Button } from "@whop/react/components";
import { Calendar, Home, Timer, Plus, Settings, Music, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
	const pathname = usePathname();

	const navItems = [
		{ href: "/", label: "Home", icon: Home },
		{ href: "/tracker", label: "Tracker", icon: Plus },
		{ href: "/timer", label: "Timer", icon: Timer },
		{ href: "/community", label: "Community", icon: Users },
		{ href: "/soothing-sounds", label: "Sounds", icon: Music },
		{ href: "/settings", label: "Settings", icon: Settings },
	];

	const navColors: Record<string, string> = {
		"/": "#2dd4bf", // Teal
		"/calendar": "#60a5fa", // Blue
		"/tracker": "#fb923c", // Orange
		"/timer": "#a78bfa", // Purple
		"/community": "#22c55e", // Green
		"/soothing-sounds": "#60a5fa", // Blue
		"/settings": "#f472b6", // Pink
	};

	return (
		<nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
			<div className="flex gap-2 backdrop-blur-lg border-2 rounded-full px-2 py-2 shadow-lg"
				style={{
					backgroundColor: "rgba(26, 26, 26, 0.8)",
					borderColor: navColors[pathname] || "rgba(156, 163, 175, 0.3)"
				}}
			>
				{navItems.map((item) => {
					const Icon = item.icon;
					const isActive = pathname === item.href;
					const itemColor = navColors[item.href] || "#9ca3af";
					return (
						<Link key={item.href} href={item.href}>
							<Button
								variant="ghost"
								size="3"
								className="rounded-full transition-all"
								style={{
									backgroundColor: isActive ? `${itemColor}40` : "transparent",
									borderColor: isActive ? itemColor : "transparent",
									borderWidth: isActive ? "2px" : "0px"
								}}
							>
								<Icon 
									className="w-4 h-4 mr-1.5" 
									style={{ color: isActive ? itemColor : "#9ca3af" }}
								/>
								<span style={{ color: isActive ? itemColor : "#9ca3af" }}>
									{item.label}
								</span>
							</Button>
						</Link>
					);
				})}
			</div>
		</nav>
	);
}

