'use client';

import React, { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';
import { PmpService } from '@/services/pmp.service';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    spaceId: string;
    onFolderCreated: () => void;
}

export default function CreateFolderModal({ isOpen, onClose, spaceId, onFolderCreated }: Props) {
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return setError('Folder name is required');

        setIsLoading(true); setError('');
        try {
            await PmpService.createFolder({ name, space_id: spaceId });
            setName('');
            onFolderCreated();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-[#1F2937]/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-fade-in-up z-10">
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-[#B03052] p-1 rounded-lg hover:bg-red-50 transition-colors">
                    <X size={20} strokeWidth={2.5} />
                </button>

                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                        <FolderPlus size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 className="text-xl font-extrabold text-[#1F2937]">New Folder</h2>
                        <p className="text-sm text-gray-500 font-medium">Group projects inside this workspace.</p>
                    </div>
                </div>

                {error && <div className="mb-6 p-3 bg-red-50 text-[#B03052] text-sm font-bold rounded-xl border border-red-100">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Folder Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Q1 Marketing..."
                            className="w-full border border-gray-200 bg-gray-50 focus:bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1E5A7A] focus:ring-4 focus:ring-[#1E5A7A]/10 transition-all font-medium"
                            autoFocus
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">Cancel</button>
                        <button type="submit" disabled={isLoading} className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl shadow-lg hover:bg-blue-700 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 flex items-center justify-center min-w-[120px]">
                            {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Create Folder'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}