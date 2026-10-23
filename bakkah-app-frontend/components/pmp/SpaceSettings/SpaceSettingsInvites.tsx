'use client';

import React, { useState } from 'react';
import { Mail, ChevronDown, Send, Loader2, Clock } from 'lucide-react';
import { PmpService } from '@/services/pmp.service';
import { Invitation } from '@/types/pmp.types';

interface Props {
    spaceId: string;
    invitations: Invitation[];
    setInvitations: React.Dispatch<React.SetStateAction<Invitation[]>>;
    setMessage: React.Dispatch<React.SetStateAction<{ type: string; text: string }>>;
}

export default function SpaceSettingsInvites({ spaceId, invitations, setInvitations, setMessage }: Props) {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('member');
    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const [isInviting, setIsInviting] = useState(false);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setIsInviting(true);
        setMessage({ type: '', text: '' });
        try {
            const newInvite = await PmpService.inviteUser({ space_id: spaceId, email: email.trim(), role });
            setInvitations(prev => [newInvite, ...prev]);
            setEmail('');
            setRole('member');
            setMessage({ type: 'success', text: 'Invitation sent successfully!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to send invite.' });
        } finally {
            setIsInviting(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <form onSubmit={handleInvite} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-end gap-3 relative z-20">
                <div className="flex-1 w-full">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3.5 top-3 text-gray-400" size={16} />
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="colleague@bakkah.com" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-[#1E5A7A] focus:ring-2 focus:ring-[#1E5A7A]/10 transition-all font-medium" required />
                    </div>
                </div>
                <div className="w-full sm:w-1/3 relative">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Role</label>
                    <div onClick={() => setIsRoleOpen(!isRoleOpen)} className="flex items-center justify-between w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-[#1F2937] hover:bg-white focus:outline-none focus:border-[#1E5A7A] focus:ring-2 focus:ring-[#1E5A7A]/10 transition-all cursor-pointer select-none">
                        <span className="capitalize">{role}</span>
                        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isRoleOpen ? 'rotate-180' : ''}`} />
                    </div>
                    {isRoleOpen && (
                        <>
                            <div className="fixed inset-0 z-30" onClick={() => setIsRoleOpen(false)} />
                            <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-1.5 animate-fade-in-up">
                                {['admin', 'manager', 'member', 'guest'].map((r) => (
                                    <div key={r} onClick={() => { setRole(r); setIsRoleOpen(false); }} className={`px-4 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors text-sm font-bold capitalize ${role === r ? 'text-[#1E5A7A] bg-blue-50/50' : 'text-gray-700'}`}>{r}</div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
                <button type="submit" disabled={isInviting || !email.trim()} className="w-full sm:w-auto px-6 py-2.5 bg-[#1E5A7A] hover:bg-[#154560] text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                    {isInviting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} Invite
                </button>
            </form>

            <div className="relative z-10">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Pending Invitations</h3>
                {invitations.length === 0 ? (
                    <p className="text-sm text-gray-400 font-medium p-4 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50/50">No pending invitations.</p>
                ) : (
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm">
                        {invitations.map(inv => (
                            <div key={inv.id} className="flex items-center justify-between p-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100"><Clock size={18} /></div>
                                    <div>
                                        <p className="text-sm font-bold text-[#1F2937]">{inv.email}</p>
                                        <p className="text-[11px] font-bold text-gray-400">Invited as <span className="capitalize">{inv.role}</span></p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-bold rounded-lg border border-orange-100">Pending</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}