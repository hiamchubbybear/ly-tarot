export interface ZodiacSign {
  id: string;
  en: string;
  vi: string;
  element: string;
  reflection: string;
  svgPath: string;
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    id: 'aries',
    en: 'ARIES',
    vi: 'Bạch Dương',
    element: 'Lửa',
    reflection: 'Can đảm bắt đầu điều khiến trái tim bạn rung động.',
    svgPath: 'M12 20V9M12 9c0-3-2-5-4.5-5S3 6 3 8.5M12 9c0-3 2-5 4.5-5S21 6 21 8.5',
  },
  {
    id: 'taurus',
    en: 'TAURUS',
    vi: 'Kim Ngưu',
    element: 'Đất',
    reflection: 'Chậm lại để cảm nhận sự vững vàng và đủ đầy quanh mình.',
    svgPath: 'M12 19a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM6 4c1 3 3.2 5 6 5s5-2 6-5',
  },
  {
    id: 'gemini',
    en: 'GEMINI',
    vi: 'Song Tử',
    element: 'Khí',
    reflection: 'Lắng nghe cả những góc nhìn đối lập để hiểu mình sâu hơn.',
    svgPath: 'M5 5c4 1.5 10 1.5 14 0M5 19c4-1.5 10-1.5 14 0M9 6v12M15 6v12',
  },
  {
    id: 'cancer',
    en: 'CANCER',
    vi: 'Cự Giải',
    element: 'Nước',
    reflection: 'Dịu dàng bảo vệ cảm xúc và tạo không gian an toàn cho chính mình.',
    svgPath: 'M7 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm0-5c4.5 0 9.5 1.8 11.5 5.5M17 19.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm0 0c-4.5 0-9.5-1.8-11.5-5.5',
  },
  {
    id: 'leo',
    en: 'LEO',
    vi: 'Sư Tử',
    element: 'Lửa',
    reflection: 'Tỏa sáng bằng sự chân thành và ấm áp vốn có trong bạn.',
    svgPath: 'M7.5 16.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm2-3.8c1-4 3.2-7.2 6-7.2 2.2 0 3.5 1.6 3.5 3.6 0 2.8-2.4 5.2-2.4 7.7 0 1.3.9 2.2 2.1 2.2 1 0 1.8-.6 2.3-1.5',
  },
  {
    id: 'virgo',
    en: 'VIRGO',
    vi: 'Xử Nữ',
    element: 'Đất',
    reflection: 'Buông bớt cầu toàn để nhận ra những điều tinh tế bạn đã làm tốt.',
    svgPath: 'M4 6v10M4 9c0-2 1.5-3 3-3s2.5 1 2.5 3v7M9.5 9c0-2 1.5-3 3-3s2.5 1 2.5 3v7c0 2.5 1.2 4 3.5 4M15 11.5c2.5-3.5 5-2 4.5 1-.4 2.6-3.5 5-6.5 6.5',
  },
  {
    id: 'libra',
    en: 'LIBRA',
    vi: 'Thiên Bình',
    element: 'Khí',
    reflection: 'Tìm điểm cân bằng giữa lắng nghe người khác và chọn điều mình cần.',
    svgPath: 'M4 18h16M4 14h4.2a4 4 0 1 1 7.6 0H20',
  },
  {
    id: 'scorpio',
    en: 'SCORPIO',
    vi: 'Bọ Cạp',
    element: 'Nước',
    reflection: 'Can đảm nhìn sâu vào nội tâm để chuyển hóa điều cũ kỹ.',
    svgPath: 'M4 6v10M4 9c0-2 1.5-3 3-3s2.5 1 2.5 3v7M9.5 9c0-2 1.5-3 3-3s2.5 1 2.5 3v7c0 2 1.2 3 2.8 3H20m0 0-2-2m2 2-2 2',
  },
  {
    id: 'sagittarius',
    en: 'SAGITTARIUS',
    vi: 'Nhân Mã',
    element: 'Lửa',
    reflection: 'Mở rộng tầm nhìn và tin vào hành trình khám phá phía trước.',
    svgPath: 'M5 19 19 5M13 5h6v6M8 10l6 6',
  },
  {
    id: 'capricorn',
    en: 'CAPRICORN',
    vi: 'Ma Kết',
    element: 'Đất',
    reflection: 'Kiên định từng bước nhỏ, nhưng đừng quên cho mình quyền nghỉ ngơi.',
    svgPath: 'M4 6l3 10 3-8c.6-1.5 2-2 3-1.5 1.2.6 1.5 2 1.2 3.5l-1 5c-.3 1.8.8 3.5 2.8 3.5 2.2 0 3.5-1.6 3.5-3.3 0-1.5-1.1-2.5-2.5-2.5-1.5 0-2.5 1.2-2.5 2.8 0 2.5-1.5 4.2-3.8 4.5',
  },
  {
    id: 'aquarius',
    en: 'AQUARIUS',
    vi: 'Bảo Bình',
    element: 'Khí',
    reflection: 'Trân trọng nét riêng độc đáo và góc nhìn tự do của chính bạn.',
    svgPath: 'M3 10l3-3 3 3 3-3 3 3 3-3 3 3M3 16l3-3 3 3 3-3 3 3 3-3 3 3',
  },
  {
    id: 'pisces',
    en: 'PISCES',
    vi: 'Song Ngư',
    element: 'Nước',
    reflection: 'Để sự nhạy cảm trở thành trực giác dẫn lối dịu dàng cho bạn.',
    svgPath: 'M6 4c3 4 3 12 0 16M18 4c-3 4-3 12 0 16M5 12h14',
  },
];
