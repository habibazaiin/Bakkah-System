'use client';

import React, { useState } from 'react';
import { Link, ChevronDown, Flag, Calendar, AlertTriangle } from 'lucide-react';
import { getStatusUI, getPriorityUI } from './TableView';
import AssigneeSelect from './AssigneeSelect';
import { Task } from '@/types/pmp.types';

interface Props {
    task: Task;
    allTasks: Task[];
    statuses: string[];
    onUpdate: (taskId: string, field: string, value: any) => Promise<void>;
}

export default function TaskProperties({ task, allTasks, statuses, onUpdate }: Props) {
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isPriorityOpen, setIsPriorityOpen] = useState(false);
    const [isDependencyOpen, setIsDependencyOpen] = useState(false);

    return (
        <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-4">
            {/* Status Dropdown */}
            <div className="grid grid-cols-3 items-center gap-4 relative z-40">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</span>
                <div className="col-span-2 relative">
                    <div onClick={() => setIsStatusOpen(!isStatusOpen)} className="cursor-pointer w-fit hover:opacity-80 transition-opacity">
                        {getStatusUI(task.status)}
                    </div>
                    {isStatusOpen && (
                        <>
                            <div className="fixed inset-0 z-30" onClick={() => setIsStatusOpen(false)} />
                            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-2 animate-fade-in-up">
                                {statuses.map(s => (
                                    <div
                                        key={s}
                                        onClick={() => { onUpdate(task.id, 'status', s); setIsStatusOpen(false); }}
                                        className="px-4 py-2 cursor-pointer hover:bg-gray-50 flex items-center transition-colors"
                                    >
                                        {getStatusUI(s)}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Priority Dropdown */}
            <div className="grid grid-cols-3 items-center gap-4 relative z-30">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Priority</span>
                <div className="col-span-2 relative">
                    <div onClick={() => setIsPriorityOpen(!isPriorityOpen)} className="cursor-pointer w-fit hover:opacity-80 transition-opacity">
                        {getPriorityUI(task.priority)}
                    </div>
                    {isPriorityOpen && (
                        <>
                            <div className="fixed inset-0 z-30" onClick={() => setIsPriorityOpen(false)} />
                            <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-2 animate-fade-in-up">
                                {['Low', 'Medium', 'High'].map(p => (
                                    <div
                                        key={p}
                                        onClick={() => { onUpdate(task.id, 'priority', p); setIsPriorityOpen(false); }}
                                        className="px-4 py-2 cursor-pointer hover:bg-gray-50 flex items-center transition-colors"
                                    >
                                        {getPriorityUI(p)}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Dependency (Blocked By) */}
            <div className="mb-6 relative">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Link size={14} /> Depends On (Blocked By)
                </label>
                <div
                    onClick={() => setIsDependencyOpen(!isDependencyOpen)}
                    className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-[#1F2937] hover:bg-white hover:border-[#1E5A7A] cursor-pointer transition-all shadow-sm"
                >
                    <span className="truncate">
                        {task.depends_on_task_id
                            ? allTasks.find(t => t.id === task.depends_on_task_id)?.title || 'Unknown Task'
                            : 'None (Can start anytime)'}
                    </span>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${isDependencyOpen ? 'rotate-180' : ''}`} />
                </div>
                {isDependencyOpen && (
                    <>
                        <div className="fixed inset-0 z-30" onClick={() => setIsDependencyOpen(false)} />
                        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-2 max-h-60 overflow-y-auto animate-fade-in-up">
                            <div
                                onClick={() => { onUpdate(task.id, 'depends_on_task_id', null); setIsDependencyOpen(false); }}
                                className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-bold border-b border-gray-50 ${!task.depends_on_task_id ? 'text-[#1E5A7A] bg-blue-50/50' : 'text-gray-500'}`}
                            >
                                None (Can start anytime)
                            </div>
                            {allTasks.filter(t => t.id !== task.id && t.depends_on_task_id !== task.id).map(t => (
                                <div
                                    key={t.id}
                                    onClick={() => { onUpdate(task.id, 'depends_on_task_id', t.id); setIsDependencyOpen(false); }}
                                    className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between text-sm font-bold ${task.depends_on_task_id === t.id ? 'text-[#1E5A7A] bg-blue-50/50' : 'text-gray-700'}`}
                                >
                                    <span className="truncate pr-3">{t.title}</span>
                                    <span className={`text-[10px] px-2 py-1 rounded-md border whitespace-nowrap uppercase tracking-wider ${t.status === 'Done' ? 'bg-green-50 text-green-600 border-green-200' : t.status === 'In Progress' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                                        {t.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                {task.depends_on_task_id && (
                    <div className="mt-2.5 p-3 bg-orange-50 border border-orange-100 rounded-xl flex items-start gap-2 animate-fade-in-up">
                        <AlertTriangle size={16} className="text-orange-500 shrink-0 mt-0.5" />
                        <p className="text-xs font-bold text-orange-700 leading-relaxed">
                            This task is blocked. It cannot be started or moved in the timeline before its dependency is completed.
                        </p>
                    </div>
                )}
            </div>

            {/* Milestone Toggle */}
            <div className="mb-6 flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${task.is_milestone ? 'bg-[#1E5A7A] text-white shadow-md' : 'bg-white text-gray-400 border border-gray-200'}`}>
                        <Flag size={20} className={task.is_milestone ? "fill-current" : ""} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-[#1F2937]">Mark as Milestone</h4>
                        <p className="text-[11px] font-medium text-gray-500 mt-0.5">Zero-duration task for major events</p>
                    </div>
                </div>
                <button
                    onClick={() => onUpdate(task.id, 'is_milestone', !task.is_milestone)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${task.is_milestone ? 'bg-[#1E5A7A]' : 'bg-gray-300'}`}
                >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${task.is_milestone ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
            </div>

            {/* Assignee */}
            <div className="grid grid-cols-3 items-center gap-4 pt-2 border-t border-gray-100 relative z-20">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Assignee</span>
                <div className="col-span-2">
                    <AssigneeSelect taskId={task.id} projectId={task.project_id} currentAssigneeId={task.assignee_id} currentTeamId={task.team_id} onUpdate={onUpdate} />
                </div>
            </div>

            {/* Dates Section */}
            <div className="mb-6 space-y-4">
                {task.is_milestone ? (
                    <div className="flex items-center justify-between p-3 bg-[#B03052]/5 border border-[#B03052]/20 rounded-xl">
                        <label className="flex items-center gap-2 text-xs font-bold text-[#B03052] uppercase tracking-wider">
                            <Calendar size={16} /> Milestone Date
                        </label>
                        <input
                            type="date"
                            value={task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : ''}
                            onChange={(e) => {
                                onUpdate(task.id, 'due_date', e.target.value);
                                onUpdate(task.id, 'start_date', e.target.value);
                            }}
                            className="w-36 px-3 py-1.5 bg-white border border-[#B03052]/20 rounded-lg text-sm font-bold text-[#1F2937] focus:outline-none focus:border-[#B03052] focus:ring-1 focus:ring-[#B03052] transition-all"
                        />
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <Calendar size={16} /> Start
                            </label>
                            <input
                                type="date"
                                value={task.start_date ? new Date(task.start_date).toISOString().split('T')[0] : ''}
                                onChange={(e) => onUpdate(task.id, 'start_date', e.target.value)}
                                className="w-36 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-[#1F2937] focus:bg-white focus:outline-none focus:border-[#1E5A7A]"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <Calendar size={16} /> Due
                            </label>
                            <input
                                type="date"
                                value={task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : ''}
                                onChange={(e) => onUpdate(task.id, 'due_date', e.target.value)}
                                className="w-36 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-[#1F2937] focus:bg-white focus:outline-none focus:border-[#1E5A7A]"
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}