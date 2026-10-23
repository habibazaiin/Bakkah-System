'use client';

import React, { useState, useEffect } from 'react';
import { AlignLeft, Save, Loader2 } from 'lucide-react';

interface Props {
    taskId: string;
    initialDescription: string | null;
    onUpdate: (taskId: string, field: string, value: any) => Promise<void>;
}

export default function TaskDescription({ taskId, initialDescription, onUpdate }: Props) {
    const [description, setDescription] = useState(initialDescription || '');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setDescription(initialDescription || '');
    }, [initialDescription]);

    const handleSaveDescription = async () => {
        if (description === initialDescription) return;
        setIsSaving(true);
        try {
            await onUpdate(taskId, 'description', description);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            <div className="flex items-center gap-2 mb-3">
                <AlignLeft size={18} className="text-[#1E5A7A]" />
                <h3 className="font-extrabold text-[#1F2937]">Description</h3>
            </div>
            <div className="relative">
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a more detailed description..."
                    className="w-full min-h-[160px] p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-[#1F2937] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1E5A7A]/10 focus:border-[#1E5A7A] transition-all resize-y"
                />
                <button
                    onClick={handleSaveDescription}
                    disabled={isSaving || description === initialDescription}
                    className="absolute bottom-4 right-4 bg-[#1E5A7A] hover:bg-[#154560] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2"
                >
                    {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
                </button>
            </div>
        </div>
    );
}