"use client";

import { Button } from "@whop/react/components";
import { motion } from "framer-motion";
import {
	format,
	startOfMonth,
	endOfMonth,
	eachDayOfInterval,
	isSameMonth,
	isToday,
	addMonths,
	subMonths,
	getDay,
	parseISO,
	isFuture,
	startOfDay,
} from "date-fns";
import { ChevronLeft, ChevronRight, Bell, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllSessions, getSessionsByDate, getReminderByDate, saveReminder, deleteReminder } from "@/lib/storage";
import type { MeditationSession, MeditationReminder } from "@/lib/types";

export default function CalendarPage() {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [sessions, setSessions] = useState<MeditationSession[]>([]);
	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	const [selectedSessions, setSelectedSessions] = useState<
		MeditationSession[]
	>([]);
	const [selectedReminder, setSelectedReminder] = useState<MeditationReminder | null>(null);
	const [reminderTime, setReminderTime] = useState("09:00");

	useEffect(() => {
		const loadSessions = () => {
			setSessions(getAllSessions());
		};
		loadSessions();
		const interval = setInterval(loadSessions, 1000);
		return () => clearInterval(interval);
	}, []);

	const monthStart = startOfMonth(currentDate);
	const monthEnd = endOfMonth(currentDate);
	const daysInMonth = eachDayOfInterval({
		start: monthStart,
		end: monthEnd,
	});

	const firstDayOfWeek = getDay(monthStart);
	const days = [...Array.from({ length: firstDayOfWeek }, () => null), ...daysInMonth];

	const getSessionsForDate = (date: Date): MeditationSession[] => {
		const dateStr = format(date, "yyyy-MM-dd");
		return getSessionsByDate(dateStr);
	};

	const handleDateClick = (date: Date) => {
		const dateStr = format(date, "yyyy-MM-dd");
		setSelectedDate(dateStr);
		const dateSessions = getSessionsForDate(date);
		setSelectedSessions(dateSessions);
		const reminder = getReminderByDate(dateStr);
		setSelectedReminder(reminder);
		if (reminder && reminder.time) {
			setReminderTime(reminder.time);
		} else {
			setReminderTime("09:00");
		}
	};

	const handleSetReminder = () => {
		if (!selectedDate) return;
		const reminder: MeditationReminder = {
			id: `reminder-${Date.now()}`,
			date: selectedDate,
			time: reminderTime,
			createdAt: new Date().toISOString(),
		};
		saveReminder(reminder);
		setSelectedReminder(reminder);
	};

	const handleDeleteReminder = () => {
		if (selectedReminder) {
			deleteReminder(selectedReminder.id);
			setSelectedReminder(null);
		}
	};

	// Helper function to parse date string (yyyy-MM-dd) as local date
	const parseLocalDate = (dateStr: string): Date => {
		const [year, month, day] = dateStr.split("-").map(Number);
		return new Date(year, month - 1, day);
	};

	useEffect(() => {
		if (selectedDate) {
			const date = parseISO(selectedDate + "T00:00:00");
			setSelectedSessions(getSessionsForDate(date));
		}
	}, [sessions, selectedDate]);

	const previousMonth = () => {
		setCurrentDate(subMonths(currentDate, 1));
		setSelectedDate(null);
	};

	const nextMonth = () => {
		setCurrentDate(addMonths(currentDate, 1));
		setSelectedDate(null);
	};

	return (
		<div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative">
			{/* Decorative elements */}
			<div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl -z-10" />
			<div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -z-10" />

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="mb-8"
			>
				<h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-8 text-center">
					Meditation Calendar
				</h1>

				<div className="flex items-center justify-between mb-6">
					<Button
						variant="ghost"
						size="3"
						onClick={previousMonth}
						className="rounded-full"
					>
						<ChevronLeft className="w-5 h-5" />
					</Button>
					<h2 className="text-2xl font-semibold text-gray-12">
						{format(currentDate, "MMMM yyyy")}
					</h2>
					<Button
						variant="ghost"
						size="3"
						onClick={nextMonth}
						className="rounded-full"
					>
						<ChevronRight className="w-5 h-5" />
					</Button>
				</div>

				<div className="grid grid-cols-7 gap-2 mb-4">
					{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
						(day) => (
							<div
								key={day}
								className="text-center text-sm font-medium text-gray-10 py-2"
							>
								{day}
							</div>
						),
					)}
				</div>

				<div className="grid grid-cols-7 gap-2">
					{days.map((day, idx) => {
						if (day === null) {
							return <div key={`empty-${idx}`} />;
						}

						const daySessions = getSessionsForDate(day);
						const hasSessions = daySessions.length > 0;
						const isCurrentDay = isToday(day);
						const isCurrentMonth = isSameMonth(day, currentDate);
						const dayStr = format(day, "yyyy-MM-dd");
						const isSelected = selectedDate === dayStr;
						const isFutureDate = isFuture(startOfDay(day));
						const reminder = getReminderByDate(dayStr);
						const hasReminder = reminder !== null;

						return (
							<motion.button
								key={dayStr}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => handleDateClick(day)}
								className={`
									aspect-square rounded-lg p-2 border transition-all
									${
										isSelected
											? "bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-purple-400"
											: "bg-gray-a2/80 backdrop-blur-sm border-gray-a4 hover:bg-gray-a3"
									}
									${!isCurrentMonth ? "opacity-40" : ""}
									${isCurrentDay ? "ring-2 ring-cyan-400 shadow-lg" : ""}
									${hasSessions ? "border-green-400 border-2 bg-green-500/10" : ""}
									${hasReminder ? "border-yellow-400 border-2 bg-yellow-500/10" : ""}
								`}
							>
								<div className="text-sm font-medium text-gray-12 mb-1">
									{format(day, "d")}
								</div>
								{hasSessions && (
									<div className="flex gap-1 justify-center">
										{daySessions.map((_, i) => (
											<div
												key={i}
												className="w-1.5 h-1.5 rounded-full bg-green-9"
											/>
										))}
									</div>
								)}
								{hasReminder && (
									<div className="flex justify-center mt-1">
										<Bell className="w-3 h-3 text-yellow-400" />
									</div>
								)}
							</motion.button>
						);
					})}
				</div>

				{selectedDate && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="mt-8 bg-gradient-to-br from-purple-600 to-blue-600 border-2 border-purple-400 rounded-2xl p-6"
					>
						<h3 className="text-xl font-semibold text-gray-12 mb-4">
							{format(parseLocalDate(selectedDate), "EEEE, MMMM d, yyyy")}
						</h3>
						
						{/* Reminder Section */}
						{isFuture(startOfDay(parseISO(selectedDate + "T00:00:00"))) && (
							<div className="mb-6 bg-yellow-500/20 border border-yellow-400/50 rounded-lg p-4">
								<div className="flex items-center gap-2 mb-3">
									<Bell className="w-5 h-5 text-yellow-400" />
									<h4 className="font-semibold text-gray-12">Reminder</h4>
								</div>
								{selectedReminder ? (
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm text-gray-12">
												Reminder set for {selectedReminder.time || "all day"}
											</p>
										</div>
										<Button
											variant="ghost"
											size="3"
											onClick={handleDeleteReminder}
											className="text-red-400 hover:text-red-500"
										>
											<X className="w-4 h-4" />
										</Button>
									</div>
								) : (
									<div className="space-y-3">
										<div className="flex gap-2">
											<input
												type="time"
												value={reminderTime}
												onChange={(e) => setReminderTime(e.target.value)}
												className="flex-1 px-3 py-2 bg-gray-a3 rounded-lg border border-gray-a5 text-gray-12"
											/>
											<Button
												variant="classic"
												size="3"
												onClick={handleSetReminder}
												className="bg-yellow-500 hover:bg-yellow-600"
											>
												Set Reminder
											</Button>
										</div>
									</div>
								)}
							</div>
						)}

						{/* Sessions Section */}
						{selectedSessions.length > 0 ? (
							<div className="space-y-3">
								<h4 className="font-semibold text-gray-12 mb-2">Meditation Sessions</h4>
								{selectedSessions.map((session) => (
									<div
										key={session.id}
										className="bg-gray-a3 rounded-lg p-4"
									>
										<div className="flex justify-between items-start mb-2">
											<p className="font-medium text-gray-12">
												{session.duration} minutes
											</p>
											<p className="text-sm text-gray-10">
												{format(
													new Date(session.createdAt),
													"h:mm a",
												)}
											</p>
										</div>
										{session.notes && (
											<p className="text-sm text-gray-10">
												{session.notes}
											</p>
										)}
									</div>
								))}
							</div>
						) : (
							<p className="text-gray-10">
								No meditation sessions on this day.
							</p>
						)}
					</motion.div>
				)}
			</motion.div>
		</div>
	);
}

