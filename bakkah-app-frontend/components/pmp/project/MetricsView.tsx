// src/components/pmp/project/MetricsView.tsx
'use client';

import React from 'react';
import { Loader2, TrendingUp, Target, AlertTriangle, CheckCircle2, BarChart3, Activity } from 'lucide-react';

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

            {/* Bottom Section: PMP specific (EVM Placeholder for future) */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <BarChart3 className="text-[#1E5A7A]" size={20} />
                        <h3 className="font-extrabold text-[#1F2937] text-lg">Earned Value Management (EVM)</h3>
                    </div>
                    <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-lg uppercase tracking-wider">Advanced</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
                        <p className="text-sm font-bold text-gray-500 mb-1">Schedule Performance Index (SPI)</p>
                        <div className="flex items-end gap-2">
                            <h4 className="text-2xl font-black text-[#1F2937]">1.05</h4>
                            <span className="text-xs font-bold text-green-600 mb-1">Ahead of schedule</span>
                        </div>
                    </div>
                    <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
                        <p className="text-sm font-bold text-gray-500 mb-1">Cost Performance Index (CPI)</p>
                        <div className="flex items-end gap-2">
                            <h4 className="text-2xl font-black text-[#1F2937]">0.98</h4>
                            <span className="text-xs font-bold text-orange-500 mb-1">Slightly over budget</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}