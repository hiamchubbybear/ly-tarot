import './styles/tokens.css';
import './styles/base.css';
import './styles/sections.css';

import { SITE_CONFIG } from './data/config';
import { ZODIAC_SIGNS } from './data/zodiac';
import { FAQ_ITEMS, PRICING_TIERS, SERVICES } from './data/services';
import { MAJOR_ARCANA, type TarotCard } from './data/tarotCards';
import { mountCelestialCanvas, type CelestialSceneHandle } from './components/celestialCanvas';
import { renderTarotBackMarkup, renderTarotFrontMarkup } from './components/tarotArt';
import { attachCardTilt } from './components/cardTilt';
import { initDrawSection } from './components/drawSection';
import { initBookingForm } from './components/bookingForm';
import { getInitialTheme, initThemeToggle } from './components/theme';

const FEATURED_IDS = new Set(['star', 'moon', 'sun', 'empress', 'lovers', 'world']);
const LIGHT_IDS = new Set(['fool', 'magician', 'empress', 'emperor', 'chariot', 'strength', 'sun', 'world']);
const INTUITION_IDS = new Set([
  'high-priestess',
  'hierophant',
  'lovers',
  'hermit',
  'wheel',
  'justice',
  'hanged-man',
  'death',
  'temperance',
  'devil',
  'tower',
  'star',
  'moon',
  'judgement',
]);

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}

function renderHeroCards(): void {
  const cards = document.querySelectorAll<HTMLElement>('#heroVisual .floating-card');
  cards.forEach((card) => {
    card.innerHTML = renderTarotBackMarkup();
  });
}

function renderZodiac(): void {
  const row = document.getElementById('zodiacRow');
  const caption = document.getElementById('zodiacCaption');
  if (!row || !caption) return;

  ZODIAC_SIGNS.forEach((sign) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'zodiac-tile';
    btn.setAttribute('aria-label', `${sign.vi} (${sign.en})`);
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="${sign.svgPath}"/>
      </svg>
      <span>${sign.en}</span>
    `;

    btn.addEventListener('click', () => {
      row.querySelectorAll('.zodiac-tile').forEach((el) => el.classList.remove('active'));
      btn.classList.add('active');
      caption.textContent = `✧ ${sign.vi} (Nguyên tố ${sign.element}) — ${sign.reflection}`;
    });

    row.appendChild(btn);
  });
}

function renderServicesAndPricing(): void {
  const serviceGrid = document.getElementById('serviceGrid');
  const pricingGrid = document.getElementById('pricingGrid');
  const priceNote = document.getElementById('priceNote');
  const serviceSelect = document.getElementById('service') as HTMLSelectElement | null;
  const durationSelect = document.getElementById('duration') as HTMLSelectElement | null;

  if (serviceGrid) {
    SERVICES.forEach((svc) => {
      const card = document.createElement('article');
      card.className = 'service-card';
      card.innerHTML = `
        <svg class="symbol" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          ${svc.iconSvg}
        </svg>
        <h3>${svc.title}</h3>
        <p>${svc.description}</p>
        <a href="#booking">Khám phá &amp; đặt lịch ↗</a>
      `;
      card.querySelector('a')?.addEventListener('click', () => {
        if (serviceSelect) {
          serviceSelect.value = svc.value;
          serviceSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
      serviceGrid.appendChild(card);
    });
  }

  if (pricingGrid) {
    PRICING_TIERS.forEach((tier) => {
      const card = document.createElement('div');
      card.className = 'price-card' + (tier.featured ? ' featured' : '');
      card.innerHTML = `
        ${tier.badge ? `<div class="eyebrow" style="margin-bottom:8px">${tier.badge}</div>` : ''}
        <div class="tier">${tier.name}</div>
        <div class="amount">${tier.price}</div>
        <div class="length">${tier.lengthLabel}</div>
        <p>${tier.description}</p>
        <button type="button" class="btn ${tier.featured ? '' : 'ghost'}">Chọn gói</button>
      `;
      card.querySelector('button')?.addEventListener('click', () => {
        if (durationSelect) {
          durationSelect.value = tier.duration;
          durationSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
        document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
      });
      pricingGrid.appendChild(card);
    });
  }

  if (priceNote) {
    priceNote.textContent = SITE_CONFIG.isDraftPricing
      ? '* Bảng giá tham khảo — có thể điều chỉnh linh hoạt tùy theo chủ đề và thời lượng trao đổi thực tế.'
      : '* Giá áp dụng cho hình thức trải bài trực tiếp qua chat Zalo.';
  }
}

function initGalleryAndModal(): void {
  const row = document.getElementById('galleryRow');
  const searchInput = document.getElementById('gallerySearch') as HTMLInputElement | null;
  const filterButtons = document.querySelectorAll<HTMLButtonElement>('#galleryFilters .chip-pill');
  const emptyState = document.getElementById('galleryEmpty');

  const modal = document.getElementById('cardModal');
  const modalBackdrop = document.getElementById('cardModalBackdrop');
  const modalClose = document.getElementById('cardModalClose') as HTMLButtonElement | null;
  const modalBody = document.getElementById('cardModalBody');

  if (!row) return;

  let activeFilter = 'all';
  let searchQuery = '';
  let lastTriggerEl: HTMLElement | null = null;

  const openModal = (card: TarotCard, trigger?: HTMLElement | null): void => {
    if (!modal || !modalBody) return;
    lastTriggerEl = trigger ?? null;

    modalBody.innerHTML = `
      <div class="modal-card-art">
        ${renderTarotFrontMarkup(card)}
      </div>
      <div class="modal-card-info">
        <div class="eyebrow">MAJOR ARCANA · ${card.numeral}</div>
        <h3 id="cardModalTitle">${card.nameEn}</h3>
        <p class="modal-card-vi">${card.nameVi}</p>
        <p class="modal-card-keywords">${card.keywords}</p>
        <p class="modal-card-meaning">${card.meaning}</p>
        <div class="modal-card-prompt">
          <span>✧ Gợi mở chiêm nghiệm</span>
          <p>${card.prompt}</p>
        </div>
      </div>
    `;

    modal.hidden = false;
    document.body.classList.add('modal-open');
    window.requestAnimationFrame(() => {
      modal.classList.add('open');
      modalClose?.focus();
    });
  };

  const closeModal = (): void => {
    if (!modal || modal.hidden) return;
    modal.classList.remove('open');
    document.body.classList.remove('modal-open');
    window.setTimeout(() => {
      modal.hidden = true;
      lastTriggerEl?.focus();
      lastTriggerEl = null;
    }, 200);
  };

  modalClose?.addEventListener('click', closeModal);
  modalBackdrop?.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (!modal || modal.hidden) return;
    if (e.key === 'Escape') {
      closeModal();
      return;
    }
    if (e.key === 'Tab') {
      const focusable = Array.from(
        modal.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && (document.activeElement === first || !modal.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !modal.contains(document.activeElement))) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  const matchesFilter = (card: TarotCard): boolean => {
    if (activeFilter === 'featured') return FEATURED_IDS.has(card.id);
    if (activeFilter === 'light') return LIGHT_IDS.has(card.id);
    if (activeFilter === 'intuition') return INTUITION_IDS.has(card.id);
    return true;
  };

  const matchesSearch = (card: TarotCard): boolean => {
    if (!searchQuery) return true;
    const q = normalizeText(searchQuery);
    const haystack = normalizeText(`${card.numeral} ${card.nameEn} ${card.nameVi} ${card.keywords}`);
    return haystack.includes(q);
  };

  const renderCards = (): void => {
    row.innerHTML = '';
    const filtered = MAJOR_ARCANA.filter((c) => matchesFilter(c) && matchesSearch(c));

    if (emptyState) {
      emptyState.hidden = filtered.length > 0;
    }

    filtered.forEach((card) => {
      const item = document.createElement('article');
      item.className = 'gallery-card';
      item.innerHTML = `
        <button type="button" class="gallery-flip-btn js-tilt" aria-label="Lật lá bài ${card.nameEn} (${card.nameVi})">
          <span class="card-3d-inner">
            <span class="card-face card-face-back">${renderTarotBackMarkup()}</span>
            <span class="card-face card-face-front">${renderTarotFrontMarkup(card)}</span>
          </span>
        </button>
        <p class="gallery-card-title">${card.nameEn}</p>
        <p class="gallery-card-hint">${card.numeral} · ${card.nameVi}</p>
        <button type="button" class="gallery-detail-btn" aria-label="Xem chi tiết lá bài ${card.nameEn}">
          Xem chi tiết ✦
        </button>
      `;

      const flipBtn = item.querySelector<HTMLButtonElement>('.gallery-flip-btn');
      flipBtn?.addEventListener('click', () => {
        flipBtn.classList.toggle('is-flipped');
      });

      const detailBtn = item.querySelector<HTMLButtonElement>('.gallery-detail-btn');
      detailBtn?.addEventListener('click', () => {
        openModal(card, detailBtn);
      });

      row.appendChild(item);
    });

    attachCardTilt('#galleryRow .js-tilt', 9);
  };

  searchInput?.addEventListener('input', () => {
    searchQuery = searchInput.value.trim();
    renderCards();
  });

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      activeFilter = btn.dataset.filter ?? 'all';
      filterButtons.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      renderCards();
    });
  });

  renderCards();
}

function renderFaq(): void {
  const list = document.getElementById('faqList');
  if (!list) return;

  FAQ_ITEMS.forEach((item) => {
    const details = document.createElement('details');
    details.innerHTML = `
      <summary>${item.question}</summary>
      <p>${item.answer}</p>
    `;
    list.appendChild(details);
  });
}

function initMobileMenu(): void {
  const toggle = document.getElementById('menuToggle') as HTMLButtonElement | null;
  const navLinks = document.getElementById('navLinks');
  if (!toggle || !navLinks) return;

  const setOpen = (open: boolean, restoreFocus = false): void => {
    navLinks.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
    document.body.classList.toggle('menu-open', open);
    if (!open && restoreFocus) {
      toggle.focus();
    }
  };

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navLinks.classList.contains('open');
    setOpen(!isOpen);
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('click', (e) => {
    if (!navLinks.classList.contains('open')) return;
    const target = e.target as Node;
    if (!navLinks.contains(target) && !toggle.contains(target)) {
      setOpen(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      setOpen(false, true);
    }
  });
}

function initScrollSpy(): void {
  const navAnchors = Array.from(document.querySelectorAll<HTMLAnchorElement>('.nav-links a[href^="#"]'));
  if (navAnchors.length === 0) return;

  const sectionIds = navAnchors
    .map((a) => a.getAttribute('href')?.slice(1) ?? '')
    .filter(Boolean);
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => Boolean(el));

  if (sections.length === 0 || !('IntersectionObserver' in window)) return;

  const setActiveLink = (id: string) => {
    navAnchors.forEach((a) => {
      const match = a.getAttribute('href') === `#${id}`;
      a.classList.toggle('active', match);
      if (match) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]?.target.id) {
        setActiveLink(visible[0].target.id);
      }
    },
    {
      rootMargin: '-25% 0px -55% 0px',
      threshold: [0.1, 0.3, 0.6],
    }
  );

  sections.forEach((sec) => observer.observe(sec));
}

function initBackToTop(): void {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const toggleVisibility = () => {
    btn.classList.toggle('visible', window.scrollY > 420);
  };

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initScrollReveal(): void {
  const elements = document.querySelectorAll<HTMLElement>('.reveal');
  if (!('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach((el) => observer.observe(el));
}

function bootstrap(): void {
  const canvas = document.getElementById('celestialCanvas') as HTMLCanvasElement | null;
  let celestial: CelestialSceneHandle | null = null;
  if (canvas) {
    try {
      celestial = mountCelestialCanvas(canvas, getInitialTheme());
    } catch {
      // Gracefully fall back to pure CSS aura if WebGL is unavailable
    }
  }

  initThemeToggle((theme) => {
    celestial?.setTheme(theme);
  });

  renderHeroCards();
  renderZodiac();
  initDrawSection();
  renderServicesAndPricing();
  initBookingForm();
  initGalleryAndModal();
  renderFaq();
  initMobileMenu();
  initScrollSpy();
  initBackToTop();
  initScrollReveal();
  attachCardTilt('#heroVisual .js-tilt', 9);

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

bootstrap();
