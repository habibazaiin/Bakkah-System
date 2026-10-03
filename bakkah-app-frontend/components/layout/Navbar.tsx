'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Sidebar from './Sidebar';
import { SITE_DATA } from '@/constants/site';

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-12 h-24 flex items-center justify-between">
          
          {/* Logo & Menu Toggle */}
          <div className="flex items-center gap-6 flex-1">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-xl text-[#1E5A7A] hover:bg-gray-100 transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <Link href={SITE_DATA.links.home} className="flex items-center">
              <Image src="/bakkah-logo.png" alt={SITE_DATA.name} width={220} height={80} className="h-12 sm:h-16 w-auto object-contain" priority />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center gap-10 flex-1">
            <Link href={SITE_DATA.links.home} className="text-lg font-bold text-[#1E5A7A] hover:text-[#B03052] transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Home
            </Link>
            <Link href={SITE_DATA.links.about} className="text-lg font-bold text-gray-700 hover:text-[#1E5A7A] transition-colors">About Us</Link>
            <Link href={SITE_DATA.links.services} className="text-lg font-bold text-gray-700 hover:text-[#1E5A7A] transition-colors">Services</Link>
            <Link href={SITE_DATA.links.contact} className="text-lg font-bold text-gray-700 hover:text-[#1E5A7A] transition-colors">Contact</Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex flex-1 items-center justify-end gap-2 sm:gap-6">
            <Link href={SITE_DATA.links.signIn} className="px-4 py-2.5 text-lg font-bold text-[#1E5A7A] hover:text-[#B03052] transition-colors">Sign In</Link>
            <Link href={SITE_DATA.links.signUp} className="px-8 py-3 text-lg font-bold text-white bg-[#1E5A7A] hover:bg-[#2A6B8F] rounded-xl shadow-md transition-all transform hover:-translate-y-0.5">Sign Up</Link>
          </div>
        </div>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}