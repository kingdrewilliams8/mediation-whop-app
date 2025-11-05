"use client";

import { Button } from "@whop/react/components";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Share2, Heart, Send, User, Trash2, Settings, X, Check, Upload, TrendingUp } from "lucide-react";
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

export default function CommunityPage() {
	const [activeTab, setActiveTab] = useState<"feed" | "chat">("feed");
	const [posts, setPosts] = useState<Post[]>([]);
	const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
	const [newPostContent, setNewPostContent] = useState("");
	const [newMessage, setNewMessage] = useState("");
	const [userName, setUserName] = useState("User");
	const [userAvatar, setUserAvatar] = useState<string | null>(null);
	const [showProfileSettings, setShowProfileSettings] = useState(false);
	const [tempUserName, setTempUserName] = useState("");
	const [tempUserAvatar, setTempUserAvatar] = useState<string | null>(null);
	const [userId, setUserId] = useState("");
	const chatEndRef = useRef<HTMLDivElement>(null);
	const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

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
			setUserAvatar(storedAvatar);
			setTempUserAvatar(storedAvatar);
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

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file && file.type.startsWith("image/")) {
			const reader = new FileReader();
			reader.onloadend = () => {
				const imageUrl = reader.result as string;
				setTempUserAvatar(imageUrl);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleRemoveAvatar = () => {
		setTempUserAvatar(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleSaveProfile = () => {
		if (tempUserName.trim()) {
			setUserName(tempUserName.trim());
			setUserAvatar(tempUserAvatar);
			localStorage.setItem("community_username", tempUserName.trim());
			if (tempUserAvatar) {
				localStorage.setItem("community_avatar", tempUserAvatar);
			} else {
				localStorage.removeItem("community_avatar");
			}
			setShowProfileSettings(false);
		}
	};

	const handleShareProgress = async () => {
		if (!newPostContent.trim()) return;

		const postId = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
		const newPost: Post = {
			id: postId,
			author: userName,
			authorAvatar: userAvatar || undefined,
			type: "progress",
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
			authorAvatar: userAvatar || undefined,
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

	const getAvatarDisplay = (avatar: string | null | undefined) => {
		if (avatar) {
			return (
				<img
					src={avatar}
					alt="Profile"
					className="w-full h-full rounded-full object-cover"
				/>
			);
		}
		return (
			<div className="w-full h-full rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center">
				<User className="w-full h-full text-white p-2" />
			</div>
		);
	};

	return (
		<div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative">
			{/* Decorative elements */}
			<div className="absolute top-0 left-0 w-96 h-96 bg-green-500/20 rounded-full blur-3xl -z-10" />
			<div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -z-10" />

			{/* Profile Button - Top Left */}
			<button
				onClick={() => setShowProfileSettings(true)}
				className="fixed top-4 left-4 z-40 flex items-center gap-3 bg-gradient-to-br from-green-600/20 to-blue-600/20 border-2 border-green-400/30 rounded-full px-4 py-3 backdrop-blur-sm hover:border-green-400/50 transition-all shadow-lg"
			>
				<div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-400/50 flex-shrink-0">
					{getAvatarDisplay(userAvatar)}
				</div>
				<div className="text-left hidden sm:block">
					<div className="text-sm font-semibold text-gray-900 dark:text-white">
						{userName || "Set Profile"}
					</div>
					<div className="text-xs text-gray-600 dark:text-gray-400">
						Tap to edit
					</div>
				</div>
				<Settings className="w-5 h-5 text-green-400 flex-shrink-0" />
			</button>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="space-y-6"
			>
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
						Community
					</h1>
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
										<div className="space-y-3">
											{tempUserAvatar ? (
												<div className="relative">
													<div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-green-400/50">
														<img
															src={tempUserAvatar}
															alt="Profile"
															className="w-full h-full object-cover"
														/>
													</div>
													<button
														onClick={handleRemoveAvatar}
														className="absolute top-0 right-1/2 transform translate-x-16 p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
													>
														<X className="w-4 h-4 text-white" />
													</button>
												</div>
											) : (
												<div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center border-4 border-green-400/50">
													<User className="w-16 h-16 text-white" />
												</div>
											)}
											<label className="block">
												<input
													ref={fileInputRef}
													type="file"
													accept="image/*"
													onChange={handleFileUpload}
													className="hidden"
													id="avatar-upload"
												/>
												<div
													onClick={() => fileInputRef.current?.click()}
													className="flex items-center justify-center gap-3 p-3 rounded-lg border-2 border-dashed border-green-400/50 hover:border-green-400 cursor-pointer transition-colors"
												>
													<Upload className="w-5 h-5 text-green-400" />
													<span className="text-gray-900 dark:text-white text-sm">
														{tempUserAvatar ? "Change Picture" : "Upload Picture"}
													</span>
												</div>
											</label>
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
								<textarea
									value={newPostContent}
									onChange={(e) => setNewPostContent(e.target.value)}
									placeholder="Share your meditation progress, tips, or achievements..."
									rows={4}
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
												<div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-green-400/30">
													{getAvatarDisplay(post.authorAvatar)}
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
												<div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border-2 border-blue-400/30">
													{getAvatarDisplay(msg.authorAvatar)}
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
