'use client';

import React from 'react';
import { Loader2, TrendingUp, Target, AlertTriangle, CheckCircle2, Activity, Clock, CalendarRange } from 'lucide-react';

export default function MetricsView({ tasks, isLoading }: any) {
    if (isLoading) {
        return <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 text-[#1E5A7A] animate-spin" /></div>;
    }

    // --- حساب الإحصائيات من المهام الحقيقية ---
    const totalTasks = tasks.length;
    const doneTasks = tasks.filter((t: any) => t.status === 'Done').length;
    const inProgressTasks = tasks.filter((t: any) => t.status === 'In Progress').length;
    const todoTasks = tasks.filter((t: any) => t.status === 'To Do').length;
    
    const highPriority = tasks.filter((t: any) => t.priority === 'High').length;
    const mediumPriority = tasks.filter((t: any) => t.priority === 'Medium').length;
    const lowPriority = tasks.filter((t: any) => t.priority === 'Low').length;

    const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    // --- حسابات الوقت الحقيقية (Time Metrics) ---
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    // مهام متأخرة (تاريخها عدّى ولسه مخلصتش)
    const overdueTasks = tasks.filter((t: any) => {
        if (t.status === 'Done' || !t.due_date) return false;
        const dueDate = new Date(t.due_date);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate < today;
    }).length;

    // مهام هتنتهي خلال أسبوع
    const upcomingDeadlines = tasks.filter((t: any) => {
        if (t.status === 'Done' || !t.due_date) return false;
        const dueDate = new Date(t.due_date);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate >= today && dueDate <= nextWeek;
    }).length;

    return (
        <div className="space-y-6 animate-fade-in-up pb-6">
            {/* Top Cards: Key Performance Indicators (KPIs) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Tasks</p>
                        <h3 className="text-4xl font-black text-[#1F2937]">{totalTasks}</h3>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                        <Target size={28} strokeWidth={2.5} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-sm font-bold text-green-600 uppercase tracking-wider mb-1">Completed</p>
                        <h3 className="text-4xl font-black text-[#1F2937]">{doneTasks}</h3>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                        <CheckCircle2 size={28} strokeWidth={2.5} />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[#1E5A7A] to-[#2A6B8F] p-6 rounded-3xl shadow-md border border-[#1E5A7A]/20 flex items-center justify-between transform hover:-translate-y-1 transition-transform">
                    <div>
                        <p className="text-sm font-bold text-white/80 uppercase tracking-wider mb-1">Completion Rate</p>
                        <h3 className="text-4xl font-black text-white">{completionRate}%</h3>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white backdrop-blur-sm">
                        <TrendingUp size={28} strokeWidth={2.5} />
                    </div>
                </div>
            </div>

            {/* Middle Section: Breakdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status Breakdown */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <Activity className="text-[#1E5A7A]" size={20} />
                        <h3 className="font-extrabold text-[#1F2937] text-lg">Status Distribution</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm font-bold mb-2">
                                <span className="text-gray-600">Done</span>
                                <span className="text-green-600">{doneTasks}</span>
                            </div>
                            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full transition-all duration-1000" style={{ width: `${totalTasks ? (doneTasks/totalTasks)*100 : 0}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm font-bold mb-2">
                                <span className="text-gray-600">In Progress</span>
                                <span className="text-blue-600">{inProgressTasks}</span>
                            </div>
                            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${totalTasks ? (inProgressTasks/totalTasks)*100 : 0}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm font-bold mb-2">
                                <span className="text-gray-600">To Do</span>
                                <span className="text-gray-400">{todoTasks}</span>
                            </div>
                            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gray-300 rounded-full transition-all duration-1000" style={{ width: `${totalTasks ? (todoTasks/totalTasks)*100 : 0}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Priority Breakdown */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <AlertTriangle className="text-[#B03052]" size={20} />
                        <h3 className="font-extrabold text-[#1F2937] text-lg">Priority Risks</h3>
                    </div>
                    <div className="flex flex-col h-full justify-center gap-4 -mt-4">
                        <div className="flex items-center justify-between p-4 bg-red-50/50 rounded-2xl border border-red-100">
                            <span className="font-bold text-red-600 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-600"></span> High Priority</span>
                            <span className="font-black text-xl text-red-700">{highPriority}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                            <span className="font-bold text-orange-600 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-600"></span> Medium Priority</span>
                            <span className="font-black text-xl text-orange-700">{mediumPriority}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <span className="font-bold text-gray-500 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gray-400"></span> Low Priority</span>
                            <span className="font-black text-xl text-gray-600">{lowPriority}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🌟 الجزء الجديد الحقيقي: مخاطر الوقت والجدول الزمني 🌟 */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Clock className="text-[#1E5A7A]" size={20} />
                        <h3 className="font-extrabold text-[#1F2937] text-lg">Schedule & Time Risks</h3>
                    </div>
                    <span className="px-3 py-1 bg-blue-50 text-[#1E5A7A] text-xs font-bold rounded-lg uppercase tracking-wider">Live</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 border border-red-100 rounded-2xl bg-red-50/30 flex items-center justify-between hover:bg-red-50 transition-colors">
                        <div>
                            <p className="text-sm font-bold text-red-500 flex items-center gap-2 mb-1">
                                <AlertTriangle size={16} /> Overdue Tasks
                            </p>
                            <p className="text-xs text-gray-500 font-medium">Missed deadlines, requires attention</p>
                        </div>
                        <h4 className={`text-3xl font-black ${overdueTasks > 0 ? 'text-red-600' : 'text-gray-400'}`}>{overdueTasks}</h4>
                    </div>
                    <div className="p-5 border border-orange-100 rounded-2xl bg-orange-50/30 flex items-center justify-between hover:bg-orange-50 transition-colors">
                        <div>
                            <p className="text-sm font-bold text-orange-500 flex items-center gap-2 mb-1">
                                <CalendarRange size={16} /> Upcoming Deadlines
                            </p>
                            <p className="text-xs text-gray-500 font-medium">Due within the next 7 days</p>
                        </div>
                        <h4 className={`text-3xl font-black ${upcomingDeadlines > 0 ? 'text-orange-600' : 'text-gray-400'}`}>{upcomingDeadlines}</h4>
                    </div>
                </div>
            </div>
        </div>
    );
}