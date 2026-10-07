import { supabase } from '@/lib/supabase';
import { SignUpFormData, VerifyOtpData } from '@/types/auth.types';

export const AuthService = {
    // 1. دالة إرسال الـ Sign Up
    async signUp(data: SignUpFormData) {
        const { email, password, username, phone, role } = data;

        const { data: authData, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username, phone, role },
            },
        });

        if (error) throw new Error(error.message);

        // الخدعة هنا: لو Supabase عمل نجاح وهمي (اليوزر موجود أصلاً)
        if (authData.user && authData.user.identities && authData.user.identities.length === 0) {
            throw new Error('This email is already registered. Please sign in instead.');
        }

        return authData;
    },

    // 2. دالة التأكيد بالـ OTP
    async verifyOtpAndSaveProfile(data: VerifyOtpData) {
        const { email, token } = data;

        const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'signup',
        });

        if (verifyError) {
            if (verifyError.message.includes('Token has expired or is invalid')) {
                throw new Error('Invalid or expired code. Please try again.');
            }
            throw new Error(verifyError.message);
        }

        if (!verifyData.user) throw new Error('Verification failed.');

        return verifyData.user;
    },

    // 3. دالة إعادة إرسال الكود
    async resendOtp(email: string) {
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email,
        });

        if (error) throw new Error(error.message);
    },

    // 4. دالة تسجيل الدخول (Sign In)
    async signIn(data: any) {
        const { email, password } = data;

        const { data: authData, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            if (error.message.includes('Invalid login credentials')) {
                throw new Error('Invalid email or password. Please try again.');
            }
            if (error.message.includes('Email not confirmed')) {
                throw new Error('Please verify your email address first.');
            }
            throw new Error(error.message);
        }

        return authData.user;
    },

    // 5. تسجيل الخروج (Sign Out) - تم إضافتها هنا
    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw new Error(error.message);
    },

    // 6. إرسال كود الـ OTP لنسيان كلمة المرور
    async resetPasswordForEmail(email: string) {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw new Error(error.message);
    },

    // 7. التحقق من كود الـ OTP المبعوث لإعادة التعيين
    async verifyRecoveryOtp(email: string, token: string) {
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'recovery',
        });
        if (error) throw new Error(error.message);
        return data;
    },

    // 8. تحديث كلمة المرور الجديدة
    async updateUserPassword(password: string) {
        const { data, error } = await supabase.auth.updateUser({
            password: password,
        });
        if (error) throw new Error(error.message);
        return data;
    },

    // 9. إعادة إرسال كود الـ OTP لنسيان كلمة المرور
    async resendRecoveryOtp(email: string) {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw new Error(error.message);
    },

    // 10. تسجيل الدخول باستخدام حساب جوجل
    async signInWithGoogle() {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                // التوجيه للصفحة الرئيسية، والناف بار هيتعامل بذكاء مع اليوزر
                redirectTo: `${window.location.origin}/`, 
            },
        });

        if (error) throw new Error(error.message);
        return data;
    },
};