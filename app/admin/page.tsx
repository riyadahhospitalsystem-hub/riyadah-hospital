import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function AdminDashboard() {
  // جلب جميع المواعيد مع دمج (include) تفاصيل المريض، والطبيب، والقسم
  const appointments = await prisma.appointment.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      patient: true,
      doctor: {
        include: {
          department: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12 font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#007A7C] mb-2">لوحة تحكم المواعيد</h1>
            <p className="text-slate-500">مستشفى الريادة الدولي - إدارة الحجوزات</p>
          </div>
          <a href="/" className="bg-[#007A7C] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#006062] transition">
            زيارة الموقع
          </a>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-t-4 border-[#C21835]">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-slate-100 text-slate-600 font-bold">
                <tr>
                  <th className="p-4 border-b">الرقم</th>
                  <th className="p-4 border-b">اسم المريض</th>
                  <th className="p-4 border-b">رقم الهاتف</th>
                  <th className="p-4 border-b">القسم الطبي</th>
                  <th className="p-4 border-b">تاريخ الموعد</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500 font-bold">
                      لا توجد حجوزات حالياً.
                    </td>
                  </tr>
                ) : (
                  appointments.map((appointment, index) => (
                    <tr key={appointment.id} className="hover:bg-slate-50 transition border-b last:border-0">
                      <td className="p-4 text-slate-500 font-bold">{index + 1}</td>
                      <td className="p-4 font-bold text-[#007A7C]">{appointment.patient.fullName}</td>
                      <td className="p-4 text-slate-600" dir="ltr">{appointment.patient.phone}</td>
                      <td className="p-4 text-slate-600">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                          {appointment.doctor.department.name}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 font-bold">
                        {new Date(appointment.date).toLocaleDateString('ar-EG')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}