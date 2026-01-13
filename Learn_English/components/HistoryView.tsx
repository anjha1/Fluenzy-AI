
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar, History, ChevronRight, FileText, CheckCircle2, X, MessageSquare, Mic2, ThumbsUp, TrendingUp, ShieldCheck, XCircle, AlertCircle, ArrowRight, Clock, Zap, Users, User
} from 'lucide-react';
import { UserProfile, SessionRecord, ModuleType, QAPair } from '../types';

const SessionDetailModal = ({ session, user, onClose }: { session: SessionRecord, user: UserProfile, onClose: () => void }) => {
  
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-6xl max-h-[95vh] rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 border border-white/20">
        <div className="px-12 py-10 bg-slate-50 border-b flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-6">
            <div className="p-4 rounded-3xl bg-slate-900 text-white shadow-xl"><History size={28} /></div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Audit Archive</h2>
              <div className="flex items-center gap-3 mt-1 text-slate-500 font-bold text-sm uppercase tracking-widest">
                 <Calendar size={14} /> {session.date} • {session.startTime}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-slate-200 rounded-full bg-white border shadow-sm transition-all"><X size={24} className="text-slate-500" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-12 space-y-12 scrollbar-hide">
          <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white flex items-center justify-between shadow-2xl relative overflow-hidden group">
             <div className="relative z-10">
                <h3 className="text-7xl font-black tracking-tighter">{session.score}%</h3>
                <p className="text-slate-400 font-black uppercase tracking-widest text-[11px] mt-2">Accuracy Score</p>
             </div>
             <div className="relative z-10 text-right space-y-4">
                <div className={`inline-flex items-center gap-2 px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest bg-white ${session.resultStatus === 'Selected' ? 'text-emerald-600' : 'text-rose-600'}`}>
                   {session.resultStatus} ROUND
                </div>
                <p className="text-slate-400 font-bold text-xs">Readiness: <span className="text-white">{session.readinessLevel}</span></p>
             </div>
             <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
          </div>

          <section className="space-y-10">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
               <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><MessageSquare size={24}/></div>
               Exact Conversation Log
            </h3>
            <div className="space-y-8">
              {session.transcript.map((turn, idx) => (
                <div key={idx} className={`flex items-start gap-5 ${turn.speaker.includes('You') ? 'flex-row-reverse text-right ml-auto max-w-3xl' : 'max-w-3xl'}`}>
                   <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${turn.speaker.includes('You') ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      {turn.speaker.includes('You') ? <User size={20}/> : <Mic2 size={20}/>}
                   </div>
                   <div className="space-y-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{turn.speaker}</span>
                      <div className={`p-6 rounded-[2rem] font-bold leading-relaxed border ${turn.speaker.includes('You') ? 'bg-blue-50 text-blue-900 border-blue-100 rounded-tr-none' : 'bg-slate-50 text-slate-800 border-slate-100 rounded-tl-none'}`}>
                         "{turn.text}"
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="px-12 py-10 bg-white border-t flex justify-between items-center z-20">
           <div className="flex items-center gap-3"><ShieldCheck className="text-emerald-600" /><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Encrypted Career Archive</p></div>
           <div className="flex gap-4">
              <button onClick={onClose} className="px-8 font-black uppercase text-[11px] tracking-widest text-slate-500">Close</button>
              <button onClick={handleDownloadPDF} className="bg-slate-900 hover:bg-black text-white px-10 py-5 rounded-full font-black uppercase text-[11px] tracking-widest shadow-2xl transition-all transform hover:scale-105">Download Audit PDF</button>
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
      <div className="grid grid-cols-1 gap-6">
        {sessions.map((record) => (
          <div key={record.sessionId} onClick={() => fetchSessionDetails(record.sessionId)} className="group bg-white border p-10 rounded-[3.5rem] shadow-sm hover:shadow-2xl transition-all cursor-pointer flex flex-col md:flex-row items-center gap-10">
            <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center text-white shadow-xl bg-blue-600`}><History size={36} /></div>
            <div className="flex-1 space-y-3">
               <h3 className="text-3xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{record.module} - {record.targetCompany || 'General'}</h3>
               <div className="flex gap-4">
                  <span className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100"><Calendar size={12}/> {new Date(record.createdAt).toLocaleDateString()}</span>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${record.status === 'PASS' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>{record.status}</span>
               </div>
            </div>
            <div className="flex items-center gap-12 shrink-0">
               <div className="text-center"><p className="text-5xl font-black text-slate-900 tracking-tighter">{Math.round((record.aggregateScore || 0) * 10)}%</p><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Audit Score</p></div>
               <div className="w-16 h-16 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all"><ChevronRight size={32} /></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryView;
