"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function DarkModeToggle() {
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		const darkMode = localStorage.getItem("darkMode") === "true";
		setIsDark(darkMode);
		if (darkMode) {
			document.documentElement.classList.add("dark");
		}
	}, []);

	const toggleDarkMode = () => {
		const newValue = !isDark;
		setIsDark(newValue);
		localStorage.setItem("darkMode", String(newValue));
		if (newValue) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	};

	return (
		<button
			onClick={toggleDarkMode}
			className="p-2 rounded-full bg-gray-a2 border border-gray-a4 hover:bg-gray-a3 transition-colors"
			aria-label="Toggle dark mode"
		>
			{isDark ? (
				<Sun className="w-5 h-5 text-gray-11" />
			) : (
				<Moon className="w-5 h-5 text-gray-11" />
			)}
		</button>
	);
}

