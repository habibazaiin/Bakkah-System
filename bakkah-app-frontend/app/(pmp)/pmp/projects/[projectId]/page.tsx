'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { List, LayoutTemplate, CalendarDays, LineChart, Sparkles } from 'lucide-react';
import { PmpService } from '@/services/pmp.service';
import KanbanView from '@/components/pmp/project/KanbanView';
import MetricsView from '@/components/pmp/project/MetricsView';
import GanttView from '@/components/pmp/project/GanttView';


// استيراد المكونات المفصولة
import TableView, { getStatusUI } from '@/components/pmp/project/TableView';

type ViewType = 'table' | 'kanban' | 'gantt' | 'metrics' | 'ai';

export default function ProjectPage() {
    const params = useParams();
    const projectId = params.projectId as string;

    const [activeView, setActiveView] = useState<ViewType>('table');
    const [tasks, setTasks] = useState<any[]>([]);
    const [isLoadingTasks, setIsLoadingTasks] = useState(true);
    const [isCreatingTask, setIsCreatingTask] = useState(false);

    const dummyProject = {
        name: "Project Workspace",
        description: "Manage your tasks, track progress, and collaborate seamlessly.",
        progress: tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'Done').length / tasks.length) * 100) : 0,
        budget: "$10,000",
        status: "Active",
        dueDate: "Nov 30, 2026"
    };

    const fetchTasks = async () => {
        setIsLoadingTasks(true);
        try {
            const fetchedTasks = await PmpService.getTasks(projectId);
            setTasks(fetchedTasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setIsLoadingTasks(false);
        }
    };

    useEffect(() => {
        if (projectId) fetchTasks();
    }, [projectId]);

    const handleCreateTask = async (title: string) => {
        setIsCreatingTask(true);
        try {
            await PmpService.createTask({ title, project_id: projectId, status: 'To Do', priority: 'Medium' });
            fetchTasks();
        } catch (error) {
            console.error("Error creating task:", error);
        } finally {
            setIsCreatingTask(false);
        }
    };

    const handleUpdateTask = async (taskId: string, field: string, value: string) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, [field]: value } : t));
        try {
            await PmpService.updateTask(taskId, { [field]: value });
        } catch (error) {
            fetchTasks();
        }
    };

    const renderActiveView = () => {
        switch (activeView) {
            case 'table':
                return <TableView tasks={tasks} isLoading={isLoadingTasks} onUpdate={handleUpdateTask} onCreate={handleCreateTask} isCreating={isCreatingTask} />;
            case 'kanban':
                return <KanbanView tasks={tasks} isLoading={isLoadingTasks} onUpdate={handleUpdateTask} />;
            // وباقي الـ views زي ما هي (Gantt, Metrics, AI)
            case 'metrics':
                return <MetricsView tasks={tasks} isLoading={isLoadingTasks} />;
            case 'gantt':
                return <GanttView tasks={tasks} isLoading={isLoadingTasks} />;
            default: return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Project Header Widget */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in-up">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-black text-[#1F2937] tracking-tight">{dummyProject.name}</h1>
                            {getStatusUI(dummyProject.status === 'Active' ? 'In Progress' : 'To Do')}
                        </div>
                        <p className="text-gray-500 font-medium text-sm max-w-2xl leading-relaxed mb-6">
                            {dummyProject.description}
                        </p>
                    </div>

                    <div className="w-full md:w-64 bg-gray-50 p-5 rounded-2xl border border-gray-100 shrink-0">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-gray-700">Progress</span>
                            <span className="text-sm font-black text-[#1E5A7A]">{dummyProject.progress}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#1E5A7A] to-[#2A6B8F] rounded-full transition-all duration-1000" style={{ width: `${dummyProject.progress}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Views Bar (Tabs) */}
            {/* Views Bar (Tabs) */}
            <div className="flex items-center gap-2 border-b border-gray-200 pb-px overflow-x-auto hide-scrollbar">
                <button onClick={() => setActiveView('table')} className={`flex items-center gap-2 px-5 py-3.5 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${activeView === 'table' ? 'border-[#1E5A7A] text-[#1E5A7A]' : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-t-xl'}`}><List size={18} strokeWidth={2.5} /> Table</button>
                <button onClick={() => setActiveView('kanban')} className={`flex items-center gap-2 px-5 py-3.5 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${activeView === 'kanban' ? 'border-[#1E5A7A] text-[#1E5A7A]' : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-t-xl'}`}><LayoutTemplate size={18} strokeWidth={2.5} /> Kanban</button>
                <button onClick={() => setActiveView('gantt')} className={`flex items-center gap-2 px-5 py-3.5 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${activeView === 'gantt' ? 'border-[#1E5A7A] text-[#1E5A7A]' : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-t-xl'}`}><CalendarDays size={18} strokeWidth={2.5} /> Gantt</button>
                <button onClick={() => setActiveView('metrics')} className={`flex items-center gap-2 px-5 py-3.5 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${activeView === 'metrics' ? 'border-[#1E5A7A] text-[#1E5A7A]' : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-t-xl'}`}><LineChart size={18} strokeWidth={2.5} /> Metrics</button>
                <button onClick={() => setActiveView('ai')} className={`flex items-center gap-2 px-5 py-3.5 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${activeView === 'ai' ? 'border-[#B03052] text-[#B03052]' : 'border-transparent text-gray-500 hover:text-[#B03052] hover:bg-red-50 rounded-t-xl'}`}><Sparkles size={18} strokeWidth={2.5} /> AI Health</button>
            </div>

            {/* Dynamic Content Area */}
            <div>
                {renderActiveView()}
            </div>
        </div>
    );
}