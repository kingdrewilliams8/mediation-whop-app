"use client";

import { Button } from "@whop/react/components";
import { motion } from "framer-motion";
import {
	Video,
	VideoOff,
	Mic,
	MicOff,
	Users,
	Play,
	Pause,
	Square,
	RotateCcw,
	Copy,
	LogOut,
	Clock,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { playTone } from "@/lib/audio";
import {
	generateUserId,
	createPeerConnection,
	sendSignalingMessage,
	pollSignalingMessages,
} from "@/lib/webrtc";

type TimerState = "idle" | "running" | "paused" | "completed";

interface Participant {
	id: string;
	name: string;
	isHost: boolean;
	isVideoEnabled: boolean;
	isAudioEnabled: boolean;
	pc?: RTCPeerConnection;
}

export default function LiveSessionPage() {
	const params = useParams();
	const router = useRouter();
	const sessionId = params.sessionId as string;

	// Session state
	const [sessionData, setSessionData] = useState<any>(null);
	const [isHost, setIsHost] = useState(false);
	const [participants, setParticipants] = useState<Participant[]>([]);
	const userIdRef = useRef<string>("");
	
	// Video/Audio state
	const [isVideoEnabled, setIsVideoEnabled] = useState(true);
	const [isAudioEnabled, setIsAudioEnabled] = useState(true);
	const localVideoRef = useRef<HTMLVideoElement>(null);
	const localStreamRef = useRef<MediaStream | null>(null);
	const remoteVideoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
	const remoteStreamsRef = useRef<Map<string, MediaStream>>(new Map()); // Store remote streams
	const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
	
	// Signaling state
	const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const lastTimestampRef = useRef<number>(0);
	const isInitializedRef = useRef<boolean>(false);

	// Timer state
	const [timerState, setTimerState] = useState<TimerState>("idle");
	const [timeLeft, setTimeLeft] = useState(10 * 60);
	const [duration, setDuration] = useState(10);
	const [selectedRingtone, setSelectedRingtone] = useState("bell");
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	// Countdown state
	const [countdown, setCountdown] = useState<number | null>(null);
	const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

	// UI state
	const [copied, setCopied] = useState(false);

	// Initialize session
	useEffect(() => {
		const initializeSession = async () => {
			const hostSession = localStorage.getItem("current_host_session");
			const isHost = hostSession === sessionId;
			
			// Generate unique user ID
			userIdRef.current = generateUserId();
			
			// Get participant name (for non-hosts)
			let participantName = "Participant";
			if (!isHost) {
				const storedName = localStorage.getItem(`participant_name_${sessionId}`);
				if (storedName) {
					participantName = storedName;
				}
			}
			
			// Try to load session data from localStorage first
			const stored = localStorage.getItem(`live_session_${sessionId}`);
			let sessionData = stored ? JSON.parse(stored) : null;
			
			// If not found in localStorage, try to fetch from API (for cross-device)
			if (!sessionData) {
				try {
					const response = await fetch(`/api/signaling?sessionId=${sessionId}&checkSession=true`);
					if (response.ok) {
						const result = await response.json();
						if (result.session) {
							sessionData = result.session;
						}
					}
				} catch (error) {
					console.error("Error fetching session data:", error);
				}
			}
			
			if (sessionData) {
				setSessionData(sessionData);
				setDuration(sessionData.duration || 10);
				setTimeLeft((sessionData.duration || 10) * 60);
				setIsHost(isHost);
				
				// Initialize self as participant
				const self: Participant = {
					id: userIdRef.current,
					name: isHost ? "Host (You)" : participantName,
					isHost: isHost,
					isVideoEnabled: true,
					isAudioEnabled: true,
				};
				setParticipants([self]);
				
				// Send join message with session data for host
				if (isHost) {
					await sendSignalingMessage(sessionId, "join", userIdRef.current, undefined, {
						name: "Host",
						isHost: true,
						sessionData: sessionData,
					});
				} else {
					await sendSignalingMessage(sessionId, "join", userIdRef.current, undefined, {
						name: participantName,
						isHost: false,
					});
				}
			} else {
				// Session not found, redirect to join page
				router.push("/live/join");
			}
		};
		
		initializeSession();
	}, [sessionId, router]);

	// Initialize media and WebRTC
	useEffect(() => {
		if (!sessionId || !userIdRef.current || isInitializedRef.current) return;
		
		const initialize = async () => {
			try {
				// Get user media
				const stream = await navigator.mediaDevices.getUserMedia({
					video: isVideoEnabled,
					audio: isAudioEnabled,
				});
				
				localStreamRef.current = stream;
				if (localVideoRef.current) {
					localVideoRef.current.srcObject = stream;
				}
				
				isInitializedRef.current = true;
				
				// Start polling for signaling messages
				startSignalingPoll();
			} catch (error) {
				console.error("Error accessing media devices:", error);
				alert("Could not access camera/microphone. Please check permissions.");
			}
		};
		
		initialize();
		
		return () => {
			// Cleanup
			if (localStreamRef.current) {
				localStreamRef.current.getTracks().forEach(track => track.stop());
			}
			// Close all peer connections
			peerConnectionsRef.current.forEach((pc) => {
				pc.close();
			});
			peerConnectionsRef.current.clear();
			// Stop polling
			if (pollingIntervalRef.current) {
				clearInterval(pollingIntervalRef.current);
			}
			// Send leave message
			if (userIdRef.current) {
				sendSignalingMessage(sessionId, "leave", userIdRef.current, undefined, {});
			}
		};
	}, [sessionId, isVideoEnabled, isAudioEnabled]);

	// Start polling for signaling messages
	const startSignalingPoll = () => {
		if (pollingIntervalRef.current) {
			clearInterval(pollingIntervalRef.current);
		}
		
		pollingIntervalRef.current = setInterval(async () => {
			const newTimestamp = await pollSignalingMessages(
				sessionId,
				userIdRef.current,
				lastTimestampRef.current,
				handleSignalingMessage
			);
			lastTimestampRef.current = newTimestamp;
		}, 1000); // Poll every second
	};

	// Handle incoming signaling messages
	const handleSignalingMessage = async (message: {
		type: 'offer' | 'answer' | 'ice-candidate' | 'join' | 'leave' | 'timer-start' | 'timer-pause' | 'timer-resume' | 'timer-reset' | 'create-session';
		from: string;
		to?: string;
		data: any;
		timestamp: number;
	}) => {
		if (message.from === userIdRef.current) return;
		
		switch (message.type) {
			case 'join':
				// New participant joined
				await handleParticipantJoin(message.from, message.data);
				break;
			case 'leave':
				// Participant left
				handleParticipantLeave(message.from);
				break;
			case 'offer':
				// Received offer, create answer
				await handleOffer(message.from, message.data);
				break;
			case 'answer':
				// Received answer
				await handleAnswer(message.from, message.data);
				break;
			case 'ice-candidate':
				// Received ICE candidate
				await handleIceCandidate(message.from, message.data);
				break;
			case 'timer-start':
				// Host started timer - start countdown for all participants
				if (message.data.withCountdown) {
					setCountdown(3);
					playTone("bell"); // Play sound for countdown start
				} else {
					setTimerState("running");
					setTimeLeft(message.data.duration || duration * 60);
				}
				break;
			case 'timer-pause':
				// Host paused timer
				setTimerState("paused");
				break;
			case 'timer-resume':
				// Host resumed timer
				setTimerState("running");
				break;
			case 'timer-reset':
				// Host reset timer
				setTimerState("idle");
				setTimeLeft(message.data.duration || duration * 60);
				break;
			case 'create-session':
				// Session creation message - no action needed (already handled by API)
				break;
		}
	};

	// Handle new participant joining
	const handleParticipantJoin = async (participantId: string, data: any) => {
		// Add participant to list with their name
		setParticipants((prev) => {
			if (prev.find((p) => p.id === participantId)) return prev;
			return [
				...prev,
				{
					id: participantId,
					name: data.name || `Participant ${participantId.slice(-6)}`,
					isHost: data.isHost || false,
					isVideoEnabled: true,
					isAudioEnabled: true,
				},
			];
		});

		// Create peer connection
		const pc = createPeerConnection(
			(candidate) => {
				// Send ICE candidate
				sendSignalingMessage(
					sessionId,
					"ice-candidate",
					userIdRef.current,
					participantId,
					candidate.toJSON()
				);
			},
			(event) => {
				// Handle remote track - store stream and attach to video element
				if (event.streams && event.streams[0]) {
					const stream = event.streams[0];
					remoteStreamsRef.current.set(participantId, stream);
					
					// Try to attach immediately if video element exists
					const videoElement = remoteVideoRefs.current.get(participantId);
					if (videoElement) {
						videoElement.srcObject = stream;
					}
				}
			},
			(state) => {
				console.log(`Connection state with ${participantId}:`, state);
			}
		);

		// Add local stream tracks to peer connection
		if (localStreamRef.current) {
			localStreamRef.current.getTracks().forEach((track) => {
				if (localStreamRef.current) {
					pc.addTrack(track, localStreamRef.current);
				}
			});
		}

		peerConnectionsRef.current.set(participantId, pc);

		// Create and send offer
		try {
			const offer = await pc.createOffer();
			await pc.setLocalDescription(offer);
							await sendSignalingMessage(
					sessionId,
					"offer",
					userIdRef.current,
					participantId,
					offer
				);
		} catch (error) {
			console.error("Error creating offer:", error);
		}
	};

	// Handle participant leaving
	const handleParticipantLeave = (participantId: string) => {
		// Remove peer connection
		const pc = peerConnectionsRef.current.get(participantId);
		if (pc) {
			pc.close();
			peerConnectionsRef.current.delete(participantId);
		}
		
		// Remove video element and stream
		const videoElement = remoteVideoRefs.current.get(participantId);
		if (videoElement) {
			videoElement.srcObject = null;
			remoteVideoRefs.current.delete(participantId);
		}
		
		// Remove stored stream
		remoteStreamsRef.current.delete(participantId);
		
		// Remove from participants list
		setParticipants((prev) => prev.filter((p) => p.id !== participantId));
	};

	// Handle offer
	const handleOffer = async (from: string, offer: RTCSessionDescriptionInit) => {
		let pc = peerConnectionsRef.current.get(from);
		
		if (!pc) {
			// Create new peer connection
			pc = createPeerConnection(
				(candidate) => {
					sendSignalingMessage(
						sessionId,
						"ice-candidate",
						userIdRef.current,
						from,
						candidate.toJSON()
					);
				},
				(event) => {
					// Handle remote track - store stream and attach to video element
					if (event.streams && event.streams[0]) {
						const stream = event.streams[0];
						remoteStreamsRef.current.set(from, stream);
						
						// Try to attach immediately if video element exists
						const videoElement = remoteVideoRefs.current.get(from);
						if (videoElement) {
							videoElement.srcObject = stream;
						}
					}
				}
			);

			// Add local stream tracks
			if (localStreamRef.current && pc) {
				localStreamRef.current.getTracks().forEach((track) => {
					if (localStreamRef.current && pc) {
						pc.addTrack(track, localStreamRef.current);
					}
				});
			}

			peerConnectionsRef.current.set(from, pc);
		}

		// Ensure pc is defined before using it
		if (!pc) {
			console.error("Failed to create peer connection");
			return;
		}

		try {
			await pc.setRemoteDescription(new RTCSessionDescription(offer));
			const answer = await pc.createAnswer();
			await pc.setLocalDescription(answer);
			await sendSignalingMessage(
				sessionId,
				"answer",
				userIdRef.current,
				from,
				answer
			);
		} catch (error) {
			console.error("Error handling offer:", error);
		}
	};

	// Handle answer
	const handleAnswer = async (from: string, answer: RTCSessionDescriptionInit) => {
		const pc = peerConnectionsRef.current.get(from);
		if (pc) {
			try {
				await pc.setRemoteDescription(new RTCSessionDescription(answer));
			} catch (error) {
				console.error("Error handling answer:", error);
			}
		}
	};

	// Handle ICE candidate
	const handleIceCandidate = async (from: string, candidate: RTCIceCandidateInit) => {
		const pc = peerConnectionsRef.current.get(from);
		if (pc) {
			try {
				await pc.addIceCandidate(new RTCIceCandidate(candidate));
			} catch (error) {
				console.error("Error adding ICE candidate:", error);
			}
		}
	};

	// Toggle video
	const handleToggleVideo = async () => {
		if (localStreamRef.current) {
			const videoTrack = localStreamRef.current.getVideoTracks()[0];
			if (videoTrack) {
				videoTrack.enabled = !isVideoEnabled;
				setIsVideoEnabled(!isVideoEnabled);
			}
		}
	};

	// Toggle audio
	const handleToggleAudio = async () => {
		if (localStreamRef.current) {
			const audioTrack = localStreamRef.current.getAudioTracks()[0];
			if (audioTrack) {
				audioTrack.enabled = !isAudioEnabled;
				setIsAudioEnabled(!isAudioEnabled);
			}
		}
	};

	// Timer controls
	const handleStartTimer = () => {
		if (!isHost) return;
		setTimerState("running");
		setTimeLeft(duration * 60);
		// Broadcast timer start to all participants
		sendSignalingMessage(sessionId, "timer-start", userIdRef.current, undefined, {
			duration: duration * 60,
			withCountdown: false, // Already counted down
		});
	};

	const handlePauseTimer = () => {
		if (!isHost) return;
		setTimerState("paused");
		// Broadcast timer pause to all participants
		sendSignalingMessage(sessionId, "timer-pause", userIdRef.current, undefined, {});
	};

	const handleResumeTimer = () => {
		if (!isHost) return;
		setTimerState("running");
		// Broadcast timer resume to all participants
		sendSignalingMessage(sessionId, "timer-resume", userIdRef.current, undefined, {});
	};

	const handleResetTimer = () => {
		if (!isHost) return;
		setTimerState("idle");
		setTimeLeft(duration * 60);
		// Broadcast timer reset to all participants
		sendSignalingMessage(sessionId, "timer-reset", userIdRef.current, undefined, {
			duration: duration * 60,
		});
	};

	const handleStopTimer = () => {
		if (!isHost) return;
		setTimerState("idle");
		setTimeLeft(duration * 60);
		// Broadcast timer reset to all participants
		sendSignalingMessage(sessionId, "timer-reset", userIdRef.current, undefined, {
			duration: duration * 60,
		});
	};

	// Start timer with countdown (host only)
	const handleStartTimerWithCountdown = () => {
		if (!isHost) return;
		// Start countdown for host
		setCountdown(3);
		playTone("bell");
		// Broadcast countdown start to all participants
		sendSignalingMessage(sessionId, "timer-start", userIdRef.current, undefined, {
			duration: duration * 60,
			withCountdown: true,
		});
	};

	// Timer logic
	useEffect(() => {
		if (timerState === "running" && timeLeft > 0) {
			intervalRef.current = setInterval(() => {
				setTimeLeft((prev) => {
					if (prev <= 1) {
						setTimerState("completed");
						playTone(selectedRingtone);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		} else {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [timerState, timeLeft, selectedRingtone]);

	// Countdown logic
	useEffect(() => {
		// Clear any existing interval
		if (countdownIntervalRef.current) {
			clearInterval(countdownIntervalRef.current);
			countdownIntervalRef.current = null;
		}

		if (countdown !== null && countdown > 0) {
			// Play sound for the current countdown number
			if (countdown <= 3) {
				playTone("bell");
			}

			// Start countdown interval
			countdownIntervalRef.current = setInterval(() => {
				setCountdown((prev) => {
					if (prev === null || prev <= 1) {
						return 0; // Set to 0 to trigger completion
					}
					return prev - 1;
				});
			}, 1000);
		} else if (countdown === 0) {
			// Countdown finished - start timer
			setCountdown(null);
			if (isHost) {
				// Host starts the actual timer
				setTimerState("running");
				setTimeLeft(duration * 60);
				// Broadcast actual timer start (without countdown)
				sendSignalingMessage(sessionId, "timer-start", userIdRef.current, undefined, {
					duration: duration * 60,
					withCountdown: false,
				});
			}
		}

		return () => {
			if (countdownIntervalRef.current) {
				clearInterval(countdownIntervalRef.current);
				countdownIntervalRef.current = null;
			}
		};
	}, [countdown, isHost, duration, sessionId]);

	// Copy session ID
	const handleCopySessionId = () => {
		navigator.clipboard.writeText(sessionId);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	// Leave session
	const handleLeaveSession = () => {
		if (localStreamRef.current) {
			localStreamRef.current.getTracks().forEach(track => track.stop());
		}
		peerConnectionsRef.current.forEach((pc) => pc.close());
		if (pollingIntervalRef.current) {
			clearInterval(pollingIntervalRef.current);
		}
		localStorage.removeItem("current_host_session");
		localStorage.removeItem("current_participant_session");
		sendSignalingMessage(sessionId, "leave", userIdRef.current, undefined, {});
		router.push("/");
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	const progress = duration > 0 ? (timeLeft / (duration * 60)) * 100 : 0;

	// Set ref for remote video elements and attach stored streams
	const setRemoteVideoRef = (participantId: string, element: HTMLVideoElement | null) => {
		if (element) {
			remoteVideoRefs.current.set(participantId, element);
			// If we already have a stream for this participant, attach it
			const stream = remoteStreamsRef.current.get(participantId);
			if (stream) {
				element.srcObject = stream;
			}
		} else {
			remoteVideoRefs.current.delete(participantId);
		}
	};

	if (!sessionData) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-white">Loading session...</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
			{/* Header */}
			<div className="absolute top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-sm border-b border-white/10 p-4">
				<div className="max-w-7xl mx-auto flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div>
							<h1 className="text-xl font-bold text-white">{sessionData.name}</h1>
							<p className="text-sm text-white/70">{sessionData.description || "Live meditation session"}</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						{isHost && (
							<Button
								variant="ghost"
								size="2"
								onClick={handleCopySessionId}
								className="text-white"
							>
								<Copy className="w-4 h-4 mr-2" />
								{copied ? "Copied!" : "Copy Session ID"}
							</Button>
						)}
						<Button
							variant="ghost"
							size="2"
							onClick={handleLeaveSession}
							className="text-red-400 hover:text-red-300"
						>
							<LogOut className="w-4 h-4 mr-2" />
							Leave
						</Button>
					</div>
				</div>
			</div>

			<div className="pt-20 pb-24 px-4">
				<div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
					{/* Main Video Area */}
					<div className="lg:col-span-2 space-y-6">
						{/* Video Grid */}
						<div className="bg-black/30 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{participants.map((participant) => (
									<div
										key={participant.id}
										className="relative bg-black rounded-xl overflow-hidden aspect-video"
									>
										{participant.id === userIdRef.current ? (
											<video
												ref={localVideoRef}
												autoPlay
												muted
												playsInline
												className="w-full h-full object-cover"
											/>
										) : (
											<video
												ref={(el) => setRemoteVideoRef(participant.id, el)}
												autoPlay
												playsInline
												className="w-full h-full object-cover"
											/>
										)}
										{!participant.isVideoEnabled && (
											<div className="absolute inset-0 flex items-center justify-center bg-black/80">
												<VideoOff className="w-12 h-12 text-white/50" />
											</div>
										)}
										<div className="absolute bottom-2 left-2 bg-black/70 rounded-lg px-2 py-1 flex items-center gap-2">
											<span className="text-white text-sm font-medium">
												{participant.name}
											</span>
											{!participant.isAudioEnabled && (
												<MicOff className="w-4 h-4 text-red-400" />
											)}
											{participant.isHost && (
												<span className="text-xs bg-purple-500 px-2 py-0.5 rounded">Host</span>
											)}
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Participant List */}
						<div className="bg-black/30 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
							<div className="flex items-center gap-2 mb-4">
								<Users className="w-5 h-5 text-white" />
								<h3 className="text-lg font-semibold text-white">
									Participants ({participants.length})
								</h3>
							</div>
							<div className="space-y-2">
								{participants.map((p) => (
									<div
										key={p.id}
										className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
									>
										<span className="text-white">{p.name}</span>
										<div className="flex items-center gap-2">
											{p.isVideoEnabled ? (
												<Video className="w-4 h-4 text-green-400" />
											) : (
												<VideoOff className="w-4 h-4 text-gray-400" />
											)}
											{p.isAudioEnabled ? (
												<Mic className="w-4 h-4 text-green-400" />
											) : (
												<MicOff className="w-4 h-4 text-gray-400" />
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Sidebar - Timer & Controls */}
					<div className="space-y-6">
						{/* Meditation Timer */}
						<div className="bg-black/30 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
							<div className="flex items-center gap-2 mb-4">
								<Clock className="w-5 h-5 text-white" />
								<h3 className="text-lg font-semibold text-white">Session Timer</h3>
							</div>

							<div className="text-center mb-6">
								{countdown !== null ? (
									<motion.div
										key={countdown}
										initial={{ scale: 0.5, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
										exit={{ scale: 0.5, opacity: 0 }}
										className="text-8xl font-bold text-white mb-2"
									>
										{countdown}
									</motion.div>
								) : (
									<div className="text-5xl font-bold text-white mb-2">
										{formatTime(timeLeft)}
									</div>
								)}
								{countdown === null && (
									<div className="w-full bg-white/10 rounded-full h-2">
										<div
											className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
											style={{ width: `${progress}%` }}
										/>
									</div>
								)}
							</div>

							{isHost && (
								<div className="space-y-3">
									{timerState === "idle" && (
										<Button
											onClick={handleStartTimerWithCountdown}
											variant="classic"
											size="4"
											className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold"
										>
											<Play className="w-5 h-5 mr-2" />
											Start Session
										</Button>
									)}

									{timerState === "running" && (
										<div className="flex gap-2">
											<Button
												onClick={handlePauseTimer}
												variant="classic"
												size="3"
												className="flex-1"
											>
												<Pause className="w-4 h-4 mr-2" />
												Pause
											</Button>
											<Button
												onClick={handleStopTimer}
												variant="ghost"
												size="3"
											>
												<Square className="w-4 h-4" />
											</Button>
										</div>
									)}

									{timerState === "paused" && (
										<div className="flex gap-2">
											<Button
												onClick={handleResumeTimer}
												variant="classic"
												size="3"
												className="flex-1"
											>
												<Play className="w-4 h-4 mr-2" />
												Resume
											</Button>
											<Button
												onClick={handleResetTimer}
												variant="ghost"
												size="3"
											>
												<RotateCcw className="w-4 h-4" />
											</Button>
										</div>
									)}

									{timerState === "completed" && (
										<Button
											onClick={handleResetTimer}
											variant="classic"
											size="4"
											className="w-full"
										>
											<RotateCcw className="w-5 h-5 mr-2" />
											Reset Timer
										</Button>
									)}
								</div>
							)}

							{!isHost && timerState === "idle" && (
								<p className="text-center text-white/70 text-sm">
									Waiting for host to start...
								</p>
							)}
						</div>

						{/* Video/Audio Controls */}
						<div className="bg-black/30 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
							<h3 className="text-lg font-semibold text-white mb-4">Controls</h3>
							<div className="grid grid-cols-2 gap-3">
								<Button
									onClick={handleToggleVideo}
									variant={isVideoEnabled ? "classic" : "ghost"}
									size="3"
									className={isVideoEnabled ? "bg-green-500" : ""}
								>
									{isVideoEnabled ? (
										<Video className="w-4 h-4 mr-2" />
									) : (
										<VideoOff className="w-4 h-4 mr-2" />
									)}
									{isVideoEnabled ? "Video On" : "Video Off"}
								</Button>
								<Button
									onClick={handleToggleAudio}
									variant={isAudioEnabled ? "classic" : "ghost"}
									size="3"
									className={isAudioEnabled ? "bg-green-500" : ""}
								>
									{isAudioEnabled ? (
										<Mic className="w-4 h-4 mr-2" />
									) : (
										<MicOff className="w-4 h-4 mr-2" />
									)}
									{isAudioEnabled ? "Mic On" : "Mic Off"}
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
