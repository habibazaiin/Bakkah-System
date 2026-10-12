'use client';

import React, { useState, useEffect, useRef } from 'react';
import { UserPlus, Check, Search, Loader2, Layers } from 'lucide-react';
import { PmpService } from '@/services/pmp.service';
import { SpaceTeam } from '@/types/pmp.types';

interface Props {
    taskId: string;
    projectId: string;
    currentAssigneeId?: string | null;
    currentTeamId?: string | null;
    onUpdate: (taskId: string, field: string, value: string | null) => void;
}

export default function AssigneeSelect({ taskId, projectId, currentAssigneeId, currentTeamId, onUpdate }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    // States for data
    const [members, setMembers] = useState<any[]>([]);
    const [teams, setTeams] = useState<SpaceTeam[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const dropdownRef = useRef<HTMLDivElement>(null);

    // إغلاق القائمة لما ندوس بره
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 🌟 التعديل هنا: هنجيب الداتا أول ما الكومبوننت يفتح علطول مش هنستنى الـ isOpen 🌟
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const projects = await PmpService.getProjects();
                const project = projects.find(p => p.id === projectId);

                if (project) {
                    const [workspaceUsers, workspaceTeams] = await Promise.all([
                        PmpService.getWorkspaceUsers(project.space_id),
                        PmpService.getSpaceTeams(project.space_id)
                    ]);
                    setMembers(workspaceUsers || []);
                    setTeams(workspaceTeams || []);
                }
            } catch (error) {
                console.error("Failed to fetch assignees", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (projectId) {
            fetchData();
        }
    }, [projectId]);

    const getAvatarProps = (name: string, userId: string) => {
        const colors = ['bg-purple-100 text-purple-700', 'bg-blue-100 text-blue-700', 'bg-green-100 text-green-700', 'bg-orange-100 text-orange-700', 'bg-pink-100 text-pink-700'];
        const charCode = userId?.charCodeAt(0) || 0;
        const color = colors[charCode % colors.length];
        const initials = name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'U';
        return { color, initials };
    };

    const filteredMembers = members.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()));
    const filteredTeams = teams.filter(t => t.name?.toLowerCase().includes(search.toLowerCase()));

    const selectedMember = members.find(u => u.user_id === currentAssigneeId);
    const selectedTeam = teams.find(t => t.id === currentTeamId);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-gray-300 hover:border-[#1E5A7A] hover:bg-[#1E5A7A]/5 transition-all group w-full sm:w-auto min-w-[140px]"
            >
                {isLoading ? (
                    <Loader2 size={14} className="animate-spin text-gray-400" />
                ) : selectedTeam ? (
                    <>
                        <div className="w-5 h-5 rounded-md bg-[#1E5A7A]/10 text-[#1E5A7A] flex items-center justify-center">
                            <Layers size={12} />
                        </div>
                        <span className="text-xs font-bold text-[#1F2937] truncate">{selectedTeam.name}</span>
                    </>
                ) : selectedMember ? (
                    <>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${getAvatarProps(selectedMember.name, selectedMember.user_id).color}`}>
                            {getAvatarProps(selectedMember.name, selectedMember.user_id).initials}
                        </div>
                        <span className="text-xs font-bold text-[#1F2937] truncate">{selectedMember.name}</span>
                    </>
                ) : (
                    <>
                        <UserPlus size={14} className="text-gray-400 group-hover:text-[#1E5A7A]" />
                        <span className="text-xs font-bold text-gray-500 group-hover:text-[#1E5A7A]">Assign to...</span>
                    </>
                )}
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 animate-fade-in-up overflow-hidden">
                    <div className="p-3 border-b border-gray-50 relative">
                        <Search size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            autoFocus
                            type="text"
                            placeholder="Search team or member..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:bg-white focus:border-[#1E5A7A] transition-all"
                        />
                    </div>

                    <div className="max-h-64 overflow-y-auto p-2 hide-scrollbar">
                        {isLoading ? (
                            <div className="flex justify-center p-4"><Loader2 size={16} className="animate-spin text-[#1E5A7A]" /></div>
                        ) : (
                            <>
                                {/* 🌟 Teams Section 🌟 */}
                                {filteredTeams.length > 0 && (
                                    <div className="mb-3">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider px-3 mb-1">Teams</h4>
                                        {filteredTeams.map(team => (
                                            <div
                                                key={team.id}
                                                onClick={() => {
                                                    onUpdate(taskId, 'team_id', team.id);
                                                    setIsOpen(false);
                                                }}
                                                className="flex items-center justify-between p-2 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-7 h-7 rounded-md bg-[#1E5A7A]/10 text-[#1E5A7A] flex items-center justify-center">
                                                        <Layers size={14} />
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-700 group-hover:text-[#1E5A7A]">{team.name}</span>
                                                </div>
                                                {currentTeamId === team.id && <Check size={14} className="text-[#1E5A7A]" />}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* 🌟 Members Section 🌟 */}
                                {filteredMembers.length > 0 && (
                                    <div>
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider px-3 mb-1">Members</h4>
                                        {filteredMembers.map(user => {
                                            const { color, initials } = getAvatarProps(user.name, user.user_id);
                                            return (
                                                <div
                                                    key={user.user_id}
                                                    onClick={() => {
                                                        onUpdate(taskId, 'assignee_id', user.user_id);
                                                        setIsOpen(false);
                                                    }}
                                                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-sm ${color}`}>
                                                            {initials}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-[#1F2937]">{user.name}</span>
                                                            <span className="text-[10px] font-bold text-gray-400 capitalize">{user.role}</span>
                                                        </div>
                                                    </div>
                                                    {currentAssigneeId === user.user_id && <Check size={14} className="text-[#1E5A7A]" />}
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}

                                {filteredTeams.length === 0 && filteredMembers.length === 0 && (
                                    <div className="text-center p-4 text-xs font-bold text-gray-400">No results found.</div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}