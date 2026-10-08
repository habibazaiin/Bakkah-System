// src/app/(pmp)/pmp/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, FolderKanban, CheckCircle2, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PmpService } from '@/services/pmp.service';
import Link from 'next/link';

export default function PmpDashboard() {
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState({
        activeProjects: 0,
        tasksDueSoon: 0,
        completedTasks: 0,
        recentProjects: [] as any[]
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            setIsLoading(true);
            try {
                // 1. جلب بيانات اليوزر الحقيقية (عشان نعرض اسمه)
                const { data: { session } } = await supabase.auth.getSession();
                setUser(session?.user || null);

                // 2. جلب كل المشاريع
                const projects = await PmpService.getProjects();

                // 3. جلب كل المهام لكل المشاريع عشان نحسب الإحصائيات
                const tasksPromises = projects.map((p: any) => PmpService.getTasks(p.id));
                const tasksArrays = await Promise.all(tasksPromises);
                const allTasks = tasksArrays.flat(); // دمج كل المهام في مصفوفة واحدة

                // 4. الحسابات
                const completed = allTasks.filter(t => t.status === 'Done').length;

                // حساب المهام اللي هتنتهي خلال 7 أيام (Due Soon)
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const nextWeek = new Date(today);
                nextWeek.setDate(today.getDate() + 7);

                const dueSoon = allTasks.filter(t => {
                    if (t.status === 'Done' || !t.due_date) return false;
                    const dueDate = new Date(t.due_date);
                    return dueDate >= today && dueDate <= nextWeek;
                }).length;

                // تحديث الـ State بالأرقام الحقيقية
                setStats({
                    activeProjects: projects.length,
                    tasksDueSoon: dueSoon,
                    completedTasks: completed,
                    recentProjects: projects.slice(0, 3) // عرض آخر 3 مشاريع للوصول السريع
                });

            } catch (error) {
                console.error("Failed to load dashboard:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    // لو الداتا لسه بتحمل
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-100px)]">
                <Loader2 className="w-10 h-10 text-[#1E5A7A] animate-spin" strokeWidth={3} />
            </div>
        );
    }

    // استخراج اسم اليوزر (أو جزء من الإيميل لو مفيش اسم)
    const username = user?.user_metadata?.username || user?.email?.split('@')[0] || 'User';

    return (
        <div className="space-y-6 animate-fade-in-up pb-8">
            {/* Welcome Widget */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h1 className="text-3xl font-black text-[#1F2937] mb-2">
                    Welcome back, <span className="text-[#1E5A7A] capitalize">{username}</span>! 👋
                </h1>
                <p className="text-gray-500 font-medium">Here is what's happening with your projects today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Active Projects */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-[#1E5A7A] uppercase tracking-wider">Active Projects</h3>
                        <div className="w-10 h-10 rounded-xl bg-[#1E5A7A]/10 flex items-center justify-center text-[#1E5A7A]">
                            <FolderKanban size={20} strokeWidth={2.5} />
                        </div>
                    </div>
                    <p className="text-4xl font-black text-[#1F2937]">{stats.activeProjects}</p>
                </div>

                {/* Tasks Due Soon */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-[#B03052] uppercase tracking-wider">Tasks Due Soon</h3>
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-[#B03052]">
                            <Clock size={20} strokeWidth={2.5} />
                        </div>
                    </div>
                    <p className="text-4xl font-black text-[#1F2937]">{stats.tasksDueSoon}</p>
                </div>

                {/* Completed Tasks */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-green-600 uppercase tracking-wider">Completed Tasks</h3>
                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                            <CheckCircle2 size={20} strokeWidth={2.5} />
                        </div>
                    </div>
                    <p className="text-4xl font-black text-[#1F2937]">{stats.completedTasks}</p>
                </div>
            </div>

            {/* Quick Access / Recent Projects */}
            {stats.recentProjects.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-extrabold text-[#1F2937] mb-4">Recent Projects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {stats.recentProjects.map((project: any) => (
                            <Link href={`/pmp/projects/${project.id}`} key={project.id}>
                                <div className="p-5 bg-white border border-gray-100 rounded-2xl hover:border-[#1E5A7A]/30 hover:shadow-sm transition-all group cursor-pointer flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-[#1F2937] group-hover:text-[#1E5A7A] transition-colors mb-1 truncate">{project.name}</h3>
                                        <p className="text-xs font-medium text-gray-400">Click to open workspace</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#1E5A7A]/10 group-hover:text-[#1E5A7A] transition-colors">
                                        <FolderKanban size={14} strokeWidth={2.5} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}