'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Save, Loader2, Phone, Mail, Settings, CheckCircle2 } from 'lucide-react';
import { AdminContactService } from '@/services/admin.service';
import { ServiceContact } from '@/types/admin.types';
import { supabase } from '@/lib/supabase';

export default function SingleContactPage() {
    const params = useParams();
    const serviceName = params.service as string; // 'fullstack' or 'ai'

    const [contact, setContact] = useState<ServiceContact>({ service_name: serviceName, email: '', phone: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [token, setToken] = useState<string>('');

    // 🌟 Toast State بدل الـ alert
    const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

    useEffect(() => {
        const loadData = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.access_token) {
                setToken(session.access_token);
                try {
                    const data = await AdminContactService.getAdminContacts(session.access_token);
                    const found = data.find(d => d.service_name === serviceName);
                    if (found) setContact(found);
                } catch (error) {
                    console.error(error);
                }
            }
            setIsLoading(false);
        };
        loadData();
    }, [serviceName]);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000); // يختفي بعد 3 ثواني
    };

    const handleSave = async () => {
        if (!token) return;
        setIsSaving(true);
        try {
            await AdminContactService.updateContact(token, contact);
            showToast('Settings saved successfully!', 'success');
        } catch (error) {
            console.error(error);
            showToast('Failed to save settings. Please try again.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#1E5A7A] w-8 h-8" /></div>;

    const pageTitle = serviceName === 'fullstack' ? 'Fullstack Team Contacts' : 'AI Solutions Contacts';

    return (
        <div className="p-8 max-w-4xl mx-auto animate-fade-in-up relative">

            {/* 🌟 تصميم الـ Toast Notification (UI جميل بدل alert) */}
            {toast.show && (
                <div className={`fixed top-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-xl border text-white font-bold transition-all animate-fade-in-up ${toast.type === 'success' ? 'bg-[#3A7C15] border-[#2c610f]' : 'bg-[#B03052] border-[#8e2340]'}`}>
                    <CheckCircle2 size={20} />
                    {toast.message}
                </div>
            )}

            <div className="mb-8 border-b pb-6">
                <h2 className="text-3xl font-black text-[#1F2937] flex items-center gap-3 capitalize">
                    <Settings className="text-[#1E5A7A]" size={32} />
                    {pageTitle}
                </h2>
                <p className="text-gray-500 mt-2 font-medium">Update the public contact information for the {serviceName} department.</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-8 md:p-10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#1E5A7A]"></div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Public Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
                            <input
                                type="email"
                                value={contact.email}
                                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-base font-bold text-[#1F2937] focus:bg-white focus:outline-none focus:border-[#1E5A7A] focus:ring-2 focus:ring-[#1E5A7A]/10 transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Public Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-3.5 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={contact.phone}
                                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-base font-bold text-[#1F2937] focus:bg-white focus:outline-none focus:border-[#1E5A7A] focus:ring-2 focus:ring-[#1E5A7A]/10 transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-50 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-8 py-4 bg-[#1E5A7A] hover:bg-[#154560] text-white rounded-xl text-base font-bold shadow-lg transition-all flex items-center gap-2 disabled:opacity-70 transform hover:-translate-y-0.5"
                    >
                        {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
}