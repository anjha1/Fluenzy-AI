
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { GoogleGenAI, Modality } from '@google/genai';
import { 
  X, 
  Sparkles,
  CheckCircle2,
  Zap,
  ArrowRight,
  Mic2
} from 'lucide-react';
import { UserProfile, ModuleType, SessionRecord, QAPair, InterviewQA } from '../types';
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
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mouthOpen, setMouthOpen] = useState(0);
  const requestRef = useRef<number>(null);

  const avatarImage = useMemo(() => {
    if (type === ModuleType.HR_INTERVIEW || type === ModuleType.COMPANY_WISE_HR) {
      return "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"; 
    }
    if (type === ModuleType.TECH_INTERVIEW) {
      return "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800"; 
    }
    return "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=800"; 
  }, [type]);

  useEffect(() => {
    const animate = (time: number) => {
      setTilt({ x: Math.sin(time / 1500) * 2, y: Math.cos(time / 2000) * 1 + (isListening ? 3 : 0) });
      setMouthOpen(isSpeaking ? Math.abs(Math.sin(time / 80)) * 15 : 0);
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isSpeaking, isListening]);

  return (
    <div className="relative w-72 h-72 md:w-96 md:h-96 mx-auto perspective-1000">
      <div 
        className="w-full h-full relative transition-transform duration-700 ease-out"
        style={{ transform: `rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg)`, transformStyle: 'preserve-3d' }}
      >
        <div className={`absolute -inset-10 rounded-full blur-[80px] opacity-20 transition-all duration-1000 ${
          isSpeaking ? 'bg-blue-400 scale-110' : isListening ? 'bg-emerald-400 scale-105' : 'bg-slate-200'
        }`} />
        <div className={`relative w-full h-full rounded-[5rem] overflow-hidden border-8 bg-slate-900 shadow-2xl transition-all duration-500 ${
          isSpeaking ? 'border-blue-500/50' : isListening ? 'border-emerald-500/50' : 'border-white/10'
        }`}>
          <img src={avatarImage} alt="Avatar" className="w-full h-full object-cover" />
          <div className="absolute top-[68%] left-1/2 -translate-x-1/2 w-16 h-2 bg-slate-900/60 rounded-full blur-[2px]"
               style={{ height: `${mouthOpen}px`, opacity: isSpeaking ? 0.8 : 0 }} />
        </div>
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

  const sessionMeta: any = {
    lessonId: searchParams.get('lessonId'),
    lessonTitle: searchParams.get('lessonTitle') ? decodeURIComponent(searchParams.get('lessonTitle')!) : undefined,
    company: searchParams.get('company') ? decodeURIComponent(searchParams.get('company')!) : undefined,
    companyLogo: searchParams.get('companyLogo') ? decodeURIComponent(searchParams.get('companyLogo')!) : undefined,
    role: searchParams.get('role') ? decodeURIComponent(searchParams.get('role')!) : undefined,
    experience: searchParams.get('experience') ? decodeURIComponent(searchParams.get('experience')!) : undefined,
    difficulty: searchParams.get('difficulty') ? decodeURIComponent(searchParams.get('difficulty')!) : undefined,
    roundType: searchParams.get('roundType') ? decodeURIComponent(searchParams.get('roundType')!) : undefined,
    resumeText: searchParams.get('resumeText') ? decodeURIComponent(searchParams.get('resumeText')!) : undefined,
    isCompanyWise: searchParams.get('isCompanyWise') === 'true'
  };
  const currentQA = useRef({ question: '', answer: '' });
  const transcriptHistory = useRef<InterviewQA[]>([]);
  const startTimeRef = useRef(new Date());

  const topic = useMemo(() => {
    return sessionMeta?.isCompanyWise 
      ? `${sessionMeta.company} - ${sessionMeta.role} (${sessionMeta.roundType})` 
      : (sessionMeta?.lessonTitle || 'General Session');
  }, [sessionMeta]);

  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const cleanup = useCallback((saveResults = false) => {
    if (sessionRef.current) { sessionRef.current.close(); sessionRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
    sourcesRef.current.clear();
    setIsActive(false);
    setIsConnecting(false);
    setIsAiSpeaking(false);

    if (saveResults) {
      const endTime = new Date();
      const mockScore = Math.floor(Math.random() * 25) + 70;

      const isEnglishLearning = type === ModuleType.ENGLISH_LEARNING;

      const transcript: QAPair[] = [];
      transcriptHistory.current.forEach(qa => {
        transcript.push({
          speaker: isEnglishLearning ? 'English Tutor' : 'Interviewer',
          text: qa.question,
          timestamp: qa.timestamp
        });
        transcript.push({
          speaker: isEnglishLearning ? 'Student (You)' : 'Candidate (You)',
          text: qa.answer,
          timestamp: qa.timestamp
        });
      });

      const newSession: SessionRecord = {
        id: `s_${Date.now()}`,
        date: new Date().toLocaleDateString(),
        startTime: startTimeRef.current.toLocaleTimeString(),
        endTime: endTime.toLocaleTimeString(),
        durationMinutes: Math.round((endTime.getTime() - startTimeRef.current.getTime()) / 60000) || 5,
        type: (type as ModuleType) || ModuleType.ENGLISH_LEARNING,
        topic: topic,
        score: mockScore,
        feedback: isEnglishLearning
          ? `English lesson completed: ${sessionMeta?.lessonTitle || 'General Practice'}. Great progress in speaking skills!`
          : `Audit complete for ${sessionMeta?.company || 'MNC'}. Strong reasoning alignment.`,
        company: isEnglishLearning ? undefined : sessionMeta?.company,
        role: isEnglishLearning ? undefined : sessionMeta?.role,
        resumeUsed: isEnglishLearning ? false : !!sessionMeta?.resumeText,
        resultStatus: mockScore > 80 ? 'Selected' : 'Borderline',
        readinessLevel: isEnglishLearning
          ? (mockScore > 80 ? 'Interview Ready' : 'Needs Practice')
          : (mockScore > 80 ? 'Interview Ready' : 'Needs Practice'),
        transcript: transcript,
        strengths: isEnglishLearning
          ? ["Pronunciation Improvement", "Grammar Accuracy", "Fluency"]
          : ["Persona Alignment", "Tone Consistency"],
        weaknesses: isEnglishLearning
          ? ["Vocabulary Expansion Needed"]
          : ["Filler word usage"],
        mistakes: [],
        skillScores: isEnglishLearning
          ? {
              communication: mockScore,
              confidence: Math.floor(Math.random() * 20) + 70,
              clarity: Math.floor(Math.random() * 20) + 70,
              hrReadiness: 0, // Not applicable
              companyFit: 0, // Not applicable
              content: Math.floor(Math.random() * 20) + 70
            }
          : { communication: 80, confidence: 85, clarity: 75, hrReadiness: 82, companyFit: 88, content: 90 },
        analytics: { totalSpeakingTime: "8m", avgAnswerLength: "45s", pauseTime: "10s", responseSpeed: "Optimal", talkingBalance: "Good" },
        actionPlan: isEnglishLearning
          ? ["Practice more sentences", "Review grammar rules", "Listen to native speakers"]
          : ["Review resume deep-dives"]
      };

      const updatedUser: UserProfile = JSON.parse(JSON.stringify(user));
      updatedUser.history = [newSession, ...updatedUser.history];
      onSessionEnd(updatedUser);
      setIsFinished(true);
    }
  }, [type, user, onSessionEnd, sessionMeta, topic]);

  const startSession = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      // Create a new instance with a named parameter for the API key.
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      inputAudioContextRef.current = new AudioContext({ sampleRate: 16000 });
      outputAudioContextRef.current = new AudioContext({ sampleRate: 24000 });
      await inputAudioContextRef.current.resume();
      await outputAudioContextRef.current.resume();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const isEnglishLearning = type === ModuleType.ENGLISH_LEARNING;
      const isHRInterview = type === ModuleType.HR_INTERVIEW;
      const instruction = `
        ${SYSTEM_INSTRUCTIONS[type as ModuleType] || 'Senior Interview Coach.'}
        ${isEnglishLearning
          ? `CONTEXT: Lesson Topic: ${sessionMeta?.lessonTitle || 'General English Practice'}, User Proficiency Level: ${user.proficiency}. Focus on teaching English skills, not conducting interviews.`
          : isHRInterview
          ? `CONTEXT: HR Lesson Topic: ${sessionMeta?.lessonTitle || 'General HR Interview Practice'}. Focus on HR interview coaching, behavioral questions, and professional communication skills. Do not ask technical or coding questions.`
          : `CONTEXT: Role: ${sessionMeta?.role || user.jobRole}, Company: ${sessionMeta?.company || 'Top MNC'}, Resume: ${sessionMeta?.resumeText || 'General Profile'}.
        Use your thinking budget to analyze resume projects and company requirements before every question.`
        }
      `;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: instruction,
          outputAudioTranscription: {},
          inputAudioTranscription: {},
          thinkingConfig: { thinkingBudget: 24576 } // max budget for 2.5 Flash
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
            if (m.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data) {
              const buf = await decodeAudioData(decode(m.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data), outputAudioContextRef.current!, 24000, 1);
              const src = outputAudioContextRef.current!.createBufferSource();
              src.buffer = buf; src.connect(outputAudioContextRef.current!.destination);
              setIsAiSpeaking(true);
              src.onended = () => { sourcesRef.current.delete(src); if (sourcesRef.current.size === 0) setIsAiSpeaking(false); };
              src.start(Math.max(nextStartTimeRef.current, outputAudioContextRef.current!.currentTime));
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current!.currentTime) + buf.duration;
              sourcesRef.current.add(src);
            }
          },
          onerror: (e) => { console.error(e); setError("Handshake failure. Please check microphone."); cleanup(false); },
          onclose: () => cleanup(false),
        },
      });
      sessionRef.current = await sessionPromise;
    } catch (err) { setIsConnecting(false); setError("Microphone access denied."); }
  };

  useEffect(() => {
    if (isFinished) {
      router.push('/train');
    }
  }, [isFinished, router]);

  return (
    <div className="min-h-[85vh] flex flex-col bg-slate-50 rounded-[4rem] border border-slate-200 shadow-2xl overflow-hidden relative">
      <div className="bg-white/80 backdrop-blur-md px-10 py-8 flex items-center justify-between border-b border-slate-100 z-50">
        <div className="flex items-center gap-5">
          <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-lg"><Sparkles size={24} /></div>
          <div><h2 className="font-black text-slate-900 text-xl tracking-tight leading-tight">{topic}</h2></div>
        </div>
        <button onClick={() => router.push('/train')} className="p-3 hover:bg-slate-100 rounded-2xl transition-all"><X size={24} /></button>
      </div>
      
      <div className="flex-1 p-10 flex flex-col items-center justify-center relative">
        {error && <div className="absolute top-10 bg-rose-50 text-rose-600 px-6 py-3 rounded-full font-bold flex items-center gap-2 border border-rose-100 z-[100]"><Zap size={16} /> {error}</div>}
        {!isActive && !isConnecting ? (
          <div className="text-center space-y-12 animate-in fade-in duration-700">
            <HumanAvatar isSpeaking={false} isListening={false} type={type} />
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-slate-900">Advanced Reasoning Core Engaged</h3>
              <p className="text-slate-500 max-w-sm mx-auto font-medium">AceVoice is analyzing your resume for {sessionMeta?.company || 'the interview'}.</p>
            </div>
            <button onClick={startSession} className="bg-slate-900 text-white px-20 py-7 rounded-full font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all">Start Session</button>
          </div>
        ) : (
          <div className="w-full flex flex-col lg:flex-row gap-12 items-center justify-center animate-in zoom-in-95 duration-500">
            <HumanAvatar isSpeaking={isAiSpeaking} isListening={!isAiSpeaking} type={type} />
            <div className="w-full max-w-xl space-y-8">
               <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl border border-slate-100 relative overflow-hidden">
                  <div className={`absolute top-0 left-0 bottom-0 w-2 transition-all ${isAiSpeaking ? 'bg-blue-600' : 'bg-emerald-500 animate-pulse'}`}></div>
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] pb-2 border-b">Real-Time Synthesis</h4>
                  <div className="mt-8 flex items-center gap-6">
                    <div className={`p-5 rounded-[1.5rem] ${isAiSpeaking ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600 animate-bounce'}`}>
                      <Mic2 size={32} />
                    </div>
                    <div>
                      <p className="text-xl font-black text-slate-900">{isAiSpeaking ? 'AI is speaking...' : 'Listening...'}</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>

      {isActive && (
        <div className="px-10 py-10 border-t flex justify-center bg-white/50 backdrop-blur-md sticky bottom-0">
          <button onClick={() => cleanup(true)} className="group bg-rose-600 hover:bg-rose-700 text-white px-20 py-6 rounded-full font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl transition-all flex items-center gap-3">
            End & Save Report <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {isConnecting && <div className="absolute inset-0 bg-white/95 z-[100] flex flex-col items-center justify-center space-y-8">
        <div className="w-20 h-20 border-[6px] border-slate-100 border-t-blue-600 rounded-full animate-spin" />
        <p className="font-black text-slate-900 uppercase tracking-[0.4em] text-xs">Accessing Neural Core...</p>
      </div>}
    </div>
  );
};

export default VoiceAgent;
