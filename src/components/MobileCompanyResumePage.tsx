'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Upload, FileText, CheckCircle2, AlertCircle, Loader2,
  ChevronRight, Sparkles, Home, Link2, BarChart3, User, Target, Clipboard
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';
import { ModuleType } from '../../Learn_English/types';

/* ── Bottom Navigation Tabs ─────────────────────────────────────────────── */
const TABS = [
  { label: 'Quick Links', icon: Link2, href: '/train', tabColor: '#8B5CF6' },
  { label: 'Practice', icon: Target, href: '/train/hr', tabColor: '#10B981' },
  { label: 'Home', icon: Home, href: '/train', tabColor: '#7C3AED' },
  { label: 'Analytics', icon: BarChart3, href: '/analytics', tabColor: '#F97316' },
  { label: 'Profile', icon: User, href: '/profile', tabColor: '#0EA5E9' },
];

export default function MobileCompanyResumePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resolvedTheme } = useTheme();

  const company = searchParams.get('company') || 'Target Company';
  const role = searchParams.get('role') || 'Software Engineer';
  const experience = searchParams.get('experience') || 'Fresher';
  const roundType = searchParams.get('roundType') || 'Technical';

  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);

  /* ── Per-theme colour tokens matching MobileTrainPage ───────────────── */
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
    light: '#FFFFFF',                 // Pure white for Light theme!
    parchment: 'hsl(42 18% 93%)',     // Sandal cream for Parchment theme!
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
  const isLight = resolvedTheme === 'light' || resolvedTheme === 'parchment';

  /* Handle File Select & Mock Extraction */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsExtracting(true);
    setExtractionError(null);

    // Simulate extraction or read txt file directly
    if (file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setResumeText(text || '');
        setIsExtracting(false);
      };
      reader.readAsText(file);
    } else {
      setTimeout(() => {
        setIsExtracting(false);
        setResumeText(
          `Extracted resume details for ${file.name}.\nRole Target: ${role}\nSkills: Technical Problem Solving, Teamwork, Communication, Systems Architecture.`
        );
      }, 1200);
    }
  };

  /* Paste Clipboard Text */
  const handleClipboardPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setResumeText(text);
      }
    } catch {
      // Fallback
    }
  };

  /* Launch Interview Session */
  const handleStartSession = (textToUse: string) => {
    router.push(
      `/train/session/${ModuleType.COMPANY_WISE_HR}?company=${encodeURIComponent(company)}` +
      `&role=${encodeURIComponent(role)}` +
      `&experience=${encodeURIComponent(experience)}` +
      `&difficulty=Intermediate` +
      `&roundType=${encodeURIComponent(roundType)}` +
      `&isCompanyWise=true` +
      `&resumeText=${encodeURIComponent(textToUse.slice(0, 1000))}`
    );
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col sm:hidden overflow-hidden"
      style={{ background: pageBgHex }}
    >
      {/* ── HEADER SECTION ─────────────────────────────────────────────────── */}
      <div className="px-4 pt-5 pb-3 shrink-0" style={{ background: pageBgHex }}>
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => router.back()}
            className="p-1.5 -ml-1 rounded-full flex items-center justify-center active:opacity-60"
            style={{ color: textHex }}
            aria-label="Back"
          >
            <ArrowLeft size={22} style={{ color: textHex, stroke: textHex }} />
          </button>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: mutedHex }}>
            Setup Resume
          </span>
        </div>

        <h1 className="text-xl font-black tracking-tight" style={{ color: textHex, WebkitTextFillColor: textHex }}>
          Personalize via Resume
        </h1>
        <p className="text-xs font-medium mt-1 leading-snug" style={{ color: mutedHex }}>
          Upload or paste your resume content to unlock tailored interview questions.
        </p>
      </div>

      {/* ── SELECTION SUMMARY BADGES ────────────────────────────────────────── */}
      <div className="px-4 py-2 shrink-0">
        <div
          className="p-3.5 rounded-2xl border flex flex-col gap-2"
          style={{ background: cardBgHex, borderColor: borderHex }}
        >
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-sm" style={{ color: textHex }}>
              {company} Interview
            </span>
            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full text-white" style={{ background: accentHex }}>
              {roundType === 'Technical' ? 'Technical' : 'HR & Behavioral'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="px-2.5 py-1 rounded-lg border font-semibold text-[11px]" style={{ background: pageBgHex, color: textHex, borderColor: borderHex }}>
              Role: {role}
            </span>
            <span className="px-2.5 py-1 rounded-lg border font-semibold text-[11px]" style={{ background: pageBgHex, color: textHex, borderColor: borderHex }}>
              Exp: {experience}
            </span>
          </div>
        </div>
      </div>

      {/* ── MAIN RESUME SECTION (SCROLLABLE) ───────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-32">
        {/* Tab Selector */}
        <div className="grid grid-cols-2 p-1 rounded-2xl border mb-4" style={{ background: cardBgHex, borderColor: borderHex }}>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className="py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            style={{
              background: activeTab === 'upload' ? accentHex : 'transparent',
              color: activeTab === 'upload' ? '#FFFFFF' : mutedHex,
            }}
          >
            <Upload size={14} />
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className="py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            style={{
              background: activeTab === 'paste' ? accentHex : 'transparent',
              color: activeTab === 'paste' ? '#FFFFFF' : mutedHex,
            }}
          >
            <FileText size={14} />
            Paste Text
          </button>
        </div>

        {/* Tab 1: Upload File */}
        {activeTab === 'upload' && (
          <div className="space-y-4">
            <div className="relative group">
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
                disabled={isExtracting}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt"
              />
              <div
                className="p-8 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center gap-3 transition-all"
                style={{
                  background: cardBgHex,
                  borderColor: fileName ? '#10B981' : borderHex,
                }}
              >
                {isExtracting ? (
                  <Loader2 size={40} className="animate-spin" style={{ color: accentHex }} />
                ) : fileName && resumeText ? (
                  <CheckCircle2 size={40} className="text-emerald-500" />
                ) : (
                  <Upload size={40} style={{ color: mutedHex }} />
                )}

                <div>
                  <p className="font-bold text-sm" style={{ color: textHex }}>
                    {isExtracting
                      ? `Extracting ${fileName}...`
                      : fileName || 'Click or Drag PDF / DOCX'}
                  </p>
                  <p className="text-xs font-medium mt-1" style={{ color: mutedHex }}>
                    {isExtracting
                      ? 'Reading resume contents automatically...'
                      : resumeText
                      ? `✓ ${resumeText.length} characters extracted`
                      : 'AI will analyze your projects & skills.'}
                  </p>
                </div>
              </div>
            </div>

            {resumeText && (
              <div
                className="p-3.5 rounded-2xl border text-xs font-medium space-y-1.5"
                style={{ background: cardBgHex, borderColor: borderHex }}
              >
                <div className="flex items-center justify-between text-[11px] font-bold" style={{ color: mutedHex }}>
                  <span>Extracted Preview</span>
                  <span>{resumeText.length} chars</span>
                </div>
                <p className="line-clamp-3 leading-relaxed" style={{ color: textHex }}>
                  {resumeText}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Paste Text */}
        {activeTab === 'paste' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold" style={{ color: textHex }}>
                Resume Text / Summary
              </label>
              <button
                type="button"
                onClick={handleClipboardPaste}
                className="flex items-center gap-1 text-[11px] font-bold active:opacity-60"
                style={{ color: accentHex }}
              >
                <Clipboard size={12} />
                Paste Clipboard
              </button>
            </div>

            <div
              className="rounded-2xl border p-3"
              style={{ background: cardBgHex, borderColor: borderHex }}
            >
              <textarea
                rows={7}
                placeholder="Paste your resume text, work experience, projects, skills, or LinkedIn summary here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="w-full bg-transparent outline-none text-xs font-medium resize-none leading-relaxed"
                style={{ color: textHex }}
              />
              <div className="flex items-center justify-end text-[10px] font-bold pt-2 border-t" style={{ borderColor: borderHex, color: mutedHex }}>
                <span>{resumeText.length} Characters</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={() => handleStartSession(resumeText)}
            className="w-full h-12 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-transform"
            style={{ background: 'linear-gradient(135deg,#5B21E6,#7C3AED)' }}
          >
            Start Interview Session <ChevronRight size={16} />
          </button>

          <button
            type="button"
            onClick={() => handleStartSession('')}
            className="w-full h-10 rounded-2xl font-bold text-xs flex items-center justify-center transition-colors active:opacity-60"
            style={{ color: mutedHex }}
          >
            Skip Resume & Start Directly
          </button>
        </div>
      </div>

      {/* ── FLOATING ASK AI BUTTON ─────────────────────────────────────────── */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={() => router.push('/train/chat')}
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
      {isLight ? (
        <nav
          className="fixed z-[210] sm:hidden flex items-center justify-around"
          style={{
            bottom: '12px',
            left: '12px',
            right: '12px',
            height: '64px',
            background: '#FFFFFF',
            borderRadius: '24px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.07)',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          }}
        >
          {TABS.map((tab) => {
            const isHome = tab.label === 'Home';
            return (
              <Link
                key={tab.label}
                href={tab.href}
                className="flex flex-col items-center justify-center gap-1 flex-1 h-full active:opacity-70"
                aria-label={tab.label}
              >
                {isHome ? (
                  <div
                    className="w-11 h-8 rounded-2xl flex items-center justify-center"
                    style={{ background: '#EDE9FE' }}
                  >
                    <tab.icon size={18} style={{ color: tab.tabColor }} />
                  </div>
                ) : (
                  <tab.icon size={22} style={{ color: tab.tabColor }} />
                )}
                <span
                  className="font-semibold"
                  style={{ fontSize: '10px', color: isHome ? tab.tabColor : '#495057' }}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </nav>
      ) : (
        <nav
          className="fixed bottom-0 left-0 right-0 z-[210] sm:hidden flex items-center justify-around px-2"
          style={{
            height: '64px',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            background: cardBgHex,
            borderTop: `1px solid ${borderHex}`,
            boxShadow: '0 -4px 24px rgba(0,0,0,0.12)',
          }}
        >
          {TABS.map((tab) => {
            const isHome = tab.label === 'Home';
            return (
              <Link
                key={tab.label}
                href={tab.href}
                className="flex flex-col items-center justify-center gap-1 min-w-[52px] h-full active:opacity-70"
                aria-label={tab.label}
              >
                {isHome ? (
                  <div
                    className="w-12 h-8 rounded-2xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(90deg,#7C3AED,#4F46E5)', boxShadow: '0 4px 12px rgba(124,58,237,0.4)' }}
                  >
                    <tab.icon size={18} className="text-white" />
                  </div>
                ) : (
                  <tab.icon size={22} style={{ color: mutedHex }} />
                )}
                <span className="font-semibold" style={{ fontSize: '10px', color: isHome ? '#7C3AED' : mutedHex }}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
