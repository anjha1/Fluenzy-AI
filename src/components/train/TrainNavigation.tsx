'use client';

import { useTheme, themeConfig } from '@/contexts/ThemeContext';
import { useSession } from 'next-auth/react';
import { Bell, Menu, Moon, Sun, UserRound } from 'lucide-react';

export function TrainNavigation() {
  const { resolvedTheme } = useTheme();
  const { data: session } = useSession();
  const currentTheme = themeConfig[resolvedTheme] || themeConfig.dark;
  const isLight = resolvedTheme === 'parchment' || resolvedTheme === 'light';
  const textColor = isLight ? '#1E1B3A' : '#F8FAFC';
  const controlBackground = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)';

  return (
    <div className={`border-b ${currentTheme.cardBorder} ${isLight ? 'bg-white/80' : 'bg-slate-900/50'} backdrop-blur-sm`}>
      <div className="hidden max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-12 items-center sm:flex">
        <span className={`text-lg font-bold ${isLight ? 'text-[#5B21E6]' : 'bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent'}`}>
          Train
        </span>
      </div>
      <div className="flex h-[76px] items-center justify-between gap-2 px-3 sm:hidden" style={{ color: textColor }}>
        <div className="flex min-w-0 items-center gap-2">
          <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl" style={{ background: controlBackground }} aria-label="Open menu">
            <Menu size={25} />
          </button>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#295D60]">
            <img src="/white-removebg-preview1.png" alt="Fluenzy AI" className="h-10 w-10 object-contain" />
          </div>
          <span className="truncate whitespace-nowrap bg-gradient-to-r from-[#7C3AED] to-[#A855F7] bg-clip-text text-[20px] font-black tracking-tight text-transparent">
            Fluenzy AI
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: controlBackground }} aria-label="Change theme">
            {isLight ? <Sun size={21} /> : <Moon size={21} />}
          </button>
          <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: controlBackground }} aria-label="Notifications">
            <Bell size={23} />
            <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#7C3AED] text-xs font-bold text-white">3</span>
          </button>
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border-2 border-[#A78BFA] bg-[#253454]">
            {session?.user?.image ? <img src={session.user.image} alt={session.user.name || 'Profile'} className="h-full w-full object-cover" /> : <UserRound size={23} />}
          </div>
        </div>
      </div>
    </div>
  );
}
