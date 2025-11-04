"use client";

const MEDITATION_QUOTES = [
	{
		text: "Meditation is not about stopping thoughts, but recognizing that we are more than our thoughts and our feelings.",
		author: "Arianna Huffington",
	},
	{
		text: "The present moment is the only time over which we have dominion.",
		author: "Thích Nhất Hạnh",
	},
	{
		text: "You should sit in meditation for 20 minutes every day — unless you're too busy. Then you should sit for an hour.",
		author: "Zen Proverb",
	},
	{
		text: "Peace comes from within. Do not seek it without.",
		author: "Buddha",
	},
	{
		text: "Meditation is the art of being present, not perfect.",
		author: "Unknown",
	},
	{
		text: "The mind is everything. What you think you become.",
		author: "Buddha",
	},
	{
		text: "Be here now. Be someplace else later. Is that so complicated?",
		author: "David Bader",
	},
	{
		text: "Meditation is not about becoming a different person, but understanding who you already are.",
		author: "Unknown",
	},
	{
		text: "In the midst of movement and chaos, keep stillness inside of you.",
		author: "Deepak Chopra",
	},
	{
		text: "The best meditation is the one that you actually do.",
		author: "Unknown",
	},
	{
		text: "Quiet the mind, and the soul will speak.",
		author: "Ma Jaya Sati Bhagavati",
	},
	{
		text: "Meditation is a way for nourishing and blossoming the divinity within you.",
		author: "Amit Ray",
	},
	{
		text: "Sit in silence for a moment. Notice what happens when you're not filling every moment with distraction.",
		author: "Unknown",
	},
	{
		text: "Wherever you are, be there totally.",
		author: "Eckhart Tolle",
	},
	{
		text: "Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it.",
		author: "Rumi",
	},
	{
		text: "The breath is the bridge between life and consciousness.",
		author: "Thích Nhất Hạnh",
	},
	{
		text: "Calm mind brings inner strength and self-confidence.",
		author: "Dalai Lama",
	},
	{
		text: "Meditation is the only intentional, systematic human activity which at bottom is about not trying to improve yourself or get anywhere else.",
		author: "Jon Kabat-Zinn",
	},
	{
		text: "Let go or be dragged.",
		author: "Zen Proverb",
	},
	{
		text: "Mindfulness is about being fully awake in our lives.",
		author: "Jon Kabat-Zinn",
	},
	{
		text: "The mind is like water. When calm, it reflects the beauty of the world. When agitated, it reflects nothing.",
		author: "Buddhist Proverb",
	},
	{
		text: "When you realize nothing is lacking, the whole world belongs to you.",
		author: "Lao Tzu",
	},
	{
		text: "Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.",
		author: "Thích Nhất Hạnh",
	},
	{
		text: "The only way out is in.",
		author: "Rumi",
	},
	{
		text: "Your calm mind is the ultimate weapon against your challenges.",
		author: "Bryant McGill",
	},
	{
		text: "Meditation is listening to the silence.",
		author: "Unknown",
	},
	{
		text: "The quieter you become, the more you can hear.",
		author: "Ram Dass",
	},
	{
		text: "To the mind that is still, the whole universe surrenders.",
		author: "Lao Tzu",
	},
	{
		text: "Meditation is not a means to an end. It is both the means and the end.",
		author: "Jiddu Krishnamurti",
	},
	{
		text: "Be patient with yourself. Nothing in nature blooms all year.",
		author: "Unknown",
	},
];

export function getDailyQuote() {
	const today = new Date();
	const dayOfYear = Math.floor(
		(today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
			(1000 * 60 * 60 * 24),
	);
	const index = dayOfYear % MEDITATION_QUOTES.length;
	return MEDITATION_QUOTES[index];
}

