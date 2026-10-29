'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Loader2, Shield, ShieldOff, Trash2, CheckCircle2, XCircle, AlertTriangle, Search } from 'lucide-react';

export default function UsersManagementPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Toast State
    const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

    // Modal & Action States
    const [userToDelete, setUserToDelete] = useState<any | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState('');

    const filteredUsers = users.filter(user => 
        (user.full_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (user.role?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    const fetchUsers = async () => {
        const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (!error && data) {
            setUsers(data);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
    };

    // 🌟 دالة تغيير الرتبة (Admin <-> User)
    const toggleRole = async (userId: string, currentRole: string) => {
        setUpdatingId(userId);
        const newRole = currentRole === 'admin' ? 'user' : 'admin';

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', userId);

            if (error) throw error;

            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            showToast(`User role updated to ${newRole} successfully!`, 'success');
        } catch (error: any) {
            showToast(error.message || 'Failed to update role.', 'error');
        } finally {
            setUpdatingId(null);
        }
    };

    // 🌟 دالة الحذف
    const confirmDelete = async () => {
        if (!userToDelete) return;
        setIsDeleting(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', userToDelete.id);

            if (error) throw error;

            setUsers(users.filter(u => u.id !== userToDelete.id));
            showToast('User deleted successfully!', 'success');
        } catch (error: any) {
            showToast(error.message || 'Failed to delete user.', 'error');
        } finally {
            setIsDeleting(false);
            setUserToDelete(null);
        }
    };

    if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#1E5A7A] w-8 h-8" /></div>;

    return (
        <div className="p-8 max-w-6xl mx-auto animate-fade-in-up relative">

            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed top-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-xl border text-white font-bold transition-all animate-fade-in-up ${toast.type === 'success' ? 'bg-[#3A7C15] border-[#2c610f]' : 'bg-[#B03052] border-[#8e2340]'}`}>
                    {toast.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                    {toast.message}
                </div>
            )}

            {/* نافذة تأكيد الحذف */}
            {userToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-fade-in-up border border-gray-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                                <AlertTriangle size={24} />
                            </div>
                            <h3 className="text-xl font-black text-[#1F2937]">Delete User</h3>
                        </div>
                        <p className="text-gray-500 font-medium mb-8">
                            Are you sure you want to delete <span className="font-bold text-[#1F2937]">{userToDelete.full_name || userToDelete.email}</span>? This action will remove their profile permanently.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setUserToDelete(null)} disabled={isDeleting} className="px-5 py-2.5 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition-colors">Cancel</button>
                            <button onClick={confirmDelete} disabled={isDeleting} className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold flex items-center gap-2 shadow-md transition-all disabled:opacity-50">
                                {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />} Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b pb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-black text-[#1F2937] flex items-center gap-3">
                        <Users className="text-[#1E5A7A]" size={32} />
                        Users Management
                    </h2>
                    <p className="text-gray-500 mt-2 font-medium">View and manage all users, update their roles, or remove accounts.</p>
                </div>
                
                {/* 🌟 مربع البحث */}
                <div className="relative w-full md:w-72">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#1E5A7A] focus:ring-2 focus:ring-[#1E5A7A]/10 transition-all font-medium text-sm"
                    />
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-[#1F2937]">{user.full_name || 'N/A'}</div>
                                    <div className="text-xs text-gray-400 mt-1">Joined: {new Date(user.created_at).toLocaleDateString()}</div>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-600">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex w-max items-center gap-1 ${user.role === 'admin' ? 'bg-[#B03052]/10 text-[#B03052]' : 'bg-[#1E5A7A]/10 text-[#1E5A7A]'}`}>
                                        {user.role === 'admin' ? <Shield size={12} /> : <Users size={12} />}
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {/* زرار الترقية / الإلغاء */}
                                        <button
                                            onClick={() => toggleRole(user.id, user.role)}
                                            disabled={updatingId === user.id}
                                            title={user.role === 'admin' ? "Remove Admin" : "Make Admin"}
                                            className={`p-2 rounded-xl transition-all ${user.role === 'admin' ? 'text-orange-500 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`}
                                        >
                                            {updatingId === user.id ? <Loader2 size={18} className="animate-spin" /> : (user.role === 'admin' ? <ShieldOff size={18} /> : <Shield size={18} />)}
                                        </button>

                                        {/* زرار الحذف */}
                                        <button
                                            onClick={() => setUserToDelete(user)}
                                            title="Delete User"
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-gray-500 font-medium">No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}