"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Play } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@whop/react/components";
import Link from "next/link";

// Meditation session data
interface Session {
	id: number;
	title: string;
	duration: string;
}

const MEDITATION_DATA: Record<string, { title: string; color: string; sessions: Session[] }> = {
	sleep: {
		title: "Sleep Meditation",
		color: "#a78bfa",
		sessions: [
			{ id: 1, title: "Letting Go of the Day", duration: "2 MIN" },
			{ id: 2, title: "Body Scan for Deep Relaxation", duration: "2 MIN" },
			{ id: 3, title: "Breathing into Calm", duration: "1 MIN" },
			{ id: 4, title: "Safe Sanctuary", duration: "1 MIN" },
			{ id: 5, title: "Floating into Sleep", duration: "5 MIN" },
		],
	},
	anxiety: {
		title: "Anxiety Relief",
		color: "#fb923c",
		sessions: [
			{ id: 1, title: "Finding Your Anchor", duration: "2 MIN" },
			{ id: 2, title: "Grounding Practice", duration: "3 MIN" },
			{ id: 3, title: "Soothing the Nervous System", duration: "2 MIN" },
			{ id: 4, title: "Safe Space Visualization", duration: "2 MIN" },
			{ id: 5, title: "Calm and Center", duration: "2 MIN" },
			{ id: 6, title: "Peaceful Presence", duration: "2 MIN" },
		],
	},
	focus: {
		title: "Focus & Concentration",
		color: "#2dd4bf",
		sessions: [
			{ id: 1, title: "Mindful Clarity", duration: "1 MIN" },
			{ id: 2, title: "Laser Focus", duration: "1 MIN" },
			{ id: 3, title: "Mental Reset", duration: "1 MIN" },
			{ id: 4, title: "Deep Concentration", duration: "1 MIN" },
			{ id: 5, title: "Productive Mindset", duration: "1 MIN" },
			{ id: 6, title: "Sustained Attention", duration: "1 MIN" },
			{ id: 7, title: "Clear Intentions", duration: "1 MIN" },
			{ id: 8, title: "Master Focus", duration: "1 MIN" },
		],
	},
	stress: {
		title: "Stress Release",
		color: "#60a5fa",
		sessions: [
			{ id: 1, title: "Release Tension", duration: "1 MIN" },
			{ id: 2, title: "Let It Go", duration: "1 MIN" },
			{ id: 3, title: "Stress Melt Away", duration: "1 MIN" },
			{ id: 4, title: "Deep Relaxation", duration: "1 MIN" },
			{ id: 5, title: "Body Reset", duration: "1 MIN" },
			{ id: 6, title: "Mindful Recovery", duration: "1 MIN" },
			{ id: 7, title: "Complete Rest", duration: "1 MIN" },
		],
	},
	confidence: {
		title: "Build Confidence",
		color: "#ec4899",
		sessions: [
			{ id: 1, title: "Inner Strength", duration: "10 MIN" },
			{ id: 2, title: "Self-Belief", duration: "15 MIN" },
			{ id: 3, title: "Empowered Mindset", duration: "12 MIN" },
			{ id: 4, title: "Rising Confidence", duration: "18 MIN" },
			{ id: 5, title: "Unlock Potential", duration: "20 MIN" },
			{ id: 6, title: "Authentic Power", duration: "25 MIN" },
			{ id: 7, title: "Radiate Strength", duration: "30 MIN" },
		],
	},
	gratitude: {
		title: "Gratitude Practice",
		color: "#f59e0b",
		sessions: [
			{ id: 1, title: "Simple Gratitude", duration: "10 MIN" },
			{ id: 2, title: "Heart of Appreciation", duration: "15 MIN" },
			{ id: 3, title: "Thankful Mind", duration: "12 MIN" },
			{ id: 4, title: "Deep Gratitude", duration: "18 MIN" },
			{ id: 5, title: "Grateful Living", duration: "20 MIN" },
			{ id: 6, title: "Abundant Joy", duration: "25 MIN" },
		],
	},
};

export default function MeditationSessionsPage() {
	const params = useParams();
	const router = useRouter();
	const meditationId = params.meditationId as string;
	const meditation = MEDITATION_DATA[meditationId];

	if (!meditation) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-white">Meditation not found</p>
			</div>
		);
	}

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
					onClick={() => router.push("/")}
					className="mb-4"
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back
				</Button>

				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-white mb-2">{meditation.title}</h1>
					<p className="text-gray-400">Choose your meditation session</p>
				</div>

				<div className="space-y-4">
					{meditation.sessions.map((session, index) => (
						<Link key={session.id} href={`/guided-meditations/${meditationId}/${session.id}`}>
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: index * 0.1 }}
								className="flex items-center gap-4 p-6 rounded-2xl cursor-pointer transition-all hover:scale-[1.02]"
								style={{
									backgroundColor: `${meditation.color}20`,
									borderColor: meditation.color,
									border: "2px solid",
									boxShadow: `0 8px 20px -5px ${meditation.color}40`,
								}}
							>
								<div
									className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
									style={{ backgroundColor: meditation.color }}
								>
									<Play className="w-6 h-6 text-white ml-0.5" />
								</div>
								<div className="flex-1">
									<h3 className="text-lg font-semibold text-white mb-1">
										{index + 1}. {session.title}
									</h3>
									<p className="text-sm text-gray-400">{session.duration}</p>
								</div>
							</motion.div>
						</Link>
					))}
				</div>
			</motion.div>
		</div>
	);
}

