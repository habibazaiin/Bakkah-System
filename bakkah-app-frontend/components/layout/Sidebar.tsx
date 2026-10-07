// src/components/layout/Sidebar.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { SITE_DATA } from '@/constants/site';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: any; // هنستقبل اليوزر هنا
  onLogout: () => void; // دالة تسجيل الخروج
}

export default function Sidebar({ isOpen, onClose, user, onLogout }: SidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <aside className="relative w-80 bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#F8FAFC]">
          <Image src="/bakkah-logo.png" alt={SITE_DATA.name} width={150} height={50} className="h-10 w-auto object-contain" />
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-[#B03052] hover:bg-red-50 rounded-lg transition-colors">
            ✕
          </button>
        </div>

        {/* عرض بيانات اليوزر لو عامل تسجيل دخول */}
        {user && (
          <div className="p-6 border-b border-gray-100 bg-gradient-to-br from-[#1E5A7A]/5 to-transparent">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-tr from-[#1E5A7A] to-[#2A6B8F] text-white rounded-full flex items-center justify-center text-lg font-black shadow-md">
                {user.user_metadata?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-sm font-bold text-[#1F2937]">{user.user_metadata?.username || 'Bakkah User'}</p>
                <p className="text-xs text-gray-500 font-medium truncate max-w-[180px]">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          <div>
            <ul className="space-y-2">
              <li>
                <Link href={SITE_DATA.links.home} onClick={onClose} className="block px-3 py-2.5 text-sm font-bold text-[#1E5A7A] bg-[#1E5A7A]/5 rounded-xl hover:bg-[#1E5A7A]/10 transition-colors">
                  🏠 Home
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-[#B03052] uppercase tracking-wider mb-3 px-2">Tools & Productivity</h3>
            <ul className="space-y-1">
              <li><Link href="/pmp" onClick={onClose} className="block px-3 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-xl hover:text-[#1E5A7A] transition-colors">📋 PmP Task Management</Link></li>
              <li><Link href={SITE_DATA.links.pdfMerger} onClick={onClose} className="block px-3 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-xl hover:text-[#1E5A7A] transition-colors">🧩 PDF Merger</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-[#B03052] uppercase tracking-wider mb-3 px-2">Tech Teams</h3>
            <ul className="space-y-1">
              <li><Link href={SITE_DATA.links.fullstack} onClick={onClose} className="block px-3 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-xl hover:text-[#1E5A7A] transition-colors">💻 Full Stack Support</Link></li>
              <li><Link href={SITE_DATA.links.ai} onClick={onClose} className="block px-3 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-xl hover:text-[#1E5A7A] transition-colors">🤖 AI Support</Link></li>
            </ul>
          </div>
        </div>

        {/* زرار تسجيل الخروج لو اليوزر موجود */}
        {user ? (
          <div className="p-6 border-t border-gray-100 bg-[#F8FAFC]">
            <button onClick={() => { onLogout(); onClose(); }} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-[#B03052] bg-red-50 hover:bg-[#B03052] hover:text-white rounded-xl transition-all duration-300">
              🚪 Sign Out
            </button>
          </div>
        ) : (
          <div className="p-6 border-t border-gray-100 bg-[#F8FAFC] flex flex-col gap-3">
            <Link href={SITE_DATA.links.signIn} onClick={onClose} className="w-full text-center px-4 py-3 text-sm font-bold text-[#1E5A7A] border border-[#1E5A7A]/20 rounded-xl hover:bg-[#1E5A7A]/5 transition-colors">Sign In</Link>
            <Link href={SITE_DATA.links.signUp} onClick={onClose} className="w-full text-center px-4 py-3 text-sm font-bold text-white bg-[#1E5A7A] rounded-xl hover:bg-[#2A6B8F] shadow-md transition-colors">Create Account</Link>
          </div>
        )}
      </aside>
    </div>
  );
}