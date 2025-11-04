"use client";

import { Button } from "@whop/react/components";
import { motion } from "framer-motion";
import { Settings, Image, RotateCcw, AlertTriangle, Crown, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BackgroundSelector } from "@/components/BackgroundSelector";
import { clearAllSessions } from "@/lib/storage";
import { isPremiumUser, getPremiumInfo, cancelPremium } from "@/lib/premium";
import { Paywall } from "@/components/Paywall";

export default function SettingsPage() {
	const router = useRouter();
	const [showConfirm, setShowConfirm] = useState(false);
	const [isPremium, setIsPremium] = useState(false);
	const [showPaywall, setShowPaywall] = useState(false);
	const [showCancelConfirm, setShowCancelConfirm] = useState(false);
	const [premiumInfo, setPremiumInfo] = useState<any>(null);

	useEffect(() => {
		setIsPremium(isPremiumUser());
		setPremiumInfo(getPremiumInfo());
	}, []);

	const handleCancelSubscription = () => {
		cancelPremium();
		setIsPremium(false);
		setShowCancelConfirm(false);
		window.location.reload();
	};

	const handleReset = () => {
		clearAllSessions();
		setShowConfirm(false);
		// Reload to update all stats across the app
		window.location.href = "/";
	};
	return (
		<div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative">
			{showPaywall && (
				<Paywall 
					onClose={() => setShowPaywall(false)}
					feature="Premium subscription"
				/>
			)}
			{/* Decorative elements */}
			<div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -z-10" />
			<div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -z-10" />

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="space-y-8"
			>
				<div className="text-center mb-8">
					<div className="flex items-center justify-center gap-3 mb-4">
						<Settings className="w-8 h-8 text-indigo-400" />
						<h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
							Settings
						</h1>
					</div>
					<p className="text-gray-10">
						Customize your meditation experience
					</p>
				</div>

				{/* Subscription Section */}
				<div className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 border-2 border-purple-400 rounded-2xl p-8 shadow-xl">
					<div className="flex items-center gap-3 mb-6">
						<Crown className="w-6 h-6 text-yellow-400" />
						<h2 className="text-2xl font-semibold text-white">
							Subscription
						</h2>
					</div>
					{isPremium ? (
						<div className="space-y-4">
							<div className="bg-white/10 rounded-lg p-4 border-2 border-white/30">
								<div className="flex items-center justify-between mb-2">
									<div>
										<p className="text-white font-semibold">Premium Active</p>
										{premiumInfo?.upgradedAt && (
											<p className="text-white/80 text-sm">
												Upgraded: {new Date(premiumInfo.upgradedAt).toLocaleDateString()}
											</p>
										)}
									</div>
									<div className="bg-green-500/30 px-3 py-1 rounded-full">
										<span className="text-green-300 text-sm font-medium">Active</span>
									</div>
								</div>
							</div>
							<Button
								variant="ghost"
								size="4"
								onClick={() => setShowCancelConfirm(true)}
								className="w-full rounded-xl h-14 text-lg border-2 border-white/50 hover:bg-white/10 text-white"
							>
								<X className="w-5 h-5 mr-2" />
								Cancel Subscription
							</Button>
							{showCancelConfirm && (
								<div className="bg-white/10 rounded-lg p-4 border-2 border-white/30 mt-4">
									<p className="text-white font-medium mb-2">
										Cancel Subscription?
									</p>
									<p className="text-white/80 text-sm mb-4">
										You'll lose access to premium features. This can be undone by upgrading again.
									</p>
									<div className="flex gap-3">
										<Button
											variant="classic"
											size="3"
											onClick={handleCancelSubscription}
											className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 text-white"
										>
											Yes, Cancel
										</Button>
										<Button
											variant="ghost"
											size="3"
											onClick={() => setShowCancelConfirm(false)}
											className="flex-1 rounded-xl border-2 border-white/50 hover:bg-white/10 text-white"
										>
											Keep Subscription
										</Button>
									</div>
								</div>
							)}
						</div>
					) : (
						<div className="space-y-4">
							<p className="text-white/90 mb-6 text-sm">
								Upgrade to Premium to unlock all features including advanced courses, premium ringtones, and more.
							</p>
							<Button
								variant="classic"
								size="4"
								onClick={() => setShowPaywall(true)}
								className="w-full rounded-xl h-14 text-lg font-bold shadow-lg"
								style={{
									background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)",
									color: "#1c1917",
									boxShadow: "0 8px 20px rgba(251, 191, 36, 0.4)"
								}}
							>
								<Crown className="w-5 h-5 mr-2" />
								Upgrade to Premium
							</Button>
							<div className="grid grid-cols-2 gap-2 mt-4">
								<div className="bg-white/10 rounded-lg p-3 text-center">
									<p className="text-2xl font-bold text-white">$9.99</p>
									<p className="text-white/80 text-xs">per month</p>
								</div>
								<div className="bg-white/10 rounded-lg p-3 text-center">
									<p className="text-2xl font-bold text-white">$99</p>
									<p className="text-white/80 text-xs">per year (save 17%)</p>
								</div>
							</div>
						</div>
					)}
				</div>

				<div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 border-2 border-indigo-400 rounded-2xl p-8 shadow-xl">
					<div className="flex items-center gap-3 mb-6">
						<Image className="w-6 h-6 text-white" />
						<h2 className="text-2xl font-semibold text-white">
							Background Theme
						</h2>
					</div>
					<p className="text-white/90 mb-6 text-sm">
						Choose your preferred background to enhance your
						meditation experience
					</p>
					<div className="flex justify-center">
						<BackgroundSelector />
					</div>
				</div>

				<div className="bg-gradient-to-br from-red-600 via-orange-600 to-amber-600 border-2 border-red-400 rounded-2xl p-8 shadow-xl">
					<div className="flex items-center gap-3 mb-6">
						<RotateCcw className="w-6 h-6 text-white" />
						<h2 className="text-2xl font-semibold text-white">
							Reset Data
						</h2>
					</div>
					<p className="text-gray-12 mb-6 text-sm">
						Permanently delete all meditation sessions, streaks, and
						time data. This action cannot be undone.
					</p>
					{!showConfirm ? (
						<Button
							variant="ghost"
							size="4"
							onClick={() => setShowConfirm(true)}
							className="w-full rounded-xl h-14 text-lg border-2 border-white/50 hover:bg-white/10 text-gray-12"
						>
							<AlertTriangle className="w-5 h-5 mr-2" />
							Reset All Data
						</Button>
					) : (
						<div className="space-y-4">
							<div className="bg-white/10 rounded-lg p-4 border-2 border-white/30">
								<p className="text-gray-12 font-medium mb-2">
									Are you sure?
								</p>
								<p className="text-gray-12 text-sm">
									This will delete all your meditation history
									permanently.
								</p>
							</div>
							<div className="flex gap-3">
								<Button
									variant="classic"
									size="4"
									onClick={handleReset}
									className="flex-1 rounded-xl h-14 text-lg bg-white text-red-600 hover:bg-red-50"
								>
									Yes, Reset All
								</Button>
								<Button
									variant="ghost"
									size="4"
									onClick={() => setShowConfirm(false)}
									className="flex-1 rounded-xl h-14 text-lg border-2 border-white/50 hover:bg-white/10 text-gray-12"
								>
									Cancel
								</Button>
							</div>
						</div>
					)}
				</div>
			</motion.div>
		</div>
	);
}

