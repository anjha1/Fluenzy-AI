
import React from 'react';
import { Mic2, ShieldCheck, Zap, Globe, Star, ArrowRight } from 'lucide-react';

const LandingPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  return (
    <div className="bg-white min-h-screen">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Mic2 size={24} />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">AceVoice AI</span>
        </div>
        <div className="flex items-center gap-8">
          <a href="#" className="text-slate-600 font-medium hover:text-blue-600 transition-colors">Pricing</a>
          <a href="#" className="text-slate-600 font-medium hover:text-blue-600 transition-colors">Resources</a>
          <button 
            onClick={onLogin}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-20 lg:py-32 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-bold border border-blue-100">
            <Star size={16} fill="currentColor" />
            Voted #1 AI Interview Coach for 2024
          </div>
          <h1 className="text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
            Learn English. <br />
            <span className="text-blue-600">Practice Interviews.</span> <br />
            Get Job-Ready.
          </h1>
          <p className="text-xl text-slate-500 max-w-lg leading-relaxed">
            Personalized voice AI that turns nervous candidates into fluent professionals. HR, Technical, and Fluency training in one unified SaaS platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={onLogin}
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-200"
            >
              Sign up with Google
              <ArrowRight size={20} />
            </button>
            <button className="bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg hover:border-slate-300 transition-all">
              Watch Demo
            </button>
          </div>
          <div className="flex items-center gap-6 pt-4 grayscale opacity-60">
            <span className="font-bold text-slate-400">Trusted by students at:</span>
            <div className="flex gap-4 font-black tracking-widest text-lg">
              <span>GOOGLE</span>
              <span>AMAZON</span>
              <span>META</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-blue-100 rounded-[3rem] blur-3xl opacity-30 animate-pulse"></div>
          <div className="relative bg-white border border-slate-100 rounded-[3rem] shadow-2xl overflow-hidden aspect-[4/3] flex items-center justify-center p-12">
            <div className="w-full space-y-8">
              <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                  <Mic2 size={24} />
                </div>
                <div className="flex-1">
                  <div className="h-2 w-32 bg-slate-200 rounded-full mb-2"></div>
                  <div className="h-2 w-24 bg-slate-100 rounded-full"></div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="voice-wave !h-16">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="voice-bar !w-1 bg-blue-600" style={{ animationDelay: `${i * 0.1}s` }}></div>
                  ))}
                </div>
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Voice Synthesis Active</span>
              </div>
              <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <div className="text-emerald-800 font-bold mb-1">Grammar Accuracy</div>
                  <div className="text-emerald-600 text-2xl font-black">94.2%</div>
                </div>
                <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-700 font-bold text-sm">+8.1% Today</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-slate-50 py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mx-auto">
              <Globe size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Global Fluency</h3>
            <p className="text-slate-500 leading-relaxed">Used by 50,000+ candidates across 120 countries to master the English language.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Secure & Private</h3>
            <p className="text-slate-500 leading-relaxed">Your data and session audio are never shared with third parties or used for external training.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mx-auto">
              <Zap size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Instant Analytics</h3>
            <p className="text-slate-500 leading-relaxed">Get deep feedback on grammar, confidence, and technical accuracy the moment you finish speaking.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
