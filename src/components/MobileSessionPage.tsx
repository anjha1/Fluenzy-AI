import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Sparkles, Home, Link2, BarChart3, User, Target,
  Video, Mic, MicOff, Camera, RefreshCw, Sun, Moon, Leaf, Coffee, Terminal,
  ChevronRight, Volume2, ShieldCheck, CheckCircle2, Settings, X, Check
} from 'lucide-react';
import { useTheme, ThemeName } from '@/contexts/ThemeContext';
import Link from 'next/link';
import VoiceAgent from '../../Learn_English/components/VoiceAgent';
import VideoAnalysisPanel from './VideoAnalysisPanel';
import { UserProfile, ModuleType } from '../../Learn_English/types';
import { INITIAL_USER } from '../../Learn_English/constants';
import {
  InterviewSettings,
  VoiceSpeed,
  VoiceId,
  PressureStyle,
  ResponseTiming,
  VOICE_SPEEDS,
  VOICE_SPEED_LABELS,
  PRESSURE_STYLE_OPTIONS,
  RESPONSE_TIMING_OPTIONS,
  DEFAULT_SETTINGS,
} from '@/types/interviewSettings';
import {
  getInterviewSettings,
  saveInterviewSettings,
} from '@/lib/interviewSettingsStore';

const TABS = [
  { label: 'Quick Links', icon: Link2, href: '/train', tabColor: '#8B5CF6' },
  { label: 'Practice', icon: Target, href: '/train/hr', tabColor: '#10B981' },
  { label: 'Home', icon: Home, href: '/train', tabColor: '#7C3AED' },
  { label: 'Analytics', icon: BarChart3, href: '/analytics', tabColor: '#F97316' },
  { label: 'Profile', icon: User, href: '/profile', tabColor: '#0EA5E9' },
];

export default function MobileSessionPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const company = searchParams.get('company') || 'Company';
  const role = searchParams.get('role') || 'Software Engineer';
  const experience = searchParams.get('experience') || 'Fresher';
  const roundType = searchParams.get('roundType') || 'Technical';

  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [settings, setSettings] = useState<InterviewSettings>(DEFAULT_SETTINGS);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  // Load settings on mount
  useEffect(() => {
    setSettings(getInterviewSettings());
  }, []);

  const updateSetting = (patch: Partial<InterviewSettings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    saveInterviewSettings(next);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('fluenzy_settings_updated', { detail: next }));
    }
  };

  /* ── Per-theme colour tokens matching MobileTrainPage & MobileCompanyPage ── */
  const ACCENT: Record<string, string> = {
    light: '#5A2D82',
    parchment: '#5A2D82',
    dark: '#7C3AED',
    midnight: '#7C3AED',
    forest: '#F59E0B',
    codeterm: '#CC4125',
  };
  const CARD_BG: Record<string, string> = {
    light: '#F8FAFC',
    parchment: '#FFFFFF',
    dark: '#161B2E',
    midnight: 'rgba(15,39,68,0.9)',
    forest: 'rgba(17,28,20,0.9)',
    codeterm: '#141414',
  };
  const PAGE_BG: Record<string, string> = {
    light: '#FFFFFF',
    parchment: 'hsl(42 18% 93%)',
    dark: '#0D0F1A',
    midnight: '#0a1929',
    forest: '#0b140e',
    codeterm: '#0D0D0D',
  };
  const TILE_BG: Record<string, string> = {
    light: '#F1F5F9',
    parchment: '#FCFBF8',
    dark: '#1E243B',
    midnight: '#112240',
    forest: '#142318',
    codeterm: '#1E1E1E',
  };
  const TEXT_HEX: Record<string, string> = {
    light: '#0F0B2E',
    parchment: '#1C1917',
    dark: '#F1F5F9',
    midnight: '#F1F5F9',
    forest: '#e8e4d9',
    codeterm: '#F0EDE8',
  };
  const MUTED_HEX: Record<string, string> = {
    light: '#6B7280',
    parchment: '#57534E',
    dark: '#94A3B8',
    midnight: '#94A3B8',
    forest: '#9aad8e',
    codeterm: '#888580',
  };
  const BORDER_HEX: Record<string, string> = {
    light: '#E5E7EB',
    parchment: '#E6E2D8',
    dark: 'rgba(255,255,255,0.08)',
    midnight: 'rgba(255,255,255,0.08)',
    forest: 'rgba(180,120,30,0.2)',
    codeterm: 'rgba(204,65,37,0.25)',
  };

  const t = (resolvedTheme as string) || 'dark';

  const accentHex = ACCENT[t] || '#7C3AED';
  const cardBgHex = CARD_BG[t] || '#FFFFFF';
  const pageBgHex = PAGE_BG[t] || '#FFFFFF';
  const tileBgHex = TILE_BG[t] || '#FFFFFF';
  const textHex = TEXT_HEX[t] || '#1C1917';
  const mutedHex = MUTED_HEX[t] || '#57534E';
  const borderHex = BORDER_HEX[t] || '#E5E7EB';
  const isDarkTheme = resolvedTheme === 'dark' || resolvedTheme === 'midnight' || resolvedTheme === 'forest' || resolvedTheme === 'codeterm';
  const isLight = !isDarkTheme;

  const user: UserProfile = {
    ...INITIAL_USER,
    id: session?.user?.email || 'u1',
    name: session?.user?.name || 'User',
    email: session?.user?.email || 'user@example.com',
    picture: session?.user?.image || undefined,
  };

  const VOICE_OPTIONS: { id: VoiceId; name: string }[] = [
    { id: 'priya', name: 'Priya' },
    { id: 'arjun', name: 'Arjun' },
    { id: 'sarah', name: 'Sarah' },
    { id: 'marcus', name: 'Marcus' },
  ];

  const getPillStyle = (isSelected: boolean) => {
    const textColor = isSelected ? '#FFFFFF' : (isDarkTheme ? '#F1F5F9' : '#1C1917');
    return {
      background: isSelected ? '#5B21E6' : (isDarkTheme ? '#1E243B' : '#E2E8F0'),
      color: textColor,
      WebkitTextFillColor: textColor,
      borderColor: isSelected ? '#5B21E6' : (isDarkTheme ? 'rgba(255,255,255,0.12)' : '#CBD5E1'),
    };
  };

  // Helper for safe navigation: if interview is active, end & save session first!
  const triggerSafeNavigate = (targetUrl: string = '/train') => {
    if (isInterviewActive) {
      console.log('[SAFE_NAV] Interview is active — triggering end session & save before navigating to:', targetUrl);
      window.dispatchEvent(new CustomEvent('fluenzy_end_session_and_save', { detail: { targetUrl } }));
    } else {
      if (targetUrl === 'back') {
        router.back();
      } else {
        router.push(targetUrl);
      }
    }
  };

  // Intercept hardware / browser back button when interview is active
  useEffect(() => {
    if (!isInterviewActive) return;

    const handlePopState = () => {
      console.log('[SAFE_POPSTATE] Browser back pressed during active interview — saving session');
      window.dispatchEvent(new CustomEvent('fluenzy_end_session_and_save', { detail: { targetUrl: '/train' } }));
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isInterviewActive]);

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col sm:hidden overflow-hidden"
      style={{ background: pageBgHex }}
    >
      {/* ── TOP HEADER (With Settings Gear Button) ─────────────────────────── */}
      <div
        className="px-4 pt-4 pb-3 shrink-0 flex items-center justify-between border-b"
        style={{ background: pageBgHex, borderColor: borderHex }}
      >
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => triggerSafeNavigate('back')}
            className="p-1.5 -ml-1 rounded-full flex items-center justify-center active:opacity-60"
            style={{ color: textHex }}
            aria-label="Back"
          >
            <ArrowLeft size={20} style={{ color: textHex, stroke: textHex }} />
          </button>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight leading-tight" style={{ color: textHex }}>
              {company} Interview Session
            </h1>
            <p className="text-[10px] font-medium leading-none mt-0.5" style={{ color: mutedHex }}>
              {role} • {roundType} • {experience}
            </p>
          </div>
        </div>

        {/* Settings Gear Button */}
        <button
          onClick={() => setSettingsModalOpen(true)}
          className="w-9 h-9 rounded-xl active:opacity-60 flex items-center justify-center border shadow-sm transition-transform active:scale-95"
          style={{
            color: textHex,
            background: cardBgHex,
            borderColor: borderHex,
          }}
          aria-label="Interview Settings"
        >
          <Settings size={18} style={{ color: textHex, stroke: textHex, fill: 'none' }} />
        </button>
      </div>

      {/* ── MAIN SCROLLABLE CONTENT AREA ────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-3.5 pt-2.5 pb-32 space-y-3">
        {/* AI Video & Expression Analysis Panel (Top - Compact Design) */}
        <div
          className="rounded-2xl border p-2.5 shadow-md overflow-hidden"
          style={{ background: cardBgHex, borderColor: borderHex }}
        >
          <div className="flex items-center justify-between mb-1.5 px-0.5">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isInterviewActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              <span className="text-xs font-extrabold" style={{ color: textHex }}>
                AI Video & Expression Analysis
              </span>
            </div>
            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full text-white" style={{ background: accentHex }}>
              {isInterviewActive ? 'Live Stream' : 'Ready'}
            </span>
          </div>

          <VideoAnalysisPanel
            sessionId={sessionId}
            isActive={isInterviewActive}
            isCompact={true}
          />
        </div>

        {/* Voice Agent & Live Interview Workspace (Directly Below Compact Video Panel) */}
        <div
          className="rounded-2xl border p-3.5 shadow-md overflow-hidden"
          style={{ background: cardBgHex, borderColor: borderHex }}
        >
          <VoiceAgent
            user={user}
            onSessionEnd={() => setIsInterviewActive(false)}
            onInterviewStart={() => setIsInterviewActive(true)}
            showSettings={showSettings}
            onShowSettingsChange={setShowSettings}
          />
        </div>
      </div>

      {/* ── FLOATING ASK AI BUTTON ─────────────────────────────────────────── */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={() => triggerSafeNavigate('/train/chat')}
        className="fixed right-5 z-[210] sm:hidden w-14 h-14 rounded-full flex flex-col items-center justify-center gap-0.5 active:scale-95"
        style={{
          bottom: '80px',
          background: '#6C2BD9',
          boxShadow: '0 8px 24px rgba(108,43,217,0.5)',
        }}
        aria-label="Ask AI"
      >
        <Sparkles size={18} className="text-white" />
        <span className="text-white font-black tracking-wide" style={{ fontSize: '8px' }}>Ask AI</span>
      </motion.button>

      {/* ── FLOATING BOTTOM TAB BAR ────────────────────────────────────────── */}
      <nav
        className="fixed z-[210] sm:hidden flex items-center justify-around px-2"
        style={{
          bottom: isLight ? '12px' : '0px',
          left: isLight ? '12px' : '0px',
          right: isLight ? '12px' : '0px',
          height: '64px',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          background: isLight ? '#FFFFFF' : cardBgHex,
          borderRadius: isLight ? '24px' : '0px',
          borderTop: isLight ? '1px solid #E2E8F0' : `1px solid ${borderHex}`,
          boxShadow: isLight ? '0 8px 32px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.07)' : '0 -4px 24px rgba(0,0,0,0.12)',
        }}
      >
        {TABS.map((tab) => {
          const isHome = tab.label === 'Home';
          const activeColor = isLight ? '#7C3AED' : '#7C3AED';
          const inactiveIconColor = isLight ? '#475569' : mutedHex;
          const inactiveTextColor = isLight ? '#334155' : mutedHex;

          const iconColor = isHome ? activeColor : inactiveIconColor;
          const textColor = isHome ? activeColor : inactiveTextColor;

          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => triggerSafeNavigate(tab.href)}
              className="flex flex-col items-center justify-center gap-1 flex-1 min-w-[52px] h-full active:opacity-70"
              aria-label={tab.label}
            >
              {isHome ? (
                <div
                  className="w-11 h-8 rounded-2xl flex items-center justify-center shadow-sm"
                  style={{
                    background: isLight ? '#EDE9FE' : 'linear-gradient(90deg,#7C3AED,#4F46E5)',
                  }}
                >
                  <tab.icon size={18} style={{ color: isLight ? '#7C3AED' : '#FFFFFF', stroke: isLight ? '#7C3AED' : '#FFFFFF' }} />
                </div>
              ) : (
                <tab.icon size={22} style={{ color: iconColor, stroke: iconColor }} />
              )}
              <span
                className="font-extrabold"
                style={{
                  fontSize: '10px',
                  color: textColor,
                  WebkitTextFillColor: textColor,
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
      {/* ── INTERVIEW SETTINGS MODAL SHEET ───────────────────────────────────── */}
      <AnimatePresence>
        {settingsModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[240]"
              onClick={() => setSettingsModalOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed bottom-0 left-0 right-0 z-[250] rounded-t-3xl p-5 pb-8 max-h-[85vh] overflow-y-auto shadow-2xl space-y-4"
              style={{ background: cardBgHex, borderTop: `1px solid ${borderHex}` }}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: borderHex }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${accentHex}18` }}>
                    <Settings size={18} style={{ color: accentHex }} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base leading-tight" style={{ color: textHex }}>
                      Voice & Interview Settings
                    </h3>
                    <p className="text-[11px] font-medium mt-0.5" style={{ color: mutedHex }}>
                      Customize voice speed, style, and AI response timing
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSettingsModalOpen(false)}
                  className="p-2 rounded-full active:opacity-60 flex items-center justify-center shrink-0"
                  style={{ color: textHex }}
                >
                  <X size={20} style={{ color: textHex }} />
                </button>
              </div>

              {/* Setting 1: Speed */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider block mb-2" style={{ color: textHex }}>
                  Speed
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {VOICE_SPEEDS.map((speed) => {
                    const isSelected = settings.voiceSpeed === speed;
                    const styleObj = getPillStyle(isSelected);
                    return (
                      <button
                        key={speed}
                        type="button"
                        onClick={() => updateSetting({ voiceSpeed: speed as VoiceSpeed })}
                        className="h-10 rounded-xl text-xs font-extrabold border transition-all flex items-center justify-center shadow-sm"
                        style={styleObj}
                      >
                        <span style={{ color: styleObj.color, WebkitTextFillColor: styleObj.WebkitTextFillColor }}>
                          {speed === 1 ? '● 1x' : `${speed}x`}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] font-medium mt-1.5" style={{ color: mutedHex }}>
                  {VOICE_SPEED_LABELS[settings.voiceSpeed] || 'Normal interview pace'}
                </p>
              </div>

              {/* Setting 2: Voice */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider block mb-2" style={{ color: textHex }}>
                  Voice
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {VOICE_OPTIONS.map((v) => {
                    const isSelected = settings.voiceId === v.id;
                    const styleObj = getPillStyle(isSelected);
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => updateSetting({ voiceId: v.id })}
                        className="h-10 rounded-xl text-xs font-extrabold border transition-all flex items-center justify-center gap-1 shadow-sm"
                        style={styleObj}
                      >
                        <span style={{ color: styleObj.color, WebkitTextFillColor: styleObj.WebkitTextFillColor }}>
                          {v.name}
                        </span>
                        {isSelected && <Check size={13} style={{ color: '#FFFFFF' }} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Setting 3: Style */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider block mb-2" style={{ color: textHex }}>
                  Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PRESSURE_STYLE_OPTIONS.map((opt) => {
                    const isSelected = settings.pressureStyle === opt.id;
                    const styleObj = getPillStyle(isSelected);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => updateSetting({ pressureStyle: opt.id as PressureStyle })}
                        className="h-11 px-2 rounded-xl text-xs font-extrabold border transition-all flex items-center justify-center gap-1.5 shadow-sm"
                        style={styleObj}
                      >
                        <span style={{ color: styleObj.color, WebkitTextFillColor: styleObj.WebkitTextFillColor }}>
                          {opt.emoji}
                        </span>
                        <span
                          className="truncate"
                          style={{ color: styleObj.color, WebkitTextFillColor: styleObj.WebkitTextFillColor }}
                        >
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Setting 4: AI Response Time */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider block mb-2" style={{ color: textHex }}>
                  AI Response Time
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {RESPONSE_TIMING_OPTIONS.map((opt) => {
                    const isSelected = settings.responseTiming === opt.id;
                    const styleObj = getPillStyle(isSelected);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => updateSetting({ responseTiming: opt.id as ResponseTiming })}
                        className="h-11 px-2 rounded-xl text-xs font-extrabold border transition-all flex items-center justify-center gap-1.5 shadow-sm"
                        style={styleObj}
                      >
                        <span style={{ color: styleObj.color, WebkitTextFillColor: styleObj.WebkitTextFillColor }}>
                          {opt.emoji}
                        </span>
                        <span
                          className="truncate"
                          style={{ color: styleObj.color, WebkitTextFillColor: styleObj.WebkitTextFillColor }}
                        >
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] font-medium mt-1.5 leading-snug" style={{ color: mutedHex }}>
                  Controls if the AI replies immediately as soon as you speak, or takes a pause.
                </p>
              </div>

              {/* Setting 5: Theme Option Selector */}
              <div className="pt-3 border-t" style={{ borderColor: borderHex }}>
                <label className="text-xs font-black uppercase tracking-wider block mb-2" style={{ color: textHex }}>
                  App Theme
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Light', value: 'light', icon: Sun },
                    { label: 'Dark', value: 'dark', icon: Moon },
                    { label: 'Night', value: 'midnight', icon: Sparkles },
                    { label: 'Forest', value: 'forest', icon: Leaf },
                    { label: 'Parchment', value: 'parchment', icon: Coffee },
                    { label: 'Code', value: 'codeterm', icon: Terminal },
                  ].map((opt) => {
                    const active = theme === opt.value;
                    const styleObj = getPillStyle(active);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setTheme(opt.value as ThemeName)}
                        className="h-10 px-2 rounded-xl text-xs font-extrabold border transition-all flex items-center justify-center gap-1.5 shadow-sm"
                        style={styleObj}
                      >
                        <opt.icon size={13} style={{ color: styleObj.color }} />
                        <span style={{ color: styleObj.color, WebkitTextFillColor: styleObj.WebkitTextFillColor }}>
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
