'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Users, ShieldCheck, Image as ImageIcon, Activity, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
    totalUsers: number;
    totalAdmins: number;
    totalFurniture: number;
    recentUsers: any[];
}

export default function AdminOverviewPage() {
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        totalAdmins: 0,
        totalFurniture: 0,
        recentUsers: []
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // 1. جلب إجمالي عدد المستخدمين
                const { count: usersCount } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true });

                // 2. جلب إجمالي عدد الأدمنز
                const { count: adminsCount } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true })
                    .eq('role', 'admin');

                // 3. جلب إجمالي قطع الأثاث
                const { count: furnitureCount } = await supabase
                    .from('furniture_portfolio')
                    .select('*', { count: 'exact', head: true });

                // 4. جلب أحدث 5 مستخدمين سجلوا في الموقع
                const { data: recent } = await supabase
                    .from('profiles')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(5);

                setStats({
                    totalUsers: usersCount || 0,
                    totalAdmins: adminsCount || 0,
                    totalFurniture: furnitureCount || 0,
                    recentUsers: recent || []
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (isLoading) return <div className="flex items-center justify-center h-full min-h-[400px]"><Loader2 className="w-10 h-10 animate-spin text-[#1E5A7A]" /></div>;

    const statCards = [
        { title: 'Total Users', value: stats.totalUsers, icon: <Users size={28} className="text-[#1E5A7A]" />, bg: 'bg-blue-50' },
        { title: 'Administrators', value: stats.totalAdmins, icon: <ShieldCheck size={28} className="text-[#B03052]" />, bg: 'bg-red-50' },
        { title: 'Furniture Items', value: stats.totalFurniture, icon: <ImageIcon size={28} className="text-[#3A7C15]" />, bg: 'bg-green-50' },
    ];

    return (
        <div className="p-8 max-w-6xl mx-auto animate-fade-in-up">
            <div className="mb-10 border-b pb-6">
                <h2 className="text-3xl font-black text-[#1F2937] flex items-center gap-3">
                    <Activity className="text-[#1E5A7A]" size={32} />
                    Dashboard Overview
                </h2>
                <p className="text-gray-500 mt-2 font-medium">Welcome back! Here is a quick summary of your platform's current status.</p>
            </div>

            {/* 🌟 كروت الإحصائيات السريعة */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {statCards.map((card, idx) => (
                    <div key={idx} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-6 transition-all hover:-translate-y-1 hover:shadow-md">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${card.bg}`}>
                            {card.icon}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{card.title}</p>
                            <h3 className="text-4xl font-black text-[#1F2937] mt-1">{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* 🌟 أحدث التسجيلات */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-black text-[#1F2937]">Recent Registrations</h3>
                    <Link href="/dashboard/users" className="text-sm font-bold text-[#1E5A7A] hover:text-[#B03052] flex items-center gap-1 transition-colors">
                        View All <ArrowRight size={16} />
                    </Link>
                </div>
                <div className="p-0">
                    {stats.recentUsers.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <tbody className="divide-y divide-gray-100">
                                {stats.recentUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-[#1F2937]">{user.full_name || 'N/A'}</div>
                                            <div className="text-xs text-gray-400 mt-1">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-8 text-center text-gray-500 font-medium">No recent users found.</div>
                    )}
                </div>
            </div>
        </div>
    );
}