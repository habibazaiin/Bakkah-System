'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Users, Code, Cpu, Home, ShieldCheck, Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) {
                router.push('/');
                return;
            }
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single();

            if (profile?.role !== 'admin') {
                router.push('/');
                return;
            }
            setIsAuthorized(true);
            setIsLoading(false);
        };
        checkAuth();
    }, [router]);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#1E5A7A]" /></div>;
    if (!isAuthorized) return null;

    const navItems = [
        { name: 'Users Management', href: '/dashboard', icon: <Users size={20} /> },
        { name: 'Fullstack Contacts', href: '/dashboard/contacts/fullstack', icon: <Code size={20} /> },
        { name: 'AI Contacts', href: '/dashboard/contacts/ai', icon: <Cpu size={20} /> },
        { name: 'Furniture Portfolio', href: '/dashboard/furniture', icon: <ImageIcon size={20} /> },
    ];

    return (
        /* 🌟 التعديل هنا: h-screen بتخلي الطول ثابت على مقاس الشاشة، و overflow-hidden بتمنع السكرول للصفحة كلها */
        <div className="h-screen overflow-hidden bg-[#F8FAFC] flex">

            {/* Sidebar */}
            {/* 🌟 السايد بار دلوقتي واخد h-full يعني طول الشاشة بالظبط */}
            <aside className="w-64 h-full bg-white border-r border-gray-100 flex flex-col shadow-sm flex-shrink-0">
                <div className="h-20 flex items-center gap-3 px-6 border-b border-gray-100 flex-shrink-0">
                    <ShieldCheck className="text-[#B03052]" size={28} />
                    <span className="font-black text-[#1F2937] text-lg uppercase tracking-wider">Admin Panel</span>
                </div>

                {/* 🌟 القائمة هتعمل سكرول داخلي لوحدها لو اللينكات كترت */}
                <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${isActive ? 'bg-[#1E5A7A] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-[#1E5A7A]'}`}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* زرار العودة هيفضل ثابت تحت دايماً */}
                <div className="p-4 border-t border-gray-100 flex-shrink-0 mt-auto">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 text-[#1F2937] rounded-xl font-bold transition-colors border border-gray-200"
                    >
                        <Home size={18} />
                        Back to Website
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            {/* 🌟 المحتوى بس هو اللي بيعمل سكرول (overflow-y-auto) لو كتر عن الشاشة */}
            <main className="flex-1 h-full overflow-y-auto bg-[#F8FAFC]">
                {children}
            </main>
        </div>
    );
}