"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Play, Pause, SkipBack, SkipForward, RotateCw } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Button } from "@whop/react/components";

// Meditation session data
const MEDITATION_DATA: Record<string, { title: string; color: string; sessions: any[] }> = {
	sleep: {
		title: "Sleep Meditation",
		color: "#a78bfa",
		sessions: [
			{ id: "1", title: "Letting Go of the Day", duration: 600 },
			{ id: "2", title: "Body Scan for Deep Relaxation", duration: 900 },
			{ id: "3", title: "Breathing into Calm", duration: 720 },
			{ id: "4", title: "Safe Sanctuary", duration: 1080 },
			{ id: "5", title: "Floating into Sleep", duration: 1200 },
		],
	},
	anxiety: {
		title: "Anxiety Relief",
		color: "#fb923c",
		sessions: [
			{ id: "1", title: "Finding Your Anchor", duration: 600 },
			{ id: "2", title: "Grounding Practice", duration: 720 },
			{ id: "3", title: "Soothing the Nervous System", duration: 900 },
			{ id: "4", title: "Safe Space Visualization", duration: 1080 },
			{ id: "5", title: "Calm and Center", duration: 1200 },
			{ id: "6", title: "Peaceful Presence", duration: 1320 },
		],
	},
	focus: {
		title: "Focus & Concentration",
		color: "#2dd4bf",
		sessions: [
			{ id: "1", title: "Mindful Clarity", duration: 600 },
			{ id: "2", title: "Laser Focus", duration: 900 },
			{ id: "3", title: "Mental Reset", duration: 720 },
			{ id: "4", title: "Deep Concentration", duration: 1200 },
			{ id: "5", title: "Productive Mindset", duration: 1080 },
			{ id: "6", title: "Sustained Attention", duration: 1500 },
			{ id: "7", title: "Clear Intentions", duration: 900 },
			{ id: "8", title: "Master Focus", duration: 1800 },
		],
	},
	stress: {
		title: "Stress Release",
		color: "#60a5fa",
		sessions: [
			{ id: "1", title: "Release Tension", duration: 600 },
			{ id: "2", title: "Let It Go", duration: 900 },
			{ id: "3", title: "Stress Melt Away", duration: 720 },
			{ id: "4", title: "Deep Relaxation", duration: 1080 },
			{ id: "5", title: "Body Reset", duration: 1200 },
			{ id: "6", title: "Mindful Recovery", duration: 1500 },
			{ id: "7", title: "Complete Rest", duration: 1800 },
		],
	},
	confidence: {
		title: "Build Confidence",
		color: "#ec4899",
		sessions: [
			{ id: "1", title: "Inner Strength", duration: 600 },
			{ id: "2", title: "Self-Belief", duration: 900 },
			{ id: "3", title: "Empowered Mindset", duration: 720 },
			{ id: "4", title: "Rising Confidence", duration: 1080 },
			{ id: "5", title: "Unlock Potential", duration: 1200 },
			{ id: "6", title: "Authentic Power", duration: 1500 },
			{ id: "7", title: "Radiate Strength", duration: 1800 },
		],
	},
	gratitude: {
		title: "Gratitude Practice",
		color: "#f59e0b",
		sessions: [
			{ id: "1", title: "Simple Gratitude", duration: 600 },
			{ id: "2", title: "Heart of Appreciation", duration: 900 },
			{ id: "3", title: "Thankful Mind", duration: 720 },
			{ id: "4", title: "Deep Gratitude", duration: 1080 },
			{ id: "5", title: "Grateful Living", duration: 1200 },
			{ id: "6", title: "Abundant Joy", duration: 1500 },
		],
	},
};

export default function MeditationPlayerPage() {
	const params = useParams();
	const router = useRouter();
	const meditationId = params.meditationId as string;
	const sessionId = params.sessionId as string;
	
	const meditation = MEDITATION_DATA[meditationId];
	const session = meditation?.sessions.find(s => s.id === sessionId);
	
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [progress, setProgress] = useState(0);
	const [hasError, setHasError] = useState(false);
	const [audioDuration, setAudioDuration] = useState(0);
	const [isLooping, setIsLooping] = useState(false);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		if (session) {
			setCurrentTime(0);
			setProgress(0);
			setIsPlaying(false);
			setHasError(false);
			setAudioDuration(0);
		}
	}, [session, sessionId]);

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.ontimeupdate = () => {
				if (audioRef.current) {
					const newTime = audioRef.current.currentTime;
					setCurrentTime(newTime);
					if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
						setProgress((newTime / audioRef.current.duration) * 100);
					}
				}
			};
			audioRef.current.onerror = () => {
				setHasError(true);
				// Audio file not available - this is expected until MP3 files are added
			};
			audioRef.current.onloadeddata = () => {
				setHasError(false);
				if (audioRef.current && audioRef.current.duration && !isNaN(audioRef.current.duration)) {
					setAudioDuration(audioRef.current.duration);
				}
			};
			audioRef.current.onloadedmetadata = () => {
				if (audioRef.current && audioRef.current.duration && !isNaN(audioRef.current.duration)) {
					setAudioDuration(audioRef.current.duration);
				}
			};
		}
	}, []);

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.loop = isLooping;
			audioRef.current.onended = () => {
				if (!isLooping) {
					setIsPlaying(false);
					setCurrentTime(0);
					setProgress(0);
				}
			};
		}
	}, [isLooping]);

	const handlePlayPause = () => {
		if (audioRef.current) {
			if (isPlaying) {
				audioRef.current.pause();
			} else {
				audioRef.current.play();
			}
			setIsPlaying(!isPlaying);
		}
	};

	const handleRewind = () => {
		if (audioRef.current) {
			audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
		}
	};

	const handleForward = () => {
		if (audioRef.current) {
			audioRef.current.currentTime = Math.min(
				audioRef.current.duration,
				audioRef.current.currentTime + 10
			);
		}
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	if (!meditation || !session) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-white">Session not found</p>
			</div>
		);
	}

	const totalDuration = audioDuration || session.duration;
	const color = meditation.color;
	
	const handleToggleRepeat = () => {
		setIsLooping(!isLooping);
		if (audioRef.current) {
			audioRef.current.loop = !isLooping;
		}
	};

	return (
		<div 
			className="min-h-screen relative overflow-hidden"
			style={{
				background: `linear-gradient(135deg, ${color}15 0%, ${color}25 100%)`,
			}}
		>
			{/* Back Button */}
			<Button
				variant="ghost"
				size="3"
				onClick={() => router.push(`/guided-meditations/${meditationId}`)}
				className="absolute top-6 left-4 z-20"
			>
				<ChevronDown className="w-5 h-5 text-white transform rotate-90" />
			</Button>

			{/* Audio Player */}
			<div className="flex flex-col items-center justify-center min-h-screen px-8 py-20">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="space-y-12 text-center w-full max-w-md"
				>
					{/* Track Info */}
					<div>
						<p className="text-white/70 text-sm mb-2">{meditation.title.toUpperCase()}</p>
						<h2 className="text-3xl font-bold text-white">{session.title}</h2>
						{hasError && (
							<p className="text-sm text-orange-300 mt-2">
								Audio file not available yet. Please add the MP3 file to the folder.
							</p>
						)}
					</div>

					{/* Visual Blob Effect */}
					<div className="relative flex items-center justify-center">
						<motion.div
							animate={{
								scale: isPlaying ? [1, 1.15, 1] : 1,
								rotate: isPlaying ? [0, 5, 0] : 0,
							}}
							transition={{
								duration: 3,
								repeat: isPlaying ? Infinity : 0,
								ease: "easeInOut",
							}}
							className="relative"
						>
							{/* Blob shapes */}
							<AnimatePresence>
								{isPlaying && (
									<>
										{[...Array(4)].map((_, i) => (
											<motion.div
												key={i}
												initial={{ scale: 0, opacity: 0.5 }}
												animate={{
													scale: [1, 1.3, 1],
													opacity: [0.3, 0.6, 0.3],
													x: [0, Math.cos(i * 90 * Math.PI / 180) * 40],
													y: [0, Math.sin(i * 90 * Math.PI / 180) * 40],
												}}
												transition={{
													duration: 2,
													repeat: Infinity,
													delay: i * 0.5,
												}}
												className="absolute inset-0 rounded-full"
												style={{
													background: color,
													filter: "blur(20px)",
												}}
											/>
										))}
									</>
								)}
							</AnimatePresence>

							{/* Main Play Button */}
							<button
								onClick={handlePlayPause}
								disabled={hasError}
								className="relative w-32 h-32 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
								style={{
									background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
									boxShadow: `0 20px 50px ${color}60`,
								}}
							>
								{isPlaying ? (
									<Pause className="w-16 h-16 text-white" />
								) : (
									<Play className="w-16 h-16 text-white ml-1" />
								)}
							</button>
						</motion.div>
					</div>

					{/* Skip Controls */}
					<div className="flex items-center justify-center gap-8">
						<button
							onClick={handleRewind}
							className="p-3 rounded-full hover:bg-white/10 transition-colors"
						>
							<SkipBack className="w-8 h-8 text-white" />
						</button>
						<button
							onClick={handleForward}
							className="p-3 rounded-full hover:bg-white/10 transition-colors"
						>
							<SkipForward className="w-8 h-8 text-white" />
						</button>
					</div>

					{/* Progress Bar */}
					<div className="space-y-2">
						<div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
							<motion.div
								className="h-full rounded-full"
								style={{ backgroundColor: color }}
								animate={{ width: `${progress}%` }}
								transition={{ duration: 0.1 }}
							/>
						</div>
						<div className="flex justify-between text-sm text-white/70">
							<span>{formatTime(currentTime)}</span>
							<span>{formatTime(totalDuration)}</span>
						</div>
					</div>

					{/* Additional Controls */}
					<div className="flex items-center justify-center gap-4">
						<button 
							onClick={handleToggleRepeat}
							className={`px-6 py-3 rounded-full transition-colors flex items-center gap-2 ${
								isLooping ? "bg-red-500 hover:bg-red-600" : "bg-white/10 hover:bg-white/20"
							}`}
						>
							<RotateCw className={`w-5 h-5 text-white ${isLooping ? "animate-spin" : ""}`} />
							<span className="text-white text-sm">Repeat</span>
						</button>
					</div>
				</motion.div>
			</div>

			{/* Hidden audio element */}
			<audio
				ref={audioRef}
				src={`/audio/guided-meditations/${meditationId}-${sessionId}.mp3`}
			/>
		</div>
	);
}

