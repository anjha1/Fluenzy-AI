'use client';

import { usePathname } from 'next/navigation';

import Navbar from '@/components/navbar';

import Footer from '@/components/footer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideFooter = ['/train', '/history', '/features', '/pricing'].some(path => pathname.startsWith(path));
  return (
    <>
      <Navbar />
      {children}
      {!hideFooter && <Footer />}
    </>
  );
}