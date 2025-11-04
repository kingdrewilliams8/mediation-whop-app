"use client";

import { Button } from "@whop/react/components";
import { motion } from "framer-motion";
import { Save, Clock } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { saveSession } from "@/lib/storage";
import type { MeditationSession } from "@/lib/types";

export default function TrackerPage() {
	const router = useRouter();
	const [duration, setDuration] = useState(5);
	const [notes, setNotes] = useState("");
	const [isSaving, setIsSaving] = useState(false);

	const handleSave = () => {
		if (duration <= 0) return;

		setIsSaving(true);
		const session: MeditationSession = {
			id: `session-${Date.now()}`,
			date: format(new Date(), "yyyy-MM-dd"),
			duration,
			notes: notes.trim() || undefined,
			createdAt: new Date().toISOString(),
		};

		saveSession(session);
		setTimeout(() => {
			setIsSaving(false);
			setNotes("");
			setDuration(5);
			router.push("/calendar");
		}, 500);
	};

	const durationOptions = [5, 10, 15, 20, 30, 45, 60];

	return (
		<div className="py-8 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto relative">
			{/* Decorative elements */}
			<div className="absolute top-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl -z-10" />
			<div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl -z-10" />

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="space-y-8"
			>
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
						Log Meditation
					</h1>
					<p className="text-gray-10">
						Track your mindfulness practice
					</p>
				</div>

				<div className="bg-gradient-to-br from-pink-600 to-orange-600 border-2 border-pink-400 rounded-2xl p-6 shadow-xl">
					<div className="mb-6">
						<label className="block text-sm font-medium text-gray-12 mb-3">
							Duration (minutes)
						</label>
						<div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
							{durationOptions.map((mins) => (
								<motion.button
									key={mins}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={() => setDuration(mins)}
									className={`
										py-3 rounded-lg border transition-all
										${
											duration === mins
												? "bg-gray-a4 border-gray-a6"
												: "bg-gray-a3 border-gray-a4 hover:bg-gray-a4"
										}
									`}
								>
									<span className="text-sm font-medium text-gray-12">
										{mins}
									</span>
								</motion.button>
							))}
						</div>
						<div className="mt-4">
							<input
								type="number"
								min="1"
								max="120"
								value={duration}
								onChange={(e) =>
									setDuration(Number(e.target.value))
								}
								className="w-full px-4 py-3 rounded-lg bg-gray-a3 border border-gray-a4 text-gray-12 focus:outline-none focus:ring-2 focus:ring-blue-9"
								placeholder="Custom duration"
							/>
						</div>
					</div>

					<div className="mb-6">
						<label className="block text-sm font-medium text-gray-12 mb-3">
							Notes (optional)
						</label>
						<textarea
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							rows={4}
							className="w-full px-4 py-3 rounded-lg bg-gray-a3 border border-gray-a4 text-gray-12 focus:outline-none focus:ring-2 focus:ring-blue-9 resize-none"
							placeholder="How did you feel? What did you focus on?"
						/>
					</div>

					<div className="flex items-center gap-4 text-sm text-gray-10 mb-6 p-4 bg-gray-a3 rounded-lg">
						<Clock className="w-5 h-5" />
						<span>
							Date: {format(new Date(), "EEEE, MMMM d, yyyy")}
						</span>
					</div>

									<Button
										variant="classic"
										size="4"
										onClick={handleSave}
										disabled={isSaving || duration <= 0}
										className="w-full rounded-2xl h-14 text-lg bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 border-0 shadow-lg hover:shadow-xl transition-all"
									>
										<Save className="w-5 h-5 mr-2" />
										{isSaving ? "Saving..." : "Save Session"}
									</Button>
				</div>
			</motion.div>
		</div>
	);
}

