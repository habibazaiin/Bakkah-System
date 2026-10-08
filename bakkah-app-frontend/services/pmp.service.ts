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
    },

    // حذف مهمة
    async deleteTask(taskId: string) {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/tasks/${taskId}`, { method: 'DELETE', headers });
        if (!response.ok) throw new Error('Failed to delete task');
        return response.json();
    },

    // مسح مساحة العمل (Space)
    async deleteSpace(spaceId: string) {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/spaces/${spaceId}`, { method: 'DELETE', headers });
        if (!response.ok) throw new Error('Failed to delete space');
        return response.json();
    },

    // تحديث المشروع (زي إضافة حالات جديدة)
    async updateProject(projectId: string, data: any) {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/projects/${projectId}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update project');
        return response.json();
    },

    // جلب تعليقات المهمة
    async getTaskComments(taskId: string) {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/comments/${taskId}`, { headers });
        if (!response.ok) throw new Error('Failed to fetch comments');
        return response.json();
    },

    // إضافة تعليق جديد
    async addComment(taskId: string, content: string) {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/comments/`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ task_id: taskId, content })
        });
        if (!response.ok) throw new Error('Failed to add comment');
        return response.json();
    },

    // جلب المرفقات
    async getTaskAttachments(taskId: string) {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/attachments/${taskId}`, { headers });
        if (!response.ok) throw new Error('Failed to fetch attachments');
        return response.json();
    },

    // رفع ملف جديد
    // رفع ملف جديد
    async uploadAttachment(taskId: string, file: File) {
        // بنجيب الهيدرز بالطريقة المعتمدة في المشروع كله
        const headers = await this.getHeaders() as Record<string, string>;

        // بنحذف الـ Content-Type عشان المتصفح يظبطه لوحده (Boundary) للملفات
        delete headers['Content-Type'];

        const formData = new FormData();
        formData.append('task_id', taskId);
        formData.append('file', file);

        const response = await fetch(`${API_URL}/attachments/`, {
            method: 'POST',
            headers, // كده ضامنين إن التوكن موجود 100%
            body: formData
        });

        if (!response.ok) throw new Error('Failed to upload file');
        return response.json();
    },

    // جلب سجل النشاطات
    async getTaskActivities(taskId: string) {
        const headers = await this.getHeaders();
        const response = await fetch(`${API_URL}/activities/${taskId}`, { headers });
        if (!response.ok) throw new Error('Failed to fetch activities');
        return response.json();
    }
};