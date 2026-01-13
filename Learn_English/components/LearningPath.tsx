
import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  MessageSquare, 
  UserPlus, 
  Code, 
  Building2, 
  Briefcase,
  ArrowRight,
  ShieldCheck,
  Users
} from 'lucide-react';
import { ModuleType } from '../types';

const ModuleCard = ({ type, title, description, icon: Icon, color, delay, isAdvanced }: any) => {
  const router = useRouter();

  const handleStart = () => {
    try {
      if (type === ModuleType.ENGLISH_LEARNING) {
        router.push('/train/english');
      } else if (type === ModuleType.HR_INTERVIEW) {
        router.push('/train/hr');
      } else if (type === ModuleType.COMPANY_WISE_HR) {
        router.push('/train/company');
      } else if (type === ModuleType.GD_DISCUSSION) {
        router.push('/train/gd');
      } else if (type === ModuleType.CONVERSATION_PRACTICE) {
        router.push(`/train/session/${type}`);
      } else if (type === ModuleType.TECH_INTERVIEW) {
        router.push('/train/technical');
      } else {
        router.push(`/train/session/${type}`);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback navigation
      window.location.href = '/train';
    }
  };

  return (
    <div
      onClick={handleStart}
      className={`group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-slate-700/50 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 hover:border-purple-500/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer animate-in fade-in slide-in-from-bottom-4 fill-mode-both ${delay}`}
    >
      <div className="relative mb-6">
        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
          <Icon size={32} className="text-white" />
        </div>
        <div className={`absolute -inset-2 bg-gradient-to-br ${color} opacity-30 blur-xl rounded-2xl group-hover:opacity-50 transition-opacity duration-300`} />
      </div>

      <h3 className="text-xl md:text-2xl font-black text-white mb-3 flex items-center gap-2">
        {title}
        {isAdvanced && <ShieldCheck size={20} className="text-blue-400" />}
      </h3>
      <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">{description}</p>

      <div className="flex items-center text-purple-400 font-bold text-sm md:text-base group-hover:text-purple-300 transition-colors">
        Start Training
        <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
      </div>

      <div className="absolute top-4 md:top-6 right-4 md:right-6">
        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest shadow-sm ${isAdvanced ? 'bg-blue-900/50 text-blue-300 border border-blue-700/50' : 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/50'}`}>
          {isAdvanced ? 'Advanced' : 'Available'}
        </span>
      </div>
    </div>
  );
};

const LearningPath: React.FC = () => {
  const modules = [
    {
      type: ModuleType.ENGLISH_LEARNING,
      title: 'English Learning',
      description: 'Master fluency with personalized daily conversations and real-time grammar feedback.',
      icon: BookOpen,
      color: 'bg-indigo-500',
      delay: 'delay-0'
    },
    {
      type: ModuleType.CONVERSATION_PRACTICE,
      title: 'Daily Conversation',
      description: 'Practice real-life office scenarios, small talk, and collaborative professional communication.',
      icon: MessageSquare,
      color: 'bg-sky-500',
      delay: 'delay-100'
    },
    {
      type: ModuleType.HR_INTERVIEW,
      title: 'HR Interview Coach',
      description: 'Ace behavioral questions and soft skills assessment with seasoned HR simulation.',
      icon: UserPlus,
      color: 'bg-pink-500',
      delay: 'delay-200'
    },
    {
      type: ModuleType.GD_DISCUSSION,
      title: 'GD Agent',
      description: 'Practice real Group Discussions with AI participants. Choose teams, roles, and get evaluated.',
      icon: Users,
      color: 'bg-purple-500',
      delay: 'delay-250',
      isAdvanced: true
    },
    {
      type: ModuleType.TECH_INTERVIEW,
      title: 'Technical Mastery',
      description: 'Deep-dive into role-based technical conceptual rounds and logic assessments.',
      icon: Code,
      color: 'bg-emerald-500',
      delay: 'delay-300'
    },
    {
      type: ModuleType.COMPANY_WISE_HR,
      title: 'Company Tracks',
      description: 'Prepare for FAANG, Startups, or MNCs with specific curated company HR rounds.',
      icon: Building2,
      color: 'bg-amber-500',
      delay: 'delay-400',
      isAdvanced: true
    },
  ];

  return (
    <div className="space-y-8 md:space-y-12 pb-12">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">Select Training Module</h1>
        <p className="text-slate-300 mt-4 text-base md:text-lg">Choose where you want to focus today. Your AI coach is ready.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {modules.map((m) => (
          <ModuleCard key={m.type} {...m} />
        ))}
      </div>
    </div>
  );
};

export default LearningPath;