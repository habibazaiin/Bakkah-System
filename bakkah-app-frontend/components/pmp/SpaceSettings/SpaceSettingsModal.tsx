'use client';

import React, { useState, useEffect } from 'react';
import { X, Users, MailPlus, Loader2, ShieldCheck, AlertTriangle, Layers, CheckCircle2 } from 'lucide-react';
import { PmpService } from '@/services/pmp.service';
import { Space, SpaceMember, Invitation, SpaceTeam } from '@/types/pmp.types';

// استدعاء المكونات اللي قسمناها
import SpaceSettingsMembers from './SpaceSettingsMembers';
import SpaceSettingsTeams from './SpaceSettingsTeams';
import SpaceSettingsInvites from './SpaceSettingsInvites';

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
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (isOpen && space) {
            fetchData();
        } else {
            setMessage({ type: '', text: '' });
            setActiveTab('members');
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
                            {activeTab === 'members' && <SpaceSettingsMembers spaceId={space.id} members={members} setMembers={setMembers} setMessage={setMessage} />}
                            {activeTab === 'teams' && <SpaceSettingsTeams spaceId={space.id} teams={teams} setTeams={setTeams} members={members} setMessage={setMessage} />}
                            {activeTab === 'invites' && <SpaceSettingsInvites spaceId={space.id} invitations={invitations} setInvitations={setInvitations} setMessage={setMessage} />}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}