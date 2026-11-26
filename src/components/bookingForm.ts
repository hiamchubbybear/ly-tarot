import { SITE_CONFIG } from '../data/config';

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return map[ch] ?? ch;
  });
}

function getDurationLabel(minutes: string): string {
  if (minutes === '15') return 'Mini — 15 phút (59K)';
  if (minutes === '60') return 'Deep Dive — 60 phút (199K)';
  return 'Insight — 30 phút (109K)';
}

export function initBookingForm(): void {
  const form = document.getElementById('bookingForm') as HTMLFormElement | null;
  const dateInput = document.getElementById('date') as HTMLInputElement | null;
  const successBox = document.getElementById('success');
  const noticeBox = document.getElementById('bookingNotice');

  if (!form || !dateInput || !successBox) return;

  // Set default & min date to local today
  const now = new Date();
  const localIso = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
  dateInput.min = localIso;
  dateInput.value = localIso;

  // Update notice copy depending on whether real Zalo/endpoint is configured
  if (noticeBox) {
    if (SITE_CONFIG.zaloPhone || SITE_CONFIG.formEndpoint) {
      noticeBox.innerHTML = `
        <strong>✧ QUY TRÌNH XÁC NHẬN</strong><br>
        Sau khi gửi thông tin, bạn có thể chuyển nhanh nội dung đặt lịch qua Zalo để Lyly xác nhận khung giờ trống và hướng dẫn tham gia buổi xem.
      `;
    } else {
      noticeBox.innerHTML = `
        <strong>✧ SẴN SÀNG KẾT NỐI ZALO / FORM</strong><br>
        Điền thông tin để tạo bản tóm tắt đặt lịch (có thể sao chép gửi Zalo ngay). Khi gắn số Zalo hoặc Formspree trong <code>src/data/config.ts</code>, hệ thống sẽ tự động gửi lịch trực tiếp cho Lyly.
      `;
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const service = (document.getElementById('service') as HTMLSelectElement).value;
    const duration = (document.getElementById('duration') as HTMLSelectElement).value;
    const date = dateInput.value;
    const time = (document.getElementById('time') as HTMLSelectElement).value;
    const name = (document.getElementById('name') as HTMLInputElement).value.trim();
    const zalo = (document.getElementById('zalo') as HTMLInputElement).value.trim();
    const email = (document.getElementById('email') as HTMLInputElement).value.trim();
    const question = (document.getElementById('question') as HTMLTextAreaElement).value.trim();
    const age = (document.getElementById('age') as HTMLSelectElement).value;

    if (!name || !zalo || !question || !age) return;

    const summaryText = [
      '✦ ĐẶT LỊCH TRẢI BÀI — LYLY ARCTURUS TAROT',
      `• Khách hàng: ${name} (${age})`,
      `• Zalo liên hệ: ${zalo}`,
      email ? `• Email: ${email}` : null,
      `• Chủ đề: ${service}`,
      `• Gói: ${getDurationLabel(duration)}`,
      `• Thời gian mong muốn: ${time}, ngày ${date}`,
      `• Câu hỏi: ${question}`,
    ]
      .filter(Boolean)
      .join('\n');

    const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    let webhookStatus = '';

    if (SITE_CONFIG.formEndpoint) {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Đang gửi thông tin...';
      }
      try {
        const payload: Record<string, string> = {
          name,
          zalo,
          email,
          service,
          duration: getDurationLabel(duration),
          date,
          time,
          age,
          question,
        };
        if (SITE_CONFIG.web3formsKey) {
          payload.access_key = SITE_CONFIG.web3formsKey;
          payload.subject = `[Lyly Tarot] Đặt lịch mới từ ${name}`;
        }
        const res = await fetch(SITE_CONFIG.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });
        webhookStatus = res.ok
          ? '<p class="success-badge">✓ Đã gửi thông tin đặt lịch thành công tới Lyly.</p>'
          : '<p class="success-warn">Không gửi được qua máy chủ tự động — bạn có thể sao chép nội dung bên dưới gửi trực tiếp qua Zalo.</p>';
      } catch {
        webhookStatus =
          '<p class="success-warn">Kết nối tạm gián đoạn — bạn có thể sao chép nội dung bên dưới gửi trực tiếp qua Zalo.</p>';
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Xác nhận thông tin đặt lịch ✦';
        }
      }
    }

    const cleanPhone = SITE_CONFIG.zaloPhone.replace(/\D/g, '');
    const zaloBtnHtml = cleanPhone
      ? `<a class="btn small" href="https://zalo.me/${cleanPhone}" target="_blank" rel="noopener noreferrer">Mở Zalo Lyly ↗</a>`
      : '';

    successBox.innerHTML = `
      <div class="success-header">✦ Tóm tắt lịch hẹn của ${escapeHtml(name)}</div>
      ${webhookStatus}
      <p class="success-meta">
        <strong>${escapeHtml(service)}</strong> · ${escapeHtml(getDurationLabel(duration))}<br>
        Ngày <strong>${escapeHtml(date)}</strong> lúc <strong>${escapeHtml(time)}</strong> · Zalo: <strong>${escapeHtml(zalo)}</strong>
      </p>
      <div class="success-actions">
        <button type="button" class="btn ghost small" id="copySummaryBtn">Sao chép nội dung gửi Zalo</button>
        ${zaloBtnHtml}
      </div>
    `;
    successBox.classList.add('show');
    successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    const copyBtn = document.getElementById('copySummaryBtn');
    copyBtn?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(summaryText);
        copyBtn.textContent = '✓ Đã sao chép nội dung';
        window.setTimeout(() => {
          copyBtn.textContent = 'Sao chép nội dung gửi Zalo';
        }, 2500);
      } catch {
        copyBtn.textContent = 'Không thể tự động sao chép';
      }
    });
  });
}
