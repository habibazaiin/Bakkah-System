from app.core.database import supabase# 👈 عدلي المسار ده زي ملف الـ comments عندك
from fastapi import HTTPException, UploadFile
import uuid
from app.services.activity_service import ActivityService

class AttachmentService:
    @staticmethod
    async def upload_attachment(task_id: str, user_id: str, file: UploadFile):
        try:
            # 1. قراءة الملف
            file_bytes = await file.read()
            
            # 2. عمل اسم فريد للملف عشان لو ملفين بنفس الاسم ميمسحوش بعض
            file_ext = file.filename.split(".")[-1]
            unique_filename = f"{task_id}/{uuid.uuid4()}.{file_ext}"
            
            # 3. الرفع لـ Supabase Storage
            res = supabase.storage.from_("task_attachments").upload(
                path=unique_filename,
                file=file_bytes,
                file_options={"content-type": file.content_type}
            )
            
            # 4. الحصول على الرابط العام (Public URL)
            file_url = supabase.storage.from_("task_attachments").get_public_url(unique_filename)
            
            # 5. حفظ البيانات في الداتابيز
            data = {
                "task_id": task_id,
                "user_id": user_id,
                "file_name": file.filename,
                "file_url": file_url,
                "file_size": len(file_bytes)
            }
            db_res = supabase.table("task_attachments").insert(data).execute()
            ActivityService.log_activity(task_id, user_id, "uploaded a file", file.filename)
            return db_res.data[0] if db_res.data else None
            
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def get_task_attachments(task_id: str):
        try:
            response = supabase.table("task_attachments").select("*").eq("task_id", task_id).order("created_at", desc=False).execute()
            return response.data
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))


    @staticmethod
    def delete_attachment(attachment_id: str, user_id: str):
        try:
            # 1. جلب بيانات المرفق عشان نجيب الرابط بتاعه واسم الملف
            res = supabase.table("task_attachments").select("*").eq("id", attachment_id).execute()
            if not res.data:
                raise HTTPException(status_code=404, detail="Attachment not found")
            
            attachment = res.data[0]
            task_id = attachment["task_id"]
            file_name = attachment["file_name"]
            file_url = attachment["file_url"]

            # 2. استخراج مسار الملف من الرابط عشان نحذفه من الـ Storage
            # الرابط بيكون فيه /task_attachments/ مسار_الملف
            file_path = file_url.split("/task_attachments/")[-1]

            # 3. حذف الملف من Supabase Storage
            supabase.storage.from_("task_attachments").remove([file_path])

            # 4. حذف السجل من الداتابيز
            supabase.table("task_attachments").delete().eq("id", attachment_id).execute()

            # 5. تسجيل النشاط (Activity Log)
            ActivityService.log_activity(task_id, user_id, "deleted a file", file_name)

            return {"message": "Attachment deleted successfully"}
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))