export interface SiteConfig {
  brandName: string;
  brandSub: string;
  /** Số điện thoại Zalo nhận lịch (vd: "0912345678"). Để trống nếu chưa gắn số thật. */
  zaloPhone: string;
  /**
   * Optional: Endpoint nhận form tự động không cần backend.
   * Hỗ trợ Formspree (https://formspree.io/f/xxxxxx) hoặc Web3Forms (https://api.web3forms.com/submit).
   * Để trống nếu chỉ muốn khách xác nhận & gửi thẳng qua Zalo.
   */
  formEndpoint: string;
  /** Nếu dùng Web3Forms, điền access_key tại đây */
  web3formsKey: string;
  /** Đánh dấu bảng giá đang là bản mẫu hay đã chính thức */
  isDraftPricing: boolean;
}

export const SITE_CONFIG: SiteConfig = {
  brandName: 'LYLY ARCTURUS',
  brandSub: 'T A R O T',
  zaloPhone: '', // Thay bằng số Zalo thật của Lyly, vd: '0901234567'
  formEndpoint: '', // Tùy chọn: dán URL Formspree hoặc https://api.web3forms.com/submit
  web3formsKey: '',
  isDraftPricing: true,
};
