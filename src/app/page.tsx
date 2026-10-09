import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import HeroSection from "@/components/home/HeroSection";
import CityCollections from "@/components/home/CityCollections";
import NewArrivals from "@/components/home/NewArrivals";
import ProductGrid from "@/components/home/ProductGrid";
import CampaignSection from "@/components/home/CampaignSection";
import LandmarkHighlights from "@/components/home/LandmarkHighlights";
import BrandStory from "@/components/home/BrandStory";
import BrandStatement from "@/components/home/BrandStatement";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CityCollections />
        <NewArrivals />
        <ProductGrid />
        <CampaignSection />
        <LandmarkHighlights />
        <BrandStory />
        <BrandStatement />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
