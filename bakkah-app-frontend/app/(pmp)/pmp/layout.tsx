'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { PmpService } from '@/services/pmp.service';
import CreateSpaceModal from '@/components/pmp/CreateSpaceModal';
import CreateProjectModal from '@/components/pmp/CreateProjectModal';
import CreateFolderModal from '@/components/pmp/CreateFolderModal'; // 👈 استيراد مودال الفولدر
import { LayoutDashboard, FolderKanban, Bell, Settings, Plus, Search, Layers, Loader2, ChevronRight, ChevronDown, Trash2, Folder as FolderIcon, Briefcase } from 'lucide-react';
import { Space, Project, Folder } from '@/types/pmp.types';
import SpaceSettingsModal from '@/components/pmp/SpaceSettingsModal';
import { Settings2 } from 'lucide-react'; // ضيفي الأيقونة دي مع الـ lucide-react imports
import NotificationsPopover from '@/components/pmp/NotificationsPopover';

export default function PmpLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    // Data States
    const [spaces, setSpaces] = useState<Space[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [folders, setFolders] = useState<Folder[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [spaceForSettings, setSpaceForSettings] = useState<Space | null>(null);

    // Expansion States
    const [expandedSpaces, setExpandedSpaces] = useState<Record<string, boolean>>({});
    const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

    // Modals States
    const [isCreateSpaceModalOpen, setIsCreateSpaceModalOpen] = useState(false);
    const [spaceIdForNewProject, setSpaceIdForNewProject] = useState<string | null>(null);
    const [folderIdForNewProject, setFolderIdForNewProject] = useState<string | null>(null);
    const [spaceIdForNewFolder, setSpaceIdForNewFolder] = useState<string | null>(null);

    // Delete States
    const [spaceToDelete, setSpaceToDelete] = useState<Space | null>(null);
    const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const router = useRouter();
    const pathname = usePathname();

    const fetchData = async () => {
        setIsLoadingData(true);
        try {
            const [fetchedSpaces, fetchedProjects] = await Promise.all([
                PmpService.getSpaces(),
                PmpService.getProjects()
            ]);

            // جلب كل الفولدرات لكل الـ spaces
            const foldersPromises = fetchedSpaces.map(s => PmpService.getFolders(s.id).catch(() => []));
            const foldersArrays = await Promise.all(foldersPromises);
            const fetchedFolders = foldersArrays.flat();

            setSpaces(fetchedSpaces);
            setProjects(fetchedProjects);
            setFolders(fetchedFolders);

            if (fetchedSpaces.length > 0 && Object.keys(expandedSpaces).length === 0) {
                setExpandedSpaces({ [fetchedSpaces[0].id]: true });
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoadingData(false);
        }
    };

    useEffect(() => {
        const checkAuthAndFetchData = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/signin?redirect=/pmp');
            } else {
                setIsAuthLoading(false);
                fetchData();
            }
        };
        checkAuthAndFetchData();
    }, [router]);

    const toggleSpace = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedSpaces(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleFolder = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedFolders(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleDeleteSpace = async () => {
        if (!spaceToDelete) return;
        setIsDeleting(true);
        try {
            await PmpService.deleteSpace(spaceToDelete.id);
            setSpaceToDelete(null);
            fetchData();
            router.push('/pmp');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteFolder = async () => {
        if (!folderToDelete) return;
        setIsDeleting(true);
        try {
            await PmpService.deleteFolder(folderToDelete.id);
            setFolderToDelete(null);
            fetchData();
        } finally {
            setIsDeleting(false);
        }
    };

    if (isAuthLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#F8FAFC]">
                <div className="flex flex-col items-center gap-4 animate-fade-in-up">
                    <Loader2 className="w-10 h-10 text-[#1E5A7A] animate-spin" strokeWidth={2.5} />
                    <p className="text-[#1E5A7A] font-bold text-sm tracking-widest uppercase">Authenticating...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans text-[#1F2937] selection:bg-[#1E5A7A] selection:text-white">

            {/* Primary Sidebar */}
            <aside className="w-20 bg-[#12394D] flex flex-col items-center py-6 border-r border-[#1E5A7A]/30 shrink-0 z-20 shadow-2xl relative">
                <Link href="/" className="mb-8 transform transition-transform hover:scale-110" title="Company Home">
                    <Image src="/logo.png" alt="Bakkah" width={36} height={36} className="object-contain" />
                </Link>

                <nav className="flex flex-col gap-4 w-full items-center mt-4">
                    <Link href="/pmp" className={`p-3 rounded-2xl shadow-sm transition-all duration-300 ${pathname === '/pmp' ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`} title="Dashboard">
                        <LayoutDashboard size={22} strokeWidth={2} />
                    </Link>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-3 rounded-2xl transition-all duration-300 ${isSidebarOpen ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`} title="Workspaces">
                        <FolderKanban size={22} strokeWidth={2} />
                    </button>
                    <NotificationsPopover />
                </nav>

                <div className="mt-auto flex flex-col gap-4 w-full items-center mb-2">
                    <button className="p-3 text-white/50 hover:bg-white/5 hover:text-white rounded-2xl transition-all duration-300" title="Settings">
                        <Settings size={22} strokeWidth={2} />
                    </button>
                    <div className="w-10 h-10 mt-2 bg-gradient-to-tr from-[#B03052] to-[#8C233E] rounded-full flex items-center justify-center font-bold text-white shadow-lg border-2 border-white/10 cursor-pointer transform transition-transform hover:scale-105 text-sm">
                        US
                    </div>
                </div>
            </aside>

            {/* Secondary Sidebar - Workspaces & Projects */}
            <aside className={`bg-white border-r border-gray-200 flex flex-col shrink-0 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full opacity-0 overflow-hidden'}`}>
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-sm font-black text-[#1E5A7A] uppercase tracking-wider">Workspaces</h2>
                    <button onClick={() => setIsCreateSpaceModalOpen(true)} className="text-gray-400 hover:text-[#B03052] hover:bg-red-50 p-1.5 rounded-lg transition-colors" title="New Space">
                        <Plus size={18} strokeWidth={3} />
                    </button>
                </div>

                <div className="p-4 flex-1 overflow-y-auto">
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
                                const standaloneProjects = spaceProjects.filter(p => !p.folder_id); // مشاريع ملهاش فولدر

                                return (
                                    <div key={space.id} className="animate-fade-in-up">
                                        {/* Space Header */}
                                        <div onClick={(e) => toggleSpace(space.id, e)} className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer group transition-all border ${isSpaceExpanded ? 'bg-[#F8FAFC] border-gray-100' : 'border-transparent hover:bg-gray-50'}`}>
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="text-gray-400 group-hover:text-[#1E5A7A] transition-colors">
                                                    {isSpaceExpanded ? <ChevronDown size={16} strokeWidth={2.5} /> : <ChevronRight size={16} strokeWidth={2.5} />}
                                                </div>
                                                <div className="w-7 h-7 rounded-lg bg-white shadow-sm border border-gray-100 text-[#1E5A7A] flex items-center justify-center shrink-0">
                                                    <Layers size={14} strokeWidth={2.5} />
                                                </div>
                                                <span className="font-bold text-sm text-gray-700 group-hover:text-[#1E5A7A] transition-colors truncate">
                                                    {space.name}
                                                </span>
                                            </div>
                                            {/* Space Actions */}
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                                                <button onClick={(e) => { e.stopPropagation(); setSpaceForSettings(space); }} className="text-gray-400 hover:text-purple-600 p-1.5 rounded-md hover:bg-purple-50 transition-all" title="Space Settings"><Settings2 size={16} strokeWidth={2.5} /></button>
                                                <button onClick={(e) => { e.stopPropagation(); setSpaceIdForNewFolder(space.id); }} className="text-gray-400 hover:text-blue-600 p-1.5 rounded-md hover:bg-blue-50 transition-all" title="Add Folder"><FolderIcon size={14} strokeWidth={2.5} /></button>
                                                <button onClick={(e) => { e.stopPropagation(); setSpaceIdForNewProject(space.id); setFolderIdForNewProject(null); }} className="text-gray-400 hover:text-[#3A7C15] p-1.5 rounded-md hover:bg-green-50 transition-all" title="Add Project"><Plus size={16} strokeWidth={3} /></button>
                                                <button onClick={(e) => { e.stopPropagation(); setSpaceToDelete(space); }} className="text-gray-400 hover:text-[#B03052] p-1.5 rounded-md hover:bg-red-50 transition-all" title="Delete Space"><Trash2 size={16} strokeWidth={3} /></button>
                                            </div>
                                        </div>

                                        {isSpaceExpanded && (
                                            <div className="ml-5 pl-4 border-l border-gray-200 mt-2 space-y-2">

                                                {/* 1. Folders Render */}
                                                {spaceFolders.map(folder => {
                                                    const isFolderExpanded = expandedFolders[folder.id];
                                                    const folderProjects = spaceProjects.filter(p => p.folder_id === folder.id);

                                                    return (
                                                        <div key={folder.id} className="mt-1">
                                                            <div onClick={(e) => toggleFolder(folder.id, e)} className="flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer group hover:bg-gray-50 transition-colors">
                                                                <div className="flex items-center gap-2 overflow-hidden text-gray-600 group-hover:text-blue-600">
                                                                    {isFolderExpanded ? <ChevronDown size={14} strokeWidth={2.5} /> : <ChevronRight size={14} strokeWidth={2.5} />}
                                                                    <FolderIcon size={14} className="fill-current opacity-20" />
                                                                    <span className="font-bold text-xs truncate">{folder.name}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                                                                    <button onClick={(e) => { e.stopPropagation(); setSpaceIdForNewProject(space.id); setFolderIdForNewProject(folder.id); }} className="text-gray-400 hover:text-[#3A7C15] p-1 rounded-md hover:bg-green-50" title="Add Project to Folder"><Plus size={14} strokeWidth={3} /></button>
                                                                    <button onClick={(e) => { e.stopPropagation(); setFolderToDelete(folder); }} className="text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50" title="Delete Folder"><Trash2 size={14} strokeWidth={3} /></button>
                                                                </div>
                                                            </div>

                                                            {/* Folder Projects */}
                                                            {isFolderExpanded && (
                                                                <div className="ml-5 mt-1 border-l border-gray-100 pl-3 space-y-1">
                                                                    {folderProjects.length === 0 ? (
                                                                        <div className="text-[10px] text-gray-400 font-bold py-1">Empty folder</div>
                                                                    ) : (
                                                                        folderProjects.map(project => {
                                                                            const isActive = pathname === `/pmp/projects/${project.id}`;
                                                                            return (
                                                                                <Link key={project.id} href={`/pmp/projects/${project.id}`} className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-bold transition-all group ${isActive ? 'bg-[#1E5A7A]/10 text-[#1E5A7A]' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}>
                                                                                    <div className={`w-1.5 h-1.5 rounded-full transition-colors ${isActive ? 'bg-[#B03052]' : 'bg-gray-300 group-hover:bg-[#1E5A7A]'}`}></div>
                                                                                    <span className="truncate">{project.name}</span>
                                                                                </Link>
                                                                            )
                                                                        })
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                })}

                                                {/* 2. Standalone Projects Render */}
                                                {standaloneProjects.map(project => {
                                                    const isActive = pathname === `/pmp/projects/${project.id}`;
                                                    return (
                                                        <Link key={project.id} href={`/pmp/projects/${project.id}`} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-bold transition-all group ${isActive ? 'bg-[#1E5A7A]/10 text-[#1E5A7A]' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}>
                                                            <div className={`w-1.5 h-1.5 rounded-full transition-colors ${isActive ? 'bg-[#B03052]' : 'bg-gray-300 group-hover:bg-[#1E5A7A]'}`}></div>
                                                            <span className="truncate">{project.name}</span>
                                                        </Link>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[#F8FAFC]">
                <header className="h-20 bg-white/60 backdrop-blur-xl border-b border-gray-200 flex items-center justify-between px-8 shrink-0 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-extrabold text-[#1F2937] tracking-tight">Overview</h1>
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="relative group">
                            <Search className="absolute left-3.5 top-2.5 text-gray-400 group-focus-within:text-[#1E5A7A] transition-colors" size={18} />
                            <input type="text" placeholder="Search everything..." className="bg-white border border-gray-200 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:border-[#1E5A7A] focus:ring-4 focus:ring-[#1E5A7A]/10 transition-all w-64 shadow-sm" />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-8 scroll-smooth">
                    {children}
                </div>
            </main>

            {/* Modals */}
            <CreateSpaceModal isOpen={isCreateSpaceModalOpen} onClose={() => setIsCreateSpaceModalOpen(false)} onSpaceCreated={fetchData} />

            <CreateFolderModal
                isOpen={!!spaceIdForNewFolder}
                onClose={() => setSpaceIdForNewFolder(null)}
                spaceId={spaceIdForNewFolder || ''}
                onFolderCreated={fetchData}
            />

            <CreateProjectModal
                isOpen={!!spaceIdForNewProject}
                onClose={() => { setSpaceIdForNewProject(null); setFolderIdForNewProject(null); }}
                spaceId={spaceIdForNewProject || ''}
                folderId={folderIdForNewProject}
                onProjectCreated={fetchData}
            />

            {/* Delete Space Confirm */}
            {spaceToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-[#1F2937]/40 backdrop-blur-sm transition-opacity" onClick={() => setSpaceToDelete(null)} />
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-fade-in-up z-10 text-center">
                        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-red-100"><Trash2 size={32} strokeWidth={2.5} /></div>
                        <h2 className="text-2xl font-black text-[#1F2937] mb-3">Delete Workspace?</h2>
                        <p className="text-sm text-gray-500 font-medium mb-8 leading-relaxed">Are you sure you want to delete <strong className="text-[#1F2937] px-1">{spaceToDelete.name}</strong>?<br />All folders, projects, and tasks inside it will be permanently lost.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setSpaceToDelete(null)} disabled={isDeleting} className="flex-1 px-5 py-3.5 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors border border-gray-200">Cancel</button>
                            <button onClick={handleDeleteSpace} disabled={isDeleting} className="flex-1 px-5 py-3.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-md flex items-center justify-center gap-2">
                                {isDeleting ? <Loader2 size={18} className="animate-spin" /> : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Folder Confirm */}
            {folderToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-[#1F2937]/40 backdrop-blur-sm transition-opacity" onClick={() => setFolderToDelete(null)} />
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-fade-in-up z-10 text-center">
                        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-red-100"><Trash2 size={32} strokeWidth={2.5} /></div>
                        <h2 className="text-2xl font-black text-[#1F2937] mb-3">Delete Folder?</h2>
                        <p className="text-sm text-gray-500 font-medium mb-8 leading-relaxed">Are you sure you want to delete folder <strong className="text-[#1F2937] px-1">{folderToDelete.name}</strong>?<br />All projects inside it will be permanently lost.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setFolderToDelete(null)} disabled={isDeleting} className="flex-1 px-5 py-3.5 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors border border-gray-200">Cancel</button>
                            <button onClick={handleDeleteFolder} disabled={isDeleting} className="flex-1 px-5 py-3.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-md flex items-center justify-center gap-2">
                                {isDeleting ? <Loader2 size={18} className="animate-spin" /> : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <SpaceSettingsModal
                isOpen={!!spaceForSettings}
                onClose={() => setSpaceForSettings(null)}
                space={spaceForSettings}
            />
        </div>
    );
}