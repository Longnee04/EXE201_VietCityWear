import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import ProductsSection from "@/components/home/ProductsSection";
import NFCExperienceSection from "@/components/home/NFCExperienceSection";
import CitiesSection from "@/components/home/CitiesSection";
import PassportSection from "@/components/home/PassportSection";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ProductsSection />
        <NFCExperienceSection />
        <CitiesSection />
        <PassportSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
