'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
            {/* Navbar العلوي */}
            {/* Navbar العلوي */}
            <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-sm">
                {/* استخدمنا px-6 و lg:px-12 عشان نزق العناصر للأطراف */}
                <div className="w-full px-4 sm:px-6 lg:px-12 h-24 flex items-center justify-between">
                    {/* باقي الكود زي ما هو */}

                    {/* الجزء الأيسر: أيقونة المنيو + اللوجو (واخد flex-1 عشان يزق الباقي) */}
                    <div className="flex items-center gap-6 flex-1">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 rounded-xl text-[#1E5A7A] hover:bg-gray-100 transition-colors"
                            aria-label="Open Sidebar"
                        >
                            {/* كبرنا أيقونة المنيو لـ w-8 h-8 */}
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <Link href="/" className="flex items-center">
                            {/* كبرنا اللوجو بشكل ملحوظ */}
                            <Image
                                src="/bakkah-logo.png"
                                alt="Bakkah Systems Logo"
                                width={220}
                                height={80}
                                className="h-12 sm:h-16 w-auto object-contain"
                                priority
                            />
                        </Link>
                    </div>

                    {/* الجزء الأوسط: الروابط (متسنترة تماماً في النص) */}
                    <nav className="hidden md:flex items-center justify-center gap-10 flex-1">
                        <a href="#about" className="text-lg font-bold text-gray-700 hover:text-[#1E5A7A] transition-colors">About Us</a>
                        <a href="#services" className="text-lg font-bold text-gray-700 hover:text-[#1E5A7A] transition-colors">Services</a>
                        <a href="#contact" className="text-lg font-bold text-gray-700 hover:text-[#1E5A7A] transition-colors">Contact Us</a>
                    </nav>

                    {/* الجزء الأيمن: أزرار التسجيل (موجودة في أقصى اليمين) */}
                    <div className="flex flex-1 items-center justify-end gap-2 sm:gap-6">
                        <Link
                            href="/signin"
                            className="px-4 py-2.5 text-lg font-bold text-[#1E5A7A] hover:text-[#B03052] transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/signup"
                            className="px-8 py-3 text-lg font-bold text-white bg-[#1E5A7A] hover:bg-[#2A6B8F] rounded-xl shadow-md transition-all transform hover:-translate-y-0.5"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </header>

            {/* Sidebar الجانبي */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-50 flex">
                    {/* الخلفية المعتمة */}
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsSidebarOpen(false)}
                    />

                    {/* محتوى الـ Sidebar */}
                    <aside className="relative w-80 bg-white h-full shadow-2xl p-6 flex flex-col z-10 animate-slide-in">
                        <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                            <Image src="/bakkah-logo.png" alt="Bakkah Systems" width={150} height={50} className="h-10 w-auto object-contain" />
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mt-8 space-y-6 flex-1 overflow-y-auto">
                            <div>
                                <h3 className="text-xs font-bold text-[#B03052] uppercase tracking-wider mb-3">Furniture Services</h3>
                                <ul className="space-y-2">
                                    <li>
                                        <a href="#furniture" onClick={() => setIsSidebarOpen(false)} className="block px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-lg hover:text-[#1E5A7A] transition-colors">
                                            🪑 Custom Furniture Designs
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold text-[#B03052] uppercase tracking-wider mb-3">Technology Services</h3>
                                <ul className="space-y-2">
                                    <li>
                                        <a href="#tech" onClick={() => setIsSidebarOpen(false)} className="block px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-lg hover:text-[#1E5A7A] transition-colors">
                                            💻 Full Stack Support
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#tech" onClick={() => setIsSidebarOpen(false)} className="block px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-lg hover:text-[#1E5A7A] transition-colors">
                                            🤖 AI Support
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#tech" onClick={() => setIsSidebarOpen(false)} className="block px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-lg hover:text-[#1E5A7A] transition-colors">
                                            📊 Data Analysis
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                            <p className="text-xs text-gray-400 font-medium text-center">© 2026 Bakkah Systems</p>
                        </div>
                    </aside>
                </div>
            )}
        </>
    );
}