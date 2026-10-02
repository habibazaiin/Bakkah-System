'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SignUpFormData } from '@/types/auth.types';
import InputField from '@/components/ui/InputField';

interface Props {
    onSubmit: (data: SignUpFormData) => Promise<void>;
    isLoading: boolean;
}

export default function SignUpForm({ onSubmit, isLoading }: Props) {
    const [formData, setFormData] = useState({
        username: '', email: '', phone: '', password: '', confirmPassword: '', role: 'user' as const,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: '' });
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.username.trim()) newErrors.username = 'Username is required';
        if (!formData.email.trim()) newErrors.email = 'Email Address is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone Number is required';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 8) newErrors.password = 'Min 8 characters required';
        else if (!/[A-Z]/.test(formData.password)) newErrors.password = 'Must contain 1 uppercase letter';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm your password';
        else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit({
                username: formData.username, email: formData.email, 
                phone: formData.phone, password: formData.password, role: formData.role,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="space-y-5">
                <InputField name="username" type="text" placeholder="User Name" value={formData.username} onChange={handleChange} error={errors.username} />
                <InputField name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} error={errors.email} />
                <InputField name="phone" type="tel" placeholder="Phone Number" value={formData.phone} onChange={handleChange} error={errors.phone} />
                <InputField name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} error={errors.password} />
                <InputField name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-[#1E5A7A] to-[#2A6B8F] hover:from-[#2A6B8F] hover:to-[#1E5A7A] text-white font-bold py-4 rounded-xl shadow-[0_10px_20px_rgba(30,90,122,0.2)] hover:shadow-[0_15px_25px_rgba(30,90,122,0.3)] transition-all duration-300 disabled:opacity-70 transform hover:-translate-y-0.5">
                {isLoading ? 'Processing...' : 'Create Account'}
            </button>

            <p className="text-center text-sm text-[#94A3B8] font-medium mt-4">
                Already have an account?{' '}
                <Link href="/signin" className="text-[#B03052] hover:text-[#1E5A7A] font-bold underline decoration-2 underline-offset-4 transition-colors">
                    Sign In here
                </Link>
            </p>
        </form>
    );
}