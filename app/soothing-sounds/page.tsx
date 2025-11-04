"use client";

import { Button } from "@whop/react/components";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Pause, Lock, Volume2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { isPremiumUser } from "@/lib/premium";
import { Paywall } from "@/components/Paywall";

interface Sound {
	id: string;
	title: string;
	filename: string;
	duration: string;
	isLocked: boolean;
}

const SOOTHING_SOUNDS: Sound[] = [
	{ id: "ocean-waves", title: "Ocean Waves", filename: "ocean-waves-1-321649.mp3", duration: "Loop", isLocked: false },
	{ id: "evening-crickets", title: "Evening Crickets", filename: "nature-ambient-crickets-24529.mp3", duration: "Loop", isLocked: false },
	{ id: "thunder-storm", title: "Thunder Storm", filename: "thunder-and-rain-419305.mp3", duration: "Loop", isLocked: false },
	{ id: "distant-storm", title: "Distant Storm", filename: "a-distant-storm-337742.mp3", duration: "Loop", isLocked: false },
	{ id: "morning-birds", title: "Morning Birds", filename: "nature-birds-singing-217212.mp3", duration: "Loop", isLocked: false },
	{ id: "jungle-nature", title: "Jungle Nature", filename: "jungle-nature-229896.mp3", duration: "Loop", isLocked: false },
	{ id: "babbling-brook", title: "Babbling Brook", filename: "river-307903.mp3", duration: "Loop", isLocked: false },
	{ id: "waterfall", title: "Waterfall", filename: "waterflall-335776.mp3", duration: "Loop", isLocked: false },
	{ id: "windy-nature", title: "Windy Nature", filename: "windy-in-nature-219572.mp3", duration: "Loop", isLocked: false },
	{ id: "852hz-frequency", title: "852Hz Frequency", filename: "852hz-frequency-ambient-music-meditationcalmingzenspiritual-music-311554.mp3", duration: "Loop", isLocked: true },
	{ id: "963hz-frequency", title: "963Hz Frequency", filename: "963hz-frequency-ambient-music-meditationcalmingzenspiritual-music-311563.mp3", duration: "Loop", isLocked: true },
	{ id: "abundance-frequency", title: "Abundance Frequency", filename: "abundance-frequency-spiritual-11455.mp3", duration: "Loop", isLocked: true },
	{ id: "sacred-bowl", title: "Sacred Bowl Frequency", filename: "sacred-bowl-frequency-healing-388610.mp3", duration: "Loop", isLocked: true },
	{ id: "medusa-binaural", title: "Medusa Binaural", filename: "medusas_agueda_rioagueda_binaural_master48kh24-16907.mp3", duration: "Loop", isLocked: true },
];

export default function SoothingSoundsPage() {
	const router = useRouter();
	const [isPlaying, setIsPlaying] = useState<string | null>(null);
	const [isPremium, setIsPremium] = useState(false);
	const [showPaywall, setShowPaywall] = useState(false);
	const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

	useEffect(() => {
		setIsPremium(isPremiumUser());
	}, []);

	useEffect(() => {
		// Cleanup: pause all audio when component unmounts
		return () => {
			Object.values(audioRefs.current).forEach((audio) => {
				if (audio) {
					audio.pause();
					audio.currentTime = 0;
				}
			});
		};
	}, []);

	const handlePlayPause = (sound: Sound) => {
		// Check if locked and not premium
		if (sound.isLocked && !isPremium) {
			setShowPaywall(true);
			return;
		}

		const audio = audioRefs.current[sound.id];

		if (!audio) {
			// Create audio element if it doesn't exist
			const newAudio = new Audio(`/audio/soothing-sounds/${sound.filename}`);
			newAudio.loop = true;
			newAudio.volume = 0.7;
			audioRefs.current[sound.id] = newAudio;

			newAudio.addEventListener("ended", () => {
				setIsPlaying(null);
			});

			newAudio.addEventListener("error", () => {
				setIsPlaying(null);
			});

			newAudio.play().catch(() => {
				setIsPlaying(null);
			});

			// Pause all other audio
			Object.entries(audioRefs.current).forEach(([id, a]) => {
				if (id !== sound.id && a) {
					a.pause();
					a.currentTime = 0;
				}
			});

			setIsPlaying(sound.id);
			return;
		}

		if (isPlaying === sound.id) {
			// Pause current sound
			audio.pause();
			audio.currentTime = 0;
			setIsPlaying(null);
		} else {
			// Pause all other audio
			Object.entries(audioRefs.current).forEach(([id, a]) => {
				if (id !== sound.id && a) {
					a.pause();
					a.currentTime = 0;
				}
			});

			// Play selected sound
			audio.play().catch(() => {
				setIsPlaying(null);
			});
			setIsPlaying(sound.id);
		}
	};

	return (
		<>
			<div className="fixed inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 -z-20"></div>
			<div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative overflow-hidden pb-24">
				{/* Animated calming gradient background */}
				<motion.div
					className="fixed inset-0 -z-10"
					animate={{
						background: [
							"linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #5eead4 100%)",
							"linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
							"linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #d946ef 100%)",
							"linear-gradient(135deg, #2563eb 0%, #06b6d4 50%, #2dd4bf 100%)",
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
					<div className="text-center mb-8">
						<h1 className="text-5xl font-bold text-white mb-3 drop-shadow-lg">
							Soothing Sounds
						</h1>
						<p className="text-white/90 text-lg">
							Immerse yourself in calming nature sounds and find your peace
						</p>
					</div>

					{/* Sound List - Scrollable */}
					<div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pb-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
						{SOOTHING_SOUNDS.map((sound, index) => {
							const isCurrentlyPlaying = isPlaying === sound.id;
							const isLocked = sound.isLocked && !isPremium;

							return (
								<motion.div
									key={sound.id}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.05 }}
									className={`
										flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all
										${isLocked 
											? "bg-white/10 backdrop-blur-lg border-2 border-white/20 hover:bg-white/15"
											: isCurrentlyPlaying
												? "bg-blue-500/30 backdrop-blur-lg border-2 border-blue-400/50"
												: "bg-white/15 backdrop-blur-lg border-2 border-white/30 hover:bg-white/20"
										}
									`}
									style={{
										boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
									}}
									onClick={() => handlePlayPause(sound)}
								>
									{/* Icon */}
									<div 
										className={`
											w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-all
											${isLocked 
												? "bg-white/10" 
												: isCurrentlyPlaying
													? "bg-blue-500"
													: "bg-blue-500/70"
											}
										`}
									>
										{isLocked ? (
											<Lock className="w-6 h-6 text-white/60" />
										) : isCurrentlyPlaying ? (
											<Pause className="w-6 h-6 text-white" />
										) : (
											<Play className="w-6 h-6 text-white ml-0.5" />
										)}
									</div>

									{/* Text */}
									<div className="flex-1 min-w-0">
										<h3 className="text-lg font-semibold text-white mb-1">
											{sound.title}
										</h3>
										<p className="text-white/80 text-sm">
											{sound.duration}
										</p>
									</div>

									{/* Status indicator */}
									{isLocked && (
										<span className="text-white/60 text-xs font-medium">
											Premium
										</span>
									)}
								</motion.div>
							);
						})}
					</div>

					{/* Info Card */}
					<div 
						className="rounded-2xl p-6 backdrop-blur-lg border-2 border-white/20"
						style={{
							background: "rgba(255, 255, 255, 0.1)",
							boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
						}}
					>
						<h3 className="text-xl font-bold text-white mb-3">
							Benefits of Nature Sounds
						</h3>
						<ul className="space-y-2 text-white/90">
							<li className="flex items-start gap-2">
								<span className="text-blue-300 mt-1">•</span>
								<span>Reduces stress and anxiety levels naturally</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-blue-300 mt-1">•</span>
								<span>Improves focus and concentration</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-blue-300 mt-1">•</span>
								<span>Promotes better sleep quality</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-blue-300 mt-1">•</span>
								<span>Enhances meditation and mindfulness practice</span>
							</li>
						</ul>
					</div>
				</motion.div>
			</div>

			{showPaywall && (
				<Paywall
					onClose={() => {
						setShowPaywall(false);
						setIsPremium(isPremiumUser());
					}}
				/>
			)}
		</>
	);
}
