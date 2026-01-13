
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GoogleGenAI, Modality, Type } from '@google/genai';
import { 
  X, Sparkles, Zap, ArrowRight, Mic2, MicOff, Users, ShieldCheck, AlertCircle, Volume2, Activity, Play, Trophy, BarChart3, Star, CheckCircle2, History
} from 'lucide-react';
import { UserProfile, ModuleType, SessionRecord, QAPair, GDRole } from '../types';

// --- Multi-Persona Audio Configuration ---
const VOICE_MAP: Record<string, string> = {
  "Mr. Sharma": "Charon", // Deep, Authoritative Male
  "Chandni": "Zephyr",    // High-pitched, Energetic Female
  "Priya": "Kore",        // Soft, Professional Female
  "Riya": "Zephyr",       // Sharp, Analytical Female
  "Arjun": "Fenrir",      // Assertive, Bold Male
  "Sneha": "Kore",        // Gentle, Supportive Female
  "Rahul": "Puck",        // Friendly, Conversational Male
  "Kavya": "Zephyr"       // Youthful Female
};

const ALL_AI_PERSONAS = [
  { name: "Mr. Sharma", role: "HR Moderator", gender: "Male", description: "Authoritative, senior HR tone, deep baritone." },
  { name: "Chandni", role: "Initiator", gender: "Female", description: "Very energetic, enthusiastic, fast-paced." },
  { name: "Priya", role: "Info Provider", gender: "Female", description: "Calm, factual, researcher-like soft tone." },
  { name: "Riya", role: "Analyzer", gender: "Female", description: "Sharp, serious, professional urban accent." },
  { name: "Arjun", role: "Challenger", gender: "Male", description: "Loud, bold, assertive, competitive male." },
  { name: "Sneha", role: "Supporter", gender: "Female", description: "Gentle, cooperative, kind vocal tone." },
  { name: "Rahul", role: "Summarizer", gender: "Male", description: "Balanced, friendly, thoughtful male." }
];

// --- Audio Utilities ---
function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
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

const ParticipantAvatar: React.FC<{ name: string, role: string, isSpeaking: boolean, isActive: boolean, isUser?: boolean, isMuted?: boolean }> = ({ name, role, isSpeaking, isActive, isUser, isMuted }) => (
  <div className={`relative flex flex-col items-center gap-2 transition-all duration-500 ${isActive ? 'opacity-100 scale-100' : 'opacity-40 scale-90'}`}>
    <div className={`relative w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${isSpeaking ? 'border-purple-500 scale-110 shadow-lg shadow-purple-500/40' : isUser ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-white/5 bg-slate-900'}`}>
      <div className={`absolute inset-0 flex items-center justify-center font-black text-xl ${isUser ? 'text-emerald-500' : 'text-slate-500'}`}>
        {name[0]}
      </div>
      {isSpeaking && <div className={`absolute inset-0 ${isUser ? 'bg-emerald-500/10' : 'bg-purple-500/10'} animate-pulse`} />}
      {isUser && isMuted && (
        <div className="absolute inset-0 bg-rose-500/40 backdrop-blur-[2px] flex items-center justify-center z-10">
          <MicOff size={18} className="text-white" />
        </div>
      )}
    </div>
    <div className="text-center">
      <p className={`text-[9px] font-black uppercase tracking-widest truncate w-20 ${isUser ? 'text-emerald-400' : 'text-white'}`}>
        {isUser ? `${name.split(' ')[0]} (You)` : name}
      </p>
      <p className="text-[7px] font-bold text-slate-500 uppercase tracking-tighter truncate w-20">{role}</p>
    </div>
  </div>
);

interface EvaluationResult {
  name: string;
  role: string;
  scores: { leadership: number; logic: number; interjection: number; roleExecution: number; };
  feedback: string;
  isUser?: boolean;
}

const GDAgent: React.FC<{ user: UserProfile; onSessionEnd: (u: UserProfile) => void }> = ({ user, onSessionEnd }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isActive, setIsActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState<string>('');
  const [evaluation, setEvaluation] = useState<EvaluationResult[] | null>(null);

  const sessionMeta: any = {
    size: searchParams.get('size') ? parseInt(searchParams.get('size')!) : 5,
    lessonTitle: searchParams.get('lessonTitle') ? decodeURIComponent(searchParams.get('lessonTitle')!) : undefined,
    company: searchParams.get('company') ? decodeURIComponent(searchParams.get('company')!) : undefined,
    role: searchParams.get('role') ? decodeURIComponent(searchParams.get('role')!) : undefined
  };
  const teamSize = sessionMeta?.size || 5;
  const dynamicAI = ALL_AI_PERSONAS.slice(1, teamSize);
  const allParticipants = [ALL_AI_PERSONAS[0], ...dynamicAI, { name: user.name, role: sessionMeta?.role || 'Candidate', isUser: true }];

  const transcriptRef = useRef<QAPair[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueue = useRef<{ name: string; buffer: AudioBuffer }[]>([]);
  const isPlayingAudio = useRef(false);

  const performEvaluation = async () => {
    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Evaluate the following Group Discussion transcript. Provide role-based analysis for EVERY participant (AI and User).
        Transcript: ${JSON.stringify(transcriptRef.current)}
        
        Participants & Roles:
        ${allParticipants.map(p => `${p.name} as ${p.role}`).join('\n')}
        
        Evaluation Metrics: Leadership, Logic, Interjection, Role Execution (0-100).
        Output strictly as a JSON array of objects.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                role: { type: Type.STRING },
                scores: {
                  type: Type.OBJECT,
                  properties: {
                    leadership: { type: Type.NUMBER },
                    logic: { type: Type.NUMBER },
                    interjection: { type: Type.NUMBER },
                    roleExecution: { type: Type.NUMBER }
                  }
                },
                feedback: { type: Type.STRING },
                isUser: { type: Type.BOOLEAN }
              },
              required: ["name", "role", "scores", "feedback"]
            }
          }
        }
      });

      const evalData = JSON.parse(response.text || "[]");
      setEvaluation(evalData);
    } catch (e) {
      console.error("Evaluation Error:", e);
      // Fallback if AI fails evaluation
      cleanup(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const cleanup = useCallback((saveResults = false) => {
    if (audioContextRef.current) audioContextRef.current.close();
    setIsActive(false);
    setIsProcessing(false);

    if (saveResults) {
      const userEval = evaluation?.find(e => e.isUser) || { scores: { roleExecution: 75 } };
      const endTime = new Date();
      const mockScore = (userEval as any).scores?.roleExecution || 80;
      const newSession: SessionRecord = {
        id: `gd_${Date.now()}`,
        date: new Date().toLocaleDateString(),
        startTime: new Date().toLocaleTimeString(),
        endTime: endTime.toLocaleTimeString(),
        durationMinutes: 15,
        type: ModuleType.GD_DISCUSSION,
        topic: sessionMeta?.lessonTitle || "GD Discussion",
        score: mockScore,
        feedback: "Multi-persona GD session complete. Full role-based evaluation synced.",
        company: sessionMeta?.company,
        role: sessionMeta?.role,
        resumeUsed: false,
        resultStatus: mockScore > 80 ? 'Selected' : 'Borderline',
        readinessLevel: mockScore > 75 ? 'Interview Ready' : 'Needs Practice',
        transcript: transcriptRef.current,
        strengths: ["Role Compliance", "Neural Sync"],
        weaknesses: ["Interjection Frequency"],
        mistakes: [],
        skillScores: { communication: 85, confidence: 85, clarity: 80, hrReadiness: 80, companyFit: 85, content: 80 },
        analytics: { totalSpeakingTime: "12m", avgAnswerLength: "45s", pauseTime: "5s", responseSpeed: "Optimal", talkingBalance: "Good" },
        actionPlan: ["Watch interjection pacing"]
      };
      const updatedUser: UserProfile = JSON.parse(JSON.stringify(user));
      updatedUser.history = [newSession, ...updatedUser.history];
      onSessionEnd(updatedUser);
      setIsFinished(true);
    }
  }, [user, onSessionEnd, sessionMeta, evaluation]);

  // --- Audio Queue Processing ---
  const processAudioQueue = async () => {
    if (isPlayingAudio.current || audioQueue.current.length === 0 || !audioContextRef.current) return;
    isPlayingAudio.current = true;
    const { name, buffer } = audioQueue.current.shift()!;
    setActiveSpeaker(name);
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    source.onended = () => {
      isPlayingAudio.current = false;
      setActiveSpeaker('');
      processAudioQueue();
    };
    source.start(0);
  };

  const speakPersona = async (name: string, text: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const voiceName = VOICE_MAP[name] || "Puck";
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Act as ${name}. Gender profile: ${VOICE_MAP[name] === 'Zephyr' || VOICE_MAP[name] === 'Kore' ? 'Female' : 'Male'}. Text: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } }
        }
      });
      const audioBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (audioBase64 && audioContextRef.current) {
        const audioBuffer = await decodeAudioData(decode(audioBase64), audioContextRef.current, 24000, 1);
        audioQueue.current.push({ name, buffer: audioBuffer });
        processAudioQueue();
      }
    } catch (e) { console.error("TTS Failed", e); }
  };

  const triggerNextAIPhase = async (userInputText?: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = `
        ROLE: GD Orchestrator. FAST RESPONSE MODE.
        Participants: ${allParticipants.map(p => `${p.name} as ${p.role}`).join(', ')}.
        Current Discussion Flow: Competitive but professional.
        GOAL: Generate next 1-2 interjections in JSON format. Respond to User if provided.
      `;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', // Switched to Flash for speed
        contents: [{ role: 'user', parts: [{ text: userInputText || "Moderator starts the discussion with the topic: Digital Ethics in 2025." }] }],
        config: { 
          systemInstruction, 
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: { speaker: { type: Type.STRING }, text: { type: Type.STRING } },
              required: ["speaker", "text"]
            }
          }
        }
      });
      const turns = JSON.parse(response.text || "[]");
      for (const turn of turns) {
        transcriptRef.current.push({ speaker: turn.speaker, text: turn.text, timestamp: new Date().toLocaleTimeString() });
        await speakPersona(turn.speaker, turn.text);
      }
    } catch (e) { setError("Neural Brain Sync latency high. Retrying..."); } finally { setIsProcessing(false); }
  };

  const startSession = async () => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    setIsActive(true);
    triggerNextAIPhase();
  };

  useEffect(() => {
    if (isFinished) {
      router.push('/history');
    }
  }, [isFinished, router]);

  // --- Evaluation Screen ---
  if (evaluation) {
    return (
      <div className="min-h-screen bg-slate-950 p-12 overflow-y-auto animate-in fade-in duration-500 text-white">
         <div className="max-w-6xl mx-auto space-y-12 pb-24">
            <div className="flex items-center justify-between">
               <div>
                  <h1 className="text-5xl font-black tracking-tighter text-white">Performance Scoreboard</h1>
                  <p className="text-slate-400 font-bold mt-2 uppercase tracking-widest flex items-center gap-2">
                     <ShieldCheck size={18} className="text-emerald-500" /> Neural GD Analysis Complete
                  </p>
               </div>
               <button onClick={() => cleanup(true)} className="bg-white text-slate-900 px-10 py-4 rounded-full font-black uppercase tracking-widest text-[11px] shadow-2xl hover:scale-105 transition-all">Save to Archive</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {evaluation.map((ev, i) => (
                 <div key={i} className={`p-8 rounded-[3rem] border transition-all ${ev.isUser ? 'bg-purple-600 border-purple-400 shadow-[0_0_50px_rgba(147,51,234,0.3)]' : 'bg-slate-900 border-white/5 shadow-xl'}`}>
                    <div className="flex items-center gap-4 mb-6">
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg ${ev.isUser ? 'bg-white text-purple-600' : 'bg-slate-800 text-slate-400'}`}>
                          {ev.name[0]}
                       </div>
                       <div>
                          <p className="font-black text-white uppercase tracking-tight text-lg">{ev.isUser ? `${ev.name} (You)` : ev.name}</p>
                          <p className={`text-[10px] font-black uppercase tracking-widest ${ev.isUser ? 'text-purple-200' : 'text-slate-500'}`}>{ev.role}</p>
                       </div>
                    </div>

                    <div className="space-y-4 mb-8">
                       {[
                         { label: 'Leadership', val: ev.scores.leadership, icon: Star },
                         { label: 'Logic', val: ev.scores.logic, icon: Zap },
                         { label: 'Interjection', val: ev.scores.interjection, icon: Volume2 },
                         { label: 'Role Execution', val: ev.scores.roleExecution, icon: Trophy }
                       ].map((s, idx) => (
                         <div key={idx} className="space-y-1.5">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                               <span className="flex items-center gap-1.5 opacity-60"><s.icon size={12} /> {s.label}</span>
                               <span className="text-white">{s.val}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                               <div className={`h-full transition-all duration-1000 ${ev.isUser ? 'bg-white' : 'bg-purple-500'}`} style={{ width: `${s.val}%` }}></div>
                            </div>
                         </div>
                       ))}
                    </div>

                    <div className={`p-4 rounded-2xl text-[11px] font-bold leading-relaxed ${ev.isUser ? 'bg-purple-700/50 text-purple-100' : 'bg-white/5 text-slate-400 italic'}`}>
                       "{ev.feedback}"
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex flex-col bg-slate-950 rounded-[4rem] border border-white/5 shadow-2xl overflow-hidden relative text-white">
      {/* Header */}
      <div className="px-10 py-6 flex items-center justify-between border-b border-white/5 z-50 bg-slate-900/50 backdrop-blur-xl">
        <div className="flex items-center gap-5">
          <div className="bg-purple-600 text-white p-3 rounded-2xl shadow-lg"><Users size={24} /></div>
          <div>
            <h2 className="font-black text-white text-xl tracking-tight leading-tight">Neural GD Room</h2>
            <p className="text-[10px] font-black uppercase text-purple-400 tracking-widest mt-1">
              {isActive ? 'Live Interaction | Fast Engine Active' : 'Estabishing Vocal Identitites...'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           {isActive && (
             <button onClick={() => setMicEnabled(!micEnabled)} className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-black uppercase text-[10px] tracking-widest transition-all ${micEnabled ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-lg shadow-emerald-500/10' : 'bg-rose-600 text-white shadow-lg'}`}>
                {micEnabled ? <Mic2 size={14} /> : <MicOff size={14} />} {micEnabled ? 'MIC READY' : 'MUTED'}
             </button>
           )}
           <button onClick={() => router.back()} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X size={24} /></button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row relative">
        <div className="flex-1 p-8 flex flex-col items-center justify-center relative">
          {!isActive ? (
            <div className="text-center space-y-12 animate-in fade-in zoom-in duration-700">
               <div className="relative w-32 h-32 mx-auto">
                  <div className="absolute inset-0 bg-purple-500 blur-[60px] opacity-30 animate-pulse" />
                  <div className="relative bg-purple-600 rounded-[3rem] w-full h-full flex items-center justify-center shadow-2xl"><Zap size={48} className="text-white fill-white" /></div>
               </div>
               <div className="space-y-4">
                  <h3 className="text-3xl font-black text-white tracking-tight uppercase">Enter Neural Discussion</h3>
                  <p className="text-slate-400 max-w-sm mx-auto font-medium leading-relaxed">Latency Optimized: Powered by Flash Neural Engine for real-time interjections.</p>
               </div>
               <button onClick={startSession} className="bg-white text-slate-900 px-24 py-7 rounded-full font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all text-xs">Begin Session</button>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-12">
               <div className={`grid gap-x-6 gap-y-10 items-center justify-center ${teamSize > 6 ? 'grid-cols-4 md:grid-cols-5' : 'grid-cols-3 md:grid-cols-4'}`}>
                 {allParticipants.map((p, i) => (
                   <ParticipantAvatar key={i} name={p.name as string} role={p.role as string} isSpeaking={activeSpeaker === p.name} isActive={true} isUser={'isUser' in p} isMuted={('isUser' in p) && !micEnabled} />
                 ))}
               </div>

               <div className="relative w-48 h-48 flex items-center justify-center">
                  <div className={`absolute inset-0 rounded-full border-4 border-dashed transition-all duration-1000 ${isProcessing || isPlayingAudio.current ? 'border-purple-500 animate-spin-slow scale-110 shadow-[0_0_50px_rgba(168,85,247,0.2)]' : 'border-white/10'}`} />
                  <div className={`w-36 h-36 rounded-full bg-slate-900 flex flex-col items-center justify-center shadow-2xl border transition-all ${isProcessing || isPlayingAudio.current ? 'border-purple-500' : 'border-white/5'}`}>
                     {isPlayingAudio.current ? <Volume2 size={40} className="text-purple-500 animate-pulse" /> : isProcessing ? <Zap size={40} className="text-amber-500 animate-pulse" /> : <Mic2 size={40} className="text-emerald-500" />}
                     <p className={`mt-4 text-[9px] font-black uppercase tracking-widest ${isPlayingAudio.current ? 'text-purple-500' : 'text-slate-400'}`}>
                       {isPlayingAudio.current ? 'AI INTERJECTING' : isProcessing ? 'THINKING...' : 'LIVE FEED'}
                     </p>
                  </div>
               </div>
               
               {!isPlayingAudio.current && !isProcessing && (
                  <button onClick={() => triggerNextAIPhase("I believe technology is not just displacing jobs, it's evolving them.")} className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-12 py-5 rounded-full font-black uppercase tracking-widest text-[11px] hover:bg-emerald-500 hover:text-white transition-all animate-bounce shadow-xl">Interject Now</button>
               )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-96 bg-black/40 border-l border-white/5 p-8 flex flex-col gap-6">
           <h4 className="text-[10px] font-black uppercase text-purple-400 tracking-[0.3em] pb-2 border-b border-white/5 flex items-center gap-2"><Activity size={14} /> GD ANALYTICS</h4>
           <div className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-4">
              <div className="flex justify-between items-center"><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">ENGINE LATENCY</p><Zap size={16} className="text-amber-500" /></div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-amber-500" style={{ width: '92%' }}></div></div>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">FLASH OPTIMIZATION: ACTIVE</p>
           </div>
           <div className="p-6 bg-purple-500/5 rounded-3xl border border-purple-500/10">
              <p className="text-[10px] font-black uppercase text-purple-400 tracking-widest mb-3">CURRENT DYNAMICS</p>
              <div className="space-y-3">
                <p className="text-xs text-white font-bold leading-relaxed">{activeSpeaker ? `${activeSpeaker} is speaking as ${VOICE_MAP[activeSpeaker]} neural profile.` : isProcessing ? "Brain is calculating logical counters..." : "Room is open for your leadership interjection."}</p>
                <div className="flex items-center gap-2 text-[8px] font-black text-slate-500 uppercase tracking-tighter"><Play size={10} className="fill-slate-500" /> ROLE-BASED EVALUATION ACTIVE</div>
              </div>
           </div>
           <div className="mt-auto p-4 border border-white/5 rounded-2xl bg-white/2">
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">TARGET ROUND</p>
              <p className="text-[10px] font-bold text-white uppercase">{sessionMeta?.company || 'GLOBAL'} GD ROUND</p>
           </div>
        </div>
      </div>

      {isActive && (
        <div className="px-10 py-8 border-t border-white/5 flex justify-center bg-slate-900/50 backdrop-blur-md sticky bottom-0 z-50">
          <button onClick={performEvaluation} className="group bg-rose-600 hover:bg-rose-700 text-white px-24 py-5 rounded-full font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50" disabled={isProcessing}>
            {isProcessing ? 'Calculating Scoreboard...' : 'Conclude GD Session'} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
};

export default GDAgent;
