'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Task } from '@/types/pmp.types';

// استدعاء المكونات اللي قسمناها
import TaskProperties from './TaskProperties';
import TaskDescription from './TaskDescription';
import TaskSubtasks from './TaskSubtasks';
import TaskAttachments from './TaskAttachments';
import TaskComments from './TaskComments';
import TaskActivityLog from './TaskActivityLog';
import TaskDeleteZone from './TaskDeleteZone';

interface Props {
    task: Task | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (taskId: string, field: string, value: any) => Promise<void>;
    onDelete: (taskId: string) => void;
    statuses: string[];
    allTasks: Task[];
    refreshTasks: () => void;
}

export default function TaskDetailsSidebar({ task, isOpen, onClose, onUpdate, onDelete, statuses, allTasks, refreshTasks }: Props) {

    if (!isOpen || !task) return null;

    const subtasks = allTasks.filter(t => t.parent_task_id === task.id);

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* الخلفية الضبابية */}
            <div className="fixed inset-0 bg-[#1F2937]/20 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-in-right border-l border-gray-100">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#F8FAFC]">
                    <h2 className="text-sm font-black text-[#1E5A7A] uppercase tracking-wider">Task Details</h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-[#B03052] hover:bg-red-50 rounded-xl transition-colors">
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>

                {/* المحتوى الداخلي المجمع من الملفات */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* حقل تغيير اسم المهمة الرئيسية */}
                    <div>
                        <input
                            type="text"
                            defaultValue={task.title}
                            onBlur={(e) => {
                                const newTitle = e.target.value.trim();
                                if (newTitle !== '' && newTitle !== task.title) {
                                    onUpdate(task.id, 'title', newTitle);
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') e.currentTarget.blur();
                            }}
                            className="text-2xl font-black text-[#1F2937] bg-transparent border border-transparent hover:border-gray-200 focus:bg-white focus:border-[#1E5A7A] focus:ring-4 focus:ring-[#1E5A7A]/10 rounded-xl px-3 py-1.5 -ml-3 w-full transition-all outline-none"
                        />
                    </div>

                    <TaskProperties task={task} allTasks={allTasks} statuses={statuses} onUpdate={onUpdate} />

                    <TaskDescription taskId={task.id} initialDescription={task.description || ''} onUpdate={onUpdate} />

                    <TaskSubtasks task={task} subtasks={subtasks} onSubtaskCreated={refreshTasks} onUpdateSubtask={(subId, status) => onUpdate(subId, 'status', status)} />

                    <TaskAttachments taskId={task.id} />

                    <TaskComments taskId={task.id} />

                    {/* حيلة الـ key لتحديث الـ Activity أوتوماتيك عند أي تعديل */}
                    <TaskActivityLog key={Math.random()} taskId={task.id} />

                    <TaskDeleteZone taskId={task.id} onDelete={onDelete} onClose={onClose} />

                </div>
            </div>
        </div>
    );
}