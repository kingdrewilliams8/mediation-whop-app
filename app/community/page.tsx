"use client";

import { Button } from "@whop/react/components";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Share2, Heart, TrendingUp, Send, User, Clock } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { getAllSessions } from "@/lib/storage";

interface Post {
	id: string;
	author: string;
	type: "progress" | "tip";
	content: string;
	timestamp: number;
	likes: number;
	comments: string[];
	userLiked?: boolean;
}

interface ChatMessage {
	id: string;
	author: string;
	message: string;
	timestamp: number;
}

export default function CommunityPage() {
	const [activeTab, setActiveTab] = useState<"feed" | "chat">("feed");
	const [posts, setPosts] = useState<Post[]>([]);
	const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
	const [newPostContent, setNewPostContent] = useState("");
	const [newPostType, setNewPostType] = useState<"progress" | "tip">("progress");
	const [newMessage, setNewMessage] = useState("");
	const [userName, setUserName] = useState("User");
	const chatEndRef = useRef<HTMLDivElement>(null);

	// Load user name from localStorage or generate
	useEffect(() => {
		const storedName = localStorage.getItem("community_username");
		if (storedName) {
			setUserName(storedName);
		} else {
			const defaultName = `User${Math.floor(Math.random() * 1000)}`;
			setUserName(defaultName);
			localStorage.setItem("community_username", defaultName);
		}
	}, []);

	// Load posts from localStorage
	useEffect(() => {
		const storedPosts = localStorage.getItem("community_posts");
		if (storedPosts) {
			setPosts(JSON.parse(storedPosts));
		} else {
			// Add some sample posts
			const samplePosts: Post[] = [
				{
					id: "1",
					author: "MeditationGuide",
					type: "tip",
					content: "Start your day with 5 minutes of mindful breathing. It sets a positive tone for everything! 🌅",
					timestamp: Date.now() - 3600000,
					likes: 12,
					comments: [],
				},
				{
					id: "2",
					author: "ZenMaster",
					type: "progress",
					content: "Just completed my 30-day meditation streak! The transformation has been incredible. Keep going everyone! 🎉",
					timestamp: Date.now() - 7200000,
					likes: 24,
					comments: [],
				},
			];
			setPosts(samplePosts);
			localStorage.setItem("community_posts", JSON.stringify(samplePosts));
		}
	}, []);

	// Load chat messages from localStorage
	useEffect(() => {
		const storedMessages = localStorage.getItem("community_chat");
		if (storedMessages) {
			setChatMessages(JSON.parse(storedMessages));
		}
	}, []);

	// Auto-scroll chat to bottom
	useEffect(() => {
		if (activeTab === "chat" && chatEndRef.current) {
			chatEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [chatMessages, activeTab]);

	// Save posts to localStorage whenever they change
	useEffect(() => {
		if (posts.length > 0) {
			localStorage.setItem("community_posts", JSON.stringify(posts));
		}
	}, [posts]);

	// Save chat messages to localStorage whenever they change
	useEffect(() => {
		if (chatMessages.length > 0) {
			localStorage.setItem("community_chat", JSON.stringify(chatMessages));
		}
	}, [chatMessages]);

	const handleShareProgress = () => {
		if (!newPostContent.trim()) return;

		const sessions = getAllSessions();
		const todaySessions = sessions.filter((s) => s.date === format(new Date(), "yyyy-MM-dd"));
		const totalMinutes = todaySessions.reduce((sum, s) => sum + s.duration, 0);

		const content = newPostType === "progress" 
			? `Today I meditated for ${totalMinutes} minutes! ${newPostContent}`
			: newPostContent;

		const newPost: Post = {
			id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
			author: userName,
			type: newPostType,
			content,
			timestamp: Date.now(),
			likes: 0,
			comments: [],
		};

		setPosts([newPost, ...posts]);
		setNewPostContent("");
	};

	const handleLike = (postId: string) => {
		setPosts(
			posts.map((post) => {
				if (post.id === postId) {
					const userLiked = post.userLiked;
					return {
						...post,
						likes: userLiked ? post.likes - 1 : post.likes + 1,
						userLiked: !userLiked,
					};
				}
				return post;
			})
		);
	};

	const handleSendMessage = () => {
		if (!newMessage.trim()) return;

		const newChatMessage: ChatMessage = {
			id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
			author: userName,
			message: newMessage,
			timestamp: Date.now(),
		};

		setChatMessages([...chatMessages, newChatMessage]);
		setNewMessage("");
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
					<h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
						Community
					</h1>
					<p className="text-gray-700 dark:text-gray-300">
						Connect, share, and grow together on your meditation journey
					</p>
				</div>

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
								{posts.map((post) => (
									<motion.div
										key={post.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 backdrop-blur-sm"
									>
										<div className="flex items-start gap-4 mb-3">
											<div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center flex-shrink-0">
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
												</div>
												<p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
													{post.content}
												</p>
											</div>
										</div>
										<div className="flex items-center gap-4 pt-3 border-t border-white/10">
											<button
												onClick={() => handleLike(post.id)}
												className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
													post.userLiked
														? "bg-red-500/20 text-red-400"
														: "bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-white/10"
												}`}
											>
												<Heart
													className={`w-4 h-4 ${post.userLiked ? "fill-current" : ""}`}
												/>
												<span className="text-sm">{post.likes}</span>
											</button>
											<div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
												<MessageCircle className="w-4 h-4" />
												<span>{post.comments.length}</span>
											</div>
										</div>
									</motion.div>
								))}

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
									chatMessages.map((msg) => (
										<div
											key={msg.id}
											className={`flex gap-3 ${
												msg.author === userName ? "flex-row-reverse" : ""
											}`}
										>
											<div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center flex-shrink-0">
												<User className="w-4 h-4 text-white" />
											</div>
											<div
												className={`max-w-[70%] ${
													msg.author === userName ? "items-end" : "items-start"
												} flex flex-col`}
											>
												<span className="text-xs text-gray-500 dark:text-gray-400 mb-1">
													{msg.author}
												</span>
												<div
													className={`rounded-2xl px-4 py-2 ${
														msg.author === userName
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
									))
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
