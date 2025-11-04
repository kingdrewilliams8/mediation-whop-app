"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { getDailyQuote } from "@/lib/quotes";

export function DailyQuote() {
	const quote = getDailyQuote();

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.6 }}
			className="bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 border-2 border-purple-400 rounded-2xl p-6"
		>
			<div className="flex items-start gap-3">
				<Quote className="w-6 h-6 text-white flex-shrink-0 mt-1" />
				<div className="flex-1">
					<p className="text-lg text-white font-medium italic mb-3 leading-relaxed">
						"{quote.text}"
					</p>
					<p className="text-sm text-white/80 text-right">
						— {quote.author}
					</p>
				</div>
			</div>
		</motion.div>
	);
}

