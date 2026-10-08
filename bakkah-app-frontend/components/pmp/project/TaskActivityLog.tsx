'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Loader2 } from 'lucide-react';
import { PmpService } from '@/services/pmp.service';
import { TEAM_MEMBERS } from './AssigneeSelect'; // أو المسار الصح للداتا الوهمية بتاعت اليوزرز

interface ActivityItem {
    id: string;
    action: string;
    details: string | null;
    created_at: string;
    user_id: string;
}

export default function TaskActivityLog({ taskId }: { taskId: string }) {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const data = await PmpService.getTaskActivities(taskId);
                setActivities(data);
            } catch (error) {
                console.error("Error fetching activities:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchActivities();
    }, [taskId]);

    return (
        <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-4">
                <Activity size={18} className="text-[#1E5A7A]" />
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
                            const user = TEAM_MEMBERS.find(m => m.id === act.user_id) || { name: 'User', initials: 'U', color: 'bg-gray-100 text-gray-600' };
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
                                            {new Date(act.created_at).toLocaleString('en-GB', { hour: '2-digit', minute:'2-digit', day:'numeric', month:'short' })}
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