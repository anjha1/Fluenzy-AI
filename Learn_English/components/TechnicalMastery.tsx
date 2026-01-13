"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Code,
  ArrowLeft,
  ChevronRight,
  Cpu,
  Database,
  Globe,
  Zap,
  CheckCircle
} from 'lucide-react';

const TechnicalMastery: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedFocus, setSelectedFocus] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const startSession = () => {
    try {
      router.push('/train/session/TECH_INTERVIEW');
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = '/train';
    }
  };

  return (
    <div className="bg-slate-900/30 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
      <div className="flex items-center justify-between p-6 md:p-8 border-b border-slate-700/50">
        <button
          onClick={() => {
            try {
              step > 1 ? prevStep() : router.push('/train');
            } catch (error) {
              console.error('Navigation error:', error);
              window.location.href = '/train';
            }
          }}
          className="flex items-center gap-2 text-slate-400 font-bold text-sm hover:text-slate-300 transition-colors"
        >
          <ArrowLeft size={16} />
          {step > 1 ? 'Previous Step' : 'Back to Modules'}
        </button>
        <div className="flex gap-2">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1.5 w-12 rounded-full transition-all ${step >= s ? 'bg-purple-500' : 'bg-slate-600'}`}></div>
          ))}
        </div>
      </div>

      <div className="flex-1 p-6 md:p-12 space-y-8">
        {step === 1 && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black text-white tracking-tight">Technical Focus Area</h2>
              <p className="text-slate-300">Choose your technical specialization for the interview preparation.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                { id: 'frontend', title: 'Frontend Development', icon: Globe, desc: 'React, Vue, Angular, UI/UX' },
                { id: 'backend', title: 'Backend Development', icon: Database, desc: 'Node.js, Python, Java, APIs' },
                { id: 'fullstack', title: 'Full Stack', icon: Code, desc: 'End-to-end development' },
                { id: 'system', title: 'System Design', icon: Cpu, desc: 'Architecture, scalability, design patterns' }
              ].map(area => (
                <button
                  key={area.id}
                  onClick={() => { setSelectedFocus(area.id); nextStep(); }}
                  className={`p-6 rounded-3xl border-2 flex flex-col items-center text-center gap-4 transition-all touch-manipulation ${
                    selectedFocus === area.id ? 'border-purple-500 bg-purple-900/30' : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 backdrop-blur-sm'
                  }`}
                >
                  <div className={`p-3 rounded-2xl ${selectedFocus === area.id ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                    <area.icon size={24} />
                  </div>
                  <div>
                    <p className="font-black text-white uppercase tracking-widest text-sm mb-1">{area.title}</p>
                    <p className="text-xs text-slate-300">{area.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black text-white tracking-tight">Experience Level</h2>
              <p className="text-slate-300">Select your current experience level in {selectedFocus} development.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                { id: 'junior', title: 'Junior (0-2 years)', desc: 'Basic concepts, frameworks' },
                { id: 'mid', title: 'Mid-Level (2-5 years)', desc: 'Advanced patterns, optimization' },
                { id: 'senior', title: 'Senior (5+ years)', desc: 'Architecture, leadership' }
              ].map(level => (
                <button
                  key={level.id}
                  onClick={() => { setSelectedLevel(level.id); nextStep(); }}
                  className={`p-6 rounded-3xl border-2 flex flex-col items-center text-center gap-4 transition-all touch-manipulation ${
                    selectedLevel === level.id ? 'border-purple-500 bg-purple-900/30' : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 backdrop-blur-sm'
                  }`}
                >
                  <div className={`p-3 rounded-2xl ${selectedLevel === level.id ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                    <Zap size={24} />
                  </div>
                  <div>
                    <p className="font-black text-white uppercase tracking-widest text-sm mb-1">{level.title}</p>
                    <p className="text-xs text-slate-300">{level.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black text-white tracking-tight">Ready to Begin</h2>
              <p className="text-slate-300">Your technical interview session is configured and ready.</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-600 space-y-6 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Focus Area</p>
                    <p className="font-bold text-white capitalize">{selectedFocus}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Level</p>
                    <p className="font-bold text-white capitalize">{selectedLevel}</p>
                  </div>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700">
                  <p className="text-sm text-slate-300">
                    You'll be asked technical questions related to {selectedFocus} development at a {selectedLevel} level. Answer clearly and show your problem-solving approach.
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={startSession}
                  className="bg-purple-600 text-white px-12 py-4 rounded-3xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-purple-500/25 hover:bg-purple-700 transition-all transform hover:scale-105 touch-manipulation"
                >
                  Start Technical Interview
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnicalMastery;