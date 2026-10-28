import { BASE_API_URL } from '@/constants/site';

export interface FurnitureItem {
    id?: string;
    title: string;
    description: string;
    image_url: string;
}

export const FurnitureService = {
    async getPublicItems(): Promise<FurnitureItem[]> {
        try {
            const res = await fetch(`${BASE_API_URL}/public/furniture/`, { cache: 'no-store' });
            if (!res.ok) return [];
            return res.json();
        } catch {
            return [];
        }
    },
    async addItem(token: string, payload: FurnitureItem): Promise<FurnitureItem> {
        const res = await fetch(`${BASE_API_URL}/admin/furniture/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Failed to add item');
        return res.json();
    },

    async deleteItem(token: string, id: string): Promise<void> {
        const res = await fetch(`${BASE_API_URL}/admin/furniture/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to delete item');
    },

    async updateItem(token: string, id: string, payload: FurnitureItem): Promise<FurnitureItem> {
        const res = await fetch(`${BASE_API_URL}/admin/furniture/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (!res.ok) {
            const errorDetails = await res.text();
            throw new Error(`Backend Error: ${errorDetails}`);
        }
        return res.json();
    }
};