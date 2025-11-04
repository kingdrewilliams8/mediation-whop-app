"use client";

import { Button } from "@whop/react/components";
import { motion } from "framer-motion";
import { Crown, X } from "lucide-react";
import { useState, useEffect } from "react";

interface PaywallProps {
	onClose?: () => void;
	feature?: string;
}

export function Paywall({ onClose, feature }: PaywallProps) {
	const [isMonthly, setIsMonthly] = useState(true);

	// Prevent background scrolling when paywall is open
	useEffect(() => {
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "unset";
		};
	}, []);

	const handleMonthlyUpgrade = () => {
		// Redirect to Whop checkout for monthly plan
		window.location.href = "https://whop.com/checkout/plan_VGCFDbz66rYcr?d2c=true";
	};

	const handleYearlyUpgrade = () => {
		// Redirect to Whop checkout for yearly plan
		window.location.href = "https://whop.com/checkout/plan_puZZt9t3p75JM?d2c=true";
	};

	return (
		<div className="fixed inset-0 z-50" data-paywall="true">
			{/* Semi-transparent backdrop */}
			<div className="absolute inset-0 bg-black/80"></div>
			
			{/* Modal Container */}
			<div className="absolute inset-0 flex items-center justify-center p-4">
				{/* Modal */}
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.9 }}
					transition={{ type: "spring", damping: 25, stiffness: 200 }}
					className="relative w-full max-w-md bg-gradient-to-b from-sky-900 via-blue-800 to-blue-950 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh]"
					style={{
						boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset"
					}}
				>
					{/* Close Button */}
					{onClose && (
						<button
							onClick={onClose}
							className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm z-50 border-2 border-white/20"
						>
							<X className="w-5 h-5 text-white" />
						</button>
					)}

					{/* Scrollable Content */}
					<div className="overflow-y-auto max-h-[90vh] pb-6">
						{/* Vibrant Sunrise Header */}
						<div className="relative h-48 bg-gradient-to-b from-orange-400 via-yellow-300 to-amber-200 overflow-hidden">
							{/* Sun */}
							<div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-gradient-to-br from-yellow-300 to-orange-500 rounded-full blur-xl opacity-80"></div>
							<div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-br from-yellow-200 to-orange-400 rounded-full shadow-2xl" style={{ boxShadow: "0 0 60px rgba(255, 200, 0, 0.5)" }}></div>
							
							{/* Meditation Character */}
							<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
								<div className="relative">
									<div className="w-20 h-20 bg-gradient-to-br from-orange-300 to-orange-500 rounded-full shadow-lg" style={{ boxShadow: "0 10px 30px rgba(255, 140, 0, 0.4)" }}>
										<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
											<div className="w-3 h-1 bg-white rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
										</div>
									</div>
									<span className="absolute -right-2 top-0 text-2xl">⭐</span>
								</div>
							</div>

							{/* Hills */}
							<div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-sky-900 via-blue-800 to-transparent"></div>
						</div>

						{/* Main Content */}
						<div className="px-6 py-6 space-y-6 bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 pb-32">
							{/* Title */}
							<div className="text-center mt-4">
								<h2 className="text-3xl font-bold text-white mb-2">How your trial works</h2>
								<p className="text-white/90 text-base">
									First {isMonthly ? "3" : "7"} days free, then ${isMonthly ? "15.00" : "100.00"} / {isMonthly ? "month" : "year"}
								</p>
							</div>

							{/* Toggle */}
							<div className="flex justify-center">
								<div className="bg-gray-800 rounded-full p-1 flex gap-1">
									<button
										onClick={() => setIsMonthly(false)}
										className={`px-6 py-2 rounded-full transition-all font-semibold ${
											!isMonthly
												? "bg-white text-gray-900 shadow-lg"
												: "text-white/80"
										}`}
									>
										Annual
									</button>
									<button
										onClick={() => setIsMonthly(true)}
										className={`px-6 py-2 rounded-full transition-all font-semibold ${
											isMonthly
												? "bg-white text-gray-900 shadow-lg"
												: "text-white/80"
										}`}
									>
										Monthly
									</button>
								</div>
							</div>

							{/* Benefits List */}
							<div className="space-y-4 relative">
								{/* Connecting Line */}
								<div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-yellow-400 via-yellow-500 to-yellow-400"></div>

								{[
									{ icon: "✓", title: "Today", description: "Unlock 50+ unique sounds for meditation and relaxation." },
									{ icon: "📱", title: "Today", description: "Access to premium guided meditations." },
									{ icon: "🖼️", title: "Today", description: "Access to premium pictures for your background." },
									{ icon: "⭐", title: `In ${isMonthly ? "3" : "7"} days`, description: "You'll be charged, cancel anytime before." }
								].map((benefit, index) => (
									<motion.div
										key={index}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: index * 0.1 }}
										className="flex items-start gap-4 relative"
									>
										<div className="relative z-10 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg flex-shrink-0" style={{ boxShadow: "0 4px 15px rgba(250, 204, 21, 0.4)" }}>
											<span className="text-2xl">{benefit.icon}</span>
										</div>
										<div className="flex-1 pt-2">
											<p className="text-white font-bold text-base mb-1">{benefit.title}</p>
											<p className="text-white/80 text-sm leading-relaxed">{benefit.description}</p>
										</div>
									</motion.div>
								))}
							</div>

							{/* Pricing Display */}
							<div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-4 border border-yellow-400/30">
								<div className="text-center">
									<div className="flex items-baseline justify-center gap-2 mb-2">
										<span className="text-4xl font-bold text-white">${isMonthly ? "15" : "100"}</span>
										<span className="text-white/80 text-sm">/ {isMonthly ? "month" : "year"}</span>
									</div>
									<p className="text-green-300 font-semibold text-sm">
										{isMonthly ? "3 days free trial" : "7 days free trial"}
									</p>
								</div>
							</div>

							{/* Call to Action Button - Now scrollable */}
							<div className="pt-4 pb-6">
								<Button
									variant="classic"
									size="4"
									onClick={isMonthly ? handleMonthlyUpgrade : handleYearlyUpgrade}
									className="w-full rounded-2xl h-16 text-lg font-bold shadow-2xl mb-4"
									style={{
										background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)",
										boxShadow: "0 10px 40px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(255,255,255,0.1) inset"
									}}
								>
									<Crown className="w-6 h-6 mr-2" />
									Start my free trial
								</Button>

								{/* Restore Purchase Link */}
								<div className="text-center">
									<button className="text-blue-300 hover:text-blue-200 text-sm font-medium underline">
										Restore purchase
									</button>
								</div>
							</div>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
