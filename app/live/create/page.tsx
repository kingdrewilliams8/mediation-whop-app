"use client";

import { Button } from "@whop/react/components";
import { motion } from "framer-motion";
import { Users, Video, Calendar, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function CreateLiveSessionPage() {
	const router = useRouter();
	const [sessionName, setSessionName] = useState("");
	const [description, setDescription] = useState("");
	const [duration, setDuration] = useState(10);

	const handleCreateSession = async () => {
		if (!sessionName.trim()) {
			alert("Please enter a session name");
			return;
		}

		// Generate a unique session ID
		const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
		
		// Store session info in localStorage (for local reference)
		const sessionData = {
			id: sessionId,
			name: sessionName,
			description,
			duration,
			hostId: "owner", // In production, use actual user ID
			createdAt: new Date().toISOString(),
			participants: [],
		};
		
		localStorage.setItem(`live_session_${sessionId}`, JSON.stringify(sessionData));
		localStorage.setItem("current_host_session", sessionId);
		
		// Store session data in API immediately for cross-device access
		try {
			await fetch("/api/signaling", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					sessionId,
					type: "create-session",
					from: "host",
					to: undefined,
					data: {
						sessionData: sessionData,
					},
				}),
			});
		} catch (error) {
			console.error("Failed to store session in API:", error);
			// Continue anyway - session will be stored when host joins
		}
		
		// Navigate to the live session room
		router.push(`/live/${sessionId}`);
	};

	return (
		<div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto relative">
			{/* Back button */}
			<Link href="/">
				<Button variant="ghost" size="3" className="mb-6">
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Home
				</Button>
			</Link>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="space-y-6"
			>
				<div className="text-center mb-8">
					<div className="flex items-center justify-center gap-3 mb-3">
						<div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
							<Video className="w-6 h-6 text-purple-400" />
						</div>
						<h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
							Create Live Session
						</h1>
					</div>
					<p className="text-gray-700 dark:text-gray-300">Host a guided meditation session for your community</p>
				</div>

				<div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-purple-400/30 rounded-2xl p-8 shadow-xl">
					<div className="space-y-6">
						{/* Session Name */}
						<div>
							<label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">
								Session Name *
							</label>
							<input
								type="text"
								value={sessionName}
								onChange={(e) => setSessionName(e.target.value)}
								placeholder="e.g., Morning Mindfulness Session"
								className="w-full px-4 py-3 rounded-xl border-2 border-purple-400/30 bg-white/5 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50"
							/>
						</div>

						{/* Description */}
						<div>
							<label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">
								Description (Optional)
							</label>
							<textarea
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="What will this session focus on?"
								rows={3}
								className="w-full px-4 py-3 rounded-xl border-2 border-purple-400/30 bg-white/5 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 resize-none"
							/>
						</div>

						{/* Duration */}
						<div>
							<label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">
								Duration: {duration} minutes
							</label>
							<input
								type="range"
								min="5"
								max="60"
								step="5"
								value={duration}
								onChange={(e) => setDuration(Number(e.target.value))}
								className="w-full h-2 bg-purple-400/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
							/>
							<div className="flex justify-between text-xs text-gray-700 dark:text-gray-300 mt-1">
								<span>5 min</span>
								<span>60 min</span>
							</div>
						</div>

						{/* Info Card */}
						<div className="bg-purple-500/10 border border-purple-400/30 rounded-xl p-4 flex items-start gap-3">
							<Users className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
							<div className="text-sm text-gray-900 dark:text-gray-100">
								<p className="font-semibold mb-1">How it works</p>
								<p className="text-gray-700 dark:text-gray-300">
									Create a session and share the session ID with your members. They can join and meditate together with you in real-time.
								</p>
							</div>
						</div>

						{/* Create Button */}
						<Button
							onClick={handleCreateSession}
							variant="classic"
							size="4"
							className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 rounded-xl shadow-lg"
						>
							<Video className="w-5 h-5 mr-2" />
							Start Live Session
						</Button>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
