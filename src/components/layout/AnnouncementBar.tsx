import { BRAND_SLOGAN, BRAND_TAGLINE } from "@/data/brand";

export default function AnnouncementBar() {
  return (
    <div className="bg-[#111] text-white text-center py-2.5 px-4">
      <p className="text-[11px] sm:text-xs tracking-wide font-medium">
        FREE SHIPPING cho đơn từ 500K&nbsp;&nbsp;·&nbsp;&nbsp;{BRAND_SLOGAN.vi}&nbsp;&nbsp;·&nbsp;&nbsp;{BRAND_TAGLINE}
      </p>
    </div>
  );
}
