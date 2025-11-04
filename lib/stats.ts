"use client";

import { format, startOfDay, parseISO } from "date-fns";
import { getAllSessions } from "./storage";
import type { MeditationStats } from "./types";

export function calculateStats(): MeditationStats {
	const sessions = getAllSessions();
	const today = format(new Date(), "yyyy-MM-dd");
	
	const todaySessions = sessions.filter((s) => s.date === today);
	const todayMinutes = todaySessions.reduce((sum, s) => sum + s.duration, 0);
	const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
	
	// Calculate streak: consecutive days from today going backwards
	let streak = 0;
	const uniqueDates = [...new Set(sessions.map((s) => s.date))].sort(
		(a, b) => b.localeCompare(a),
	);
	
	const todayStart = startOfDay(new Date());
	
	for (let i = 0; i < uniqueDates.length; i++) {
		const sessionDate = parseISO(uniqueDates[i] + "T00:00:00");
		const expectedDate = startOfDay(
			new Date(todayStart.getTime() - i * 24 * 60 * 60 * 1000),
		);
		
		if (
			sessionDate.getTime() === expectedDate.getTime()
		) {
			streak++;
		} else {
			break;
		}
	}
	
	return {
		totalMinutes,
		todayMinutes,
		streak,
		totalSessions: sessions.length,
	};
}

