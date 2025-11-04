"use client";

import { motion } from "framer-motion";
import { Moon, Sunrise, Cloud, Droplet, BookOpen, GraduationCap, Headphones, Lock, Video, Users } from "lucide-react";
import { MeditationIcon, BreathworkIcon } from "@/components/CategoryIcons";
import { useEffect, useState } from "react";
import { getTodayGoal, saveTodayGoal } from "@/lib/goals";
import { Calendar } from "@/components/Calendar";
import { COURSES } from "@/lib/courses";
import Link from "next/link";
import { Button } from "@whop/react/components";
import { Crown } from "lucide-react";
import { isPremiumUser, getPremiumInfo } from "@/lib/premium";
import { Paywall } from "@/components/Paywall";

const CATEGORIES = [
	{
		id: "meditation",
		name: "Meditation",
		icon: MeditationIcon,
		iconBg: "bg-teal-500/20",
		iconColorHex: "#2dd4bf", // Teal/light green from image
		cardColor: "#2dd4bf",
	},
	{
		id: "breathwork",
		name: "Breathwork",
		icon: BreathworkIcon,
		iconBg: "bg-blue-500/20",
		iconColorHex: "#60a5fa", // Light blue from image
		cardColor: "#60a5fa",
	},
	{
		id: "anxiety",
		name: "Anxiety",
		icon: Cloud,
		iconBg: "bg-orange-500/20",
		iconColorHex: "#fb923c", // Light orange from image
		cardColor: "#fb923c",
	},
];

export default function Dashboard() {
	const [goal, setGoal] = useState("");
	const [isEditingGoal, setIsEditingGoal] = useState(false);
	const [isPremium, setIsPremium] = useState(false);
	const [showPaywall, setShowPaywall] = useState(false);

	useEffect(() => {
		setGoal(getTodayGoal());
		setIsPremium(isPremiumUser());
	}, []);

	const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setGoal(e.target.value);
	};

	const handleGoalBlur = () => {
		saveTodayGoal(goal);
		setIsEditingGoal(false);
	};

	const handleGoalKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			saveTodayGoal(goal);
			setIsEditingGoal(false);
		}
	};

	const handleCategoryClick = (categoryId: string) => {
		if (categoryId === "meditation") {
			window.location.href = "/timer";
		} else if (categoryId === "breathwork") {
			window.location.href = "/breathwork";
		} else if (categoryId === "anxiety") {
			window.location.href = "/anxiety";
		} else {
			// Other categories can go to timer for now
			window.location.href = `/timer?category=${categoryId}`;
		}
	};

	return (
		<div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
			{showPaywall && (
				<Paywall 
					onClose={() => setShowPaywall(false)}
					feature="Premium features"
				/>
			)}
			{/* Premium Upgrade Banner */}
			{!isPremium && (
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-6 mx-auto max-w-md"
				>
					<div 
						className="rounded-2xl p-4 shadow-xl"
						style={{
							background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f59e0b 100%)",
							boxShadow: "0 20px 50px rgba(139, 92, 246, 0.3), 0 0 0 1px rgba(255,255,255,0.1) inset"
						}}
					>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center" style={{ boxShadow: "0 4px 15px rgba(250, 204, 21, 0.5)" }}>
									<Crown className="w-6 h-6 text-yellow-900" />
								</div>
								<div>
									<p className="text-white font-bold text-base">Unlock Premium</p>
									<p className="text-white/90 text-xs">Access all features</p>
								</div>
							</div>
							<Button
								variant="classic"
								size="3"
								onClick={() => setShowPaywall(true)}
								className="rounded-xl font-bold shadow-lg"
								style={{
									background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)",
									color: "#1c1917",
									boxShadow: "0 8px 20px rgba(251, 191, 36, 0.4)"
								}}
							>
								Upgrade
							</Button>
						</div>
					</div>
				</motion.div>
			)}
			{/* Top Section - Today I will */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="mb-8 text-center"
			>
				<p className="text-gray-400 text-sm mb-3 font-normal">Write a goal</p>
				<div
					onClick={() => setIsEditingGoal(true)}
					className="relative cursor-text max-w-md mx-auto"
				>
					{isEditingGoal ? (
						<input
							type="text"
							value={goal}
							onChange={handleGoalChange}
							onBlur={handleGoalBlur}
							onKeyPress={handleGoalKeyPress}
							placeholder="set your intention here"
							className="w-full text-2xl font-bold text-white bg-transparent border-none outline-none text-center focus:outline-none placeholder:text-gray-500"
							autoFocus
							style={{ caretColor: "#2dd4bf", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}
						/>
					) : (
						<p
							className={`text-2xl font-bold text-center min-h-[2rem] ${
								goal ? "text-white" : "text-gray-500"
							}`}
							style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}
						>
							{goal || "set your intention here"}
						</p>
					)}
				</div>
			</motion.div>

			{/* Central Section - Category Grid */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className="flex justify-center gap-4 mb-8"
			>
				{CATEGORIES.map((category, index) => {
					const Icon = category.icon;
					return (
						<motion.button
							key={category.id}
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.1 + index * 0.05 }}
							whileHover={{ scale: 1.05, y: -5 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => handleCategoryClick(category.id)}
							className="rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all min-h-[140px] min-w-[140px]"
							style={{ 
								fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
								backgroundColor: category.cardColor,
								transform: "perspective(1000px) rotateX(5deg) rotateY(-5deg)",
								boxShadow: `0 20px 40px -10px ${category.cardColor}60, 0 0 0 1px ${category.cardColor}40 inset, 0 8px 12px -2px rgba(0,0,0,0.3)`
							}}
						>
							<div
								className="w-14 h-14 rounded-full flex items-center justify-center"
								style={{ backgroundColor: "rgba(255, 255, 255, 0.3)", backdropFilter: "blur(10px)" }}
							>
								<Icon className="w-7 h-7" style={{ color: "#ffffff" }} />
							</div>
							<p className="text-white text-sm font-bold text-center" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
								{category.name}
							</p>
						</motion.button>
					);
				})}
			</motion.div>

			{/* Live Sessions Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.15 }}
				className="mb-8"
			>
				<div className="flex items-center gap-3 mb-4 justify-center">
					<Video className="w-6 h-6 text-gray-900 dark:text-white" />
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white">Live Sessions</h2>
					<span className="px-3 py-1 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-xs font-semibold rounded-full border border-yellow-500/30">
						Coming Soon
					</span>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto relative">
					<div className="relative opacity-60 cursor-not-allowed">
						<motion.div
							className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-purple-400/30 rounded-2xl p-6 transition-all"
						>
							<div className="flex items-center gap-3 mb-2">
								<div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
									<Video className="w-5 h-5 text-purple-400" />
								</div>
								<h3 className="text-lg font-bold text-gray-900 dark:text-white">Host a Session</h3>
							</div>
							<p className="text-gray-700 dark:text-gray-300 text-sm">Create and lead a live meditation session for your community</p>
						</motion.div>
					</div>
					<div className="relative opacity-60 cursor-not-allowed">
						<motion.div
							className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-blue-400/30 rounded-2xl p-6 transition-all"
						>
							<div className="flex items-center gap-3 mb-2">
								<div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
									<Users className="w-5 h-5 text-blue-400" />
								</div>
								<h3 className="text-lg font-bold text-gray-900 dark:text-white">Join a Session</h3>
							</div>
							<p className="text-gray-700 dark:text-gray-300 text-sm">Enter a session ID to join a live meditation with others</p>
						</motion.div>
					</div>
				</div>
			</motion.div>

			{/* Calendar Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
				className="mb-8"
			>
				<h3 className="text-xl font-bold text-white mb-4 text-center">Calendar</h3>
				<Calendar compact />
			</motion.div>

				{/* Guided Meditation Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className="mb-8"
			>
				<div className="flex items-center gap-3 mb-6">
					<Headphones className="w-6 h-6 text-white" />
					<h2 className="text-2xl font-bold text-white">Guided Meditations</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{[
						{
							id: "sleep",
							title: "Sleep Meditation",
							sessions: 5,
							description: "Drift into peaceful slumber",
							color: "#a78bfa",
							isPremium: false,
						},
						{
							id: "anxiety",
							title: "Anxiety Relief",
							sessions: 6,
							description: "Calm your worried mind",
							color: "#fb923c",
							isPremium: false,
						},
						{
							id: "focus",
							title: "Focus & Concentration",
							sessions: 8,
							description: "Sharpen your mental clarity",
							color: "#2dd4bf",
							isPremium: false,
						},
						{
							id: "stress",
							title: "Stress Release",
							sessions: 7,
							description: "Let go of daily tension",
							color: "#60a5fa",
							isPremium: false,
						},
						{
							id: "confidence",
							title: "Build Confidence",
							sessions: 7,
							description: "Unlock your inner strength",
							color: "#ec4899",
							isPremium: true,
						},
						{
							id: "gratitude",
							title: "Gratitude Practice",
							sessions: 6,
							description: "Cultivate appreciation",
							color: "#f59e0b",
							isPremium: true,
						},
					].map((meditation, index) => {
						const isLocked = meditation.isPremium && !isPremium;
						const content = (
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.3 + index * 0.1 }}
								whileHover={isLocked ? {} : { scale: 1.05, y: -5 }}
								className="rounded-2xl p-6 border-2 transition-all min-h-[160px]"
								style={{
									backgroundColor: `${meditation.color}20`,
									borderColor: meditation.color,
									boxShadow: `0 10px 30px -5px ${meditation.color}40`,
									transform: "perspective(1000px) rotateX(2deg) rotateY(-2deg)",
									cursor: isLocked ? "not-allowed" : "pointer",
									opacity: isLocked ? 0.6 : 1,
									position: "relative",
								}}
							>
								{isLocked && (
									<div className="absolute top-4 right-4">
										<Lock className="w-5 h-5 text-yellow-400" />
									</div>
								)}
								<div className="flex items-center gap-3 mb-3">
									<div
										className="w-12 h-12 rounded-full flex items-center justify-center"
										style={{ backgroundColor: meditation.color }}
									>
										<Headphones className="w-6 h-6 text-white" />
									</div>
									<div>
										<h3 className="text-lg font-bold text-white">{meditation.title}</h3>
										<p className="text-xs text-gray-400">{meditation.sessions} Sessions</p>
									</div>
								</div>
								<p className="text-sm text-gray-300">{meditation.description}</p>
							</motion.div>
						);

						if (isLocked) {
							return (
								<div key={meditation.id} onClick={(e) => { e.preventDefault(); setShowPaywall(true); }}>
									{content}
								</div>
							);
						}

						return (
							<Link key={meditation.id} href={`/guided-meditations/${meditation.id}`}>
								{content}
							</Link>
						);
					})}
				</div>
			</motion.div>

			{/* Courses Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className="mb-8"
			>
				<div className="flex items-center gap-3 mb-6">
					<GraduationCap className="w-6 h-6 text-white" />
					<h2 className="text-2xl font-bold text-white">Meditation Courses</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{COURSES.map((course, index) => {
						const isLocked = !isPremium && (course.id === "advanced" || course.id === "monk");
						const content = (
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.4 + index * 0.1 }}
								whileHover={isLocked ? {} : { scale: 1.05, y: -5 }}
								className="rounded-2xl p-6 border-2 transition-all min-h-[180px] relative"
								style={{
									backgroundColor: `${course.color}20`,
									borderColor: course.color,
									boxShadow: `0 10px 30px -5px ${course.color}40`,
									cursor: isLocked ? "not-allowed" : "pointer",
									opacity: isLocked ? 0.6 : 1,
								}}
							>
								{isLocked && (
									<div className="absolute top-4 right-4">
										<Lock className="w-5 h-5 text-yellow-400" />
									</div>
								)}
								<div className="flex items-center gap-3 mb-4">
									<div
										className="w-12 h-12 rounded-full flex items-center justify-center"
										style={{ backgroundColor: course.color }}
									>
										<BookOpen className="w-6 h-6 text-white" />
									</div>
									<div>
										<h3 className="text-xl font-bold text-white">{course.name}</h3>
										<p className="text-xs text-gray-400">Level {course.level}</p>
									</div>
								</div>
								<p className="text-sm text-gray-300 mb-4">{course.description}</p>
								<div className="flex items-center gap-2 text-sm text-white">
									<span>{course.lessons.length} Lessons</span>
								</div>
							</motion.div>
						);

						if (isLocked) {
							return (
								<div key={course.id} onClick={(e) => { e.preventDefault(); setShowPaywall(true); }}>
									{content}
								</div>
							);
						}

						return (
							<Link key={course.id} href={`/courses/${course.id}`}>
								{content}
							</Link>
						);
					})}
				</div>
			</motion.div>

		</div>
	);
}
