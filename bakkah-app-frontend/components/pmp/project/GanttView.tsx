// src/components/pmp/project/GanttView.tsx
'use client';

import React from 'react';
import { Loader2, Calendar } from 'lucide-react';

export default function GanttView({ tasks, isLoading }: any) {
    if (isLoading) {
        return <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 text-[#1E5A7A] animate-spin" /></div>;
    }

    if (tasks.length === 0) {
        return (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center min-h-[400px] animate-fade-in-up">
                <Calendar className="w-16 h-16 text-gray-200 mb-4" strokeWidth={1.5} />
                <h3 className="text-xl font-bold text-[#1F2937]">Timeline is empty</h3>
                <p className="text-gray-500 font-medium mt-2">Add tasks to see them on the Gantt chart.</p>
            </div>
        );
    }

    // إنشاء مصفوفة تواريخ لـ 14 يوم (منذ 3 أيام لـ 11 يوم قدام) عشان نرسم الجدول
    const today = new Date();
    const timelineDays = Array.from({ length: 14 }).map((_, i) => {
        const d = new Date();
        d.setDate(today.getDate() - 3 + i);
        return d;
    });

    // دالة لتحديد لون البار بناءً على حالة المهمة
    const getBarColor = (status: string) => {
        switch (status) {
            case 'Done': return 'bg-gradient-to-r from-green-400 to-green-500';
            case 'In Progress': return 'bg-gradient-to-r from-blue-400 to-blue-500';
            default: return 'bg-gradient-to-r from-[#1E5A7A] to-[#2A6B8F]'; // To Do
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up flex flex-col">
            {/* Header / Dates */}
            <div className="flex border-b border-gray-100 bg-[#F8FAFC]/80">
                {/* Task Name Column Header */}
                <div className="w-64 shrink-0 px-6 py-4 border-r border-gray-100 font-extrabold text-xs text-gray-500 uppercase tracking-wider flex items-center">
                    Task Name
                </div>
                {/* Days Headers */}
                <div className="flex-1 flex overflow-hidden">
                    {timelineDays.map((day, i) => {
                        const isToday = day.toDateString() === today.toDateString();
                        return (
                            <div key={i} className={`flex-1 min-w-[60px] py-3 flex flex-col items-center justify-center border-r border-gray-100 last:border-r-0 ${isToday ? 'bg-[#1E5A7A]/5' : ''}`}>
                                <span className={`text-[10px] font-bold uppercase ${isToday ? 'text-[#1E5A7A]' : 'text-gray-400'}`}>
                                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                                </span>
                                <span className={`text-sm font-black mt-1 ${isToday ? 'text-[#1E5A7A] bg-[#1E5A7A]/10 w-7 h-7 rounded-full flex items-center justify-center' : 'text-[#1F2937]'}`}>
                                    {day.getDate()}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Gantt Rows */}
            <div className="flex-1 overflow-y-auto">
                {tasks.map((task: any, index: number) => {
                    // حسابات وهمية لرسم البار (لأننا لسه معندناش start_date حقيقي من اليوزر)
                    // بنفترض إن المهمة بتبدأ يوم إنشائها ومدتها 3 أيام
                    const taskDate = new Date(task.created_at);
                    const startDiff = Math.floor((taskDate.getTime() - timelineDays[0].getTime()) / (1000 * 60 * 60 * 24));
                    
                    // تأمين القيم عشان البار مخرجش بره الشاشة
                    const safeStart = Math.max(0, Math.min(startDiff, 13));
                    const widthSpan = 3; // مدة المهمة 3 أيام

                    return (
                        <div key={task.id} className="flex border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                            {/* Task Name */}
                            <div className="w-64 shrink-0 px-6 py-4 border-r border-gray-100 font-bold text-sm text-[#1F2937] truncate group-hover:text-[#1E5A7A] transition-colors">
                                {task.title}
                            </div>
                            
                            {/* Timeline Grid */}
                            <div className="flex-1 relative flex">
                                {/* Grid Lines */}
                                {timelineDays.map((_, i) => (
                                    <div key={i} className="flex-1 min-w-[60px] border-r border-gray-50 last:border-r-0"></div>
                                ))}
                                
                                {/* The Gantt Bar */}
                                <div 
                                    className="absolute top-1/2 -translate-y-1/2 h-8 rounded-lg shadow-sm flex items-center px-3 cursor-pointer transform transition-transform hover:scale-[1.02] hover:shadow-md z-10"
                                    style={{
                                        left: `${(safeStart / 14) * 100}%`,
                                        width: `${(widthSpan / 14) * 100}%`,
                                    }}
                                >
                                    <div className={`absolute inset-0 rounded-lg opacity-90 ${getBarColor(task.status)}`}></div>
                                    <span className="relative text-xs font-bold text-white truncate drop-shadow-md">
                                        {task.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}