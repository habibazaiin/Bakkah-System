// src/services/pmp.service.ts
import { supabase } from '@/lib/supabase';

const API_URL = 'http://127.0.0.1:8000/api/pmp';

export const PmpService = {
    async getHeaders() {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("No active session");
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
        };
    },

    async getSpaces() {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/spaces/`, { method: 'GET', headers });
        if (!response.ok) throw new Error('Failed to fetch spaces');
        return response.json();
    },

    // الدالة الجديدة لإنشاء Space
    async createSpace(data: { name: string; description?: string }) {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/spaces/`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create space');
        return response.json();
    },

    // جلب كل المشاريع
    async getProjects() {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/projects/`, { method: 'GET', headers });
        if (!response.ok) throw new Error('Failed to fetch projects');
        return response.json();
    },

    // إنشاء مشروع جديد
    async createProject(data: { name: string; space_id: string; description?: string }) {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/projects/`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create project');
        return response.json();
    },
    // جلب مهام مشروع معين
    async getTasks(projectId: string) {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/tasks/${projectId}`, { method: 'GET', headers });
        if (!response.ok) throw new Error('Failed to fetch tasks');
        return response.json();
    },

    // إنشاء مهمة جديدة
    async createTask(data: { title: string; project_id: string; status?: string; priority?: string }) {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/tasks/`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create task');
        return response.json();
    },

    // تحديث المهمة
    async updateTask(taskId: string, data: any) {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update task');
        return response.json();
    }
};