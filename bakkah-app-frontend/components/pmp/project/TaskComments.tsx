'use client';

import React, { useState, useEffect } from 'react';
import { Send, Loader2, MessageSquare } from 'lucide-react';
import { PmpService } from '@/services/pmp.service';
import { TEAM_MEMBERS } from '@/constants/team';
import { Comment } from '@/types/pmp.types';

export default function TaskComments({ taskId }: { taskId: string }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const data = await PmpService.getTaskComments(taskId);
                setComments(data);
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
            setComments((prev) => [...prev, addedComment]);
            setNewComment('');
        } catch (error) {
            console.error("Error adding comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-4">
                <MessageSquare size={18} className="text-[#1E5A7A]" />
                <h3 className="font-extrabold text-[#1F2937]">Comments</h3>
            </div>

            {/* عرض التعليقات */}
            <div className="space-y-4 mb-6">
                {isLoading ? (
                    <div className="flex justify-center py-4"><Loader2 size={20} className="animate-spin text-[#1E5A7A]" /></div>
                ) : comments.length === 0 ? (
                    <p className="text-sm text-gray-400 font-medium text-center py-4">No comments yet. Start the conversation!</p>
                ) : (
                    comments.map((comment) => {
                        const user = TEAM_MEMBERS.find((m) => m.id === comment.user_id) || { name: 'User', initials: 'U', color: 'bg-gray-100 text-gray-600' };

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

            {/* كتابة تعليق */}
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