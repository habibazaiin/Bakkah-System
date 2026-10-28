'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Loader2, User, Lock, Save, CheckCircle2, XCircle } from 'lucide-react';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Form States
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSavingUser, setIsSavingUser] = useState(false);
    const [isSavingPass, setIsSavingPass] = useState(false);

    // Toast State
    const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) {
                router.push('/signin');
                return;
            }
            setUser(session.user);
            setUsername(session.user.user_metadata?.username || '');
            setIsLoading(false);
        };
        checkUser();
    }, [router]);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
    };

    // تحديث الاسم (Username)
    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) return showToast('Username cannot be empty', 'error');

        setIsSavingUser(true);
        try {
            const { error } = await supabase.auth.updateUser({
                data: { username: username }
            });

            // تحديثه في جدول الـ profiles كمان
            if (user) {
                await supabase.from('profiles').update({ full_name: username }).eq('id', user.id);
            }

            if (error) throw error;
            showToast('Profile updated successfully!', 'success');
        } catch (error: any) {
            showToast(error.message, 'error');
        } finally {
            setIsSavingUser(false);
        }
    };

    // تحديث الباسورد
    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) return showToast('Password must be at least 6 characters', 'error');

        setIsSavingPass(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;
            showToast('Password updated successfully!', 'success');
            setPassword('');
        } catch (error: any) {
            showToast(error.message, 'error');
        } finally {
            setIsSavingPass(false);
        }
    };

    if (isLoading) return <div className="min-h-[60vh] flex justify-center items-center"><Loader2 className="animate-spin text-[#1E5A7A] w-10 h-10" /></div>;

    return (
        <div className="bg-[#F8FAFC] min-h-[80vh] py-12 px-4 sm:px-6 relative">

            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed top-24 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-xl border text-white font-bold transition-all animate-fade-in-up ${toast.type === 'success' ? 'bg-[#3A7C15] border-[#2c610f]' : 'bg-[#B03052] border-[#8e2340]'}`}>
                    {toast.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                    {toast.message}
                </div>
            )}

            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">

                {/* Header */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-tr from-[#1E5A7A] to-[#2A6B8F] text-white rounded-full flex items-center justify-center text-3xl font-black shadow-lg border-4 border-white">
                        {username.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-[#1F2937]">My Profile</h1>
                        <p className="text-gray-500 font-medium mt-1">Manage your account settings and security.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* تحديث البيانات الشخصية */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#1E5A7A]"></div>
                        <h2 className="text-xl font-bold text-[#1E5A7A] flex items-center gap-2 mb-6">
                            <User size={22} /> Personal Information
                        </h2>

                        <form onSubmit={handleUpdateProfile} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                                <input type="email" disabled value={user?.email} className="w-full p-3.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 font-medium cursor-not-allowed" />
                                <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Username</label>
                                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#1E5A7A] focus:ring-2 focus:ring-[#1E5A7A]/10 transition-all font-bold text-[#1F2937]" />
                            </div>

                            <button disabled={isSavingUser} type="submit" className="w-full py-3.5 bg-[#1E5A7A] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md hover:bg-[#154560] transition-all disabled:opacity-70">
                                {isSavingUser ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save Profile
                            </button>
                        </form>
                    </div>

                    {/* تغيير الباسورد */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#B03052]"></div>
                        <h2 className="text-xl font-bold text-[#B03052] flex items-center gap-2 mb-6">
                            <Lock size={22} /> Security Settings
                        </h2>

                        <form onSubmit={handleUpdatePassword} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">New Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#B03052] focus:ring-2 focus:ring-[#B03052]/10 transition-all font-bold text-[#1F2937]"
                                />
                                <p className="text-xs text-gray-400 mt-1">Must be at least 6 characters long.</p>
                            </div>

                            <button disabled={isSavingPass || !password} type="submit" className="w-full py-3.5 bg-[#B03052] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md hover:bg-[#8e2340] transition-all disabled:opacity-70 mt-auto">
                                {isSavingPass ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Update Password
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}