'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Calendar as CalendarIcon } from 'lucide-react';

export default function CalendarView({ tasks, isLoading, onTaskClick }: any) {
    const [currentDate, setCurrentDate] = useState(new Date());

    if (isLoading) {
        return <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 text-[#1E5A7A] animate-spin" /></div>;
    }

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // حسابات أيام الشهر
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday
    
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    const goToToday = () => setCurrentDate(new Date());

    // دالة لتصفية المهام اللي بتنتهي في يوم معين
    const getTasksForDay = (day: number) => {
        return tasks.filter((task: any) => {
            if (!task.due_date) return false;
            const dueDate = new Date(task.due_date);
            return dueDate.getDate() === day && dueDate.getMonth() === currentMonth && dueDate.getFullYear() === currentYear;
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Done': return 'bg-green-100 text-green-700 border-green-200';
            case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'To Do': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-purple-100 text-purple-700 border-purple-200';
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#F8FAFC]/50">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-100 text-[#1E5A7A]">
                        <CalendarIcon size={24} strokeWidth={2} />
                    </div>
                    <h2 className="text-2xl font-black text-[#1F2937]">
                        {monthNames[currentMonth]} <span className="text-gray-400 font-bold">{currentYear}</span>
                    </h2>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={goToToday} className="px-4 py-2 text-sm font-bold text-[#1E5A7A] bg-[#1E5A7A]/10 hover:bg-[#1E5A7A]/20 rounded-xl transition-colors">
                        Today
                    </button>
                    <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-xl p-1 shadow-sm">
                        <button onClick={prevMonth} className="p-2 text-gray-400 hover:text-[#1F2937] hover:bg-gray-50 rounded-lg transition-all">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={nextMonth} className="p-2 text-gray-400 hover:text-[#1F2937] hover:bg-gray-50 rounded-lg transition-all">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
                {dayNames.map(day => (
                    <div key={day} className="py-3 text-center text-xs font-extrabold text-gray-500 uppercase tracking-wider border-r border-gray-100 last:border-r-0">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 auto-rows-[minmax(120px,auto)] bg-gray-100 gap-[1px]">
                {/* الخانات الفارغة في بداية الشهر */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} className="bg-gray-50/50 p-2 opacity-50"></div>
                ))}

                {/* أيام الشهر */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const isToday = day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();
                    const dayTasks = getTasksForDay(day);

                    return (
                        <div key={day} className={`bg-white p-2 flex flex-col hover:bg-gray-50/30 transition-colors ${isToday ? 'ring-2 ring-inset ring-[#1E5A7A]/20 bg-[#1E5A7A]/5' : ''}`}>
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-[#1E5A7A] text-white shadow-md' : 'text-gray-500'}`}>
                                    {day}
                                </span>
                                {dayTasks.length > 0 && (
                                    <span className="text-[10px] font-bold text-gray-400">{dayTasks.length} tasks</span>
                                )}
                            </div>
                            
                            {/* عرض المهام (الـ Deadlines) */}
                            <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
                                {dayTasks.map((task: any) => (
                                    <div 
                                        key={task.id} 
                                        onClick={() => onTaskClick && onTaskClick(task)}
                                        className={`px-2 py-1.5 rounded-lg border text-xs font-bold truncate cursor-pointer hover:shadow-sm transition-all transform hover:-translate-y-px ${getStatusColor(task.status)}`}
                                        title={task.title}
                                    >
                                        {task.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
                
                {/* الخانات الفارغة في نهاية الشهر لتكملة الشبكة (اختياري) */}
                {Array.from({ length: (7 - ((firstDayOfMonth + daysInMonth) % 7)) % 7 }).map((_, i) => (
                    <div key={`empty-end-${i}`} className="bg-gray-50/50 p-2 opacity-50"></div>
                ))}
            </div>
        </div>
    );
}