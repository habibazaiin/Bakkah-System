// src/components/layout/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Sidebar from './Sidebar';
import { SITE_DATA } from '@/constants/site';
import { supabase } from '@/lib/supabase'; // تأكدي من مسار السوبابيز
import { AuthService } from '@/services/auth.service';

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. جلب حالة اليوزر الحالية
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setIsLoading(false);
    };
    fetchUser();

    // 2. مراقبة أي تغيير في حالة التسجيل (لوج ان / لوج اوت)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await AuthService.signOut();
      window.location.href = '/'; // توجيه للصفحة الرئيسية بعد الخروج
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-24 flex items-center justify-between">
          
          {/* Logo & Menu Toggle */}
          <div className="flex items-center gap-4 sm:gap-6 flex-1">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2.5 rounded-xl text-[#1E5A7A] bg-[#F8FAFC] hover:bg-[#E8EFF3] transition-colors border border-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <Link href={SITE_DATA.links.home} className="flex items-center transform transition-transform hover:scale-105">
              <Image src="/bakkah-logo.png" alt={SITE_DATA.name} width={180} height={60} className="h-10 sm:h-14 w-auto object-contain" priority />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center gap-8 flex-1">
            <Link href={SITE_DATA.links.home} className="text-sm font-bold text-[#1E5A7A] hover:text-[#B03052] transition-colors">Home</Link>
            <Link href={SITE_DATA.links.about} className="text-sm font-bold text-gray-600 hover:text-[#1E5A7A] transition-colors">About Us</Link>
            <Link href={SITE_DATA.links.services} className="text-sm font-bold text-gray-600 hover:text-[#1E5A7A] transition-colors">Services</Link>
            <Link href={SITE_DATA.links.contact} className="text-sm font-bold text-gray-600 hover:text-[#1E5A7A] transition-colors">Contact</Link>
          </nav>

          {/* Auth Buttons / User Profile */}
          <div className="flex flex-1 items-center justify-end gap-3 sm:gap-4">
            {!isLoading && (
              user ? (
                // لو عامل تسجيل دخول
                <div className="flex items-center gap-4 animate-fade-in-up">
                  <div className="hidden sm:flex flex-col items-end mr-2">
                    <span className="text-sm font-bold text-[#1F2937] leading-tight">
                      {user.user_metadata?.username || 'Welcome'}
                    </span>
                    <span className="text-xs text-green-600 font-semibold tracking-wider">Online</span>
                  </div>
                  
                  {/* الأيقونة الدائرية للاسم */}
                  <div className="relative group cursor-pointer">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-tr from-[#1E5A7A] to-[#2A6B8F] text-white rounded-full flex items-center justify-center text-lg font-black shadow-md border-2 border-white transform transition-transform group-hover:scale-105">
                      {user.user_metadata?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    
                    {/* Tooltip صغير لتسجيل الخروج السريع في الشاشات الكبيرة */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100">
                      <div className="p-3">
                        <p className="text-xs text-gray-500 font-medium mb-2 px-2">Signed in as <br/><strong className="text-[#1E5A7A]">{user.email}</strong></p>
                        <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm font-bold text-[#B03052] hover:bg-red-50 rounded-lg transition-colors">
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // لو مش عامل تسجيل دخول
                <div className="flex items-center gap-2 sm:gap-4 animate-fade-in-up">
                  <Link href={SITE_DATA.links.signIn} className="px-4 py-2 text-sm sm:text-base font-bold text-[#1E5A7A] hover:text-[#B03052] transition-colors hidden sm:block">Sign In</Link>
                  <Link href={SITE_DATA.links.signUp} className="px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-bold text-white bg-gradient-to-r from-[#1E5A7A] to-[#2A6B8F] hover:from-[#2A6B8F] hover:to-[#1E5A7A] rounded-xl shadow-[0_10px_20px_rgba(30,90,122,0.15)] transition-all transform hover:-translate-y-0.5">
                    Get Started
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} user={user} onLogout={handleLogout} />
    </>
  );
}