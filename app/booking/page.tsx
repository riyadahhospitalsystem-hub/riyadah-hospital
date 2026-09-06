import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const appointments = await prisma.appointment.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 p-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#007A7C] mb-6">لوحة تحكم المشرف - مستشفى الريادة</h1>
        
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
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-800">{appointment.fullName}</td>
                    <td className="p-4" dir="ltr">{appointment.phone}</td>
                    <td className="p-4">{appointment.department}</td>
                    <td className="p-4">{appointment.date}</td>
                    <td className="p-4">{new Date(appointment.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}