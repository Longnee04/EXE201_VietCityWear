import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CheckoutClient from "@/components/checkout/CheckoutClient";

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <CheckoutClient />
      </main>
      <Footer />
    </>
  );
}
