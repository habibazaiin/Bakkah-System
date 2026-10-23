'use client';

import React, { useState } from 'react';
import { CheckSquare, Plus, Loader2, Circle, CheckCircle2 } from 'lucide-react';
import { PmpService } from '@/services/pmp.service';
import { Task } from '@/types/pmp.types';

interface Props {
    task: Task;
    subtasks: Task[];
    onSubtaskCreated: () => void;
    onUpdateSubtask: (subtaskId: string, status: string) => void;
}

export default function TaskSubtasks({ task, subtasks, onSubtaskCreated, onUpdateSubtask }: Props) {
    const [title, setTitle] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateSubtask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsCreating(true);
        try {
            await PmpService.createSubtask({
                title: title.trim(),
                project_id: task.project_id,
                parent_task_id: task.id,
                status: 'To Do',
                priority: 'Medium'
            });
            setTitle('');
            onSubtaskCreated();
        } catch (error) {
            console.error("Error creating subtask:", error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleRenameSubtask = async (subtaskId: string, newTitle: string) => {
        if (!newTitle.trim()) return;
        try {
            await PmpService.updateTask(subtaskId, { title: newTitle.trim() });
            onSubtaskCreated(); // نستدعيها لعمل ريفريش للواجهة
        } catch (error) {
            console.error("Error renaming subtask:", error);
        }
    };

    const completedCount = subtasks.filter(s => s.status === 'Done').length;
    const progressPercent = subtasks.length > 0 ? Math.round((completedCount / subtasks.length) * 100) : 0;

    return (
        <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <CheckSquare size={18} className="text-[#1E5A7A]" />
                    <h3 className="font-extrabold text-[#1F2937]">Subtasks</h3>
                </div>
                <span className="text-xs font-bold text-gray-400">{completedCount} of {subtasks.length} ({progressPercent}%)</span>
            </div>

            {subtasks.length > 0 && (
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-[#1E5A7A] rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                </div>
            )}

            <div className="space-y-2 mb-4">
                {subtasks.map((sub) => {
                    const isDone = sub.status === 'Done';
                    return (
                        <div key={sub.id} className="flex items-center justify-between p-2.5 bg-gray-50 hover:bg-gray-100/80 rounded-xl border border-gray-100 transition-colors group">
                            <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                <button
                                    onClick={() => onUpdateSubtask(sub.id, isDone ? 'To Do' : 'Done')}
                                    className="text-gray-400 hover:text-[#1E5A7A] transition-colors shrink-0"
                                >
                                    {isDone ? <CheckCircle2 size={16} className="text-green-600" /> : <Circle size={16} />}
                                </button>

                                {/* 🌟 حقل تعديل اسم المهام الفرعية 🌟 */}
                                <input
                                    type="text"
                                    defaultValue={sub.title}
                                    onBlur={(e) => {
                                        if (e.target.value !== sub.title) {
                                            handleRenameSubtask(sub.id, e.target.value);
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.currentTarget.blur();
                                        }
                                    }}
                                    className={`w-full bg-transparent border-none focus:ring-0 p-0 text-sm font-bold truncate outline-none ${isDone ? 'line-through text-gray-400' : 'text-[#1F2937] focus:text-[#1E5A7A]'}`}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <form onSubmit={handleCreateSubtask} className="flex items-center gap-2">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Add a subtask..."
                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-[#1F2937] focus:outline-none focus:border-[#1E5A7A] transition-all"
                />
                <button
                    type="submit"
                    disabled={!title.trim() || isCreating}
                    className="p-2 bg-[#1E5A7A] hover:bg-[#154560] disabled:bg-gray-200 text-white rounded-xl transition-colors"
                >
                    {isCreating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                </button>
            </form>
        </div>
    );
}