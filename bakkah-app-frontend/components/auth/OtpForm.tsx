'use client';

import { useState, useEffect } from 'react';
import { AuthService } from '@/services/auth.service';

interface Props {
    email: string;
    type?: 'signup' | 'recovery'; // تحديد نوع العملية
    onSubmit: (otp: string) => Promise<void>;
    isLoading: boolean;
}

export default function OtpForm({ email, type = 'signup', onSubmit, isLoading }: Props) {
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) interval = setInterval(() => setTimer((p) => p - 1), 1000);
        else setCanResend(true);
        return () => clearInterval(interval);
    }, [timer]);

    const handleResend = async () => {
        if (!canResend) return;
        setIsResending(true); 
        setMessage('');
        try {
            if (type === 'recovery') {
                await AuthService.resendRecoveryOtp(email);
            } else {
                await AuthService.resendOtp(email);
            }
            setTimer(60); 
            setCanResend(false);
            setMessage('A new code has been sent to your email.');
        } catch (error: any) {
            setMessage(error.message || 'Failed to resend code.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(otp); }} className="space-y-6 animate-fade-in-up">
            <div className="text-center">
                <input
                    type="text" maxLength={6} placeholder="••••••" required
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-5 text-center text-4xl tracking-[0.5em] font-black text-[#B03052] bg-[#B03052]/5 border-2 border-transparent rounded-2xl focus:bg-white focus:outline-none focus:border-[#B03052]/30 focus:ring-4 focus:ring-[#B03052]/10 transition-all duration-300"
                />
            </div>

            <button type="submit" disabled={isLoading || otp.length < 6} className="w-full bg-gradient-to-r from-[#B03052] to-[#8C233E] hover:opacity-90 text-white font-bold py-4 rounded-xl shadow-[0_10px_20px_rgba(176,48,82,0.2)] hover:shadow-[0_15px_25px_rgba(176,48,82,0.3)] transition-all duration-300 disabled:opacity-70 transform hover:-translate-y-0.5 cursor-pointer">
                {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>

            <div className="text-center mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                {timer > 0 ? (
                    <p className="text-[#94A3B8] text-sm font-medium">
                        Resend code in <span className="text-[#B03052] font-bold">{Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}</span>
                    </p>
                ) : (
                    <button type="button" onClick={handleResend} disabled={isResending} 
                        className="text-[#1E5A7A] hover:text-white hover:bg-[#1E5A7A] px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 border-2 border-[#1E5A7A] disabled:opacity-50 cursor-pointer">
                        {isResending ? 'Sending...' : '↻ Resend Code Now'}
                    </button>
                )}
                {message && <p className={`text-xs font-semibold mt-3 ${message.includes('sent') ? 'text-[#3A7C15]' : 'text-[#B03052]'}`}>{message}</p>}
            </div>
        </form>
    );
}