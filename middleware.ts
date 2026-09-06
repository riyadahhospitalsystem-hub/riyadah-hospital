import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // تطبيق الحماية فقط على مسار لوحة التحكم
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const basicAuth = req.headers.get('authorization');
    
    // اسم المستخدم وكلمة المرور المشفرة (admin: Alryadah2024)
    // التشفير بـ base64 للكلمة "admin:Alryadah2024" هو "YWRtaW46QWxyeWFkYWgyMDI0"
    const validCredentials = `Basic YWRtaW46QWxyeWFkYWgyMDI0`;

    if (basicAuth !== validCredentials) {
      // إذا لم يقم بإدخال بيانات أو أدخل بيانات خاطئة، اطلب منه تسجيل الدخول
      return new NextResponse('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
      });
    }
  }

  // السماح بالمرور لباقي صفحات الموقع (مثل صفحة الحجز الرئيسية)
  return NextResponse.next();
}

// تحديد المسارات التي سيعمل عليها هذا الوسيط
export const config = {
  matcher: ['/admin/:path*'],
};