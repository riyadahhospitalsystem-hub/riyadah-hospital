"use server";

import { PrismaClient } from "@prisma/client";

// طريقة آمنة لتهيئة Prisma في Next.js لتجنب مشاكل التكرار
const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

export async function createBooking(formData: FormData) {
  try {
    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;
    const department = formData.get("department") as string;
    const date = formData.get("date") as string;

    if (!fullName || !phone || !department || !date) {
      return { success: false, message: "يرجى تعبئة جميع الحقول المطلوبة." };
    }

    let patient = await prisma.patient.findUnique({
      where: { phone: phone },
    });

    if (!patient) {
      patient = await prisma.patient.create({
        data: { fullName, phone },
      });
    }

    let dept = await prisma.department.findFirst({ where: { name: department } });
    if (!dept) {
      dept = await prisma.department.create({
        data: { name: department, description: "قسم تم إنشاؤه آلياً" },
      });
    }

    let doctor = await prisma.doctor.findFirst({ where: { departmentId: dept.id } });
    if (!doctor) {
      doctor = await prisma.doctor.create({
        data: { name: "طبيب مناوب", specialty: department, departmentId: dept.id },
      });
    }

    await prisma.appointment.create({
      data: {
        date: new Date(date),
        time: "10:00 AM",
        patientId: patient.id,
        doctorId: doctor.id,
      },
    });

    return { success: true, message: "تم تأكيد حجزك بنجاح! تم حفظ البيانات في الخزنة." };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, message: "حدث خطأ أثناء الحفظ. يرجى المحاولة مرة أخرى." };
  }
}