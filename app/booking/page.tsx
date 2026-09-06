"use client";

import React, { useState, useRef } from "react";
import { createBooking } from "./actions";

export default function BookingPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);
  
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const form = event.currentTarget; 
    const formData = new FormData(form);

    // --- بداية قواعد التحقق الصارم (Validation) ---
    const phone = formData.get("phone") as string;
    const date = formData.get("date") as string;

    // 1. التحقق من رقم الهاتف (9 أرقام ويبدأ بـ 7)
    const phoneRegex = /^7[0-9]{8}$/;
    if (!phoneRegex.test(phone)) {
      setMessage({ text: "رقم الهاتف غير صحيح. يجب أن يتكون من 9 أرقام ويبدأ بالرقم 7.", isError: true });
      setLoading(false);
      return; // إيقاف العملية وعدم الإرسال لقاعدة البيانات
    }

    // 2. التحقق من التاريخ (يجب أن يكون تاريخاً مستقبلياً أو اليوم)
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // تصفير الوقت لمقارنة الأيام فقط

    if (selectedDate < today) {
      setMessage({ text: "لا يمكنك حجز موعد في تاريخ ماضي. يرجى اختيار تاريخ صحيح.", isError: true });
      setLoading(false);
      return;
    }
    // --- نهاية قواعد التحقق ---

    const result = await createBooking(formData);

    setMessage({ text: result.message, isError: !result.success });
    setLoading(false);

    if (result.success) {
      formRef.current?.reset(); 
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 font-sans" dir="rtl">
      <div className="max-w-3xl mx-auto px-4">
        
        <div className="mb-6">
          <a href="/" className="text-[#007A7C] hover:text-[#C21835] font-bold text-sm flex items-center gap-2 transition">
            → العودة للرئيسية
          </a>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border-t-4 border-[#007A7C]">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-black text-[#007A7C] mb-2">حجز موعد طبي</h1>
            <p className="text-slate-500 text-sm md:text-base">الرجاء تعبئة البيانات لتأكيد حجزك في مستشفى الريادة</p>
          </div>
          
          {message && (
            <div className={`p-4 rounded-xl mb-6 font-bold text-center ${message.isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
              {message.text}
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">الاسم الرباعي <span className="text-red-500">*</span></label>
                <input type="text" name="fullName" required minLength={5} placeholder="اكتب اسمك الكامل" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#007A7C]" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">رقم الهاتف <span className="text-red-500">*</span></label>
                <input type="tel" name="phone" required placeholder="مثال: 770751111" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#007A7C]" dir="ltr" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">القسم الطبي <span className="text-red-500">*</span></label>
                <select name="department" required className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#007A7C] bg-white">
                  <option value="">اختر القسم...</option>
                  <option value="مركز الجلدية والتجميل">مركز الجلدية والتجميل</option>
                  <option value="مركز القلب والقسطرة">مركز القلب والقسطرة</option>
                  <option value="جراحة الإحليل والمسالك">جراحة الإحليل والمسالك</option>
                  <option value="قسم الأطفال والحضانات">قسم الأطفال والحضانات</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">تاريخ الموعد المفضل <span className="text-red-500">*</span></label>
                <input type="date" name="date" required className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#007A7C]" />
              </div>
            </div>

            <div className="pt-4 mt-8 border-t border-slate-100">
              <button disabled={loading} type="submit" className="w-full bg-[#C21835] hover:bg-red-800 disabled:bg-gray-400 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition transform hover:-translate-y-1">
                {loading ? "جاري الإرسال والقيد..." : "تأكيد طلب الحجز"}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}