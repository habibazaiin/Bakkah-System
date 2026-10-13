'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, Circle, Clock, Briefcase } from 'lucide-react';
import { PmpService } from '@/services/pmp.service';
import { getStatusUI, getPriorityUI } from '@/components/pmp/project/TableView';
import TaskDetailsSidebar from '@/components/pmp/project/TaskDetailsSidebar';

export default function MyTasksPage() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState<any | null>(null);

    // 🌟 طلعنا الدالة دي بره عشان نبعتها للسايد بار يعمل بيها ريفريش
    const fetchMyTasks = async () => {
        try {
            setIsLoading(true);
            const data = await PmpService.getMyTasks();
            setTasks(data || []);
        } catch (error) {
            console.error("Failed to fetch my tasks", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMyTasks();
    }, []);

    const handleUpdateTask = async (taskId: string, field: string, value: any) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, [field]: value } : t));
        if (selectedTask?.id === taskId) {
            setSelectedTask({ ...selectedTask, [field]: value });
        }
    };

    // 🌟 دالة المسح اللي السايد بار مستنيها
    const handleDeleteTask = async (taskId: string) => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
        setSelectedTask(null);
    };

    const groupedTasks = {
        'In Progress': tasks.filter(t => t.status === 'In Progress'),
        'To Do': tasks.filter(t => t.status === 'To Do'),
        'Done': tasks.filter(t => t.status === 'Done'),
    };

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="w-10 h-10 text-[#1E5A7A] animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto animate-fade-in-up">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-[#1F2937] mb-2 flex items-center gap-3">
                    <CheckCircle2 className="text-[#1E5A7A]" size={32} />
                    My Tasks
                </h1>
                <p className="text-gray-500 font-medium">Manage all your assigned tasks across all projects and teams in one place.</p>
            </div>

            {tasks.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                    <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">You're all caught up!</h3>
                    <p className="text-gray-500 font-medium">No tasks assigned to you or your teams right now.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-8">
                    {Object.entries(groupedTasks).map(([status, statusTasks]) => {
                        if (statusTasks.length === 0) return null;

                        return (
                            <div key={status} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-[#F8FAFC]/80 flex items-center justify-between">
                                    <h2 className="text-sm font-extrabold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        {status === 'In Progress' ? <Clock size={16} className="text-blue-500" /> :
                                            status === 'Done' ? <CheckCircle2 size={16} className="text-green-500" /> :
                                                <Circle size={16} className="text-gray-400" />}
                                        {status}
                                    </h2>
                                    <span className="bg-white text-gray-500 text-xs font-bold px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                                        {statusTasks.length}
                                    </span>
                                </div>

                                <div className="flex flex-col">
                                    {statusTasks.map((task: any) => (
                                        <div
                                            key={task.id}
                                            onClick={() => setSelectedTask(task)}
                                            className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 group cursor-pointer"
                                        >
                                            <div className="col-span-12 md:col-span-5 flex flex-col gap-1 pr-4">
                                                <span className="font-bold text-sm text-[#1F2937] group-hover:text-[#1E5A7A] transition-colors line-clamp-1">
                                                    {task.title}
                                                </span>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                                    <Briefcase size={10} />
                                                    {task.projects?.name || 'Unknown Project'}
                                                </span>
                                            </div>

                                            <div className="col-span-4 md:col-span-3">
                                                {getStatusUI(task.status)}
                                            </div>

                                            <div className="col-span-4 md:col-span-2">
                                                {getPriorityUI(task.priority)}
                                            </div>

                                            <div className="col-span-4 md:col-span-2 text-xs font-medium text-gray-400 flex items-center justify-end md:justify-start gap-1">
                                                {task.team_id ? (
                                                    <span className="bg-[#1E5A7A]/10 text-[#1E5A7A] px-2 py-1 rounded-md text-[10px] font-bold">Team Task</span>
                                                ) : (
                                                    <span className="bg-purple-50 text-purple-600 px-2 py-1 rounded-md text-[10px] font-bold">Direct Task</span>
                                                )}
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* 🌟 بعتنا كل الخصائص (Props) اللي السايد بار محتاجها عشان الإيرور يختفي 🌟 */}
            {selectedTask && (
                <TaskDetailsSidebar
                    task={selectedTask}
                    isOpen={!!selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                    statuses={['To Do', 'In Progress', 'Done']}
                    allTasks={tasks}
                    refreshTasks={fetchMyTasks}
                />
            )}
        </div>
    );
}