export interface MeditationSession {
	id: string;
	date: string; // YYYY-MM-DD format
	duration: number; // in minutes
	notes?: string;
	createdAt: string; // ISO timestamp
}

export interface MeditationStats {
	totalMinutes: number;
	todayMinutes: number;
	streak: number;
	totalSessions: number;
}

export interface MeditationReminder {
	id: string;
	date: string; // YYYY-MM-DD format
	time?: string; // HH:mm format (optional)
	createdAt: string; // ISO timestamp
}

