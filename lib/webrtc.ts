// WebRTC configuration
export const RTC_CONFIG: RTCConfiguration = {
	iceServers: [
		{ urls: "stun:stun.l.google.com:19302" },
		{ urls: "stun:stun1.l.google.com:19302" },
		// Add more STUN/TURN servers for better connectivity
		// For production, you'll need TURN servers (e.g., from Twilio, Metered, or self-hosted)
	],
};

// Generate unique user ID
export function generateUserId(): string {
	return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Create a peer connection
export function createPeerConnection(
	onIceCandidate: (candidate: RTCIceCandidate) => void,
	onTrack: (event: RTCTrackEvent) => void,
	onConnectionStateChange?: (state: RTCPeerConnectionState) => void
): RTCPeerConnection {
	const pc = new RTCPeerConnection(RTC_CONFIG);

	pc.onicecandidate = (event) => {
		if (event.candidate) {
			onIceCandidate(event.candidate);
		}
	};

	pc.ontrack = onTrack;

	if (onConnectionStateChange) {
		pc.onconnectionstatechange = () => {
			onConnectionStateChange(pc.connectionState);
		};
	}

	return pc;
}

// Send signaling message to API
export async function sendSignalingMessage(
	sessionId: string,
	type: 'offer' | 'answer' | 'ice-candidate' | 'join' | 'leave' | 'timer-start' | 'timer-pause' | 'timer-resume' | 'timer-reset' | 'create-session',
	from: string,
	to: string | undefined,
	data: any
): Promise<void> {
	try {
		await fetch("/api/signaling", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				sessionId,
				type,
				from,
				to,
				data,
			}),
		});
	} catch (error) {
		console.error("Failed to send signaling message:", error);
	}
}

// Poll for new signaling messages
export async function pollSignalingMessages(
	sessionId: string,
	userId: string,
	lastTimestamp: number,
	onMessage: (message: {
		type: 'offer' | 'answer' | 'ice-candidate' | 'join' | 'leave' | 'timer-start' | 'timer-pause' | 'timer-resume' | 'timer-reset' | 'create-session';
		from: string;
		to?: string;
		data: any;
		timestamp: number;
	}) => void
): Promise<number> {
	try {
		const response = await fetch(
			`/api/signaling?sessionId=${sessionId}&userId=${userId}&lastTimestamp=${lastTimestamp}`
		);
		const result = await response.json();
		
		if (result.messages && result.messages.length > 0) {
			result.messages.forEach((msg: any) => onMessage(msg));
			// Return the latest timestamp
			return Math.max(...result.messages.map((m: any) => m.timestamp));
		}
		
		return lastTimestamp;
	} catch (error) {
		console.error("Failed to poll signaling messages:", error);
		return lastTimestamp;
	}
}
