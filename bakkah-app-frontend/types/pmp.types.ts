export interface Folder {
    id: string;
    space_id: string;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface Space {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    owner_id: string;
    created_at: string;
    updated_at: string;
}

export interface Project {
    id: string;
    name: string;
    space_id: string;
    folder_id?: string | null;
    status: string;
    owner_id: string;
    statuses?: string[];
}

export interface Task {
    id: string;
    title: string;
    project_id: string;
    parent_task_id?: string | null;
    description?: string;
    status: string;
    priority: 'Low' | 'Medium' | 'High';
    start_date?: string;
    due_date?: string;
    assignee_id?: string;
    progress: number;
    created_at: string;
    updated_at?: string;
    subtasks?: Task[]; // لربط المهام الفرعية بالشاشة
}

export interface Comment {
    id: string;
    task_id: string;
    user_id: string;
    content: string;
    created_at: string;
}

export interface Attachment {
    id: string;
    task_id: string;
    user_id: string;
    file_name: string;
    file_url: string;
    file_size: number;
    created_at: string;
}

export interface Activity {
    id: string;
    task_id: string;
    user_id: string;
    action: string;
    details?: string | null;
    created_at: string;
}