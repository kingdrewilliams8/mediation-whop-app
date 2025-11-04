"use client";

import { Button } from "@whop/react/components";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Headphones, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function AnxietyPage() {
	const router = useRouter();
	const [colorIndex, setColorIndex] = useState(0);

	// Gradual calming color transitions
	const calmingColors = [
		"from-blue-500 via-cyan-400 to-teal-300",
		"from-indigo-500 via-purple-400 to-pink-300",
		"from-violet-500 via-purple-400 to-fuchsia-300",
		"from-blue-600 via-cyan-500 to-teal-400",
	];

	useEffect(() => {
		// Gradually transition colors every 8 seconds
		const interval = setInterval(() => {
			setColorIndex((prev) => (prev + 1) % calmingColors.length);
		}, 8000);
		return () => clearInterval(interval);
	}, []);

	const anxietyTechniques = [
		{
			title: "4-7-8 Breathing",
			description: "Inhale for 4, hold for 7, exhale for 8",
			icon: Heart,
			color: "from-pink-500 to-rose-500",
			onClick: () => {}, // Can add breathing exercise page later
		},
		{
			title: "Soothing Sounds",
			description: "Calm nature sounds and melodies",
			icon: Headphones,
			color: "from-blue-500 to-indigo-500",
			onClick: () => router.push("/soothing-sounds"),
		},
		{
			title: "Guided Meditation",
			description: "Gentle voice guiding you to calm",
			icon: Sparkles,
			color: "from-purple-500 to-violet-500",
			onClick: () => router.push("/guided-meditations/anxiety"),
		},
	];

	return (
		<>
			<div className="fixed inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 -z-20"></div>
			<div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative overflow-hidden">
				{/* Animated calming gradient background */}
				<motion.div
					className="fixed inset-0 -z-10"
					animate={{
						background: [
							`linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #5eead4 100%)`,
							`linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)`,
							`linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #d946ef 100%)`,
							`linear-gradient(135deg, #2563eb 0%, #06b6d4 50%, #2dd4bf 100%)`,
						],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						repeatType: "reverse",
						ease: "easeInOut",
					}}
				/>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="space-y-8 relative z-10"
			>
				<Button
					variant="ghost"
					size="3"
					onClick={() => router.push("/")}
					className="mb-4"
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back
				</Button>

				<div className="text-center mb-8">
					<h1 className="text-5xl font-bold text-white mb-3 drop-shadow-lg">
						Anxiety Relief
					</h1>
					<p className="text-white/90 text-lg">
						Take a moment to breathe and find your calm
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{anxietyTechniques.map((technique, index) => {
						const Icon = technique.icon;
						return (
							<motion.div
								key={technique.title}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
								whileHover={{ scale: 1.05, y: -5 }}
								whileTap={{ scale: 0.95 }}
								onClick={technique.onClick}
								className={`rounded-2xl p-6 text-center cursor-pointer transition-all shadow-2xl bg-gradient-to-br ${technique.color} border-2 border-white/20`}
								style={{
									boxShadow: "0 20px 60px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.1) inset"
								}}
							>
								<div className="w-16 h-16 bg-white/30 backdrop-blur-lg rounded-full flex items-center justify-center mx-auto mb-4">
									<Icon className="w-8 h-8 text-white" />
								</div>
								<h3 className="text-xl font-bold text-white mb-2">
									{technique.title}
								</h3>
								<p className="text-white/90 text-sm">
									{technique.description}
								</p>
							</motion.div>
						);
					})}
				</div>

				{/* Breathing Exercise */}
				<div
					className="rounded-2xl p-8 text-center"
					style={{
						background: "rgba(255, 255, 255, 0.15)",
						backdropFilter: "blur(20px)",
						border: "2px solid rgba(255, 255, 255, 0.2)",
						boxShadow: "0 20px 60px rgba(0,0,0,0.2)"
					}}
				>
					<h2 className="text-2xl font-bold text-white mb-4">
						Box Breathing
					</h2>
					<p className="text-white/90 mb-6">
						Follow the expanding circle - breathe in as it grows, breathe out as it shrinks
					</p>
					<motion.div
						animate={{
							scale: [1, 1.5, 1, 1.5, 1],
						}}
						transition={{
							duration: 16,
							repeat: Infinity,
							ease: "easeInOut",
						}}
						className="w-64 h-64 mx-auto bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center border-4 border-white/30"
						style={{
							boxShadow: "0 0 100px rgba(255, 255, 255, 0.3)"
						}}
					>
						<span className="text-6xl">🌊</span>
					</motion.div>
					<p className="text-white/80 text-sm mt-6">
						Breathe in... Hold... Breathe out... Rest...
					</p>
				</div>
			</motion.div>
			</div>
		</>
	);
}

