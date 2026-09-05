'use client';

import { useEffect, useState, type ElementType } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useTheme, themeConfig, ThemeName } from '@/contexts/ThemeContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, ChevronRight, Home, Link2,
  BarChart3, User, Target, Users, Code,
  Sparkles, Sun, Moon, Leaf, Coffee, Terminal, UserCheck, Shuffle, Lock, Radio,
} from 'lucide-react';
import MobileLiveTrainPage from '@/components/MobileLiveTrainPage';

/* ─── Theme option list ──────────────────────────────────────────────────── */
const THEME_OPTIONS: { value: ThemeName; label: string; icon: typeof Moon }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'midnight', label: 'Night', icon: Sparkles },
  { value: 'forest', label: 'Forest', icon: Leaf },
  { value: 'parchment', label: 'Parchment', icon: Coffee },
  { value: 'codeterm', label: 'Code', icon: Terminal },
];

interface CardDef {
  id: string;
  title: string;
  description: string;
  icon: ElementType;
  accent: string;
  badge: string;
  badgeColor: string;
  borderColor: string;
  href: string;
  moduleKey: string;
  onClick?: () => void;
}

function useMobileBreakpoint() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

export default function LiveTrainPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { resolvedTheme, theme, setTheme } = useTheme();

  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  const isLight = resolvedTheme === 'light' || resolvedTheme === 'parchment';
  const t = resolvedTheme as string;

  /* ── Per-theme colour tokens — matching MobileTrainPage exactly ────────── */
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
  const TEXT_HEX: Record<string, string> = {
    light: '#0F0B2E',
    parchment: '#212529',
    dark: '#F1F5F9',
    midnight: '#F1F5F9',
    forest: '#e8e4d9',
    codeterm: '#F0EDE8',
  };
  const MUTED_HEX: Record<string, string> = {
    light: '#6B7280',
    parchment: '#6C757D',
    dark: '#94A3B8',
    midnight: '#94A3B8',
    forest: '#9aad8e',
    codeterm: '#888580',
  };
  const BORDER_HEX: Record<string, string> = {
    light: '#E5E7EB',
    parchment: '#E9ECEF',
    dark: 'rgba(255,255,255,0.08)',
    midnight: 'rgba(255,255,255,0.08)',
    forest: 'rgba(180,120,30,0.2)',
    codeterm: 'rgba(204,65,37,0.25)',
  };

  const accentHex = ACCENT[t] ?? '#7C3AED';
  const cardBgHex = CARD_BG[t] ?? '#161B2E';
  const pageBgHex = PAGE_BG[t] ?? '#0D0F1A';
  const textHex = TEXT_HEX[t] ?? '#F1F5F9';
  const mutedHex = MUTED_HEX[t] ?? '#94A3B8';
  const borderHex = BORDER_HEX[t] ?? 'rgba(255,255,255,0.08)';

  const firstName = session?.user?.name?.split(' ')[0] || 'there';
  const avatarUrl = session?.user?.image;

  const liveCards: CardDef[] = [
    {
      id: 'live-interview',
      title: 'Live Interview',
      description: 'Get matched 1:1 instantly with a real participant for a live interview.',
      icon: UserCheck,
      accent: '#22C55E',
      badge: 'Live',
      badgeColor: 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/25',
      borderColor: 'border-[#22C55E]/20',
      href: '/train/interview/live',
      moduleKey: 'interview',
    },
    {
      id: 'random-gd',
      title: 'Random GD Match',
      description: 'Get matched instantly in a random group discussion with real participants.',
      icon: Shuffle,
      accent: '#3B82F6',
      badge: 'Live',
      badgeColor: 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/25',
      borderColor: 'border-[#3B82F6]/20',
      href: '/train/live-gd',
      moduleKey: 'gdRandom',
    },
    {
      id: 'private-gd',
      title: 'Private GD',
      description: 'Create a private room and invite friends or classmates via a unique link.',
      icon: Lock,
      accent: '#EC4899',
      badge: 'Invite-Only',
      badgeColor: 'bg-[#7C3AED]/15 text-[#A78BFA] border-[#7C3AED]/25',
      borderColor: 'border-[#EC4899]/20',
      href: '/train/gd/private',
      moduleKey: 'gdPrivate',
    },
    {
      id: 'private-interview',
      title: 'Private Interview',
      description: 'Host a structured interview room and invite specific people via a link.',
      icon: Users,
      accent: '#7C3AED',
      badge: 'Invite-Only',
      badgeColor: 'bg-[#7C3AED]/15 text-[#A78BFA] border-[#7C3AED]/25',
      borderColor: 'border-[#7C3AED]/20',
      href: '/train/interview/private',
      moduleKey: 'interview',
    },
  ];

  const handleCardClick = (card: CardDef) => {
    if (card.onClick) {
      card.onClick();
    } else {
      router.push(card.href);
    }
  };

  const LogoContainer = () => (
    <div className="flex items-center justify-center shrink-0">
      <img
        src="/white-removebg-preview1.png"
        alt="Fluenzy AI Logo"
        className="w-9 h-9 object-contain filter drop-shadow-sm active:scale-95 transition-transform"
      />
    </div>
  );

  const ThemeIcon = () => {
    const iconColor = isLight ? '#1C1917' : '#F8FAFC';
    const icons: Record<ThemeName, React.ReactNode> = {
      light: <Sun size={18} style={{ color: iconColor, stroke: iconColor }} />,
      dark: <Moon size={18} style={{ color: iconColor, stroke: iconColor }} />,
      midnight: <Sparkles size={18} style={{ color: iconColor, stroke: iconColor }} />,
      forest: <Leaf size={18} style={{ color: iconColor, stroke: iconColor }} />,
      parchment: <Coffee size={18} style={{ color: iconColor, stroke: iconColor }} />,
      codeterm: <Terminal size={18} style={{ color: iconColor, stroke: iconColor }} />,
    };
    return <>{icons[theme] || <Moon size={18} style={{ color: iconColor, stroke: iconColor }} />}</>;
  };

  const isMobile = useMobileBreakpoint();
  if (isMobile === null) return null;

  // Mobile layout: render dedicated mobile dashboard (≤ 640 px)
  if (isMobile) return <MobileLiveTrainPage />;

  return (
    <div className="min-h-screen" style={{ background: pageBgHex }}>
      <div className="flex-1">
        {/* ── TOP HEADER — matches MobileTrainPage's header exactly ──────── */}
        <header
          className="h-16 border-b flex items-center justify-between px-8"
          style={{
            borderColor: isLight ? 'transparent' : borderHex,
            background: isLight ? pageBgHex : cardBgHex,
            boxShadow: isLight ? 'none' : '0 1px 6px rgba(0,0,0,0.12)',
          }}
        >
          <div className="flex items-center gap-3">
            <LogoContainer />
            <span
              className="font-black text-xl tracking-tight"
              style={{ background: 'linear-gradient(90deg,#7C3AED,#4F46E5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              Fluenzy AI
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme switcher — animated dropdown, identical to MobileTrainPage */}
            <div className="relative">
              <button
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                className="p-2 rounded-xl active:opacity-60 flex items-center justify-center border shadow-sm transition-transform active:scale-95"
                style={{
                  color: isLight ? '#1C1917' : '#F8FAFC',
                  background: isLight ? '#FFFFFF' : 'rgba(255,255,255,0.08)',
                  borderColor: isLight ? '#CBD5E1' : borderHex,
                }}
                aria-label="Change theme"
              >
                <ThemeIcon />
              </button>

              <AnimatePresence>
                {themeMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-[300]" onClick={() => setThemeMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-1 rounded-xl overflow-hidden shadow-2xl z-[310]"
                      style={{ width: '160px', background: isLight ? '#FFFFFF' : cardBgHex, border: `1px solid ${isLight ? '#CBD5E1' : borderHex}` }}
                    >
                      {THEME_OPTIONS.map((opt) => {
                        const active = theme === opt.value;
                        const itemTextColor = active
                          ? accentHex
                          : (isLight ? '#1C1917' : '#E2E8F0');
                        const itemIconColor = active
                          ? accentHex
                          : (isLight ? '#475569' : '#94A3B8');

                        return (
                          <button
                            key={opt.value}
                            onClick={() => { setTheme(opt.value); setThemeMenuOpen(false); }}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-extrabold transition-colors"
                            style={{
                              color: itemTextColor,
                              WebkitTextFillColor: itemTextColor,
                              background: active
                                ? (isLight ? '#F3E8FF' : `${accentHex}25`)
                                : 'transparent',
                            }}
                          >
                            <opt.icon size={16} style={{ color: itemIconColor, stroke: itemIconColor }} />
                            <span>{opt.label}</span>
                          </button>
                        );
                      })}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Bell */}
            <Link
              href="/notifications"
              className="relative p-2 rounded-xl active:opacity-60 flex items-center justify-center"
              style={{
                color: isLight ? '#0F172A' : '#F8FAFC',
                background: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)',
              }}
              aria-label="Notifications"
            >
              <Bell size={20} style={{ color: isLight ? '#0F172A' : '#F8FAFC', stroke: isLight ? '#0F172A' : '#F8FAFC' }} />
              <span
                className="absolute -top-0.5 -right-0.5 w-5 h-5 text-white text-[9px] font-black rounded-full flex items-center justify-center"
                style={{ background: '#7C3AED' }}
              >
                3
              </span>
            </Link>

            {/* Avatar */}
            <button
              onClick={() => router.push('/profile')}
              className="w-9 h-9 rounded-xl overflow-hidden border-2 flex items-center justify-center active:opacity-80"
              style={{ borderColor: '#C4B5FD', background: 'linear-gradient(135deg,#7C3AED,#4F46E5)' }}
              aria-label="Profile"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt={firstName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span className="text-white font-black text-sm">{firstName[0]?.toUpperCase()}</span>
              )}
            </button>
          </div>
        </header>

        {/* ── BODY — structure unchanged from before ──────────────────────── */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 py-10">
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold" style={{ color: textHex }}>Live Practice Modes</h1>
              <p className="text-sm" style={{ color: mutedHex }}>Choose a mode to start practicing with real participants.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {liveCards.map((card) => {
                const Icon = card.icon;
                return (
                  <motion.button
                    key={card.id}
                    onClick={() => handleCardClick(card)}
                    className={`relative flex flex-col items-start p-5 rounded-2xl border text-left transition-all duration-150 hover:-translate-y-1 ${card.borderColor}`}
                    style={{
                      background: cardBgHex,
                      boxShadow: isLight ? '0 2px 12px rgba(0,0,0,0.06)' : '0 2px 8px rgba(0,0,0,0.2)',
                    }}
                  >
                    <div className="flex items-start justify-between w-full mb-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${card.accent}18` }}>
                        <Icon size={22} style={{ color: card.accent, stroke: card.accent }} />
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${card.badgeColor}`}>
                        {card.badge}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold mb-1 leading-tight" style={{ color: textHex }}>{card.title}</h3>
                    <p className="text-[11px] leading-relaxed line-clamp-2 mb-4" style={{ color: mutedHex }}>{card.description}</p>

                    <div className="mt-auto flex items-center justify-end w-full">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center border" style={{ borderColor: isLight ? '#CBD5E1' : 'rgba(255,255,255,0.1)', background: isLight ? '#F8FAFC' : 'rgba(255,255,255,0.04)' }}>
                        <ChevronRight size={16} style={{ color: isLight ? '#475569' : '#94A3B8', stroke: isLight ? '#475569' : '#94A3B8' }} />
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-8 p-5 rounded-2xl border flex items-center justify-between" style={{ background: cardBgHex, borderColor: borderHex }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: isLight ? '#F3E8FF' : 'rgba(124,58,237,0.15)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <p className="text-sm font-bold leading-tight" style={{ color: textHex }}>Real people. Real conversations. Real growth.</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <div className="flex -space-x-2">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 flex items-center justify-center" style={{ borderColor: isLight ? '#FFFFFF' : cardBgHex, background: 'linear-gradient(135deg,#7C3AED,#4F46E5)' }}>
                      <span className="text-white text-[10px] font-black">{String.fromCharCode(65 + i)}</span>
                    </div>
                  ))}
                </div>
                <span className="text-[10px] font-bold text-white bg-[#7C3AED] px-2 py-0.5 rounded-full">+24</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}