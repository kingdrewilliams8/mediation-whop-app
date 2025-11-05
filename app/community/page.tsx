"use client";

import { Button } from "@whop/react/components";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Share2, Heart, TrendingUp, Send, User, Trash2, Settings, X, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface Post {
	id: string;
	author: string;
	authorAvatar?: string;
	type: "progress" | "tip";
	content: string;
	timestamp: number;
	likes: number;
	likedBy: string[];
	comments: string[];
}

interface ChatMessage {
	id: string;
	author: string;
	authorAvatar?: string;
	message: string;
	timestamp: number;
}

const AVATAR_COLORS = [
	"from-red-400 to-pink-400",
	"from-orange-400 to-red-400",
	"from-yellow-400 to-orange-400",
	"from-green-400 to-teal-400",
	"from-blue-400 to-cyan-400",
	"from-indigo-400 to-blue-400",
	"from-purple-400 to-indigo-400",
	"from-pink-400 to-purple-400",
];

export default function CommunityPage() {
	const [activeTab, setActiveTab] = useState<"feed" | "chat">("feed");
	const [posts, setPosts] = useState<Post[]>([]);
	const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
	const [newPostContent, setNewPostContent] = useState("");
	const [newPostType, setNewPostType] = useState<"progress" | "tip">("progress");
	const [newMessage, setNewMessage] = useState("");
	const [userName, setUserName] = useState("User");
	const [userAvatar, setUserAvatar] = useState(0);
	const [showProfileSettings, setShowProfileSettings] = useState(false);
	const [tempUserName, setTempUserName] = useState("");
	const [tempUserAvatar, setTempUserAvatar] = useState(0);
	const [userId, setUserId] = useState("");
	const chatEndRef = useRef<HTMLDivElement>(null);
	const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

	// Initialize user ID and load profile
	useEffect(() => {
		let storedUserId = localStorage.getItem("community_userId");
		if (!storedUserId) {
			storedUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
			localStorage.setItem("community_userId", storedUserId);
		}
		setUserId(storedUserId);

		const storedName = localStorage.getItem("community_username");
		if (storedName) {
			setUserName(storedName);
			setTempUserName(storedName);
		}

		const storedAvatar = localStorage.getItem("community_avatar");
		if (storedAvatar) {
			setUserAvatar(parseInt(storedAvatar));
			setTempUserAvatar(parseInt(storedAvatar));
		}
	}, []);

	// Load posts from API
	const fetchPosts = async () => {
		try {
			const response = await fetch("/api/community/posts");
			if (response.ok) {
				const data = await response.json();
				setPosts(data.posts || []);
			}
		} catch (error) {
			console.error("Error fetching posts:", error);
		}
	};

	// Load chat messages from API
	const fetchMessages = async () => {
		try {
			const response = await fetch("/api/community/chat");
			if (response.ok) {
				const data = await response.json();
				setChatMessages(data.messages || []);
			}
		} catch (error) {
			console.error("Error fetching messages:", error);
		}
	};

	// Initial load
	useEffect(() => {
		fetchPosts();
		fetchMessages();
	}, []);

	// Poll for new posts and messages
	useEffect(() => {
		pollingIntervalRef.current = setInterval(() => {
			fetchPosts();
			fetchMessages();
		}, 2000); // Poll every 2 seconds

		return () => {
			if (pollingIntervalRef.current) {
				clearInterval(pollingIntervalRef.current);
			}
		};
	}, []);

	// Auto-scroll chat to bottom
	useEffect(() => {
		if (activeTab === "chat" && chatEndRef.current) {
			chatEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [chatMessages, activeTab]);

	const handleSaveProfile = () => {
		if (tempUserName.trim()) {
			setUserName(tempUserName.trim());
			setUserAvatar(tempUserAvatar);
			localStorage.setItem("community_username", tempUserName.trim());
			localStorage.setItem("community_avatar", tempUserAvatar.toString());
			setShowProfileSettings(false);
		}
	};

	const handleShareProgress = async () => {
		if (!newPostContent.trim()) return;

		const postId = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
		const newPost: Post = {
			id: postId,
			author: userName,
			authorAvatar: userAvatar,
			type: newPostType,
			content: newPostContent.trim(),
			timestamp: Date.now(),
			likes: 0,
			likedBy: [],
			comments: [],
		};

		try {
			const response = await fetch("/api/community/posts", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newPost),
			});

			if (response.ok) {
				setNewPostContent("");
				fetchPosts(); // Refresh posts
			}
		} catch (error) {
			console.error("Error creating post:", error);
		}
	};

	const handleDeletePost = async (postId: string, author: string) => {
		if (author !== userName) return;

		try {
			const response = await fetch(
				`/api/community/posts?postId=${postId}&author=${encodeURIComponent(author)}`,
				{ method: "DELETE" }
			);

			if (response.ok) {
				fetchPosts(); // Refresh posts
			}
		} catch (error) {
			console.error("Error deleting post:", error);
		}
	};

	const handleLike = async (post: Post) => {
		const hasLiked = post.likedBy.includes(userId);
		const action = hasLiked ? "unlike" : "like";

		try {
			const response = await fetch("/api/community/posts", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					postId: post.id,
					userId,
					action,
				}),
			});

			if (response.ok) {
				fetchPosts(); // Refresh posts
			}
		} catch (error) {
			console.error("Error liking post:", error);
		}
	};

	const handleSendMessage = async () => {
		if (!newMessage.trim()) return;

		const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
		const newChatMessage: ChatMessage = {
			id: messageId,
			author: userName,
			authorAvatar: userAvatar,
			message: newMessage.trim(),
			timestamp: Date.now(),
		};

		try {
			const response = await fetch("/api/community/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newChatMessage),
			});

			if (response.ok) {
				setNewMessage("");
				fetchMessages(); // Refresh messages
			}
		} catch (error) {
			console.error("Error sending message:", error);
		}
	};

	const formatTimeAgo = (timestamp: number) => {
		const seconds = Math.floor((Date.now() - timestamp) / 1000);
		if (seconds < 60) return "just now";
		const minutes = Math.floor(seconds / 60);
		if (minutes < 60) return `${minutes}m ago`;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours}h ago`;
		const days = Math.floor(hours / 24);
		return `${days}d ago`;
	};

	const getAvatarGradient = (avatarIndex: number) => {
		return AVATAR_COLORS[avatarIndex % AVATAR_COLORS.length];
	};

	return (
		<div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative">
			{/* Decorative elements */}
			<div className="absolute top-0 left-0 w-96 h-96 bg-green-500/20 rounded-full blur-3xl -z-10" />
			<div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -z-10" />

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="space-y-6"
			>
				{/* Header */}
				<div className="text-center mb-8">
					<div className="flex items-center justify-center gap-3 mb-2">
						<h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
							Community
						</h1>
						<Button
							variant="ghost"
							size="2"
							onClick={() => setShowProfileSettings(true)}
							className="rounded-full"
						>
							<Settings className="w-5 h-5" />
						</Button>
					</div>
					<p className="text-gray-700 dark:text-gray-300">
						Connect, share, and grow together on your meditation journey
					</p>
				</div>

				{/* Profile Settings Modal */}
				<AnimatePresence>
					{showProfileSettings && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
							onClick={() => setShowProfileSettings(false)}
						>
							<motion.div
								initial={{ scale: 0.9, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.9, opacity: 0 }}
								onClick={(e) => e.stopPropagation()}
								className="bg-gradient-to-br from-green-600/20 to-blue-600/20 border-2 border-green-400/30 rounded-2xl p-6 max-w-md w-full backdrop-blur-sm"
							>
								<div className="flex items-center justify-between mb-4">
									<h2 className="text-xl font-bold text-gray-900 dark:text-white">
										Profile Settings
									</h2>
									<Button
										variant="ghost"
										size="2"
										onClick={() => setShowProfileSettings(false)}
									>
										<X className="w-4 h-4" />
									</Button>
								</div>

								<div className="space-y-4">
									<div>
										<label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">
											Your Name
										</label>
										<input
											type="text"
											value={tempUserName}
											onChange={(e) => setTempUserName(e.target.value)}
											placeholder="Enter your name"
											className="w-full px-4 py-3 rounded-xl border-2 border-green-400/30 bg-white/5 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/50"
										/>
									</div>

									<div>
										<label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">
											Profile Picture
										</label>
										<div className="grid grid-cols-4 gap-3">
											{AVATAR_COLORS.map((gradient, index) => (
												<button
													key={index}
													onClick={() => setTempUserAvatar(index)}
													className={`w-16 h-16 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center transition-all ${
														tempUserAvatar === index
															? "ring-4 ring-green-400 scale-110"
															: "opacity-60 hover:opacity-80"
													}`}
												>
													{tempUserAvatar === index && (
														<Check className="w-6 h-6 text-white" />
													)}
												</button>
											))}
										</div>
									</div>

									<Button
										onClick={handleSaveProfile}
										variant="classic"
										size="3"
										className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
										disabled={!tempUserName.trim()}
									>
										<Check className="w-4 h-4 mr-2" />
										Save Profile
									</Button>
								</div>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Tabs */}
				<div className="flex gap-2 mb-6 justify-center">
					<Button
						variant={activeTab === "feed" ? "classic" : "ghost"}
						size="3"
						onClick={() => setActiveTab("feed")}
						className={activeTab === "feed" ? "bg-green-500" : ""}
					>
						<Share2 className="w-4 h-4 mr-2" />
						Feed
					</Button>
					<Button
						variant={activeTab === "chat" ? "classic" : "ghost"}
						size="3"
						onClick={() => setActiveTab("chat")}
						className={activeTab === "chat" ? "bg-blue-500" : ""}
					>
						<MessageCircle className="w-4 h-4 mr-2" />
						Chat
					</Button>
				</div>

				{/* Feed Tab */}
				<AnimatePresence mode="wait">
					{activeTab === "feed" && (
						<motion.div
							key="feed"
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 20 }}
							className="space-y-6"
						>
							{/* Create Post */}
							<div className="bg-gradient-to-br from-green-600/20 to-blue-600/20 border-2 border-green-400/30 rounded-2xl p-6">
								<div className="flex gap-2 mb-4">
									<Button
										variant={newPostType === "progress" ? "classic" : "ghost"}
										size="2"
										onClick={() => setNewPostType("progress")}
										className={newPostType === "progress" ? "bg-green-500" : ""}
									>
										<TrendingUp className="w-4 h-4 mr-1" />
										Progress
									</Button>
									<Button
										variant={newPostType === "tip" ? "classic" : "ghost"}
										size="2"
										onClick={() => setNewPostType("tip")}
										className={newPostType === "tip" ? "bg-blue-500" : ""}
									>
										<Share2 className="w-4 h-4 mr-1" />
										Tip
									</Button>
								</div>
								<textarea
									value={newPostContent}
									onChange={(e) => setNewPostContent(e.target.value)}
									placeholder={
										newPostType === "progress"
											? "Share your meditation progress or achievement..."
											: "Share a meditation tip or insight..."
									}
									rows={3}
									className="w-full px-4 py-3 rounded-xl border-2 border-green-400/30 bg-white/5 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/50 resize-none mb-4"
								/>
								<Button
									onClick={handleShareProgress}
									variant="classic"
									size="3"
									className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
									disabled={!newPostContent.trim()}
								>
									<Share2 className="w-4 h-4 mr-2" />
									Share
								</Button>
							</div>

							{/* Posts Feed */}
							<div className="space-y-4">
								{posts.map((post) => {
									const hasLiked = post.likedBy.includes(userId);
									const isOwnPost = post.author === userName;
									return (
										<motion.div
											key={post.id}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 backdrop-blur-sm"
										>
											<div className="flex items-start gap-4 mb-3">
												<div
													className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarGradient(
														post.authorAvatar ?? 0
													)} flex items-center justify-center flex-shrink-0`}
												>
													<User className="w-5 h-5 text-white" />
												</div>
												<div className="flex-1">
													<div className="flex items-center gap-2 mb-1">
														<span className="font-semibold text-gray-900 dark:text-white">
															{post.author}
														</span>
														<span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
															{post.type === "progress" ? (
																<>
																	<TrendingUp className="w-3 h-3 inline mr-1" />
																	Progress
																</>
															) : (
																<>
																	<Share2 className="w-3 h-3 inline mr-1" />
																	Tip
																</>
															)}
														</span>
														<span className="text-xs text-gray-500 dark:text-gray-400">
															{formatTimeAgo(post.timestamp)}
														</span>
														{isOwnPost && (
															<button
																onClick={() => handleDeletePost(post.id, post.author)}
																className="ml-auto text-red-400 hover:text-red-300 transition-colors"
															>
																<Trash2 className="w-4 h-4" />
															</button>
														)}
													</div>
													<p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
														{post.content}
													</p>
												</div>
											</div>
											<div className="flex items-center gap-4 pt-3 border-t border-white/10">
												<button
													onClick={() => handleLike(post)}
													className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
														hasLiked
															? "bg-red-500/20 text-red-400"
															: "bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-white/10"
													}`}
												>
													<Heart
														className={`w-4 h-4 ${hasLiked ? "fill-current" : ""}`}
													/>
													<span className="text-sm">{post.likes}</span>
												</button>
												<div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
													<MessageCircle className="w-4 h-4" />
													<span>{post.comments.length}</span>
												</div>
											</div>
										</motion.div>
									);
								})}

								{posts.length === 0 && (
									<div className="text-center py-12 text-gray-500 dark:text-gray-400">
										<Share2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
										<p>No posts yet. Be the first to share!</p>
									</div>
								)}
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Chat Tab */}
				<AnimatePresence mode="wait">
					{activeTab === "chat" && (
						<motion.div
							key="chat"
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 20 }}
							className="flex flex-col h-[600px] bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-blue-400/30 rounded-2xl overflow-hidden"
						>
							{/* Chat Header */}
							<div className="p-4 border-b border-white/10 bg-black/20">
								<h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
									<MessageCircle className="w-5 h-5" />
									Community Chat
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Connect with fellow meditators
								</p>
							</div>

							{/* Messages */}
							<div className="flex-1 overflow-y-auto p-4 space-y-4">
								{chatMessages.length === 0 ? (
									<div className="text-center py-12 text-gray-500 dark:text-gray-400">
										<MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
										<p>No messages yet. Start the conversation!</p>
									</div>
								) : (
									chatMessages.map((msg) => {
										const isOwnMessage = msg.author === userName;
										return (
											<div
												key={msg.id}
												className={`flex gap-3 ${isOwnMessage ? "flex-row-reverse" : ""}`}
											>
												<div
													className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarGradient(
														msg.authorAvatar ?? 0
													)} flex items-center justify-center flex-shrink-0`}
												>
													<User className="w-4 h-4 text-white" />
												</div>
												<div
													className={`max-w-[70%] ${
														isOwnMessage ? "items-end" : "items-start"
													} flex flex-col`}
												>
													<span className="text-xs text-gray-500 dark:text-gray-400 mb-1">
														{msg.author}
													</span>
													<div
														className={`rounded-2xl px-4 py-2 ${
															isOwnMessage
																? "bg-blue-500 text-white"
																: "bg-white/10 text-gray-900 dark:text-gray-100"
														}`}
													>
														<p className="text-sm whitespace-pre-wrap">{msg.message}</p>
													</div>
													<span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
														{formatTimeAgo(msg.timestamp)}
													</span>
												</div>
											</div>
										);
									})
								)}
								<div ref={chatEndRef} />
							</div>

							{/* Message Input */}
							<div className="p-4 border-t border-white/10 bg-black/20">
								<div className="flex gap-2">
									<input
										type="text"
										value={newMessage}
										onChange={(e) => setNewMessage(e.target.value)}
										onKeyPress={(e) => {
											if (e.key === "Enter" && !e.shiftKey) {
												e.preventDefault();
												handleSendMessage();
											}
										}}
										placeholder="Type a message..."
										className="flex-1 px-4 py-2 rounded-xl border-2 border-blue-400/30 bg-white/5 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50"
									/>
									<Button
										onClick={handleSendMessage}
										variant="classic"
										size="3"
										className="bg-blue-500 hover:bg-blue-600"
										disabled={!newMessage.trim()}
									>
										<Send className="w-4 h-4" />
									</Button>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>
		</div>
	);
}
