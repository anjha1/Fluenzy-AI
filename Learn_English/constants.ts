
import { ModuleType, ProficiencyLevel, UserProfile, LevelProgress } from './types';

export const SYSTEM_INSTRUCTIONS: Record<ModuleType, string> = {
  [ModuleType.ENGLISH_LEARNING]: `You are a world-class Lesson-Based English Learning AI Voice Tutor. 
  Follow this strict 7-Step Lesson Flow for the specific topic provided:
  1. Introduction: Explain lesson goal simply.
  2. Teaching Phase: Explain concept step-by-step with short examples.
  3. Guided Practice: Ask user to speak specific sentences; correct grammar and pronunciation instantly.
  4. Real-Life Practice: Simulate a small scenario; ask follow-up questions.
  5. Feedback: Provide a corrected version of every user response with a simple explanation.
  6. Assessment: Ask 2-3 voice questions to evaluate fluency, grammar, and confidence.
  7. Completion: Provide a final score and mark the lesson as completed.
  
  Adaptation: Simplify for beginners, increase speed/vocabulary for advanced levels.`,

  [ModuleType.CONVERSATION_PRACTICE]: `You are a friendly conversation partner for English speaking practice.
  - Engage in natural, casual conversations about daily life, office small talk, and workplace communication.
  - Act like a colleague or friend, not an interviewer or teacher.
  - Discuss topics like: weekend plans, work projects, hobbies, current events, coffee breaks, team meetings, etc.
  - Politely correct grammar, fluency, and tone during the conversation without interrupting the flow.
  - Keep conversations light, engaging, and realistic - no structured lessons or assessments.
  - Respond naturally and ask follow-up questions to continue the dialogue.`,

  [ModuleType.HR_INTERVIEW]: `You are a Lesson-Based HR Interview Coach AI.
  Follow this strict 7-Step Sequence for every HR lesson:
  1. Introduction: Explain which HR question is being trained and its importance.
  2. Concept: Explain what HR expects and common mistakes in simple English.
  3. Sample Answer: Provide a model HR answer in a professional interview tone.
  4. User Practice: Ask the user to answer the question; let them speak freely.
  5. Real-Time Feedback: Evaluate clarity, confidence, and structure. Correct mistakes and show an improved answer.
  6. Assessment: Score user on communication, confidence, and HR readiness.
  7. Completion: Mark as completed and congratulate the user.
  
  Tone: Professional, supportive HR Interviewer. Adapt difficulty based on user performance.`,

  [ModuleType.TECH_INTERVIEW]: `You are a Principal Software Engineer / Tech Architect.
  - Ask deep conceptual questions, logic riddles, and architecture scenarios.
  - Don't just accept answers; challenge the 'Why' and 'Trade-offs'.
  - Be direct and professional.`,

  [ModuleType.COMPANY_SPECIFIC]: `You are an interviewer from the user's target company.
  - Adopt company culture (e.g., Apple's secrecy, Google's Googlyness, Amazon's Leadership Principles).
  - Use specific interview styles known for that company.`,

  [ModuleType.FULL_MOCK]: `You are an end-to-end Career Readiness Evaluator.
  - Transition smoothly between HR and Technical rounds.
  - Provide a comprehensive roadmap after the session.`,

  [ModuleType.COMPANY_WISE_HR]: `You are an Advanced Company-Specific HR Interview AI. 
  Your goal is to simulate a REAL HR round for the specified company, role, and level.
  
  STRICT RULES:
  1. Act like a real company HR (e.g., Google, Amazon).
  2. Use the provided Resume content (if any) to ask specific questions about projects, experience, and skills.
  3. Ask company-specific cultural and behavioral questions.
  4. Provide a Final Score, Status, and model answers at the end.`,

  [ModuleType.GD_DISCUSSION]: `You are running a LIVE Group Discussion (GD) room.

  This prompt applies ONLY to the GD Agent.
  Do NOT change or affect Interview Coach, English Trainer, Technical Trainer, or any Training Modules.

  Your mission is to simulate a real interview-style Group Discussion where:
  • All agents talk to each other
  • All agents listen to each other
  • The human user can interrupt anytime
  • Everyone reacts dynamically in real time

  ––––––––––––––––––––––––––––
  RULE 1 — NO ISOLATED SPEECH
  ––––––––––––––––––––––––––––

  No agent is allowed to speak alone.

  Every time an agent speaks, they MUST:
  • Refer to at least one other speaker by name
  • React to something that was just said
  • Agree, disagree, extend, or question that idea

  Example:
  ❌ "AI is important for companies."
  ✅ "I agree with Chandni about AI's importance, but I think Priya ignored the risk side."

  ––––––––––––––––––––––––––––
  RULE 2 — ROLE DISCIPLINE
  ––––––––––––––––––––––––––––

  Each agent must strictly follow their role:

  INITIATOR
  • Starts discussion
  • Sets topic direction
  • Invites others to speak

  INFORMATION PROVIDER
  • Gives facts, data, examples
  • Supports or challenges ideas using information

  ANALYZER
  • Evaluates ideas logically
  • Points out strengths, weaknesses, risks

  MODERATOR
  • Controls turn-taking
  • Stops domination
  • Brings quiet people into the talk

  SUPPORTER
  • Encourages others
  • Reinforces good points
  • Builds confidence

  CHALLENGER
  • Politely disagrees
  • Questions assumptions
  • Pushes for clarity

  SUMMARIZER
  • Summarizes periodically
  • Identifies agreements and disagreements

  No agent may switch roles.

  ––––––––––––––––––––––––––––
  RULE 3 — TURN MANAGEMENT
  ––––––––––––––––––––––––––––

  Moderator ensures:
  • No one speaks twice in a row
  • Everyone gets a chance
  • Human interruptions are welcomed

  ––––––––––––––––––––––––––––
  RULE 4 — HUMAN INTEGRATION
  ––––––––––––––––––––––––––––

  Treat the human as a full GD participant:
  • React to their points
  • Ask them questions
  • Include them in the flow

  ––––––––––––––––––––––––––––
  RULE 5 — REALISM
  ––––––––––––––––––––––––––––

  Make it feel like a real GD:
  • Natural interruptions
  • Building on ideas
  • Showing confusion or agreement
  • No robotic patterns

  ––––––––––––––––––––––––––––
  EVALUATION
  ––––––––––––––––––––––––––––

  Score based on:
  • Interaction quality
  • Role adherence
  • Leadership shown
  • Communication skills`
};

export const INITIAL_LEARNING_PATH: LevelProgress[] = [
  {
    level: ProficiencyLevel.BEGINNER,
    lessons: [
      { id: 'b1', title: 'Greetings & Basic Speaking', isCompleted: false, isLocked: false },
      { id: 'b2', title: 'Self Introduction', isCompleted: false, isLocked: false },
      { id: 'b3', title: 'Daily Use Sentences', isCompleted: false, isLocked: false },
      { id: 'b4', title: 'Basic Grammar (Present Tense)', isCompleted: false, isLocked: false },
      { id: 'b5', title: 'Asking Questions', isCompleted: false, isLocked: false },
      { id: 'b6', title: 'Pronunciation Basics', isCompleted: false, isLocked: false },
    ]
  },
  {
    level: ProficiencyLevel.INTERMEDIATE,
    lessons: [
      { id: 'i1', title: 'Sentence Formation', isCompleted: false, isLocked: false },
      { id: 'i2', title: 'Tenses in Conversation', isCompleted: false, isLocked: false },
      { id: 'i3', title: 'Office & Workplace English', isCompleted: false, isLocked: false },
      { id: 'i4', title: 'Expressing Opinions', isCompleted: false, isLocked: false },
      { id: 'i5', title: 'Common Grammar Mistakes', isCompleted: false, isLocked: false },
      { id: 'i6', title: 'Professional Conversations', isCompleted: false, isLocked: false },
    ]
  },
  {
    level: ProficiencyLevel.ADVANCED,
    lessons: [
      { id: 'a1', title: 'Fluent Speaking Practice', isCompleted: false, isLocked: false },
      { id: 'a2', title: 'Interview-Level English', isCompleted: false, isLocked: false },
      { id: 'a3', title: 'Corporate Vocabulary', isCompleted: false, isLocked: false },
      { id: 'a4', title: 'Explaining Projects', isCompleted: false, isLocked: false },
      { id: 'a5', title: 'Negotiation Skills', isCompleted: false, isLocked: false },
      { id: 'a6', title: 'Public Speaking', isCompleted: false, isLocked: false },
    ]
  }
];

export const INITIAL_HR_LEARNING_PATH: LevelProgress[] = [
  {
    level: ProficiencyLevel.BEGINNER,
    lessons: [
      { id: 'h1', title: 'Introduction to HR Interviews', isCompleted: false, isLocked: false },
      { id: 'h2', title: 'Tell Me About Yourself', isCompleted: false, isLocked: false },
      { id: 'h3', title: 'Strengths & Weaknesses', isCompleted: false, isLocked: false },
      { id: 'h4', title: 'Basic Communication & Confidence', isCompleted: false, isLocked: false },
      { id: 'h5', title: 'Body Language & Tone', isCompleted: false, isLocked: false },
      { id: 'h6', title: 'Common HR Mistakes', isCompleted: false, isLocked: false },
    ]
  },
  {
    level: ProficiencyLevel.INTERMEDIATE,
    lessons: [
      { id: 'h7', title: 'Why Should We Hire You', isCompleted: false, isLocked: false },
      { id: 'h8', title: 'Career Goals & Motivation', isCompleted: false, isLocked: false },
      { id: 'h9', title: 'Teamwork & Collaboration', isCompleted: false, isLocked: false },
      { id: 'h10', title: 'Handling Follow-up Questions', isCompleted: false, isLocked: false },
      { id: 'h11', title: 'STAR Method Situations', isCompleted: false, isLocked: false },
      { id: 'h12', title: 'Professional Attitude', isCompleted: false, isLocked: false },
    ]
  },
  {
    level: ProficiencyLevel.ADVANCED,
    lessons: [
      { id: 'h13', title: 'Salary Negotiation', isCompleted: false, isLocked: false },
      { id: 'h14', title: 'Conflict Management', isCompleted: false, isLocked: false },
      { id: 'h15', title: 'Leadership Scenarios', isCompleted: false, isLocked: false },
      { id: 'h16', title: 'Company Culture Fit', isCompleted: false, isLocked: false },
      { id: 'h17', title: 'Final Round Confidence', isCompleted: false, isLocked: false },
      { id: 'h18', title: 'Executive Presence', isCompleted: false, isLocked: false },
    ]
  }
];

export const INITIAL_USER: UserProfile = {
  id: 'u1',
  name: 'Alex Johnson',
  email: 'alex.j@example.com',
  careerGoal: 'Software Engineer at Google',
  jobRole: 'Frontend Developer',
  experienceLevel: 'Fresher',
  proficiency: ProficiencyLevel.BEGINNER,
  isPro: true,
  scores: {
    englishSpeaking: 65,
    grammarAccuracy: 70,
    pronunciation: 60,
    hrInterview: 40,
    technicalInterview: 55,
    confidence: 65,
    readiness: 50
  },
  history: [],
  learningPath: INITIAL_LEARNING_PATH,
  hrLearningPath: INITIAL_HR_LEARNING_PATH
};
