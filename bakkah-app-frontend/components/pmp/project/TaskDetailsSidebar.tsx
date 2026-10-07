// src/components/pmp/project/TaskDetailsSidebar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { X, AlignLeft, Calendar as CalendarIcon, Clock, Save, Loader2 } from 'lucide-react';
import { getStatusUI, getPriorityUI } from './TableView';

interface Props {
    task: any | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (taskId: string, field: string, value: string) => Promise<void>;
}

export default function TaskDetailsSidebar({ task, isOpen, onClose, onUpdate }: Props) {
    const [description, setDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // تحديث الوصف لما نفتح مهمة جديدة
    useEffect(() => {
        if (task) {
            setDescription(task.description || '');
        }
    }, [task]);

    if (!isOpen || !task) return null;

    const handleSaveDescription = async () => {
        if (description === task.description) return; // لو مفيش تغيير متعملش حاجة
        setIsSaving(true);
        try {
            await onUpdate(task.id, 'description', description);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* الخلفية الشفافة اللي بتقفل الشريط لما تدوسي عليها */}
            <div className="fixed inset-0 bg-[#1F2937]/20 backdrop-blur-sm transition-opacity" onClick={onClose} />
            
            {/* الشريط الجانبي */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-in-right border-l border-gray-100">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#F8FAFC]">
                    <h2 className="text-sm font-black text-[#1E5A7A] uppercase tracking-wider">Task Details</h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-[#B03052] hover:bg-red-50 rounded-xl transition-colors">
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Task Title */}
                    <div>
                        <h1 className="text-2xl font-black text-[#1F2937] leading-tight">{task.title}</h1>
                    </div>

                    {/* Properties Grid */}
                    <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-4">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</span>
                            <div className="col-span-2">
                                <div className="relative group/select w-fit">
                                    <select 
                                        value={task.status}
                                        onChange={(e) => onUpdate(task.id, 'status', e.target.value)}
                                        className="appearance-none bg-transparent font-bold text-xs cursor-pointer focus:outline-none absolute inset-0 w-full h-full opacity-0 z-10"
                                    >
                                        <option value="To Do">To Do</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Done">Done</option>
                                    </select>
                                    <div className="pointer-events-none group-hover/select:opacity-80 transition-opacity">
                                        {getStatusUI(task.status)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 items-center gap-4">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Priority</span>
                            <div className="col-span-2">
                                <div className="relative group/select w-fit">
                                    <select 
                                        value={task.priority}
                                        onChange={(e) => onUpdate(task.id, 'priority', e.target.value)}
                                        className="appearance-none bg-transparent font-bold text-xs cursor-pointer focus:outline-none absolute inset-0 w-full h-full opacity-0 z-10"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                    <div className="pointer-events-none group-hover/select:opacity-80 transition-opacity">
                                        {getPriorityUI(task.priority)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 items-center gap-4">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5"><CalendarIcon size={14}/> Created</span>
                            <div className="col-span-2 text-sm font-bold text-[#1F2937]">
                                {new Date(task.created_at).toLocaleDateString('en-GB')}
                            </div>
                        </div>
                    </div>

                    {/* Description Area */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <AlignLeft size={18} className="text-[#1E5A7A]" />
                            <h3 className="font-extrabold text-[#1F2937]">Description</h3>
                        </div>
                        <div className="relative">
                            <textarea 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Add a more detailed description..."
                                className="w-full min-h-[200px] p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-[#1F2937] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1E5A7A]/10 focus:border-[#1E5A7A] transition-all resize-y"
                            />
                            <button 
                                onClick={handleSaveDescription}
                                disabled={isSaving || description === task.description}
                                className="absolute bottom-4 right-4 bg-[#1E5A7A] hover:bg-[#154560] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2"
                            >
                                {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                Save
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}