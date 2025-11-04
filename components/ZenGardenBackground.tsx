"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Bird {
	id: number;
	x: number;
	y: number;
	vx: number;
	vy: number;
	size: number;
}

export function ZenGardenBackground() {
	const [birds, setBirds] = useState<Bird[]>([]);
	const [clickedBirds, setClickedBirds] = useState<Set<number>>(new Set());

	useEffect(() => {
		// Create initial birds
		const initialBirds: Bird[] = [];
		for (let i = 0; i < 5; i++) {
			initialBirds.push({
				id: i,
				x: Math.random() * 100,
				y: Math.random() * 100,
				vx: (Math.random() - 0.5) * 0.3,
				vy: (Math.random() - 0.5) * 0.3,
				size: 20 + Math.random() * 15,
			});
		}
		setBirds(initialBirds);

		// Animate birds
		const interval = setInterval(() => {
			setBirds((prevBirds) =>
				prevBirds.map((bird) => ({
					...bird,
					x: (bird.x + bird.vx + 100) % 100,
					y: (bird.y + bird.vy + 100) % 100,
				})),
			);
		}, 100);

		return () => clearInterval(interval);
	}, []);

	const handleBirdClick = (birdId: number) => {
		if (clickedBirds.has(birdId)) return;

		setClickedBirds((prev) => new Set(prev).add(birdId));
		setBirds((prevBirds) =>
			prevBirds.map((bird) =>
				bird.id === birdId
					? {
							...bird,
							vx: (Math.random() - 0.5) * 2,
							vy: (Math.random() - 0.5) * 2,
						}
					: bird,
			),
		);

		setTimeout(() => {
			setClickedBirds((prev) => {
				const newSet = new Set(prev);
				newSet.delete(birdId);
				return newSet;
			});
		}, 2000);
	};

	return (
		<div className="fixed inset-0 -z-0 overflow-hidden">
			{/* Sky gradient */}
			<div className="absolute inset-0 bg-gradient-to-b from-blue-100 via-cyan-50 to-emerald-50" />

			{/* Clouds */}
			<div className="absolute inset-0">
				{[...Array(3)].map((_, i) => (
					<motion.div
						key={`cloud-${i}`}
						className="absolute rounded-full bg-white/30 blur-2xl"
						style={{
							width: `${150 + i * 50}px`,
							height: `${100 + i * 30}px`,
							left: `${20 + i * 30}%`,
							top: `${10 + i * 15}%`,
						}}
						animate={{
							x: [0, 50, 0],
							y: [0, 20, 0],
						}}
						transition={{
							duration: 20 + i * 5,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					/>
				))}
			</div>

			{/* Mountains in background */}
			<svg
				className="absolute bottom-0 w-full h-1/3"
				viewBox="0 0 1200 300"
				preserveAspectRatio="none"
			>
				<defs>
					<linearGradient id="mountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#4a5568" stopOpacity="0.6" />
						<stop offset="100%" stopColor="#2d3748" stopOpacity="0.8" />
					</linearGradient>
				</defs>
				<polygon
					points="0,300 0,200 200,150 400,180 600,120 800,160 1000,100 1200,140 1200,300"
					fill="url(#mountainGrad)"
				/>
			</svg>

			{/* Zen garden sand patterns */}
			<div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-b from-amber-100 to-amber-200/80">
				{/* Raked sand patterns */}
				<svg className="absolute inset-0 w-full h-full opacity-30">
					{[...Array(8)].map((_, i) => (
						<line
							key={`line-${i}`}
							x1={`${(i + 1) * 12.5}%`}
							y1="0%"
							x2={`${(i + 1) * 12.5}%`}
							y2="100%"
							stroke="#d97706"
							strokeWidth="1"
						/>
					))}
					{[...Array(5)].map((_, i) => (
						<line
							key={`hline-${i}`}
							x1="0%"
							y1={`${(i + 1) * 20}%`}
							x2="100%"
							y2={`${(i + 1) * 20}%`}
							stroke="#d97706"
							strokeWidth="1"
						/>
					))}
				</svg>

				{/* Rocks/stones */}
				{[...Array(5)].map((_, i) => (
					<motion.div
						key={`stone-${i}`}
						className="absolute rounded-full bg-stone-600/60 shadow-lg"
						style={{
							width: `${30 + i * 15}px`,
							height: `${20 + i * 10}px`,
							left: `${15 + i * 18}%`,
							bottom: `${10 + (i % 2) * 5}%`,
						}}
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ delay: i * 0.2 }}
					/>
				))}
			</div>

			{/* Interactive birds */}
			{birds.map((bird) => (
				<motion.button
					key={bird.id}
					onClick={() => handleBirdClick(bird.id)}
					className="absolute cursor-pointer focus:outline-none"
					style={{
						left: `${bird.x}%`,
						top: `${bird.y}%`,
						width: `${bird.size}px`,
						height: `${bird.size}px`,
					}}
					whileHover={{ scale: 1.2 }}
					whileTap={{ scale: 0.9 }}
					animate={{
						x: clickedBirds.has(bird.id) ? [0, -100, 100, -50, 50, 0] : 0,
						y: clickedBirds.has(bird.id) ? [0, -50, 50, -25, 25, 0] : 0,
						rotate: clickedBirds.has(bird.id) ? [0, -180, 180, -90, 90, 0] : 0,
					}}
					transition={{
						duration: 1,
						ease: "easeInOut",
					}}
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						className={`w-full h-full ${
							clickedBirds.has(bird.id)
								? "text-orange-500"
								: "text-gray-700 opacity-70"
						}`}
					>
						<path d="M23 18c0 1.1-.9 2-2 2-1.4 0-2.5-1.2-2.5-2.6 0-1.1.9-2 2-2s2 .9 2 2zM16.5 8.8c1.2-.8 2-2.2 2-3.8 0-2.5-2-4.5-4.5-4.5S9 2.5 9 5c0 1.6.8 3 2 3.8" />
						<path d="M9 5c0 2.5-2 4.5-4.5 4.5S0 7.5 0 5s2-4.5 4.5-4.5S9 2.5 9 5z" />
						<path d="M9 5c0 1.6-.8 3-2 3.8" />
						<path d="M16.5 8.8C15.3 9.6 14.5 11 14.5 12.6c0 1.1.4 2.1 1.1 2.9" />
					</svg>
				</motion.button>
			))}

			{/* Sakura petals falling */}
			{[...Array(10)].map((_, i) => (
				<motion.div
					key={`petal-${i}`}
					className="absolute text-pink-300 text-2xl"
					initial={{
						x: `${10 + i * 8}%`,
						y: "-10%",
						rotate: 0,
					}}
					animate={{
						y: "110%",
						x: `${10 + i * 8 + Math.sin(i) * 20}%`,
						rotate: 360,
					}}
					transition={{
						duration: 15 + i * 2,
						repeat: Infinity,
						ease: "linear",
						delay: i * 1.5,
					}}
				>
					🌸
				</motion.div>
			))}

			{/* Overlay for readability */}
			<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 pointer-events-none" />
		</div>
	);
}

