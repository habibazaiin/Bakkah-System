'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Sidebar from './Sidebar';
import { SITE_DATA } from '@/constants/site';
import { supabase } from '@/lib/supabase';
import { AuthService } from '@/services/auth.service';

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        setIsAdmin(profile?.role === 'admin');
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setIsLoading(false);
    };

    fetchUserAndRole();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        setIsAdmin(profile?.role === 'admin');
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await AuthService.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
        {/* شيلنا الـ max-w-7xl وخليناها w-full عشان تاخد الشاشة كلها من الطرف للطرف */}
        <div className="w-full px-6 sm:px-10 lg:px-16 h-20 flex items-center justify-between">

          {/* الجزء الأيسر: اللوجو والقائمة (واخدين flex-1 عشان يزقوا للطرف) */}
          <div className="flex-1 flex items-center justify-start gap-5">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2.5 rounded-xl text-[#1E5A7A] bg-gray-50 hover:bg-[#E8EFF3] transition-colors border border-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <Link href={SITE_DATA.links.home} className="flex items-center transform transition-transform hover:scale-105">
              <Image src="/bakkah-logo.png" alt={SITE_DATA.name} width={160} height={50} className="h-10 sm:h-12 w-auto object-contain" priority />
            </Link>
          </div>

          {/* الجزء الأوسط: اللينكات (متمركزة في النص بالظبط) */}
          <nav className="hidden lg:flex items-center justify-center gap-10">
            <Link href={SITE_DATA.links.home} className="text-sm font-bold text-[#1E5A7A] hover:text-[#B03052] transition-colors">Home</Link>
            <Link href={SITE_DATA.links.about} className="text-sm font-bold text-gray-600 hover:text-[#1E5A7A] transition-colors">About Us</Link>
            <Link href={SITE_DATA.links.services} className="text-sm font-bold text-gray-600 hover:text-[#1E5A7A] transition-colors">Services</Link>
            <Link href={SITE_DATA.links.contact} className="text-sm font-bold text-gray-600 hover:text-[#1E5A7A] transition-colors">Contact</Link>
          </nav>

          {/* الجزء الأيمن: المستخدم والأزرار (واخدين flex-1 عشان يزقوا للطرف التاني) */}
          <div className="flex-1 flex items-center justify-end gap-4">
            {!isLoading && (
              user ? (
                <div className="flex items-center gap-4 animate-fade-in-up">

                  {isAdmin && (
                    <Link
                      href="/dashboard"
                      className="hidden lg:flex px-3.5 py-2 text-xs font-black uppercase tracking-wider text-[#B03052] bg-red-50 hover:bg-red-100 rounded-lg transition-colors items-center gap-1.5 border border-red-100/50"
                    >
                      ⚙️ Dashboard
                    </Link>
                  )}

                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-extrabold text-[#1F2937] leading-none mb-1">
                      {user.user_metadata?.username || 'Welcome'}
                    </span>
                    <span className="text-[10px] text-green-600 font-bold uppercase tracking-widest leading-none">Online</span>
                  </div>

                  <div className="relative group cursor-pointer ml-1">
                    <div className="w-10 h-10 bg-gradient-to-tr from-[#1E5A7A] to-[#2A6B8F] text-white rounded-full flex items-center justify-center text-lg font-black shadow-sm border-2 border-white transform transition-transform group-hover:scale-105">
                      {user.user_metadata?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>

                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100">
                      <div className="p-2">
                        <div className="px-3 py-2 border-b border-gray-50 mb-1">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Signed in as</p>
                          <p className="text-xs font-bold text-[#1E5A7A] truncate">{user.email}</p>
                        </div>

                        {isAdmin && (
                          <Link href="/dashboard/contacts" className="block w-full text-left px-3 py-2 text-sm font-bold text-[#B03052] hover:bg-red-50 rounded-lg transition-colors mb-1 lg:hidden">
                            ⚙️ Dashboard
                          </Link>
                        )}

                        <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm font-bold text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 animate-fade-in-up">
                  <Link href={SITE_DATA.links.signIn} className="px-4 py-2 text-sm font-bold text-[#1E5A7A] hover:text-[#B03052] transition-colors hidden sm:block">Sign In</Link>
                  <Link href={SITE_DATA.links.signUp} className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#1E5A7A] to-[#2A6B8F] hover:from-[#2A6B8F] hover:to-[#1E5A7A] rounded-xl shadow-md transition-all transform hover:-translate-y-0.5">
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