'use client';

import React, { useState } from 'react';
import { Users, Loader2, ChevronDown, UserMinus } from 'lucide-react';
import { PmpService } from '@/services/pmp.service';
import { SpaceMember } from '@/types/pmp.types';

interface Props {
    spaceId: string;
    members: SpaceMember[];
    setMembers: React.Dispatch<React.SetStateAction<SpaceMember[]>>;
    setMessage: React.Dispatch<React.SetStateAction<{ type: string; text: string }>>;
}

export default function SpaceSettingsMembers({ spaceId, members, setMembers, setMessage }: Props) {
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [memberToRemove, setMemberToRemove] = useState<string | null>(null);

    const handleUpdateRole = async (userId: string, newRole: string) => {
        setProcessingId(userId);
        setOpenDropdownId(null);
        setMessage({ type: '', text: '' });
        try {
            await PmpService.updateMemberRole(spaceId, userId, newRole);
            setMembers(prev => prev.map(m => m.user_id === userId ? { ...m, role: newRole as SpaceMember['role'] } : m));
            setMessage({ type: 'success', text: 'Member role updated successfully.' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || "Failed to update role. You might not have permission." });
        } finally {
            setProcessingId(null);
        }
    };

    const confirmRemoveMember = async () => {
        if (!memberToRemove) return;
        setProcessingId(memberToRemove);
        setMessage({ type: '', text: '' });
        try {
            await PmpService.removeMember(spaceId, memberToRemove);
            setMembers(prev => prev.filter(m => m.user_id !== memberToRemove));
            setMessage({ type: 'success', text: 'Member removed from workspace.' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || "Failed to remove member." });
        } finally {
            setProcessingId(null);
            setMemberToRemove(null);
        }
    };

    return (
        <div className="space-y-4 animate-fade-in-up">
            {members.length === 0 ? (
                <div className="text-center p-8 bg-white border border-gray-100 rounded-2xl">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-bold text-gray-500">Only you are in this space right now.</p>
                </div>
            ) : (
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm">
                    {members.map(member => {
                        const name = member.name || member.email || 'Unknown User';
                        const initials = name.substring(0, 2).toUpperCase();
                        const colors = ['bg-purple-100 text-purple-700', 'bg-blue-100 text-blue-700', 'bg-green-100 text-green-700', 'bg-orange-100 text-orange-700', 'bg-pink-100 text-pink-700'];
                        const color = colors[(member.user_id?.charCodeAt(0) || 0) % colors.length];
                        const u = { name, initials, color };
                        const isOwner = member.role === 'owner';

                        return (
                            <div key={member.user_id} className="flex items-center justify-between p-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shadow-sm border border-white ${u.color}`}>{u.initials}</div>
                                    <div>
                                        <p className="text-sm font-bold text-[#1F2937]">{u.name}</p>
                                        <p className="text-xs font-medium text-gray-400 capitalize">{member.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {processingId === member.user_id ? (
                                        <div className="px-4 py-1.5"><Loader2 size={16} className="text-[#1E5A7A] animate-spin" /></div>
                                    ) : (
                                        <>
                                            {isOwner ? (
                                                <span className="px-3 py-1.5 bg-purple-50 text-purple-600 border border-purple-100 text-xs font-bold rounded-lg mr-1">Owner</span>
                                            ) : (
                                                <div className="relative">
                                                    <div onClick={() => setOpenDropdownId(openDropdownId === member.user_id ? null : member.user_id)} className="flex items-center justify-between gap-2 px-3 py-1.5 bg-white border border-gray-200 hover:border-[#1E5A7A] hover:bg-gray-50 rounded-lg cursor-pointer transition-all min-w-[100px]">
                                                        <span className="text-xs font-bold text-gray-700 capitalize">{member.role}</span>
                                                        <ChevronDown size={14} className={`text-gray-400 transition-transform ${openDropdownId === member.user_id ? 'rotate-180' : ''}`} />
                                                    </div>
                                                    {openDropdownId === member.user_id && (
                                                        <>
                                                            <div className="fixed inset-0 z-30" onClick={() => setOpenDropdownId(null)} />
                                                            <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-100 rounded-xl shadow-xl z-[100] py-1 overflow-hidden animate-fade-in-up">
                                                                {['admin', 'manager', 'member', 'guest'].map((r) => (
                                                                    <div key={r} onClick={() => handleUpdateRole(member.user_id, r)} className={`px-4 py-2.5 text-xs font-bold capitalize cursor-pointer hover:bg-gray-50 transition-colors ${member.role === r ? 'text-[#1E5A7A] bg-blue-50/50' : 'text-gray-700'}`}>{r}</div>
                                                                ))}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                            {!isOwner && (
                                                <button onClick={() => setMemberToRemove(member.user_id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100 ml-1" title="Remove Member">
                                                    <UserMinus size={16} />
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Custom Confirm Modal for User Deletion */}
            {memberToRemove && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-[#1F2937]/60 backdrop-blur-sm transition-opacity" onClick={() => setMemberToRemove(null)} />
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center animate-fade-in-up z-10">
                        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-red-100"><UserMinus size={32} strokeWidth={2.5} /></div>
                        <h3 className="text-2xl font-black text-[#1F2937] mb-2">Remove Member?</h3>
                        <p className="text-sm text-gray-500 font-medium mb-8 leading-relaxed">Are you sure you want to remove this member from the workspace? They will lose access to all projects.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setMemberToRemove(null)} disabled={processingId === memberToRemove} className="flex-1 px-5 py-3.5 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors border border-gray-200">Cancel</button>
                            <button onClick={confirmRemoveMember} disabled={processingId === memberToRemove} className="flex-1 px-5 py-3.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-md flex justify-center items-center gap-2">
                                {processingId === memberToRemove ? <Loader2 size={18} className="animate-spin" /> : 'Yes, Remove'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}