'use client';

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

interface Props {
    taskId: string;
    onDelete: (taskId: string) => void;
    onClose: () => void;
}

export default function TaskDeleteZone({ taskId, onDelete, onClose }: Props) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    return (
        <div className="pt-4 mt-8 border-t border-red-100 pb-8">
            {!showDeleteConfirm ? (
                <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl text-sm font-bold transition-all shadow-sm"
                >
                    <Trash2 size={16} /> Delete Task
                </button>
            ) : (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl animate-fade-in-up">
                    <p className="text-sm font-bold text-red-800 mb-4 text-center">Are you sure? This action cannot be undone.</p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="flex-1 px-4 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => { setShowDeleteConfirm(false); onDelete(taskId); onClose(); }}
                            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                        >
                            <Trash2 size={14} /> Yes, Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}