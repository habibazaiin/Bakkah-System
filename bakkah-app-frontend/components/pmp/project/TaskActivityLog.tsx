'use client';

import React, { useState, useEffect } from 'react';
import { Activity as ActivityIcon, Loader2 } from 'lucide-react';
import { PmpService } from '@/services/pmp.service';

interface Props {
    taskId: string;
    // 🌟 ضفنا ده عشان نعرف إن التاسك اتحدثت فنجيب الـ Logs الجديدة
    lastUpdateTick?: number;
}

export default function TaskActivityLog({ taskId, lastUpdateTick = 0 }: Props) {
    const [activities, setActivities] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                // 🌟 ده بيجيب النشاطات من الباك إند، ولازم الباك إند يكون بيبعت user_name مع كل نشاط
                const data = await PmpService.getTaskActivities(taskId);
                setActivities(data || []);
            } catch (error) {
                console.error("Error fetching activities:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchActivities();
    }, [taskId, lastUpdateTick]); // 👈 ربطناها بـ lastUpdateTick عشان تعمل ريفريش لوحدها

    const getUserInfo = (act: any) => {
        const p = act.profiles || {};
        const name = p.username || p.email || 'System'; // أو 'Unknown User' في الكومنتات
        const initials = name.substring(0, 2).toUpperCase();
        const colors = ['bg-purple-100 text-purple-700', 'bg-blue-100 text-blue-700', 'bg-green-100 text-green-700', 'bg-orange-100 text-orange-700', 'bg-pink-100 text-pink-700'];
        const color = colors[(act.user_id?.charCodeAt(0) || 0) % colors.length];
        return { name, initials, color };
    };

    return (
        <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-4">
                <ActivityIcon size={18} className="text-[#1E5A7A]" />
                <h3 className="font-extrabold text-[#1F2937]">Activity Log</h3>
            </div>

            <div className="space-y-4 mb-4">
                {isLoading ? (
                    <div className="flex justify-center py-4"><Loader2 size={20} className="animate-spin text-[#1E5A7A]" /></div>
                ) : activities.length === 0 ? (
                    <p className="text-sm text-gray-400 font-medium text-center py-4">No recent activity.</p>
                ) : (
                    <div className="relative border-l-2 border-gray-100 ml-3 pl-5 space-y-6">
                        {activities.map((act) => {
                            const user = getUserInfo(act);
                            return (
                                <div key={act.id} className="relative animate-fade-in-up">
                                    <div className={`absolute -left-[31px] top-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border-4 border-white ${user.color}`}>
                                        {user.initials}
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-sm text-gray-600 leading-tight">
                                            <span className="font-bold text-[#1F2937]">{user.name}</span> {act.action}
                                        </p>
                                        {act.details && (
                                            <p className="text-xs text-gray-500 mt-1 truncate bg-gray-50 p-2 rounded-md border border-gray-100 w-fit max-w-full">
                                                {act.details}
                                            </p>
                                        )}
                                        <span className="text-[10px] font-bold text-gray-400 mt-1.5">
                                            {new Date(act.created_at).toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}