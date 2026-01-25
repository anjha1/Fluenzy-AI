
import React, { useEffect, useState } from 'react';
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
    className={`group relative p-6 rounded-3xl border transition-all duration-300 backdrop-blur-xl ${
      lesson.isCompleted
        ? 'bg-gradient-to-br from-emerald-900/20 to-slate-900/80 border-emerald-500/30 shadow-lg shadow-emerald-500/10 cursor-pointer hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-1'
        : 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-pink-500/30 shadow-xl shadow-pink-500/10 cursor-pointer hover:shadow-2xl hover:shadow-pink-500/20 hover:-translate-y-1'
    }`}
  >
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform ${lesson.isCompleted ? '' : 'group-hover:scale-110'} ${
        lesson.isCompleted
          ? 'bg-emerald-500 text-white shadow-lg'
          : 'bg-pink-600 text-white shadow-lg'
      }`}>
        {lesson.isCompleted ? <CheckCircle2 size={24} /> : <PlayCircle size={24} />}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className={`font-bold truncate ${lesson.isCompleted ? 'text-white' : 'text-white'}`}>
          {lesson.title}
        </h4>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full ${
            lesson.isCompleted ? 'text-emerald-300 bg-emerald-500/20' : 'text-pink-300 bg-pink-500/20'
          }`}>
            {lesson.isCompleted ? 'Completed' : 'Available'}
          </span>
          {lesson.isCompleted && lesson.score && (
            <span className="text-[10px] font-black text-emerald-400">
              {lesson.score}%
            </span>
          )}
        </div>
      </div>
      <ChevronRight size={18} className="text-slate-400 group-hover:text-pink-400 transition-all" />
    </div>
  </div>
);

const HRDashboard: React.FC<{ user: UserProfile }> = ({ user }) => {
  const router = useRouter();
  const [hrLearningPath, setHrLearningPath] = useState(user.hrLearningPath);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        // Try API first
        const response = await fetch('/api/hr-progress');
        if (response.ok) {
          const progressData = await response.json();
          const updatedPath = user.hrLearningPath.map(level => ({
            ...level,
            lessons: level.lessons.map(lesson => ({
              ...lesson,
              isCompleted: progressData[lesson.id] || false
            }))
          }));
          setHrLearningPath(updatedPath);
          // Store in localStorage as backup
          localStorage.setItem('hrProgress', JSON.stringify(progressData));
        } else {
          // Fallback to localStorage
          const stored = localStorage.getItem('hrProgress');
          if (stored) {
            const progressData = JSON.parse(stored);
            const updatedPath = user.hrLearningPath.map(level => ({
              ...level,
              lessons: level.lessons.map(lesson => ({
                ...lesson,
                isCompleted: progressData[lesson.id] || false
              }))
            }));
            setHrLearningPath(updatedPath);
          }
        }
      } catch (error) {
        console.error('Failed to fetch HR progress:', error);
        // Fallback to localStorage
        const stored = localStorage.getItem('hrProgress');
        if (stored) {
          const progressData = JSON.parse(stored);
          const updatedPath = user.hrLearningPath.map(level => ({
            ...level,
            lessons: level.lessons.map(lesson => ({
              ...lesson,
              isCompleted: progressData[lesson.id] || false
            }))
          }));
          setHrLearningPath(updatedPath);
        }
      }
    };

    fetchProgress();
  }, [user.hrLearningPath]);

  const handleStartLesson = (lesson: Lesson) => {
    router.push(`/train/session/${ModuleType.HR_INTERVIEW}?lessonId=${lesson.id}&lessonTitle=${encodeURIComponent(lesson.title)}`);
  };

  const totalLessons = hrLearningPath.reduce((acc, level) => acc + level.lessons.length, 0);
  const completedLessons = hrLearningPath.reduce((acc, level) =>
    acc + level.lessons.filter(l => l.isCompleted).length, 0);
  const progress = Math.round((completedLessons / totalLessons) * 100);

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <button
            onClick={() => router.push('/train')}
            className="flex items-center gap-2 text-slate-400 font-bold text-sm mb-4 hover:text-slate-300 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Modules
          </button>
          <h1 className="text-4xl font-black text-white tracking-tight">HR Interview Coach</h1>
          <p className="text-slate-300 mt-2 text-lg font-medium">Step-by-step masterclass for corporate behaviorals.</p>
        </div>

        <div className="flex gap-4">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl p-4 rounded-3xl border border-slate-700/50 shadow-lg min-w-[200px]">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-pink-500/20 p-2 rounded-xl text-pink-400"><Trophy size={20} /></div>
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">HR Readiness</p>
                <p className="text-sm font-black text-white">{progress}% Completed</p>
              </div>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-2">{completedLessons}/{totalLessons} Steps</p>
          </div>
        </div>
      </div>

      <div className="space-y-16">
        {hrLearningPath.map((levelProgress) => (
          <div key={levelProgress.level} className="space-y-6">
            <div className="flex items-center gap-4 px-2">
              <div className="p-2 bg-gradient-to-br from-pink-600 to-purple-600 text-white rounded-lg shadow-lg"><UserCheck size={18} /></div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">{levelProgress.level} HR Track</h2>
              <div className="h-px flex-1 bg-slate-700/50"></div>
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
