"use client";

import { Button } from "@whop/react/components";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Heart, Brain, UserCircle, Sparkles, Wind, Activity, Moon } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getCourseById, getLessonById } from "@/lib/courses";
import { isPremiumUser } from "@/lib/premium";
import { Paywall } from "@/components/Paywall";

export default function LessonPage() {
	const router = useRouter();
	const params = useParams();
	const courseId = params.courseId as string;
	const lessonId = params.lessonId as string;
	
	const course = getCourseById(courseId);
	const lesson = getLessonById(courseId, lessonId);
	
	const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
	const [showResult, setShowResult] = useState(false);
	const [isPremium, setIsPremium] = useState(false);
	const [showPaywall, setShowPaywall] = useState(false);

	useEffect(() => {
		setIsPremium(isPremiumUser());
		// Check if course requires premium and user doesn't have access
		if (!isPremiumUser() && (courseId === "advanced" || courseId === "monk")) {
			setShowPaywall(true);
		}
	}, [courseId]);

	if (!course || !lesson) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-white">Lesson not found</p>
			</div>
		);
	}

	// Show paywall if trying to access premium course without premium
	if (showPaywall) {
		return (
			<Paywall 
				onClose={() => router.push("/")}
				feature={`${course.name} course`}
			/>
		);
	}

	const handleSubmit = () => {
		setShowResult(true);
	};

	const handleNext = () => {
		const currentIndex = course.lessons.findIndex(l => l.id === lessonId);
		if (currentIndex < course.lessons.length - 1) {
			const nextLesson = course.lessons[currentIndex + 1];
			router.push(`/courses/${courseId}/${nextLesson.id}`);
		} else {
			// All lessons done, show course quiz
			router.push(`/courses/${courseId}/quiz`);
		}
	};

	const isCorrect = selectedAnswer === lesson.correctAnswer;

	// Visual icons for different lesson types
	const getLessonIcon = () => {
		if (lesson.title.toLowerCase().includes("breath") || lesson.title.toLowerCase().includes("breathing")) {
			return <Activity className="w-16 h-16" style={{ color: course.color }} />;
		}
		if (lesson.title.toLowerCase().includes("posture") || lesson.title.toLowerCase().includes("position")) {
			return <UserCircle className="w-16 h-16" style={{ color: course.color }} />;
		}
		if (lesson.title.toLowerCase().includes("body scan") || lesson.title.toLowerCase().includes("scan")) {
			return <Brain className="w-16 h-16" style={{ color: course.color }} />;
		}
		if (lesson.title.toLowerCase().includes("walking")) {
			return <Wind className="w-16 h-16" style={{ color: course.color }} />;
		}
		if (lesson.title.toLowerCase().includes("loving") || lesson.title.toLowerCase().includes("kindness")) {
			return <Heart className="w-16 h-16" style={{ color: course.color }} />;
		}
		if (lesson.title.toLowerCase().includes("nature") || lesson.title.toLowerCase().includes("awareness")) {
			return <Sparkles className="w-16 h-16" style={{ color: course.color }} />;
		}
		return <Moon className="w-16 h-16" style={{ color: course.color }} />;
	};

	return (
		<div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="space-y-8"
			>
				<Button
					variant="ghost"
					size="3"
					onClick={() => router.push(`/courses/${courseId}`)}
					className="mb-4"
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Course
				</Button>

				<div
					className="rounded-2xl p-8 border-2"
					style={{
						backgroundColor: `${course.color}20`,
						borderColor: course.color
					}}
				>
					{/* Visual Header */}
					<div className="flex items-center gap-4 mb-6">
						<div className="flex-shrink-0">
							{getLessonIcon()}
						</div>
						<h1 className="text-3xl font-bold text-white">{lesson.title}</h1>
					</div>
					
					{/* Visual Content */}
					<div className="mb-8 space-y-6">
						{lesson.content.includes("Getting Started") && (
							<div className="grid grid-cols-5 gap-3 mb-6">
								{[1, 2, 3, 4, 5].map((step) => (
									<div key={step} className="text-center">
										<div 
											className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2"
											style={{ backgroundColor: course.color }}
										>
											{step}
										</div>
										<p className="text-xs text-gray-400">{step === 1 ? "Quiet space" : step === 2 ? "Sit up" : step === 3 ? "Close eyes" : step === 4 ? "Breathe" : "Focus"}</p>
									</div>
								))}
							</div>
						)}
						
						{/* Visual prompts based on lesson content */}
						{lesson.title.toLowerCase().includes("breathing") || lesson.content.toLowerCase().includes("breath") ? (
							<div className="bg-gray-800/50 rounded-xl p-6 mt-6">
								<p className="text-center text-white font-semibold mb-4">Follow along:</p>
								<div className="flex items-center justify-center gap-8">
									<div className="text-center">
										<motion.div 
											className="w-24 h-24 rounded-full border-4 mx-auto mb-2 flex items-center justify-center"
											style={{ borderColor: course.color }}
											animate={{ scale: [1, 1.3, 1] }}
											transition={{ duration: 4, repeat: Infinity }}
										>
											<span className="text-3xl">↗</span>
										</motion.div>
										<p className="text-sm text-gray-400 font-medium">Inhale (4 seconds)</p>
									</div>
									<div className="text-center">
										<motion.div 
											className="w-24 h-24 rounded-full border-4 mx-auto mb-2 flex items-center justify-center"
											style={{ borderColor: course.color, opacity: 0.7 }}
											animate={{ scale: [1.3, 1, 1.3] }}
											transition={{ duration: 4, repeat: Infinity, delay: 2 }}
										>
											<span className="text-3xl">↘</span>
										</motion.div>
										<p className="text-sm text-gray-400 font-medium">Exhale (4 seconds)</p>
									</div>
								</div>
								<p className="text-center text-white/70 text-sm mt-4">Breathe naturally and follow the rhythm</p>
							</div>
						) : lesson.title.toLowerCase().includes("posture") || lesson.content.toLowerCase().includes("posture") ? (
							<div className="bg-gray-800/50 rounded-xl p-8 mt-6">
								<p className="text-center text-white font-semibold mb-6">Posture Guide:</p>
								<div className="grid grid-cols-3 gap-4">
									<div className="text-center">
										<div className="w-16 h-20 bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg mx-auto mb-2 flex items-end justify-center pb-2">
											<div className="w-12 h-12 rounded-full bg-gray-600"></div>
										</div>
										<p className="text-xs text-gray-400">Chair</p>
									</div>
									<div className="text-center">
										<div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 mx-auto mb-2 flex items-center justify-center">
											<div className="w-10 h-10 rounded-full bg-gray-600"></div>
										</div>
										<p className="text-xs text-gray-400">Floor</p>
									</div>
									<div className="text-center">
										<div className="w-20 h-12 bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg mx-auto mb-2"></div>
										<p className="text-xs text-gray-400">Lying</p>
									</div>
								</div>
							</div>
						) : lesson.title.toLowerCase().includes("body scan") || lesson.content.toLowerCase().includes("scan") ? (
							<div className="bg-gray-800/50 rounded-xl p-6 mt-6">
								<p className="text-center text-white font-semibold mb-4">Scan Direction:</p>
								<div className="flex flex-col items-center gap-2">
									{[...Array(7)].map((_, i) => (
										<motion.div
											key={i}
											className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold`}
											style={{ backgroundColor: course.color }}
											initial={{ opacity: 0.3 }}
											animate={{ opacity: [0.3, 1, 0.3] }}
											transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
										>
											{i === 0 ? "🦶" : i === 1 ? "🦵" : i === 2 ? "🫁" : i === 3 ? "✋" : i === 4 ? "👤" : i === 5 ? "🧠" : "✓"}
										</motion.div>
									))}
								</div>
								<p className="text-center text-white/70 text-sm mt-4">Move attention from toes to head</p>
							</div>
						) : null}

						<div 
							className="prose prose-invert max-w-none text-white text-lg leading-relaxed"
							dangerouslySetInnerHTML={{ __html: lesson.content }}
						/>
					</div>

					{/* Only show quiz if lesson has one, otherwise just show continue button */}
					{lesson.quizQuestion && lesson.quizOptions.length > 0 ? (
						<div className="mt-12 pt-8 border-t border-gray-700">
							<h2 className="text-2xl font-bold text-white mb-4">Quick Check</h2>
							<p className="text-lg font-semibold text-white mb-6">{lesson.quizQuestion}</p>
							
							<div className="grid grid-cols-2 gap-3 mb-6">
								{lesson.quizOptions.map((option, index) => (
									<button
										key={index}
										onClick={() => !showResult && setSelectedAnswer(index)}
										disabled={showResult}
										className={`
											p-4 rounded-xl text-left transition-all font-medium
											${
												showResult
													? index === lesson.correctAnswer
														? "bg-green-500/30 border-2 border-green-500"
														: selectedAnswer === index && index !== lesson.correctAnswer
															? "bg-red-500/30 border-2 border-red-500"
															: "bg-gray-700/50 border-2 border-gray-600"
													: selectedAnswer === index
														? `bg-opacity-70 border-2`
														: "bg-gray-700/50 border-2 border-gray-600 hover:bg-gray-700 hover:border-gray-500"
											}
										`}
										style={
											!showResult && selectedAnswer === index
												? {
														backgroundColor: `${course.color}40`,
														borderColor: course.color
													}
												: {}
										}
									>
										<span className="text-white text-sm">{option}</span>
									</button>
								))}
							</div>

							{showResult && (
								<motion.div
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
										isCorrect ? "bg-green-500/20" : "bg-red-500/20"
									}`}
								>
									<CheckCircle className={`w-6 h-6 ${isCorrect ? "text-green-400" : "text-red-400"}`} />
									<p className={`font-semibold ${isCorrect ? "text-green-400" : "text-red-400"}`}>
										{isCorrect
											? "Correct! Well done."
											: "Not quite. The correct answer is: " + lesson.quizOptions[lesson.correctAnswer]}
									</p>
								</motion.div>
							)}

							{!showResult ? (
								<Button
									variant="classic"
									size="4"
									onClick={handleSubmit}
									disabled={selectedAnswer === null}
									className="w-full rounded-xl h-14 text-lg"
									style={{
										backgroundColor: course.color,
										opacity: selectedAnswer === null ? 0.5 : 1
									}}
								>
									Submit Answer
								</Button>
							) : (
								<Button
									variant="classic"
									size="4"
									onClick={handleNext}
									className="w-full rounded-xl h-14 text-lg"
									style={{ backgroundColor: course.color }}
								>
									{course.lessons.findIndex(l => l.id === lessonId) < course.lessons.length - 1
										? "Next Lesson"
										: "Take Course Quiz"}
								</Button>
							)}
						</div>
					) : (
						<div className="mt-12 pt-8 border-t border-gray-700">
							<Button
								variant="classic"
								size="4"
								onClick={handleNext}
								className="w-full rounded-xl h-14 text-lg"
								style={{ backgroundColor: course.color }}
							>
								{course.lessons.findIndex(l => l.id === lessonId) < course.lessons.length - 1
									? "Continue to Next Lesson"
									: "Take Course Quiz"}
							</Button>
						</div>
					)}
				</div>
			</motion.div>
		</div>
	);
}

