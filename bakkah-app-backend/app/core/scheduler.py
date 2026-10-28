from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
from app.core.database import supabase
from app.modules.pmp.services.email_service import send_real_email  # استيراد خدمة الإيميل بتاعتك
import asyncio
import inspect

def check_approaching_deadlines():
    print("⏳ Scanning for tasks approaching deadlines...")

    # تحديد الوقت (بنجيب التاسكات اللي هتخلص خلال 24 ساعة من دلوقتي)
    tomorrow = (datetime.utcnow() + timedelta(days=1)).isoformat()
    now = datetime.utcnow().isoformat()

    try:
        # 1. جلب المهام اللي قربت تخلص ولسه مش Done
        res = supabase.table("tasks").select("id, title, assignee_id, due_date").neq("status", "Done").gte("due_date", now).lte("due_date", tomorrow).execute()
        tasks = res.data

        if not tasks:
            print("✅ No tasks with approaching deadlines right now.")
            return

        for task in tasks:
            assignee_id = task.get("assignee_id")
            if not assignee_id:
                continue

            # 2. جلب إيميل واسم المستخدم من جدول البروفايل
            user_res = supabase.table("profiles").select("email, username").eq("id", assignee_id).execute()
            if not user_res.data:
                continue

            user_data = user_res.data[0]
            user_email = user_data.get("email")
            user_name = user_data.get("username") or "Team Member"

            # 3. إرسال إشعار داخلي في الويب سايت (Notification)
            notif_data = {
                "user_id": assignee_id,
                "title": "Task Deadline Approaching! ⏰",
                "message": f"Your task '{task['title']}' is due soon. Please wrap it up!",
                "is_read": False
            }
            supabase.table("notifications").insert(notif_data).execute()

            # 4. تجهيز وإرسال الإيميل الحقيقي
            if user_email:
                subject = f"Action Required: Deadline Approaching for '{task['title']}' ⏰"
                
                # قالب HTML شيك جداً للإيميل بألوان البروجيكت
                html_body = f"""
                <div style="font-family: Arial, sans-serif; color: #1F2937; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
                    <div style="background-color: #1E5A7A; padding: 20px; text-align: center;">
                        <h2 style="color: #ffffff; margin: 0;">Task Deadline Alert</h2>
                    </div>
                    <div style="padding: 20px;">
                        <p style="font-size: 16px;">Hello <b>{user_name}</b>,</p>
                        <p style="font-size: 16px; color: #4B5563;">This is a friendly reminder that your task is due within the next 24 hours.</p>
                        <div style="background-color: #F8FAFC; padding: 15px; border-left: 4px solid #B03052; border-radius: 4px; margin: 20px 0;">
                            <h3 style="margin: 0 0 5px 0; color: #1E5A7A;">{task['title']}</h3>
                            <p style="margin: 0; font-size: 14px; color: #6B7280;">Due Date: {task['due_date'][:10]}</p>
                        </div>
                        <p style="font-size: 14px; color: #6B7280;">Please ensure to update the task status in your dashboard once completed.</p>
                        <br>
                        <div style="text-align: center;">
                            <a href="http://localhost:3000/pmp/my-tasks" style="display: inline-block; padding: 12px 24px; background-color: #1E5A7A; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold;">View My Tasks</a>
                        </div>
                    </div>
                    <div style="background-color: #F9FAFB; padding: 15px; text-align: center; font-size: 12px; color: #9CA3AF; border-top: 1px solid #e5e7eb;">
                        This is an automated message from Bakkah PMP.<br>Please do not reply to this email.
                    </div>
                </div>
                """
                
                # تنفيذ الإرسال (عشان نتجنب أي إيرور لو دالة الإيميل بتاعتك async أو العكس)
                try:
                    if inspect.iscoroutinefunction(send_real_email):
                        asyncio.run(send_real_email(user_email, subject, html_body))
                    else:
                        send_real_email(user_email, subject, html_body)
                    print(f"📧 Deadline email sent successfully to {user_email}")
                except Exception as email_err:
                    print(f"❌ Failed to send deadline email to {user_email}: {email_err}")

    except Exception as e:
        print(f"❌ Error checking deadlines: {e}")

# تهيئة الـ Scheduler
scheduler = BackgroundScheduler()

# 💡 المنبه حالياً مظبوط يشتغل كل يوم الساعة 9 الصبح
# لو عايزة تجربيه دلوقتي فوراً عشان تتأكدي إن الإيميل بيوصل، اعملي كومنت للسطر اللي تحت ده:
scheduler.add_job(check_approaching_deadlines, 'cron', hour=9)

# 💡 وفعلي السطر ده (هيخلي السيستم يراجع التاسكات ويبعت كل دقيقة):
# scheduler.add_job(check_approaching_deadlines, 'interval', minutes=1)