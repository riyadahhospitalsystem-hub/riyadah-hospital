import { supabase } from "@/lib/supabase";

// لضمان جلب أحدث الحجوزات مباشرة بدون تخزين مؤقت
export const revalidate = 0;

export default async function AdminDashboard() {
  // جلب الحجوزات من جدول appointments في Supabase مرتبة تنازلياً
  const { data: appointments, error } = await supabase
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-slate-50 p-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#007A7C] mb-6">لوحة تحكم المشرف - مستشفى الريادة</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
            حدث خطأ أثناء جلب البيانات: {error.message}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-800">قائمة الحجوزات الطبية</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-sm">
                  <th className="p-4">اسم المريض</th>
                  <th className="p-4">رقم الهاتف</th>
                  <th className="p-4">القسم الطبي</th>
                  <th className="p-4">تاريخ الموعد</th>
                  <th className="p-4">تاريخ الطلب</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                {appointments?.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-800">{appointment.fullName}</td>
                    <td className="p-4" dir="ltr">{appointment.phone}</td>
                    <td className="p-4">{appointment.department}</td>
                    <td className="p-4">{appointment.date}</td>
                    <td className="p-4">{new Date(appointment.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {(!appointments || appointments.length === 0) && (
              <div className="text-center py-10 text-slate-500">
                لا توجد حجوزات سحبت من قاعدة البيانات حالياً.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}