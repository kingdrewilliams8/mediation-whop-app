"use client";

import { motion } from "framer-motion";
import { Play, Pause, Music, Radio } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Sound {
	id: string;
	name: string;
	url?: string; // For actual audio files
	frequency?: number; // For generated tones
	duration?: number;
}

interface SoundCategory {
	id: string;
	name: string;
	color: string;
	icon: any;
	sounds: Sound[];
}

const SOUND_CATEGORIES: SoundCategory[] = [
	{
		id: "jazz",
		name: "Jazz",
		color: "#2dd4bf",
		icon: Music,
		sounds: [
			{ id: "jazz-1", name: "Smooth Jazz Vibes", frequency: 440 },
			{ id: "jazz-2", name: "Late Night Jazz", frequency: 523.25 },
			{ id: "jazz-3", name: "Jazz Lounge", frequency: 659.25 },
			{ id: "jazz-4", name: "Cool Jazz", frequency: 783.99 },
		]
	},
	{
		id: "high-frequency",
		name: "High Frequency",
		color: "#60a5fa",
		icon: Radio,
		sounds: [
			{ id: "hf-1", name: "528Hz - Love Frequency", frequency: 528 },
			{ id: "hf-2", name: "639Hz - Connection", frequency: 639 },
			{ id: "hf-3", name: "741Hz - Expression", frequency: 741 },
			{ id: "hf-4", name: "852Hz - Intuition", frequency: 852 },
			{ id: "hf-5", name: "963Hz - Awakening", frequency: 963 },
		]
	},
	{
		id: "nature",
		name: "Nature",
		color: "#fb923c",
		icon: Music,
		sounds: [
			{ id: "nature-1", name: "Forest Ambiance", frequency: 174 },
			{ id: "nature-2", name: "Ocean Waves", frequency: 285 },
			{ id: "nature-3", name: "Rainfall", frequency: 369.99 },
			{ id: "nature-4", name: "Birds Chirping", frequency: 432 },
		]
	},
	{
		id: "classical",
		name: "Classical Music",
		color: "#a78bfa",
		icon: Music,
		sounds: [
			{ id: "classical-1", name: "Baroque Meditation", frequency: 415.30 },
			{ id: "classical-2", name: "Mozart Serenity", frequency: 523.25 },
			{ id: "classical-3", name: "Beethoven Calm", frequency: 659.25 },
			{ id: "classical-4", name: "Chopin Peace", frequency: 783.99 },
		]
	}
];

function playFrequency(frequency: number, duration: number = 2000) {
	const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
	const oscillator = audioContext.createOscillator();
	const gainNode = audioContext.createGain();

	oscillator.connect(gainNode);
	gainNode.connect(audioContext.destination);

	oscillator.frequency.value = frequency;
	oscillator.type = "sine";
	
	gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
	gainNode.gain.exponentialRampToValueAtTime(
		0.01,
		audioContext.currentTime + duration / 1000,
	);

	oscillator.start(audioContext.currentTime);
	oscillator.stop(audioContext.currentTime + duration / 1000);
}

export default function SoundsPage() {
	const [playingId, setPlayingId] = useState<string | null>(null);
	const [currentCategory, setCurrentCategory] = useState<string>("jazz");
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const audioContextRef = useRef<AudioContext | null>(null);
	const oscillatorRef = useRef<OscillatorNode | null>(null);

	useEffect(() => {
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
			if (oscillatorRef.current) {
				try {
					oscillatorRef.current.stop();
				} catch {}
			}
		};
	}, []);

	const handlePlaySound = (sound: Sound) => {
		if (playingId === sound.id) {
			// Stop current sound
			if (oscillatorRef.current) {
				try {
					oscillatorRef.current.stop();
				} catch {}
			}
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
			setPlayingId(null);
			return;
		}

		// Stop any currently playing sound
		if (oscillatorRef.current) {
			try {
				oscillatorRef.current.stop();
			} catch {}
		}

		if (sound.frequency) {
			const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
			const oscillator = audioContext.createOscillator();
			const gainNode = audioContext.createGain();

			oscillator.connect(gainNode);
			gainNode.connect(audioContext.destination);

			oscillator.frequency.value = sound.frequency;
			oscillator.type = "sine";
			gainNode.gain.value = 0.1; // Lower volume for continuous play

			oscillator.start();
			
			audioContextRef.current = audioContext;
			oscillatorRef.current = oscillator;
			setPlayingId(sound.id);
		}
	};

	const currentCategoryData = SOUND_CATEGORIES.find(cat => cat.id === currentCategory);

	return (
		<div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="space-y-8"
			>
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
						Sounds Library
					</h1>
					<p className="text-gray-400">Immerse yourself in healing frequencies</p>
				</div>

				{/* Category Selection */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
					{SOUND_CATEGORIES.map((category) => {
						const Icon = category.icon;
						return (
							<motion.button
								key={category.id}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => setCurrentCategory(category.id)}
								className={`
									p-4 rounded-2xl transition-all
									${
										currentCategory === category.id
											? "bg-opacity-100 shadow-lg"
											: "bg-opacity-50 hover:bg-opacity-75"
									}
								`}
								style={{
									backgroundColor: `${category.color}40`,
									border: currentCategory === category.id ? `2px solid ${category.color}` : "2px solid transparent"
								}}
							>
								<Icon className="w-6 h-6 mx-auto mb-2" style={{ color: category.color }} />
								<p className="text-sm font-medium text-white">{category.name}</p>
							</motion.button>
						);
					})}
				</div>

				{/* Sounds List */}
				{currentCategoryData && (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{currentCategoryData.sounds.map((sound) => {
							const isPlaying = playingId === sound.id;
							return (
								<motion.div
									key={sound.id}
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									className={`
										rounded-2xl p-6 border-2 transition-all
										${isPlaying ? "border-opacity-100 shadow-lg" : "border-opacity-50 hover:border-opacity-75"}
									`}
									style={{
										backgroundColor: `${currentCategoryData.color}20`,
										borderColor: currentCategoryData.color
									}}
								>
									<div className="flex items-center justify-between">
										<div className="flex-1">
											<h3 className="text-lg font-semibold text-white mb-1">
												{sound.name}
											</h3>
											{sound.frequency && (
												<p className="text-sm text-gray-400">
													{sound.frequency}Hz
												</p>
											)}
										</div>
										<button
											onClick={() => handlePlaySound(sound)}
											className={`
												w-12 h-12 rounded-full flex items-center justify-center transition-all
												${isPlaying ? "bg-red-500 hover:bg-red-600" : `hover:bg-opacity-20`}
											`}
											style={{
												backgroundColor: isPlaying ? undefined : `${currentCategoryData.color}40`
											}}
										>
											{isPlaying ? (
												<Pause className="w-5 h-5 text-white" />
											) : (
												<Play className="w-5 h-5 text-white" />
											)}
										</button>
									</div>
								</motion.div>
							);
						})}
					</div>
				)}
			</motion.div>
		</div>
	);
}

