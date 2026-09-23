export default function CoreValues() {
  const values = [
    {
      title: "Áo = Kỷ niệm.",
      subtitle: "Áo thun văn hóa",
      description: "Lưu giữ kỷ niệm về từng thành phố và địa danh nơi bạn đã đi qua.",
    },
    {
      title: "Thẻ = Câu chuyện.",
      subtitle: "Thẻ địa danh",
      description: "Giới thiệu các địa điểm xuất hiện trên áo và câu chuyện văn hóa phía sau.",
    },
    {
      title: "NFC = Trải nghiệm.",
      subtitle: "Móc khóa NFC",
      description: "Chạm điện thoại vào móc khóa để mở trang web khám phá du lịch số.",
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#F7F4EE] border-b border-[#E5DFD5]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v, i) => (
            <div
              key={i}
              className="bg-white p-6 sm:p-8 rounded-xl border border-[#E5DFD5] text-center flex flex-col items-center justify-center space-y-2 hover:border-[#B4532A]/50 transition-colors shadow-xs"
            >
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#B4532A]">
                {v.subtitle}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#1A2421] tracking-tight">
                {v.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#1A2421]/70 leading-relaxed max-w-xs">
                {v.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
