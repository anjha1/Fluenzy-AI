
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar, History, ChevronRight, FileText, CheckCircle2, X, MessageSquare, Mic2, ThumbsUp, TrendingUp, ShieldCheck, XCircle, AlertCircle, ArrowRight, Clock, Zap, Users, User, Building, Filter
} from 'lucide-react';
import { UserProfile, SessionRecord, ModuleType, QAPair } from '../types';

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
          // Wait for content to load then print
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-900/80 backdrop-blur-lg animate-in fade-in duration-300">
      <div className="bg-slate-900 w-full max-w-6xl max-h-[95vh] rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 border border-white/10">
        <div className="px-12 py-10 bg-slate-800/50 border-b border-white/10 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-6">
            <div className="p-4 rounded-3xl bg-blue-600 text-white shadow-xl"><Building size={28} /></div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">{session.company || 'General'} - {session.role || 'N/A'}</h2>
              <div className="flex items-center gap-3 mt-1 text-slate-400 font-bold text-sm uppercase tracking-widest">
                  <Calendar size={14} /> {session.date}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-white/10 rounded-full bg-white/5 border border-white/10 shadow-sm transition-all"><X size={24} className="text-white" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-12 space-y-12 scrollbar-hide">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/50 p-6 rounded-3xl border border-white/10 text-center">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="100, 100" className="text-slate-600" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${displayScore}, 100`} className="text-blue-400" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-black text-lg">{displayScore}%</span>
                </div>
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Overall Score</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-3xl border border-white/10 text-center">
              <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-black text-sm uppercase tracking-widest ${displayScore >= 80 ? 'bg-green-500/20 text-green-300' : displayScore >= 60 ? 'bg-blue-500/20 text-blue-300' : displayScore === 0 ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                {displayStatus}
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">Status</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-3xl border border-white/10 text-center">
              <div className="flex justify-center gap-4">
                <div className="text-center">
                  <Clock size={20} className="text-slate-400 mx-auto mb-1" />
                  <p className="text-white font-black">{session.durationMinutes}m</p>
                  <p className="text-slate-400 text-xs uppercase tracking-widest">Duration</p>
                </div>
                <div className="text-center">
                  <MessageSquare size={20} className="text-slate-400 mx-auto mb-1" />
                  <p className="text-white font-black">{session.transcript.length}</p>
                  <p className="text-slate-400 text-xs uppercase tracking-widest">Questions</p>
                </div>
              </div>
            </div>
          </div>

          <section className="space-y-10">
            <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
               <div className="p-2 bg-blue-600 text-white rounded-xl"><MessageSquare size={24}/></div>
                Conversation Log
            </h3>
            <div className="space-y-6">
              {session.transcript.map((turn, idx) => (
                <div key={idx} className={`flex ${turn.speaker.includes('You') ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-md ${turn.speaker.includes('You') ? 'order-2' : 'order-1'}`}>
                    <div className={`p-4 rounded-2xl font-medium leading-relaxed ${turn.speaker.includes('You') ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-200 rounded-bl-none'}`}>
                      "{turn.text}"
                    </div>
                    {turn.speaker.includes('You') && turn.ideal && (
                      <div className="mt-2 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-xl text-yellow-200 text-sm">
                        <strong>Suggested Improvement:</strong> {turn.ideal}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="px-12 py-10 bg-slate-800/50 border-t border-white/10 flex justify-between items-center z-20">
            <div className="flex items-center gap-3"><ShieldCheck className="text-emerald-400" /><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Encrypted Career Archive</p></div>
            <div className="flex gap-4">
               <button onClick={onClose} className="px-8 font-black uppercase text-[11px] tracking-widest text-slate-400 hover:text-white transition-colors">Close</button>
               <button onClick={handleDownloadPDF} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-5 rounded-full font-black uppercase text-[11px] tracking-widest shadow-2xl transition-all transform hover:scale-105">Download Audit PDF</button>
            </div>
        </div>
      </div>
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
    return <div className="text-center py-20">Loading sessions...</div>;
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      {selectedSession && <SessionDetailModal session={selectedSession} user={user} onClose={() => setSelectedSession(null)} />}
      <div className="space-y-2">
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Archives</h1>
        <p className="text-slate-500 text-lg font-medium">Revisit exact transcripts and performance audits.</p>
      </div>
      <div className="flex flex-wrap gap-4 items-center bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10">
        <div className="flex items-center gap-2 text-slate-300">
          <Filter size={20} />
          <span className="font-semibold">Filters:</span>
        </div>
        <input
          type="text"
          placeholder="Company"
          value={filters.company}
          onChange={(e) => setFilters({ ...filters, company: e.target.value })}
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Date (e.g., Jan 24)"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Min Score"
          value={filters.score}
          onChange={(e) => setFilters({ ...filters, score: e.target.value })}
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSessions.map((record) => {
          const score = Math.round((record.aggregateScore || 0) * 100);
          const isGood = score >= 60;
          return (
            <div key={record.sessionId} onClick={() => fetchSessionDetails(record.sessionId)} className="group bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all cursor-pointer flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl ${isGood ? 'bg-teal-600' : 'bg-orange-600'}`}><Building size={24} /></div>
                <div className="flex-1">
                  <h3 className="text-xl font-black text-white group-hover:text-blue-300 transition-colors">{record.targetCompany || 'General'}</h3>
                  <p className="text-slate-400 text-sm">{record.role || 'N/A'}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-slate-300 text-sm"><Calendar size={14} className="inline mr-1" />{new Date(record.createdAt).toLocaleDateString()}</p>
                  <p className="text-slate-300 text-sm"><Clock size={14} className="inline mr-1" />{record.durationMinutes || 0} min</p>
                </div>
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="100, 100" className="text-slate-600" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray={`${score}, 100`} className={`${isGood ? 'text-teal-400' : 'text-orange-400'}`} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-black text-sm">{score}%</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${isGood ? 'bg-teal-500/20 text-teal-300' : 'bg-orange-500/20 text-orange-300'}`}>{isGood ? 'Passed' : 'Needs Practice'}</span>
                <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-slate-900 transition-all"><ChevronRight size={16} /></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryView;
