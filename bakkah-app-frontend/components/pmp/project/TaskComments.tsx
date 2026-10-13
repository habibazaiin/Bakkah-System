'use client';

import React, { useState, useEffect } from 'react';
import { Send, Loader2, MessageSquare } from 'lucide-react';
import { PmpService } from '@/services/pmp.service';

export default function TaskComments({ taskId }: { taskId: string }) {
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const data = await PmpService.getTaskComments(taskId);
                setComments(data || []);
            } catch (error) {
                console.error("Error fetching comments:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchComments();
    }, [taskId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {
            const addedComment = await PmpService.addComment(taskId, newComment.trim());
            // إضافة التعليق الجديد للداتا اللي معروضة
            setComments((prev) => [...prev, addedComment]);
            setNewComment('');
        } catch (error) {
            console.error("Error adding comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getUserInfo = (comment: any) => {
        // 🌟 بنقرأ الداتا من الكائن المتداخل profiles اللي جاي من الباك إند
        const p = comment.profiles || {};
        const name = p.username || p.email || 'System'; // أو 'Unknown User' في الكومنتات
        const initials = name.substring(0, 2).toUpperCase();
        const colors = ['bg-purple-100 text-purple-700', 'bg-blue-100 text-blue-700', 'bg-green-100 text-green-700', 'bg-orange-100 text-orange-700', 'bg-pink-100 text-pink-700'];
        const color = colors[(comment.user_id?.charCodeAt(0) || 0) % colors.length];
        return { name, initials, color };
    };

    return (
        <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-4">
                <MessageSquare size={18} className="text-[#1E5A7A]" />
                <h3 className="font-extrabold text-[#1F2937]">Comments</h3>
            </div>

            <div className="space-y-4 mb-6">
                {isLoading ? (
                    <div className="flex justify-center py-4"><Loader2 size={20} className="animate-spin text-[#1E5A7A]" /></div>
                ) : comments.length === 0 ? (
                    <p className="text-sm text-gray-400 font-medium text-center py-4">No comments yet. Start the conversation!</p>
                ) : (
                    comments.map((comment) => {
                        const user = getUserInfo(comment);

                        return (
                            <div key={comment.id} className="flex gap-3 animate-fade-in-up">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${user.color}`}>
                                    {user.initials}
                                </div>
                                <div className="flex-1 bg-gray-50 rounded-2xl rounded-tl-none p-3 border border-gray-100">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-bold text-[#1F2937]">{user.name}</span>
                                        <span className="text-[10px] font-bold text-gray-400">
                                            {new Date(comment.created_at).toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{comment.content}</p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <form onSubmit={handleSubmit} className="relative">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Ask a question or post an update..."
                    className="w-full min-h-[80px] p-3 pr-12 bg-white border border-gray-200 rounded-xl text-sm text-[#1F2937] focus:outline-none focus:border-[#1E5A7A] focus:ring-2 focus:ring-[#1E5A7A]/10 transition-all resize-y"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                />
                <button
                    type="submit"
                    disabled={!newComment.trim() || isSubmitting}
                    className="absolute bottom-3 right-3 p-2 bg-[#1E5A7A] hover:bg-[#154560] disabled:bg-gray-200 text-white rounded-lg transition-colors"
                >
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
            </form>
        </div>
    );
}