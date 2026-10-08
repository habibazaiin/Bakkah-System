// src/components/pmp/project/TaskDetailsSidebar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { X, AlignLeft, Calendar as CalendarIcon, Save, Loader2, Trash2, CalendarDays } from 'lucide-react';
import { getStatusUI, getPriorityUI } from './TableView';
import AssigneeSelect from './AssigneeSelect'; // استيراد زرار تعيين الأشخاص الجديد
import TaskComments from './TaskComments';
import TaskAttachments from './TaskAttachments';
import TaskActivityLog from './TaskActivityLog';

interface Props {
    task: any | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (taskId: string, field: string, value: any) => Promise<void>;
    onDelete: (taskId: string) => void;
    statuses: string[]; // ضفنا دي عشان نستقبل الحالات
}

export default function TaskDetailsSidebar({ task, isOpen, onClose, onUpdate, onDelete, statuses }: Props) {
    const [description, setDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (task) {
            setDescription(task.description || '');
            setShowDeleteConfirm(false); // ريستارت لرسالة المسح لو فتحنا مهمة جديدة
        }
    }, [task]);

    if (!isOpen || !task) return null;

    const handleSaveDescription = async () => {
        if (description === task.description) return;
        setIsSaving(true);
        try {
            await onUpdate(task.id, 'description', description);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="fixed inset-0 bg-[#1F2937]/20 backdrop-blur-sm transition-opacity" onClick={onClose} />

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
                        <input
                            type="text"
                            defaultValue={task.title}
                            onBlur={(e) => { if (e.target.value.trim() && e.target.value !== task.title) onUpdate(task.id, 'title', e.target.value) }}
                            className="w-full text-2xl font-black text-[#1F2937] leading-tight bg-transparent border-2 border-transparent hover:border-gray-200 focus:border-[#1E5A7A] focus:ring-4 focus:ring-[#1E5A7A]/10 rounded-xl px-2 py-1 -ml-2 transition-all outline-none"
                        />
                    </div>

                    {/* Properties Grid */}
                    <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-4">

                        {/* Status */}
                        <div className="grid grid-cols-3 items-center gap-4">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</span>
                            <div className="col-span-2">
                                <div className="relative group/select w-fit">
                                    <select
                                        value={task.status}
                                        onChange={(e) => onUpdate(task.id, 'status', e.target.value)}
                                        className="appearance-none bg-transparent font-bold text-xs cursor-pointer focus:outline-none absolute inset-0 w-full h-full opacity-0 z-10"
                                    >
                                        {statuses.map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none group-hover/select:opacity-80 transition-opacity">
                                        {getStatusUI(task.status)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Priority */}
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

                        {/* Assignee - المكون الجديد */}
                        <div className="grid grid-cols-3 items-center gap-4 pt-2 border-t border-gray-100">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Assignee</span>
                            <div className="col-span-2 relative z-20">
                                <AssigneeSelect
                                    selectedUserId={task.assignee_id}
                                    onAssign={(userId) => onUpdate(task.id, 'assignee_id', userId)}
                                />
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-3 items-center gap-4 pt-2 border-t border-gray-100">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5"><CalendarDays size={14} /> Start</span>
                            <div className="col-span-2">
                                <input
                                    type="date"
                                    value={task.start_date || ''}
                                    onChange={(e) => onUpdate(task.id, 'start_date', e.target.value || null)}
                                    className="text-sm font-bold text-[#1F2937] bg-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1E5A7A]/20 rounded-md p-1"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 items-center gap-4">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5"><CalendarIcon size={14} /> Due</span>
                            <div className="col-span-2">
                                <input
                                    type="date"
                                    value={task.due_date || ''}
                                    onChange={(e) => onUpdate(task.id, 'due_date', e.target.value || null)}
                                    className="text-sm font-bold text-[#1F2937] bg-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1E5A7A]/20 rounded-md p-1"
                                />
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
                                className="w-full min-h-[160px] p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-[#1F2937] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1E5A7A]/10 focus:border-[#1E5A7A] transition-all resize-y"
                            />
                            <button
                                onClick={handleSaveDescription}
                                disabled={isSaving || description === task.description}
                                className="absolute bottom-4 right-4 bg-[#1E5A7A] hover:bg-[#154560] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2"
                            >
                                {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
                            </button>
                        </div>
                    </div>
                    {/* Attachments Section */}
                    <TaskAttachments taskId={task.id} />
                    {/* Comments Section */}
                    <TaskComments taskId={task.id} />
                    {/* Activity Log Section */}
                    <TaskActivityLog taskId={task.id} />
                    {/* Delete Area - Custom UI */}
                    <div className="pt-4 mt-8 border-t border-red-100 pb-8">
                        {!showDeleteConfirm ? (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl text-sm font-bold transition-all shadow-sm"
                            >
                                <Trash2 size={16} /> Delete Task
                            </button>
                        ) : (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl animate-fade-in-up">
                                <p className="text-sm font-bold text-red-800 mb-4 text-center">Are you sure? This action cannot be undone.</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="flex-1 px-4 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors shadow-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => { setShowDeleteConfirm(false); onDelete(task.id); }}
                                        className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                                    >
                                        <Trash2 size={14} /> Yes, Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}