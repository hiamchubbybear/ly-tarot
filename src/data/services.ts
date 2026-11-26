export interface ServiceItem {
  value: string;
  title: string;
  description: string;
  iconSvg: string;
}

export interface PricingTier {
  duration: '15' | '30' | '60';
  name: string;
  price: string;
  lengthLabel: string;
  description: string;
  featured?: boolean;
  badge?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const SERVICES: ServiceItem[] = [
  {
    value: 'Tình yêu',
    title: 'Tình yêu',
    description: 'Nhìn lại cảm xúc, giao tiếp và những lựa chọn trong mối quan hệ hiện tại hoặc sắp tới.',
    iconSvg:
      '<path d="M12 20s-7-4.6-8.8-8.7C1.9 8.2 3.8 5 7 5c2 0 3.6 1.1 5 2.8C13.4 6.1 15 5 17 5c3.2 0 5.1 3.2 3.8 6.3C19 15.4 12 20 12 20Z"/>',
  },
  {
    value: 'Sự nghiệp',
    title: 'Sự nghiệp',
    description: 'Khám phá phương hướng, điểm mạnh và những điều cần cân nhắc trong công việc hoặc học tập.',
    iconSvg:
      '<path d="M12 3l2.2 6.2L20.5 11.5l-6.3 2.3L12 20l-2.2-6.2-6.3-2.3 6.3-2.3L12 3Z"/>',
  },
  {
    value: 'Khám phá bản thân',
    title: 'Bản thân',
    description: 'Lắng nghe nhu cầu nội tâm, giá trị cốt lõi và hành trình trưởng thành của chính bạn.',
    iconSvg:
      '<path d="M15.8 4.6a8.2 8.2 0 1 0 3.6 13.8A6.7 6.7 0 1 1 15.8 4.6Z"/>',
  },
  {
    value: 'Tổng quan',
    title: 'Tổng quan',
    description: 'Chiêm nghiệm bức tranh năng lượng và các khía cạnh đáng chú ý trong giai đoạn hiện tại.',
    iconSvg:
      '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/>',
  },
  {
    value: 'Theo yêu cầu',
    title: 'Theo yêu cầu',
    description: 'Trao đổi sâu về một câu chuyện hoặc chủ đề cá nhân phù hợp với phạm vi buổi trải bài.',
    iconSvg:
      '<path d="M12 2.5 14 9l6.5 2-6.5 2-2 6.5-2-6.5-6.5-2L10 9l2-6.5Z"/><circle cx="18.5" cy="5.5" r="1.2"/>',
  },
];

export const PRICING_TIERS: PricingTier[] = [
  {
    duration: '15',
    name: 'Mini',
    price: '59K',
    lengthLabel: '15 PHÚT',
    description: 'Một vấn đề trọng tâm, giải nghĩa lá bài và trao đổi ngắn gọn, rõ ý.',
  },
  {
    duration: '30',
    name: 'Insight',
    price: '109K',
    lengthLabel: '30 PHÚT',
    description: 'Một chủ đề chính, khám phá nhiều lớp cảm xúc cùng các câu hỏi bổ sung.',
    featured: true,
    badge: 'Gợi ý khởi đầu',
  },
  {
    duration: '60',
    name: 'Deep Dive',
    price: '199K',
    lengthLabel: '60 PHÚT',
    description: 'Không gian rộng rãi để trò chuyện và kết nối nhiều khía cạnh liên quan.',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Chưa từng xem Tarot, mình có thể đặt lịch không?',
    answer:
      'Hoàn toàn có thể. Bạn không cần biết ý nghĩa các lá bài từ trước. Lyly sẽ hướng dẫn nhẹ nhàng cách buổi trải bài diễn ra.',
  },
  {
    question: 'Buổi trải bài online diễn ra như thế nào?',
    answer:
      'Buổi trải bài diễn ra trực tiếp qua chat Zalo theo khung giờ bạn đã hẹn. Sau khi bạn gửi thông tin đặt lịch, Lyly sẽ xác nhận lại khung giờ trống và gửi hướng dẫn chuẩn bị trước buổi xem.',
  },
  {
    question: 'Tarot có dự đoán chính xác tương lai không?',
    answer:
      'Không có bảo đảm nào về dự đoán tương lai. Lyly sử dụng Tarot như một công cụ gợi mở góc nhìn và hỗ trợ quá trình chiêm nghiệm, không quyết định thay bạn.',
  },
  {
    question: 'Mình có thể đổi hoặc hủy lịch không?',
    answer:
      'Bạn có thể nhắn Lyly đổi hoặc hủy lịch trước ít nhất 12 giờ. Các quy định chi tiết về hoàn tiền hoặc sự cố kỹ thuật sẽ được trao đổi rõ ràng trước khi xác nhận buổi xem.',
  },
  {
    question: 'Thông tin riêng tư của mình có được bảo vệ không?',
    answer:
      'Mọi câu chuyện bạn chia sẻ đều được giữ kín và tôn trọng. Website chỉ thu thập thông tin cần thiết để liên hệ xác nhận lịch hẹn với bạn.',
  },
];
