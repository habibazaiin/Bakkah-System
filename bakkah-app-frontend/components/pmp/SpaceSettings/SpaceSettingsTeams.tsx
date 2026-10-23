'use client';

import React, { useState } from 'react';
import { Layers, Plus, Loader2, Trash2, ChevronDown } from 'lucide-react';
import { PmpService } from '@/services/pmp.service';
import { SpaceTeam, SpaceMember } from '@/types/pmp.types';

interface Props {
    spaceId: string;
    teams: SpaceTeam[];
    setTeams: React.Dispatch<React.SetStateAction<SpaceTeam[]>>;
    members: SpaceMember[];
    setMessage: React.Dispatch<React.SetStateAction<{ type: string; text: string }>>;
}

export default function SpaceSettingsTeams({ spaceId, teams, setTeams, members, setMessage }: Props) {
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [newTeamName, setNewTeamName] = useState('');
    const [isCreatingTeam, setIsCreatingTeam] = useState(false);
    const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);
    const [teamToDelete, setTeamToDelete] = useState<string | null>(null);

    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTeamName.trim()) return;
        setIsCreatingTeam(true);
        setMessage({ type: '', text: '' });
        try {
            const newTeam = await PmpService.createTeam({ space_id: spaceId, name: newTeamName.trim(), description: '' });
            newTeam.members = [];
            setTeams(prev => [...prev, newTeam]);
            setNewTeamName('');
            setMessage({ type: 'success', text: 'Team created successfully!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to create team.' });
        } finally {
            setIsCreatingTeam(false);
        }
    };

    const confirmDeleteTeam = async () => {
        if (!teamToDelete) return;
        setProcessingId(`delete-team-${teamToDelete}`);
        try {
            await PmpService.deleteTeam(spaceId, teamToDelete);
            setTeams(prev => prev.filter(t => t.id !== teamToDelete));
            setMessage({ type: 'success', text: 'Team deleted successfully.' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to delete team.' });
        } finally {
            setProcessingId(null);
            setTeamToDelete(null);
        }
    };

    const toggleTeamMember = async (teamId: string, userId: string, isMember: boolean) => {
        setProcessingId(`toggle-${teamId}-${userId}`);
        setMessage({ type: '', text: '' });
        try {
            if (isMember) {
                await PmpService.removeTeamMember(spaceId, teamId, userId);
                setTeams(prev => prev.map(t => t.id === teamId ? { ...t, members: t.members.filter(m => m !== userId) } : t));
            } else {
                await PmpService.addTeamMember(spaceId, teamId, userId);
                setTeams(prev => prev.map(t => t.id === teamId ? { ...t, members: [...t.members, userId] } : t));
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update team member.' });
        } finally {
            setProcessingId(null);
        }
    };

    return (
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
                                        <input
                                            type="text"
                                            defaultValue={team.name}
                                            onClick={(e) => e.stopPropagation()}
                                            onBlur={async (e) => {
                                                const newName = e.target.value.trim();
                                                if (newName !== '' && newName !== team.name) {
                                                    try {
                                                        await PmpService.updateTeam(spaceId, team.id, newName);
                                                        setTeams(prev => prev.map(t => t.id === team.id ? { ...t, name: newName } : t));
                                                    } catch (error) {
                                                        console.error("Error renaming team:", error);
                                                    }
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') e.currentTarget.blur();
                                            }}
                                            className="font-bold text-[#1F2937] bg-transparent border-none focus:ring-0 p-0 hover:bg-gray-100 rounded px-1 transition-colors outline-none w-full"
                                        />
                                        <p className="text-xs font-bold text-gray-400">{team.members.length} members</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={(e) => { e.stopPropagation(); setTeamToDelete(team.id); }} disabled={processingId === `delete-team-${team.id}`} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        {processingId === `delete-team-${team.id}` ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                    </button>
                                    <ChevronDown size={18} className={`text-gray-400 transition-transform ${expandedTeamId === team.id ? 'rotate-180' : ''}`} />
                                </div>
                            </div>

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

            {/* Custom Confirm Modal for Team Deletion */}
            {teamToDelete && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-[#1F2937]/60 backdrop-blur-sm transition-opacity" onClick={() => setTeamToDelete(null)} />
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center animate-fade-in-up z-10">
                        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-red-100">
                            <Trash2 size={32} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-2xl font-black text-[#1F2937] mb-2">Delete Team?</h3>
                        <p className="text-sm text-gray-500 font-medium mb-8 leading-relaxed">Are you sure you want to delete this team? This action cannot be undone and will remove all members from it.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setTeamToDelete(null)} disabled={processingId === `delete-team-${teamToDelete}`} className="flex-1 px-5 py-3.5 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors border border-gray-200">Cancel</button>
                            <button onClick={confirmDeleteTeam} disabled={processingId === `delete-team-${teamToDelete}`} className="flex-1 px-5 py-3.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-md flex justify-center items-center gap-2">
                                {processingId === `delete-team-${teamToDelete}` ? <Loader2 size={18} className="animate-spin" /> : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}