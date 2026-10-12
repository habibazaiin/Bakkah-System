'use client';

import React from 'react';
import Link from 'next/link';
import { Space, Project, Folder } from '@/types/pmp.types';
import { Plus, ChevronRight, ChevronDown, Layers, Settings2, Trash2, Folder as FolderIcon, Loader2 } from 'lucide-react';

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
    
    // Modals Setters
    setIsCreateSpaceModalOpen: (val: boolean) => void;
    setSpaceForSettings: (space: Space) => void;
    setSpaceIdForNewFolder: (id: string) => void;
    setSpaceIdForNewProject: (id: string) => void;
    setFolderIdForNewProject: (id: string | null) => void;
    setSpaceToDelete: (space: Space) => void;
    setFolderToDelete: (folder: Folder) => void;
    setProjectToDelete: (project: Project) => void;
}

export default function WorkspaceSidebar({
    isSidebarOpen, spaces, projects, folders, isLoadingData, expandedSpaces, expandedFolders,
    toggleSpace, toggleFolder, pathname,
    setIsCreateSpaceModalOpen, setSpaceForSettings, setSpaceIdForNewFolder, setSpaceIdForNewProject, 
    setFolderIdForNewProject, setSpaceToDelete, setFolderToDelete, setProjectToDelete
}: Props) {
    return (
        <aside className={`bg-white border-r border-gray-200 flex flex-col shrink-0 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full opacity-0 overflow-hidden'}`}>
            <div className="p-6 border-b border-gray-50 flex items-center justify-between mt-2">
                <h2 className="text-xs font-black text-[#1E5A7A] uppercase tracking-widest">Workspaces</h2>
                <button onClick={() => setIsCreateSpaceModalOpen(true)} className="text-gray-400 hover:text-[#B03052] hover:bg-red-50 p-1.5 rounded-lg transition-colors" title="New Space">
                    <Plus size={18} strokeWidth={3} />
                </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto hide-scrollbar">
                {isLoadingData ? (
                    <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 text-[#1E5A7A] animate-spin" /></div>
                ) : spaces.length === 0 ? (
                    <div className="text-center p-6 text-sm text-gray-400 font-medium bg-gray-50 rounded-2xl border border-dashed border-gray-200 mt-2">No spaces yet.<br />Click + to create one.</div>
                ) : (
                    <div className="space-y-3">
                        {spaces.map((space) => {
                            const isSpaceExpanded = expandedSpaces[space.id];
                            const spaceFolders = folders.filter(f => f.space_id === space.id);
                            const spaceProjects = projects.filter(p => p.space_id === space.id);
                            const standaloneProjects = spaceProjects.filter(p => !p.folder_id);

                            return (
                                <div key={space.id} className="animate-fade-in-up">
                                    {/* Space Header */}
                                    <div onClick={(e) => toggleSpace(space.id, e)} className={`flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer group transition-all border ${isSpaceExpanded ? 'bg-blue-50/40 border-blue-100/50' : 'border-transparent hover:bg-gray-50'}`}>
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="text-gray-400 group-hover:text-[#1E5A7A] transition-colors">
                                                {isSpaceExpanded ? <ChevronDown size={16} strokeWidth={2.5} /> : <ChevronRight size={16} strokeWidth={2.5} />}
                                            </div>
                                            <div className="w-8 h-8 rounded-lg bg-white shadow-sm border border-gray-100 text-[#1E5A7A] flex items-center justify-center shrink-0">
                                                <Layers size={14} strokeWidth={2.5} />
                                            </div>
                                            <span className="font-extrabold text-sm text-gray-700 group-hover:text-[#1E5A7A] transition-colors truncate">
                                                {space.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                                            <button onClick={(e) => { e.stopPropagation(); setSpaceForSettings(space); }} className="text-gray-400 hover:text-purple-600 p-1.5 rounded-md hover:bg-purple-50 transition-all" title="Space Settings"><Settings2 size={14} strokeWidth={2.5} /></button>
                                            <button onClick={(e) => { e.stopPropagation(); setSpaceIdForNewFolder(space.id); }} className="text-gray-400 hover:text-blue-600 p-1.5 rounded-md hover:bg-blue-50 transition-all" title="Add Folder"><FolderIcon size={14} strokeWidth={2.5} /></button>
                                            <button onClick={(e) => { e.stopPropagation(); setSpaceIdForNewProject(space.id); setFolderIdForNewProject(null); }} className="text-gray-400 hover:text-[#3A7C15] p-1.5 rounded-md hover:bg-green-50 transition-all" title="Add Project"><Plus size={16} strokeWidth={3} /></button>
                                            <button onClick={(e) => { e.stopPropagation(); setSpaceToDelete(space); }} className="text-gray-400 hover:text-[#B03052] p-1.5 rounded-md hover:bg-red-50 transition-all" title="Delete Space"><Trash2 size={14} strokeWidth={3} /></button>
                                        </div>
                                    </div>

                                    {/* 🌟 Animation Grid Wrapper for Folders and Projects */}
                                    <div className={`grid transition-all duration-300 ease-in-out ${isSpaceExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                        <div className="overflow-hidden">
                                            <div className="ml-6 pl-4 border-l-2 border-gray-100 mt-2 space-y-2 mb-4">
                                                {/* Folders */}
                                                {spaceFolders.map(folder => {
                                                    const isFolderExpanded = expandedFolders[folder.id];
                                                    const folderProjects = spaceProjects.filter(p => p.folder_id === folder.id);

                                                    return (
                                                        <div key={folder.id} className="mt-1">
                                                            <div onClick={(e) => toggleFolder(folder.id, e)} className="flex items-center justify-between px-2 py-2 rounded-lg cursor-pointer group hover:bg-gray-50 transition-colors">
                                                                <div className="flex items-center gap-2 overflow-hidden text-gray-500 group-hover:text-blue-600">
                                                                    {isFolderExpanded ? <ChevronDown size={14} strokeWidth={2.5} /> : <ChevronRight size={14} strokeWidth={2.5} />}
                                                                    <FolderIcon size={16} className={isFolderExpanded ? 'fill-blue-100 text-[#1E5A7A]' : 'opacity-40'} />
                                                                    <span className="font-bold text-xs truncate">{folder.name}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                                                                    <button onClick={(e) => { e.stopPropagation(); setSpaceIdForNewProject(space.id); setFolderIdForNewProject(folder.id); }} className="text-gray-400 hover:text-[#3A7C15] p-1 rounded-md hover:bg-green-50"><Plus size={14} strokeWidth={3} /></button>
                                                                    <button onClick={(e) => { e.stopPropagation(); setFolderToDelete(folder); }} className="text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50"><Trash2 size={14} strokeWidth={3} /></button>
                                                                </div>
                                                            </div>

                                                            {/* Folder Projects */}
                                                            <div className={`grid transition-all duration-300 ease-in-out ${isFolderExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                                                <div className="overflow-hidden">
                                                                    <div className="ml-5 mt-1 border-l-2 border-gray-100 pl-3 space-y-1">
                                                                        {folderProjects.length === 0 ? (
                                                                            <div className="text-[10px] text-gray-400 font-bold py-1">Empty folder</div>
                                                                        ) : (
                                                                            folderProjects.map(project => {
                                                                                const isActive = pathname === `/pmp/projects/${project.id}`;
                                                                                return (
                                                                                    <div key={project.id} className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all group ${isActive ? 'bg-[#1E5A7A]/10 text-[#1E5A7A]' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                                                                                        <Link href={`/pmp/projects/${project.id}`} className="flex items-center gap-2 flex-1 min-w-0">
                                                                                            <div className={`w-1.5 h-1.5 rounded-full transition-colors shrink-0 ${isActive ? 'bg-[#1E5A7A]' : 'bg-gray-300 group-hover:bg-[#1E5A7A]'}`}></div>
                                                                                            <span className="truncate">{project.name}</span>
                                                                                        </Link>
                                                                                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setProjectToDelete(project); }} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 rounded transition-colors shrink-0" title="Delete Project">
                                                                                            <Trash2 size={12} strokeWidth={3} />
                                                                                        </button>
                                                                                    </div>
                                                                                )
                                                                            })
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}

                                                {/* Standalone Projects */}
                                                {standaloneProjects.map(project => {
                                                    const isActive = pathname === `/pmp/projects/${project.id}`;
                                                    return (
                                                        <div key={project.id} className="mt-1">
                                                            <div className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all group ${isActive ? 'bg-[#1E5A7A]/10 text-[#1E5A7A]' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                                                                <Link href={`/pmp/projects/${project.id}`} className="flex items-center gap-2 flex-1 min-w-0">
                                                                    <div className={`w-1.5 h-1.5 rounded-full transition-colors shrink-0 ${isActive ? 'bg-[#1E5A7A]' : 'bg-gray-300 group-hover:bg-[#1E5A7A]'}`}></div>
                                                                    <span className="truncate">{project.name}</span>
                                                                </Link>
                                                                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setProjectToDelete(project); }} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-all shrink-0" title="Delete Project">
                                                                    <Trash2 size={14} strokeWidth={3} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </aside>
    );
}