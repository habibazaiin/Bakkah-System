'use client';

import { useState } from 'react';
import Link from 'next/link';
import InputField from '@/components/ui/InputField';
import { SignInFormData } from '@/types/auth.types';

interface Props {
    onSubmit: (data: SignInFormData) => Promise<void>;
    onGoogleSubmit: () => Promise<void>;
    onForgotPassword: () => void;
    isLoading: boolean;
}

export default function SignInForm({ onSubmit, onGoogleSubmit, onForgotPassword, isLoading }: Props) {
    const [formData, setFormData] = useState<SignInFormData>({ email: '', password: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};
        if (!formData.email.trim()) newErrors.email = 'Email Address is required';
        if (!formData.password) newErrors.password = 'Password is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        onSubmit(formData);
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* زرار تسجيل الدخول بجوجل */}
            <button
                type="button"
                onClick={onGoogleSubmit}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-bold py-3.5 px-4 rounded-xl border border-gray-200 shadow-sm transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Continue with Google
            </button>

            {/* فاصل OR */}
            <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-gray-200 w-full"></div>
                <span className="bg-white px-3 text-xs text-gray-400 font-bold uppercase tracking-wider absolute">OR</span>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <InputField 
                    name="email"
                    type="email" 
                    placeholder="Email Address" 
                    value={formData.email} 
                    onChange={handleChange} 
                    error={errors.email} 
                />
                <InputField 
                    name="password"
                    type="password" 
                    placeholder="Password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    error={errors.password} 
                />

                <div className="flex justify-start">
                    <button 
                        type="button" 
                        onClick={onForgotPassword}
                        className="text-sm font-bold text-[#1E5A7A] hover:text-[#B03052] transition-colors cursor-pointer"
                    >
                        Forgot Password?
                    </button>
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full bg-gradient-to-r from-[#1E5A7A] to-[#2A6B8F] hover:from-[#2A6B8F] hover:to-[#1E5A7A] text-white font-bold py-4 rounded-xl shadow-[0_10px_20px_rgba(30,90,122,0.2)] hover:shadow-[0_15px_25px_rgba(30,90,122,0.3)] transition-all duration-300 disabled:opacity-70 transform hover:-translate-y-0.5 cursor-pointer"
                >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>

            <p className="text-center text-sm text-[#94A3B8] font-medium mt-4">
                Don't have an account?{' '}
                <Link href="/signup" className="text-[#B03052] hover:text-[#1E5A7A] font-bold underline decoration-2 underline-offset-4 transition-colors">
                    Create one now
                </Link>
            </p>
        </div>
    );
}