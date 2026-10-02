'use client';

import { useState } from 'react';
import Link from 'next/link';
import InputField from '@/components/ui/InputField';
import { SignInFormData } from '@/types/auth.types';

interface Props {
    onSubmit: (data: SignInFormData) => Promise<void>;
    onForgotPassword: () => void;
    isLoading: boolean;
}

export default function SignInForm({ onSubmit, onForgotPassword, isLoading }: Props) {
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
        <form onSubmit={handleSubmit} noValidate className="space-y-6 animate-fade-in-up">
            <div className="space-y-5">
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
            </div>

            {/* تم نقل الزر إلى اليسار باستخدام justify-start */}
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

            <p className="text-center text-sm text-[#94A3B8] font-medium mt-4">
                Don't have an account?{' '}
                <Link href="/signup" className="text-[#B03052] hover:text-[#1E5A7A] font-bold underline decoration-2 underline-offset-4 transition-colors">
                    Create one now
                </Link>
            </p>
        </form>
    );
}