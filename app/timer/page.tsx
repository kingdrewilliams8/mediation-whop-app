"use client";

import { Button } from "@whop/react/components";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
	Play,
	Pause,
	Square,
	RotateCcw,
	Volume2,
	Upload,
	Music,
	X,
	Headphones,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { saveSession } from "@/lib/storage";
import type { MeditationSession } from "@/lib/types";
import { isPremiumUser } from "@/lib/premium";
import { Paywall } from "@/components/Paywall";

type TimerState = "idle" | "running" | "paused" | "completed";

const RINGTONES = [
	{ name: "Bell", value: "bell" },
	{ name: "Gong", value: "gong" },
	{ name: "Chime", value: "chime" },
	{ name: "Singing Bowl", value: "bowl" },
	{ name: "Tibetan Bowl", value: "tibetan" },
	{ name: "Crystal Bowl", value: "crystal" },
	{ name: "Zen Bell", value: "zen" },
	{ name: "Ocean Waves", value: "ocean" },
	{ name: "Forest Chimes", value: "forest" },
	{ name: "Peaceful Tone", value: "peaceful" },
];

// Enhanced sound generation using Web Audio API
function playTone(type: string) {
	const audioContext = new (window.AudioContext ||
		(window as any).webkitAudioContext)();
	
	switch (type) {
		case "bell": {
			// Clear, bright bell sound
			const osc = audioContext.createOscillator();
			const gain = audioContext.createGain();
			osc.type = "sine";
			osc.frequency.value = 523.25; // C5
			gain.gain.setValueAtTime(0.4, audioContext.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
			osc.connect(gain);
			gain.connect(audioContext.destination);
			osc.start();
			osc.stop(audioContext.currentTime + 1.5);
			break;
		}
		case "gong": {
			// Deep, resonant gong
			const osc = audioContext.createOscillator();
			const gain = audioContext.createGain();
			osc.type = "triangle";
			osc.frequency.value = 98; // Low G2
			gain.gain.setValueAtTime(0.5, audioContext.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 3);
			osc.connect(gain);
			gain.connect(audioContext.destination);
			osc.start();
			osc.stop(audioContext.currentTime + 3);
			break;
		}
		case "chime": {
			// High-pitched, bright chime
			const osc = audioContext.createOscillator();
			const gain = audioContext.createGain();
			osc.type = "sine";
			osc.frequency.value = 1047; // C6 - high chime
			gain.gain.setValueAtTime(0.35, audioContext.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
			osc.connect(gain);
			gain.connect(audioContext.destination);
			osc.start();
			osc.stop(audioContext.currentTime + 1);
			break;
		}
		case "bowl": {
			// Singing bowl - sustained, resonant
			const osc = audioContext.createOscillator();
			const gain = audioContext.createGain();
			osc.type = "sine";
			osc.frequency.value = 329.63; // E4
			gain.gain.setValueAtTime(0.3, audioContext.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 4);
			osc.connect(gain);
			gain.connect(audioContext.destination);
			osc.start();
			osc.stop(audioContext.currentTime + 4);
			break;
		}
		case "tibetan": {
			// Tibetan bowl - deep, resonant, healing frequency with harmonics
			const osc1 = audioContext.createOscillator();
			const osc2 = audioContext.createOscillator();
			const gain = audioContext.createGain();
			
			// Base frequency at 174 Hz (healing frequency)
			osc1.type = "sine";
			osc1.frequency.value = 174;
			
			// Add harmonic at 348 Hz (octave) for richer sound
			osc2.type = "sine";
			osc2.frequency.value = 348;
			
			// Start with higher gain for better audibility
			gain.gain.setValueAtTime(0.6, audioContext.currentTime);
			// Hold the peak for a brief moment
			gain.gain.setValueAtTime(0.6, audioContext.currentTime + 0.1);
			// Then exponential decay over 6 seconds
			gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 6);
			
			osc1.connect(gain);
			osc2.connect(gain);
			gain.connect(audioContext.destination);
			
			osc1.start();
			osc2.start();
			osc1.stop(audioContext.currentTime + 6);
			osc2.stop(audioContext.currentTime + 6);
			break;
		}
		case "crystal": {
			// Crystal bowl - bright, pure tone
			const osc = audioContext.createOscillator();
			const gain = audioContext.createGain();
			osc.type = "sine";
			osc.frequency.value = 528; // Love frequency (C5#)
			gain.gain.setValueAtTime(0.35, audioContext.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 3);
			osc.connect(gain);
			gain.connect(audioContext.destination);
			osc.start();
			osc.stop(audioContext.currentTime + 3);
			break;
		}
		case "zen": {
			// Zen bell - natural, calming
			const osc = audioContext.createOscillator();
			const gain = audioContext.createGain();
			osc.type = "sine";
			osc.frequency.value = 432; // Natural tuning (A4)
			gain.gain.setValueAtTime(0.3, audioContext.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2.5);
			osc.connect(gain);
			gain.connect(audioContext.destination);
			osc.start();
			osc.stop(audioContext.currentTime + 2.5);
			break;
		}
		case "ocean": {
			// Ocean waves - layered frequencies to create wave-like sound
			const osc1 = audioContext.createOscillator();
			const osc2 = audioContext.createOscillator();
			const osc3 = audioContext.createOscillator();
			const gain = audioContext.createGain();
			
			osc1.type = "sawtooth";
			osc1.frequency.value = 60; // Low rumble
			osc2.type = "sine";
			osc2.frequency.value = 120; // Mid layer
			osc3.type = "sine";
			osc3.frequency.value = 240; // Upper layer for wave texture
			
			gain.gain.setValueAtTime(0.3, audioContext.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 3);
			
			osc1.connect(gain);
			osc2.connect(gain);
			osc3.connect(gain);
			gain.connect(audioContext.destination);
			
			osc1.start();
			osc2.start();
			osc3.start();
			osc1.stop(audioContext.currentTime + 3);
			osc2.stop(audioContext.currentTime + 3);
			osc3.stop(audioContext.currentTime + 3);
			break;
		}
		case "forest": {
			// Forest chimes - bird-like, natural
			const osc1 = audioContext.createOscillator();
			const osc2 = audioContext.createOscillator();
			const gain = audioContext.createGain();
			osc1.type = "sine";
			osc1.frequency.value = 440; // A4
			osc2.type = "sine";
			osc2.frequency.value = 554.37; // C#5
			gain.gain.setValueAtTime(0.3, audioContext.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
			osc1.connect(gain);
			osc2.connect(gain);
			gain.connect(audioContext.destination);
			osc1.start();
			osc2.start();
			osc1.stop(audioContext.currentTime + 2);
			osc2.stop(audioContext.currentTime + 2);
			break;
		}
		case "peaceful": {
			// Peaceful tone - soft, gentle
			const osc = audioContext.createOscillator();
			const gain = audioContext.createGain();
			osc.type = "sine";
			osc.frequency.value = 256; // Middle C, gentle
			gain.gain.setValueAtTime(0.2, audioContext.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2.5);
			osc.connect(gain);
			gain.connect(audioContext.destination);
			osc.start();
			osc.stop(audioContext.currentTime + 2.5);
			break;
		}
		default: {
			const osc = audioContext.createOscillator();
			const gain = audioContext.createGain();
			osc.type = "sine";
			osc.frequency.value = 440;
			gain.gain.setValueAtTime(0.3, audioContext.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
			osc.connect(gain);
			gain.connect(audioContext.destination);
			osc.start();
			osc.stop(audioContext.currentTime + 2);
		}
	}
}

export default function TimerPage() {
	const [duration, setDuration] = useState(5);
	const [timeLeft, setTimeLeft] = useState(5 * 60);
	const [state, setState] = useState<TimerState>("idle");
	const [selectedRingtone, setSelectedRingtone] = useState("bell");
	const [startedAt, setStartedAt] = useState<Date | null>(null);
	const [customAudio, setCustomAudio] = useState<string | null>(null);
	const [audioFile, setAudioFile] = useState<File | null>(null);
	const [audioPlaying, setAudioPlaying] = useState(false);
	const [showPaywall, setShowPaywall] = useState(false);
	const [isPremium, setIsPremium] = useState(false);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		setIsPremium(isPremiumUser());
	}, []);

	useEffect(() => {
		if (state === "running" && timeLeft > 0) {
			intervalRef.current = setInterval(() => {
				setTimeLeft((prev) => {
					if (prev <= 1) {
						setState("completed");
						playTone(selectedRingtone);
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
	}, [state, timeLeft, selectedRingtone]);

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file && file.type.startsWith("audio/")) {
			setAudioFile(file);
			const url = URL.createObjectURL(file);
			setCustomAudio(url);
			if (audioRef.current) {
				audioRef.current.src = url;
				audioRef.current.loop = true;
			}
		}
	};

	const handleRemoveAudio = () => {
		if (customAudio) {
			URL.revokeObjectURL(customAudio);
		}
		setCustomAudio(null);
		setAudioFile(null);
		if (audioRef.current) {
			audioRef.current.src = "";
			audioRef.current.pause();
		}
		setAudioPlaying(false);
	};

	const handleStart = () => {
		setState("running");
		setStartedAt(new Date());
		setTimeLeft(duration * 60);
		if (customAudio && audioRef.current) {
			audioRef.current.play();
			setAudioPlaying(true);
		}
	};

	const handlePause = () => {
		setState("paused");
		if (audioRef.current) {
			audioRef.current.pause();
			setAudioPlaying(false);
		}
	};

	const handleResume = () => {
		setState("running");
		if (customAudio && audioRef.current) {
			audioRef.current.play();
			setAudioPlaying(true);
		}
	};

	const handleReset = () => {
		setState("idle");
		setTimeLeft(duration * 60);
		setStartedAt(null);
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.currentTime = 0;
			setAudioPlaying(false);
		}
	};

	const handleStop = () => {
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.currentTime = 0;
			setAudioPlaying(false);
		}
		if (startedAt && timeLeft < duration * 60) {
			const actualDuration = Math.round(
				(duration * 60 - timeLeft) / 60,
			);
			if (actualDuration > 0) {
				const session: MeditationSession = {
					id: `session-${Date.now()}`,
					date: format(new Date(), "yyyy-MM-dd"),
					duration: actualDuration,
					createdAt: new Date().toISOString(),
				};
				saveSession(session);
			}
		}
		handleReset();
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs
			.toString()
			.padStart(2, "0")}`;
	};

	const progress = duration > 0 ? (timeLeft / (duration * 60)) * 100 : 0;

	useEffect(() => {
		if (audioRef.current && customAudio) {
			audioRef.current.volume = 0.5;
		}
		return () => {
			if (customAudio) {
				URL.revokeObjectURL(customAudio);
			}
		};
	}, [customAudio]);

	return (
		<div className="py-8 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto relative">
			{/* Decorative elements */}
			<div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -z-10" />
			<div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -z-10" />

			<audio ref={audioRef} loop />
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="space-y-8"
			>
				<div className="text-center mb-8">
					<div className="flex items-center justify-center gap-4 mb-2">
						<h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
							Meditation Timer
						</h1>
						<Link href="/sounds">
							<Button
								variant="ghost"
								size="3"
								className="rounded-full border-purple-400/50 hover:bg-purple-500/10"
							>
								<Headphones className="w-4 h-4 mr-2" />
								Sounds
							</Button>
						</Link>
					</div>
					<p className="text-gray-10">Find your center</p>
				</div>

				<div className="bg-gradient-to-br from-purple-600 to-pink-600 border-2 border-purple-400 rounded-2xl p-8 shadow-xl">
					{state === "idle" && (
						<div className="space-y-6">
							<div>
								<label className="block text-sm font-medium text-gray-12 mb-3">
									Duration (minutes)
								</label>
								<input
									type="number"
									min="1"
									max="120"
									value={duration}
									onChange={(e) => {
										const val = Number(e.target.value);
										setDuration(val);
										setTimeLeft(val * 60);
									}}
									className="w-full px-4 py-3 rounded-lg bg-gray-a3 border border-gray-a4 text-gray-12 text-center text-2xl focus:outline-none focus:ring-2 focus:ring-blue-9"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-12 mb-3">
									<Music className="w-4 h-4 inline mr-2" />
									Background Music (Optional)
								</label>
								{!customAudio ? (
									<div className="space-y-3">
										<label className="block">
											<input
												type="file"
												accept="audio/*"
												onChange={handleFileUpload}
												className="hidden"
												id="audio-upload"
											/>
											<motion.div
												whileHover={{ scale: 1.02 }}
												whileTap={{ scale: 0.98 }}
											>
												<Button
													variant="ghost"
													size="3"
													className="w-full border-purple-400/50 hover:bg-purple-500/10"
													onClick={() =>
														document
															.getElementById(
																"audio-upload",
															)
															?.click()
													}
												>
													<Upload className="w-4 h-4 mr-2" />
													Upload MP3/Audio File
												</Button>
											</motion.div>
										</label>
										<div className="text-xs text-gray-10 text-center">
											or select a ringtone for completion
										</div>
									</div>
								) : (
									<div className="flex items-center gap-2 p-3 bg-purple-500/10 border border-purple-400/30 rounded-lg">
										<Music className="w-5 h-5 text-purple-400" />
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium text-gray-12 truncate">
												{audioFile?.name || "Custom Audio"}
											</p>
											<p className="text-xs text-gray-10">
												{audioPlaying ? "Playing..." : "Ready"}
											</p>
										</div>
										<button
											onClick={handleRemoveAudio}
											className="p-1 rounded hover:bg-purple-500/20 transition-colors"
										>
											<X className="w-4 h-4 text-gray-10" />
										</button>
									</div>
								)}
							</div>

							{!customAudio && (
								<div>
									<label className="block text-sm font-medium text-gray-12 mb-3">
										<Volume2 className="w-4 h-4 inline mr-2" />
										Completion Sound
									</label>
									<div className="grid grid-cols-2 gap-2">
										{RINGTONES.map((ringtone, index) => {
											const isLocked = !isPremium && index >= RINGTONES.length - 3;
											return (
												<motion.button
													key={ringtone.value}
													whileHover={{ scale: isLocked ? 1 : 1.02 }}
													whileTap={{ scale: isLocked ? 1 : 0.98 }}
													onClick={() => {
														if (isLocked) {
															setShowPaywall(true);
														} else {
															setSelectedRingtone(ringtone.value);
															playTone(ringtone.value);
														}
													}}
													className={`
														py-3 rounded-lg border transition-all relative
														${
															isLocked
																? "bg-gray-a2 border-gray-a4 opacity-50 cursor-not-allowed"
																: selectedRingtone === ringtone.value
																	? "bg-gray-a4 border-gray-a6"
																	: "bg-gray-a3 border-gray-a4 hover:bg-gray-a4"
														}
													`}
												>
													<span className="text-sm font-medium text-gray-12">
														{ringtone.name}
													</span>
													{isLocked && (
														<span className="absolute top-1 right-1 text-xs">🔒</span>
													)}
												</motion.button>
											);
										})}
									</div>
								</div>
							)}

							<Button
								variant="classic"
								size="4"
								onClick={handleStart}
								className="w-full rounded-2xl h-16 text-lg"
							>
								<Play className="w-5 h-5 mr-2" />
								Start
							</Button>
						</div>
					)}

					{state !== "idle" && (
						<div className="space-y-8">
							<div className="text-center">
								<div className="relative w-64 h-64 mx-auto mb-6">
									<svg className="transform -rotate-90 w-full h-full">
										<defs>
											<linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
												<stop offset="0%" stopColor="#a855f7" />
												<stop offset="50%" stopColor="#ec4899" />
												<stop offset="100%" stopColor="#3b82f6" />
											</linearGradient>
										</defs>
										<circle
											cx="128"
											cy="128"
											r="120"
											fill="none"
											stroke="var(--gray-a4)"
											strokeWidth="8"
										/>
										<motion.circle
											cx="128"
											cy="128"
											r="120"
											fill="none"
											stroke="url(#gradient)"
											strokeWidth="8"
											strokeLinecap="round"
											initial={{ pathLength: 1 }}
											animate={{ pathLength: progress / 100 }}
											transition={{
												duration: 1,
												ease: "linear",
											}}
										/>
									</svg>
									<div className="absolute inset-0 flex items-center justify-center">
										<motion.div
											key={timeLeft}
											initial={{ scale: 1.2 }}
											animate={{ scale: 1 }}
											className="text-5xl font-bold text-gray-12"
										>
											{formatTime(timeLeft)}
										</motion.div>
									</div>
								</div>
							</div>

							{state === "completed" && (
								<motion.div
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									className="text-center"
								>
									<p className="text-2xl font-semibold text-gray-12 mb-4">
										Session Complete! 🎉
									</p>
									{customAudio && audioRef.current && (
										<div className="mt-4">
											<button
												onClick={() => {
													if (audioRef.current) {
														audioRef.current.pause();
														setAudioPlaying(false);
													}
												}}
												className="text-sm text-purple-400 hover:text-purple-300"
											>
												Stop music
											</button>
										</div>
									)}
								</motion.div>
							)}

							<div className="flex gap-4">
								{state === "running" && (
									<Button
										variant="ghost"
										size="4"
										onClick={handlePause}
										className="flex-1 rounded-2xl h-14"
									>
										<Pause className="w-5 h-5 mr-2" />
										Pause
									</Button>
								)}
								{state === "paused" && (
									<Button
										variant="classic"
										size="4"
										onClick={handleResume}
										className="flex-1 rounded-2xl h-14"
									>
										<Play className="w-5 h-5 mr-2" />
										Resume
									</Button>
								)}
								{state === "completed" && (
									<Button
										variant="classic"
										size="4"
										onClick={handleStop}
										className="flex-1 rounded-2xl h-14"
									>
										<Square className="w-5 h-5 mr-2" />
										Save & Reset
									</Button>
								)}
								{(state === "paused" ||
									state === "running") && (
									<Button
										variant="ghost"
										size="4"
										onClick={handleStop}
										className="rounded-2xl h-14"
									>
										<Square className="w-5 h-5" />
									</Button>
								)}
								{(state === "paused" ||
									state === "running") && (
									<Button
										variant="ghost"
										size="4"
										onClick={handleReset}
										className="rounded-2xl h-14"
									>
										<RotateCcw className="w-5 h-5" />
									</Button>
								)}
							</div>
						</div>
					)}
				</div>
			</motion.div>
		</div>
	);
}

