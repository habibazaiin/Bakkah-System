import smtplib
from email.mime.text import MIMEText
import os

# الأفضل تحطي دول في ملف الـ .env بتاع الباك إند
SMTP_EMAIL = os.getenv("SMTP_EMAIL", "salma.ali@bakkah-systems.com") 
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "lgjt juxv dhol sgks")

def send_real_email(to_email: str, subject: str, html_body: str):
    if not SMTP_EMAIL or not SMTP_PASSWORD:
        print("Email credentials not set. Skipping real email.")
        return

    msg = MIMEText(html_body, 'html')
    msg['Subject'] = subject
    msg['From'] = f"Bakkah PMP <{SMTP_EMAIL}>"
    msg['To'] = to_email

    try:
        # الاتصال بسيرفر جوجل
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.sendmail(SMTP_EMAIL, to_email, msg.as_string())
        print(f"Email sent successfully to {to_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")