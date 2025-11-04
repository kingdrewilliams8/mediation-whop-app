"use client";

import { Image, Upload, X, Lock } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { isPremiumUser } from "@/lib/premium";
import { Paywall } from "@/components/Paywall";

const BACKGROUND_OPTIONS = [
	{
		name: "Original (Black/White)",
		url: "",
		gradient: "",
		isOriginal: true,
		isPremium: false,
	},
	{
		name: "Default",
		url: "",
		gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
		isPremium: false,
	},
	{
		name: "Sunset",
		url: "",
		gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
		isPremium: false,
	},
	{
		name: "Ocean",
		url: "",
		gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
		isPremium: false,
	},
	{
		name: "Forest",
		url: "",
		gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
		isPremium: false,
	},
	{
		name: "Buddha",
		url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
		gradient: "",
		isPremium: false,
	},
	{
		name: "Zen Garden",
		url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80",
		gradient: "",
		isPremium: false,
	},
	{
		name: "Mountains",
		url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
		gradient: "",
		isPremium: false,
	},
	{
		name: "Lotus Pond",
		url: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=800&q=80",
		gradient: "",
		isPremium: true,
	},
	{
		name: "Desert Sunset",
		url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80",
		gradient: "",
		isPremium: true,
	},
	{
		name: "Waterfall",
		url: "https://images.unsplash.com/photo-1519102925082-0cf370b67e6b?w=800&q=80",
		gradient: "",
		isPremium: true,
	},
	{
		name: "Forest Path",
		url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
		gradient: "",
		isPremium: true,
	},
	{
		name: "Mountain Lake",
		url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80",
		gradient: "",
		isPremium: true,
	},
];

export function BackgroundSelector() {
	const [selectedBg, setSelectedBg] = useState<string>("");
	const [isOpen, setIsOpen] = useState(false);
	const [customImage, setCustomImage] = useState<string | null>(null);
	const [isPremium, setIsPremium] = useState(false);
	const [showPaywall, setShowPaywall] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setIsPremium(isPremiumUser());
	}, []);

	const applyBackground = (bgId: string) => {
		const body = document.body;
		
		if (bgId === "Custom Upload") {
			const savedCustom = localStorage.getItem("meditation_custom_background");
			if (savedCustom) {
				body.style.backgroundImage = `url(${savedCustom})`;
				body.style.backgroundSize = "cover";
				body.style.backgroundPosition = "center";
				body.style.backgroundRepeat = "no-repeat";
				body.style.backgroundAttachment = "fixed";
				return;
			}
		}
		
		const bgOption = BACKGROUND_OPTIONS.find((bg) => bg.name === bgId);
		if (!bgOption) return;

		if (bgOption.isOriginal) {
			// Reset to original black/white background
			body.style.backgroundImage = "";
			body.style.background = "";
			body.style.backgroundColor = "";
		} else if (bgOption.url) {
			body.style.backgroundImage = `url(${bgOption.url})`;
			body.style.backgroundSize = "cover";
			body.style.backgroundPosition = "center";
			body.style.backgroundRepeat = "no-repeat";
			body.style.backgroundAttachment = "fixed";
		} else if (bgOption.gradient) {
			body.style.backgroundImage = bgOption.gradient;
			body.style.backgroundSize = "cover";
			body.style.backgroundPosition = "center";
		}
		if (bgId !== "Custom Upload") {
			localStorage.setItem("meditation_background", bgId);
		}
	};

	useEffect(() => {
		const savedCustom = localStorage.getItem("meditation_custom_background");
		if (savedCustom) {
			setCustomImage(savedCustom);
			setSelectedBg("Custom Upload");
			applyBackground("Custom Upload");
		} else {
			const saved = localStorage.getItem("meditation_background");
			if (saved) {
				setSelectedBg(saved);
				applyBackground(saved);
			}
		}
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && isOpen) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	const handleSelect = (bgName: string, isPremiumBg: boolean) => {
		if (isPremiumBg && !isPremium) {
			setShowPaywall(true);
			return;
		}
		setSelectedBg(bgName);
		applyBackground(bgName);
		setIsOpen(false);
	};

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file && file.type.startsWith("image/")) {
			const reader = new FileReader();
			reader.onloadend = () => {
				const result = reader.result as string;
				setCustomImage(result);
				localStorage.setItem("meditation_custom_background", result);
				setSelectedBg("Custom Upload");
				applyBackground("Custom Upload");
			};
			reader.readAsDataURL(file);
		}
	};

	const handleRemoveCustom = () => {
		setCustomImage(null);
		localStorage.removeItem("meditation_custom_background");
		setSelectedBg("");
		applyBackground("Original (Black/White)");
	};

	return (
		<div className="relative" ref={dropdownRef}>
			{showPaywall && (
				<Paywall 
					onClose={() => setShowPaywall(false)}
					feature="Premium backgrounds"
				/>
			)}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="w-full p-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
				aria-label="Change background"
			>
				<Image className="w-5 h-5" />
				<span>Choose Background</span>
				{isOpen ? "↑" : "↓"}
			</button>

			{isOpen && (
				<div className="absolute top-full mt-4 w-full bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-lg border-2 border-indigo-400/40 rounded-2xl p-4 shadow-xl z-50 max-h-[60vh] overflow-y-auto pb-20">
					{/* Upload Custom Image */}
					<div className="mb-4">
						<label className="block mb-2">
							<input
								type="file"
								accept="image/*"
								onChange={handleFileUpload}
								className="hidden"
								id="background-upload"
							/>
							<div className="flex items-center gap-3 p-3 rounded-lg border-2 border-dashed border-indigo-400/50 hover:border-indigo-400 cursor-pointer transition-colors">
								<Upload className="w-5 h-5 text-indigo-400" />
								<span className="text-white text-sm">Upload Custom Background</span>
							</div>
						</label>
						{customImage && (
							<div className="relative mt-2">
								<img
									src={customImage}
									alt="Custom background"
									className="w-full h-24 object-cover rounded-lg border-2 border-indigo-400"
								/>
								<button
									onClick={handleRemoveCustom}
									className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
								>
									<X className="w-4 h-4 text-white" />
								</button>
								{selectedBg === "Custom Upload" && (
									<div className="absolute top-2 left-2 w-5 h-5 bg-indigo-400 rounded-full flex items-center justify-center">
										<span className="text-white text-xs">✓</span>
									</div>
								)}
							</div>
						)}
					</div>
					<div className="grid grid-cols-2 gap-3">
						{BACKGROUND_OPTIONS.map((bg) => {
							const isLocked = bg.isPremium && !isPremium;
							return (
								<button
									key={bg.name}
									onClick={() => handleSelect(bg.name, bg.isPremium || false)}
									className={`
										relative h-24 rounded-lg overflow-hidden border-2 transition-all
										${
											selectedBg === bg.name
												? "border-indigo-400 ring-2 ring-indigo-400/50 scale-105"
												: "border-gray-600 hover:border-indigo-400/50"
										}
										${isLocked ? "opacity-60" : ""}
									`}
								>
									{bg.isOriginal ? (
										<div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
											<span className="text-white text-xs font-medium">Original</span>
										</div>
									) : bg.url ? (
										<img
											src={bg.url}
											alt={bg.name}
											className="w-full h-full object-cover"
										/>
									) : (
										<div
											style={{
												background: bg.gradient,
											}}
											className="w-full h-full"
										/>
									)}
									<div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs font-medium p-2 text-center">
										{bg.name}
									</div>
									{isLocked && (
										<div className="absolute top-2 left-2">
											<Lock className="w-4 h-4 text-yellow-400" />
										</div>
									)}
									{selectedBg === bg.name && (
										<div className="absolute top-2 right-2 w-5 h-5 bg-indigo-400 rounded-full flex items-center justify-center">
											<span className="text-white text-xs">✓</span>
										</div>
									)}
								</button>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}

