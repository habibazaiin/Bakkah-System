// src/components/pmp/project/GanttView.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Loader2, Calendar } from 'lucide-react';

export default function GanttView({ tasks, isLoading, onTaskClick, onUpdate }: any) {
    const timelineRef = useRef<HTMLDivElement>(null);
    const [dragState, setDragState] = useState<{ type: 'move' | 'left' | 'right', taskId: string, startX: number, originalStart: Date, originalDue: Date } | null>(null);
    const [tempDates, setTempDates] = useState<Record<string, { start: Date, due: Date }>>({});

    useEffect(() => {
        if (!dragState) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!timelineRef.current) return;
            // حساب عرض اليوم الواحد بالبيكسل (14 يوم)
            const dayWidth = timelineRef.current.offsetWidth / 14;
            const deltaDays = Math.round((e.clientX - dragState.startX) / dayWidth);

            let newStart = new Date(dragState.originalStart);
            let newDue = new Date(dragState.originalDue);

            if (dragState.type === 'move') {
                newStart.setDate(newStart.getDate() + deltaDays);
                newDue.setDate(newDue.getDate() + deltaDays);
            } else if (dragState.type === 'left') {
                newStart.setDate(newStart.getDate() + deltaDays);
                if (newStart > newDue) newStart = new Date(newDue); // نمنع البداية تعدي النهاية
            } else if (dragState.type === 'right') {
                newDue.setDate(newDue.getDate() + deltaDays);
                if (newDue < newStart) newDue = new Date(newStart); // نمنع النهاية ترجع قبل البداية
            }

            setTempDates({ [dragState.taskId]: { start: newStart, due: newDue } });
        };

        const handleMouseUp = () => {
            if (tempDates[dragState.taskId] && onUpdate) {
                const { start, due } = tempDates[dragState.taskId];

                // دالة لضبط التاريخ بدون مشاكل فروق التوقيت
                const formatDate = (d: Date) => {
                    const offset = d.getTimezoneOffset() * 60000;
                    return new Date(d.getTime() - offset).toISOString().split('T')[0];
                };

                const startStr = formatDate(start);
                const dueStr = formatDate(due);
                const origStartStr = formatDate(dragState.originalStart);
                const origDueStr = formatDate(dragState.originalDue);

                // إرسال التحديثات للباك إند لو التاريخ اتغير بجد
                if (startStr !== origStartStr) onUpdate(dragState.taskId, 'start_date', startStr);
                if (dueStr !== origDueStr) {
                    setTimeout(() => onUpdate(dragState.taskId, 'due_date', dueStr), 50);
                }
            }
            setDragState(null);
            setTempDates({});
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragState, tempDates, onUpdate]);

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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const timelineDays = Array.from({ length: 14 }).map((_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - 3 + i);
        return d;
    });

    const timelineStartDate = timelineDays[0];

    const getBarColor = (status: string) => {
        switch (status) {
            case 'Done': return 'bg-gradient-to-r from-green-400 to-green-500';
            case 'In Progress': return 'bg-gradient-to-r from-blue-400 to-blue-500';
            case 'To Do': return 'bg-gradient-to-r from-gray-500 to-gray-600';
            default: return 'bg-gradient-to-r from-purple-400 to-purple-500'; // للألوان المخصصة (Custom Status)
        }
    };

    const handleMouseDown = (e: React.MouseEvent, type: 'move' | 'left' | 'right', task: any) => {
        e.stopPropagation();
        const start = task.start_date ? new Date(task.start_date) : new Date(task.created_at);
        start.setHours(0, 0, 0, 0);
        let due = task.due_date ? new Date(task.due_date) : new Date(start);
        due.setHours(0, 0, 0, 0);
        if (due < start) due = new Date(start);

        setDragState({ type, taskId: task.id, startX: e.clientX, originalStart: start, originalDue: due });
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up flex flex-col select-none">
            <div className="flex border-b border-gray-100 bg-[#F8FAFC]/80">
                <div className="w-64 shrink-0 px-6 py-4 border-r border-gray-100 font-extrabold text-xs text-gray-500 uppercase tracking-wider flex items-center">
                    Task Name
                </div>
                <div className="flex-1 flex overflow-hidden">
                    {timelineDays.map((day, i) => {
                        const isToday = day.getTime() === today.getTime();
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

            <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
                {tasks.map((task: any) => {
                    const activeDates = tempDates[task.id] || {
                        start: task.start_date ? new Date(task.start_date) : new Date(task.created_at),
                        due: task.due_date ? new Date(task.due_date) : (task.start_date ? new Date(task.start_date) : new Date(task.created_at))
                    };

                    activeDates.start.setHours(0, 0, 0, 0);
                    activeDates.due.setHours(0, 0, 0, 0);
                    if (activeDates.due < activeDates.start) activeDates.due = new Date(activeDates.start);

                    const startOffsetDays = Math.round((activeDates.start.getTime() - timelineStartDate.getTime()) / 86400000);
                    const durationDays = Math.round((activeDates.due.getTime() - activeDates.start.getTime()) / 86400000) + 1;

                    let leftPercent = (startOffsetDays / 14) * 100;
                    let widthPercent = (durationDays / 14) * 100;

                    // إخفاء المهمة لو كانت بره الشاشة تماماً
                    if (leftPercent > 100 || leftPercent + widthPercent < 0) return null;

                    return (
                        <div key={task.id} className="flex border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                            <div
                                onClick={() => onTaskClick && onTaskClick(task)}
                                className="w-64 shrink-0 px-6 py-4 border-r border-gray-100 font-bold text-sm text-[#1F2937] truncate group-hover:text-[#1E5A7A] transition-colors cursor-pointer"
                            >
                                {task.title}
                            </div>

                            <div className="flex-1 relative flex" ref={timelineRef}>
                                {timelineDays.map((_, i) => (
                                    <div key={i} className="flex-1 min-w-[60px] border-r border-gray-50 last:border-r-0 pointer-events-none"></div>
                                ))}

                                <div
                                    className={`absolute top-1/2 -translate-y-1/2 h-8 rounded-lg shadow-sm flex items-center z-10 ${dragState?.taskId === task.id ? 'z-50 shadow-lg' : ''}`}
                                    style={{ left: `${leftPercent}%`, width: `${widthPercent}%`, minWidth: '20px' }}
                                >
                                    {/* الجزء اللي بيتشد منه المهمة بالكامل (Move) */}
                                    <div
                                        className={`absolute inset-0 rounded-lg opacity-90 ${getBarColor(task.status)} cursor-grab active:cursor-grabbing`}
                                        onMouseDown={(e) => handleMouseDown(e, 'move', task)}
                                    ></div>

                                    {/* طرف التكبير من الشمال (Start Date) */}
                                    <div
                                        className="absolute left-0 top-0 bottom-0 w-3 cursor-w-resize z-20 hover:bg-black/20 rounded-l-lg"
                                        onMouseDown={(e) => handleMouseDown(e, 'left', task)}
                                    />

                                    {/* طرف التكبير من اليمين (Due Date) */}
                                    <div
                                        className="absolute right-0 top-0 bottom-0 w-3 cursor-e-resize z-20 hover:bg-black/20 rounded-r-lg"
                                        onMouseDown={(e) => handleMouseDown(e, 'right', task)}
                                    />

                                    <span className="relative text-xs font-bold text-white truncate drop-shadow-md px-3 pointer-events-none">
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