'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  BarChart3, Bell, ChevronDown, Clock3, FileText, Home, Link2, Menu,
  Coffee, Leaf, Mic, MicOff, Moon, PhoneOff, Sparkles, Sun, Target, Terminal, User, UserRound, Users, Video, Volume2,
} from 'lucide-react';
import { useTheme, ThemeName } from '@/contexts/ThemeContext';
import type {
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  IRemoteAudioTrack,
  IRemoteVideoTrack,
  UID,
} from 'agora-rtc-sdk-ng';

export interface MobileRemoteUser {
  uid: UID;
  audioTrack: IRemoteAudioTrack | null;
  videoTrack: IRemoteVideoTrack | null;
  hasAudio: boolean;
  hasVideo: boolean;
}

interface LiveMobileGDRoomProps {
  userName: string;
  avatarUrl?: string | null;
  topic: string;
  currentPhase: string;
  phaseTimer: number;
  participantNames: string[];
  agoraUid: number;
  localVideoTrack: ICameraVideoTrack | null;
  localAudioTrack: IMicrophoneAudioTrack | null;
  remoteUsers: MobileRemoteUser[];
  isMuted: boolean;
  isVideoOff: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onEndSession: () => void;
}

const TABS = [
  { label: 'Quick Links', icon: Link2, href: '/train' },
  { label: 'Practice', icon: Target, href: '/train/hr' },
  { label: 'Home', icon: Home, href: '/train' },
  { label: 'Analytics', icon: BarChart3, href: '/analytics' },
  { label: 'Profile', icon: User, href: '/profile' },
];

const THEME_OPTIONS: { value: ThemeName; label: string; icon: typeof Moon }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'midnight', label: 'Night', icon: Sparkles },
  { value: 'forest', label: 'Forest', icon: Leaf },
  { value: 'parchment', label: 'Parchment', icon: Coffee },
  { value: 'codeterm', label: 'Code', icon: Terminal },
];

function MediaPlayer({
  videoTrack,
  audioTrack,
  uid,
  local = false,
}: {
  videoTrack: IRemoteVideoTrack | ICameraVideoTrack | null;
  audioTrack: IRemoteAudioTrack | IMicrophoneAudioTrack | null;
  uid: UID;
  local?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !videoTrack) return;
    videoTrack.play(containerRef.current);
    return () => videoTrack.stop();
  }, [videoTrack]);

  useEffect(() => {
    if (!audioTrack || local) return;
    audioTrack.play();
    return () => audioTrack.stop();
  }, [audioTrack, local]);

  return <div ref={containerRef} id={`mobile-player-${uid}`} className="w-full h-full bg-[#16233b]" />;
}

export default function LiveMobileGDRoom({
  userName,
  avatarUrl,
  topic,
  currentPhase,
  phaseTimer,
  participantNames,
  agoraUid,
  localVideoTrack,
  localAudioTrack,
  remoteUsers,
  isMuted,
  isVideoOff,
  onToggleMute,
  onToggleVideo,
  onEndSession,
}: LiveMobileGDRoomProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 640px)');
    const updateViewport = () => setIsMobileViewport(mediaQuery.matches);
    updateViewport();
    mediaQuery.addEventListener('change', updateViewport);
    return () => mediaQuery.removeEventListener('change', updateViewport);
  }, []);

  if (isMobileViewport !== true) return null;

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

  const isLight = resolvedTheme === 'light' || resolvedTheme === 'parchment';
  const pageBg = resolvedTheme === 'parchment' ? '#F3F0EB' : isLight ? '#F8FAFC' : '#050914';
  const surface = isLight ? '#FFFFFF' : '#0B1324';
  const text = isLight ? '#221F1D' : '#FFFFFF';
  const muted = isLight ? '#475569' : '#A5B4FC';
  const accent = isLight ? '#6D3FE8' : '#7C3AED';

  return (
    <div className="min-h-screen pb-24 overflow-x-hidden" style={{ background: pageBg, color: text }}>
      <header className="mx-3 mt-3 rounded-3xl border px-4 py-4 flex items-center justify-between" style={{ background: surface, borderColor: isLight ? '#E4DED5' : 'rgba(129,140,248,0.2)' }}>
        <div className="flex items-center gap-3">
          <button className="w-12 h-12 rounded-2xl bg-[#17243d] flex items-center justify-center" aria-label="Open menu"><Menu size={27} /></button>
          <div className="w-14 h-14 rounded-xl bg-[#295d60] flex items-center justify-center overflow-hidden">
            <img src="/white-removebg-preview1.png" alt="Fluenzy AI" className="w-12 h-12 object-contain" />
          </div>
          <span className="text-[25px] leading-none font-black bg-gradient-to-r from-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent">Fluenzy<br />AI</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button onClick={() => setThemeMenuOpen((open) => !open)} className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: isLight ? 'rgba(0,0,0,0.06)' : '#17243d', color: text }} aria-label="Change theme">
              {resolvedTheme === 'light' || resolvedTheme === 'parchment' ? <Sun size={23} /> : <Moon size={23} />}
            </button>
            {themeMenuOpen && (
              <>
                <div className="fixed inset-0 z-[300]" onClick={() => setThemeMenuOpen(false)} />
                <div className="absolute right-0 top-14 z-[301] w-44 rounded-2xl border p-2 shadow-2xl" style={{ background: surface, borderColor: isLight ? '#E4DED5' : 'rgba(129,140,248,0.2)' }}>
                  {THEME_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    return <button key={option.value} onClick={() => { setTheme(option.value); setThemeMenuOpen(false); }} className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold" style={{ color: text, background: theme === option.value ? `${accent}18` : 'transparent' }}><Icon size={15} />{option.label}</button>;
                  })}
                </div>
              </>
            )}
          </div>
          <button className="relative w-12 h-12 rounded-2xl bg-[#17243d] flex items-center justify-center" aria-label="Notifications">
            <Bell size={26} /><span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[#7C3AED] text-xs font-bold flex items-center justify-center">3</span>
          </button>
          <div className="w-12 h-12 rounded-2xl border-2 border-[#A78BFA] bg-[#253454] overflow-hidden flex items-center justify-center">
            {avatarUrl ? <img src={avatarUrl} alt={userName} className="w-full h-full object-cover" /> : <UserRound size={23} />}
          </div>
        </div>
      </header>

      <main className="px-4 pt-7">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={onEndSession} aria-label="Leave discussion"><span className="text-4xl leading-none">‹</span></button>
            <span className="px-4 py-2 rounded-full border border-rose-500/40 bg-rose-500/10 text-rose-400 font-bold flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" /> Live Discussion
            </span>
          </div>
          <span className="px-3 py-2 rounded-full border border-indigo-400/20 bg-[#0f1b32] text-indigo-200 text-xs font-semibold flex items-center gap-1">
            <Users size={16} /> {remoteUsers.length + 1}
          </span>
        </div>

        <section className="rounded-[28px] border border-indigo-400/20 bg-[#0c172b] p-5 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center"><Clock3 size={31} /></div>
            <div><div className="text-4xl font-mono font-bold text-blue-400">{formatTime(phaseTimer)}</div><div className="text-xs font-semibold text-indigo-200">TIME REMAINING</div></div>
          </div>
          <div className="flex items-start justify-between gap-3">
            <div><div className="text-xs uppercase tracking-wider text-indigo-200 mb-2">Current phase</div><div className="text-xl font-black capitalize">{currentPhase}</div></div>
            <div className="text-right"><div className="text-xs uppercase tracking-wider text-indigo-200 mb-2">Your role</div><div className="font-bold flex items-center gap-1"><FileText size={16} />{topic}<ChevronDown size={16} /></div></div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="relative aspect-video rounded-3xl overflow-hidden border-4 border-[#7437ff] shadow-[0_0_18px_rgba(124,58,237,0.55)]">
            <MediaPlayer videoTrack={localVideoTrack} audioTrack={localAudioTrack} uid={agoraUid} local />
            {isVideoOff && <div className="absolute inset-0 bg-[#16233b] flex items-center justify-center z-10"><div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-3xl font-black">{userName[0]?.toUpperCase()}</div></div>}
            <span className="absolute top-4 right-4 px-4 py-2 rounded-xl bg-slate-600/90 font-bold">You</span>
            <span className="absolute left-4 bottom-4 px-4 py-2 rounded-xl bg-[#071021]/85 font-semibold">{userName}</span>
            <div className="absolute right-4 bottom-4 flex gap-2">
              <span className="w-11 h-11 rounded-full bg-[#07152d]/90 flex items-center justify-center">
                {isMuted ? <MicOff size={20} className="text-rose-400" /> : <Mic size={20} className="text-emerald-400" />}
              </span>
              <span className="w-11 h-11 rounded-full bg-[#07152d]/90 flex items-center justify-center"><Video size={20} /></span>
            </div>
          </div>
          {remoteUsers.slice(0, 3).map((user, index) => (
            <div key={user.uid} className="relative aspect-video rounded-3xl overflow-hidden border border-indigo-500/50">
              <MediaPlayer videoTrack={user.videoTrack} audioTrack={user.audioTrack} uid={user.uid} />
              {!user.hasVideo && <div className="absolute inset-0 bg-[#16233b] flex items-center justify-center z-10"><div className="w-20 h-20 rounded-full bg-slate-600 flex items-center justify-center text-3xl font-black">P</div></div>}
              <span className="absolute left-4 bottom-4 px-4 py-2 rounded-xl bg-[#071021]/85 font-semibold">{participantNames[index + 1] || `Participant ${index + 2}`}</span>
              <div className="absolute right-4 bottom-4 flex gap-2">
                <span className="w-11 h-11 rounded-full bg-[#07152d]/90 flex items-center justify-center">
                  {user.hasAudio ? <Mic size={20} /> : <MicOff size={20} className="text-rose-400" />}
                </span>
                <span className="w-11 h-11 rounded-full bg-[#07152d]/90 flex items-center justify-center"><Video size={20} /></span>
              </div>
            </div>
          ))}
        </section>
      </main>

      <div className="fixed bottom-[76px] left-1/2 -translate-x-1/2 z-40 rounded-3xl border border-indigo-400/10 bg-[#0b1427]/95 backdrop-blur-xl px-3 py-3 flex items-center gap-3 shadow-2xl">
        <button onClick={onToggleMute} className="w-14 h-14 rounded-full bg-[#152440] flex items-center justify-center">{isMuted ? <MicOff className="text-rose-400" /> : <Mic />}</button>
        <button onClick={onToggleVideo} className="w-14 h-14 rounded-full bg-[#152440] flex items-center justify-center">{isVideoOff ? <Video className="text-rose-400" /> : <Video />}</button>
        <button className="w-14 h-14 rounded-full bg-[#152440] flex items-center justify-center"><Volume2 /></button>
        <button onClick={onEndSession} className="h-14 px-5 rounded-full bg-gradient-to-r from-rose-500 to-red-500 font-bold flex items-center gap-2"><PhoneOff size={18} /> End</button>
        <button onClick={() => { window.location.href = '/train/chat'; }} className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.65)]"><Sparkles size={18} /><span className="text-[8px] font-bold">Ask AI</span></button>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-30 h-16 flex items-end justify-around" style={{ paddingBottom: 'env(safe-area-inset-bottom, 4px)' }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg viewBox="0 0 375 64" preserveAspectRatio="none" className="w-full h-full" style={{ filter: isLight ? 'drop-shadow(0 -4px 12px rgba(0,0,0,0.08))' : 'drop-shadow(0 -4px 16px rgba(0,0,0,0.3))' }}>
            <path d="M 0,0 L 132,0 C 152,0 160,24 187.5,24 C 215,24 223,0 243,0 L 375,0 L 375,64 L 0,64 Z" fill={surface} stroke={isLight ? '#E2E8F0' : 'rgba(129,140,248,0.2)'} strokeWidth="1" />
          </svg>
        </div>
        <div className="relative z-10 flex items-center justify-around w-full h-full pt-1 px-1">
          {TABS.map((tab) => {
            const isHome = tab.label === 'Home';
            const Icon = tab.icon;
            return <Link key={tab.label} href={tab.href} className={`flex flex-col items-center justify-center gap-0.5 min-w-[54px] flex-1 ${isHome ? '-mt-5' : 'pb-1'}`}>
              {isHome ? <span className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg" style={{ background: accent, boxShadow: `0 6px 18px ${accent}70` }}><Home size={23} color="#FFFFFF" /></span> : <Icon size={22} style={{ color: muted }} />}
              <span className="text-[10px] font-extrabold" style={{ color: isHome ? accent : muted }}>{tab.label}</span>
            </Link>;
          })}
        </div>
      </nav>
    </div>
  );
}
