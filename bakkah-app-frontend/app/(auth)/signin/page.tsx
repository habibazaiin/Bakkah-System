'use client';

import { useState } from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import SignInForm from '@/components/auth/SignInForm';
import OtpForm from '@/components/auth/OtpForm';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import InputField from '@/components/ui/InputField';
import AlertMessage from '@/components/ui/AlertMessage';
import { AuthService } from '@/services/auth.service';
import { SignInFormData } from '@/types/auth.types';
import Image from 'next/image';

type FlowStep = 'signin' | 'request-email' | 'otp' | 'reset-password';

export default function SignInPage() {
    const [step, setStep] = useState<FlowStep>('signin');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const resetState = () => {
        setErrorMsg('');
        setSuccessMsg('');
    };

    // 1. تسجيل الدخول العادي
    const handleSignInSubmit = async (data: SignInFormData) => {
        setLoading(true);
        resetState();
        try {
            await AuthService.signIn(data);
            setSuccessMsg('Login successful! Redirecting...');

            // قراءة مسار التوجيه من الرابط، لو مفيش يروح للصفحة الرئيسية
            const urlParams = new URLSearchParams(window.location.search);
            const redirectUrl = urlParams.get('redirect') || '/';

            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 1000);
        } catch (error: any) {
            setErrorMsg(error.message || 'Failed to sign in.');
        } finally {
            setLoading(false);
        }
    };

    // 2. تسجيل الدخول بحساب جوجل
    const handleGoogleSignIn = async () => {
        setLoading(true);
        resetState();
        try {
            await AuthService.signInWithGoogle();
        } catch (error: any) {
            setErrorMsg(error.message || 'Failed to sign in with Google.');
            setLoading(false);
        }
    };

    // 3. إرسال كود الـ Reset
    const handleRequestReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) {
            setErrorMsg('Please enter your email address');
            return;
        }
        setLoading(true);
        resetState();
        try {
            await AuthService.resetPasswordForEmail(email);
            setSuccessMsg('Reset code sent to your email.');
            setStep('otp');
        } catch (error: any) {
            setErrorMsg(error.message || 'Failed to send reset code.');
        } finally {
            setLoading(false);
        }
    };

    // 4. التأكد من كود OTP
    const handleOtpSubmit = async (otp: string) => {
        setLoading(true);
        resetState();
        try {
            await AuthService.verifyRecoveryOtp(email, otp);
            setSuccessMsg('Code verified! Enter your new password.');
            setStep('reset-password');
        } catch (error: any) {
            setErrorMsg(error.message || 'Invalid verification code.');
        } finally {
            setLoading(false);
        }
    };

    // 5. تعيين الباسورد الجديد والتحويل للـ Sign In
    const handleResetPasswordSubmit = async (newPassword: string) => {
        setLoading(true);
        resetState();
        try {
            await AuthService.updateUserPassword(newPassword);
            setSuccessMsg('Password updated successfully! Please sign in with your new password.');
            setTimeout(() => {
                setStep('signin');
                setSuccessMsg('Please sign in with your new password.');
            }, 1500);
        } catch (error: any) {
            setErrorMsg(error.message || 'Failed to update password.');
        } finally {
            setLoading(false);
        }
    };

    const getTitleAndSubtitle = () => {
        switch (step) {
            case 'signin':
                return {
                    title: (
                        <span className="flex items-center justify-center gap-3">
                            <Image
                                src="/logo.png"
                                alt="Bakkah Logo"
                                width={32}
                                height={32}
                                className="object-contain"
                            />
                            Welcome Back
                        </span>
                    ),
                    subtitle: 'Enter your credentials to access your account'
                };
            case 'request-email':
                return { title: 'Reset Password', subtitle: 'Enter your email to receive a verification code' };
            case 'otp':
                return { title: 'Verify Code', subtitle: `Enter the 6-digit code sent to ${email}` };
            case 'reset-password':
                return { title: 'Set New Password', subtitle: 'Please enter a strong new password' };
        }
    };
    const { title, subtitle } = getTitleAndSubtitle();

    return (
        <AuthLayout title={title} subtitle={subtitle}>
            <AlertMessage type="error" message={errorMsg} />
            <AlertMessage type="success" message={successMsg} />

            <div className="relative w-full">
                {step === 'signin' && (
                    <SignInForm
                        onSubmit={handleSignInSubmit}
                        onGoogleSubmit={handleGoogleSignIn}
                        onForgotPassword={() => { resetState(); setStep('request-email'); }}
                        isLoading={loading}
                    />
                )}

                {step === 'request-email' && (
                    <form onSubmit={handleRequestReset} className="space-y-6 animate-fade-in-up">
                        <InputField
                            name="email"
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#1E5A7A] to-[#2A6B8F] hover:from-[#2A6B8F] hover:to-[#1E5A7A] text-white font-bold py-4 rounded-xl shadow-[0_10px_20px_rgba(30,90,122,0.2)] transition-all duration-300 disabled:opacity-70 transform hover:-translate-y-0.5 cursor-pointer"
                        >
                            {loading ? 'Sending Code...' : 'Send Verification Code'}
                        </button>
                        <button
                            type="button"
                            onClick={() => { resetState(); setStep('signin'); }}
                            className="w-full text-center text-sm font-bold text-[#94A3B8] hover:text-[#1E5A7A] transition-colors"
                        >
                            Back to Sign In
                        </button>
                    </form>
                )}

                {step === 'otp' && (
                    <OtpForm
                        email={email}
                        type="recovery"
                        onSubmit={handleOtpSubmit}
                        isLoading={loading}
                    />
                )}

                {step === 'reset-password' && (
                    <ResetPasswordForm
                        onSubmit={handleResetPasswordSubmit}
                        isLoading={loading}
                    />
                )}
            </div>
        </AuthLayout>
    );
}