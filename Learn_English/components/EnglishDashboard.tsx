
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  PlayCircle,
  ChevronRight,
  ArrowLeft,
  GraduationCap,
  Trophy,
  Lock
} from 'lucide-react';
import { UserProfile, Lesson, ModuleType } from '../types';

const LessonCard: React.FC<{ lesson: Lesson, onStart: () => void, onUpgrade?: () => void, isLocked?: boolean }> = ({ lesson, onStart, onUpgrade, isLocked = false }) => (
  <div
    onClick={isLocked ? onUpgrade : onStart}
    className={`group relative p-6 rounded-3xl border transition-all duration-300 ${
      isLocked ? 'bg-gray-50 border-gray-200 opacity-60 cursor-pointer hover:bg-gray-100' :
      lesson.isCompleted
        ? 'bg-white border-emerald-100 shadow-sm cursor-pointer hover:shadow-md'
        : 'bg-white border-blue-100 shadow-lg shadow-blue-50 cursor-pointer hover:-translate-y-1'
    }`}
  >
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform ${isLocked ? '' : 'group-hover:scale-110'} ${
        isLocked ? 'bg-gray-400 text-white' :
        lesson.isCompleted
          ? 'bg-emerald-500 text-white'
          : 'bg-blue-600 text-white'
      }`}>
        {isLocked ? <Lock size={24} /> : lesson.isCompleted ? <CheckCircle2 size={24} /> : <PlayCircle size={24} />}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className={`font-bold truncate ${isLocked ? 'text-gray-500' : 'text-slate-900'}`}>
          {lesson.title}
        </h4>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-[10px] font-black uppercase tracking-wider ${
            isLocked ? 'text-red-400 cursor-pointer' :
            lesson.isCompleted ? `text-emerald-500` : 'text-blue-500'
          }`}>
            {isLocked ? 'Upgrade to continue' : lesson.isCompleted ? `Score: ${lesson.score}%` : 'Practice Now'}
          </span>
        </div>
      </div>
      {!isLocked && <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 transition-all" />}
    </div>
  </div>
);

const EnglishDashboard: React.FC<{ user: UserProfile }> = ({ user }) => {
  const router = useRouter();
  const [canUse, setCanUse] = useState(true);

  useEffect(() => {
    const checkUsage = async () => {
      try {
        const response = await fetch('/api/training-usage');
        if (response.ok) {
          const data = await response.json();
          setCanUse(data.canUse.english);
        }
      } catch (error) {
        console.error('Failed to check usage:', error);
      }
    };

    checkUsage();
  }, []);

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

  const handleStartLesson = (lesson: Lesson) => {
    if (!canUse) return;
    // For now, navigate to a session page with query params
    router.push(`/train/session/${ModuleType.ENGLISH_LEARNING}?lessonId=${lesson.id}&lessonTitle=${encodeURIComponent(lesson.title)}`);
  };

  const totalLessons = user.learningPath.reduce((acc, level) => acc + level.lessons.length, 0);
  const completedLessons = user.learningPath.reduce((acc, level) => 
    acc + level.lessons.filter(l => l.isCompleted).length, 0);
  const progress = Math.round((completedLessons / totalLessons) * 100);

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <button
            onClick={() => router.push('/train')}
            className="flex items-center gap-2 text-slate-400 font-bold text-sm mb-4 hover:text-slate-600 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Modules
          </button>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">English Learning</h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">Structured path from Beginner to Corporate Fluency.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3 min-w-[160px]">
            <div className="bg-blue-50 p-2 rounded-xl text-blue-600"><Trophy size={20} /></div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">Overall Progress</p>
              <p className="text-sm font-black text-slate-900 mt-1">{progress}% Completed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-16">
        {user.learningPath.map((levelProgress) => (
          <div key={levelProgress.level} className="space-y-6">
            <div className="flex items-center gap-4 px-2">
              <div className="p-2 bg-slate-900 text-white rounded-lg"><GraduationCap size={18} /></div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{levelProgress.level} Track</h2>
              <div className="h-px flex-1 bg-slate-100"></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {levelProgress.lessons.filter(l => l.isCompleted).length}/{levelProgress.lessons.length} Completed
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {levelProgress.lessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  onStart={() => handleStartLesson(lesson)}
                  onUpgrade={handleUpgrade}
                  isLocked={!canUse}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnglishDashboard;
