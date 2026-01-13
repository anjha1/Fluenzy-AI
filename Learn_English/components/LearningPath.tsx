
import React, { useEffect, useState } from 'react';
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
  Users,
  Lock
} from 'lucide-react';
import { ModuleType } from '../types';

const ModuleCard = ({ type, title, description, icon: Icon, color, delay, isAdvanced, canUse, remaining, isLocked }: any) => {
  const router = useRouter();

  const handleUpgrade = async () => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        window.location.href = data.url;
      } else {
        console.error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
    }
  };

  const handleStart = () => {
    if (isLocked) return;

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
      } else if (type === ModuleType.FULL_MOCK) {
        router.push('/train/mock');
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
      className={`group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-slate-700/50 shadow-xl ${isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-2xl hover:shadow-purple-500/10 hover:border-purple-500/30 hover:-translate-y-1 cursor-pointer'} transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 fill-mode-both ${delay}`}
    >
      <div className="relative mb-6">
        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg ${!isLocked && 'group-hover:shadow-xl transition-all duration-300 group-hover:scale-110'}`}>
          {isLocked ? <Lock size={32} className="text-white" /> : <Icon size={32} className="text-white" />}
        </div>
        <div className={`absolute -inset-2 bg-gradient-to-br ${color} opacity-30 blur-xl rounded-2xl ${!isLocked && 'group-hover:opacity-50'} transition-opacity duration-300`} />
      </div>

      <h3 className="text-xl md:text-2xl font-black text-white mb-3 flex items-center gap-2">
        {title}
        {isAdvanced && <ShieldCheck size={20} className="text-blue-400" />}
      </h3>
      <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">{description}</p>

      <div className="flex items-center justify-between">
        <div className={`font-bold text-sm md:text-base ${isLocked ? 'text-red-400 cursor-pointer hover:text-red-300' : 'text-purple-400 group-hover:text-purple-300'} transition-colors`} onClick={isLocked ? handleUpgrade : undefined}>
          {isLocked ? 'Free limit reached. Upgrade to continue.' : 'Start Training'}
          {!isLocked && <ArrowRight size={16} className="ml-2 inline group-hover:translate-x-1 transition-transform" />}
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Free uses</div>
          <div className={`text-sm font-black ${isLocked ? 'text-red-400' : remaining === 'Unlimited' ? 'text-green-400' : 'text-white'}`}>
            {remaining === 'Unlimited' ? '∞' : `${remaining} / 3`}
          </div>
        </div>
      </div>

      <div className="absolute top-4 md:top-6 right-4 md:right-6">
        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest shadow-sm ${isLocked ? 'bg-red-900/50 text-red-300 border border-red-700/50' : isAdvanced ? 'bg-blue-900/50 text-blue-300 border border-blue-700/50' : 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/50'}`}>
          {isLocked ? 'Locked' : isAdvanced ? 'Advanced' : 'Available'}
        </span>
      </div>
    </div>
  );
};

const LearningPath: React.FC = () => {
  const [usageData, setUsageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const response = await fetch('/api/training-usage');
        if (response.ok) {
          const data = await response.json();
          setUsageData(data);
        }
      } catch (error) {
        console.error('Failed to fetch usage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();
  }, []);

  const getModuleUsage = (type: ModuleType) => {
    if (!usageData) return { canUse: true, remaining: 'Loading...', isLocked: false };

    const moduleMap: Record<string, string> = {
      [ModuleType.ENGLISH_LEARNING]: 'english',
      [ModuleType.CONVERSATION_PRACTICE]: 'daily',
      [ModuleType.HR_INTERVIEW]: 'hr',
      [ModuleType.TECH_INTERVIEW]: 'technical',
      [ModuleType.COMPANY_WISE_HR]: 'company',
      [ModuleType.FULL_MOCK]: 'mock',
    };

    const key = moduleMap[type];
    if (!key) return { canUse: true, remaining: 'N/A', isLocked: false };

    const canUse = usageData.canUse[key];
    const remaining = usageData.remaining[key];
    const isLocked = !canUse && remaining !== 'Unlimited';

    return { canUse, remaining, isLocked };
  };

  const modules = [
    {
      type: ModuleType.ENGLISH_LEARNING,
      title: 'English Learning',
      description: 'Master fluency with personalized daily conversations and real-time grammar feedback.',
      icon: BookOpen,
      color: 'bg-indigo-500',
      delay: 'delay-0',
      ...getModuleUsage(ModuleType.ENGLISH_LEARNING)
    },
    {
      type: ModuleType.CONVERSATION_PRACTICE,
      title: 'Daily Conversation',
      description: 'Practice real-life office scenarios, small talk, and collaborative professional communication.',
      icon: MessageSquare,
      color: 'bg-sky-500',
      delay: 'delay-100',
      ...getModuleUsage(ModuleType.CONVERSATION_PRACTICE)
    },
    {
      type: ModuleType.HR_INTERVIEW,
      title: 'HR Interview Coach',
      description: 'Ace behavioral questions and soft skills assessment with seasoned HR simulation.',
      icon: UserPlus,
      color: 'bg-pink-500',
      delay: 'delay-200',
      ...getModuleUsage(ModuleType.HR_INTERVIEW)
    },
    {
      type: ModuleType.TECH_INTERVIEW,
      title: 'Technical Mastery',
      description: 'Deep-dive into role-based technical conceptual rounds and logic assessments.',
      icon: Code,
      color: 'bg-emerald-500',
      delay: 'delay-300',
      ...getModuleUsage(ModuleType.TECH_INTERVIEW)
    },
    {
      type: ModuleType.COMPANY_WISE_HR,
      title: 'Company Tracks',
      description: 'Prepare for FAANG, Startups, or MNCs with specific curated company HR rounds.',
      icon: Building2,
      color: 'bg-amber-500',
      delay: 'delay-400',
      isAdvanced: true,
      ...getModuleUsage(ModuleType.COMPANY_WISE_HR)
    },
    {
      type: ModuleType.FULL_MOCK,
      title: 'Mock Interview',
      description: 'Full end-to-end interview simulation with comprehensive evaluation and feedback.',
      icon: Briefcase,
      color: 'bg-orange-500',
      delay: 'delay-500',
      ...getModuleUsage(ModuleType.FULL_MOCK)
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