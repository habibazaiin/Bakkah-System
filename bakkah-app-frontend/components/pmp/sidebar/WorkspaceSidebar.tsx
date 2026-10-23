'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
    ChevronRight, ChevronDown, Plus, Folder as FolderIcon,
    MoreHorizontal, Edit2, Trash2, Settings, LayoutTemplate
} from 'lucide-react';
import { Space, Project, Folder } from '@/types/pmp.types';
import { PmpService } from '@/services/pmp.service';

interface Props {
    isSidebarOpen: boolean;
    spaces: Space[];
    projects: Project[];
    folders: Folder[];
    isLoadingData: boolean;
    expandedSpaces: Record<string, boolean>;
    expandedFolders: Record<string, boolean>;
    toggleSpace: (id: string, e: React.MouseEvent) => void;
    toggleFolder: (id: string, e: React.MouseEvent) => void;
    pathname: string;
    setIsCreateSpaceModalOpen: (val: boolean) => void;
    setSpaceForSettings: (space: Space | null) => void;
    setSpaceIdForNewFolder: (id: string | null) => void;
    setSpaceIdForNewProject: (id: string | null) => void;
    setFolderIdForNewProject: (id: string | null) => void;
    setSpaceToDelete: (space: Space | null) => void;
    setFolderToDelete: (folder: Folder | null) => void;
    setProjectToDelete: (project: Project | null) => void;
    refreshData?: () => void; // دالة لتحديث البيانات بعد تعديل الاسم
}

export default function WorkspaceSidebar(props: Props) {
    // 🌟 State للتحكم في القوائم المنسدلة (Menu) 🌟
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

    // 🌟 State للتحكم في مودال إعادة التسمية (Rename) 🌟
    const [itemToRename, setItemToRename] = useState<{ id: string, type: 'space' | 'folder' | 'project', name: string } | null>(null);
    const [newName, setNewName] = useState('');
    const [isRenaming, setIsRenaming] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);

    // إغلاق القائمة المنسدلة عند الضغط في أي مكان خارجها
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMenuClick = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setActiveMenuId(activeMenuId === id ? null : id);
    };

    const handleRenameSubmit = async () => {
        if (!itemToRename || !newName.trim()) return;
        setIsRenaming(true);
        try {
            if (itemToRename.type === 'space') {
                await PmpService.updateSpace(itemToRename.id, { name: newName });
            } else if (itemToRename.type === 'folder') {
                await PmpService.updateFolder(itemToRename.id, { name: newName });
            } else if (itemToRename.type === 'project') {
                await PmpService.updateProject(itemToRename.id, { name: newName });
            }
            if (props.refreshData) props.refreshData(); // تحديث الداتا بعد التعديل
            setItemToRename(null);
        } catch (error) {
            console.error("Error renaming:", error);
        } finally {
            setIsRenaming(false);
        }
    };

    if (!props.isSidebarOpen) return null;

    return (
        <div className="w-72 bg-white border-r border-gray-200 flex flex-col shrink-0 transition-all duration-300 relative z-10">
            <div className="p-5 flex items-center justify-between border-b border-gray-100">
                <h2 className="text-sm font-black text-[#1F2937] tracking-wider uppercase">Workspaces</h2>
                <button onClick={() => props.setIsCreateSpaceModalOpen(true)} className="w-7 h-7 rounded-lg bg-[#1E5A7A]/10 text-[#1E5A7A] hover:bg-[#1E5A7A] hover:text-white transition-colors flex items-center justify-center">
                    <Plus size={16} strokeWidth={2.5} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1">
                {props.isLoadingData ? (
                    <div className="p-4 text-center text-sm text-gray-400 font-bold">Loading...</div>
                ) : props.spaces.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-400 font-bold">No workspaces yet.</div>
                ) : (
                    props.spaces.map(space => (
                        <div key={space.id} className="mb-2">
                            {/* 🌟 تصميم الـ Workspace 🌟 */}
                            <div
                                className="group flex items-center gap-2 p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                                onClick={(e) => props.toggleSpace(space.id, e)}
                            >
                                <button className="p-1 text-gray-400 hover:text-[#1E5A7A] transition-colors">
                                    {props.expandedSpaces[space.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                </button>
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1E5A7A] to-[#2A6B8F] text-white flex items-center justify-center shadow-sm shrink-0">
                                    <LayoutTemplate size={14} />
                                </div>
                                <span className="text-sm font-bold text-[#1F2937] flex-1 truncate">{space.name}</span>

                                {/* 🌟 زر القائمة المنسدلة للـ Workspace 🌟 */}
                                <div className="relative" ref={activeMenuId === space.id ? menuRef : null}>
                                    <button
                                        onClick={(e) => handleMenuClick(space.id, e)}
                                        className="p-1.5 text-gray-400 hover:bg-gray-200 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <MoreHorizontal size={16} />
                                    </button>

                                    {activeMenuId === space.id && (
                                        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 z-50">
                                            <button onClick={(e) => { e.stopPropagation(); setItemToRename({ id: space.id, type: 'space', name: space.name }); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                <Edit2 size={14} /> Rename
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); props.setSpaceIdForNewFolder(space.id); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                <FolderIcon size={14} /> Add Folder
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); props.setSpaceIdForNewProject(space.id); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                <Plus size={14} /> Add Project
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); props.setSpaceForSettings(space); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                <Settings size={14} /> Settings
                                            </button>
                                            <div className="h-px bg-gray-100 my-1"></div>
                                            <button onClick={(e) => { e.stopPropagation(); props.setSpaceToDelete(space); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2">
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 🌟 محتوى الـ Workspace 🌟 */}
                            {props.expandedSpaces[space.id] && (
                                <div className="ml-5 pl-3 border-l border-gray-100 mt-1 space-y-1">

                                    {/* Folders */}
                                    {props.folders.filter(f => f.space_id === space.id).map(folder => (
                                        <div key={folder.id}>
                                            <div
                                                className="group flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                                onClick={(e) => props.toggleFolder(folder.id, e)}
                                            >
                                                <button className="p-0.5 text-gray-400 hover:text-[#1E5A7A]">
                                                    {props.expandedFolders[folder.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                                </button>
                                                <FolderIcon size={16} className="text-[#1E5A7A]/70" />
                                                <span className="text-xs font-bold text-gray-600 flex-1 truncate">{folder.name}</span>

                                                {/* 🌟 زر القائمة المنسدلة للـ Folder 🌟 */}
                                                <div className="relative" ref={activeMenuId === folder.id ? menuRef : null}>
                                                    <button onClick={(e) => handleMenuClick(folder.id, e)} className="p-1 text-gray-400 hover:bg-gray-200 rounded-md opacity-0 group-hover:opacity-100 transition-all">
                                                        <MoreHorizontal size={14} />
                                                    </button>
                                                    {activeMenuId === folder.id && (
                                                        <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 z-50">
                                                            <button onClick={(e) => { e.stopPropagation(); setItemToRename({ id: folder.id, type: 'folder', name: folder.name }); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                                <Edit2 size={14} /> Rename
                                                            </button>
                                                            <button onClick={(e) => { e.stopPropagation(); props.setSpaceIdForNewProject(space.id); props.setFolderIdForNewProject(folder.id); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                                <Plus size={14} /> Add Project
                                                            </button>
                                                            <div className="h-px bg-gray-100 my-1"></div>
                                                            <button onClick={(e) => { e.stopPropagation(); props.setFolderToDelete(folder); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2">
                                                                <Trash2 size={14} /> Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Projects inside Folder */}
                                            {props.expandedFolders[folder.id] && (
                                                <div className="ml-4 pl-3 border-l border-gray-100 mt-1 space-y-0.5">
                                                    {props.projects.filter(p => p.folder_id === folder.id).map(project => (
                                                        <div key={project.id} className="group flex items-center justify-between p-1.5 rounded-lg hover:bg-gray-50">
                                                            <Link href={`/pmp/projects/${project.id}`} className="flex-1 text-xs font-bold text-gray-500 hover:text-[#1E5A7A] truncate">
                                                                {project.name}
                                                            </Link>
                                                            {/* 🌟 زر القائمة المنسدلة للـ Project 🌟 */}
                                                            <div className="relative" ref={activeMenuId === project.id ? menuRef : null}>
                                                                <button onClick={(e) => handleMenuClick(project.id, e)} className="p-1 text-gray-400 hover:bg-gray-200 rounded-md opacity-0 group-hover:opacity-100 transition-all">
                                                                    <MoreHorizontal size={14} />
                                                                </button>
                                                                {activeMenuId === project.id && (
                                                                    <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 z-50">
                                                                        <button onClick={(e) => { e.stopPropagation(); setItemToRename({ id: project.id, type: 'project', name: project.name }); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                                            <Edit2 size={14} /> Rename
                                                                        </button>
                                                                        <div className="h-px bg-gray-100 my-1"></div>
                                                                        <button onClick={(e) => { e.stopPropagation(); props.setProjectToDelete(project); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2">
                                                                            <Trash2 size={14} /> Delete
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {/* Projects directly in Space */}
                                    {props.projects.filter(p => p.space_id === space.id && !p.folder_id).map(project => (
                                        <div key={project.id} className="group flex items-center justify-between p-1.5 rounded-lg hover:bg-gray-50 pl-6">
                                            <Link href={`/pmp/projects/${project.id}`} className="flex-1 text-xs font-bold text-gray-500 hover:text-[#1E5A7A] truncate">
                                                {project.name}
                                            </Link>
                                            <div className="relative" ref={activeMenuId === project.id ? menuRef : null}>
                                                <button onClick={(e) => handleMenuClick(project.id, e)} className="p-1 text-gray-400 hover:bg-gray-200 rounded-md opacity-0 group-hover:opacity-100 transition-all">
                                                    <MoreHorizontal size={14} />
                                                </button>
                                                {activeMenuId === project.id && (
                                                    <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 z-50">
                                                        <button onClick={(e) => { e.stopPropagation(); setItemToRename({ id: project.id, type: 'project', name: project.name }); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                            <Edit2 size={14} /> Rename
                                                        </button>
                                                        <div className="h-px bg-gray-100 my-1"></div>
                                                        <button onClick={(e) => { e.stopPropagation(); props.setProjectToDelete(project); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2">
                                                            <Trash2 size={14} /> Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* 🌟 Rename Modal (موحد لكل حاجة) 🌟 */}
            {itemToRename && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-[#1F2937]/40 backdrop-blur-sm transition-opacity" onClick={() => setItemToRename(null)} />
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 animate-fade-in-up z-10">
                        <h3 className="text-xl font-black text-[#1F2937] mb-4">Rename {itemToRename.type}</h3>
                        <input
                            type="text"
                            defaultValue={itemToRename.name}
                            onChange={(e) => setNewName(e.target.value)}
                            autoFocus
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-[#1F2937] focus:bg-white focus:outline-none focus:border-[#1E5A7A] mb-6"
                        />
                        <div className="flex gap-3">
                            <button onClick={() => setItemToRename(null)} className="flex-1 px-4 py-3 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors">Cancel</button>
                            <button onClick={handleRenameSubmit} disabled={isRenaming} className="flex-1 px-4 py-3 bg-[#1E5A7A] text-white font-bold rounded-xl hover:bg-[#154158] transition-colors shadow-md">
                                {isRenaming ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}