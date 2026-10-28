'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FurnitureService, FurnitureItem } from '@/services/furniture.service';
import { Loader2, Plus, Trash2, Upload, CheckCircle2, XCircle, AlertTriangle, Pencil, Edit2 } from 'lucide-react';

export default function AdminFurniturePage() {
    const [items, setItems] = useState<FurnitureItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // States for Adding
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [imageFile, setImageFile] = useState<File | null>(null);

    // States for Editing 🌟
    const [itemToEdit, setItemToEdit] = useState<FurnitureItem | null>(null);
    const [editImageFile, setEditImageFile] = useState<File | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    // Toast & Delete States
    const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.access_token) {
                const data = await FurnitureService.getPublicItems();
                setItems(data);
            }
            setIsLoading(false);
        };
        loadData();
    }, []);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
    };

    const uploadImage = async (file: File) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;
        const { error: uploadError } = await supabase.storage.from('portfolio-images').upload(filePath, file);
        if (uploadError) throw new Error(`Storage Error: ${uploadError.message}`);
        const { data } = supabase.storage.from('portfolio-images').getPublicUrl(filePath);
        return data.publicUrl;
    };

    // 🌟 دالة الإضافة
    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data: { session } } = await supabase.auth.getSession();
        const currentToken = session?.access_token;
        if (!currentToken) return showToast('Session expired. Refresh page.', 'error');

        if (!formData.title.trim()) return showToast('Please enter an item title.', 'error');
        if (!imageFile) return showToast('Please select an image to upload.', 'error');
        if (!formData.description.trim()) return showToast('Please enter a description.', 'error');

        setIsSaving(true);
        try {
            const imageUrl = await uploadImage(imageFile);
            const payload = { ...formData, image_url: imageUrl };
            const newItem = await FurnitureService.addItem(currentToken, payload);

            setItems([newItem, ...items]);
            setFormData({ title: '', description: '' });
            setImageFile(null);

            const fileInput = document.getElementById('image-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';

            showToast('Furniture item added successfully!', 'success');
        } catch (error: any) {
            showToast(error.message || 'Failed to add item.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // 🌟 دالة التعديل (Edit) الجديدة
    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!itemToEdit) return;

        const { data: { session } } = await supabase.auth.getSession();
        const currentToken = session?.access_token;
        if (!currentToken) return showToast('Session expired. Refresh page.', 'error');

        if (!itemToEdit.title.trim() || !itemToEdit.description.trim()) {
            return showToast('Title and description are required.', 'error');
        }

        setIsEditing(true);
        try {
            // لو الأدمن اختار صورة جديدة هنرفعها، لو لأ هنستخدم الرابط القديم
            let imageUrl = itemToEdit.image_url;
            if (editImageFile) {
                imageUrl = await uploadImage(editImageFile);
            }

            const payload = {
                title: itemToEdit.title,
                description: itemToEdit.description,
                image_url: imageUrl
            };

            const updatedItem = await FurnitureService.updateItem(currentToken, itemToEdit.id!, payload);

            // تحديث العنصر في القائمة
            setItems(items.map(item => item.id === updatedItem.id ? updatedItem : item));

            setItemToEdit(null);
            setEditImageFile(null);
            showToast('Item updated successfully!', 'success');
        } catch (error: any) {
            showToast(error.message || 'Failed to update item.', 'error');
        } finally {
            setIsEditing(false);
        }
    };

    // 🌟 دالة الحذف
    const confirmDelete = async () => {
        if (!itemToDelete) return;
        const { data: { session } } = await supabase.auth.getSession();
        const currentToken = session?.access_token;
        if (!currentToken) return showToast('Session expired.', 'error');

        setIsDeleting(true);
        try {
            await FurnitureService.deleteItem(currentToken, itemToDelete);
            setItems(items.filter(item => item.id !== itemToDelete));
            showToast('Item deleted successfully!', 'success');
        } catch (error: any) {
            showToast('Failed to delete item.', 'error');
        } finally {
            setIsDeleting(false);
            setItemToDelete(null);
        }
    };

    const openEditModal = (item: FurnitureItem) => {
        setItemToEdit({ ...item });
        setEditImageFile(null);
    };

    if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#1E5A7A] w-8 h-8" /></div>;

    return (
        <div className="p-8 max-w-5xl mx-auto animate-fade-in-up relative">

            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed top-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-xl border text-white font-bold transition-all animate-fade-in-up ${toast.type === 'success' ? 'bg-[#3A7C15] border-[#2c610f]' : 'bg-[#B03052] border-[#8e2340]'}`}>
                    {toast.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                    {toast.message}
                </div>
            )}

            {/* 🌟 نافذة التعديل (Edit Modal) */}
            {itemToEdit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <form onSubmit={handleEditSubmit} className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl animate-fade-in-up border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-black text-[#1F2937] flex items-center gap-2">
                                <Edit2 size={24} className="text-[#1E5A7A]" /> Edit Item
                            </h3>
                            <button type="button" onClick={() => setItemToEdit(null)} className="text-gray-400 hover:text-gray-700"><XCircle size={24} /></button>
                        </div>

                        <div className="space-y-4">
                            <input
                                required
                                type="text"
                                placeholder="Item Title"
                                value={itemToEdit.title}
                                onChange={e => setItemToEdit({ ...itemToEdit, title: e.target.value })}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#1E5A7A] focus:ring-2 focus:ring-[#1E5A7A]/10 transition-all font-bold text-[#1F2937]"
                            />

                            <div className="flex flex-col gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                                <span className="text-xs font-bold text-gray-500 uppercase">Update Image (Optional)</span>
                                <div className="flex items-center gap-4">
                                    <img src={itemToEdit.image_url} alt="Current" className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                                    <label className="flex items-center gap-2 cursor-pointer text-[#1E5A7A] font-bold text-sm bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm hover:text-[#B03052]">
                                        <Upload size={16} /> Choose New...
                                        <input type="file" accept="image/*" onChange={e => setEditImageFile(e.target.files ? e.target.files[0] : null)} className="hidden" />
                                    </label>
                                    <span className="text-xs font-medium text-gray-400 truncate flex-1">{editImageFile ? editImageFile.name : 'Keep current image'}</span>
                                </div>
                            </div>

                            <textarea
                                required
                                placeholder="Description"
                                value={itemToEdit.description}
                                onChange={e => setItemToEdit({ ...itemToEdit, description: e.target.value })}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#1E5A7A] focus:ring-2 focus:ring-[#1E5A7A]/10 transition-all font-medium text-[#1F2937] h-24"
                            ></textarea>
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <button type="button" onClick={() => setItemToEdit(null)} disabled={isEditing} className="px-5 py-2.5 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition-colors">Cancel</button>
                            <button type="submit" disabled={isEditing} className="px-6 py-2.5 bg-[#1E5A7A] hover:bg-[#154560] text-white font-bold rounded-xl flex items-center gap-2 shadow-md transition-all disabled:opacity-70">
                                {isEditing ? <Loader2 size={18} className="animate-spin" /> : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* نافذة تأكيد الحذف */}
            {itemToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-fade-in-up border border-gray-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500"><AlertTriangle size={24} /></div>
                            <h3 className="text-xl font-black text-[#1F2937]">Delete Item</h3>
                        </div>
                        <p className="text-gray-500 font-medium mb-8">Are you sure you want to delete this furniture item? This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setItemToDelete(null)} disabled={isDeleting} className="px-5 py-2.5 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition-colors">Cancel</button>
                            <button onClick={confirmDelete} disabled={isDeleting} className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold flex items-center gap-2 shadow-md transition-all disabled:opacity-50">
                                {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />} Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <h2 className="text-3xl font-black text-[#1F2937] mb-8 border-b pb-4">Manage Furniture Portfolio</h2>

            {/* نموذج الإضافة */}
            <form onSubmit={handleAdd} noValidate className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10 space-y-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#1E5A7A]"></div>
                <h3 className="font-bold text-[#1E5A7A] mb-4 flex items-center gap-2"><Plus size={20} /> Add New Item</h3>

                <input required type="text" placeholder="Item Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#1E5A7A] focus:ring-2 focus:ring-[#1E5A7A]/10 transition-all font-bold text-[#1F2937]" />

                <div className="flex items-center gap-4 w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus-within:bg-white focus-within:border-[#1E5A7A] focus-within:ring-2 focus-within:ring-[#1E5A7A]/10 transition-all">
                    <label htmlFor="image-upload" className="flex items-center gap-2 cursor-pointer text-[#1E5A7A] font-bold text-sm bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm hover:text-[#B03052] transition-colors">
                        <Upload size={16} /> Choose Image...
                    </label>
                    <input id="image-upload" required type="file" accept="image/*" onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)} className="hidden" />
                    <span className="text-sm font-medium text-gray-500 truncate">{imageFile ? imageFile.name : 'No file chosen'}</span>
                </div>

                <textarea required placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#1E5A7A] focus:ring-2 focus:ring-[#1E5A7A]/10 transition-all font-medium text-[#1F2937] h-24"></textarea>

                <button disabled={isSaving} type="submit" className="px-6 py-3 bg-[#1E5A7A] text-white font-bold rounded-xl flex items-center gap-2 shadow-md hover:bg-[#154560] transition-all disabled:opacity-70 mt-2">
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />} Add Item
                </button>
            </form>

            {/* عرض العناصر المضافة */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map(item => (
                    <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 items-center shadow-sm hover:shadow-md transition-shadow group">
                        <img src={item.image_url} alt={item.title} className="w-24 h-24 object-cover rounded-xl bg-gray-100 border border-gray-100" />
                        <div className="flex-1 overflow-hidden">
                            <h4 className="font-bold text-[#1F2937] truncate">{item.title}</h4>
                            <p className="text-sm text-gray-500 line-clamp-2 mt-1">{item.description}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            {/* 🌟 زرار التعديل */}
                            <button onClick={() => openEditModal(item)} className="p-2 text-gray-400 hover:text-[#1E5A7A] hover:bg-blue-50 rounded-lg transition-all">
                                <Pencil size={18} />
                            </button>
                            <button onClick={() => setItemToDelete(item.id!)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}