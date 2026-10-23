'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LayoutDashboard, FolderKanban, CheckSquare, LogOut } from 'lucide-react';
import NotificationsPopover from '@/components/pmp/sidebar/NotificationsPopover';

interface Props {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (val: boolean) => void;
    pathname: string;
}

export default function PrimarySidebar({ isSidebarOpen, setIsSidebarOpen, pathname }: Props) {
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const router = useRouter();

    const handleConfirmLogout = async () => {
        await supabase.auth.signOut();
        router.push('/signin');
    };

    return (
        <>
            <aside className="w-20 bg-[#12394D] flex flex-col items-center py-6 border-r border-[#1E5A7A]/30 shrink-0 z-20 shadow-2xl relative">
                <Link href="/" className="mb-8 transform transition-transform hover:scale-110" title="Company Home">
                    <Image src="/logo.png" alt="Bakkah" width={36} height={36} className="object-contain" />
                </Link>

                <nav className="flex flex-col gap-4 w-full items-center mt-4">
                    <Link href="/pmp" className={`p-3 rounded-2xl shadow-sm transition-all duration-300 ${pathname === '/pmp' ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`} title="Dashboard">
                        <LayoutDashboard size={22} strokeWidth={2} />
                    </Link>

                    <Link href="/pmp/my-tasks" className={`p-3 rounded-2xl shadow-sm transition-all duration-300 ${pathname === '/pmp/my-tasks' ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`} title="My Tasks">
                        <CheckSquare size={22} strokeWidth={2} />
                    </Link>

                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-3 rounded-2xl transition-all duration-300 ${isSidebarOpen ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`} title="Workspaces">
                        <FolderKanban size={22} strokeWidth={2} />
                    </button>
                    <NotificationsPopover />
                </nav>

                <div className="mt-auto flex flex-col gap-4 w-full items-center mb-2">
                    {/* 🌟 زرار تسجيل الخروج الجديد 🌟 */}
                    <button
                        onClick={() => setIsLogoutModalOpen(true)}
                        className="p-3 rounded-2xl transition-all duration-300 flex items-center justify-center text-white/50 hover:bg-red-500/20 hover:text-red-400 group"
                        title="Log Out"
                    >
                        <LogOut size={22} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
                    </button>

                    <div className="w-10 h-10 mt-2 bg-gradient-to-tr from-[#B03052] to-[#8C233E] rounded-full flex items-center justify-center font-bold text-white shadow-lg border-2 border-white/10 cursor-pointer transform transition-transform hover:scale-105 text-sm">
                        US
                    </div>
                </div>
            </aside>

            {/* 🌟 رسالة تأكيد تسجيل الخروج (Modal) 🌟 */}
            {isLogoutModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* خلفية ضبابية تقفل المودال لو دوسنا عليها */}
                    <div className="fixed inset-0 bg-[#1F2937]/60 backdrop-blur-sm transition-opacity" onClick={() => setIsLogoutModalOpen(false)} />

                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center animate-fade-in-up z-10">
                        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-red-100">
                            <LogOut size={32} strokeWidth={2.5} className="ml-1" />
                        </div>
                        <h3 className="text-2xl font-black text-[#1F2937] mb-2">Log Out?</h3>
                        <p className="text-sm text-gray-500 font-medium mb-8 leading-relaxed">
                            Are you sure you want to log out of your account?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsLogoutModalOpen(false)}
                                className="flex-1 px-5 py-3.5 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmLogout}
                                className="flex-1 px-5 py-3.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-md"
                            >
                                Yes, Log Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}