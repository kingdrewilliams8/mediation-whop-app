"use client";

import { Button } from "@whop/react/components";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Wind } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

type BreathingState = "idle" | "inhale" | "hold" | "exhale" | "pause";
type PatternType = "box" | "triangle" | "deep";

const BREATHING_PATTERNS = {
	box: { inhale: 4, hold: 4, exhale: 4, pause: 4, name: "Box Breathing" },
	triangle: { inhale: 4, hold: 0, exhale: 4, pause: 0, name: "Triangle" },
	deep: { inhale: 4, hold: 7, exhale: 8, pause: 0, name: "4-7-8 Breathing" },
};

export default function BreathworkPage() {
	const [state, setState] = useState<BreathingState>("idle");
	const [pattern, setPattern] = useState<PatternType>("box");
	const [timeLeft, setTimeLeft] = useState(0);
	const [cycle, setCycle] = useState(0);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	const handleNextPhase = useCallback(() => {
		const patternData = BREATHING_PATTERNS[pattern];
		if (state === "inhale") {
			if (patternData.hold > 0) {
				setState("hold");
				setTimeLeft(patternData.hold);
			} else {
				setState("exhale");
				setTimeLeft(patternData.exhale);
			}
		} else if (state === "hold") {
			setState("exhale");
			setTimeLeft(patternData.exhale);
		} else if (state === "exhale") {
			if (patternData.pause > 0) {
				setState("pause");
				setTimeLeft(patternData.pause);
			} else {
				setState("inhale");
				setTimeLeft(patternData.inhale);
				setCycle((prev) => prev + 1);
			}
		} else if (state === "pause") {
			setState("inhale");
			setTimeLeft(patternData.inhale);
			setCycle((prev) => prev + 1);
		}
	}, [state, pattern]);

	useEffect(() => {
		if (state !== "idle" && timeLeft > 0) {
			intervalRef.current = setInterval(() => {
				setTimeLeft((prev) => {
					if (prev <= 1) {
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		} else {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [state, timeLeft]);

	useEffect(() => {
		if (timeLeft === 0 && state !== "idle") {
			const timeout = setTimeout(() => {
				handleNextPhase();
			}, 100);
			return () => clearTimeout(timeout);
		}
	}, [timeLeft, state, handleNextPhase]);

	const handleStart = () => {
		const patternData = BREATHING_PATTERNS[pattern];
		setState("inhale");
		setTimeLeft(patternData.inhale);
		setCycle(0);
	};

	const handleStop = () => {
		setState("idle");
		setTimeLeft(0);
		setCycle(0);
	};

	const getPhaseText = () => {
		switch (state) {
			case "inhale":
				return "Breathe In";
			case "hold":
				return "Hold";
			case "exhale":
				return "Breathe Out";
			case "pause":
				return "Pause";
			default:
				return "Ready";
		}
	};

	const getCircleSize = () => {
		if (state === "idle") return 100;
		if (state === "inhale") return 200;
		if (state === "hold") return 200;
		if (state === "exhale") return 100;
		return 100;
	};

	const getPhaseColor = () => {
		switch (state) {
			case "inhale":
				return "from-blue-400 to-cyan-400";
			case "hold":
				return "from-purple-400 to-pink-400";
			case "exhale":
				return "from-orange-400 to-red-400";
			case "pause":
				return "from-gray-400 to-gray-600";
			default:
				return "from-gray-600 to-gray-800";
		}
	};

	return (
		<div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="space-y-8"
			>
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-white mb-2">
						Breathwork
					</h1>
					<p className="text-gray-400">Find your rhythm</p>
				</div>

				{state === "idle" && (
					<div className="space-y-6">
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-3">
								Breathing Pattern
							</label>
							<div className="grid grid-cols-2 gap-3">
								{Object.entries(BREATHING_PATTERNS).map(
									([key, pat]) => (
										<motion.button
											key={key}
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											onClick={() =>
												setPattern(key as PatternType)
											}
											className={`
												py-3 px-4 rounded-lg border-2 transition-all
												${
													pattern === key
														? "bg-blue-500/20 border-blue-400"
														: "bg-gray-800/50 border-gray-700 text-white hover:bg-gray-800/70"
												}
											`}
										>
											<p className="font-medium text-sm">
												{pat.name}
											</p>
											<p className="text-xs text-gray-400 mt-1">
												{pat.inhale}-{pat.hold || 0}-
												{pat.exhale}
												{pat.pause ? `-${pat.pause}` : ""}
											</p>
										</motion.button>
									),
								)}
							</div>
						</div>

						<Button
							variant="classic"
							size="4"
							onClick={handleStart}
							className="w-full rounded-2xl h-16 text-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 border-0 shadow-lg"
						>
							<Play className="w-5 h-5 mr-2" />
							Start Breathing
						</Button>
					</div>
				)}

				{state !== "idle" && (
					<div className="space-y-8">
						{/* Breathing Circle */}
						<div className="flex items-center justify-center">
							<motion.div
								animate={{
									scale: state === "inhale" ? 1.8 : state === "exhale" ? 1 : 1.4,
									opacity: state === "pause" ? 0.5 : 1,
								}}
								transition={{
									duration:
										state === "inhale"
											? BREATHING_PATTERNS[pattern].inhale
											: state === "exhale"
												? BREATHING_PATTERNS[pattern].exhale
												: 0.3,
									ease: "easeInOut",
								}}
								className={`w-64 h-64 rounded-full bg-gradient-to-br ${getPhaseColor()} flex items-center justify-center shadow-2xl`}
							>
								<div className="text-center">
									<p className="text-2xl font-bold text-white mb-2">
										{getPhaseText()}
									</p>
									<p className="text-4xl font-bold text-white">
										{timeLeft}
									</p>
								</div>
							</motion.div>
						</div>

						{/* Cycle Counter */}
						<div className="text-center">
							<p className="text-gray-400 text-sm">Cycle</p>
							<p className="text-2xl font-bold text-white">
								{cycle + (state !== "inhale" ? 1 : 0)}
							</p>
						</div>

						{/* Controls */}
					<div className="flex gap-4">
						<Button
							variant="ghost"
							size="4"
							onClick={handleStop}
							className="flex-1 rounded-2xl h-14 text-white hover:bg-gray-800"
							style={{ border: "2px solid rgb(75, 85, 99)" }}
						>
							<Pause className="w-5 h-5 mr-2" />
							Stop
						</Button>
						<Button
							variant="ghost"
							size="4"
							onClick={handleStop}
							className="rounded-2xl h-14 text-white hover:bg-gray-800"
						>
							<RotateCcw className="w-5 h-5" />
						</Button>
					</div>
					</div>
				)}
			</motion.div>
		</div>
	);
}

