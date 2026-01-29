"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { GoogleGenAI, Modality } from '@google/genai';
import { 
  X, 
  Sparkles,
  Zap,
  ArrowRight,
  Mic2,
  Activity,
  Cpu,
  Radio,
  Power
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, ModuleType, InterviewQA } from '../types';
import { SYSTEM_INSTRUCTIONS } from '../constants';

// --- Utility Functions for Audio ---
function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const HumanAvatar = ({ 
  isSpeaking, 
  isListening, 
  type
}: { 
  isSpeaking: boolean; 
  isListening: boolean; 
  type?: string;
}) => {
  const avatarImage = useMemo(() => {
    if (type === ModuleType.HR_INTERVIEW || type === ModuleType.COMPANY_WISE_HR) {
      return "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"; 
    }
    if (type === ModuleType.TECH_INTERVIEW) {
      return "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800"; 
    }
    return "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=800"; 
  }, [type]);

  return (
    <div className="relative w-72 h-72 md:w-96 md:h-96 mx-auto perspective-1000 flex items-center justify-center">
      {/* Scanning/Halo Rings */}
      <motion.div 
        animate={{ rotate: 360, scale: isSpeaking ? [1, 1.1, 1] : 1 }}
        transition={{ rotate: { duration: 10, repeat: Infinity, ease: "linear" }, scale: { duration: 2, repeat: Infinity } }}
        className="absolute inset-0 rounded-full border border-dashed border-white/20 opacity-30"
      />
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-4 rounded-full border border-dotted border-white/10 opacity-30"
      />
      
      {/* Glow Effect */}
      <motion.div
        animate={{ 
          opacity: isSpeaking ? 0.6 : isListening ? 0.4 : 0.2,
          scale: isSpeaking ? 1.2 : 1.05
        }}
        className={`absolute inset-0 rounded-full blur-[60px] transition-colors duration-500 ${
          isSpeaking ? 'bg-blue-500' : isListening ? 'bg-emerald-500' : 'bg-slate-500'
        }`}
      />

      {/* Main Avatar Container */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-slate-800 shadow-2xl z-10 group">
        <div className="absolute inset-0 bg-slate-900/20 z-10 group-hover:bg-transparent transition-colors duration-300" />
        <img src={avatarImage} alt="Avatar" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
        
        {/* Voice Visualization Overlay */}
        {isSpeaking && (
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-blue-900/80 to-transparent flex items-end justify-center pb-4 gap-1">
             {[...Array(5)].map((_, i) => (
                <motion.div 
                  key={i}
                  animate={{ height: [10, 30, 10] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                  className="w-1.5 bg-blue-400 rounded-full"
                />
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

const VoiceAgent: React.FC<{ user: UserProfile; onSessionEnd: (u: UserProfile) => void }> = ({ user, onSessionEnd }) => {
  const { type } = useParams<{ type: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);

  const isEnglishLearning = type === ModuleType.ENGLISH_LEARNING;
  const isHRInterview = type === ModuleType.HR_INTERVIEW;
  const isConversationPractice = type === ModuleType.CONVERSATION_PRACTICE;

  const sessionMeta: any = useMemo(() => ({
    lessonId: searchParams.get('lessonId'),
    lessonTitle: searchParams.get('lessonTitle') ? decodeURIComponent(searchParams.get('lessonTitle')!) : undefined,
    company: searchParams.get('company') ? decodeURIComponent(searchParams.get('company')!) : undefined,
    companyLogo: searchParams.get('companyLogo') ? decodeURIComponent(searchParams.get('companyLogo')!) : undefined,
    role: searchParams.get('role') ? decodeURIComponent(searchParams.get('role')!) : undefined,
    experience: searchParams.get('experience') ? decodeURIComponent(searchParams.get('experience')!) : undefined,
    difficulty: searchParams.get('difficulty') ? decodeURIComponent(searchParams.get('difficulty')!) : undefined,
    roundType: searchParams.get('roundType') ? decodeURIComponent(searchParams.get('roundType')!) : undefined,
    resumeText: searchParams.get('resumeText') ? decodeURIComponent(searchParams.get('resumeText')!) : undefined,
    isCompanyWise: searchParams.get('isCompanyWise') === 'true',
    focus: searchParams.get('focus') ? decodeURIComponent(searchParams.get('focus')!) : undefined,
    level: searchParams.get('level') ? decodeURIComponent(searchParams.get('level')!) : undefined
  }), [searchParams]);

  const currentQA = useRef({ question: '', answer: '' });
  const transcriptHistory = useRef<InterviewQA[]>([]);
  const startTimeRef = useRef(new Date());

  const topic = useMemo(() => {
    if (type === ModuleType.CONVERSATION_PRACTICE) return 'Daily Conversation';
    return sessionMeta?.isCompanyWise
      ? `${sessionMeta.company} - ${sessionMeta.role} (${sessionMeta.roundType})`
      : (sessionMeta?.lessonTitle || 'General Session');
  }, [sessionMeta, type]);

  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const cleanup = useCallback(async (saveResults = false) => {
    if (sessionRef.current) { sessionRef.current.close(); sessionRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
    sourcesRef.current.clear();
    setIsActive(false);
    setIsConnecting(false);
    setIsAiSpeaking(false);

    if (saveResults) {
      const endTime = new Date();
      // Evaluate each answer
      const evaluatedTranscripts = [];
      for (const qa of transcriptHistory.current) {
        try {
          const evaluation = await fetch('/api/evaluate-answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: qa.question, answer: qa.answer, module: type, context: sessionMeta })
          }).then(r => r.json());

          evaluatedTranscripts.push({
            aiPrompt: qa.question,
            userAnswer: qa.answer,
            aiFeedback: evaluation.aiFeedback || 'Good response',
            idealAnswer: evaluation.idealAnswer || qa.answer,
            scores: evaluation.scores,
            perQuestionScore: evaluation.perQuestionScore
          });
        } catch (error) {
          console.error('Evaluation error:', error);
          evaluatedTranscripts.push({
            aiPrompt: qa.question,
            userAnswer: qa.answer,
            aiFeedback: 'Response recorded',
            idealAnswer: qa.answer,
            scores: { clarity: 7, relevance: 7, grammar: 7, confidence: 7, technicalAccuracy: 7 },
            perQuestionScore: 7
          });
        }
      }

      const totalScore = evaluatedTranscripts.reduce((sum, t) => sum + (t.perQuestionScore || 0), 0);
      const aggregateScore = evaluatedTranscripts.length > 0 ? totalScore / evaluatedTranscripts.length : 0;
      const status = aggregateScore >= 6 ? 'PASS' : 'FAIL';

      try {
        await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            module: type,
            targetCompany: sessionMeta?.company,
            role: sessionMeta?.role,
            startTime: startTimeRef.current.toISOString(),
            endTime: endTime.toISOString(),
            transcripts: evaluatedTranscripts,
            aggregateScore,
            status
          })
        });

        if (sessionMeta?.lessonId) {
          const apiEndpoint = isEnglishLearning ? '/api/lesson-complete' : '/api/hr-complete';
          const storageKey = isEnglishLearning ? 'englishProgress' : 'hrProgress';
          try {
             await fetch(apiEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lessonId: sessionMeta.lessonId }) });
          } catch(e) {}
          const stored = localStorage.getItem(storageKey) || '{}';
          const progressData = JSON.parse(stored);
          progressData[sessionMeta.lessonId] = true;
          localStorage.setItem(storageKey, JSON.stringify(progressData));
        }
      } catch (error) {
        console.error('Session save error:', error);
      }
      setIsFinished(true);
    }
  }, [type, sessionMeta, isEnglishLearning]);

  const startSession = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      inputAudioContextRef.current = new AudioContext({ sampleRate: 16000 });
      outputAudioContextRef.current = new AudioContext({ sampleRate: 24000 });
      await inputAudioContextRef.current.resume();
      await outputAudioContextRef.current.resume();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const getLessonContext = () => {
        if (!isEnglishLearning || !sessionMeta?.lessonTitle) return null;
        const title = sessionMeta.lessonTitle.toLowerCase();
        if (title.includes('introduction') || title.includes('self')) return { objective: "Practice introducing yourself confidently", coachMessage: "Let's build your confidence in self-introductions." };
        if (title.includes('greetings') || title.includes('basic')) return { objective: "Master everyday greetings", coachMessage: "Greetings are key. Let's practice common phrases." };
        return { objective: `Practice ${sessionMeta.lessonTitle}`, coachMessage: `Let's work on your ${sessionMeta.lessonTitle} skills.` };
      };
    
      const lessonContext = getLessonContext();
      const instruction = `
        ${SYSTEM_INSTRUCTIONS[type as ModuleType] || 'Senior Interview Coach.'}
        ${isEnglishLearning
          ? `CONTEXT: Lesson Topic: ${sessionMeta?.lessonTitle || 'General English Practice'}, User Proficiency Level: ${user.proficiency}. Focus on teaching English skills.`
          : isHRInterview
          ? `CONTEXT: HR Lesson Topic: ${sessionMeta?.lessonTitle || 'General HR Interview Practice'}. Focus on HR interview coaching.`
          : isConversationPractice
          ? `CONTEXT: Daily conversation practice. Engage in natural English speaking practice. User Proficiency Level: ${user.proficiency}.`
          : `CONTEXT: Role: ${sessionMeta?.role || user.jobRole}, Company: ${sessionMeta?.company || 'Top MNC'}, Resume: ${sessionMeta?.resumeText || 'General Profile'}.`
        }
      `;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: instruction,
          thinkingConfig: { thinkingBudget: 24576 }
        },
        callbacks: {
          onopen: () => {
            setIsConnecting(false); setIsActive(true);
            const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              sessionPromise.then(s => s.sendRealtimeInput({ media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' } }));
            };
            source.connect(scriptProcessor); scriptProcessor.connect(inputAudioContextRef.current!.destination);
          },
          onmessage: async (m) => {
            if (m.serverContent?.outputTranscription?.text) currentQA.current.question += m.serverContent.outputTranscription.text;
            if (m.serverContent?.inputTranscription?.text) currentQA.current.answer += m.serverContent.inputTranscription.text;
            if (m.serverContent?.turnComplete) {
              transcriptHistory.current.push({ ...currentQA.current, timestamp: new Date().toLocaleTimeString() });
              currentQA.current = { question: '', answer: '' };
            }
            const data = m.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (data) {
              const buf = await decodeAudioData(decode(data), outputAudioContextRef.current!, 24000, 1);
              const src = outputAudioContextRef.current!.createBufferSource();
              src.buffer = buf; src.connect(outputAudioContextRef.current!.destination);
              setIsAiSpeaking(true);
              src.onended = () => { sourcesRef.current.delete(src); if (sourcesRef.current.size === 0) setIsAiSpeaking(false); };
              src.start(Math.max(nextStartTimeRef.current, outputAudioContextRef.current!.currentTime));
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current!.currentTime) + buf.duration;
              sourcesRef.current.add(src);
            }
          },
          onerror: (e) => { console.error(e); setError("Handshake failure. Check microphone."); cleanup(false); },
          onclose: () => cleanup(false),
        },
      });
      sessionRef.current = await sessionPromise;
    } catch (err: any) {
      setIsConnecting(false);
      setError("Microphone access failed. Please check permissions.");
    }
  };

  useEffect(() => {
    if (isFinished) { router.push('/train'); }
  }, [isFinished, router]);

  // Derived lesson info for display
  const title = sessionMeta?.lessonTitle || (isConversationPractice ? 'Daily Conversation' : 'Interview Session');
  const subTitle = isEnglishLearning ? 'AI English Coach' : 'AI Interview Coach';

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center relative overflow-hidden rounded-[2.5rem] bg-slate-950/40 backdrop-blur-2xl border border-white/5 shadow-2xl">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-grid-slate-800/[0.05] bg-[bottom_1px_center] [mask-image:linear-gradient(to_bottom,transparent,black)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial from-blue-500/5 to-transparent opacity-50 pointer-events-none" />
      
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-3 bg-slate-900/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-300">System Ready</span>
        </div>
        <button onClick={() => router.push('/train')} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
          <X size={20} />
        </button>
      </div>

      <AnimatePresence mode='wait'>
        {!isActive && !isConnecting ? (
          // --- PRE-SESSION COCKPIT ---
          <motion.div 
            key="pre-session"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            className="relative z-10 max-w-lg w-full p-8 text-center space-y-10"
          >
            <div className="space-y-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" />
                <div className="relative w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden">
                   <img src="/image/img.png" alt="Coach" className="w-full h-full object-cover opacity-90" />
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-950 border border-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-400 whitespace-nowrap">
                   {subTitle}
                </div>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none">
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{title}</span>
                </h1>
                <p className="text-slate-400 text-sm md:text-base font-medium max-w-sm mx-auto leading-relaxed">
                   {sessionMeta?.lessonTitle 
                      ? "Your personalized AI coach is ready. Connect your audio to begin the session." 
                      : "Prepare for your interview simulation. The AI will guide you through the process."}
                </p>
              </div>
            </div>

            {error && (
              <motion.div 
                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                 className="bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl text-xs font-bold text-red-400 flex items-center justify-center gap-2"
              >
                 <Zap size={14} /> {error}
              </motion.div>
            )}

            <button
               onClick={startSession}
               className="group relative w-full bg-white text-black h-16 rounded-2xl font-black uppercase tracking-[0.2em] overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
               <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
               <span className="relative z-10 flex items-center justify-center gap-3">
                  Initialize Session <ArrowRight size={18} />
               </span>
            </button>
          </motion.div>
        ) : (
          // --- ACTIVE HUD ---
          <motion.div 
             key="active-session"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="relative z-10 w-full h-full flex flex-col items-center justify-between py-12"
          >
             {/* Status Pill */}
             <div className="absolute top-20 left-1/2 -translate-x-1/2">
                <motion.div 
                   animate={{ 
                      boxShadow: isAiSpeaking ? "0 0 20px rgba(59, 130, 246, 0.3)" : "0 0 20px rgba(16, 185, 129, 0.2)",
                      borderColor: isAiSpeaking ? "rgba(59, 130, 246, 0.3)" : "rgba(16, 185, 129, 0.3)"
                   }}
                   className={`flex items-center gap-3 px-6 py-2.5 rounded-full border bg-slate-950/50 backdrop-blur-xl transition-all duration-300`}
                >
                   <div className="flex gap-1 items-center h-3">
                      {[...Array(3)].map((_, i) => (
                         <motion.div 
                            key={i}
                            animate={{ height: (isAiSpeaking || !isAiSpeaking) ? [4, 12, 4] : 4 }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                            className={`w-1 rounded-full ${isAiSpeaking ? 'bg-blue-400' : 'bg-emerald-400'}`}
                         />
                      ))}
                   </div>
                   <span className={`text-xs font-bold uppercase tracking-widest ${isAiSpeaking ? 'text-blue-400' : 'text-emerald-400'}`}>
                      {isAiSpeaking ? 'Coach Speaking' : 'Listening...'}
                   </span>
                </motion.div>
             </div>

             <div className="flex-1 flex items-center justify-center w-full">
                <HumanAvatar isSpeaking={isAiSpeaking} isListening={!isAiSpeaking} type={type as string} />
             </div>

             <div className="w-full max-w-md px-6 space-y-4 text-center">
                <h3 className="text-white/50 text-[10px] font-black uppercase tracking-[0.3em]">Active Session • {title}</h3>
                <button 
                   onClick={() => cleanup(true)}
                   className="w-full h-12 flex items-center justify-center gap-2 bg-slate-900 border border-white/10 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 text-slate-400 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                >
                   <Power size={14} /> End Session & View Report
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isConnecting && (
         <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-3xl z-[100] flex flex-col items-center justify-center space-y-6">
            <div className="relative">
               <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 animate-pulse" />
               <Cpu className="w-12 h-12 text-blue-400 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <p className="font-black text-white uppercase tracking-[0.3em] text-xs">Establishing Secure Uplink...</p>
         </div>
      )}
    </div>
  );
};

export default VoiceAgent;
