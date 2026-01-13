
import React from 'react';
import { UserProfile, ProficiencyLevel } from '../types';
import { User, Mail, Briefcase, Target, GraduationCap, Save } from 'lucide-react';

const ProfileSettings: React.FC<{ user: UserProfile; setUser: (u: UserProfile) => void }> = ({ user, setUser }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  return (
    <div className="max-w-2xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <User size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Profile</h1>
          <p className="text-slate-500">Customize your AI experience and career goals.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <User size={16} className="text-blue-500" />
              Full Name
            </label>
            <input 
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 text-slate-900 transition-all font-medium"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Briefcase size={16} className="text-blue-500" />
              Job Role
            </label>
            <input 
              name="jobRole"
              value={user.jobRole}
              onChange={handleChange}
              className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 text-slate-900 transition-all font-medium"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <Target size={16} className="text-blue-500" />
            Career Goal
          </label>
          <input 
            name="careerGoal"
            value={user.careerGoal}
            onChange={handleChange}
            className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 text-slate-900 transition-all font-medium"
            placeholder="e.g. Senior Data Scientist at Amazon"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <GraduationCap size={16} className="text-blue-500" />
              English Proficiency
            </label>
            <select 
              name="proficiency"
              value={user.proficiency}
              onChange={handleChange}
              className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 text-slate-900 transition-all font-medium"
            >
              <option value={ProficiencyLevel.BEGINNER}>Beginner</option>
              <option value={ProficiencyLevel.INTERMEDIATE}>Intermediate</option>
              <option value={ProficiencyLevel.ADVANCED}>Advanced</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              Experience Level
            </label>
            <input 
              name="experienceLevel"
              value={user.experienceLevel}
              onChange={handleChange}
              className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 text-slate-900 transition-all font-medium"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            Profile synced with AI Core
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-100">
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>
      
      <div className="mt-8 bg-amber-50 rounded-3xl p-8 border border-amber-100">
        <h3 className="text-amber-900 font-bold mb-2 flex items-center gap-2">
          <Target size={20} className="text-amber-600" />
          Pro Tip for Your Profile
        </h3>
        <p className="text-amber-800/80 text-sm leading-relaxed">
          The more specific your <strong>Career Goal</strong> and <strong>Job Role</strong>, the better the Technical Interviewer can simulate real scenario-based questions. Try to mention specific frameworks or industry domains.
        </p>
      </div>
    </div>
  );
};

export default ProfileSettings;
