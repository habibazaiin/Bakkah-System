'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { PmpService } from '@/services/pmp.service';
import CreateSpaceModal from '@/components/pmp/sidebar/CreateSpaceModal';
import CreateProjectModal from '@/components/pmp/sidebar/CreateProjectModal';
import CreateFolderModal from '@/components/pmp/sidebar/CreateFolderModal';
import SpaceSettingsModal from '@/components/pmp/SpaceSettings/SpaceSettingsModal';
import { Search, Loader2, Trash2, Folder as FolderIcon, CheckSquare, X } from 'lucide-react';
import { Space, Project, Folder, Task } from '@/types/pmp.types';

import PrimarySidebar from '@/components/pmp/sidebar/PrimarySidebar';
import WorkspaceSidebar from '@/components/pmp/sidebar/WorkspaceSidebar';

export default function PmpLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    const [spaces, setSpaces] = useState<Space[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [folders, setFolders] = useState<Folder[]>([]);
    // 🌟 إضافة state للتاسكات عشان البحث 🌟
    const [allTasks, setAllTasks] = useState<Task[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(false);

    const [expandedSpaces, setExpandedSpaces] = useState<Record<string, boolean>>({});
    const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

    const [isCreateSpaceModalOpen, setIsCreateSpaceModalOpen] = useState(false);
    const [spaceIdForNewProject, setSpaceIdForNewProject] = useState<string | null>(null);
    const [folderIdForNewProject, setFolderIdForNewProject] = useState<string | null>(null);
    const [spaceIdForNewFolder, setSpaceIdForNewFolder] = useState<string | null>(null);
    const [spaceForSettings, setSpaceForSettings] = useState<Space | null>(null);

    const [spaceToDelete, setSpaceToDelete] = useState<Space | null>(null);
    const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // 🌟 States الخاصة بالبحث 🌟
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const router = useRouter();
    const pathname = usePathname();

    const fetchData = async () => {
        setIsLoadingData(true);
        try {
            const [fetchedSpaces, fetchedProjects] = await Promise.all([
                PmpService.getSpaces(),
                PmpService.getProjects()
            ]);

            const foldersPromises = fetchedSpaces.map(s => PmpService.getFolders(s.id).catch(() => []));
            const foldersArrays = await Promise.all(foldersPromises);
            const fetchedFolders = foldersArrays.flat();

            // 🌟 جلب كل المهام للبحث 🌟
            const { data: fetchedTasks } = await supabase.from('tasks').select('*');

            setSpaces(fetchedSpaces);
            setProjects(fetchedProjects);
            setFolders(fetchedFolders);
            if (fetchedTasks) setAllTasks(fetchedTasks);

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

    useEffect(() => {
        const channel = supabase
            .channel('sidebar-realtime-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'spaces' }, () => fetchData())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'folders' }, () => fetchData())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => fetchData())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => fetchData()) // تحديث مهام البحث
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    // 🌟 إغلاق قائمة البحث عند الضغط خارجها 🌟
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
        } finally { setIsDeleting(false); }
    };

    const handleDeleteFolder = async () => {
        if (!folderToDelete) return;
        setIsDeleting(true);
        try {
            await PmpService.deleteFolder(folderToDelete.id);
            setFolderToDelete(null);
            fetchData();
        } finally { setIsDeleting(false); }
    };

    const handleDeleteProject = async () => {
        if (!projectToDelete) return;
        setIsDeleting(true);
        try {
            await PmpService.deleteProject(projectToDelete.id);
            setProjectToDelete(null);
            fetchData();
            if (pathname === `/pmp/projects/${projectToDelete.id}`) router.push('/pmp');
        } finally { setIsDeleting(false); }
    };

    // 🌟 لوجيك الفلترة للبحث 🌟
    const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredTasks = allTasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));

    if (isAuthLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#F8FAFC]">
                <div className="flex flex-col items-center gap-4 animate-fade-in-up">
                    <Loader2 className="w-10 h-10 text-[#1E5A7A] animate-spin" strokeWidth={2.5} />
                </div>
            </div>
        );
    }

    // 🌟 حساب اسم الهيدر أو الـ Workspace الديناميكي 🌟
    let headerTitle = 'Workspace';
    if (pathname === '/pmp') {
        headerTitle = 'Overview';
    } else if (pathname === '/pmp/my-tasks') {
        headerTitle = 'My Tasks';
    } else if (pathname.includes('/pmp/projects/')) {
        const currentProjectId = pathname.split('/').pop();
        const currentProject = projects.find(p => p.id === currentProjectId);
        if (currentProject) {
            const currentSpace = spaces.find(s => s.id === currentProject.space_id);
            if (currentSpace) {
                headerTitle = currentSpace.name;
            }
        }
    }

    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans text-[#1F2937] selection:bg-[#1E5A7A] selection:text-white">

            <PrimarySidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                pathname={pathname}
            />

            <WorkspaceSidebar
                isSidebarOpen={isSidebarOpen}
                spaces={spaces}
                projects={projects}
                folders={folders}
                isLoadingData={isLoadingData}
                expandedSpaces={expandedSpaces}
                expandedFolders={expandedFolders}
                toggleSpace={toggleSpace}
                toggleFolder={toggleFolder}
                pathname={pathname}
                setIsCreateSpaceModalOpen={setIsCreateSpaceModalOpen}
                setSpaceForSettings={setSpaceForSettings}
                setSpaceIdForNewFolder={setSpaceIdForNewFolder}
                setSpaceIdForNewProject={setSpaceIdForNewProject}
                setFolderIdForNewProject={setFolderIdForNewProject}
                setSpaceToDelete={setSpaceToDelete}
                setFolderToDelete={setFolderToDelete}
                setProjectToDelete={setProjectToDelete}
                refreshData={fetchData}
            />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[#F8FAFC]">
                <header className="h-20 bg-white/60 backdrop-blur-xl border-b border-gray-200 flex items-center justify-between px-8 shrink-0 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-extrabold text-[#1F2937] tracking-tight">
                            {headerTitle}
                        </h1>
                    </div>
                    <div className="flex items-center gap-5 relative">

                        {/* 🌟 Global Search Bar 🌟 */}
                        <div className="relative group" ref={searchRef}>
                            <Search className={`absolute left-3.5 top-2.5 transition-colors ${isSearchOpen ? 'text-[#1E5A7A]' : 'text-gray-400 group-focus-within:text-[#1E5A7A]'}`} size={18} />

                            <input
                                type="text"
                                placeholder="Search projects, tasks..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setIsSearchOpen(true);
                                }}
                                onFocus={() => setIsSearchOpen(true)}
                                className={`bg-white border text-sm rounded-full pl-10 pr-10 py-2 focus:outline-none transition-all shadow-sm ${isSearchOpen ? 'border-[#1E5A7A] ring-4 ring-[#1E5A7A]/10 w-80' : 'border-gray-200 w-64'}`}
                            />

                            {searchQuery && (
                                <button onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }} className="absolute right-3.5 top-2.5 text-gray-400 hover:text-red-500 transition-colors">
                                    <X size={16} />
                                </button>
                            )}

                            {/* 🌟 Search Results Dropdown 🌟 */}
                            {isSearchOpen && searchQuery.length > 0 && (
                                <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50 max-h-[400px] overflow-y-auto animate-fade-in-up">
                                    {filteredProjects.length === 0 && filteredTasks.length === 0 ? (
                                        <div className="p-6 text-center text-sm text-gray-500 font-medium">No results found for "{searchQuery}"</div>
                                    ) : (
                                        <div className="py-2">
                                            {/* Projects Section */}
                                            {filteredProjects.length > 0 && (
                                                <div className="mb-2">
                                                    <div className="px-4 py-1.5 text-[10px] font-black text-gray-400 uppercase tracking-wider bg-gray-50/50">Projects</div>
                                                    {filteredProjects.map(p => (
                                                        <button
                                                            key={p.id}
                                                            onClick={() => { router.push(`/pmp/projects/${p.id}`); setIsSearchOpen(false); setSearchQuery(''); }}
                                                            className="w-full text-left px-4 py-2.5 hover:bg-[#1E5A7A]/5 flex items-center gap-3 transition-colors group"
                                                        >
                                                            <div className="w-8 h-8 rounded-lg bg-[#1E5A7A]/10 flex items-center justify-center text-[#1E5A7A] group-hover:bg-[#1E5A7A] group-hover:text-white transition-colors">
                                                                <FolderIcon size={14} strokeWidth={2.5} />
                                                            </div>
                                                            <span className="text-sm font-bold text-[#1F2937] truncate">{p.name}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Tasks Section */}
                                            {filteredTasks.length > 0 && (
                                                <div>
                                                    <div className="px-4 py-1.5 text-[10px] font-black text-gray-400 uppercase tracking-wider bg-gray-50/50">Tasks</div>
                                                    {filteredTasks.map(t => {
                                                        const parentProject = projects.find(p => p.id === t.project_id);
                                                        return (
                                                            <button
                                                                key={t.id}
                                                                onClick={() => { if (t.project_id) router.push(`/pmp/projects/${t.project_id}`); setIsSearchOpen(false); setSearchQuery(''); }}
                                                                className="w-full text-left px-4 py-2.5 hover:bg-[#1E5A7A]/5 flex items-start gap-3 transition-colors group"
                                                            >
                                                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 mt-0.5 group-hover:bg-[#1E5A7A]/10 group-hover:text-[#1E5A7A] transition-colors shrink-0">
                                                                    <CheckSquare size={14} strokeWidth={2.5} />
                                                                </div>
                                                                <div className="overflow-hidden">
                                                                    <div className="text-sm font-bold text-[#1F2937] truncate">{t.title}</div>
                                                                    {parentProject && <div className="text-[11px] font-medium text-gray-500 truncate mt-0.5">in {parentProject.name}</div>}
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>
                </header>
                <div className="flex-1 overflow-auto p-8 scroll-smooth">
                    {children}
                </div>
            </main>

            {/* Modals - شغالة زي ما هي بدون أي تغيير */}
            <CreateSpaceModal isOpen={isCreateSpaceModalOpen} onClose={() => setIsCreateSpaceModalOpen(false)} onSpaceCreated={fetchData} />
            <CreateFolderModal isOpen={!!spaceIdForNewFolder} onClose={() => setSpaceIdForNewFolder(null)} spaceId={spaceIdForNewFolder || ''} onFolderCreated={fetchData} />
            <CreateProjectModal isOpen={!!spaceIdForNewProject} onClose={() => { setSpaceIdForNewProject(null); setFolderIdForNewProject(null); }} spaceId={spaceIdForNewProject || ''} folderId={folderIdForNewProject} onProjectCreated={fetchData} />
            <SpaceSettingsModal isOpen={!!spaceForSettings} onClose={() => setSpaceForSettings(null)} space={spaceForSettings} />

            {/* Delete Project Confirm */}
            {projectToDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-[#1F2937]/40 backdrop-blur-sm transition-opacity" onClick={() => setProjectToDelete(null)} />
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-fade-in-up z-10 text-center">
                        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-red-100"><Trash2 size={32} strokeWidth={2.5} /></div>
                        <h2 className="text-2xl font-black text-[#1F2937] mb-3">Delete Project?</h2>
                        <p className="text-sm text-gray-500 font-medium mb-8 leading-relaxed">Are you sure you want to delete project <strong className="text-[#1F2937] px-1">{projectToDelete.name}</strong>?<br />All tasks inside it will be permanently lost.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setProjectToDelete(null)} disabled={isDeleting} className="flex-1 px-5 py-3.5 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors border border-gray-200">Cancel</button>
                            <button onClick={handleDeleteProject} disabled={isDeleting} className="flex-1 px-5 py-3.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-md flex items-center justify-center gap-2">
                                {isDeleting ? <Loader2 size={18} className="animate-spin" /> : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Space Confirm */}
            {spaceToDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
        </div>
    );
}