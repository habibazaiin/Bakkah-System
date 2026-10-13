'use client';

import React, { useState, useEffect } from 'react';
import { X, Users, MailPlus, Loader2, ShieldCheck, Mail, Send, Clock, ChevronDown, UserMinus, AlertTriangle, Layers, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { PmpService } from '@/services/pmp.service';
import { Space, SpaceMember, Invitation, SpaceTeam } from '@/types/pmp.types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    space: Space | null;
}

export default function SpaceSettingsModal({ isOpen, onClose, space }: Props) {
    const [activeTab, setActiveTab] = useState<'members' | 'teams' | 'invites'>('members');
    const [members, setMembers] = useState<SpaceMember[]>([]);
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [teams, setTeams] = useState<SpaceTeam[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Invite States
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('member');
    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const [isInviting, setIsInviting] = useState(false);

    // Team States
    const [newTeamName, setNewTeamName] = useState('');
    const [isCreatingTeam, setIsCreatingTeam] = useState(false);
    const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);

    // UI Feedback States
    const [message, setMessage] = useState({ type: '', text: '' });
    const [processingId, setProcessingId] = useState<string | null>(null);

    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [memberToRemove, setMemberToRemove] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && space) {
            fetchData();
        } else {
            setMessage({ type: '', text: '' });
            setEmail('');
            setRole('member');
            setNewTeamName('');
            setIsRoleOpen(false);
            setActiveTab('members');
            setOpenDropdownId(null);
            setMemberToRemove(null);
            setExpandedTeamId(null);
        }
    }, [isOpen, space]);

    const fetchData = async () => {
        if (!space) return;
        setIsLoading(true);
        try {
            const [membersData, invitesData, teamsData] = await Promise.all([
                PmpService.getSpaceMembers(space.id),
                PmpService.getSpaceInvitations(space.id),
                PmpService.getSpaceTeams(space.id)
            ]);
            setMembers(membersData);
            setInvitations(invitesData);
            setTeams(teamsData);
        } catch (error) {
            console.error("Failed to load settings data", error);
        } finally {
            setIsLoading(false);
        }
    };

    // === Invitations Handlers ===
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

    // === Members Handlers ===
    const handleUpdateRole = async (userId: string, newRole: string) => {
        if (!space) return;
        setProcessingId(userId);
        setOpenDropdownId(null);
        setMessage({ type: '', text: '' });
        try {
            await PmpService.updateMemberRole(space.id, userId, newRole);
            setMembers(prev => prev.map(m => m.user_id === userId ? { ...m, role: newRole as SpaceMember['role'] } : m));
            setMessage({ type: 'success', text: 'Member role updated successfully.' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || "Failed to update role. You might not have permission." });
        } finally {
            setProcessingId(null);
        }
    };

    const confirmRemoveMember = async () => {
        if (!space || !memberToRemove) return;
        setProcessingId(memberToRemove);
        setMessage({ type: '', text: '' });
        try {
            await PmpService.removeMember(space.id, memberToRemove);
            setMembers(prev => prev.filter(m => m.user_id !== memberToRemove));
            setMessage({ type: 'success', text: 'Member removed from workspace.' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || "Failed to remove member." });
        } finally {
            setProcessingId(null);
            setMemberToRemove(null);
        }
    };

    // === Teams Handlers ===
    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!space || !newTeamName.trim()) return;
        setIsCreatingTeam(true);
        setMessage({ type: '', text: '' });
        try {
            const newTeam = await PmpService.createTeam({ space_id: space.id, name: newTeamName.trim(), description: '' });
            newTeam.members = []; // تهيئة قائمة الأعضاء
            setTeams(prev => [...prev, newTeam]);
            setNewTeamName('');
            setMessage({ type: 'success', text: 'Team created successfully!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to create team.' });
        } finally {
            setIsCreatingTeam(false);
        }
    };

    const handleDeleteTeam = async (teamId: string) => {
        if (!space || !window.confirm("Are you sure you want to delete this team?")) return;
        setProcessingId(`delete-team-${teamId}`);
        try {
            await PmpService.deleteTeam(space.id, teamId);
            setTeams(prev => prev.filter(t => t.id !== teamId));
            setMessage({ type: 'success', text: 'Team deleted successfully.' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to delete team.' });
        } finally {
            setProcessingId(null);
        }
    };

    const toggleTeamMember = async (teamId: string, userId: string, isMember: boolean) => {
        if (!space) return;
        setProcessingId(`toggle-${teamId}-${userId}`);
        setMessage({ type: '', text: '' });
        try {
            if (isMember) {
                await PmpService.removeTeamMember(space.id, teamId, userId);
                setTeams(prev => prev.map(t => t.id === teamId ? { ...t, members: t.members.filter(m => m !== userId) } : t));
            } else {
                await PmpService.addTeamMember(space.id, teamId, userId);
                setTeams(prev => prev.map(t => t.id === teamId ? { ...t, members: [...t.members, userId] } : t));
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update team member.' });
        } finally {
            setProcessingId(null);
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
                        <p className="text-sm text-gray-500 font-medium mt-1">Manage team members, teams, and permissions.</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-[#B03052] rounded-xl hover:bg-red-50 transition-colors">
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 px-6 pt-4 border-b border-gray-100 shrink-0">
                    <button onClick={() => setActiveTab('members')} className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'members' ? 'border-[#1E5A7A] text-[#1E5A7A]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
                        <Users size={16} /> Members
                    </button>
                    <button onClick={() => setActiveTab('teams')} className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'teams' ? 'border-[#1E5A7A] text-[#1E5A7A]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
                        <Layers size={16} /> Teams
                    </button>
                    <button onClick={() => setActiveTab('invites')} className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'invites' ? 'border-[#1E5A7A] text-[#1E5A7A]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
                        <MailPlus size={16} /> Invitations
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 pb-32 bg-gray-50/30">
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-xl text-sm font-bold border flex items-center gap-3 animate-fade-in-up ${message.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                            {message.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
                            {message.text}
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 text-[#1E5A7A] animate-spin" /></div>
                    ) : (
                        <>
                            {/* === Members Tab === */}
                            {activeTab === 'members' && (
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
                                </div>
                            )}

                            {/* === Teams Tab === */}
                            {activeTab === 'teams' && (
                                <div className="space-y-6 animate-fade-in-up">
                                    <form onSubmit={handleCreateTeam} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-end gap-3 relative z-20">
                                        <div className="flex-1 w-full">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Team Name</label>
                                            <div className="relative">
                                                <Layers className="absolute left-3.5 top-3 text-gray-400" size={16} />
                                                <input type="text" value={newTeamName} onChange={e => setNewTeamName(e.target.value)} placeholder="e.g. Design Team" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-[#1E5A7A] focus:ring-2 focus:ring-[#1E5A7A]/10 transition-all font-medium" required />
                                            </div>
                                        </div>
                                        <button type="submit" disabled={isCreatingTeam || !newTeamName.trim()} className="w-full sm:w-auto px-6 py-2.5 bg-[#1E5A7A] hover:bg-[#154560] text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                                            {isCreatingTeam ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Create Team
                                        </button>
                                    </form>

                                    <div className="relative z-10 space-y-4">
                                        {teams.length === 0 ? (
                                            <p className="text-sm text-gray-400 font-medium p-6 text-center border border-dashed border-gray-200 rounded-xl bg-white">No teams created yet.</p>
                                        ) : (
                                            teams.map(team => (
                                                <div key={team.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                                                    <div className="flex items-center justify-between p-4 bg-gray-50/50 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setExpandedTeamId(expandedTeamId === team.id ? null : team.id)}>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-[#1E5A7A]/10 text-[#1E5A7A] flex items-center justify-center"><Layers size={20} /></div>
                                                            <div>
                                                                <h4 className="text-sm font-bold text-[#1F2937]">{team.name}</h4>
                                                                <p className="text-xs font-bold text-gray-400">{team.members.length} members</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <button onClick={(e) => { e.stopPropagation(); handleDeleteTeam(team.id); }} disabled={processingId === `delete-team-${team.id}`} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                                {processingId === `delete-team-${team.id}` ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                                            </button>
                                                            <ChevronDown size={18} className={`text-gray-400 transition-transform ${expandedTeamId === team.id ? 'rotate-180' : ''}`} />
                                                        </div>
                                                    </div>

                                                    {/* Members Assignment Area */}
                                                    {expandedTeamId === team.id && (
                                                        <div className="p-2 max-h-60 overflow-y-auto">
                                                            {members.length === 0 ? (
                                                                <p className="text-xs text-gray-500 p-4 text-center">No members available to add.</p>
                                                            ) : (
                                                                members.map(member => {
                                                                    const name = member.name || member.email || 'Unknown User';
                                                                    const initials = name.substring(0, 2).toUpperCase();
                                                                    const colors = ['bg-purple-100 text-purple-700', 'bg-blue-100 text-blue-700', 'bg-green-100 text-green-700', 'bg-orange-100 text-orange-700', 'bg-pink-100 text-pink-700'];
                                                                    const color = colors[(member.user_id?.charCodeAt(0) || 0) % colors.length];

                                                                    const u = { name, initials, color };
                                                                    const isMember = team.members.includes(member.user_id);
                                                                    const procId = `toggle-${team.id}-${member.user_id}`;

                                                                    return (
                                                                        <div key={member.user_id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition-colors">
                                                                            <div className="flex items-center gap-3">
                                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-sm ${u.color}`}>{u.initials}</div>
                                                                                <p className="text-sm font-bold text-gray-700">{u.name}</p>
                                                                            </div>
                                                                            <button onClick={() => toggleTeamMember(team.id, member.user_id, isMember)} disabled={processingId === procId} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border w-24 flex justify-center ${isMember ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' : 'bg-white text-[#1E5A7A] border-gray-200 hover:border-[#1E5A7A]'}`}>
                                                                                {processingId === procId ? <Loader2 size={14} className="animate-spin" /> : isMember ? 'Remove' : 'Add'}
                                                                            </button>
                                                                        </div>
                                                                    )
                                                                })
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* === Invites Tab === */}
                            {activeTab === 'invites' && (
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
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Custom Confirm Modal for Deletion */}
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