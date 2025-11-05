import { NextRequest, NextResponse } from "next/server";

// In-memory storage for chat messages (in production, use a database)
const chatStore: Array<{
	id: string;
	author: string;
	authorAvatar?: string;
	message: string;
	timestamp: number;
}> = [];

// Clean up old messages (older than 7 days)
const cleanupOldMessages = () => {
	const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
	const filtered = chatStore.filter(msg => msg.timestamp > sevenDaysAgo);
	chatStore.length = 0;
	chatStore.push(...filtered);
};

// Run cleanup every hour
setInterval(cleanupOldMessages, 60 * 60 * 1000);

export async function GET(request: NextRequest) {
	try {
		// Return all messages sorted by timestamp (oldest first for chat)
		const sortedMessages = [...chatStore].sort((a, b) => a.timestamp - b.timestamp);
		return NextResponse.json({ messages: sortedMessages });
	} catch (error) {
		console.error("Error fetching messages:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { id, author, authorAvatar, message } = body;

		if (!id || !author || !message) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		const newMessage = {
			id,
			author,
			authorAvatar: authorAvatar || undefined,
			message,
			timestamp: Date.now(),
		};

		chatStore.push(newMessage);
		return NextResponse.json({ success: true, message: newMessage });
	} catch (error) {
		console.error("Error creating message:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
