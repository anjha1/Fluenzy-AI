"use client";

import LearnEnglishWrapper from "@/modules/train/LearnEnglishWrapper";
import MobileCompanyResumePage from "@/components/MobileCompanyResumePage";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";

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

export default function ResumePageClient() {
  const { resolvedTheme } = useTheme();
  const isMobile = useMobileBreakpoint();

  if (isMobile === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0F1A]">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isMobile) {
    return <MobileCompanyResumePage />;
  }

  return <LearnEnglishWrapper mode="company" />;
}
