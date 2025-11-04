"use client";

import { Button } from "@whop/react/components";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, CheckCircle, Lock } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { getCourseById } from "@/lib/courses";
import { useEffect, useState } from "react";
import { isPremiumUser } from "@/lib/premium";
import { Paywall } from "@/components/Paywall";

export default function CoursePage() {
	const router = useRouter();
	const params = useParams();
	const courseId = params.courseId as string;
	const course = getCourseById(courseId);
	const [completedLessons, setCompletedLessons] = useState<string[]>([]);
	const [showPaywall, setShowPaywall] = useState(false);
	const [isPremium, setIsPremium] = useState(false);

	useEffect(() => {
		setIsPremium(isPremiumUser());
	}, []);

	useEffect(() => {
		const saved = localStorage.getItem(`completed_lessons_${courseId}`);
		if (saved) {
			setCompletedLessons(JSON.parse(saved));
		}
	}, [courseId]);

	if (!course) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-white">Course not found</p>
			</div>
		);
	}

	const handleLessonClick = (lessonId: string) => {
		// Check if course requires premium (advanced and monk)
		if (!isPremium && (courseId === "advanced" || courseId === "monk")) {
			setShowPaywall(true);
			return;
		}
		router.push(`/courses/${courseId}/${lessonId}`);
	};

	const isLessonCompleted = (lessonId: string) => {
		return completedLessons.includes(lessonId);
	};

	return (
		<div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
			{showPaywall && (
				<Paywall 
					onClose={() => setShowPaywall(false)}
					feature={`${course?.name} course`}
				/>
			)}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="space-y-8"
			>
				<Button
					variant="ghost"
					size="3"
					onClick={() => router.push("/")}
					className="mb-4"
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Home
				</Button>

				<div
					className="rounded-2xl p-8 border-2"
					style={{
						backgroundColor: `${course.color}20`,
						borderColor: course.color
					}}
				>
					<div className="flex items-center gap-4 mb-4">
						<div
							className="w-16 h-16 rounded-full flex items-center justify-center"
							style={{ backgroundColor: course.color }}
						>
							<BookOpen className="w-8 h-8 text-white" />
						</div>
						<div>
							<h1 className="text-4xl font-bold text-white">{course.name}</h1>
							<p className="text-gray-400 mt-2">{course.description}</p>
						</div>
					</div>

					<div className="mt-8 space-y-4">
						<h2 className="text-2xl font-bold text-white mb-4">Lessons</h2>
						{course.lessons.map((lesson, index) => {
							const completed = isLessonCompleted(lesson.id);
							const isLocked = !isPremium && (courseId === "advanced" || courseId === "monk");
							return (
								<motion.div
									key={lesson.id}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.1 }}
									className={`
										p-6 rounded-xl border-2 transition-all relative
										${completed ? "opacity-75" : ""}
										${isLocked ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:scale-105"}
									`}
									style={{
										backgroundColor: completed ? `${course.color}10` : `${course.color}30`,
										borderColor: course.color
									}}
									onClick={() => !isLocked && handleLessonClick(lesson.id)}
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-4">
											<div
												className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
												style={{ backgroundColor: course.color }}
											>
												{index + 1}
											</div>
											<div>
												<h3 className="text-xl font-semibold text-white">{lesson.title}</h3>
											</div>
										</div>
										<div className="flex items-center gap-2">
											{isLocked && (
												<Lock className="w-5 h-5 text-yellow-400" />
											)}
											{completed && !isLocked && (
												<CheckCircle className="w-6 h-6 text-green-400" />
											)}
										</div>
									</div>
								</motion.div>
							);
						})}
						
						{/* Course Quiz at the end */}
						{course.courseQuiz && (
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: course.lessons.length * 0.1 }}
								className={`
									p-6 rounded-xl border-2 transition-all relative
									${!isPremium && course.level >= 2 ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:scale-105"}
								`}
								style={{
									backgroundColor: `${course.color}30`,
									borderColor: course.color,
									borderWidth: "3px"
								}}
								onClick={() => {
									if (!isPremium && (courseId === "advanced" || courseId === "monk")) {
										setShowPaywall(true);
									} else {
										router.push(`/courses/${courseId}/quiz`);
									}
								}}
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-4">
										<div
											className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
											style={{ backgroundColor: course.color }}
										>
											🎯
										</div>
										<div>
											<h3 className="text-xl font-semibold text-white">Course Quiz</h3>
											<p className="text-sm text-gray-400">Test your knowledge</p>
										</div>
									</div>
									{!isPremium && (courseId === "advanced" || courseId === "monk") && (
										<Lock className="w-5 h-5 text-yellow-400" />
									)}
								</div>
							</motion.div>
						)}
					</div>
				</div>
			</motion.div>
		</div>
	);
}

