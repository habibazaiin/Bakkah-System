'use client';

import { useState } from 'react';
import InputField from '@/components/ui/InputField';

interface Props {
    onSubmit: (password: string) => Promise<void>;
    isLoading: boolean;
}

export default function ResetPasswordForm({ onSubmit, isLoading }: Props) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/[A-Z]/.test(password)) {
            newErrors.password = 'Must contain at least 1 uppercase letter';
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(password);
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-6 animate-fade-in-up">
            <div className="space-y-5">
                <InputField
                    name="password"
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors({ ...errors, password: '' });
                    }}
                    error={errors.password}
                />
                <InputField
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                    }}
                    error={errors.confirmPassword}
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#1E5A7A] to-[#2A6B8F] hover:from-[#2A6B8F] hover:to-[#1E5A7A] text-white font-bold py-4 rounded-xl shadow-[0_10px_20px_rgba(30,90,122,0.2)] hover:shadow-[0_15px_25px_rgba(30,90,122,0.3)] transition-all duration-300 disabled:opacity-70 transform hover:-translate-y-0.5 cursor-pointer"
            >
                {isLoading ? 'Updating Password...' : 'Reset Password'}
            </button>
        </form>
    );
}