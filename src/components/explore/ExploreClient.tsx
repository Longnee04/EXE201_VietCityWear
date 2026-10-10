"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HANOI_GUIDE, type Landmark } from "@/data/landmarks";
import { BRAND_SLOGAN, BRAND_TAGLINE } from "@/data/brand";
import {
  Volume2,
  VolumeX,
  MapPin,
  Clock,
  Utensils,
  Share2,
  Sparkles,
  ShoppingBag,
  ArrowLeft,
  Check,
} from "lucide-react";

export default function ExploreClient() {
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const [activeLandmark, setActiveLandmark] = useState<Landmark>(
    HANOI_GUIDE.landmarks[0]
  );
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);

  const guide = HANOI_GUIDE;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111] flex flex-col font-sans">
      {/* Top Banner indicating NFC / QR connection */}
      <div className="bg-[#111] text-white py-2 px-4 text-center text-xs tracking-wider flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>
          {lang === "vi"
            ? "Trang trải nghiệm di sản số VIET CITY WEAR — Kết nối qua Thẻ QR & Móc khóa NFC"
            : "VIET CITY WEAR Digital Heritage Guide — Linked via QR Cards & NFC Tag"}
        </span>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#eaeaea]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#666] hover:text-[#111] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === "vi" ? "Trang chủ" : "Home"}</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold tracking-widest uppercase hidden sm:inline-block text-[#999]">
              {BRAND_TAGLINE}
            </span>

            {/* Language Switcher */}
            <div className="flex border border-[#eaeaea] rounded-sm overflow-hidden text-xs font-semibold">
              <button
                onClick={() => setLang("vi")}
                className={`px-3 py-1.5 transition-colors ${
                  lang === "vi"
                    ? "bg-[#111] text-white"
                    : "bg-white text-[#666] hover:bg-[#f5f5f5]"
                }`}
              >
                VI
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-3 py-1.5 transition-colors ${
                  lang === "en"
                    ? "bg-[#111] text-white"
                    : "bg-white text-[#666] hover:bg-[#f5f5f5]"
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner of City */}
      <section className="bg-[#111] text-white py-12 sm:py-16 border-b border-black">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white/80 rounded-full text-[11px] font-bold tracking-widest uppercase">
              HANOI HERITAGE COLLECTION • 5 ICONS
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight">
              {lang === "vi" ? guide.city_name_vi : guide.city_name_en}
            </h1>
            <p className="text-base sm:text-lg font-semibold text-white/80">
              {lang === "vi" ? guide.slogan_vi : guide.slogan_en}
            </p>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed pt-1">
              {lang === "vi" ? guide.description_vi : guide.description_en}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area: 5 Landmark Tabs and Details */}
      <main className="flex-1 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10 w-full">
        {/* Navigation Selector among 5 Landmarks */}
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#888] mb-3">
            {lang === "vi" ? "Chọn địa danh khám phá:" : "Select a landmark:"}
          </h2>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {guide.landmarks.map((lm) => (
              <button
                key={lm.id}
                onClick={() => {
                  setActiveLandmark(lm);
                  setIsPlayingAudio(false);
                }}
                className={`flex-shrink-0 px-4 py-3 rounded-sm border text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2.5 ${
                  activeLandmark.id === lm.id
                    ? "bg-[#111] text-white border-[#111] shadow-sm"
                    : "bg-white text-[#555] border-[#eaeaea] hover:border-[#999] hover:text-[#111]"
                }`}
              >
                <span className="opacity-60 text-[11px]">0{lm.order}</span>
                <span>{lang === "vi" ? lm.name_vi : lm.name_en}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Landmark Details Card */}
        <div className="bg-white border border-[#eaeaea] rounded-xl p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column (Images + Audio Player) (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#f5f5f5] border border-[#eaeaea]">
              <Image
                src={activeLandmark.image}
                alt={lang === "vi" ? activeLandmark.name_vi : activeLandmark.name_en}
                fill
                className="object-contain p-4"
                priority
              />
              <div className="absolute top-3 left-3 bg-[#111] text-white text-[10px] font-bold px-2.5 py-1 uppercase rounded-xs">
                Card 0{activeLandmark.order} / 05
              </div>
            </div>

            {/* Audio Narration Feature */}
            <div className="bg-[#fafafa] border border-[#eaeaea] p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-wider uppercase text-[#888] flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-[#111]" />
                  {lang === "vi" ? "Thuyết minh di sản" : "Audio Guide"}
                </span>
                <span className="text-xs text-[#888] font-mono">
                  {activeLandmark.duration}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isPlayingAudio
                      ? "bg-[#111] text-white shadow-md"
                      : "bg-white border border-[#ddd] text-[#111] hover:bg-[#111] hover:text-white"
                  }`}
                  aria-label="Play/Pause Audio"
                >
                  {isPlayingAudio ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#111] line-clamp-1">
                    {lang === "vi"
                      ? activeLandmark.audio_title_vi
                      : activeLandmark.audio_title_en}
                  </p>
                  <p className="text-[11px] text-[#777]">
                    {isPlayingAudio
                      ? (lang === "vi" ? "Đang phát giọng đọc chuẩn Hà Nội..." : "Playing audio guide...")
                      : (lang === "vi" ? "Nhấn để nghe thuyết minh" : "Tap to listen")}
                  </p>
                </div>
              </div>

              {/* Fake progress bar */}
              <div className="w-full bg-[#e5e5e5] h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-[#111] transition-all duration-1000 ${
                    isPlayingAudio ? "w-2/3" : "w-0"
                  }`}
                />
              </div>
            </div>

            {/* Practical Visiting Info */}
            <div className="space-y-3 pt-2 text-xs text-[#555]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#111] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#111]">
                    {lang === "vi" ? "Địa chỉ: " : "Address: "}
                  </span>
                  <span>{activeLandmark.address}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#111] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#111]">
                    {lang === "vi" ? "Thời điểm lý tưởng: " : "Best time: "}
                  </span>
                  <span>
                    {lang === "vi"
                      ? activeLandmark.best_time_vi
                      : activeLandmark.best_time_en}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Stories, Heritage, and Food (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#999] uppercase">
                {lang === "vi"
                  ? activeLandmark.highlight_vi
                  : activeLandmark.highlight_en}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111] uppercase tracking-tight mt-1">
                {lang === "vi"
                  ? activeLandmark.name_vi
                  : activeLandmark.name_en}
              </h2>
            </div>

            {/* Story */}
            <div className="space-y-2 text-xs sm:text-sm text-[#444] leading-relaxed border-t border-[#eaeaea] pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111]">
                {lang === "vi" ? "Câu chuyện di sản" : "Heritage Story"}
              </h3>
              <p>
                {lang === "vi"
                  ? activeLandmark.story_vi
                  : activeLandmark.story_en}
              </p>
            </div>

            {/* Historical background - Collapsible */}
            <details className="text-xs text-[#555] bg-[#fafafa] p-3.5 rounded-md border border-[#eaeaea] cursor-pointer group">
              <summary className="font-bold uppercase tracking-wider text-[#111] select-none flex items-center justify-between">
                <span>{lang === "vi" ? "Kiến trúc & Lịch sử chi tiết" : "Architecture & History Details"}</span>
                <span className="text-[#888] font-mono text-[10px] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-2 leading-relaxed pt-2 border-t border-[#eee]">
                {lang === "vi"
                  ? activeLandmark.history_vi
                  : activeLandmark.history_en}
              </p>
            </details>

            {/* Food recommendations */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111] flex items-center gap-2">
                <Utensils className="w-4 h-4" />
                <span>
                  {lang === "vi"
                    ? "Gợi ý ẩm thực trứ danh quanh đây"
                    : "Iconic Local Food Nearby"}
                </span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeLandmark.foods.map((food, fIdx) => (
                  <div
                    key={fIdx}
                    className="p-3.5 border border-[#eaeaea] rounded-md bg-white hover:border-[#111] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#111]">
                        {lang === "vi" ? food.name_vi : food.name_en}
                      </h4>
                      <span className="text-[10px] text-[#888] font-medium">
                        {food.distance}
                      </span>
                    </div>
                    <p className="text-xs text-[#555] mt-1 font-medium">
                      {lang === "vi" ? food.dish_vi : food.dish_en}
                    </p>
                    <p className="text-[11px] text-[#888] mt-1">
                      {food.address}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-6 border-t border-[#eaeaea] flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={handleShare}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 border border-[#ddd] text-xs font-semibold uppercase tracking-wider hover:border-[#111] transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{lang === "vi" ? "Đã sao chép link" : "Link Copied!"}</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>{lang === "vi" ? "Chia sẻ trang" : "Share Guide"}</span>
                  </>
                )}
              </button>

              <Link
                href="/#t-shirts"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 bg-[#111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#333] transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {lang === "vi"
                    ? "Mua mẫu áo Hà Nội"
                    : "Shop Hanoi T-Shirt"}
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Interactive Heritage Map Section */}
        <section className="mt-14 pt-12 border-t border-[#eaeaea]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111] text-white text-[10px] font-bold tracking-widest uppercase mb-2">
                <MapPin className="w-3.5 h-3.5" />
                {lang === "vi" ? "BẢN ĐỒ DI SẢN SỐ" : "INTERACTIVE HERITAGE MAP"}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#111] uppercase tracking-tight">
                {lang === "vi"
                  ? "Tọa độ 5 địa danh & điểm đến văn hóa Hà Nội"
                  : "Coordinates of 5 Hanoi Heritage Landmarks"}
              </h3>
            </div>
            <span className="text-[11px] font-mono text-[#777]">
              HÀ NỘI — 21.0285°N, 105.8542°E
            </span>
          </div>

          <div className="relative w-full aspect-[16/9] max-h-[440px] border border-[#eaeaea] overflow-hidden bg-[#fafafa]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14896.793616641558!2d105.84310574999999!3d21.028779699999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9bd3861111%3A0x2a92e10697e88775!2zSOG7kyBIb8OgbiBLaeG6v20!5e0!3m2!1svi!2svn!4v1710000000000!5m2!1svi!2svn"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bản đồ di sản Hà Nội"
              className="w-full h-full min-h-[350px]"
            />
          </div>
        </section>

        {/* 1-Day Travel Itinerary Timeline Section */}
        <section className="mt-14 pt-12 border-t border-[#eaeaea]">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111] text-white text-[10px] font-bold tracking-widest uppercase mb-2">
              {lang === "vi" ? "TIMELINE DI CHUYỂN" : "RECOMMENDED ITINERARY"}
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#111] uppercase tracking-tight">
              {lang === "vi"
                ? "Lịch trình 1 ngày chạm trọn 5 địa danh Hà Nội"
                : "1-Day Travel Timeline Across 5 Hanoi Icons"}
            </h3>
            <p className="text-xs sm:text-sm text-[#666] mt-1">
              {lang === "vi"
                ? "Gợi ý lộ trình di chuyển tối ưu giúp bạn khám phá đầy đủ 5 địa danh xuất hiện trên áo và thưởng thức ẩm thực chuẩn vị."
                : "Optimized route schedule designed to guide your journey through all 5 icons featured on the tee."}
            </p>
          </div>

          <div className="relative border-l-2 border-[#111] ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-8">
            {/* Stop 1 */}
            <div className="relative">
              <span className="absolute -left-[31px] sm:-left-[39px] top-0 w-4 h-4 rounded-full bg-[#111] ring-4 ring-white" />
              <div className="bg-white border border-[#eaeaea] p-4 sm:p-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#888]">
                  06:00 – 07:30
                </span>
                <h4 className="text-sm sm:text-base font-bold text-[#111] mt-0.5">
                  {lang === "vi"
                    ? "Lăng Bác – Lễ Thượng cờ & Ăn sáng Bánh cuốn"
                    : "Ba Dinh Square – Flag Raising & Breakfast"}
                </h4>
                <p className="text-xs text-[#555] mt-1 leading-relaxed">
                  {lang === "vi"
                    ? "Dự lễ thượng cờ 06:00 tại Quảng trường Ba Đình, ăn sáng bánh cuốn nóng Đội Cấn."
                    : "Flag raising ceremony at 06:00 at Ba Dinh Square, followed by hot steamed rice rolls on Doi Can."}
                </p>
              </div>
            </div>

            {/* Stop 2 */}
            <div className="relative">
              <span className="absolute -left-[31px] sm:-left-[39px] top-0 w-4 h-4 rounded-full bg-[#111] ring-4 ring-white" />
              <div className="bg-white border border-[#eaeaea] p-4 sm:p-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#888]">
                  08:30 – 11:00
                </span>
                <h4 className="text-sm sm:text-base font-bold text-[#111] mt-0.5">
                  {lang === "vi"
                    ? "Văn Miếu – Quốc Tử Giám & Bún chả Sinh Từ"
                    : "Temple of Literature & Bun Cha Lunch"}
                </h4>
                <p className="text-xs text-[#555] mt-1 leading-relaxed">
                  {lang === "vi"
                    ? "Chiêm ngưỡng Khuê Văn Các và 82 bia tiến sĩ; ăn trưa bún chả gia truyền Nguyễn Khuyến."
                    : "Visit Khue Van Pavilion and 82 stone stele; enjoy Bun Cha lunch on Nguyen Khuyen."}
                </p>
              </div>
            </div>

            {/* Stop 3 */}
            <div className="relative">
              <span className="absolute -left-[31px] sm:-left-[39px] top-0 w-4 h-4 rounded-full bg-[#111] ring-4 ring-white" />
              <div className="bg-white border border-[#eaeaea] p-4 sm:p-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#888]">
                  13:30 – 16:00
                </span>
                <h4 className="text-sm sm:text-base font-bold text-[#111] mt-0.5">
                  {lang === "vi"
                    ? "Lạc bước 36 Phố Phường & Phở Bát Đàn"
                    : "Old Quarter 36 Streets & Heritage Pho"}
                </h4>
                <p className="text-xs text-[#555] mt-1 leading-relaxed">
                  {lang === "vi"
                    ? "Khám phá các phố nghề thủ công cổ và thưởng thức phở bò gia truyền 49 Bát Đàn."
                    : "Walk ancient craft streets and enjoy beef pho at 49 Bat Dan."}
                </p>
              </div>
            </div>

            {/* Stop 4 */}
            <div className="relative">
              <span className="absolute -left-[31px] sm:-left-[39px] top-0 w-4 h-4 rounded-full bg-[#111] ring-4 ring-white" />
              <div className="bg-white border border-[#eaeaea] p-4 sm:p-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#888]">
                  16:30 – 18:00
                </span>
                <h4 className="text-sm sm:text-base font-bold text-[#111] mt-0.5">
                  {lang === "vi"
                    ? "Nhà Thờ Lớn – Chuông chiều & Trà chanh vỉa hè"
                    : "St. Joseph's Cathedral – Twilight Chimes & Lemon Tea"}
                </h4>
                <p className="text-xs text-[#555] mt-1 leading-relaxed">
                  {lang === "vi"
                    ? "Ngắm kiến trúc Gothic cổ kính và trải nghiệm trà chanh vỉa hè phố Nhà Chung."
                    : "Admire Gothic architecture and relax with street lemon tea on Nha Chung."}
                </p>
              </div>
            </div>

            {/* Stop 5 */}
            <div className="relative">
              <span className="absolute -left-[31px] sm:-left-[39px] top-0 w-4 h-4 rounded-full bg-[#111] ring-4 ring-white" />
              <div className="bg-white border border-[#eaeaea] p-4 sm:p-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#888]">
                  18:30 – 21:30
                </span>
                <h4 className="text-sm sm:text-base font-bold text-[#111] mt-0.5">
                  {lang === "vi"
                    ? "Hồ Hoàn Kiếm – Tháp Rùa lên đèn, Kem Tràng Tiền & Cà phê Đinh"
                    : "Hoan Kiem Lake – Night Lights, Trang Tien Ice Cream & Egg Coffee"}
                </h4>
                <p className="text-xs text-[#555] mt-1 leading-relaxed">
                  {lang === "vi"
                    ? "Dạo quanh hồ ngắm Tháp Rùa lên đèn; thưởng thức kem Tràng Tiền và cà phê trứng phố Đinh."
                    : "Evening walk around illuminated Hoan Kiem Lake, enjoy Trang Tien ice cream and egg coffee."}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#eaeaea] py-8 text-center text-xs text-[#888]">
        <p className="font-semibold text-[#111]">
          {BRAND_SLOGAN.vi} · {BRAND_SLOGAN.en}
        </p>
        <p className="text-[11px] mt-1">
          {BRAND_TAGLINE}
        </p>
      </footer>
    </div>
  );
}
