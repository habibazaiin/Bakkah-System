import { BASE_API_URL } from '@/constants/site';
import { ServiceContact } from '@/types/admin.types';

export const AdminContactService = {
    // 1. دالة للزوار (تُستخدم في صفحات الخدمات العامة ولا تحتاج تسجيل دخول)
    async getPublicContact(serviceName: string): Promise<ServiceContact> {
        try {
            // لاحظ إضافة السلاش في نهاية الرابط /public/contacts/
            const res = await fetch(`${BASE_API_URL}/public/contacts/`, { cache: 'no-store' });
            if (!res.ok) return this.getDefaultContact();
            const data: ServiceContact[] = await res.json();
            return data.find(c => c.service_name === serviceName) || this.getDefaultContact();
        } catch {
            return this.getDefaultContact();
        }
    },

    // 2. دالة لجلب البيانات للأدمن (تُستخدم في الداش بورد وتحتاج Token)
    async getAdminContacts(token: string): Promise<ServiceContact[]> {
        // لاحظ إضافة السلاش في نهاية الرابط /admin/contacts/
        const res = await fetch(`${BASE_API_URL}/admin/contacts/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch contacts');
        return res.json();
    },

    // 3. دالة لتحديث البيانات (تُستخدم في الداش بورد لحفظ التعديلات)
    async updateContact(token: string, payload: ServiceContact): Promise<ServiceContact> {
        // لاحظ إضافة السلاش في نهاية الرابط /admin/contacts/
        const res = await fetch(`${BASE_API_URL}/admin/contacts/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Failed to update contact');
        return res.json();
    },

    // 4. القيم الافتراضية في حالة فشل الاتصال بالباك إند
    getDefaultContact(): ServiceContact {
        return {
            service_name: '',
            email: 'tech@bakkah.com',
            phone: '+20 100 000 0000'
        };
    }
};