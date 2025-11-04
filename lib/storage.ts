"use client";

import type { MeditationSession, MeditationReminder } from "./types";

const STORAGE_KEY = "meditation_sessions";
const REMINDER_STORAGE_KEY = "meditation_reminders";

export function getSessions(): MeditationSession[] {
	if (typeof window === "undefined") return [];
	
	try {
		const data = localStorage.getItem(STORAGE_KEY);
		return data ? JSON.parse(data) : [];
	} catch {
		return [];
	}
}

export function saveSession(session: MeditationSession): void {
	if (typeof window === "undefined") return;
	
	const sessions = getSessions();
	sessions.push(session);
	localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function getSessionsByDate(date: string): MeditationSession[] {
	const sessions = getSessions();
	return sessions.filter((s) => s.date === date);
}

export function getAllSessions(): MeditationSession[] {
	return getSessions();
}

export function deleteSession(id: string): void {
	if (typeof window === "undefined") return;
	
	const sessions = getSessions();
	const filtered = sessions.filter((s) => s.id !== id);
	localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function clearAllSessions(): void {
	if (typeof window === "undefined") return;
	localStorage.removeItem(STORAGE_KEY);
	// Also clear reminders when resetting data
	localStorage.removeItem(REMINDER_STORAGE_KEY);
}

// Reminder functions
export function getReminders(): MeditationReminder[] {
	if (typeof window === "undefined") return [];
	
	try {
		const data = localStorage.getItem(REMINDER_STORAGE_KEY);
		return data ? JSON.parse(data) : [];
	} catch {
		return [];
	}
}

export function saveReminder(reminder: MeditationReminder): void {
	if (typeof window === "undefined") return;
	
	const reminders = getReminders();
	// Remove existing reminder for the same date if any
	const filtered = reminders.filter((r) => r.date !== reminder.date);
	filtered.push(reminder);
	localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(filtered));
}

export function getReminderByDate(date: string): MeditationReminder | null {
	const reminders = getReminders();
	return reminders.find((r) => r.date === date) || null;
}

export function deleteReminder(id: string): void {
	if (typeof window === "undefined") return;
	
	const reminders = getReminders();
	const filtered = reminders.filter((r) => r.id !== id);
	localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(filtered));
}

export function clearAllReminders(): void {
	if (typeof window === "undefined") return;
	localStorage.removeItem(REMINDER_STORAGE_KEY);
}

