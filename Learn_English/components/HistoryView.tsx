
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar, History, ChevronRight, FileText, CheckCircle2, X, MessageSquare, Mic2, ThumbsUp, TrendingUp, ShieldCheck, XCircle, AlertCircle, ArrowRight, Clock, Zap, Users, User, Building, Filter
} from 'lucide-react';
import { UserProfile, SessionRecord, ModuleType, QAPair } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const getModuleConfig = (type?: string) => {
  const configs: Record<string, { bg: string, iconColor: string }> = {
    [ModuleType.ENGLISH_LEARNING]: { bg: '/images/EnglishLearning.jpg', iconColor: 'bg-indigo-500' },
    [ModuleType.CONVERSATION_PRACTICE]: { bg: '/images/DailyConversation.jpg', iconColor: 'bg-sky-500' },
    [ModuleType.HR_INTERVIEW]: { bg: '/images/HRInterviewCoach.jpg', iconColor: 'bg-pink-500' },
    [ModuleType.TECH_INTERVIEW]: { bg: '/images/TechnicalMastery.jpg', iconColor: 'bg-emerald-500' },
    [ModuleType.COMPANY_WISE_HR]: { bg: '/images/CompanyTracks.jpg', iconColor: 'bg-amber-500' },
    [ModuleType.GD_DISCUSSION]: { bg: '/images/GDAgent.jpg', iconColor: 'bg-purple-500' },
  };
  return configs[type || ''] || { bg: '/images/General.jpg', iconColor: 'bg-slate-600' };
};
const SessionDetailModal = ({ session, user, onClose }: { session: SessionRecord, user: UserProfile, onClose: () => void }) => {
  const displayScore = (session as any).score || 0;
  const displayStatus = displayScore === 0 ? 'Incomplete' : displayScore >= 71 ? 'Excellent' : displayScore >= 31 ? 'Good' : 'Needs Practice';
  
  const handleDownloadPDF = async () => {
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.id })
      });

      if (response.ok) {
        const html = await response.text();
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(html);
          printWindow.document.close();
          printWindow.onload = () => {
            setTimeout(() => {
              printWindow.print();
            }, 500);
          };
        }
      } else {
        console.error('Failed to generate PDF');
      }
    } catch (error) {
      console.error('PDF download error:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-950/90 backdrop-blur-2xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-slate-900 w-full max-w-4xl max-h-[85vh] rounded-[2.5rem] shadow-[0_0_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col border border-white/10"
      >
        <div className="px-8 py-6 bg-gradient-to-r from-slate-900/50 to-slate-800/50 border-b border-white/5 flex items-center justify-between sticky top-0 z-10 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${getModuleConfig(session.type).iconColor} text-white shadow-xl`}>
              <History size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight leading-none mb-1.5">{session.company || 'General'} Session</h2>
              <div className="flex items-center gap-2.5 text-slate-400 font-bold text-[10px] uppercase tracking-[0.15em]">
                  <Calendar size={12} className="text-purple-400" /> 
                  <span className="opacity-80">{session.date}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-700" />
                  <span className="text-purple-400/80">{session.role || 'Career Audit'}</span>
              </div>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose} 
            className="p-3 hover:bg-white/10 rounded-full bg-white/5 border border-white/10 transition-all"
          >
            <X size={20} className="text-white" />
          </motion.button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-none custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group relative bg-slate-800/20 p-6 rounded-[2rem] border border-white/5 text-center overflow-hidden transition-all hover:bg-slate-800/50">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="relative w-16 h-16 mx-auto mb-3">
                  <svg className="w-16 h-16 transform -rotate-90 drop-shadow-[0_0_10px_rgba(96,165,250,0.2)]" viewBox="0 0 36 36">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="100, 100" className="text-slate-700" />
                    <motion.path 
                      initial={{ strokeDasharray: "0, 100" }}
                      animate={{ strokeDasharray: `${displayScore}, 100` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-blue-400" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-black text-sm">{displayScore}%</span>
                  </div>
                </div>
                <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[9px]">Proficiency</p>
              </div>
            </div>

            <div className="group relative bg-slate-800/20 p-6 rounded-[2rem] border border-white/5 text-center flex flex-col justify-center transition-all hover:bg-slate-800/50">
               <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="relative z-10">
                 <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] shadow-xl ${displayScore >= 71 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : displayScore >= 31 ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'}`}>
                  {displayStatus}
                </div>
                <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[9px] mt-4">Status</p>
               </div>
            </div>

            <div className="group relative bg-slate-800/20 p-6 rounded-[2rem] border border-white/5 transition-all hover:bg-slate-800/50">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 grid grid-cols-2 h-full gap-3">
                <div className="bg-slate-900/50 rounded-xl p-3 flex flex-col items-center justify-center border border-white/5">
                  <Clock size={16} className="text-purple-400 mb-1" />
                  <p className="text-white font-black text-sm">{session.durationMinutes}m</p>
                  <p className="text-slate-500 text-[8px] font-black uppercase tracking-widest">Time</p>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-3 flex flex-col items-center justify-center border border-white/5">
                  <MessageSquare size={16} className="text-blue-400 mb-1" />
                  <p className="text-white font-black text-sm">{session.transcript?.length || 0}</p>
                  <p className="text-slate-500 text-[8px] font-black uppercase tracking-widest">Replies</p>
                </div>
              </div>
            </div>
          </div>

          <section className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
               <h3 className="text-xl font-black text-white tracking-tight">Audit Log</h3>
            </div>
            <div className="space-y-6 bg-slate-800/10 p-6 rounded-[2rem] border border-white/5">
              {session.transcript?.map((turn, idx) => (
                <div key={idx} className={`flex ${turn.speaker.includes('You') ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] ${turn.speaker.includes('You') ? 'order-2' : 'order-1'}`}>
                    <div className={`p-4 rounded-2xl text-sm font-bold leading-relaxed shadow-lg ${turn.speaker.includes('You') ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30 rounded-br-none' : 'bg-slate-800 text-slate-300 border border-white/5 rounded-bl-none'}`}>
                      {turn.text}
                    </div>
                    {turn.speaker.includes('You') && turn.ideal && (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mt-3 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-[1.25rem] text-[13px] font-semibold text-emerald-300/90"
                      >
                        <div className="flex items-center gap-2 mb-1.5 text-emerald-400/80">
                          <ThumbsUp size={12} />
                          <span className="text-[9px] uppercase font-black tracking-widest text-emerald-500">AI Feed</span>
                        </div>
                        {turn.ideal}
                      </motion.div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="px-8 py-6 bg-slate-950/50 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 backdrop-blur-3xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <ShieldCheck className="text-emerald-500" size={16} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.15em] text-white">Archives Verified</p>
                <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">SHA-256 Protocol</p>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
               <button onClick={onClose} className="flex-1 md:flex-none px-6 font-bold uppercase text-[10px] tracking-widest text-slate-500 hover:text-white transition-colors">Discard</button>
               <button onClick={handleDownloadPDF} className="flex-1 md:flex-none bg-white text-black hover:bg-slate-200 px-8 py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-2xl transition-all active:scale-95">Download report</button>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

const HistoryView: React.FC<{ user: UserProfile }> = ({ user }) => {
  const router = useRouter();
  const [selectedSession, setSelectedSession] = useState<SessionRecord | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ company: '', date: '', score: '' });

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch('/api/sessions');
        if (response.ok) {
          const data = await response.json();
          setSessions(data);
        }
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const fetchSessionDetails = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedSession(data);
      }
    } catch (error) {
      console.error('Failed to fetch session details:', error);
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesCompany = !filters.company || session.targetCompany?.toLowerCase().includes(filters.company.toLowerCase());
    const matchesDate = !filters.date || new Date(session.createdAt).toLocaleDateString().includes(filters.date);
    const matchesScore = !filters.score || Math.round(((session as any).aggregateScore || 0) * 100) >= parseInt(filters.score) || filters.score === '';
    return matchesCompany && matchesDate && matchesScore;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Accessing Vault...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <AnimatePresence>
        {selectedSession && (
          <SessionDetailModal 
            session={selectedSession} 
            user={user} 
            onClose={() => setSelectedSession(null)} 
          />
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20"
        >
          <History size={12} className="text-purple-400" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-purple-400">Vault</span>
        </motion.div>
        
        <div className="space-y-2">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none"
          >
            Archives<span className="text-purple-500">.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-sm md:text-base font-medium max-w-xl leading-relaxed"
          >
            Your journey through professional excellence.
          </motion.p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap gap-3 items-center bg-slate-900/40 backdrop-blur-3xl p-5 rounded-[2rem] border border-white/5 shadow-2xl"
      >
        <div className="flex items-center gap-2 text-white mr-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
            <Filter size={16} />
          </div>
          <span className="font-black uppercase tracking-widest text-[10px]">Filter</span>
        </div>
        <input
          type="text"
          placeholder="Search Company..."
          value={filters.company}
          onChange={(e) => setFilters({ ...filters, company: e.target.value })}
          className="flex-1 min-w-[150px] px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm font-bold"
        />
        <input
          type="text"
          placeholder="Date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          className="w-full md:w-32 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm font-bold"
        />
        <input
          type="number"
          placeholder="Min %"
          value={filters.score}
          onChange={(e) => setFilters({ ...filters, score: e.target.value })}
          className="w-full md:w-24 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm font-bold"
        />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSessions.map((record, index) => {
          const score = Math.round((record.aggregateScore || 0) * 100);
          const isExcellent = score >= 71;
          const config = getModuleConfig(record.type);
          
          return (
            <motion.div 
              key={record.sessionId} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => fetchSessionDetails(record.sessionId)} 
              className="group relative h-[320px] flex flex-col bg-slate-900/40 backdrop-blur-3xl border border-white/10 p-6 rounded-[2.5rem] shadow-2xl hover:shadow-purple-500/10 transition-all cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 z-0">
                <img 
                  src={config.bg} 
                  alt="" 
                  className="w-full h-full object-cover opacity-15 group-hover:opacity-50 group-hover:scale-110 transition-all duration-1000 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent" />
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-auto">
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-[1rem] bg-gradient-to-br ${config.iconColor} flex items-center justify-center text-white shadow-xl`}>
                      <Building size={20} />
                    </div>
                  </div>
                  
                  <div className="relative w-14 h-14">
                    <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                      <motion.circle 
                        cx="18" cy="18" r="16" fill="transparent" 
                        stroke={isExcellent ? "#10b981" : "#f59e0b"} 
                        strokeWidth="3"
                        strokeDasharray="100"
                        strokeDashoffset={100 - score}
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: 100 }}
                        animate={{ strokeDashoffset: 100 - score }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-black text-[10px]">{score}%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 mb-2">
                  <h3 className="text-2xl font-black text-white leading-tight tracking-tight group-hover:text-purple-400 transition-colors mb-1">
                    {record.targetCompany || 'General'}
                  </h3>
                  <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                    {record.role || 'Career Audit'}
                  </p>
                </div>

                <div className="flex flex-col gap-4 pt-4 border-t border-white/5 mt-auto">
                  <div className="flex items-center gap-4 text-slate-400 text-[9px] font-black uppercase tracking-[0.15em]">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-purple-500" />
                      {new Date(record.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className="text-blue-500" />
                      {record.durationMinutes || 0}m
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] ${isExcellent ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                      {isExcellent ? 'Exceeded' : 'Need Practice'}
                    </span>
                    <motion.div 
                      whileHover={{ x: 3 }}
                      className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white transition-all shadow-xl"
                    >
                      <ChevronRight size={14} />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryView;
