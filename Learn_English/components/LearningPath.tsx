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
  Lock,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModuleType } from '../types';

const ModuleCard = ({ type, title, description, icon: Icon, color, delay, isAdvanced, canUse, remaining, isLocked, planName, limit, bgImage }: any) => {
  const router = useRouter();

  const handleUpgrade = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push('/billing');
  };

  const handleStart = () => {
    if (isLocked) return;
    try {
      const routes: Record<string, string> = {
        [ModuleType.ENGLISH_LEARNING]: '/train/english',
        [ModuleType.HR_INTERVIEW]: '/train/hr',
        [ModuleType.COMPANY_WISE_HR]: '/train/company',
        [ModuleType.GD_DISCUSSION]: '/train/gd',
        [ModuleType.TECH_INTERVIEW]: '/train/technical',
        [ModuleType.FULL_MOCK]: '/train/mock',
      };
      router.push(routes[type] || `/train/session/${type}`);
    } catch (e) {
      window.location.href = '/train';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      onClick={handleStart}
      className={`group relative min-h-[340px] flex flex-col bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-700/50 shadow-2xl transition-all duration-500 overflow-hidden ${
        isLocked ? 'opacity-70 cursor-not-allowed' : 'hover:border-purple-500/50 cursor-pointer'
      }`}
    >
      {/* Background Image Layer */}
      {bgImage && (
        <div className="absolute inset-0 z-0">
          <img 
            src={bgImage} 
            alt="" 
            className="w-full h-full object-cover opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>
      )}

      {/* Glossy Overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Animated Glow */}
      {!isLocked && (
        <div className={`absolute -inset-2 z-[2] bg-gradient-to-br ${color} opacity-0 blur-3xl group-hover:opacity-10 transition-opacity duration-500`} />
      )}

      <div className="relative z-10 flex-1">
        <div className="flex justify-between items-start mb-8">
          <div className="relative">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg relative z-10`}
            >
              {isLocked ? <Lock size={30} className="text-white/90" /> : <Icon size={30} className="text-white" />}
            </motion.div>
            <div className={`absolute -inset-1 bg-gradient-to-br ${color} opacity-40 blur-md rounded-2xl transition-all duration-500 group-hover:blur-lg`} />
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full tracking-wider border ${
              isLocked 
                ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                : isAdvanced 
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}>
              {isLocked ? 'Premium' : isAdvanced ? 'Advanced' : 'Free'}
            </span>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2 group-hover:text-purple-300 transition-colors">
          {title}
          {isAdvanced && <Sparkles size={18} className="text-amber-400" />}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-8 group-hover:text-slate-300 transition-colors font-medium">
          {description}
        </p>
      </div>

      <div className="mt-auto relative z-10 pt-6 border-t border-slate-800/50 flex items-center justify-between">
        <div 
          className={`flex items-center gap-2 font-bold text-sm transition-all duration-300 ${
            isLocked ? 'text-red-400 hover:text-red-300' : 'text-purple-400 group-hover:text-white'
          }`}
          onClick={isLocked ? handleUpgrade : undefined}
        >
          <span>{isLocked ? 'Upgrade to Unlock' : 'Start Session'}</span>
          {!isLocked && (
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ArrowRight size={18} />
            </motion.div>
          )}
        </div>

        <div className="text-right">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mb-0.5">
            {planName || 'Usage'}
          </p>
          <p className={`text-lg font-black tabular-nums ${isLocked ? 'text-red-400' : remaining === 'Unlimited' ? 'text-emerald-400' : 'text-white'}`}>
            {remaining === 'Unlimited' ? '∞' : `${remaining ?? 0}/${limit || 3}`}
          </p>
        </div>
      </div>
    </motion.div>
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
      [ModuleType.GD_DISCUSSION]: 'gd',
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
      bgImage: '/images/EnglishLearning.jpg',
      ...getModuleUsage(ModuleType.ENGLISH_LEARNING),
      planName: usageData?.planName,
      limit: usageData?.limit
    },
    {
      type: ModuleType.CONVERSATION_PRACTICE,
      title: 'Daily Conversation',
      description: 'Practice real-life office scenarios, small talk, and collaborative professional communication.',
      icon: MessageSquare,
      color: 'bg-sky-500',
      delay: 'delay-100',
      bgImage: '/images/DailyConversation.jpg',
      ...getModuleUsage(ModuleType.CONVERSATION_PRACTICE),
      planName: usageData?.planName,
      limit: usageData?.limit
    },
    {
      type: ModuleType.HR_INTERVIEW,
      title: 'HR Interview Coach',
      description: 'Ace behavioral questions and soft skills assessment with seasoned HR simulation.',
      icon: UserPlus,
      color: 'bg-pink-500',
      delay: 'delay-200',
      bgImage: '/images/HRInterviewCoach.jpg',
      ...getModuleUsage(ModuleType.HR_INTERVIEW),
      planName: usageData?.planName,
      limit: usageData?.limit
    },
    {
      type: ModuleType.TECH_INTERVIEW,
      title: 'Technical Mastery',
      description: 'Deep-dive into role-based technical conceptual rounds and logic assessments.',
      icon: Code,
      color: 'bg-emerald-500',
      delay: 'delay-300',
      bgImage: '/images/TechnicalMastery.jpg',
      ...getModuleUsage(ModuleType.TECH_INTERVIEW),
      planName: usageData?.planName,
      limit: usageData?.limit
    },
    {
      type: ModuleType.COMPANY_WISE_HR,
      title: 'Company Tracks',
      description: 'Prepare for FAANG, Startups, or MNCs with specific curated company HR rounds.',
      icon: Building2,
      color: 'bg-amber-500',
      delay: 'delay-400',
      isAdvanced: true,
      bgImage: '/images/CompanyTracks.jpg',
      ...getModuleUsage(ModuleType.COMPANY_WISE_HR),
      planName: usageData?.planName,
      limit: usageData?.limit
    },
    {
      type: ModuleType.GD_DISCUSSION,
      title: 'GD Agent',
      description: 'Practice real Group Discussions with AI participants. Choose teams, roles, and get evaluated.',
      icon: Users,
      color: 'bg-purple-500',
      delay: 'delay-500',
      bgImage: '/images/GDAgent.jpg',
      ...getModuleUsage(ModuleType.GD_DISCUSSION),
      planName: usageData?.planName,
      limit: usageData?.limit
    },
  ];

  return (
    <div className="space-y-12 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
          Training Modules
        </h1>
        <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
          The most advanced AI coaching system for your career growth.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {modules.map((m, index) => (
            <ModuleCard key={m.type} {...m} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LearningPath;