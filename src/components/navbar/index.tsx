"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Sparkles, X, User, CreditCard, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const handleSignIn = async () => {
    await signIn("google", { callbackUrl: "/train" });
  };

  if (pathname.startsWith('/superadmin')) {
    return null;
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled 
          ? "bg-slate-950/40 backdrop-blur-3xl border-b border-white/5 py-3" 
          : "bg-transparent border-b border-transparent py-6"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div
              className="flex items-center space-x-3 cursor-pointer group"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center relative z-10 shadow-2xl">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60 tracking-tight">
                Fluenzy AI
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-1 p-1.5 bg-white/5 backdrop-blur-3xl rounded-full border border-white/5">
              {session?.user ? (
                <>
                  <NavLink href="/train" active={pathname === '/train'}>Train Now</NavLink>
                  <NavLink href="/history" active={pathname === '/history'}>History</NavLink>
                  <NavLink href="/features" active={pathname === '/features'}>Features</NavLink>
                  <NavLink href="/pricing" active={pathname === '/pricing'}>Pricing</NavLink>
                </>
              ) : (
                <>
                  <NavLink href="/" active={pathname === '/'}>Home</NavLink>
                  <NavLink href="/features" active={pathname === '/features'}>Features</NavLink>
                  <NavLink href="/pricing" active={pathname === '/pricing'}>Pricing</NavLink>
                </>
              )}
            </div>

            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative h-11 w-11 rounded-full p-0.5 bg-gradient-to-br from-purple-500 to-blue-600 shadow-xl overflow-hidden"
                  >
                    <div className="h-full w-full rounded-full bg-slate-900 overflow-hidden flex items-center justify-center">
                      {session.user.image ? (
                        <img src={session.user.image} alt="User" className="h-full w-full object-cover" />
                      ) : (
                        <User className="h-5 w-5 text-white" />
                      )}
                    </div>
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-slate-950/80 backdrop-blur-3xl border border-white/10 rounded-[1.5rem] p-3 mt-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-3 mb-2">
                    <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Authenticated</p>
                    <p className="text-sm font-bold text-white truncate">{session.user.name}</p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{session.user.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-white/5 mx-2" />
                  <div className="p-1 space-y-1">
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all group">
                        <div className="p-2 bg-slate-900 rounded-lg group-hover:bg-purple-500/10 transition-colors">
                          <User className="h-4 w-4 text-slate-400 group-hover:text-purple-400" />
                        </div>
                        <span className="font-semibold text-sm text-slate-300 group-hover:text-white">Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/billing" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all group">
                        <div className="p-2 bg-slate-900 rounded-lg group-hover:bg-blue-500/10 transition-colors">
                          <CreditCard className="h-4 w-4 text-slate-400 group-hover:text-blue-400" />
                        </div>
                        <span className="font-semibold text-sm text-slate-300 group-hover:text-white">Subscription</span>
                      </Link>
                    </DropdownMenuItem>
                  </div>
                  <DropdownMenuSeparator className="bg-white/5 mx-2" />
                  <DropdownMenuItem onClick={() => signOut()} className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 cursor-pointer transition-all group">
                    <div className="p-2 bg-slate-900 rounded-lg group-hover:bg-red-500/20 transition-colors">
                      <LogOut className="h-4 w-4 text-slate-400 group-hover:text-red-400" />
                    </div>
                    <span className="font-bold text-sm text-slate-300 group-hover:text-red-400">Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                size="lg"
                className="bg-white text-black hover:bg-slate-200 font-bold px-8 rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
                onClick={handleSignIn}
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-3 rounded-2xl bg-white/5 border border-white/10 text-white shadow-xl backdrop-blur-xl"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden bg-slate-950/40 backdrop-blur-3xl rounded-[2rem] border border-white/5 mt-4"
            >
              <div className="p-6 space-y-3">
                {session?.user ? (
                  <>
                    <MobileLink href="/train" active={pathname === '/train'}>Train Now</MobileLink>
                    <MobileLink href="/history" active={pathname === '/history'}>History</MobileLink>
                    <MobileLink href="/features" active={pathname === '/features'}>Features</MobileLink>
                    <MobileLink href="/pricing" active={pathname === '/pricing'}>Pricing</MobileLink>
                    <div className="pt-4 border-t border-white/5 mt-4 space-y-3">
                      <MobileLink href="/profile">Profile Settings</MobileLink>
                      <MobileLink href="/billing">Billing & Plan</MobileLink>
                      <button 
                        onClick={() => signOut()}
                        className="w-full flex items-center justify-between p-5 rounded-[1.5rem] bg-red-500/10 text-red-400 font-bold border border-red-500/20"
                      >
                        <span>Sign Out</span>
                        <LogOut className="h-5 w-5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <MobileLink href="/" active={pathname === '/'}>Home</MobileLink>
                    <MobileLink href="/features" active={pathname === '/features'}>Features</MobileLink>
                    <MobileLink href="/pricing" active={pathname === '/pricing'}>Pricing</MobileLink>
                    <div className="pt-6">
                      <Button className="w-full h-14 bg-white text-black font-bold text-lg rounded-2xl" onClick={handleSignIn}>
                        Get Started
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

const NavLink = ({ href, children, active }: { href: string; children: React.ReactNode; active?: boolean }) => (
  <Link
    href={href}
    className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
      active 
        ? "bg-white text-slate-950 shadow-2xl shadow-white/20" 
        : "text-slate-400 hover:text-white"
    }`}
  >
    {children}
  </Link>
);

const MobileLink = ({ href, children, active }: { href: string; children: React.ReactNode; active?: boolean }) => (
  <Link
    href={href}
    className={`block p-5 rounded-[1.5rem] text-lg font-bold transition-all ${
      active 
        ? "bg-white text-slate-950" 
        : "bg-white/5 text-slate-300 border border-white/5"
    }`}
  >
    {children}
  </Link>
);

export default Navbar;
