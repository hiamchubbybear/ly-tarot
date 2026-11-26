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

function getDurationMeta(minutes: string): { label: string; price: string; short: string } {
  if (minutes === '15') return { label: 'Mini — 15 phút (59K)', price: '59K', short: 'Mini · 15 phút' };
  if (minutes === '60') return { label: 'Deep Dive — 60 phút (199K)', price: '199K', short: 'Deep Dive · 60 phút' };
  return { label: 'Insight — 30 phút (109K)', price: '109K', short: 'Insight · 30 phút' };
}

function formatDateVi(iso: string): string {
  if (!iso) return 'Chưa chọn ngày';
  const parts = iso.split('-');
  if (parts.length !== 3) return iso;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function isValidZalo(value: string): boolean {
  const digits = value.replace(/[\s.-]/g, '');
  if (/^(\+?84|0)\d{8,10}$/.test(digits)) return true;
  return value.trim().length >= 3 && !/^\d+$/.test(value.trim());
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function initBookingForm(): void {
  const form = document.getElementById('bookingForm') as HTMLFormElement | null;
  const serviceSelect = document.getElementById('service') as HTMLSelectElement | null;
  const durationSelect = document.getElementById('duration') as HTMLSelectElement | null;
  const dateInput = document.getElementById('date') as HTMLInputElement | null;
  const timeInput = document.getElementById('time') as HTMLInputElement | null;
  const timePills = document.querySelectorAll<HTMLButtonElement>('#timeSlots .time-pill');
  const nameInput = document.getElementById('name') as HTMLInputElement | null;
  const zaloInput = document.getElementById('zalo') as HTMLInputElement | null;
  const emailInput = document.getElementById('email') as HTMLInputElement | null;
  const questionInput = document.getElementById('question') as HTMLTextAreaElement | null;
  const ageSelect = document.getElementById('age') as HTMLSelectElement | null;
  const termsCheckbox = document.getElementById('terms') as HTMLInputElement | null;
  const summaryBar = document.getElementById('bookingSummaryBar');
  const successBox = document.getElementById('success');
  const noticeBox = document.getElementById('bookingNotice');

  if (
    !form ||
    !serviceSelect ||
    !durationSelect ||
    !dateInput ||
    !timeInput ||
    !nameInput ||
    !zaloInput ||
    !emailInput ||
    !questionInput ||
    !ageSelect ||
    !termsCheckbox ||
    !successBox
  ) {
    return;
  }

  // Set default & min date to local today
  const now = new Date();
  const localIso = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
  dateInput.min = localIso;
  dateInput.value = localIso;

  // Warm user-facing guidance about Zalo confirmation & privacy
  if (noticeBox) {
    noticeBox.innerHTML = `
      <strong>✧ XÁC NHẬN &amp; BẢO MẬT RIÊNG TƯ</strong><br>
      Sau khi hoàn tất biểu mẫu, bạn sẽ nhận ngay bản tóm tắt lịch hẹn để gửi qua Zalo cho Lyly xác nhận khung giờ
      trống. Mọi câu chuyện và thông tin cá nhân của bạn luôn được giữ kín tuyệt đối.
    `;
  }

  const updateSummaryBar = (): void => {
    if (!summaryBar) return;
    const meta = getDurationMeta(durationSelect.value);
    const serviceVal = serviceSelect.value;
    const dateVal = formatDateVi(dateInput.value);
    const timeVal = timeInput.value || '19:00';

    summaryBar.innerHTML = `
      <div class="summary-bar-left">
        <span class="summary-bar-label">Tóm tắt buổi xem</span>
        <strong>${escapeHtml(serviceVal)} · ${escapeHtml(meta.short)}</strong>
        <span class="summary-bar-time">${escapeHtml(timeVal)} · ${escapeHtml(dateVal)}</span>
      </div>
      <div class="summary-bar-price">${escapeHtml(meta.price)}</div>
    `;
  };

  const setFieldError = (fieldId: string, control: HTMLElement | null, message: string): void => {
    const errorEl = document.getElementById(`${fieldId}-error`);
    if (errorEl) errorEl.textContent = message;
    if (control) {
      control.setAttribute('aria-invalid', message ? 'true' : 'false');
      control.closest('.field')?.classList.toggle('has-error', Boolean(message));
    }
  };

  // Interactive time-slot pills
  timePills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const selectedTime = pill.dataset.time ?? '19:00';
      timeInput.value = selectedTime;
      timePills.forEach((p) => {
        const active = p === pill;
        p.classList.toggle('active', active);
        p.setAttribute('aria-pressed', String(active));
      });
      updateSummaryBar();
    });
  });

  // Live summary bar updates
  serviceSelect.addEventListener('change', updateSummaryBar);
  durationSelect.addEventListener('change', updateSummaryBar);
  dateInput.addEventListener('change', () => {
    setFieldError('date', dateInput, '');
    updateSummaryBar();
  });

  // Clear inline errors on user input
  nameInput.addEventListener('input', () => setFieldError('name', nameInput, ''));
  zaloInput.addEventListener('input', () => setFieldError('zalo', zaloInput, ''));
  emailInput.addEventListener('input', () => setFieldError('email', emailInput, ''));
  questionInput.addEventListener('input', () => setFieldError('question', questionInput, ''));
  ageSelect.addEventListener('change', () => setFieldError('age', ageSelect, ''));
  termsCheckbox.addEventListener('change', () => setFieldError('terms', termsCheckbox, ''));

  updateSummaryBar();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const service = serviceSelect.value;
    const duration = durationSelect.value;
    const durationMeta = getDurationMeta(duration);
    const date = dateInput.value;
    const time = timeInput.value || '19:00';
    const name = nameInput.value.trim();
    const zalo = zaloInput.value.trim();
    const email = emailInput.value.trim();
    const question = questionInput.value.trim();
    const age = ageSelect.value;
    const termsAccepted = termsCheckbox.checked;

    let firstInvalid: HTMLElement | null = null;
    const recordInvalid = (el: HTMLElement) => {
      if (!firstInvalid) firstInvalid = el;
    };

    if (!date) {
      setFieldError('date', dateInput, 'Vui lòng chọn ngày bạn muốn trải bài.');
      recordInvalid(dateInput);
    } else {
      setFieldError('date', dateInput, '');
    }

    if (name.length < 2) {
      setFieldError('name', nameInput, 'Vui lòng nhập tên hoặc biệt danh (ít nhất 2 ký tự).');
      recordInvalid(nameInput);
    } else {
      setFieldError('name', nameInput, '');
    }

    if (!isValidZalo(zalo)) {
      setFieldError(
        'zalo',
        zaloInput,
        'Vui lòng nhập số điện thoại Zalo hợp lệ (9–11 số) hoặc tên tài khoản Zalo.'
      );
      recordInvalid(zaloInput);
    } else {
      setFieldError('zalo', zaloInput, '');
    }

    if (email && !isValidEmail(email)) {
      setFieldError('email', emailInput, 'Email chưa đúng định dạng (ví dụ: ban@example.com).');
      recordInvalid(emailInput);
    } else {
      setFieldError('email', emailInput, '');
    }

    if (question.length < 10) {
      setFieldError(
        'question',
        questionInput,
        'Vui lòng chia sẻ ngắn gọn câu hỏi hoặc điều bạn băn khoăn (ít nhất 10 ký tự).'
      );
      recordInvalid(questionInput);
    } else {
      setFieldError('question', questionInput, '');
    }

    if (!age) {
      setFieldError('age', ageSelect, 'Vui lòng xác nhận độ tuổi của bạn.');
      recordInvalid(ageSelect);
    } else {
      setFieldError('age', ageSelect, '');
    }

    if (!termsAccepted) {
      setFieldError('terms', termsCheckbox, 'Vui lòng xác nhận bạn đã đọc lưu ý trước khi đặt lịch.');
      recordInvalid(termsCheckbox);
    } else {
      setFieldError('terms', termsCheckbox, '');
    }

    if (firstInvalid) {
      (firstInvalid as HTMLElement).focus();
      return;
    }

    const summaryText = [
      '✦ ĐẶT LỊCH TRẢI BÀI — LYLY ARCTURUS TAROT',
      `• Khách hàng: ${name} (${age})`,
      `• Zalo liên hệ: ${zalo}`,
      email ? `• Email: ${email}` : null,
      `• Chủ đề: ${service}`,
      `• Gói: ${durationMeta.label}`,
      `• Thời gian mong muốn: ${time}, ngày ${formatDateVi(date)}`,
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
          duration: durationMeta.label,
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
        <strong>${escapeHtml(service)}</strong> · ${escapeHtml(durationMeta.label)}<br>
        Ngày <strong>${escapeHtml(formatDateVi(date))}</strong> lúc <strong>${escapeHtml(time)}</strong> · Zalo: <strong>${escapeHtml(zalo)}</strong>
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
