# Lyly Arcturus Tarot

Website Tarot phong cách celestial mơ mộng với nền bầu trời 3D **Three.js** (bụi sao trôi, vòng thiên văn xoay nhẹ, parallax theo chuột/cuộn trang), hiệu ứng **lật bài 3D** từ đủ 22 lá Ẩn Chính (Major Arcana), hỗ trợ giao diện **Tối / Sáng** và sẵn sàng deploy tĩnh (static) miễn phí.

## Chạy local

```bash
npm install
npm run dev
```

Build bản production:

```bash
npm run build
npm run preview
```

## Tùy chỉnh nhanh trước khi go-live

1. **Gắn số Zalo & Form nhận lịch tự động:** mở `src/data/config.ts`
   - Điền `zaloPhone` (vd: `'0901234567'`) để hiện nút **Mở Zalo Lyly** ngay sau khi khách đặt lịch.
   - Tùy chọn: điền `formEndpoint` từ [Formspree](https://formspree.io/) hoặc [Web3Forms](https://web3forms.com/) để nhận email thông báo đặt lịch tự động (không cần backend).
   - Đổi `isDraftPricing: false` khi đã chốt bảng giá chính thức.
2. **Sửa giá, dịch vụ, FAQ:** mở `src/data/services.ts`.
3. **Sửa thông điệp 22 lá bài:** mở `src/data/tarotCards.ts`.

## Deploy miễn phí (Vercel / Cloudflare Pages / Netlify)

- **Vercel:** Push repo lên GitHub → Import vào Vercel (file `vercel.json` đã cấu hình sẵn `npm run build` & `dist`).
- **Cloudflare Pages / Netlify:** Kết nối GitHub repo, đặt Build command là `npm run build` và Publish directory là `dist`.
