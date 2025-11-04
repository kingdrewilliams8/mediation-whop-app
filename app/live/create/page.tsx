"use client";

import { Button } from "@whop/react/components";
import { motion } from "framer-motion";
import { Video, ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";

export default function CreateLiveSessionPage() {
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
					<span className="inline-block px-4 py-2 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-sm font-semibold rounded-full border border-yellow-500/30 mb-4">
						Coming Soon
					</span>
					<p className="text-gray-700 dark:text-gray-300 mt-4">
						We're working hard to bring you live meditation sessions where you can host and join group meditations with your community. Stay tuned!
					</p>
				</div>

				<div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-purple-400/30 rounded-2xl p-8 shadow-xl">
					<div className="text-center space-y-4">
						<div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
							<Clock className="w-10 h-10 text-purple-400" />
						</div>
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
							Feature in Development
						</h2>
						<p className="text-gray-700 dark:text-gray-300">
							Live sessions will allow you to:
						</p>
						<ul className="text-left max-w-md mx-auto space-y-2 text-gray-700 dark:text-gray-300">
							<li className="flex items-start gap-2">
								<span className="text-purple-400 mt-1">•</span>
								<span>Host guided meditation sessions for your community</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-purple-400 mt-1">•</span>
								<span>Join live meditation sessions with others</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-purple-400 mt-1">•</span>
								<span>Meditate together in real-time with synchronized timers</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-purple-400 mt-1">•</span>
								<span>Connect with video and audio</span>
							</li>
						</ul>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
