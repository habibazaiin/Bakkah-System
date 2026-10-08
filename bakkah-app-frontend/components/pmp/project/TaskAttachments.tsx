'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Paperclip, Loader2, FileText, Image as ImageIcon, Download, Plus } from 'lucide-react';
import { PmpService } from '@/services/pmp.service';

interface Attachment {
    id: string;
    file_name: string;
    file_url: string;
    file_size: number;
    created_at: string;
}

export default function TaskAttachments({ taskId }: { taskId: string }) {
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchAttachments = async () => {
            try {
                const data = await PmpService.getTaskAttachments(taskId);
                setAttachments(data);
            } catch (error) {
                console.error("Error fetching attachments:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAttachments();
    }, [taskId]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const newAttachment = await PmpService.uploadAttachment(taskId, file);
            setAttachments(prev => [...prev, newAttachment]);
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = ''; // تفريغ الخانة
        }
    };

    // دالة لتحويل حجم الملف من Bytes لـ KB و MB
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // دالة لعرض أيقونة صورة أو ملف عادي
    const getFileIcon = (fileName: string) => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
            return <ImageIcon size={18} className="text-blue-500" />;
        }
        return <FileText size={18} className="text-gray-500" />;
    };

    return (
        <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Paperclip size={18} className="text-[#1E5A7A]" />
                    <h3 className="font-extrabold text-[#1F2937]">Attachments</h3>
                </div>
                
                {/* زرار رفع الملفات */}
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#1E5A7A] hover:bg-[#1E5A7A]/10 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                >
                    {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                    Add File
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            </div>

            {/* لستة الملفات المرفوعة */}
            <div className="space-y-3">
                {isLoading ? (
                    <div className="flex justify-center py-4"><Loader2 size={20} className="animate-spin text-[#1E5A7A]" /></div>
                ) : attachments.length === 0 ? (
                    <p className="text-sm text-gray-400 font-medium text-center py-4">No attachments yet.</p>
                ) : (
                    attachments.map(att => (
                        <div key={att.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-colors group animate-fade-in-up">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="p-2 bg-white rounded-lg shadow-sm shrink-0">
                                    {getFileIcon(att.file_name)}
                                </div>
                                <div className="truncate">
                                    <p className="text-sm font-bold text-[#1F2937] truncate">{att.file_name}</p>
                                    <p className="text-[10px] font-bold text-gray-400">{formatFileSize(att.file_size)} • {new Date(att.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <a 
                                href={att.file_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 text-gray-400 hover:text-[#1E5A7A] hover:bg-white rounded-lg transition-colors"
                            >
                                <Download size={16} />
                            </a>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}