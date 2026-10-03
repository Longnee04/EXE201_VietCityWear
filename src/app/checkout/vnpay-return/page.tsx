import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import VnpayReturnClient from "@/components/checkout/VnpayReturnClient";
import { Suspense } from "react";

export default function VnpayReturnPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center">Đang tải...</div>}>
          <VnpayReturnClient />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
