// src/components/pmp/project/TableView.tsx
'use client';

import React, { useState } from 'react';
import { CheckCircle2, Loader2, Circle, AlertCircle, ArrowUpCircle, Plus } from 'lucide-react';

// --- دوال الـ UI (مفصولة لنظافة الكود) ---
export const getStatusUI = (status: string) => {
    switch (status) {
        case 'Done': return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-green-50 text-green-700 border border-green-200 w-fit transition-colors"><CheckCircle2 size={14} /> {status}</span>;
        case 'In Progress': return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 w-fit transition-colors"><Loader2 size={14} className="animate-spin" /> {status}</span>;
        case 'To Do': return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-gray-50 text-gray-600 border border-gray-200 w-fit transition-colors"><Circle size={14} /> {status}</span>;
        default: return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 w-fit transition-colors"><Circle size={14} /> {status}</span>;
    }
};

export const getPriorityUI = (priority: string) => {
    switch (priority) {
        case 'High': return <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50/50 px-2 py-1 rounded-md border border-transparent"><AlertCircle size={14} /> High</span>;
        case 'Low': return <span className="flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-transparent"><ArrowUpCircle size={14} className="rotate-180" /> Low</span>;
        default: return <span className="flex items-center gap-1 text-xs font-bold text-orange-500 bg-orange-50/50 px-2 py-1 rounded-md border border-transparent"><ArrowUpCircle size={14} /> Medium</span>;
    }
};

// --- مكون صف المهمة (Task Row) ---
// 2. تحديث مكون الصف عشان يستقبل الـ statuses
const TaskRow = ({ task, onUpdate, onClick, statuses }: { task: any, onUpdate: (id: string, field: string, value: string) => void, onClick: () => void, statuses: string[] }) => {
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isPriorityOpen, setIsPriorityOpen] = useState(false);
    return (
        <div className="grid grid-cols-12 gap-4 px-6 py-3.5 items-center hover:bg-gray-50 transition-colors group border-b border-gray-100 last:border-0 relative">
            <div onClick={onClick} className="col-span-6 md:col-span-5 font-bold text-sm text-[#1F2937] group-hover:text-[#1E5A7A] transition-colors truncate pr-4 cursor-pointer">
                {task.title}
            </div>

            <div className="col-span-3 md:col-span-3 relative">
                <div onClick={() => setIsStatusOpen(!isStatusOpen)} className="cursor-pointer w-fit hover:opacity-80 transition-opacity">
                    {getStatusUI(task.status)}
                </div>
                {isStatusOpen && (
                    <>
                        <div className="fixed inset-0 z-30" onClick={() => setIsStatusOpen(false)} />
                        <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-1.5 animate-fade-in-up">
                            {/* هنا خلينا القائمة تقرأ من المشروع ديناميكياً */}
                            {statuses.map(s => (
                                <div key={s} onClick={() => { onUpdate(task.id, 'status', s); setIsStatusOpen(false); }} className="px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center transition-colors">
                                    {getStatusUI(s)}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* باقي كود الـ Priority والتاريخ زي ما هو بدون تغيير */}
            <div className="col-span-3 md:col-span-2 relative">
                <div onClick={() => setIsPriorityOpen(!isPriorityOpen)} className="cursor-pointer w-fit hover:opacity-80 transition-opacity">
                    {getPriorityUI(task.priority)}
                </div>
                {isPriorityOpen && (
                    <>
                        <div className="fixed inset-0 z-30" onClick={() => setIsPriorityOpen(false)} />
                        <div className="absolute top-full left-0 mt-2 w-32 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-1.5 animate-fade-in-up">
                            {['Low', 'Medium', 'High'].map(p => (
                                <div key={p} onClick={() => { onUpdate(task.id, 'priority', p); setIsPriorityOpen(false); }} className="px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center transition-colors">
                                    {getPriorityUI(p)}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="hidden md:block col-span-2 text-xs font-medium text-gray-400">
                {new Date(task.created_at).toLocaleDateString('en-GB')}
            </div>
        </div>
    );
};

// --- المكون الأساسي للجدول ---
// ضفنا onTaskClick للـ Props هنا
export default function TableView({ tasks, isLoading, onUpdate, onCreate, isCreating, onTaskClick, statuses }: any) {
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        onCreate(newTaskTitle);
        setNewTaskTitle('');
    };
    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 animate-fade-in-up pb-2">
            <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 bg-[#F8FAFC]/80 text-xs font-extrabold text-gray-500 uppercase tracking-wider rounded-t-3xl">
                <div className="col-span-6 md:col-span-5">Task Name</div>
                <div className="col-span-3 md:col-span-3">Status</div>
                <div className="col-span-3 md:col-span-2">Priority</div>
                <div className="hidden md:block col-span-2">Added On</div>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 text-[#1E5A7A] animate-spin" /></div>
            ) : (
                <div className="flex flex-col">
                    {tasks.map((task: any) => (
                        <TaskRow
                            key={task.id}
                            task={task}
                            onUpdate={onUpdate}
                            onClick={() => onTaskClick(task)}
                            statuses={statuses || ['To Do', 'In Progress', 'Done']}
                        />
                    ))}

                    <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors group mt-2">
                        <div className="col-span-12 md:col-span-5 flex items-center gap-3">
                            {isCreating ? <Loader2 className="w-4 h-4 text-gray-400 animate-spin shrink-0" /> : <Plus className="w-4 h-4 text-gray-400 shrink-0" />}
                            <input
                                type="text"
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                placeholder="Add new task... (Press Enter)"
                                className="w-full bg-transparent border-none text-sm font-bold text-[#1F2937] focus:outline-none focus:ring-0 placeholder-gray-400"
                                disabled={isCreating}
                            />
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
