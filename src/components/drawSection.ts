import { MAJOR_ARCANA, type TarotCard } from '../data/tarotCards';
import { renderTarotBackMarkup, renderTarotFrontMarkup } from './tarotArt';

const FAN_SIZE = 7;

function shuffleCards(deck: TarotCard[]): TarotCard[] {
  const copy = [...deck];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, FAN_SIZE);
}

export function initDrawSection(): void {
  const stage = document.getElementById('cardStage');
  const drawBtn = document.getElementById('drawBtn') as HTMLButtonElement | null;
  const shuffleBtn = document.getElementById('shuffleBtn') as HTMLButtonElement | null;
  const outcome = document.getElementById('drawOutcome');
  if (!stage || !drawBtn || !outcome) return;

  let spread: TarotCard[] = shuffleCards(MAJOR_ARCANA);
  let selectedIndex = 3;
  let flippedIndex: number | null = null;

  const renderSpread = (animateShuffle = false) => {
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
      const slot = i - 3; // -3 .. +3
      btn.style.cssText = `--slot:${slot};--drop:${drops[i]}px;--rotate:${rotates[i]}deg;--brightness:${i === selectedIndex ? 1.08 : 0.86};z-index:${10 - Math.abs(slot)}`;
      btn.setAttribute('aria-label', `Chọn lá bài số ${i + 1}`);
      btn.setAttribute('aria-pressed', String(i === selectedIndex));

      btn.innerHTML = `
        <span class="card-3d-inner">
          <span class="card-face card-face-back">${renderTarotBackMarkup()}</span>
          <span class="card-face card-face-front">${renderTarotFrontMarkup(card)}</span>
        </span>
      `;

      btn.addEventListener('click', () => {
        if (flippedIndex === i) return;
        if (selectedIndex === i && flippedIndex === null) {
          revealSelected();
          return;
        }
        selectedIndex = i;
        flippedIndex = null;
        outcome.classList.remove('show');
        updateCardStates();
      });

      stage.appendChild(btn);
    });

    updateCardStates();
  };

  const updateCardStates = () => {
    const cards = stage.querySelectorAll<HTMLButtonElement>('.pick-card');
    cards.forEach((el, idx) => {
      const isSelected = idx === selectedIndex;
      const isFlipped = idx === flippedIndex;
      el.classList.toggle('selected', isSelected);
      el.classList.toggle('flipped', isFlipped);
      el.setAttribute('aria-pressed', String(isSelected));
      const slot = idx - 3;
      el.style.zIndex = isFlipped ? '30' : isSelected ? '20' : String(10 - Math.abs(slot));
    });
    drawBtn.textContent =
      flippedIndex !== null ? '✦ Đã lật lá bài của bạn' : '✦ Lật lá bài đã chọn';
    drawBtn.disabled = flippedIndex !== null;
  };

  const revealSelected = () => {
    flippedIndex = selectedIndex;
    const card = spread[selectedIndex];
    updateCardStates();

    outcome.innerHTML = `
      <div class="eyebrow">YOUR CARD MESSAGE · ${card.numeral}</div>
      <h3>${card.nameEn} — ${card.nameVi}</h3>
      <p class="outcome-keywords">${card.keywords}</p>
      <p class="outcome-meaning">${card.meaning}</p>
      <p class="outcome-prompt">✧ ${card.prompt}</p>
      <p class="outcome-note">Thông điệp chiêm nghiệm ngẫu nhiên từ 22 lá Ẩn Chính, không phải dự đoán tương lai.</p>
    `;
    outcome.classList.add('show');
    outcome.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  drawBtn.addEventListener('click', revealSelected);

  shuffleBtn?.addEventListener('click', () => {
    spread = shuffleCards(MAJOR_ARCANA);
    selectedIndex = 3;
    flippedIndex = null;
    outcome.classList.remove('show');
    renderSpread(true);
  });

  renderSpread(false);
}
