'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, FolderKanban, Settings } from 'lucide-react';
import NotificationsPopover from '@/components/pmp/NotificationsPopover';

interface Props {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (val: boolean) => void;
    pathname: string;
}

export default function PrimarySidebar({ isSidebarOpen, setIsSidebarOpen, pathname }: Props) {
    return (
        <aside className="w-20 bg-[#12394D] flex flex-col items-center py-6 border-r border-[#1E5A7A]/30 shrink-0 z-20 shadow-2xl relative">
            <Link href="/" className="mb-8 transform transition-transform hover:scale-110" title="Company Home">
                <Image src="/logo.png" alt="Bakkah" width={36} height={36} className="object-contain" />
            </Link>

            <nav className="flex flex-col gap-4 w-full items-center mt-4">
                <Link href="/pmp" className={`p-3 rounded-2xl shadow-sm transition-all duration-300 ${pathname === '/pmp' ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`} title="Dashboard">
                    <LayoutDashboard size={22} strokeWidth={2} />
                </Link>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-3 rounded-2xl transition-all duration-300 ${isSidebarOpen ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`} title="Workspaces">
                    <FolderKanban size={22} strokeWidth={2} />
                </button>
                <NotificationsPopover />
            </nav>

            <div className="mt-auto flex flex-col gap-4 w-full items-center mb-2">
                <button className="p-3 text-white/50 hover:bg-white/5 hover:text-white rounded-2xl transition-all duration-300" title="Settings">
                    <Settings size={22} strokeWidth={2} />
                </button>
                <div className="w-10 h-10 mt-2 bg-gradient-to-tr from-[#B03052] to-[#8C233E] rounded-full flex items-center justify-center font-bold text-white shadow-lg border-2 border-white/10 cursor-pointer transform transition-transform hover:scale-105 text-sm">
                    US
                </div>
            </div>
        </aside>
    );
}