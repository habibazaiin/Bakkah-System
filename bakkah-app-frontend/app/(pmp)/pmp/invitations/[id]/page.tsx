'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PmpService } from '@/services/pmp.service';
import { Check, X, Loader2, MailOpen } from 'lucide-react';
import Link from 'next/link';

export default function InvitationPage() {
    const params = useParams();
    const router = useRouter();
    const tokenId = params.id as string; // الـ Token اللي جاي من اللينك

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleResponse = async (action: 'accept' | 'decline') => {
        setStatus('loading');
        try {
            await PmpService.respondToInvitation(tokenId, action);
            setStatus('success');
            setMessage(action === 'accept' ? 'Welcome to the workspace!' : 'Invitation declined.');
            
            // لو قبل الدعوة، نوديه على الداشبورد بعد ثانيتين
            if (action === 'accept') {
                setTimeout(() => router.push('/pmp'), 2000);
            }
        } catch (error: any) {
            setStatus('error');
            setMessage(error.message || 'Something went wrong.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 text-center border border-gray-100 animate-fade-in-up">
                
                <div className="w-20 h-20 bg-blue-50 text-[#1E5A7A] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <MailOpen size={40} strokeWidth={2} />
                </div>

                <h1 className="text-2xl font-black text-[#1F2937] mb-2">Workspace Invitation</h1>
                <p className="text-gray-500 text-sm font-medium mb-8">
                    You have been invited to collaborate on Bakkah PMP.
                </p>

                {status === 'idle' && (
                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={() => handleResponse('accept')}
                            className="w-full py-3.5 bg-[#1E5A7A] hover:bg-[#154560] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-md"
                        >
                            <Check size={18} strokeWidth={3} /> Accept Invitation
                        </button>
                        <button 
                            onClick={() => handleResponse('decline')}
                            className="w-full py-3.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                        >
                            <X size={18} strokeWidth={3} /> Decline
                        </button>
                    </div>
                )}

                {status === 'loading' && (
                    <div className="py-8 flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-8 h-8 text-[#1E5A7A] animate-spin" />
                        <p className="text-gray-400 font-bold text-sm">Processing...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="py-6">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check size={24} strokeWidth={3} />
                        </div>
                        <p className="text-lg font-bold text-[#1F2937]">{message}</p>
                        <p className="text-sm text-gray-400 mt-2">Redirecting you shortly...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="py-6">
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <X size={24} strokeWidth={3} />
                        </div>
                        <p className="text-lg font-bold text-[#1F2937] mb-4">{message}</p>
                        <Link href="/pmp" className="text-[#1E5A7A] font-bold hover:underline">
                            Return to Dashboard
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}