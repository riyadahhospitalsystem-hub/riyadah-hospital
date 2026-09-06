import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-6">
      
      {/* قسم النصوص بالهوية الجديدة */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-teal-700 mb-2">
          مستشفى الريادة الدولي
        </h1>
        <p className="text-xl text-slate-600 font-semibold tracking-wide">
          ملتزمــــــــون بالــــــريادة
        </p>
        <p className="text-md text-red-600 font-medium pt-2">
          رعاية متكاملة ... دقة وأمان
        </p>
      </div>
      
      {/* تم تغليف الزر بمكون Link ليعمل بشكل صحيح وسريع */}
      <Link href="/booking">
        <Button size="lg" className="mt-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-lg px-10 py-6 rounded-full shadow-lg transition-all hover:scale-105 cursor-pointer">
          احجز موعدك الآن
        </Button>
      </Link>

    </div>
  );
}