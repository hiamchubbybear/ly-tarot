import { MAJOR_ARCANA, type TarotCard } from '../data/tarotCards';
import { renderTarotBackMarkup, renderTarotFrontMarkup } from './tarotArt';

const FAN_SIZE = 7;
const SPREAD_POSITIONS = ['Quá khứ', 'Hiện tại', 'Tương lai'] as const;

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

interface DrawnEntry {
  card: TarotCard;
  slotIndex: number;
  reversed: boolean;
}

function shuffleCards(deck: TarotCard[]): TarotCard[] {
  const copy = [...deck];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, FAN_SIZE);
}

function mapIntentionToService(intention: string): string | null {
  const text = intention.toLowerCase();
  if (text.includes('tình yêu') || text.includes('tình cảm') || text.includes('người ấy')) return 'Tình yêu';
  if (text.includes('sự nghiệp') || text.includes('công việc') || text.includes('học tập')) return 'Sự nghiệp';
  if (text.includes('chữa lành') || text.includes('bản thân') || text.includes('nội tâm')) return 'Khám phá bản thân';
  if (text.includes('năng lượng') || text.includes('hôm nay') || text.includes('tổng quan')) return 'Tổng quan';
  return null;
}

export function initDrawSection(): void {
  const stage = document.getElementById('cardStage');
  const drawBtn = document.getElementById('drawBtn') as HTMLButtonElement | null;
  const shuffleBtn = document.getElementById('shuffleBtn') as HTMLButtonElement | null;
  const outcome = document.getElementById('drawOutcome');
  const intentionInput = document.getElementById('drawIntention') as HTMLInputElement | null;
  const topicChips = document.querySelectorAll<HTMLButtonElement>('#drawTopicChips .chip-pill');
  const modeButtons = document.querySelectorAll<HTMLButtonElement>('#spreadModeGroup .mode-pill');
  const reversedToggle = document.getElementById('reversedToggle') as HTMLButtonElement | null;

  if (!stage || !drawBtn || !outcome) return;

  let spread: TarotCard[] = shuffleCards(MAJOR_ARCANA);
  let spreadCount: 1 | 3 = 1;
  let allowReversed = false;
  let selectedIndex = 3;
  let drawnEntries: DrawnEntry[] = [];

  const getFlippedSet = (): Set<number> => new Set(drawnEntries.map((d) => d.slotIndex));

  const formatSummaryText = (): string => {
    const intention = intentionInput?.value.trim() ?? '';
    const lines: string[] = ['✦ THÔNG ĐIỆP TAROT — LYLY ARCTURUS TAROT'];
    if (intention) {
      lines.push(`• Điều chiêm nghiệm: ${intention}`);
    }
    drawnEntries.forEach((entry, idx) => {
      const posLabel = spreadCount === 3 ? `[${SPREAD_POSITIONS[idx]}] ` : '';
      const revLabel = entry.reversed ? ' (Ngược · Reversed)' : '';
      lines.push(`• ${posLabel}${entry.card.numeral}. ${entry.card.nameEn} — ${entry.card.nameVi}${revLabel}`);
      lines.push(`  Từ khóa: ${entry.card.keywords}`);
      lines.push(`  Gợi mở: ${entry.card.meaning}`);
      if (entry.reversed) {
        lines.push(
          '  Năng lượng đảo chiều: Hãy chậm lại một nhịp để quan sát điều gì đang hướng nội hoặc cần được điều chỉnh từ bên trong.'
        );
      }
      lines.push(`  Câu hỏi tự vấn: ${entry.card.prompt}`);
    });
    return lines.join('\n');
  };

  const renderOutcome = (): void => {
    if (drawnEntries.length === 0) {
      outcome.classList.remove('show');
      outcome.innerHTML = '';
      return;
    }

    const intention = intentionInput?.value.trim() ?? '';
    const intentionHtml = intention
      ? `<div class="outcome-intention"><span>Điều bạn gửi gắm:</span> “${escapeHtml(intention)}”</div>`
      : '';

    const cardsHtml = drawnEntries
      .map((entry, idx) => {
        const posBadge =
          spreadCount === 3
            ? `<span class="outcome-pos-badge">${SPREAD_POSITIONS[idx] ?? `Lá ${idx + 1}`}</span>`
            : '';
        const revBadge = entry.reversed
          ? '<span class="outcome-rev-badge">↻ Ngược (Reversed)</span>'
          : '';
        const revNote = entry.reversed
          ? `<p class="outcome-reversed-note">↻ <strong>Góc nhìn lá ngược:</strong> Năng lượng của lá bài đang mời bạn hướng vào bên trong — chậm lại một nhịp để nhận diện điều gì đang bị kìm nén hoặc cần điều chỉnh nhẹ nhàng.</p>`
          : '';

        return `
          <article class="outcome-card-item">
            <div class="outcome-badges">
              ${posBadge}
              <span class="eyebrow">${entry.card.numeral}</span>
              ${revBadge}
            </div>
            <h3>${entry.card.nameEn} — ${entry.card.nameVi}</h3>
            <p class="outcome-keywords">${entry.card.keywords}</p>
            <p class="outcome-meaning">${entry.card.meaning}</p>
            ${revNote}
            <p class="outcome-prompt">✧ ${entry.card.prompt}</p>
          </article>
        `;
      })
      .join('');

    const isComplete = drawnEntries.length >= spreadCount;
    const actionsHtml = isComplete
      ? `
        <div class="outcome-actions">
          <button type="button" class="btn ghost small" id="copyDrawBtn">Sao chép thông điệp</button>
          <button type="button" class="btn small" id="bookWithDrawBtn">Đặt lịch với trải bài này ↗</button>
        </div>
      `
      : `<p class="outcome-progress-hint">Hãy chọn và lật tiếp lá bài thứ ${drawnEntries.length + 1}/${spreadCount} ở phía trên ✧</p>`;

    outcome.innerHTML = `
      <div class="eyebrow">YOUR CARD MESSAGE · ${spreadCount === 3 ? 'TRẢI BÀI 3 LÁ' : 'THÔNG ĐIỆP 1 LÁ'}</div>
      ${intentionHtml}
      <div class="outcome-cards-list ${spreadCount === 3 ? 'is-three' : ''}">
        ${cardsHtml}
      </div>
      ${actionsHtml}
      <p class="outcome-note">Thông điệp chiêm nghiệm ngẫu nhiên từ 22 lá Ẩn Chính, không phải dự đoán tương lai.</p>
    `;

    outcome.classList.add('show');

    const copyBtn = document.getElementById('copyDrawBtn');
    copyBtn?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(formatSummaryText());
        copyBtn.textContent = '✓ Đã sao chép thông điệp';
        window.setTimeout(() => {
          copyBtn.textContent = 'Sao chép thông điệp';
        }, 2500);
      } catch {
        copyBtn.textContent = 'Không thể tự động sao chép';
      }
    });

    const bookBtn = document.getElementById('bookWithDrawBtn');
    bookBtn?.addEventListener('click', () => {
      const questionEl = document.getElementById('question') as HTMLTextAreaElement | null;
      const serviceEl = document.getElementById('service') as HTMLSelectElement | null;
      const bookingSection = document.getElementById('booking');

      const summaryCards = drawnEntries
        .map((e, i) => {
          const pos = spreadCount === 3 ? `${SPREAD_POSITIONS[i]}: ` : '';
          const rev = e.reversed ? ' (Ngược)' : '';
          return `${pos}${e.card.nameEn} (${e.card.nameVi})${rev}`;
        })
        .join(' | ');

      if (questionEl) {
        const prefix = intention ? `Điều mình muốn hỏi: ${intention}\n` : '';
        questionEl.value = `${prefix}Mình vừa rút được trải bài: ${summaryCards}. Mình muốn cùng Lyly đào sâu thêm thông điệp này.`;
        questionEl.dispatchEvent(new Event('input', { bubbles: true }));
      }

      if (serviceEl && intention) {
        const matched = mapIntentionToService(intention);
        if (matched) {
          serviceEl.value = matched;
          serviceEl.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }

      bookingSection?.scrollIntoView({ behavior: 'smooth' });
      window.setTimeout(() => questionEl?.focus(), 500);
    });
  };

  const updateCardStates = (): void => {
    const flippedMap = new Map(drawnEntries.map((e) => [e.slotIndex, e]));
    const cards = stage.querySelectorAll<HTMLButtonElement>('.pick-card');

    cards.forEach((el, idx) => {
      const entry = flippedMap.get(idx);
      const isSelected = idx === selectedIndex;
      const isFlipped = Boolean(entry);
      el.classList.toggle('selected', isSelected);
      el.classList.toggle('flipped', isFlipped);
      el.classList.toggle('is-reversed', Boolean(entry?.reversed));
      el.setAttribute('aria-pressed', String(isSelected || isFlipped));
      const slot = idx - 3;
      el.style.zIndex = isFlipped ? String(30 + idx) : isSelected ? '20' : String(10 - Math.abs(slot));
    });

    stage.classList.toggle('is-three-mode', spreadCount === 3);

    const remaining = spreadCount - drawnEntries.length;
    if (remaining <= 0) {
      drawBtn.textContent =
        spreadCount === 3 ? '✦ Đã hoàn thành trải bài 3 lá' : '✦ Đã lật lá bài của bạn';
      drawBtn.disabled = true;
    } else {
      drawBtn.textContent =
        spreadCount === 3
          ? `✦ Lật lá bài ${drawnEntries.length + 1}/${spreadCount} (${SPREAD_POSITIONS[drawnEntries.length]})`
          : '✦ Lật lá bài đã chọn';
      drawBtn.disabled = getFlippedSet().has(selectedIndex);
    }
  };

  const revealIndex = (index: number): void => {
    if (drawnEntries.length >= spreadCount) return;
    if (getFlippedSet().has(index)) return;

    const card = spread[index];
    const reversed = allowReversed ? Math.random() < 0.35 : false;
    drawnEntries.push({ card, slotIndex: index, reversed });

    updateCardStates();
    renderOutcome();

    if (drawnEntries.length >= spreadCount) {
      outcome.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      // Auto-advance selection to nearest unflipped card for smooth keyboard/click flow
      const flipped = getFlippedSet();
      const nextIdx = spread.findIndex((_, idx) => !flipped.has(idx) && idx > index);
      const prevIdx = spread.findIndex((_, idx) => !flipped.has(idx));
      if (nextIdx !== -1) selectedIndex = nextIdx;
      else if (prevIdx !== -1) selectedIndex = prevIdx;
      updateCardStates();
    }
  };

  const renderSpread = (animateShuffle = false): void => {
    stage.innerHTML = '';
    if (animateShuffle) {
      stage.classList.add('is-shuffling');
      window.setTimeout(() => stage.classList.remove('is-shuffling'), 420);
    }

    const drops = [56, 30, 10, 0, 10, 30, 56];
    const rotates = [-15, -10, -5, 0, 5, 10, 15];

    spread.forEach((card, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pick-card' + (i === selectedIndex ? ' selected' : '');
      const slot = i - 3;
      btn.style.cssText = `--slot:${slot};--drop:${drops[i]}px;--rotate:${rotates[i]}deg;--brightness:${i === selectedIndex ? 1.08 : 0.86};z-index:${10 - Math.abs(slot)}`;
      btn.setAttribute('aria-label', `Lá bài số ${i + 1} trong quạt bài`);
      btn.setAttribute('aria-pressed', String(i === selectedIndex));

      btn.innerHTML = `
        <span class="card-3d-inner">
          <span class="card-face card-face-back">${renderTarotBackMarkup()}</span>
          <span class="card-face card-face-front">${renderTarotFrontMarkup(card)}</span>
        </span>
      `;

      btn.addEventListener('click', () => {
        if (getFlippedSet().has(i) || drawnEntries.length >= spreadCount) return;
        if (selectedIndex === i) {
          revealIndex(i);
          return;
        }
        selectedIndex = i;
        updateCardStates();
      });

      btn.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          selectedIndex = (i - 1 + FAN_SIZE) % FAN_SIZE;
          updateCardStates();
          stage.querySelectorAll<HTMLButtonElement>('.pick-card')[selectedIndex]?.focus();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          selectedIndex = (i + 1) % FAN_SIZE;
          updateCardStates();
          stage.querySelectorAll<HTMLButtonElement>('.pick-card')[selectedIndex]?.focus();
        }
      });

      stage.appendChild(btn);
    });

    updateCardStates();
  };

  const resetSpread = (animate = true): void => {
    spread = shuffleCards(MAJOR_ARCANA);
    selectedIndex = 3;
    drawnEntries = [];
    renderOutcome();
    renderSpread(animate);
  };

  // Topic chips sync
  topicChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const topic = chip.dataset.topic ?? '';
      const isAlreadyActive = chip.getAttribute('aria-pressed') === 'true';
      topicChips.forEach((c) => {
        c.classList.remove('active');
        c.setAttribute('aria-pressed', 'false');
      });

      if (!isAlreadyActive && intentionInput) {
        chip.classList.add('active');
        chip.setAttribute('aria-pressed', 'true');
        intentionInput.value = topic;
      } else if (intentionInput && intentionInput.value.trim() === topic) {
        intentionInput.value = '';
      }
    });
  });

  // Spread mode toggle
  modeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextMode = btn.dataset.mode === '3' ? 3 : 1;
      if (nextMode === spreadCount) return;
      spreadCount = nextMode;
      modeButtons.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      resetSpread(true);
    });
  });

  // Reversed toggle
  reversedToggle?.addEventListener('click', () => {
    allowReversed = !allowReversed;
    reversedToggle.classList.toggle('active', allowReversed);
    reversedToggle.setAttribute('aria-pressed', String(allowReversed));
  });

  drawBtn.addEventListener('click', () => {
    revealIndex(selectedIndex);
  });

  shuffleBtn?.addEventListener('click', () => {
    resetSpread(true);
  });

  renderSpread(false);
}
