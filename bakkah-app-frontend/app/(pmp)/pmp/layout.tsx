'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { PmpService } from '@/services/pmp.service';
import CreateSpaceModal from '@/components/pmp/CreateSpaceModal';

// الأيقونات الاحترافية من Lucide
import { LayoutDashboard, FolderKanban, Bell, Settings, Plus, Search, Layers, Loader2 } from 'lucide-react';

export default function PmpLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    const [spaces, setSpaces] = useState<any[]>([]);
    const [isLoadingSpaces, setIsLoadingSpaces] = useState(false);

    // حالة للتحكم في المودال
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const router = useRouter();

    const fetchSpaces = async () => {
        setIsLoadingSpaces(true);
        try {
            const fetchedSpaces = await PmpService.getSpaces();
            setSpaces(fetchedSpaces);
        } catch (error) {
            console.error("Error fetching spaces:", error);
        } finally {
            setIsLoadingSpaces(false);
        }
    };

    useEffect(() => {
        const checkAuthAndFetchData = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/signin?redirect=/pmp');
            } else {
                setIsAuthLoading(false);
                fetchSpaces();
            }
        };
        checkAuthAndFetchData();
    }, [router]);

    if (isAuthLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#F8FAFC]">
                <div className="flex flex-col items-center gap-4 animate-fade-in-up">
                    <Loader2 className="w-10 h-10 text-[#1E5A7A] animate-spin" strokeWidth={2.5} />
                    <p className="text-[#1E5A7A] font-bold text-sm tracking-widest uppercase">Authenticating...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans text-[#1F2937] selection:bg-[#1E5A7A] selection:text-white">

            {/* Primary Sidebar - Minimal & Clean */}
            <aside className="w-20 bg-[#12394D] flex flex-col items-center py-6 border-r border-[#1E5A7A]/30 shrink-0 z-20 shadow-2xl relative">
                <Link href="/" className="mb-8 transform transition-transform hover:scale-110" title="Company Home">
                    <Image src="/logo.png" alt="Bakkah" width={36} height={36} className="object-contain" />
                </Link>

                <nav className="flex flex-col gap-4 w-full items-center mt-4">
                    {/* Active Icon Example */}
                    <button className="p-3 bg-white/10 text-white rounded-2xl shadow-sm transition-all duration-300" title="Dashboard">
                        <LayoutDashboard size={22} strokeWidth={2} />
                    </button>

                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-3 text-white/50 hover:bg-white/5 hover:text-white rounded-2xl transition-all duration-300" title="Workspaces">
                        <FolderKanban size={22} strokeWidth={2} />
                    </button>

                    <button className="p-3 text-white/50 hover:bg-white/5 hover:text-white rounded-2xl transition-all duration-300 relative" title="Notifications">
                        <Bell size={22} strokeWidth={2} />
                        <span className="absolute top-3 right-3.5 w-2 h-2 bg-[#B03052] rounded-full border border-[#12394D]"></span>
                    </button>
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

            {/* Secondary Sidebar - Workspaces */}
            <aside className={`bg-white border-r border-gray-200 flex flex-col shrink-0 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full opacity-0 overflow-hidden'}`}>
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-sm font-black text-[#1E5A7A] uppercase tracking-wider">Workspaces</h2>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="text-gray-400 hover:text-[#B03052] hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                        title="New Space"
                    >
                        <Plus size={18} strokeWidth={3} />
                    </button>
                </div>

                <div className="p-4 flex-1 overflow-y-auto space-y-1">
                    {isLoadingSpaces ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="w-6 h-6 text-[#1E5A7A] animate-spin" />
                        </div>
                    ) : spaces.length === 0 ? (
                        <div className="text-center p-6 text-sm text-gray-400 font-medium bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            No spaces yet.<br />Click + to create one.
                        </div>
                    ) : (
                        spaces.map((space) => (
                            <div key={space.id} className="px-3 py-2.5 rounded-xl hover:bg-[#F8FAFC] transition-all cursor-pointer group flex items-center gap-3 border border-transparent hover:border-gray-100">
                                <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 group-hover:bg-[#1E5A7A]/10 group-hover:text-[#1E5A7A] flex items-center justify-center transition-colors">
                                    <Layers size={16} strokeWidth={2.5} />
                                </div>
                                <span className="font-bold text-sm text-gray-600 group-hover:text-[#1E5A7A] transition-colors truncate">
                                    {space.name}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[#F8FAFC]">
                {/* Header */}
                <header className="h-20 bg-white/60 backdrop-blur-xl border-b border-gray-200 flex items-center justify-between px-8 shrink-0 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-extrabold text-[#1F2937] tracking-tight">Overview</h1>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="relative group">
                            <Search className="absolute left-3.5 top-2.5 text-gray-400 group-focus-within:text-[#1E5A7A] transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search everything..."
                                className="bg-white border border-gray-200 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:border-[#1E5A7A] focus:ring-4 focus:ring-[#1E5A7A]/10 transition-all w-64 shadow-sm"
                            />
                        </div>
                        <button className="bg-[#1E5A7A] hover:bg-[#154560] text-white px-5 py-2 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
                            <Plus size={16} strokeWidth={3} />
                            New Task
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-8 scroll-smooth">
                    {children}
                </div>
            </main>

            {/* المودال الخاص بإنشاء الـ Space */}
            <CreateSpaceModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSpaceCreated={fetchSpaces} // هيعمل Refresh أوتوماتيك للسايد بار
            />
        </div>
    );
}