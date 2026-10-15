'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Loader2, Calendar } from 'lucide-react';

export default function GanttView({ tasks, isLoading, onTaskClick, onUpdate }: any) {
    const containerRef = useRef<HTMLDivElement>(null);

    const [dragState, setDragState] = useState<{ type: 'move' | 'left' | 'right', taskId: string, startX: number, originalStart: Date, originalDue: Date } | null>(null);
    const [tempDates, setTempDates] = useState<Record<string, { start: Date, due: Date }>>({});
    const [timelineWidth, setTimelineWidth] = useState(0);

    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver((entries) => {
            setTimelineWidth(entries[0].contentRect.width);
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const getTaskDates = (task: any) => {
        if (tempDates[task.id]) return tempDates[task.id];
        const start = task.start_date ? new Date(task.start_date) : new Date(task.created_at);
        start.setHours(0, 0, 0, 0);
        let due = task.due_date ? new Date(task.due_date) : new Date(start);
        due.setHours(0, 0, 0, 0);
        if (due < start) due = new Date(start);
        return { start, due };
    };

    useEffect(() => {
        if (!dragState) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const dayWidth = containerRef.current.offsetWidth / 14;
            const deltaDays = Math.round((e.clientX - dragState.startX) / dayWidth);

            let newStart = new Date(dragState.originalStart);
            let newDue = new Date(dragState.originalDue);

            if (dragState.type === 'move') {
                newStart.setDate(newStart.getDate() + deltaDays);
                newDue.setDate(newDue.getDate() + deltaDays);
            } else if (dragState.type === 'left') {
                newStart.setDate(newStart.getDate() + deltaDays);
                if (newStart > newDue) newStart = new Date(newDue);
            } else if (dragState.type === 'right') {
                newDue.setDate(newDue.getDate() + deltaDays);
                if (newDue < newStart) newDue = new Date(newStart);
            }

            const currentTask = tasks.find((t: any) => t.id === dragState.taskId);
            if (currentTask?.depends_on_task_id) {
                const depTask = tasks.find((t: any) => t.id === currentTask.depends_on_task_id);
                if (depTask) {
                    const depDates = getTaskDates(depTask);
                    const depDue = new Date(depDates.due);
                    depDue.setHours(0, 0, 0, 0);

                    if (newStart < depDue) {
                        newStart = new Date(depDue);
                        if (dragState.type === 'move') {
                            const duration = dragState.originalDue.getTime() - dragState.originalStart.getTime();
                            newDue = new Date(newStart.getTime() + duration);
                        }
                    }
                }
            }

            setTempDates({ [dragState.taskId]: { start: newStart, due: newDue } });
        };

        const handleMouseUp = () => {
            if (tempDates[dragState.taskId] && onUpdate) {
                const { start, due } = tempDates[dragState.taskId];
                const formatDate = (d: Date) => {
                    const offset = d.getTimezoneOffset() * 60000;
                    return new Date(d.getTime() - offset).toISOString().split('T')[0];
                };

                const startStr = formatDate(start);
                const dueStr = formatDate(due);
                const origStartStr = formatDate(dragState.originalStart);
                const origDueStr = formatDate(dragState.originalDue);

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
    }, [dragState, tempDates, onUpdate, tasks]);

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
            default: return 'bg-gradient-to-r from-purple-400 to-purple-500';
        }
    };

    const handleMouseDown = (e: React.MouseEvent, type: 'move' | 'left' | 'right', task: any) => {
        e.stopPropagation();
        const { start, due } = getTaskDates(task);
        setDragState({ type, taskId: task.id, startX: e.clientX, originalStart: start, originalDue: due });
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up flex flex-col select-none">
            <div className="flex border-b border-gray-100 bg-[#F8FAFC]/80">
                <div className="w-64 shrink-0 px-6 py-4 border-r border-gray-100 font-extrabold text-xs text-gray-500 uppercase tracking-wider flex items-center">
                    Task Name
                </div>
                {/* 🌟 نقلنا الـ ref هنا للمكان الصح 🌟 */}
                <div className="flex-1 flex overflow-hidden" ref={containerRef}>
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

            <div className="flex-1 overflow-y-auto overflow-x-hidden relative min-h-[200px]">
                <svg className="absolute top-0 right-0 h-full pointer-events-none z-20" style={{ width: 'calc(100% - 16rem)' }}>
                    <defs>
                        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#B03052" />
                        </marker>
                    </defs>
                    {timelineWidth > 0 && tasks.map((task: any, taskIdx: number) => {
                        if (!task.depends_on_task_id) return null;
                        const depTask = tasks.find((t: any) => t.id === task.depends_on_task_id);
                        if (!depTask) return null;

                        const depIdx = tasks.findIndex((t: any) => t.id === depTask.id);
                        const depDates = getTaskDates(depTask);
                        const taskDates = getTaskDates(task);

                        const depStartOffset = (depDates.start.getTime() - timelineStartDate.getTime()) / 86400000;
                        const depDuration = (depDates.due.getTime() - depDates.start.getTime()) / 86400000 + 1;
                        const taskStartOffset = (taskDates.start.getTime() - timelineStartDate.getTime()) / 86400000;

                        const x1 = ((depStartOffset + depDuration) / 14) * timelineWidth;
                        const y1 = depIdx * 72 + 36;

                        const x2 = (taskStartOffset / 14) * timelineWidth;
                        const y2 = taskIdx * 72 + 36;

                        return (
                            <path
                                key={`dep-${task.id}`}
                                d={`M ${x1} ${y1} C ${x1 + 20} ${y1}, ${x2 - 20} ${y2}, ${x2 - 2} ${y2}`}
                                fill="transparent"
                                stroke="#B03052"
                                strokeWidth="2.5"
                                strokeDasharray="5,5"
                                markerEnd="url(#arrow)"
                                className="opacity-70 transition-all duration-300"
                            />
                        );
                    })}
                </svg>

                {tasks.map((task: any, index: number) => {
                    const activeDates = getTaskDates(task);
                    const startOffsetDays = Math.round((activeDates.start.getTime() - timelineStartDate.getTime()) / 86400000);
                    const durationDays = Math.round((activeDates.due.getTime() - activeDates.start.getTime()) / 86400000) + 1;

                    let leftPercent = (startOffsetDays / 14) * 100;
                    let widthPercent = (durationDays / 14) * 100;

                    // 🌟 هنا شيلنا الـ return null عشان الصف يفضل موجود دايماً 🌟
                    const isBarVisible = !(leftPercent > 100 || leftPercent + widthPercent < 0);

                    return (
                        <div key={task.id} className="flex border-b border-gray-50 hover:bg-gray-50/50 transition-colors group h-[72px]">
                            <div
                                onClick={() => onTaskClick && onTaskClick(task)}
                                className="w-64 shrink-0 px-6 py-4 border-r border-gray-100 font-bold text-sm text-[#1F2937] truncate group-hover:text-[#1E5A7A] transition-colors cursor-pointer flex items-center"
                            >
                                {task.title}
                            </div>

                            <div className="flex-1 relative flex">
                                {timelineDays.map((_, i) => (
                                    <div key={i} className="flex-1 min-w-[60px] border-r border-gray-50 last:border-r-0 pointer-events-none"></div>
                                ))}

                                {/* نظهر البار بس لو تاريخه جوه الشاشة */}
                                {isBarVisible && (
                                    <div
                                        className={`absolute top-1/2 -translate-y-1/2 h-8 rounded-lg shadow-sm flex items-center z-30 ${dragState?.taskId === task.id ? 'z-50 shadow-lg ring-2 ring-[#1E5A7A]/50' : ''}`}
                                        style={{ left: `${leftPercent}%`, width: `${widthPercent}%`, minWidth: '20px' }}
                                    >
                                        <div
                                            className={`absolute inset-0 rounded-lg opacity-90 ${getBarColor(task.status)} cursor-grab active:cursor-grabbing transition-transform ${dragState?.taskId === task.id ? 'scale-[1.02]' : ''}`}
                                            onMouseDown={(e) => handleMouseDown(e, 'move', task)}
                                        ></div>

                                        <div
                                            className="absolute left-0 top-0 bottom-0 w-3 cursor-w-resize z-40 hover:bg-black/20 rounded-l-lg"
                                            onMouseDown={(e) => handleMouseDown(e, 'left', task)}
                                        />

                                        <div
                                            className="absolute right-0 top-0 bottom-0 w-3 cursor-e-resize z-40 hover:bg-black/20 rounded-r-lg"
                                            onMouseDown={(e) => handleMouseDown(e, 'right', task)}
                                        />

                                        <span className="relative text-xs font-bold text-white truncate drop-shadow-md px-3 pointer-events-none">
                                            {task.status}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}