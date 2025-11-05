import { NextRequest, NextResponse } from "next/server";

// In-memory storage for posts (in production, use a database)
const postsStore: Array<{
	id: string;
	author: string;
	authorAvatar?: string;
	type: "progress" | "tip";
	content: string;
	timestamp: number;
	likes: number;
	likedBy: string[];
	comments: any[];
}> = [];

// Clean up old posts (older than 30 days)
const cleanupOldPosts = () => {
	const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
	const filtered = postsStore.filter(post => post.timestamp > thirtyDaysAgo);
	postsStore.length = 0;
	postsStore.push(...filtered);
};

// Run cleanup every hour
setInterval(cleanupOldPosts, 60 * 60 * 1000);

export async function GET(request: NextRequest) {
	try {
		// Return all posts sorted by timestamp (newest first)
		const sortedPosts = [...postsStore].sort((a, b) => b.timestamp - a.timestamp);
		return NextResponse.json({ posts: sortedPosts });
	} catch (error) {
		console.error("Error fetching posts:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { id, author, authorAvatar, type, content } = body;

		if (!id || !author || !type || !content) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		const newPost = {
			id,
			author,
			authorAvatar: authorAvatar || undefined,
			type,
			content,
			timestamp: Date.now(),
			likes: 0,
			likedBy: [] as string[],
			comments: [],
		};

		postsStore.push(newPost);
		return NextResponse.json({ success: true, post: newPost });
	} catch (error) {
		console.error("Error creating post:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const postId = searchParams.get("postId");
		const author = searchParams.get("author");

		if (!postId || !author) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		const postIndex = postsStore.findIndex(
			(post) => post.id === postId && post.author === author
		);

		if (postIndex === -1) {
			return NextResponse.json(
				{ error: "Post not found or unauthorized" },
				{ status: 404 }
			);
		}

		postsStore.splice(postIndex, 1);
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error deleting post:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function PATCH(request: NextRequest) {
	try {
		const body = await request.json();
		const { postId, userId, action } = body; // action: "like" | "unlike"

		if (!postId || !userId || !action) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		const post = postsStore.find((p) => p.id === postId);
		if (!post) {
			return NextResponse.json(
				{ error: "Post not found" },
				{ status: 404 }
			);
		}

		if (action === "like") {
			if (!post.likedBy.includes(userId)) {
				post.likedBy.push(userId);
				post.likes += 1;
			}
		} else if (action === "unlike") {
			const index = post.likedBy.indexOf(userId);
			if (index > -1) {
				post.likedBy.splice(index, 1);
				post.likes -= 1;
			}
		}

		return NextResponse.json({ success: true, post });
	} catch (error) {
		console.error("Error updating post:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
