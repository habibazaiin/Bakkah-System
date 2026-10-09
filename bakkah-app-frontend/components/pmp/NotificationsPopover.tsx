'use client';

import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2 } from 'lucide-react';
import { PmpService } from '@/services/pmp.service';
import { AppNotification } from '@/types/pmp.types';

export default function NotificationsPopover() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<AppNotification[]>([]);

    const fetchNotifs = async () => {
        try {
            const data = await PmpService.getNotifications();
            setNotifications(data);
        } catch (error) {
            console.error(error);
        }
    };

    // جلب الإشعارات كل 15 ثانية
    useEffect(() => {
        fetchNotifs();
        const interval = setInterval(fetchNotifs, 15000);
        return () => clearInterval(interval);
    }, []);

    const handleOpen = async () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            const unread = notifications.some(n => !n.is_read);
            if (unread) {
                await PmpService.markNotificationsRead();
                setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            }
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="relative">
            <button 
                onClick={handleOpen} 
                className="p-3 text-white/50 hover:bg-white/5 hover:text-white rounded-2xl transition-all duration-300 relative" 
                title="Notifications"
            >
                <Bell size={22} strokeWidth={2} />
                {unreadCount > 0 && (
                    <span className="absolute top-3 right-3.5 w-2.5 h-2.5 bg-[#B03052] rounded-full border-2 border-[#12394D] animate-pulse"></span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-10 mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in-up">
                        <div className="p-4 border-b border-gray-100 bg-[#F8FAFC] flex justify-between items-center">
                            <h3 className="font-extrabold text-[#1F2937] text-sm">Notifications</h3>
                            {unreadCount > 0 && <span className="bg-[#1E5A7A] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{unreadCount} New</span>}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <p className="text-center p-6 text-sm text-gray-400 font-medium">No notifications yet.</p>
                            ) : (
                                notifications.map(notif => (
                                    <div key={notif.id} className={`p-4 border-b border-gray-50 last:border-b-0 ${notif.is_read ? 'bg-white' : 'bg-blue-50/30'}`}>
                                        <div className="flex gap-3">
                                            <div className="mt-0.5 text-[#1E5A7A]"><CheckCircle2 size={16} /></div>
                                            <div>
                                                <p className="text-sm font-bold text-[#1F2937] mb-0.5">{notif.title}</p>
                                                <p className="text-xs text-gray-500 font-medium leading-relaxed">{notif.message}</p>
                                                <p className="text-[10px] font-bold text-gray-400 mt-2">
                                                    {new Date(notif.created_at).toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}