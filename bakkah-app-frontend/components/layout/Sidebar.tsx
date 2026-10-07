// src/components/layout/Sidebar.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { SITE_DATA } from '@/constants/site';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <aside className="relative w-80 bg-white h-full shadow-2xl p-6 flex flex-col z-10 animate-slide-in">
        <div className="flex items-center justify-between pb-6 border-b border-gray-100">
          <Image src="/bakkah-logo.png" alt={SITE_DATA.name} width={150} height={50} className="h-10 w-auto object-contain" />
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            ✕
          </button>
        </div>

        <div className="mt-8 space-y-6 flex-1 overflow-y-auto">
          <div>
            <ul className="space-y-2">
              <li>
                <Link href={SITE_DATA.links.home} onClick={onClose} className="block px-3 py-2 text-sm font-bold text-[#1E5A7A] bg-gray-50 rounded-lg">
                  🏠 Home
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-[#B03052] uppercase tracking-wider mb-3">Tools & Productivity</h3>
            <ul className="space-y-2">
              <li><Link href={SITE_DATA.links.pnp} onClick={onClose} className="block px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-lg hover:text-[#1E5A7A]">📋 PnP Task Management</Link></li>
              <li><Link href={SITE_DATA.links.pdfMerger} onClick={onClose} className="block px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-lg hover:text-[#1E5A7A]">🧩 PDF Merger</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-[#B03052] uppercase tracking-wider mb-3">Tech Teams</h3>
            <ul className="space-y-2">
              <li><Link href={SITE_DATA.links.fullstack} onClick={onClose} className="block px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-lg hover:text-[#1E5A7A]">💻 Full Stack Support Team</Link></li>
              <li><Link href={SITE_DATA.links.ai} onClick={onClose} className="block px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-lg hover:text-[#1E5A7A]">🤖 AI Support Team</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-[#B03052] uppercase tracking-wider mb-3">Craftsmanship</h3>
            <ul className="space-y-2">
              <li><Link href={SITE_DATA.links.furniture} onClick={onClose} className="block px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-lg hover:text-[#1E5A7A]">🪑 Bakkah Furniture</Link></li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}