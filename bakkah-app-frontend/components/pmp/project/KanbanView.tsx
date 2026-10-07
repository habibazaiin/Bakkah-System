// src/components/pmp/project/KanbanView.tsx
'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { getPriorityUI } from './TableView'; // هنستورد دوال الـ UI اللي عملناها في الجدول عشان نوحد الشكل

const COLUMNS = ['To Do', 'In Progress', 'Done'];

export default function KanbanView({ tasks, isLoading, onUpdate }: any) {
    
    if (isLoading) {
        return <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 text-[#1E5A7A] animate-spin" /></div>;
    }

    // --- دوال السحب والإفلات (Drag & Drop) ---
    const handleDragStart = (e: React.DragEvent, taskId: string) => {
        // بنحفظ الـ ID بتاع المهمة اللي بتنسحب
        e.dataTransfer.setData('taskId', taskId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // ضروري عشان نسمح بالإفلات
    };

    const handleDrop = (e: React.DragEvent, newStatus: string) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        
        if (taskId) {
            const task = tasks.find((t: any) => t.id === taskId);
            // لو اترمت في عمود مختلف، بنحدث الحالة في الداتابيز
            if (task && task.status !== newStatus) {
                onUpdate(taskId, 'status', newStatus);
            }
        }
    };

    return (
        <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar min-h-[500px] animate-fade-in-up">
            {COLUMNS.map(column => {
                // بنفلتر المهام حسب حالة العمود
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
                            {columnTasks.map((task: any) => (
                                <div 
                                    key={task.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, task.id)}
                                    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#1E5A7A]/30 transition-all cursor-grab active:cursor-grabbing group"
                                >
                                    <h4 className="font-bold text-sm text-[#1F2937] group-hover:text-[#1E5A7A] transition-colors mb-4 line-clamp-2 leading-relaxed">
                                        {task.title}
                                    </h4>
                                    
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                        {getPriorityUI(task.priority)}
                                        <span className="text-[11px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                                            {new Date(task.created_at).toLocaleDateString('en-GB')}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            
                            {/* لو العمود فاضي */}
                            {columnTasks.length === 0 && (
                                <div className="flex-1 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center p-6 text-gray-400 text-sm font-medium bg-white/50">
                                    Drop tasks here
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}