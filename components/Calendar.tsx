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

interface CalendarProps {
	compact?: boolean;
}

export function Calendar({ compact = false }: CalendarProps) {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [sessions, setSessions] = useState<MeditationSession[]>([]);
	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	const [selectedSessions, setSelectedSessions] = useState<MeditationSession[]>([]);
	const [selectedReminder, setSelectedReminder] = useState<MeditationReminder | null>(null);
	const [reminderTime, setReminderTime] = useState("09:00");
	const [showReminderPicker, setShowReminderPicker] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);

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

	// Fix: getDay returns 0-6 (Sunday-Saturday), which matches our week display
	const firstDayOfWeek = getDay(monthStart);
	const days = [...Array.from({ length: firstDayOfWeek }, () => null), ...daysInMonth];

	const getSessionsForDate = (date: Date): MeditationSession[] => {
		const dateStr = format(date, "yyyy-MM-dd");
		return getSessionsByDate(dateStr);
	};

	const handleDateClick = (date: Date) => {
		const dateStr = format(date, "yyyy-MM-dd");
		// Toggle selection if clicking same date
		if (selectedDate === dateStr) {
			if (compact && !isExpanded) {
				setIsExpanded(true);
			} else {
				setSelectedDate(null);
				setSelectedReminder(null);
			}
		} else {
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
			if (compact) {
				setIsExpanded(true);
			}
		}
		setShowReminderPicker(false);
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
		setShowReminderPicker(false);
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
			const reminder = getReminderByDate(selectedDate);
			setSelectedReminder(reminder);
			if (reminder && reminder.time) {
				setReminderTime(reminder.time);
			}
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

	if (compact && !isExpanded) {
		return (
			<div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/30 rounded-xl p-3 max-w-sm mx-auto">
				<div className="flex items-center justify-between mb-3">
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							previousMonth();
						}}
						className="p-1 rounded-full hover:bg-gray-700/50 transition-colors"
					>
						<ChevronLeft className="w-4 h-4 text-gray-400" />
					</button>
					<h3 className="text-sm font-semibold text-white">
						{format(currentDate, "MMM yyyy")}
					</h3>
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							nextMonth();
						}}
						className="p-1 rounded-full hover:bg-gray-700/50 transition-colors"
					>
						<ChevronRight className="w-4 h-4 text-gray-400" />
					</button>
				</div>

				<div className="grid grid-cols-7 gap-0.5 mb-1">
					{["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
						<div
							key={`${day}-${idx}`}
							className="text-center text-[10px] font-medium text-gray-500 py-1"
						>
							{day}
						</div>
					))}
				</div>

				<div className="grid grid-cols-7 gap-0.5">
					{days.map((day, idx) => {
						if (day === null) {
							return <div key={`empty-${idx}`} className="aspect-square p-0.5" />;
						}

						const daySessions = getSessionsForDate(day);
						const hasSessions = daySessions.length > 0;
						const isCurrentDay = isToday(day);
						const isCurrentMonth = isSameMonth(day, currentDate);
						const dayStr = format(day, "yyyy-MM-dd");
						const isSelected = selectedDate === dayStr;
						const reminder = getReminderByDate(dayStr);
						const hasReminder = reminder !== null;

						return (
							<button
								key={dayStr}
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									handleDateClick(day);
								}}
								className={`
									aspect-square rounded-md text-[11px] font-medium transition-all p-0.5 flex flex-col items-center justify-center
									${
										isSelected
											? "bg-teal-500 text-white font-bold ring-2 ring-teal-400"
											: isCurrentDay
												? "bg-teal-500/40 text-white ring-1 ring-teal-400"
												: isCurrentMonth
													? "bg-gray-700/30 text-gray-300 hover:bg-gray-700/50"
													: "bg-transparent text-gray-600"
									}
									${hasSessions && !isSelected ? "border border-green-400/60" : ""}
									${hasReminder && !isSelected ? "border border-yellow-400/60" : ""}
								`}
							>
								{format(day, "d")}
								{hasSessions && !hasReminder && (
									<div className="w-1 h-1 rounded-full bg-green-400 mt-0.5" />
								)}
								{hasReminder && (
									<Bell className="w-2 h-2 text-yellow-400 mt-0.5" />
								)}
							</button>
						);
					})}
				</div>

				{selectedDate && isFuture(startOfDay(parseISO(selectedDate + "T00:00:00"))) && (
					<div className="mt-3 p-2 bg-yellow-500/20 border border-yellow-400/50 rounded-lg">
						{selectedReminder ? (
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-1.5">
									<Bell className="w-3 h-3 text-yellow-400" />
									<span className="text-[11px] text-gray-12">
										{selectedReminder.time}
									</span>
								</div>
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										handleDeleteReminder();
									}}
									className="text-red-400 hover:text-red-500 p-0.5"
								>
									<X className="w-3 h-3" />
								</button>
							</div>
						) : (
							<div className="space-y-1.5">
								{showReminderPicker ? (
									<div className="flex gap-1.5">
										<input
											type="time"
											value={reminderTime}
											onChange={(e) => setReminderTime(e.target.value)}
											className="flex-1 px-2 py-1 text-[11px] bg-gray-700 rounded border border-gray-600 text-gray-12"
											onClick={(e) => e.stopPropagation()}
										/>
										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation();
												handleSetReminder();
											}}
											className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 rounded text-[11px] text-white"
										>
											Set
										</button>
									</div>
								) : (
									<button
										type="button"
										onClick={(e) => {
											e.stopPropagation();
											setShowReminderPicker(true);
										}}
										className="w-full py-1 px-2 bg-yellow-500/30 hover:bg-yellow-500/50 rounded text-[11px] text-gray-12 transition-colors"
									>
										Set Reminder
									</button>
								)}
							</div>
						)}
					</div>
				)}
			</div>
		);
	}

	// Expanded view (either not compact, or compact but expanded)
	return (
		<div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative">
			{compact && (
				<button
					type="button"
					onClick={() => setIsExpanded(false)}
					className="mb-4 text-gray-400 hover:text-white text-sm"
				>
					← Back to compact view
				</button>
			)}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="mb-8"
			>
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
						
						{selectedDate && isFuture(startOfDay(parseISO(selectedDate + "T00:00:00"))) && (
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
										{!showReminderPicker && (
											<button
												type="button"
												onClick={() => setShowReminderPicker(true)}
												className="w-full py-2 px-3 bg-yellow-500/30 hover:bg-yellow-500/50 rounded text-sm text-gray-12 transition-colors"
											>
												Choose Time
											</button>
										)}
										{showReminderPicker && (
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
													Set
												</Button>
											</div>
										)}
									</div>
								)}
							</div>
						)}

						{selectedSessions.length > 0 && (
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
												{format(new Date(session.createdAt), "h:mm a")}
											</p>
										</div>
										{session.notes && (
											<p className="text-sm text-gray-10">{session.notes}</p>
										)}
									</div>
								))}
							</div>
						)}
					</motion.div>
				)}
			</motion.div>
		</div>
	);
}

