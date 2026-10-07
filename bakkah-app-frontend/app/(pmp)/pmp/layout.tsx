// src/app/(pmp)/pmp/layout.tsx
import React from 'react';
// import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';
// هنا بعدين هنعمل check للـ session من السيرفر سايد 

export default async function PmpLayout({ children }: { children: React.ReactNode }) {
    
    // Server-side auth check placeholder
    // const session = await getSession(cookies());
    // if (!session) redirect('/signin');

    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
            {/* Primary Sidebar (الثابتة) */}
            <aside className="w-20 bg-[#1E5A7A] flex flex-col items-center py-6 text-white border-r border-white/10 shrink-0">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-black mb-8 cursor-pointer">
                    PMP
                </div>
                
                <nav className="flex flex-col gap-6 w-full items-center">
                    {/* Icons Placeholders */}
                    <button className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition" title="Home">🏠</button>
                    <button className="p-3 hover:bg-white/10 rounded-lg transition" title="Spaces">📁</button>
                    <button className="p-3 hover:bg-white/10 rounded-lg transition" title="Alerts">🔔</button>
                </nav>

                <div className="mt-auto flex flex-col gap-6 w-full items-center">
                    <button className="p-3 hover:bg-white/10 rounded-lg transition" title="Settings">⚙️</button>
                    <div className="w-10 h-10 bg-[#B03052] rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-white/20 cursor-pointer">
                        US
                    </div>
                </div>
            </aside>

            {/* Secondary Sidebar (تتغير حسب الـ Space) - نخليها مخفية أو ثابتة مؤقتاً */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col shrink-0">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-[#1F2937]">Workspace</h2>
                </div>
                <div className="p-4 flex-1 overflow-y-auto">
                    {/* Space content will go here */}
                    <div className="text-sm text-gray-500 font-medium">No spaces selected</div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
                    <h1 className="text-xl font-bold text-[#1F2937]">Dashboard</h1>
                    <button className="bg-gradient-to-r from-[#1E5A7A] to-[#2A6B8F] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:shadow-md transition">
                        + New Task
                    </button>
                </header>
                
                {/* Page Content */}
                <div className="flex-1 overflow-auto p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}