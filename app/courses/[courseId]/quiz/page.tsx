"use client";

import { Button } from "@whop/react/components";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Trophy } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getCourseById } from "@/lib/courses";
import { isPremiumUser } from "@/lib/premium";
import { Paywall } from "@/components/Paywall";

export default function CourseQuizPage() {
	const router = useRouter();
	const params = useParams();
	const courseId = params.courseId as string;
	const course = getCourseById(courseId);
	
	const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
	const [showResult, setShowResult] = useState(false);
	const [completed, setCompleted] = useState(false);
	const [isPremium, setIsPremium] = useState(false);
	const [showPaywall, setShowPaywall] = useState(false);

	useEffect(() => {
		setIsPremium(isPremiumUser());
		// Check if course quiz exists
		if (course && !course.courseQuiz) {
			router.push(`/courses/${courseId}`);
		}
		// Check if course requires premium and user doesn't have access
		if (!isPremiumUser() && (courseId === "advanced" || courseId === "monk")) {
			setShowPaywall(true);
		}
	}, [course, courseId, router]);

	if (!course || !course.courseQuiz) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-white">Course quiz not found</p>
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
		const isCorrect = selectedAnswer === course.courseQuiz!.correctAnswer;
		if (isCorrect) {
			setCompleted(true);
			// Mark course as completed
			const completedCourses = JSON.parse(localStorage.getItem("completed_courses") || "[]");
			if (!completedCourses.includes(courseId)) {
				completedCourses.push(courseId);
				localStorage.setItem("completed_courses", JSON.stringify(completedCourses));
			}
		}
	};

	const handleNext = () => {
		router.push(`/courses/${courseId}`);
	};

	const isCorrect = selectedAnswer === course.courseQuiz.correctAnswer;

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
					<div className="text-center mb-8">
						<Trophy className="w-16 h-16 mx-auto mb-4" style={{ color: course.color }} />
						<h1 className="text-3xl font-bold text-white mb-2">Course Completion Quiz</h1>
						<p className="text-gray-400">Test your understanding of {course.name} level</p>
					</div>

					<div className="mt-8">
						<h2 className="text-2xl font-bold text-white mb-6">{course.courseQuiz.question}</h2>
						
						<div className="grid grid-cols-2 gap-3 mb-6">
							{course.courseQuiz.options.map((option, index) => (
								<button
									key={index}
									onClick={() => !showResult && setSelectedAnswer(index)}
									disabled={showResult}
									className={`
										p-4 rounded-xl text-left transition-all font-medium
										${
											showResult
												? index === course.courseQuiz!.correctAnswer
													? "bg-green-500/30 border-2 border-green-500"
													: selectedAnswer === index && index !== course.courseQuiz!.correctAnswer
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
										? "Excellent! You've completed the course!"
										: "Not quite. The correct answer is: " + course.courseQuiz.options[course.courseQuiz.correctAnswer]}
								</p>
							</motion.div>
						)}

						{completed && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								className="mb-6 p-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400 rounded-xl text-center"
							>
								<Trophy className="w-12 h-12 mx-auto mb-3 text-yellow-400" />
								<h3 className="text-2xl font-bold text-white mb-2">Course Completed! 🎉</h3>
								<p className="text-white/80">You've mastered {course.name} level meditation</p>
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
								Back to Course
							</Button>
						)}
					</div>
				</div>
			</motion.div>
		</div>
	);
}

