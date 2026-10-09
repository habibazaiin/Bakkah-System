'use client';

import React, { useState, useEffect } from 'react';
import { X, Users, MailPlus, Loader2, ShieldCheck, Mail, Send, Clock, ChevronDown } from 'lucide-react';
import { PmpService } from '@/services/pmp.service';
import { Space, SpaceMember, Invitation } from '@/types/pmp.types';
import { TEAM_MEMBERS } from '@/constants/team'; // للـ Fallback UI

interface Props {
    isOpen: boolean;
    onClose: () => void;
    space: Space | null;
}

export default function SpaceSettingsModal({ isOpen, onClose, space }: Props) {
    const [activeTab, setActiveTab] = useState<'members' | 'invites'>('members');
    const [members, setMembers] = useState<SpaceMember[]>([]);
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Invite Form States
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('member');
    const [isRoleOpen, setIsRoleOpen] = useState(false); // 👈 State للدروب داون الجديد
    const [isInviting, setIsInviting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (isOpen && space) {
            fetchData();
        } else {
            // Reset states when closed
            setMessage({ type: '', text: '' });
            setEmail('');
            setRole('member');
            setIsRoleOpen(false);
            setActiveTab('members');
        }
    }, [isOpen, space]);

    const fetchData = async () => {
        if (!space) return;
        setIsLoading(true);
        try {
            const [membersData, invitesData] = await Promise.all([
                PmpService.getSpaceMembers(space.id),
                PmpService.getSpaceInvitations(space.id)
            ]);
            setMembers(membersData);
            setInvitations(invitesData);
        } catch (error) {
            console.error("Failed to load settings data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!space || !email.trim()) return;

        setIsInviting(true);
        setMessage({ type: '', text: '' });
        try {
            const newInvite = await PmpService.inviteUser({ space_id: space.id, email: email.trim(), role });
            setInvitations(prev => [newInvite, ...prev]);
            setEmail('');
            setRole('member');
            setMessage({ type: 'success', text: 'Invitation sent successfully!' });
            setActiveTab('invites');
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to send invite.' });
        } finally {
            setIsInviting(false);
        }
    };

    if (!isOpen || !space) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-[#1F2937]/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
            
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl animate-fade-in-up z-10 flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#F8FAFC] rounded-t-3xl shrink-0">
                    <div>
                        <h2 className="text-xl font-extrabold text-[#1F2937] flex items-center gap-2">
                            <ShieldCheck className="text-[#1E5A7A]" size={24} />
                            {space.name} Settings
                        </h2>
                        <p className="text-sm text-gray-500 font-medium mt-1">Manage team members and permissions.</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-[#B03052] rounded-xl hover:bg-red-50 transition-colors">
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 px-6 pt-4 border-b border-gray-100 shrink-0">
                    <button 
                        onClick={() => setActiveTab('members')}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'members' ? 'border-[#1E5A7A] text-[#1E5A7A]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                    >
                        <Users size={16} /> Team Members
                    </button>
                    <button 
                        onClick={() => setActiveTab('invites')}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'invites' ? 'border-[#1E5A7A] text-[#1E5A7A]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                    >
                        <MailPlus size={16} /> Invitations
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
                    
                    {/* Alerts */}
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-xl text-sm font-bold border ${message.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                            {message.text}
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 text-[#1E5A7A] animate-spin" /></div>
                    ) : (
                        <>
                            {/* Members Tab */}
                            {activeTab === 'members' && (
                                <div className="space-y-4 animate-fade-in-up">
                                    {members.length === 0 ? (
                                        <div className="text-center p-8 bg-white border border-gray-100 rounded-2xl">
                                            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <p className="text-sm font-bold text-gray-500">Only you are in this space right now.</p>
                                        </div>
                                    ) : (
                                        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                                            {members.map(member => {
                                                const u = TEAM_MEMBERS.find(m => m.id === member.user_id) || { name: 'Workspace User', initials: 'WU', color: 'bg-gray-100 text-gray-600' };
                                                
                                                return (
                                                    <div key={member.id} className="flex items-center justify-between p-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shadow-sm border border-white ${u.color}`}>
                                                                {u.initials}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-[#1F2937]">{u.name}</p>
                                                                <p className="text-xs font-medium text-gray-400 capitalize">{member.role}</p>
                                                            </div>
                                                        </div>
                                                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg capitalize">
                                                            {member.role}
                                                        </span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Invites Tab */}
                            {activeTab === 'invites' && (
                                <div className="space-y-6 animate-fade-in-up">
                                    {/* Invite Form */}
                                    <form onSubmit={handleInvite} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-end gap-3 relative z-20">
                                        <div className="flex-1 w-full">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3.5 top-3 text-gray-400" size={16} />
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={e => setEmail(e.target.value)}
                                                    placeholder="colleague@bakkah.com"
                                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-[#1E5A7A] focus:ring-2 focus:ring-[#1E5A7A]/10 transition-all font-medium"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* 🌟 Custom Dropdown Role المحدث 🌟 */}
                                        <div className="w-full sm:w-1/3 relative">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Role</label>
                                            <div 
                                                onClick={() => setIsRoleOpen(!isRoleOpen)}
                                                className="flex items-center justify-between w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-[#1F2937] hover:bg-white focus:outline-none focus:border-[#1E5A7A] focus:ring-2 focus:ring-[#1E5A7A]/10 transition-all cursor-pointer select-none"
                                            >
                                                <span className="capitalize">{role}</span>
                                                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isRoleOpen ? 'rotate-180' : ''}`} />
                                            </div>

                                            {isRoleOpen && (
                                                <>
                                                    <div className="fixed inset-0 z-30" onClick={() => setIsRoleOpen(false)} />
                                                    <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-1.5 animate-fade-in-up">
                                                        {['admin', 'manager', 'member', 'guest'].map((r) => (
                                                            <div 
                                                                key={r} 
                                                                onClick={() => { setRole(r); setIsRoleOpen(false); }} 
                                                                className={`px-4 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors text-sm font-bold capitalize ${role === r ? 'text-[#1E5A7A] bg-blue-50/50' : 'text-gray-700'}`}
                                                            >
                                                                {r}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <button 
                                            type="submit" 
                                            disabled={isInviting || !email.trim()}
                                            className="w-full sm:w-auto px-6 py-2.5 bg-[#1E5A7A] hover:bg-[#154560] text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                                        >
                                            {isInviting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} Invite
                                        </button>
                                    </form>

                                    {/* Pending Invites List */}
                                    <div className="relative z-10">
                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Pending Invitations</h3>
                                        {invitations.length === 0 ? (
                                            <p className="text-sm text-gray-400 font-medium p-4 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50/50">No pending invitations.</p>
                                        ) : (
                                            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                                                {invitations.map(inv => (
                                                    <div key={inv.id} className="flex items-center justify-between p-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100">
                                                                <Clock size={18} />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-[#1F2937]">{inv.email}</p>
                                                                <p className="text-[11px] font-bold text-gray-400">Invited as <span className="capitalize">{inv.role}</span></p>
                                                            </div>
                                                        </div>
                                                        <span className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-bold rounded-lg border border-orange-100">
                                                            Pending
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}