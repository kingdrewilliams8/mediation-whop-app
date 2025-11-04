"use client";

const GOAL_STORAGE_KEY = "daily_goal";
const GOAL_DATE_KEY = "daily_goal_date";

export function getTodayGoal(): string {
	if (typeof window === "undefined") return "";
	
	try {
		const savedDate = localStorage.getItem(GOAL_DATE_KEY);
		const today = new Date().toDateString();
		
		// If the goal is from a different day, clear it
		if (savedDate !== today) {
			localStorage.removeItem(GOAL_STORAGE_KEY);
			localStorage.removeItem(GOAL_DATE_KEY);
			return "";
		}
		
		return localStorage.getItem(GOAL_STORAGE_KEY) || "";
	} catch {
		return "";
	}
}

export function saveTodayGoal(goal: string): void {
	if (typeof window === "undefined") return;
	
	try {
		const today = new Date().toDateString();
		localStorage.setItem(GOAL_STORAGE_KEY, goal);
		localStorage.setItem(GOAL_DATE_KEY, today);
	} catch {
		// Ignore errors
	}
}

