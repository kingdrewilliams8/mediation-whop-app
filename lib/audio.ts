// Enhanced sound generation using Web Audio API
export function playTone(type: string) {
	const audioContext = new (window.AudioContext ||
		(window as any).webkitAudioContext)();
	
	switch (type) {
		case "bell": {
			// Clear, bright bell sound
			const osc = audioContext.createOscillator();
			const gain = audioContext.createGain();
			osc.type = "sine";
			osc.frequency.value = 523.25; // C5
			gain.gain.setValueAtTime(0.4, audioContext.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
			osc.connect(gain);
			gain.connect(audioContext.destination);
			osc.start();
			osc.stop(audioContext.currentTime + 1.5);
			break;
		}
		case "gong": {
			// Deep, resonant gong
			const osc = audioContext.createOscillator();
			const gain = audioContext.createGain();
			osc.type = "triangle";
			osc.frequency.value = 98; // Low G2
			gain.gain.setValueAtTime(0.5, audioContext.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 3);
			osc.connect(gain);
			gain.connect(audioContext.destination);
			osc.start();
			osc.stop(audioContext.currentTime + 3);
			break;
		}
		case "chime": {
			// High-pitched, bright chime
			const osc = audioContext.createOscillator();
			const gain = audioContext.createGain();
			osc.type = "sine";
			osc.frequency.value = 880; // A5
			gain.gain.setValueAtTime(0.35, audioContext.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 4);
			osc.connect(gain);
			gain.connect(audioContext.destination);
			osc.start();
			osc.stop(audioContext.currentTime + 4);
			break;
		}
		case "bowl": {
			// Singing bowl - warm, resonant
			const osc = audioContext.createOscillator();
			const gain = audioContext.createGain();
			osc.type = "sine";
			osc.frequency.value = 256; // Middle C
			gain.gain.setValueAtTime(0.4, audioContext.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 4);
			osc.connect(gain);
			gain.connect(audioContext.destination);
			osc.start();
			osc.stop(audioContext.currentTime + 4);
			break;
		}
		case "tibetan": {
			// Tibetan bowl - deep, resonant, healing frequency with harmonics
			const osc1 = audioContext.createOscillator();
			const osc2 = audioContext.createOscillator();
			const gain = audioContext.createGain();
			
			// Base frequency at 174 Hz (healing frequency)
			osc1.type = "sine";
			osc1.frequency.value = 174;
			
			// Add harmonic at 348 Hz (octave) for richer sound
			osc2.type = "sine";
			osc2.frequency.value = 348;
			
			// Start with higher gain for better audibility
			gain.gain.setValueAtTime(0.6, audioContext.currentTime);
			// Hold the peak for a brief moment
			gain.gain.setValueAtTime(0.6, audioContext.currentTime + 0.1);
			// Then exponential decay over 6 seconds
			gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 6);
			
			osc1.connect(gain);
			osc2.connect(gain);
			gain.connect(audioContext.destination);
			
			osc1.start();
			osc2.start();
			osc1.stop(audioContext.currentTime + 6);
			osc2.stop(audioContext.currentTime + 6);
			break;
		}
		case "crystal": {
			// Crystal bowl - bright, pure tone
			const osc = audioContext.createOscillator();
			const gain = audioContext.createGain();
			osc.type = "sine";
			osc.frequency.value = 528; // Love frequency (C5#)
			gain.gain.setValueAtTime(0.35, audioContext.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 3);
			osc.connect(gain);
			gain.connect(audioContext.destination);
			osc.start();
			osc.stop(audioContext.currentTime + 3);
			break;
		}
		case "zen": {
			// Zen bell - natural, calming
			const osc1 = audioContext.createOscillator();
			const osc2 = audioContext.createOscillator();
			const osc3 = audioContext.createOscillator();
			const gain = audioContext.createGain();
			osc1.type = "sine";
			osc1.frequency.value = 440; // A4
			osc2.type = "sine";
			osc2.frequency.value = 554.37; // C#5
			osc3.type = "sine";
			osc3.frequency.value = 659.25; // E5
			gain.gain.setValueAtTime(0.3, audioContext.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 3);
			osc1.connect(gain);
			osc2.connect(gain);
			osc3.connect(gain);
			gain.connect(audioContext.destination);
			osc1.start();
			osc2.start();
			osc3.start();
			osc1.stop(audioContext.currentTime + 3);
			osc2.stop(audioContext.currentTime + 3);
			osc3.stop(audioContext.currentTime + 3);
			break;
		}
		case "ocean": {
			// Ocean waves - layered, complex
			const osc1 = audioContext.createOscillator();
			const osc2 = audioContext.createOscillator();
			const osc3 = audioContext.createOscillator();
			const gain = audioContext.createGain();
			
			osc1.type = "sawtooth";
			osc1.frequency.value = 60; // Low rumble
			osc2.type = "sine";
			osc2.frequency.value = 120; // Mid layer
			osc3.type = "sine";
			osc3.frequency.value = 240; // Upper layer for wave texture
			
			gain.gain.setValueAtTime(0.3, audioContext.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 3);
			
			osc1.connect(gain);
			osc2.connect(gain);
			osc3.connect(gain);
			gain.connect(audioContext.destination);
			
			osc1.start();
			osc2.start();
			osc3.start();
			osc1.stop(audioContext.currentTime + 3);
			osc2.stop(audioContext.currentTime + 3);
			osc3.stop(audioContext.currentTime + 3);
			break;
		}
		case "forest": {
			// Forest chimes - bird-like, natural
			const osc1 = audioContext.createOscillator();
			const osc2 = audioContext.createOscillator();
			const gain = audioContext.createGain();
			osc1.type = "sine";
			osc1.frequency.value = 440; // A4
			osc2.type = "sine";
			osc2.frequency.value = 554.37; // C#5
			gain.gain.setValueAtTime(0.3, audioContext.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
			osc1.connect(gain);
			osc2.connect(gain);
			gain.connect(audioContext.destination);
			osc1.start();
			osc2.start();
			osc1.stop(audioContext.currentTime + 2);
			osc2.stop(audioContext.currentTime + 2);
			break;
		}
		case "peaceful": {
			// Peaceful tone - soft, gentle
			const osc = audioContext.createOscillator();
			const gain = audioContext.createGain();
			osc.type = "sine";
			osc.frequency.value = 256; // Middle C, gentle
			gain.gain.setValueAtTime(0.2, audioContext.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2.5);
			osc.connect(gain);
			gain.connect(audioContext.destination);
			osc.start();
			osc.stop(audioContext.currentTime + 2.5);
			break;
		}
		default: {
			const osc = audioContext.createOscillator();
			const gain = audioContext.createGain();
			osc.type = "sine";
			osc.frequency.value = 440;
			gain.gain.setValueAtTime(0.3, audioContext.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
			osc.connect(gain);
			gain.connect(audioContext.destination);
			osc.start();
			osc.stop(audioContext.currentTime + 2);
		}
	}
}
