'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, Circle, AlertCircle, ArrowUpCircle, Plus, ChevronRight, ChevronDown, CornerDownRight } from 'lucide-react';
import { Task } from '@/types/pmp.types';
import { PmpService } from '@/services/pmp.service';

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

const TaskRow = ({ task, isSubtask = false, hasSubtasks = false, isExpanded = false, onToggleExpand, onUpdate, onClick, statuses, members, teams }: any) => {
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isPriorityOpen, setIsPriorityOpen] = useState(false);

    const zIndex = isStatusOpen || isPriorityOpen ? 50 : 1;
    
    // 🌟 جلب العضو أو الفريق الحقيقي
    const assignee = members.find((m: any) => m.user_id === task.assignee_id);
    const team = teams.find((t: any) => t.id === task.team_id);

    // 🌟 دالة استخراج أول حرفين
    const getInitials = (name: string) => name?.substring(0, 2).toUpperCase() || 'UN';
    const getColor = (id: string) => {
        const colors = ['bg-purple-100 text-purple-700', 'bg-blue-100 text-blue-700', 'bg-green-100 text-green-700', 'bg-orange-100 text-orange-700', 'bg-pink-100 text-pink-700'];
        return colors[(id?.charCodeAt(0) || 0) % colors.length];
    };

    return (
        <div className={`grid grid-cols-12 gap-4 px-6 py-3.5 items-center hover:bg-gray-50 transition-colors group relative border-b border-gray-100 ${isSubtask ? 'bg-gray-50/50' : 'bg-white'}`} style={{ zIndex }}>
            <div className="col-span-5 md:col-span-4 flex items-center gap-2 pr-4">
                {!isSubtask && hasSubtasks && (
                    <button onClick={onToggleExpand} className="text-gray-400 hover:text-[#1E5A7A] transition-colors p-1 rounded-md hover:bg-[#1E5A7A]/10">
                        {isExpanded ? <ChevronDown size={16} strokeWidth={3} /> : <ChevronRight size={16} strokeWidth={3} />}
                    </button>
                )}
                {!isSubtask && !hasSubtasks && <div className="w-6" />}
                {isSubtask && <CornerDownRight size={16} className="text-gray-300 ml-6 mr-1" />}
                <span onClick={onClick} className={`font-bold text-sm truncate cursor-pointer transition-colors ${isSubtask ? 'text-gray-600 hover:text-[#1E5A7A]' : 'text-[#1F2937] hover:text-[#1E5A7A]'}`}>
                    {task.title}
                </span>
            </div>

            {/* 🌟 عرض أول حرفين للفريق أو العضو 🌟 */}
            <div className="col-span-2 md:col-span-2 flex items-center">
                {task.team_id && team ? (
                    <div className="w-7 h-7 rounded-md bg-[#1E5A7A]/10 text-[#1E5A7A] flex items-center justify-center text-[10px] font-black border border-white shadow-sm" title={team.name}>
                        {getInitials(team.name)}
                    </div>
                ) : task.assignee_id && assignee ? (
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border border-white shadow-sm ${getColor(assignee.user_id)}`} title={assignee.name}>
                        {getInitials(assignee.name)}
                    </div>
                ) : (
                    <div className="w-7 h-7 rounded-full border border-dashed border-gray-300 text-gray-400 flex items-center justify-center bg-gray-50 text-[10px] font-black" title="Unassigned">
                        --
                    </div>
                )}
            </div>

            <div className="col-span-3 md:col-span-2 relative">
                <div onClick={() => setIsStatusOpen(!isStatusOpen)} className="cursor-pointer w-fit hover:opacity-80 transition-opacity">{getStatusUI(task.status)}</div>
                {isStatusOpen && (
                    <>
                        <div className="fixed inset-0 z-30" onClick={() => setIsStatusOpen(false)} />
                        <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-1.5 animate-fade-in-up">
                            {statuses.map((s: string) => (
                                <div key={s} onClick={() => { onUpdate(task.id, 'status', s); setIsStatusOpen(false); }} className="px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center transition-colors">
                                    {getStatusUI(s)}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="col-span-2 md:col-span-2 relative">
                <div onClick={() => setIsPriorityOpen(!isPriorityOpen)} className="cursor-pointer w-fit hover:opacity-80 transition-opacity">{getPriorityUI(task.priority)}</div>
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

export default function TableView({ tasks, allTasks = [], isLoading, onUpdate, onCreate, isCreating, onTaskClick, statuses }: any) {
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
    
    // 🌟 جلب الداتا الحقيقية للجدول
    const [members, setMembers] = useState<any[]>([]);
    const [teams, setTeams] = useState<any[]>([]);

    useEffect(() => {
        const fetchAssignees = async () => {
            if (!tasks || tasks.length === 0) return;
            try {
                const projectId = tasks[0].project_id;
                const projects = await PmpService.getProjects();
                const project = projects.find(p => p.id === projectId);
                if (project) {
                    const [fetchedMembers, fetchedTeams] = await Promise.all([
                        PmpService.getWorkspaceUsers(project.space_id),
                        PmpService.getSpaceTeams(project.space_id)
                    ]);
                    setMembers(fetchedMembers || []);
                    setTeams(fetchedTeams || []);
                }
            } catch (error) {
                console.error("Error fetching assignees", error);
            }
        };
        fetchAssignees();
    }, [tasks.length]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        onCreate(newTaskTitle);
        setNewTaskTitle('');
    };

    const toggleRow = (taskId: string) => setExpandedRows(prev => ({ ...prev, [taskId]: !prev[taskId] }));

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 animate-fade-in-up pb-2 overflow-visible">
            <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 bg-[#F8FAFC]/80 text-xs font-extrabold text-gray-500 uppercase tracking-wider rounded-t-3xl">
                <div className="col-span-5 md:col-span-4">Task Name</div>
                <div className="col-span-2 md:col-span-2">Assignee</div>
                <div className="col-span-3 md:col-span-2">Status</div>
                <div className="col-span-2 md:col-span-2">Priority</div>
                <div className="hidden md:block col-span-2">Added On</div>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 text-[#1E5A7A] animate-spin" /></div>
            ) : (
                <div className="flex flex-col">
                    {tasks.map((task: Task) => {
                        const subtasks = allTasks.filter((t: Task) => t.parent_task_id === task.id);
                        return (
                            <React.Fragment key={task.id}>
                                <TaskRow task={task} hasSubtasks={subtasks.length > 0} isExpanded={expandedRows[task.id]} onToggleExpand={() => toggleRow(task.id)} onUpdate={onUpdate} onClick={() => onTaskClick(task)} statuses={statuses} members={members} teams={teams} />
                                {expandedRows[task.id] && subtasks.length > 0 && (
                                    <div className="bg-gray-50/30 animate-fade-in-up border-b border-gray-100">
                                        {subtasks.map((subtask: Task) => (
                                            <TaskRow key={subtask.id} task={subtask} isSubtask={true} onUpdate={onUpdate} onClick={() => onTaskClick(subtask)} statuses={statuses} members={members} teams={teams} />
                                        ))}
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}

                    <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors group mt-2 rounded-b-3xl">
                        <div className="col-span-12 md:col-span-4 flex items-center gap-3 ml-8">
                            {isCreating ? <Loader2 className="w-4 h-4 text-gray-400 animate-spin shrink-0" /> : <Plus className="w-4 h-4 text-gray-400 shrink-0" />}
                            <input type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="Add new main task... (Press Enter)" className="w-full bg-transparent border-none text-sm font-bold text-[#1F2937] focus:outline-none focus:ring-0 placeholder-gray-400" disabled={isCreating} />
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}