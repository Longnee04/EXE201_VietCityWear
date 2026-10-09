export interface LandmarkFood {
  name_vi: string;
  name_en: string;
  dish_vi: string;
  dish_en: string;
  address: string;
  distance: string;
}

export interface Landmark {
  id: string;
  slug: string;
  name_vi: string;
  name_en: string;
  order: number;
  highlight_vi: string;
  highlight_en: string;
  story_vi: string;
  story_en: string;
  history_vi: string;
  history_en: string;
  address: string;
  best_time_vi: string;
  best_time_en: string;
  image: string;
  audio_title_vi: string;
  audio_title_en: string;
  duration: string;
  foods: LandmarkFood[];
}

export interface CityGuide {
  city_name_vi: string;
  city_name_en: string;
  slogan_vi: string;
  slogan_en: string;
  description_vi: string;
  description_en: string;
  cover_image: string;
  landmarks: Landmark[];
}

export const HANOI_GUIDE: CityGuide = {
  city_name_vi: "Hà Nội",
  city_name_en: "Hanoi",
  slogan_vi: "Nghìn năm văn hiến – Hồn cốt Thăng Long",
  slogan_en: "A thousand years of heritage – Soul of Thang Long",
  description_vi: "Thủ đô của những con phố rêu phong, của tiếng chuông nhà thờ hòa cùng tiếng rao sớm và hương hoa sữa nồng nàn. Hãy cùng chạm vào từng câu chuyện di sản được khắc họa trên chiếc áo bạn đang mặc.",
  description_en: "The capital of moss-covered streets, where church bells blend with early morning vendors and the scent of milk flowers. Tap into each heritage story woven into the shirt you wear.",
  cover_image: "/images/hanoi-story-cards.png",
  landmarks: [
    {
      id: "lm-01",
      slug: "ho-guom-thap-rua",
      name_vi: "Hồ Gươm – Tháp Rùa",
      name_en: "Hoan Kiem Lake – Turtle Tower",
      order: 1,
      highlight_vi: "Trái tim thủ đô & Huyền tích vua Lê Lợi",
      highlight_en: "Heart of the Capital & Legend of the Returned Sword",
      story_vi: "Hồ Gươm không chỉ là thắng cảnh trung tâm, mà là biểu tượng tinh thần thiêng liêng gắn liền với huyền tích vua Lê Lợi trả gươm báu Thuận Thiên cho Rùa Vàng thế kỷ 15 sau khi đánh tan giặc Minh. Đứng bên rặng liễu rủ bóng Tháp Rùa sớm mai, bạn sẽ cảm nhận trọn vẹn sự tĩnh lặng đầy chất thơ giữa lòng phố thị.",
      story_en: "Hoan Kiem Lake is not just a scenic landmark, but the spiritual heart of Hanoi. Legend tells of 15th-century Emperor Le Loi returning the magical sword Thuan Thien to the Golden Turtle after liberating the country. Standing by the weeping willows facing Turtle Tower at dawn, one feels the timeless poetic calm amidst bustling city life.",
      history_vi: "Khởi nguồn từ đầm nước cổ hồ Lục Thủy, nơi đây từng là quân cảng luyện thủy binh nhà Trần. Quần thể quanh hồ bao gồm Tháp Bút, Đài Nghiên, cầu Thê Húc son đỏ và đền Ngọc Sơn tạo nên một chỉnh thể văn hóa Nho - Phật - Đạo độc đáo.",
      history_en: "Originally part of Luc Thuy lake where Tran Dynasty naval forces trained. The surrounding complex includes Pen Tower, Ink Slab, scarlet The Huc Bridge, and Ngoc Son Temple, forming a unique harmonious ensemble of Vietnamese philosophy.",
      address: "Hàng Trống, Hoàn Kiếm, Hà Nội",
      best_time_vi: "05:30 – 07:00 sáng (ngắm người dân tập dưỡng sinh) hoặc 17:30 chiều tà",
      best_time_en: "05:30 – 07:00 AM (local morning exercises) or 17:30 at sunset",
      image: "/images/landmarks/ho-guom.jpg",
      audio_title_vi: "Huyền tích Gươm Thần và buổi sớm bên Hồ",
      audio_title_en: "Legend of the Magic Sword & Morning at the Lake",
      duration: "03:45",
      foods: [
        {
          name_vi: "Kem Tràng Tiền",
          name_en: "Trang Tien Ice Cream",
          dish_vi: "Kem que đậu xanh & ốc quế cốm",
          dish_en: "Green bean ice cream & young rice cone",
          address: "35 Tràng Tiền, Hoàn Kiếm",
          distance: "Cách 200m",
        },
        {
          name_vi: "Cà phê Đinh",
          name_en: "Dinh Cafe",
          dish_vi: "Cà phê trứng gia truyền ngắm trọn Hồ Gươm",
          dish_en: "Traditional egg coffee with panoramic lake view",
          address: "Tầng 2, 13 Đinh Tiên Hoàng, Hoàn Kiếm",
          distance: "Cách 150m",
        },
      ],
    },
    {
      id: "lm-02",
      slug: "van-mieu-quoc-tu-giam",
      name_vi: "Văn Miếu – Quốc Tử Giám",
      name_en: "Temple of Literature",
      order: 2,
      highlight_vi: "Trường đại học đầu tiên & Tinh hoa hiếu học nghìn năm",
      highlight_en: "First University of Vietnam & Millennium of Studiousness",
      story_vi: "Thành lập năm 1070 dưới triều vua Lý Thánh Tông và Quốc Tử Giám mở năm 1076, nơi đây là biểu tượng đỉnh cao của nền văn hiến và tinh thần trọng đạo của dân tộc. Khuê Văn Các với bốn cửa sổ tròn tượng trưng cho sao Khuê tỏa sáng rạng ngời tri thức, là hình tượng xuất hiện trên áo VIET CITY WEAR.",
      story_en: "Founded in 1070 under Emperor Ly Thanh Tong, with the Imperial Academy established in 1076, this is the paramount monument to education in Vietnam. Khue Van Pavilion with its round sun-like windows symbolizes the constellation of literature illuminating wisdom, featured on the back of VIET CITY WEAR tees.",
      history_vi: "Nơi lưu giữ 82 bia Tiến sĩ trên lưng rùa đá khắc tên các vị khoa bảng đỗ đạt từ khoa thi 1442 đến 1779, được UNESCO công nhận là Di sản Tư liệu Thế giới.",
      history_en: "Home to 82 stone stele mounted on tortoises recording names of royal scholars from 1442 to 1779, recognized by UNESCO as Memory of the World heritage.",
      address: "58 Quốc Tử Giám, Đống Đa, Hà Nội",
      best_time_vi: "08:00 – 10:00 sáng khi nắng mai rọi qua vòm cây cổ thụ giếng Thiên Quang",
      best_time_en: "08:00 – 10:00 AM as morning sun shines through ancient trees over Thien Quang Well",
      image: "/images/landmarks/van-mieu.jpg",
      audio_title_vi: "82 Tấm Bia Rùa và ngọn đuốc tri thức ngàn năm",
      audio_title_en: "82 Stone Stele and the Millennium Torch of Wisdom",
      duration: "04:12",
      foods: [
        {
          name_vi: "Phở cuốn Hương Mai",
          name_en: "Huong Mai Rolled Pho",
          dish_vi: "Phở cuốn thịt bò rau thơm chấm mắm chua ngọt",
          dish_en: "Fresh rolled pho with tender beef and herbs",
          address: "19 Lê Duẩn hoặc chi nhánh Ngũ Xã",
          distance: "Cách 500m",
        },
        {
          name_vi: "Bún chả Sinh Từ",
          name_en: "Sinh Tu Bun Cha",
          dish_vi: "Bún chả nướng than hoa đậm đà",
          dish_en: "Traditional charcoal grilled pork patties with rice noodles",
          address: "57 Nguyễn Khuyến, Văn Miếu",
          distance: "Cách 250m",
        },
      ],
    },
    {
      id: "lm-03",
      slug: "lang-chu-tich-ho-chi-minh",
      name_vi: "Lăng Chủ tịch Hồ Chí Minh",
      name_en: "Ho Chi Minh Mausoleum",
      order: 3,
      highlight_vi: "Quảng trường Ba Đình lịch sử & Lòng tri ân dân tộc",
      highlight_en: "Historic Ba Dinh Square & National Reverence",
      story_vi: "Tọa lạc trang nghiêm tại Quảng trường Ba Đình – nơi Bác Hồ đọc Bản Tuyên ngôn Độc lập ngày 2/9/1945. Công trình kiến trúc vững chãi với đá hoa cương khối lớn, bao quanh bởi hàng rào tre ngà và gần 250 loài cây quý từ mọi miền đất nước hội tụ.",
      story_en: "Solemnly located in historic Ba Dinh Square where President Ho Chi Minh proclaimed the Declaration of Independence on September 2, 1945. The grand architecture built of granite is guarded by rows of bamboo and nearly 250 species of flora brought from across Vietnam.",
      history_vi: "Khởi công ngày 2/9/1973 và khánh thành ngày 29/8/1975, Lăng Bác là điểm đến thiêng liêng của hàng triệu đồng bào và bạn bè quốc tế khi đặt chân đến thủ đô.",
      history_en: "Commenced in 1973 and officially opened in 1975, the Mausoleum serves as the focal pilgrimage destination for millions of Vietnamese and international guests.",
      address: "2 Hùng Vương, Điện Biên, Ba Đình, Hà Nội",
      best_time_vi: "06:00 sáng xem nghi lễ Thượng cờ hoặc 21:00 xem lễ Hạ cờ tại Quảng trường Ba Đình",
      best_time_en: "06:00 AM for the flag-raising ceremony or 21:00 for the evening lowering ceremony",
      image: "/images/landmarks/lang-bac.jpg",
      audio_title_vi: "Tiếng bước chân chào cờ Ba Đình sớm",
      audio_title_en: "Dawn Flag Ceremony at Ba Dinh Square",
      duration: "03:15",
      foods: [
        {
          name_vi: "Bánh cuốn Bà Hoành",
          name_en: "Ba Hoanh Steamed Rice Rolls",
          dish_vi: "Bánh cuốn thanh trì mỏng mướt ăn kèm chả quế",
          dish_en: "Delicate steamed rice rolls served with cinnamon pork pie",
          address: "66 Tô Hiến Thành (hoặc phố Đội Cấn gần Lăng)",
          distance: "Cách 800m",
        },
        {
          name_vi: "Cà phê Giảng Trúc Bạch",
          name_en: "Giang Cafe Truc Bach",
          dish_vi: "Cà phê trứng béo ngậy gió hồ thoáng mát",
          dish_en: "Frothy egg coffee by the gentle lakeside breeze",
          address: "Trấn Vũ, Ba Đình",
          distance: "Cách 1km",
        },
      ],
    },
    {
      id: "lm-04",
      slug: "nha-tho-lon-ha-noi",
      name_vi: "Nhà Thờ Lớn Hà Nội",
      name_en: "St. Joseph's Cathedral",
      order: 4,
      highlight_vi: "Kiến trúc Gothic cổ điển & Văn hóa trà chanh phố cổ",
      highlight_en: "Gothic Masterpiece & Sidewalk Lemon Tea Culture",
      story_vi: "Khánh thành vào dịp Giáng sinh năm 1887, Nhà Thờ Lớn mang phong cách Gothic trung cổ châu Âu mô phỏng Nhà thờ Đức Bà Paris với hai tháp chuông cao vút và tường gạch rêu phong. Đây là nơi giao thoa tuyệt vời giữa sự uy nghiêm tôn giáo và nét sinh hoạt đường phố đậm chất tuổi trẻ Hà Nội với văn hóa 'trà chanh Nhà Thờ'.",
      story_en: "Inaugurated on Christmas 1887, St. Joseph's Cathedral embodies European medieval Gothic style reminiscent of Notre-Dame de Paris, featuring soaring twin bell towers and moss-toned walls. It represents an enchanting intersection of sacred history and youthful street culture known as 'Cathedral lemon tea gatherings'.",
      history_vi: "Công trình được thiết kế theo lối kiến trúc Gothic thời Phục hưng với hệ thống vòm uốn nhọn, cửa kính màu lộng lẫy và chuông đồng lớn nguyên bản từ thế kỷ 19.",
      history_en: "Built in revival Gothic architecture with ribbed cross vaults, radiant stained-glass windows, and massive 19th-century bronze bells.",
      address: "40 Nhà Chung, Hàng Trống, Hoàn Kiếm, Hà Nội",
      best_time_vi: "16:00 – 18:00 chiều ngồi trà chanh ngắm nắng rọi tháp chuông",
      best_time_en: "16:00 – 18:00 PM sipping iced tea watching twilight bathe the stone towers",
      image: "/images/landmarks/nha-tho-lon.jpg",
      audio_title_vi: "Tiếng chuông chiều và ly trà chanh phố Nhà Chung",
      audio_title_en: "Evening Cathedral Chimes & Lemon Tea on Nha Chung Street",
      duration: "03:30",
      foods: [
        {
          name_vi: "Trà chanh Nhà Thờ",
          name_en: "Cathedral Lemon Tea",
          dish_vi: "Trà chanh hoa nhài ăn kèm hạt hướng dương",
          dish_en: "Jasmine iced lemon tea paired with roasted seeds",
          address: "Phố Nhà Chung quanh quảng trường",
          distance: "Ngay chân Nhà Thờ",
        },
        {
          name_vi: "Nem nướng Ấu Triệu",
          name_en: "Au Trieu Grilled Fermented Pork",
          dish_vi: "Nem nướng dính thơm lừng nướng than hồng",
          dish_en: "Smoky grilled pork skewers with sweet-chili dipping sauce",
          address: "10 Ấu Triệu, Hoàn Kiếm",
          distance: "Cách 50m",
        },
      ],
    },
    {
      id: "lm-05",
      slug: "pho-co-ha-noi",
      name_vi: "Phố Cổ Hà Nội – 36 Phố Phường",
      name_en: "Hanoi Old Quarter – 36 Guild Streets",
      order: 5,
      highlight_vi: "Mê cung ngõ nhỏ & Tinh hoa ẩm thực kinh kỳ Thăng Long",
      highlight_en: "Labyrinth of Ancient Alleys & Soul of Thang Long Cuisine",
      story_vi: "Phố Cổ là cái nôi sống động nhất của đời sống thị dân thủ đô. Mỗi con phố bắt đầu bằng chữ 'Hàng' mang theo ký ức của một làng nghề thủ công trăm năm trước: Hàng Mã rực rỡ, Hàng Bạc tinh xảo, Hàng Gai tơ lụa. Đi lạc trong mê cung ngõ ngách phố cổ là trải nghiệm đặc sắc nhất để cảm nhận nhịp đập đích thực của thành phố.",
      story_en: "The Old Quarter is the beating heart of Hanoi civic heritage. Each street starting with 'Hang' (Merchandise) preserves memories of centuries-old trade guilds: Hang Ma papercrafts, Hang Bac silver, Hang Gai silks. Getting lost in these narrow alleys is the quintessential way to feel the pulse of Hanoi.",
      history_vi: "Hình thành từ thế kỷ 11 thời Lý – Trần bên bờ sông Hồng, khu buôn bán sầm uất với lối kiến trúc nhà hình ống đặc trưng và những mái ngói âm dương rêu phong.",
      history_en: "Evolving since the 11th century alongside the Red River into a bustling trade hub, famous for traditional tube houses and clay-tiled roofs.",
      address: "Khu vực 36 phố phường quận Hoàn Kiếm, Hà Nội",
      best_time_vi: "19:00 – 22:30 tối tản bộ chợ đêm hoặc các sớm mai tinh mơ phố còn vắng người",
      best_time_en: "19:00 – 22:30 PM for vibrant night markets or early dawn before the city awakens",
      image: "/images/landmarks/pho-co.jpg",
      audio_title_vi: "Kể chuyện 36 Phố Phường và ngõ nhỏ rêu phong",
      audio_title_en: "Tales of 36 Craft Streets and Moss-covered Alleys",
      duration: "05:10",
      foods: [
        {
          name_vi: "Phở Gia Truyền Bát Đàn",
          name_en: "Bat Dan Traditional Beef Pho",
          dish_vi: "Phở bò tái lăn nước dùng trong ngọt thơm quế hồi",
          dish_en: "Heritage beef pho with fragrant slow-simmered bone broth",
          address: "49 Bát Đàn, Hoàn Kiếm",
          distance: "Tọa độ trung tâm Phố Cổ",
        },
        {
          name_vi: "Bún chả Hàng Quạt",
          name_en: "Hang Quat Bun Cha",
          dish_vi: "Chả viên nướng lá chuối ăn cùng nước chấm ấm nóng",
          dish_en: "Caramelized charcoal pork patties in rich dipping bowl",
          address: "Ngõ 74 Hàng Quạt, Hoàn Kiếm",
          distance: "Trong ngõ phố Hàng Quạt",
        },
      ],
    },
  ],
};
