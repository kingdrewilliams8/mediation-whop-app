import { NextRequest, NextResponse } from "next/server";

// In-memory storage for signaling messages (in production, use Redis or a database)
const signalingStore: Map<string, Array<{
	type: 'offer' | 'answer' | 'ice-candidate' | 'join' | 'leave' | 'timer-start' | 'timer-pause' | 'timer-resume' | 'timer-reset';
	from: string;
	to?: string;
	data: any;
	timestamp: number;
}>> = new Map();

// In-memory storage for session metadata
const sessionStore: Map<string, {
	id: string;
	name: string;
	description: string;
	duration: number;
	hostId: string;
	createdAt: string;
	participants: string[];
}> = new Map();

// Clean up old messages (older than 30 seconds)
const cleanupOldMessages = () => {
	const now = Date.now();
	signalingStore.forEach((messages, sessionId) => {
		const filtered = messages.filter(msg => now - msg.timestamp < 30000);
		if (filtered.length === 0) {
			signalingStore.delete(sessionId);
		} else {
			signalingStore.set(sessionId, filtered);
		}
	});
};

// Run cleanup every 10 seconds
setInterval(cleanupOldMessages, 10000);

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { sessionId, type, from, to, data } = body;

		if (!sessionId || !type || !from) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		// Handle session creation/update (sessionData is inside data object when host joins or creates session)
		if (type === 'join' && data?.isHost && data?.sessionData) {
			sessionStore.set(sessionId, {
				id: data.sessionData.id || sessionId,
				name: data.sessionData.name,
				description: data.sessionData.description || "",
				duration: data.sessionData.duration || 10,
				hostId: data.sessionData.hostId || from,
				createdAt: data.sessionData.createdAt || new Date().toISOString(),
				participants: [from],
			});
		}
		
		// Handle direct session creation (for immediate availability)
		if (type === 'create-session' && data?.sessionData) {
			sessionStore.set(sessionId, {
				id: data.sessionData.id || sessionId,
				name: data.sessionData.name,
				description: data.sessionData.description || "",
				duration: data.sessionData.duration || 10,
				hostId: data.sessionData.hostId || from,
				createdAt: data.sessionData.createdAt || new Date().toISOString(),
				participants: [],
			});
		}

		// Initialize session if it doesn't exist
		if (!signalingStore.has(sessionId)) {
			signalingStore.set(sessionId, []);
		}

		const message = {
			type: type as 'offer' | 'answer' | 'ice-candidate' | 'join' | 'leave' | 'timer-start' | 'timer-pause' | 'timer-resume' | 'timer-reset' | 'create-session',
			from,
			to: to || undefined,
			data,
			timestamp: Date.now(),
		};

		// Add message to store
		const messages = signalingStore.get(sessionId) || [];
		messages.push(message);
		signalingStore.set(sessionId, messages);

		return NextResponse.json({ success: true, message });
	} catch (error) {
		console.error("Signaling API error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const sessionId = searchParams.get("sessionId");
		const userId = searchParams.get("userId");
		const lastTimestamp = searchParams.get("lastTimestamp");
		const checkSession = searchParams.get("checkSession");

		// Check if session exists (for joining from another device)
		if (checkSession === "true" && sessionId) {
			const session = sessionStore.get(sessionId);
			if (!session) {
				return NextResponse.json(
					{ error: "Session not found" },
					{ status: 404 }
				);
			}
			return NextResponse.json({ session, exists: true });
		}

		if (!sessionId || !userId) {
			return NextResponse.json(
				{ error: "Missing sessionId or userId" },
				{ status: 400 }
			);
		}

		const messages = signalingStore.get(sessionId) || [];
		
		// Filter messages:
		// 1. Not from this user
		// 2. Either to this user or broadcast (no 'to' field)
		// 3. Newer than lastTimestamp if provided
		const filtered = messages.filter(msg => {
			if (msg.from === userId) return false;
			if (msg.to && msg.to !== userId) return false;
			if (lastTimestamp && msg.timestamp <= parseInt(lastTimestamp)) return false;
			return true;
		});

		return NextResponse.json({ messages: filtered });
	} catch (error) {
		console.error("Signaling API error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
