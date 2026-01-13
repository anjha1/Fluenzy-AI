
import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle2, 
  PlayCircle, 
  ChevronRight,
  ArrowLeft,
  UserCheck,
  Trophy
} from 'lucide-react';
import { UserProfile, Lesson, ModuleType } from '../types';

const LessonCard: React.FC<{ lesson: Lesson, onStart: () => void }> = ({ lesson, onStart }) => (
  <div 
    onClick={onStart}
    className={`group relative p-6 rounded-3xl border transition-all duration-300 ${
      lesson.isCompleted 
        ? 'bg-white border-emerald-100 shadow-sm cursor-pointer hover:shadow-md'
        : 'bg-white border-pink-100 shadow-lg shadow-pink-50 cursor-pointer hover:-translate-y-1'
    }`}
  >
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
        lesson.isCompleted 
          ? 'bg-emerald-500 text-white' 
          : 'bg-pink-600 text-white'
      }`}>
        {lesson.isCompleted ? <CheckCircle2 size={24} /> : <PlayCircle size={24} />}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold truncate text-slate-900">
          {lesson.title}
        </h4>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-[10px] font-black uppercase tracking-wider ${
            lesson.isCompleted ? `text-emerald-500` : 'text-pink-500'
          }`}>
            {lesson.isCompleted ? `Ready: ${lesson.score}%` : 'Start Step'}
          </span>
        </div>
      </div>
      <ChevronRight size={18} className="text-slate-300 group-hover:text-pink-500 transition-all" />
    </div>
  </div>
);

const HRDashboard: React.FC<{ user: UserProfile }> = ({ user }) => {
  const router = useRouter();

  const handleStartLesson = (lesson: Lesson) => {
    router.push(`/train/session/${ModuleType.HR_INTERVIEW}?lessonId=${lesson.id}&lessonTitle=${encodeURIComponent(lesson.title)}`);
  };

  const totalLessons = user.hrLearningPath.reduce((acc, level) => acc + level.lessons.length, 0);
  const completedLessons = user.hrLearningPath.reduce((acc, level) => 
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
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">HR Interview Coach</h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">Step-by-step masterclass for corporate behaviorals.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3 min-w-[160px]">
            <div className="bg-pink-50 p-2 rounded-xl text-pink-600"><Trophy size={20} /></div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">HR Readiness</p>
              <p className="text-sm font-black text-slate-900 mt-1">{progress}% Completed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-16">
        {user.hrLearningPath.map((levelProgress) => (
          <div key={levelProgress.level} className="space-y-6">
            <div className="flex items-center gap-4 px-2">
              <div className="p-2 bg-slate-900 text-white rounded-lg"><UserCheck size={18} /></div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{levelProgress.level} HR Track</h2>
              <div className="h-px flex-1 bg-slate-100"></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {levelProgress.lessons.filter(l => l.isCompleted).length}/{levelProgress.lessons.length} Done
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {levelProgress.lessons.map((lesson) => (
                <LessonCard 
                  key={lesson.id} 
                  lesson={lesson} 
                  onStart={() => handleStartLesson(lesson)} 
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HRDashboard;
