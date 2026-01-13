
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
    if (type === ModuleType.ENGLISH_LEARNING) {
      router.push('/train/english');
    } else if (type === ModuleType.HR_INTERVIEW) {
      router.push('/train/hr');
    } else if (type === ModuleType.COMPANY_WISE_HR) {
      router.push('/train/company');
    } else if (type === ModuleType.GD_DISCUSSION) {
      router.push('/train/gd');
    } else if (type === ModuleType.CONVERSATION_PRACTICE) {
      router.push('/train/daily');
    } else if (type === ModuleType.TECH_INTERVIEW) {
      router.push('/train/technical');
    } else if (type === ModuleType.FULL_MOCK) {
      router.push('/train/mock');
    } else {
      router.push(`/train/session/${type}`);
    }
  };

  return (
    <div 
      onClick={handleStart}
      className={`group relative bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both ${delay}`}
    >
      <div className={`w-16 h-16 rounded-2xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        <Icon size={32} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
        {title}
        {isAdvanced && <ShieldCheck size={18} className="text-blue-500" />}
      </h3>
      <p className="text-slate-500 text-sm leading-relaxed mb-6">{description}</p>
      
      <div className="flex items-center text-blue-600 font-bold text-sm">
        Start Training
        <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
      </div>

      <div className="absolute top-6 right-8">
        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md tracking-widest ${isAdvanced ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
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
    {
      type: ModuleType.FULL_MOCK,
      title: 'Full Mock Session',
      description: 'End-to-end simulation covering HR, Technical, and Communication assessments.',
      icon: Briefcase,
      color: 'bg-blue-600',
      delay: 'delay-500'
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Select Training Module</h1>
        <p className="text-slate-500 mt-2 text-lg">Choose where you want to focus today. Your AI coach is ready.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {modules.map((m) => (
          <ModuleCard key={m.type} {...m} />
        ))}
      </div>
    </div>
  );
};

export default LearningPath;