'use client';

import React, { useState, useEffect, useRef } from 'react';
import { UserPlus, Search, Check, X } from 'lucide-react';
import { TEAM_MEMBERS } from '@/constants/team';

interface Props {
    selectedUserId?: string;
    onAssign: (userId: string | null) => void;
}

export default function AssigneeSelect({ selectedUserId, onAssign }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedUser = TEAM_MEMBERS.find(u => u.id === selectedUserId);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredMembers = TEAM_MEMBERS.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border outline-none ${
                    selectedUser
                        ? 'bg-white border-gray-200 hover:bg-gray-50 shadow-sm'
                        : 'bg-white border-dashed border-gray-300 text-gray-500 hover:border-[#1E5A7A] hover:text-[#1E5A7A]'
                }`}
            >
                {selectedUser ? (
                    <>
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${selectedUser.color}`}>
                            {selectedUser.initials}
                        </span>
                        <span className="text-[#1F2937]">{selectedUser.name}</span>
                        <div
                            className="text-gray-400 hover:text-red-500 ml-1 p-0.5 rounded-md hover:bg-red-50 transition-colors"
                            onClick={(e) => { e.stopPropagation(); onAssign(null); }}
                        >
                            <X size={14} />
                        </div>
                    </>
                ) : (
                    <>
                        <UserPlus size={14} /> Assign to...
                    </>
                )}
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in-up flex flex-col">
                    <div className="p-2 border-b border-gray-50 bg-gray-50/50">
                        <div className="relative flex items-center">
                            <Search className="absolute left-3 text-gray-400" size={14} />
                            <input
                                type="text"
                                placeholder="Search team..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white border border-gray-200 text-xs font-medium rounded-lg pl-9 pr-3 py-2 outline-none focus:border-[#1E5A7A] focus:ring-1 focus:ring-[#1E5A7A] transition-all"
                            />
                        </div>
                    </div>

                    <div className="max-h-48 overflow-y-auto p-1 hide-scrollbar">
                        {filteredMembers.length === 0 ? (
                            <p className="text-center text-xs text-gray-400 py-4 font-medium">No members found</p>
                        ) : (
                            filteredMembers.map(member => (
                                <div
                                    key={member.id}
                                    onClick={() => { onAssign(member.id); setIsOpen(false); }}
                                    className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                                        selectedUserId === member.id ? 'bg-[#1E5A7A]/5' : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shadow-sm border border-white ${member.color}`}>
                                            {member.initials}
                                        </span>
                                        <span className={`text-sm font-bold ${selectedUserId === member.id ? 'text-[#1E5A7A]' : 'text-[#1F2937]'}`}>
                                            {member.name}
                                        </span>
                                    </div>
                                    {selectedUserId === member.id && <Check size={16} className="text-[#1E5A7A]" strokeWidth={3} />}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}