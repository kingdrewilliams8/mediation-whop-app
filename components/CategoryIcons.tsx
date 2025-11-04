"use client";

export function MeditationIcon({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
		>
			{/* Stacked ovals/stones */}
			<ellipse cx="12" cy="14" rx="8" ry="3" />
			<ellipse cx="12" cy="10" rx="7" ry="2.5" />
			<ellipse cx="12" cy="6" rx="6" ry="2" />
		</svg>
	);
}

export function BreathworkIcon({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
		>
			{/* Leaf shape */}
			<path d="M12 2C8 6 4 8 4 12c0 4 4 6 8 8 4-2 8-4 8-8 0-4-4-6-8-10z" />
			<path d="M12 6v12M8 10h8" strokeWidth="1.5" />
		</svg>
	);
}

