'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { List, LayoutTemplate, CalendarDays, LineChart, Sparkles } from 'lucide-react';
import { PmpService } from '@/services/pmp.service';

import TableView, { getStatusUI } from '@/components/pmp/project/TableView';
import KanbanView from '@/components/pmp/project/KanbanView';
import MetricsView from '@/components/pmp/project/MetricsView';
import GanttView from '@/components/pmp/project/GanttView';
import TaskDetailsSidebar from '@/components/pmp/project/TaskDetailsSidebar';

type ViewType = 'table' | 'kanban' | 'gantt' | 'metrics' | 'ai';

export default function ProjectPage() {
    const params = useParams();
    const projectId = params.projectId as string;

    const [activeView, setActiveView] = useState<ViewType>('table');
    const [tasks, setTasks] = useState<any[]>([]);
    const [project, setProject] = useState<any>(null); // State لبيانات المشروع الحقيقية
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isCreatingTask, setIsCreatingTask] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any>(null);

    // حساب الـ Progress الحقيقي بناءً على المهام المنجزة
    const projectProgress = tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'Done').length / tasks.length) * 100) : 0;

    const fetchData = async () => {
        setIsLoadingData(true);
        try {
            // جلب المهام
            const fetchedTasks = await PmpService.getTasks(projectId);
            setTasks(fetchedTasks);

            // جلب تفاصيل المشروع عشان اسمه
            const allProjects = await PmpService.getProjects();
            const currentProj = allProjects.find((p: any) => p.id === projectId);
            if (currentProj) setProject(currentProj);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoadingData(false);
        }
    };

    useEffect(() => {
        if (projectId) fetchData();
    }, [projectId]);

    const handleCreateTask = async (title: string) => {
        setIsCreatingTask(true);
        try {
            await PmpService.createTask({ title, project_id: projectId, status: 'To Do', priority: 'Medium' });
            fetchData();
        } catch (error) {
            console.error("Error creating task:", error);
        } finally {
            setIsCreatingTask(false);
        }
    };

    const handleUpdateTask = async (taskId: string, field: string, value: string) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, [field]: value } : t));
        if (selectedTask?.id === taskId) {
            setSelectedTask((prev: any) => ({ ...prev, [field]: value }));
        }
        try {
            await PmpService.updateTask(taskId, { [field]: value });
        } catch (error) {
            fetchData();
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
        setSelectedTask(null);
        try {
            await PmpService.deleteTask(taskId);
        } catch (error) {
            fetchData();
        }
    };

    const handleAddStatus = async (newStatus: string) => {
        if (!project || !newStatus.trim()) return;

        // جلب الحالات الحالية (أو الأساسية لو مفيش)
        const currentStatuses = project.statuses || ['To Do', 'In Progress', 'Done'];
        if (currentStatuses.includes(newStatus.trim())) return; // منع التكرار

        const updatedStatuses = [...currentStatuses, newStatus.trim()];

        // تحديث الشاشة فوراً (Optimistic UI)
        setProject({ ...project, statuses: updatedStatuses });

        try {
            await PmpService.updateProject(projectId, { statuses: updatedStatuses });
        } catch (error) {
            console.error("Error adding status:", error);
            setProject({ ...project, statuses: currentStatuses }); // نرجعها لو حصل إيرور
        }
    };

    const renderActiveView = () => {
        switch (activeView) {
            case 'table':
                return <TableView
                    tasks={tasks}
                    isLoading={isLoadingData}
                    onUpdate={handleUpdateTask}
                    onCreate={handleCreateTask}
                    isCreating={isCreatingTask}
                    onTaskClick={setSelectedTask}
                    statuses={project?.statuses || ['To Do', 'In Progress', 'Done']} // 👈 السطر ده
                />;
            case 'kanban':
                return <KanbanView
                    tasks={tasks}
                    isLoading={isLoadingData}
                    onUpdate={handleUpdateTask}
                    onTaskClick={setSelectedTask}
                    statuses={project?.statuses || ['To Do', 'In Progress', 'Done']}
                    onAddStatus={handleAddStatus}
                />;
            case 'metrics': return <MetricsView tasks={tasks} isLoading={isLoadingData} />;
            case 'gantt': return <GanttView tasks={tasks} isLoading={isLoadingData} onTaskClick={setSelectedTask} onUpdate={handleUpdateTask} />;
            case 'ai':
                return (
                    <div className="bg-gradient-to-br from-[#1E5A7A]/5 to-[#B03052]/5 rounded-3xl shadow-sm border border-[#1E5A7A]/10 p-8 flex flex-col items-center justify-center min-h-[400px] animate-fade-in-up">
                        <Sparkles className="w-16 h-16 text-[#B03052]/40 mb-4" strokeWidth={1.5} />
                        <h3 className="text-xl font-bold text-[#1E5A7A]">AI Project Health & WBS</h3>
                        <div className="mt-4 px-4 py-1.5 bg-gradient-to-r from-[#1E5A7A] to-[#2A6B8F] text-white text-xs font-bold rounded-full uppercase tracking-widest shadow-sm">
                            Coming Soon
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in-up">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            {/* الاسم بقى بييجي من الداتابيز حقيقي! */}
                            <h1 className="text-3xl font-black text-[#1F2937] tracking-tight">{project ? project.name : 'Loading...'}</h1>
                            {getStatusUI('In Progress')}
                        </div>
                        <p className="text-gray-500 font-medium text-sm max-w-2xl leading-relaxed mb-6">
                            Manage your tasks, track progress, and collaborate seamlessly.
                        </p>
                    </div>

                    <div className="w-full md:w-64 bg-gray-50 p-5 rounded-2xl border border-gray-100 shrink-0">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-gray-700">Progress</span>
                            <span className="text-sm font-black text-[#1E5A7A]">{projectProgress}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#1E5A7A] to-[#2A6B8F] rounded-full transition-all duration-1000" style={{ width: `${projectProgress}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 border-b border-gray-200 pb-px overflow-x-auto hide-scrollbar">
                <button onClick={() => setActiveView('table')} className={`flex items-center gap-2 px-5 py-3.5 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${activeView === 'table' ? 'border-[#1E5A7A] text-[#1E5A7A]' : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-t-xl'}`}><List size={18} strokeWidth={2.5} /> Table</button>
                <button onClick={() => setActiveView('kanban')} className={`flex items-center gap-2 px-5 py-3.5 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${activeView === 'kanban' ? 'border-[#1E5A7A] text-[#1E5A7A]' : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-t-xl'}`}><LayoutTemplate size={18} strokeWidth={2.5} /> Kanban</button>
                <button onClick={() => setActiveView('gantt')} className={`flex items-center gap-2 px-5 py-3.5 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${activeView === 'gantt' ? 'border-[#1E5A7A] text-[#1E5A7A]' : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-t-xl'}`}><CalendarDays size={18} strokeWidth={2.5} /> Gantt</button>
                <button onClick={() => setActiveView('metrics')} className={`flex items-center gap-2 px-5 py-3.5 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${activeView === 'metrics' ? 'border-[#1E5A7A] text-[#1E5A7A]' : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-t-xl'}`}><LineChart size={18} strokeWidth={2.5} /> Metrics</button>
                <button onClick={() => setActiveView('ai')} className={`flex items-center gap-2 px-5 py-3.5 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${activeView === 'ai' ? 'border-[#B03052] text-[#B03052]' : 'border-transparent text-gray-500 hover:text-[#B03052] hover:bg-red-50 rounded-t-xl'}`}><Sparkles size={18} strokeWidth={2.5} /> AI Health</button>
            </div>

            <div>{renderActiveView()}</div>

            <TaskDetailsSidebar
                task={selectedTask}
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
                statuses={project?.statuses || ['To Do', 'In Progress', 'Done']}
            />
        </div>
    );
}