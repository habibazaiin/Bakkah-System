import { supabase } from '@/lib/supabase';
import { Space, Project, Task, Comment, Attachment, Activity, Folder, Invitation, SpaceMember, AppNotification } from '@/types/pmp.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/pmp';

export const PmpService = {
    async getHeaders(): Promise<Record<string, string>> {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("No active session");
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
        };
    },

    async getSpaces(): Promise<Space[]> {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/spaces/`, { method: 'GET', headers });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.detail || 'Failed to fetch spaces');
        }
        return response.json();
    },

    async createSpace(data: { name: string; description?: string }): Promise<Space> {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/spaces/`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create space');
        return response.json();
    },

    async getProjects(): Promise<Project[]> {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/projects/`, { method: 'GET', headers });
        if (!response.ok) throw new Error('Failed to fetch projects');
        return response.json();
    },

    async createProject(data: { name: string; space_id: string; folder_id?: string | null; description?: string }): Promise<Project> {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/projects/`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create project');
        return response.json();
    },

    async getTasks(projectId: string): Promise<Task[]> {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/tasks/${projectId}`, { method: 'GET', headers });
        if (!response.ok) throw new Error('Failed to fetch tasks');
        return response.json();
    },

    async createTask(data: { title: string; project_id: string; status?: string; priority?: string }): Promise<Task> {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/tasks/`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create task');
        return response.json();
    },

    async updateTask(taskId: string, data: Partial<Task>): Promise<Task> {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update task');
        return response.json();
    },

    async deleteTask(taskId: string): Promise<{ message: string }> {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/tasks/${taskId}`, { method: 'DELETE', headers });
        if (!response.ok) throw new Error('Failed to delete task');
        return response.json();
    },

    async deleteSpace(spaceId: string): Promise<{ message: string }> {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/spaces/${spaceId}`, { method: 'DELETE', headers });
        if (!response.ok) throw new Error('Failed to delete space');
        return response.json();
    },

    async updateProject(projectId: string, data: Partial<Project>): Promise<Project> {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/projects/${projectId}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update project');
        return response.json();
    },

    async deleteProject(projectId: string): Promise<{ message: string }> {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/projects/${projectId}`, { method: 'DELETE', headers });
        if (!response.ok) throw new Error('Failed to delete project');
        return response.json();
    },

    async getTaskComments(taskId: string): Promise<Comment[]> {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/comments/${taskId}`, { headers });
        if (!response.ok) throw new Error('Failed to fetch comments');
        return response.json();
    },

    async addComment(taskId: string, content: string): Promise<Comment> {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/comments/`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ task_id: taskId, content })
        });
        if (!response.ok) throw new Error('Failed to add comment');
        return response.json();
    },

    async getTaskAttachments(taskId: string): Promise<Attachment[]> {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/attachments/${taskId}`, { headers });
        if (!response.ok) throw new Error('Failed to fetch attachments');
        return response.json();
    },

    async uploadAttachment(taskId: string, file: File): Promise<Attachment> {
        const headers = await this.getHeaders();
        delete headers['Content-Type'];

        const formData = new FormData();
        formData.append('task_id', taskId);
        formData.append('file', file);

        const response = await fetch(`${API_URL}/attachments/`, {
            method: 'POST',
            headers,
            body: formData
        });

        if (!response.ok) throw new Error('Failed to upload file');
        return response.json();
    },

    async getTaskActivities(taskId: string): Promise<Activity[]> {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/activities/${taskId}`, { headers });
        if (!response.ok) throw new Error('Failed to fetch activities');
        return response.json();
    },

    async getFolders(spaceId: string): Promise<Folder[]> {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/folders/${spaceId}`, { headers });
        if (!response.ok) throw new Error('Failed to fetch folders');
        return response.json();
    },

    async createFolder(data: { name: string; space_id: string }): Promise<Folder> {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/folders/`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create folder');
        return response.json();
    },

    // حذف فولدر
    async deleteFolder(folderId: string): Promise<{ message: string }> {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/folders/${folderId}`, { method: 'DELETE', headers });
        if (!response.ok) throw new Error('Failed to delete folder');
        return response.json();
    },

    // إنشاء Subtask
    async createSubtask(data: { title: string; project_id: string; parent_task_id: string; status?: string; priority?: string }): Promise<Task> {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/tasks/`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create subtask');
        return response.json();
    },

    // --- Members & Invitations ---
    async getSpaceMembers(spaceId: string): Promise<any[]> {
        const headers = await this.getHeaders();
        // 🌟 التعديل هنا: غيرنا المسار عشان يكلم الـ API اللي بيجيب الأونر والأسماء
        const response = await fetch(`${API_URL}/members/workspace-users/${spaceId}`, { method: 'GET', headers });

        if (!response.ok) throw new Error('Failed to fetch space members');
        return response.json();
    },

    async addSpaceMember(data: { space_id: string; user_id: string; role: string }): Promise<SpaceMember> {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/members/`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to add member');
        return response.json();
    },

    async inviteUser(data: { space_id: string; email: string; role: string }): Promise<Invitation> {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/members/invite`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail || 'Failed to send invitation');
        }
        return response.json();
    },

    async getSpaceInvitations(spaceId: string): Promise<Invitation[]> {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/members/invite/${spaceId}`, { headers });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.detail || 'Failed to fetch invitations');
        }
        return response.json();
    },

    // ضيفي دي جوه PmpService
    async respondToInvitation(tokenId: string, action: 'accept' | 'decline'): Promise<any> {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/members/invitations/${tokenId}/respond`, {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ action })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to respond to invitation');
        }
        return response.json();
    },

    async getNotifications(): Promise<AppNotification[]> {
        try {
            const headers = await this.getHeaders();
            const response = await fetch(`${API_URL}/members/notifications/all`, { headers });
            if (!response.ok) return [];
            return await response.json();
        } catch (error) {
            console.error("Notifications fetch error:", error);
            return []; // إرجاع مصفوفة فارغة بدل ضرب الإيرور
        }
    },

    async markNotificationsRead(): Promise<void> {
        const headers = await this.getHeaders();
        await fetch(`${API_URL}/members/notifications/read`, { method: 'PATCH', headers });
    },

    async getWorkspaceUsers(spaceId: string): Promise<any[]> {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/members/workspace-users/${spaceId}`, { headers });
        if (!response.ok) return [];
        return response.json();
    },

    async updateMemberRole(spaceId: string, userId: string, role: string): Promise<any> {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/members/${spaceId}/${userId}/role`, {
            method: 'PATCH',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ role })
        });
        if (!response.ok) throw new Error('Failed to update role');
        return response.json();
    },

    async removeMember(spaceId: string, userId: string): Promise<any> {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/members/${spaceId}/${userId}`, {
            method: 'DELETE',
            headers
        });
        if (!response.ok) throw new Error('Failed to remove member');
        return response.json();
    },

    // === Teams Management ===
    async getSpaceTeams(spaceId: string): Promise<any[]> {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/teams/${spaceId}`, { headers });
        if (!response.ok) throw new Error('Failed to fetch teams');
        return response.json();
    },

    async createTeam(data: { space_id: string, name: string, description: string }): Promise<any> {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/teams/`, {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to create team');
        }
        return response.json();
    },

    async deleteTeam(spaceId: string, teamId: string): Promise<any> {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/teams/${spaceId}/${teamId}`, { method: 'DELETE', headers });
        if (!response.ok) throw new Error('Failed to delete team');
        return response.json();
    },

    async addTeamMember(spaceId: string, teamId: string, userId: string): Promise<any> {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/teams/${spaceId}/${teamId}/members`, {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to add member to team');
        }
        return response.json();
    },

    async removeTeamMember(spaceId: string, teamId: string, userId: string): Promise<any> {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/teams/${spaceId}/${teamId}/members/${userId}`, { method: 'DELETE', headers });
        if (!response.ok) throw new Error('Failed to remove member from team');
        return response.json();
    },

    async getMyTasks(): Promise<any[]> {
        const headers = await this.getHeaders();
        // هنكلم الـ endpoint الجديد اللي بيجيب مهامي
        const response = await fetch(`${API_URL}/tasks/my-tasks`, { method: 'GET', headers });
        if (!response.ok) throw new Error('Failed to fetch my tasks');
        return response.json();
    }
};