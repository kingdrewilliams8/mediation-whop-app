"use client";

const PREMIUM_STORAGE_KEY = "meditation_premium";

export interface PremiumFeatures {
	isPremium: boolean;
	upgradedAt?: string;
	cancelledAt?: string;
}

export function getPremiumStatus(): PremiumFeatures {
	if (typeof window === "undefined") return { isPremium: false };
	
	try {
		const data = localStorage.getItem(PREMIUM_STORAGE_KEY);
		return data ? JSON.parse(data) : { isPremium: false };
	} catch {
		return { isPremium: false };
	}
}

export function setPremiumStatus(isPremium: boolean): void {
	if (typeof window === "undefined") return;
	
	const premium: PremiumFeatures = {
		isPremium,
		upgradedAt: isPremium ? new Date().toISOString() : undefined,
		cancelledAt: !isPremium ? new Date().toISOString() : undefined,
	};
	localStorage.setItem(PREMIUM_STORAGE_KEY, JSON.stringify(premium));
}

export function cancelPremium(): void {
	setPremiumStatus(false);
}

export function isPremiumUser(): boolean {
	return getPremiumStatus().isPremium;
}

export function getPremiumInfo(): PremiumFeatures {
	return getPremiumStatus();
}

