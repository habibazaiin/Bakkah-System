'use client';

import { useState } from 'react';
import Image from 'next/image'; // أضفنا الـ Image component
import AuthLayout from '@/components/auth/AuthLayout';
import SignUpForm from '@/components/auth/SignUpForm';
import OtpForm from '@/components/auth/OtpForm';
import AlertMessage from '@/components/ui/AlertMessage';
import { AuthService } from '@/services/auth.service';
import { SignUpFormData } from '@/types/auth.types';

export default function SignUpPage() {
    const [step, setStep] = useState<'signup' | 'otp'>('signup');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [savedData, setSavedData] = useState<SignUpFormData | null>(null);

    const handleSignUpSubmit = async (data: SignUpFormData) => {
        setLoading(true); setErrorMsg(''); setSuccessMsg('');
        try {
            await AuthService.signUp(data);
            setSavedData(data);
            setSuccessMsg('Verification code has been sent to your email.');
            setStep('otp');
        } catch (error: any) { setErrorMsg(error.message); }
        finally { setLoading(false); }
    };

    const handleOtpSubmit = async (otp: string) => {
        if (!savedData) return;
        setLoading(true); setErrorMsg(''); setSuccessMsg('');
        try {
            await AuthService.verifyOtpAndSaveProfile({
                email: savedData.email, token: otp, role: savedData.role,
                username: savedData.username, phone: savedData.phone,
            });
            setSuccessMsg('Account verified successfully! Redirecting...');

            // التوجيه الذكي
            const urlParams = new URLSearchParams(window.location.search);
            const redirectUrl = urlParams.get('redirect') || '/';

            setTimeout(() => {
                window.location.href = savedData.role === 'admin' ? '/admin' : redirectUrl;
            }, 1500);
        } catch (error: any) { setErrorMsg(error.message); }
        finally { setLoading(false); }
    };

    return (
        <AuthLayout
            title={
                step === 'signup' ? (
                    <span className="flex items-center justify-center gap-3">
                        <Image
                            src="/logo.png"
                            alt="Bakkah Logo"
                            width={32}
                            height={32}
                            className="object-contain"
                        />
                        Create an Account
                    </span>
                ) : (
                    'Verify Your Email'
                )
            }
            subtitle={step === 'signup' ? 'Enter your details below to get started' : `Enter the 6-digit code sent to ${savedData?.email}`}
        >
            <AlertMessage type="error" message={errorMsg} />
            <AlertMessage type="success" message={successMsg} />

            <div className="relative w-full">
                {step === 'signup' && <SignUpForm onSubmit={handleSignUpSubmit} isLoading={loading} />}
                {step === 'otp' && <OtpForm email={savedData?.email || ''} onSubmit={handleOtpSubmit} isLoading={loading} />}
            </div>
        </AuthLayout>
    );
}