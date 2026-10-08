// src/components/pmp/project/KanbanView.tsx
'use client';

import React, { useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { getPriorityUI } from './TableView';
import { TEAM_MEMBERS } from './AssigneeSelect';

export default function KanbanView({ tasks, isLoading, onUpdate, onTaskClick, statuses, onAddStatus }: any) {
    const [isAddingColumn, setIsAddingColumn] = useState(false);
    const [newColumnName, setNewColumnName] = useState('');

    if (isLoading) {
        return <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 text-[#1E5A7A] animate-spin" /></div>;
    }

    // --- دوال السحب والإفلات ---
    const handleDragStart = (e: React.DragEvent, taskId: string) => {
        e.dataTransfer.setData('taskId', taskId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, newStatus: string) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        
        if (taskId) {
            const task = tasks.find((t: any) => t.id === taskId);
            if (task && task.status !== newStatus) {
                onUpdate(taskId, 'status', newStatus);
            }
        }
    };

    // حفظ العمود الجديد
    const handleSaveNewColumn = () => {
        if (newColumnName.trim()) {
            onAddStatus(newColumnName.trim());
            setNewColumnName('');
            setIsAddingColumn(false);
        }
    };

    return (
        <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar min-h-[500px] animate-fade-in-up items-start">
            {statuses.map((column: string) => {
                const columnTasks = tasks.filter((t: any) => t.status === column);

                return (
                    <div 
                        key={column} 
                        className="flex-1 min-w-[320px] bg-gray-50/80 rounded-3xl p-5 border border-gray-100 flex flex-col transition-colors hover:bg-gray-50"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, column)}
                    >
                        {/* هيدر العمود */}
                        <div className="flex items-center justify-between mb-5 px-1">
                            <h3 className="font-black text-[#1F2937] text-sm uppercase tracking-wider">{column}</h3>
                            <span className="bg-white text-gray-500 text-xs font-bold px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                                {columnTasks.length}
                            </span>
                        </div>

                        {/* الكروت (المهام) */}
                        <div className="flex flex-col gap-3 flex-1">
                            {columnTasks.map((task: any) => {
                                const assignee = TEAM_MEMBERS.find(m => m.id === task.assignee_id);
                                return (
                                    <div 
                                        key={task.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, task.id)}
                                        onClick={() => onTaskClick && onTaskClick(task)}
                                        className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#1E5A7A]/30 transition-all cursor-grab active:cursor-grabbing group"
                                    >
                                        <h4 className="font-bold text-sm text-[#1F2937] group-hover:text-[#1E5A7A] transition-colors mb-4 line-clamp-2 leading-relaxed">
                                            {task.title}
                                        </h4>
                                        <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-4">
                                            <div className="flex items-center gap-2">
                                                {getPriorityUI(task.priority)}
                                                {assignee && (
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border border-white shadow-sm ${assignee.color}`} title={assignee.name}>
                                                        {assignee.initials}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-[11px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                                                {new Date(task.created_at).toLocaleDateString('en-GB')}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                            
                            {columnTasks.length === 0 && (
                                <div className="flex-1 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center p-6 text-gray-400 text-sm font-medium bg-white/50">
                                    Drop tasks here
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}

            {/* زرار إضافة عمود جديد (Custom Status) */}
            {isAddingColumn ? (
                <div className="min-w-[320px] bg-white rounded-3xl p-5 border-2 border-[#1E5A7A]/30 shadow-sm flex flex-col justify-center animate-fade-in-up">
                    <input
                        autoFocus
                        value={newColumnName}
                        onChange={(e) => setNewColumnName(e.target.value)}
                        onKeyDown={(e) => { if(e.key === 'Enter') handleSaveNewColumn() }}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#1F2937] focus:outline-none focus:border-[#1E5A7A] focus:ring-2 focus:ring-[#1E5A7A]/10 mb-3"
                        placeholder="Status name (e.g. Testing)"
                    />
                    <div className="flex gap-2">
                        <button onClick={handleSaveNewColumn} className="flex-1 bg-[#1E5A7A] hover:bg-[#154560] text-white text-xs font-bold py-2.5 rounded-xl transition-colors shadow-sm">Save</button>
                        <button onClick={() => setIsAddingColumn(false)} className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 text-xs font-bold py-2.5 rounded-xl transition-colors">Cancel</button>
                    </div>
                </div>
            ) : (
                <div onClick={() => setIsAddingColumn(true)} className="min-w-[320px] bg-gray-50/50 hover:bg-gray-50 rounded-3xl p-5 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer transition-all hover:border-[#1E5A7A]/30 group min-h-[150px]">
                    <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-[#1E5A7A] group-hover:bg-[#1E5A7A]/5 transition-all mb-2 shadow-sm">
                        <Plus size={20} strokeWidth={2.5} />
                    </div>
                    <span className="text-sm font-bold text-gray-500 group-hover:text-[#1E5A7A] transition-colors">Add Section</span>
                </div>
            )}
        </div>
    );
}