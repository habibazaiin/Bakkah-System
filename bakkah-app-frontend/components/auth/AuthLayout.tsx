'use client';

import { ReactNode } from 'react';

interface AuthLayoutProps {
    title: string;
    subtitle: string;
    children: ReactNode;
}

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex w-full font-sans bg-[#F8FAFC] selection:bg-[#1E5A7A] selection:text-white">
            {/* الجزء الأيسر: Branding & Animations */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#1E5A7A] via-[#2A6B8F] to-[#B03052] flex-col justify-center items-start p-20 relative overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] animate-pulse duration-1000"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#3A7C15]/20 rounded-full blur-[100px] animate-pulse duration-700"></div>

                <div className="relative z-10 flex flex-col items-start transform transition-all duration-700 hover:scale-105">
                    <div className="mb-8 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
                       <span className="text-3xl font-black text-white tracking-widest">BAKKAH</span>
                    </div>
                    <h1 className="text-6xl font-extrabold mb-6 tracking-tight text-white leading-tight">
                        Elevate Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#F8FAFC]/70">Workflow.</span>
                    </h1>
                    <p className="text-lg text-white/80 max-w-md leading-relaxed font-medium">
                        Streamline your projects, manage risks effectively, and get highly accurate ML/DL estimations in one unified platform.
                    </p>
                </div>
            </div>

            {/* الجزء الأيمن: Form Container */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative bg-[url('/noise.png')] bg-repeat opacity-95">
                <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-[0_20px_60px_-15px_rgba(30,90,122,0.15)] border border-gray-100/50 relative z-10 transition-all duration-500 hover:shadow-[0_25px_65px_-15px_rgba(30,90,122,0.2)]">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-extrabold text-[#1F2937] mb-3 tracking-tight">{title}</h2>
                        <p className="text-sm text-[#94A3B8] font-medium">{subtitle}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}