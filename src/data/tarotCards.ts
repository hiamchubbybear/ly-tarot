export interface TarotCard {
  id: string;
  numeral: string;
  nameEn: string;
  nameVi: string;
  keywords: string;
  meaning: string;
  prompt: string;
  emblem: 'star' | 'moon' | 'sun' | 'crown' | 'chalice' | 'flame' | 'scales' | 'compass' | 'eye' | 'wheel' | 'wings' | 'lotus';
  accent: string;
}

export const MAJOR_ARCANA: TarotCard[] = [
  {
    id: 'fool',
    numeral: '0',
    nameEn: 'The Fool',
    nameVi: 'Kẻ Khờ',
    keywords: 'Khởi đầu mới · Tin tưởng · Tự do',
    meaning:
      'Một cánh cửa mới đang mở ra với nhiều bất ngờ thú vị. Lá bài khuyến khích bạn giữ tâm trí cởi mở và cho phép bản thân thử bước đi đầu tiên mà không quá nặng nề về sự hoàn hảo.',
    prompt: 'Có điều gì mới mẻ bạn muốn thử nhưng vẫn còn hơi e ngại?',
    emblem: 'wings',
    accent: '#e8cf95',
  },
  {
    id: 'magician',
    numeral: 'I',
    nameEn: 'The Magician',
    nameVi: 'Nhà Ảo Thuật',
    keywords: 'Chủ động · Khả năng · Hiện thực hóa',
    meaning:
      'Bạn đã có sẵn nhiều nguồn lực hơn mình nghĩ. Đây là lúc gom lại sự tập trung, tin vào kỹ năng của bản thân và biến ý tưởng thành hành động cụ thể.',
    prompt: 'Nguồn lực nào bạn đang có sẵn nhưng chưa dùng hết?',
    emblem: 'flame',
    accent: '#f0c987',
  },
  {
    id: 'high-priestess',
    numeral: 'II',
    nameEn: 'The High Priestess',
    nameVi: 'Nữ Tu Tối Cao',
    keywords: 'Trực giác · Tĩnh lặng · Hiểu biết sâu',
    meaning:
      'Câu trả lời đôi khi không nằm ở sự vội vã bên ngoài mà ở khoảng lặng bên trong. Hãy lắng nghe cảm giác thật của mình và quan sát thêm trước khi vội kết luận.',
    prompt: 'Nếu tạm gác tiếng ồn xung quanh, trực giác đang nhắc bạn điều gì?',
    emblem: 'moon',
    accent: '#c7b8ea',
  },
  {
    id: 'empress',
    numeral: 'III',
    nameEn: 'The Empress',
    nameVi: 'Hoàng Hậu',
    keywords: 'Nuôi dưỡng · Sáng tạo · Dịu dàng',
    meaning:
      'Lá bài gợi nhớ đến việc nuôi dưỡng điều quan trọng và trân trọng vẻ đẹp của những gì đang lớn dần. Sự chăm sóc kiên nhẫn sẽ mang lại cảm giác đủ đầy.',
    prompt: 'Điều gì trong cuộc sống hiện tại đang cần bạn chăm sóc và nâng niu?',
    emblem: 'crown',
    accent: '#e6b4c8',
  },
  {
    id: 'emperor',
    numeral: 'IV',
    nameEn: 'The Emperor',
    nameVi: 'Hoàng Đế',
    keywords: 'Ranh giới · Vững vàng · Cấu trúc',
    meaning:
      'Sự bình yên đôi khi đến từ trật tự rõ ràng và ranh giới lành mạnh. Hãy thiết lập nhịp sống ổn định để bảo vệ năng lượng và mục tiêu dài hạn của bạn.',
    prompt: 'Bạn cần thiết lập ranh giới rõ ràng hơn ở khía cạnh nào?',
    emblem: 'crown',
    accent: '#deb67d',
  },
  {
    id: 'hierophant',
    numeral: 'V',
    nameEn: 'The Hierophant',
    nameVi: 'Giáo Hoàng',
    keywords: 'Giá trị · Học hỏi · Đồng hành',
    meaning:
      'Lá bài nhắc đến việc quay về với những giá trị cốt lõi hoặc tìm kiếm góc nhìn từ người có kinh nghiệm. Học hỏi từ những điều bền vững sẽ giúp bạn đi xa hơn.',
    prompt: 'Giá trị cốt lõi nào giúp bạn cảm thấy vững tâm khi đưa ra lựa chọn?',
    emblem: 'compass',
    accent: '#d8be8a',
  },
  {
    id: 'lovers',
    numeral: 'VI',
    nameEn: 'The Lovers',
    nameVi: 'Tình Nhân',
    keywords: 'Kết nối · Lựa chọn · Chân thành',
    meaning:
      'Không chỉ nói về tình cảm, lá bài còn nhấn mạnh sự hòa hợp giữa trái tim và lý trí. Một lựa chọn tốt là lựa chọn phản ánh đúng con người thật của bạn.',
    prompt: 'Lựa chọn nào khiến bạn cảm thấy chân thật với chính mình nhất?',
    emblem: 'chalice',
    accent: '#e5a8c0',
  },
  {
    id: 'chariot',
    numeral: 'VII',
    nameEn: 'The Chariot',
    nameVi: 'Cỗ Xe',
    keywords: 'Quyết tâm · Định hướng · Tiến bước',
    meaning:
      'Khi hai luồng cảm xúc kéo bạn về hai phía, điều quan trọng là nắm chắc tay lái và chọn một hướng đi rõ ràng. Kỷ luật nhẹ nhàng sẽ giúp bạn vượt qua giai đoạn này.',
    prompt: 'Mục tiêu nào xứng đáng để bạn dồn tâm sức trong thời gian tới?',
    emblem: 'compass',
    accent: '#d9c290',
  },
  {
    id: 'strength',
    numeral: 'VIII',
    nameEn: 'Strength',
    nameVi: 'Sức Mạnh',
    keywords: 'Can đảm · Dịu dàng · Kiên nhẫn',
    meaning:
      'Sức mạnh không chỉ là đối đầu, mà còn là sự kiên nhẫn, lòng trắc ẩn và khả năng ôm ấp những phần dễ tổn thương của chính mình.',
    prompt: 'Bạn có thể đối xử nhẹ nhàng hơn với bản thân ở điểm nào hôm nay?',
    emblem: 'flame',
    accent: '#ecc58c',
  },
  {
    id: 'hermit',
    numeral: 'IX',
    nameEn: 'The Hermit',
    nameVi: 'Ẩn Sĩ',
    keywords: 'Chiêm nghiệm · Nội tâm · Soi sáng',
    meaning:
      'Đôi khi một khoảng lặng tách khỏi nhịp sống ồn ào là điều cần thiết để hiểu rõ nhu cầu thật sự của mình. Bạn không cần vội vàng trả lời mọi thứ ngay lúc này.',
    prompt: 'Bạn đang cần dành một khoảng lặng riêng để suy nghĩ về điều gì?',
    emblem: 'star',
    accent: '#c5cae6',
  },
  {
    id: 'wheel',
    numeral: 'X',
    nameEn: 'Wheel of Fortune',
    nameVi: 'Bánh Xe Số Phận',
    keywords: 'Chuyển nhịp · Chu kỳ · Thích nghi',
    meaning:
      'Mọi giai đoạn đều có nhịp lên xuống tự nhiên. Thay vì gồng mình kiểm soát mọi biến số, hãy giữ tâm thế linh hoạt để đón nhận những chuyển dịch mới.',
    prompt: 'Thay đổi nào gần đây đang mở ra cho bạn một góc nhìn mới?',
    emblem: 'wheel',
    accent: '#e3c789',
  },
  {
    id: 'justice',
    numeral: 'XI',
    nameEn: 'Justice',
    nameVi: 'Công Lý',
    keywords: 'Minh bạch · Cân bằng · Trách nhiệm',
    meaning:
      'Hãy nhìn nhận sự việc một cách khách quan và trung thực với cả cảm xúc lẫn thực tế. Sự rõ ràng sẽ giúp bạn đưa ra quyết định nhẹ lòng hơn.',
    prompt: 'Điều gì cần được nhìn nhận công bằng và thẳng thắn hơn lúc này?',
    emblem: 'scales',
    accent: '#d4be96',
  },
  {
    id: 'hanged-man',
    numeral: 'XII',
    nameEn: 'The Hanged Man',
    nameVi: 'Người Treo Ngược',
    keywords: 'Tạm dừng · Góc nhìn mới · Buông lỏng',
    meaning:
      'Khi mọi thứ dường như chững lại, đó có thể là cơ hội để bạn xoay góc nhìn. Đôi khi buông bớt sự cố chấp lại là cách nhanh nhất để thấy lối mở.',
    prompt: 'Nếu nhìn vấn đề hiện tại từ một góc độ hoàn toàn khác, bạn thấy gì?',
    emblem: 'eye',
    accent: '#b8c3e0',
  },
  {
    id: 'death',
    numeral: 'XIII',
    nameEn: 'Death',
    nameVi: 'Chuyển Hóa',
    keywords: 'Khép lại · Tái sinh · Nhẹ gánh',
    meaning:
      'Một chương cũ đang dần khép lại để nhường chỗ cho điều phù hợp hơn. Buông bỏ thói quen hoặc kỳ vọng đã hết vai trò sẽ giúp bạn bước sang giai đoạn mới nhẹ nhàng hơn.',
    prompt: 'Điều gì đã hoàn thành vai trò của nó và bạn sẵn sàng khép lại?',
    emblem: 'lotus',
    accent: '#c7a9d4',
  },
  {
    id: 'temperance',
    numeral: 'XIV',
    nameEn: 'Temperance',
    nameVi: 'Tiết Chế',
    keywords: 'Cân bằng · Điều hòa · Nhịp độ',
    meaning:
      'Hãy cân nhắc lại nhịp độ của mình, điều chỉnh các ưu tiên và tìm sự hài hòa giữa công việc, cảm xúc và thời gian nghỉ ngơi.',
    prompt: 'Bạn có thể giảm bớt điều gì để tìm lại sự cân bằng cho mình?',
    emblem: 'chalice',
    accent: '#d7c4a0',
  },
  {
    id: 'devil',
    numeral: 'XV',
    nameEn: 'The Devil',
    nameVi: 'Ràng Buộc',
    keywords: 'Nhận diện · Thói quen · Tự chủ',
    meaning:
      'Lá bài soi sáng những nỗi lo, áp lực hoặc thói quen đang vô tình giữ chân bạn. Khi gọi tên được điều đang trói buộc mình, bạn đã lấy lại một phần quyền chủ động.',
    prompt: 'Suy nghĩ hay thói quen nào đang khiến bạn cảm thấy mệt mỏi nhất?',
    emblem: 'eye',
    accent: '#cf9cb0',
  },
  {
    id: 'tower',
    numeral: 'XVI',
    nameEn: 'The Tower',
    nameVi: 'Ngọn Tháp',
    keywords: 'Thức tỉnh · Sự thật · Giải phóng',
    meaning:
      'Những khoảnh khắc bất ngờ đôi khi làm lung lay điều vốn không còn vững chắc, để bạn xây lại trên nền tảng chân thật và bền bỉ hơn.',
    prompt: 'Điều gì khi được nhìn rõ sự thật lại giúp bạn nhẹ lòng hơn về lâu dài?',
    emblem: 'flame',
    accent: '#e2a98d',
  },
  {
    id: 'star',
    numeral: 'XVII',
    nameEn: 'The Star',
    nameVi: 'Ngôi Sao',
    keywords: 'Hy vọng · Hồi phục · Niềm tin',
    meaning:
      'Lá bài gợi mở về hy vọng, sự hồi phục dịu dàng và cảm giác tìm lại phương hướng sau những lúc chênh vênh. Ánh sáng nhỏ vẫn đủ để dẫn đường.',
    prompt: 'Điều gì trong cuộc sống giúp bạn giữ lại niềm tin và sự ấm áp?',
    emblem: 'star',
    accent: '#f2dba4',
  },
  {
    id: 'moon',
    numeral: 'XVIII',
    nameEn: 'The Moon',
    nameVi: 'Mặt Trăng',
    keywords: 'Cảm xúc · Trực giác · Điều chưa rõ',
    meaning:
      'Khi mọi việc còn mờ sương, đừng vội khẳng định điều xấu nhất. Hãy quan sát cảm xúc đang lên xuống và kiểm tra lại những giả định trong đầu mình.',
    prompt: 'Điều gì đang khiến bạn chưa chắc chắn — là thực tế hay nỗi lo bên trong?',
    emblem: 'moon',
    accent: '#c7b8ea',
  },
  {
    id: 'sun',
    numeral: 'XIX',
    nameEn: 'The Sun',
    nameVi: 'Mặt Trời',
    keywords: 'Sáng tỏ · Ấm áp · Sức sống',
    meaning:
      'Lá bài mang năng lượng sáng rõ, chân thành và tích cực. Đây là lời nhắc trân trọng những niềm vui giản dị đang hiện diện quanh bạn.',
    prompt: 'Niềm vui nhỏ bé nào bạn muốn dành thời gian trân trọng hôm nay?',
    emblem: 'sun',
    accent: '#f7d98c',
  },
  {
    id: 'judgement',
    numeral: 'XX',
    nameEn: 'Judgement',
    nameVi: 'Thức Tỉnh',
    keywords: 'Nhìn lại · Tha thứ · Tiếng gọi mới',
    meaning:
      'Một lời mời nhẹ nhàng để bạn nhìn lại hành trình đã qua với sự bao dung, rút ra bài học cần thiết và sẵn sàng bước sang phiên bản trưởng thành hơn.',
    prompt: 'Bạn muốn gửi lời tha thứ hay ghi nhận nào cho chính mình của thời gian qua?',
    emblem: 'wings',
    accent: '#e4c9a8',
  },
  {
    id: 'world',
    numeral: 'XXI',
    nameEn: 'The World',
    nameVi: 'Thế Giới',
    keywords: 'Trọn vẹn · Hoàn thành · Mở rộng',
    meaning:
      'Một chu kỳ đang đi đến điểm tròn đầy. Hãy dừng lại một nhịp để ghi nhận chặng đường bạn đã đi qua trước khi mở ra hành trình kế tiếp.',
    prompt: 'Thành quả hay bài học nào gần đây khiến bạn tự hào về bản thân?',
    emblem: 'lotus',
    accent: '#dfca96',
  },
];

export const GALLERY_CARD_IDS = ['star', 'moon', 'sun', 'empress'] as const;
