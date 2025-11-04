"use client";

import { Button } from "@whop/react/components";
import { motion } from "framer-motion";
import { Video, ArrowLeft, Users, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function JoinLiveSessionPage() {
	const router = useRouter();
	const [sessionId, setSessionId] = useState("");
	const [error, setError] = useState("");

	const handleJoinSession = () => {
		if (!sessionId.trim()) {
			setError("Please enter a session ID");
			return;
		}

		// Check if session exists (in production, this would check a database)
		const sessionData = localStorage.getItem(`live_session_${sessionId}`);
		
		if (!sessionData) {
			setError("Session not found. Please check the session ID and try again.");
			return;
		}

		// Store current session ID for the participant
		localStorage.setItem("current_participant_session", sessionId);
		
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
						<div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
							<Users className="w-6 h-6 text-blue-400" />
						</div>
						<h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
							Join Live Session
						</h1>
					</div>
					<p className="text-gray-10">Enter the session ID provided by your host</p>
				</div>

				<div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-blue-400/30 rounded-2xl p-8 shadow-xl">
					<div className="space-y-6">
						{/* Session ID Input */}
						<div>
							<label className="block text-sm font-semibold mb-2 text-gray-11">
								Session ID *
							</label>
							<input
								type="text"
								value={sessionId}
								onChange={(e) => {
									setSessionId(e.target.value);
									setError("");
								}}
								placeholder="Enter session ID"
								className="w-full px-4 py-3 rounded-xl border-2 border-blue-400/30 bg-white/5 backdrop-blur-sm text-gray-12 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50"
							/>
							{error && (
								<div className="mt-2 flex items-center gap-2 text-red-400 text-sm">
									<AlertCircle className="w-4 h-4" />
									<span>{error}</span>
								</div>
							)}
						</div>

						{/* Info Card */}
						<div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4 flex items-start gap-3">
							<Video className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
							<div className="text-sm text-gray-11">
								<p className="font-semibold mb-1">Ready to meditate together?</p>
								<p className="text-gray-10">
									Get the session ID from your host. Once you join, you'll be able to see and hear other participants while meditating together.
								</p>
							</div>
						</div>

						{/* Join Button */}
						<Button
							onClick={handleJoinSession}
							variant="classic"
							size="4"
							className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 rounded-xl shadow-lg"
						>
							<Users className="w-5 h-5 mr-2" />
							Join Session
						</Button>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
