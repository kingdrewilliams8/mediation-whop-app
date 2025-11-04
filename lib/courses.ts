"use client";

export interface Lesson {
	id: string;
	title: string;
	content: string;
	quizQuestion: string;
	quizOptions: string[];
	correctAnswer: number;
}

export interface Course {
	id: string;
	name: string;
	level: number;
	color: string;
	description: string;
	lessons: Lesson[];
	courseQuiz?: {
		question: string;
		options: string[];
		correctAnswer: number;
	};
}

export const COURSES: Course[] = [
	{
		id: "beginner",
		name: "Beginner",
		level: 1,
		color: "#2dd4bf",
		description: "Start your meditation journey with the fundamentals",
		lessons: [
			{
				id: "beginner-1",
				title: "Introduction to Meditation",
				content: `
					<h3>Welcome to Meditation</h3>
					<p>Meditation is a practice where you focus your mind and achieve a state of calm and clarity. 
					It's been practiced for thousands of years and has numerous benefits including reduced stress, 
					better focus, and improved emotional well-being.</p>
					
					<h4>Getting Started:</h4>
					<ol>
						<li>Find a quiet, comfortable space</li>
						<li>Sit in a relaxed but upright position</li>
						<li>Close your eyes gently</li>
						<li>Take a few deep breaths</li>
						<li>Focus on your breath naturally</li>
					</ol>
					
					<p>Start with just 5 minutes a day. Remember, there's no "wrong" way to meditate - 
					the goal is simply to be present and aware.</p>
				`,
				quizQuestion: "What is meditation for?",
				quizOptions: [
					"Empty your mind",
					"Find calm and clarity",
					"Fall asleep",
					"Get stronger"
				],
				correctAnswer: 1
			},
			{
				id: "beginner-2",
				title: "Breathing Basics",
				content: `
					<h3>Breathing in Meditation</h3>
					<p>Your breath is your anchor in meditation. It's always with you, 
					always happening in the present moment.</p>
					
					<h4>Breathing Technique:</h4>
					<ol>
						<li>Breathe in naturally through your nose</li>
						<li>Feel the air fill your lungs</li>
						<li>Exhale slowly through your mouth</li>
						<li>Notice the pause between breaths</li>
						<li>Don't force it - let it be natural</li>
					</ol>
					
					<p>When your mind wanders (and it will!), gently bring your attention back to your breath. 
					This is the practice - noticing and returning.</p>
				`,
				quizQuestion: "What to do when your mind wanders?",
				quizOptions: [
					"Give up",
					"Force it to stop",
					"Return to your breath",
					"Keep thinking"
				],
				correctAnswer: 2
			},
			{
				id: "beginner-3",
				title: "Posture and Comfort",
				content: `
					<h3>Finding Your Meditation Posture</h3>
					<p>A good posture helps you stay alert while remaining relaxed. 
					You don't need to sit cross-legged on the floor - any comfortable position works!</p>
					
					<h4>Posture Tips:</h4>
					<ul>
						<li><strong>Chair:</strong> Sit with feet flat on floor, back straight but not rigid</li>
						<li><strong>Floor:</strong> Use a cushion to raise your hips slightly</li>
						<li><strong>Lying down:</strong> Great for body scans, but may lead to sleep!</li>
						<li><strong>Hands:</strong> Rest naturally on your lap or knees</li>
					</ul>
					
					<p>Comfort is key. Adjust as needed during your practice.</p>
				`,
				quizQuestion: "",
				quizOptions: [],
				correctAnswer: -1
			},
			{
				id: "beginner-4",
				title: "Daily Practice Routine",
				content: `
					<h3>Building Consistency</h3>
					<p>Consistency is more important than duration. Five minutes every day beats an hour once a week.</p>
					<h4>Tips for Daily Practice:</h4>
					<ul>
						<li>Choose the same time each day</li>
						<li>Start with just 5 minutes</li>
						<li>Use reminders or calendar</li>
						<li>Be gentle with yourself - missed days are okay</li>
					</ul>
				`,
				quizQuestion: "",
				quizOptions: [],
				correctAnswer: -1
			},
			{
				id: "beginner-5",
				title: "Dealing with Distractions",
				content: `
					<h3>Mind Wandering is Normal</h3>
					<p>Your mind will wander - this is completely normal and part of the practice!</p>
					<h4>When Thoughts Come:</h4>
					<ul>
						<li>Notice the thought without judgment</li>
						<li>Let it pass like a cloud in the sky</li>
						<li>Gently return to your breath</li>
						<li>Repeat as many times as needed</li>
					</ul>
				`,
				quizQuestion: "",
				quizOptions: [],
				correctAnswer: -1
			}
		],
		courseQuiz: {
			question: "What is the key to successful meditation?",
			options: [
				"Perfect stillness",
				"Daily practice",
				"Long sessions",
				"No thoughts"
			],
			correctAnswer: 1
		}
	},
	{
		id: "intermediate",
		name: "Intermediate",
		level: 2,
		color: "#60a5fa",
		description: "Deepen your practice with advanced techniques",
		lessons: [
			{
				id: "intermediate-1",
				title: "Body Scan Meditation",
				content: `
					<h3>Body Scan Practice</h3>
					<p>The body scan is a powerful technique that helps you develop awareness of physical sensations 
					and release tension throughout your body.</p>
					
					<h4>How to Practice:</h4>
					<ol>
						<li>Lie down or sit comfortably</li>
						<li>Close your eyes and take a few deep breaths</li>
						<li>Start at your toes - notice any sensations</li>
						<li>Slowly move your attention up through your body</li>
						<li>Scan each part: feet, legs, torso, arms, neck, head</li>
						<li>Notice without judgment - just observe</li>
						<li>When you reach your head, scan back down</li>
					</ol>
					
					<p>This practice helps you connect with your body and release physical tension.</p>
				`,
				quizQuestion: "Why do body scans?",
				quizOptions: [
					"Get fit",
					"Feel your body",
					"Check health",
					"Sleep better"
				],
				correctAnswer: 1
			},
			{
				id: "intermediate-2",
				title: "Walking Meditation",
				content: `
					<h3>Meditation in Motion</h3>
					<p>Walking meditation combines movement with mindfulness, making it perfect 
					for those who find sitting meditation challenging.</p>
					
					<h4>Walking Practice:</h4>
					<ol>
						<li>Find a quiet path, 10-30 steps long</li>
						<li>Stand at one end, bring attention to your body</li>
						<li>Start walking slowly, one step at a time</li>
						<li>Notice the lifting, moving, placing of each foot</li>
						<li>Feel the contact of your feet with the ground</li>
						<li>When you reach the end, pause, turn, and return</li>
						<li>Keep your attention on the experience of walking</li>
					</ol>
					
					<p>This practice helps you bring mindfulness into everyday activities.</p>
				`,
				quizQuestion: "Why do walking meditation?",
				quizOptions: [
					"Just exercise",
					"Stay mindful while moving",
					"Walk fast",
					"Need special path"
				],
				correctAnswer: 1
			}
		]
	},
	{
		id: "advanced",
		name: "Advanced",
		level: 3,
		color: "#fb923c",
		description: "Master deep states of consciousness",
		lessons: [
			{
				id: "advanced-1",
				title: "Loving-Kindness Meditation",
				content: `
					<h3>Metta (Loving-Kindness) Practice</h3>
					<p>Loving-kindness meditation cultivates feelings of warmth, compassion, and goodwill 
					toward yourself and others.</p>
					
					<h4>Metta Practice:</h4>
					<ol>
						<li>Start by extending kindness to yourself</li>
						<li>Repeat phrases: "May I be happy, may I be healthy, may I be safe"</li>
						<li>Next, think of someone you love - extend these wishes to them</li>
						<li>Then a neutral person - someone you see but don't know well</li>
						<li>Now someone difficult - wish them well too</li>
						<li>Finally, extend to all beings everywhere</li>
					</ol>
					
					<p>This practice develops compassion and reduces feelings of anger and resentment.</p>
				`,
				quizQuestion: "",
				quizOptions: [],
				correctAnswer: -1
			},
			{
				id: "advanced-2",
				title: "Non-Attachment Practice",
				content: `
					<h3>Letting Go</h3>
					<p>Practice observing thoughts and emotions without getting caught in them.</p>
					<h4>Technique:</h4>
					<ul>
						<li>Notice thoughts as they arise</li>
						<li>Don't judge or follow them</li>
						<li>Let them pass naturally</li>
						<li>Return to present moment awareness</li>
					</ul>
				`,
				quizQuestion: "",
				quizOptions: [],
				correctAnswer: -1
			},
			{
				id: "advanced-3",
				title: "Deep Concentration",
				content: `
					<h3>Single-Pointed Focus</h3>
					<p>Develop the ability to sustain attention on one object.</p>
					<h4>Practice Steps:</h4>
					<ul>
						<li>Choose your focus point - breath, sound, or sensation</li>
						<li>Maintain attention for extended periods</li>
						<li>When distracted, gently return without frustration</li>
						<li>Gradually increase duration</li>
					</ul>
				`,
				quizQuestion: "",
				quizOptions: [],
				correctAnswer: -1
			}
		],
		courseQuiz: {
			question: "What is advanced meditation about?",
			options: [
				"Empty mind",
				"Deep awareness",
				"No thoughts",
				"Long hours"
			],
			correctAnswer: 1
		}
	},
	{
		id: "monk",
		name: "Monk",
		level: 4,
		color: "#a78bfa",
		description: "Achieve mastery and profound stillness",
		lessons: [
			{
				id: "monk-1",
				title: "The Nature of Mind",
				content: `
					<h3>Understanding Consciousness</h3>
					<p>At the highest levels of practice, we come to understand the nature of mind itself. 
					This is where meditation moves beyond technique into direct insight.</p>
					
					<h4>Advanced Practice:</h4>
					<ol>
						<li>Settle into deep stillness</li>
						<li>Observe the observer - notice who is noticing</li>
						<li>Investigate the nature of awareness itself</li>
						<li>Rest in the space between thoughts</li>
						<li>Recognize that awareness is always present</li>
						<li>Abide in this recognition naturally</li>
					</ol>
					
					<p>This is the essence of mindfulness - recognizing awareness itself, 
					which is always present, always clear, always free.</p>
				`,
				quizQuestion: "",
				quizOptions: [],
				correctAnswer: -1
			},
			{
				id: "monk-2",
				title: "Transcendental States",
				content: `
					<h3>Beyond Ordinary Consciousness</h3>
					<p>Explore states beyond normal awareness through deep practice.</p>
					<h4>Approach:</h4>
					<ul>
						<li>Maintain consistent daily practice</li>
						<li>Create ideal conditions for deep meditation</li>
						<li>Surrender to the experience</li>
						<li>Trust the process</li>
					</ul>
				`,
				quizQuestion: "",
				quizOptions: [],
				correctAnswer: -1
			},
			{
				id: "monk-3",
				title: "Integration into Life",
				content: `
					<h3>Living Meditation</h3>
					<p>Bring meditation awareness into every moment of daily life.</p>
					<h4>Practice:</h4>
					<ul>
						<li>Carry meditative awareness throughout the day</li>
						<li>Practice mindfulness in all activities</li>
						<li>See the meditation in everyday moments</li>
						<li>Be present in all you do</li>
					</ul>
				`,
				quizQuestion: "",
				quizOptions: [],
				correctAnswer: -1
			}
		],
		courseQuiz: {
			question: "What is mastery?",
			options: [
				"Perfect technique",
				"Living awareness",
				"No emotions",
				"Special powers"
			],
			correctAnswer: 1
		}
	}
];

export function getCourseById(id: string): Course | undefined {
	return COURSES.find(course => course.id === id);
}

export function getLessonById(courseId: string, lessonId: string): Lesson | undefined {
	const course = getCourseById(courseId);
	return course?.lessons.find(lesson => lesson.id === lessonId);
}

