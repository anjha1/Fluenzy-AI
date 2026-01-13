
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, MessageSquare, UserCircle, Mic2, LogOut, History as HistoryIcon, Users
} from 'lucide-react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import LearningPath from './components/LearningPath';
import EnglishDashboard from './components/EnglishDashboard';
import HRDashboard from './components/HRDashboard';
import CompanyHRDashboard from './components/CompanyHRDashboard';
import GDDashboard from './components/GDDashboard';
import GDAgent from './components/GDAgent';
import VoiceAgent from './components/VoiceAgent';
import ProfileSettings from './components/ProfileSettings';
import HistoryView from './components/HistoryView';
import { UserProfile, ModuleType } from './types';
import { INITIAL_USER } from './constants';

const Sidebar = ({ onLogout }: { onLogout: () => void }) => {
  const location = useLocation();
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: MessageSquare, label: 'Train Now', path: '/learning' },
    { icon: Users, label: 'GD & Roles', path: '/learning/gd' },
    { icon: HistoryIcon, label: 'Archives', path: '/history' },
    { icon: UserCircle, label: 'Profile', path: '/profile' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col z-20">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg"><Mic2 size={24} /></div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">AceVoice AI</span>
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname.startsWith(item.path) ? 'bg-blue-50 text-blue-600 font-semibold border border-blue-100/30' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-6 border-t">
        <button 
          onClick={onLogout} 
          className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 hover:text-rose-600 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-rose-50"
        >
          <LogOut size={20} /> Sign Out
        </button>
      </div>
    </aside>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('acevoice_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleUpdateUser = (updated: UserProfile) => {
    setUser(updated);
    localStorage.setItem('acevoice_user', JSON.stringify(updated));
  };

  if (!user) {
    return <LandingPage onLogin={() => handleUpdateUser(INITIAL_USER)} />;
  }

  return (
    <HashRouter>
      <div className="flex min-h-screen bg-[#fcfdff]">
        <Sidebar onLogout={() => setUser(null)} />
        <main className="flex-1 p-8 overflow-y-auto max-h-screen">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            
            {/* Learning Sub-Dashboards */}
            <Route path="/learning" element={<LearningPath />} />
            <Route path="/learning/english" element={<EnglishDashboard user={user} />} />
            <Route path="/learning/hr" element={<HRDashboard user={user} />} />
            <Route path="/learning/company-hr" element={<CompanyHRDashboard />} />
            <Route path="/learning/gd" element={<GDDashboard />} />
            
            {/* Session Agents */}
            <Route 
              path="/session/GD_DISCUSSION" 
              element={<GDAgent user={user} onSessionEnd={handleUpdateUser} />} 
            />
            <Route 
              path="/session/:type" 
              element={<VoiceAgent user={user} onSessionEnd={handleUpdateUser} />} 
            />
            
            {/* Settings & History */}
            <Route path="/profile" element={<ProfileSettings user={user} setUser={handleUpdateUser} />} />
            <Route path="/history" element={<HistoryView user={user} />} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
