'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2, MailOpen } from 'lucide-react';
import { PmpService } from '@/services/pmp.service';

export default function InvitationPage() {
    const params = useParams();
    const router = useRouter();
    const inviteId = params.id as string;

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleRespond = async (action: 'accept' | 'decline') => {
        setStatus('loading');
        try {
            await PmpService.respondToInvitation(inviteId, action);
            setStatus('success');
            setMessage(action === 'accept' ? 'Welcome aboard! You have joined the workspace.' : 'Invitation declined successfully.');

            // لو وافق نوديه على الداشبورد بعد ثانيتين
            if (action === 'accept') {
                setTimeout(() => {
                    window.location.href = '/pmp';
                }, 2000);
            }
        } catch (error: any) {
            setStatus('error');
            setMessage(error.message || 'Something went wrong.');
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-[#F8FAFC] p-4">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 text-center animate-fade-in-up border border-gray-100">
                <div className="w-16 h-16 bg-blue-50 text-[#1E5A7A] rounded-full flex items-center justify-center mx-auto mb-6">
                    <MailOpen size={32} strokeWidth={2} />
                </div>

                <h1 className="text-2xl font-black text-[#1F2937] mb-2">Workspace Invitation</h1>
                <p className="text-gray-500 font-medium text-sm mb-8">You have been invited to join a Bakkah PMP workspace. Would you like to accept?</p>

                {status === 'idle' && (
                    <div className="flex gap-4">
                        <button onClick={() => handleRespond('decline')} className="flex-1 py-3 px-4 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors border border-gray-200 flex items-center justify-center gap-2">
                            <XCircle size={18} /> Decline
                        </button>
                        <button onClick={() => handleRespond('accept')} className="flex-1 py-3 px-4 bg-[#1E5A7A] text-white font-bold rounded-xl hover:bg-[#154560] transition-colors shadow-md flex items-center justify-center gap-2">
                            <CheckCircle2 size={18} /> Accept
                        </button>
                    </div>
                )}

                {status === 'loading' && (
                    <div className="flex flex-col items-center justify-center py-4">
                        <Loader2 className="w-8 h-8 text-[#1E5A7A] animate-spin mb-2" />
                        <p className="text-sm font-bold text-gray-500">Processing...</p>
                    </div>
                )}

                {(status === 'success' || status === 'error') && (
                    <div className={`p-4 rounded-xl text-sm font-bold border ${status === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}