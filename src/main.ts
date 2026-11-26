import './styles/tokens.css';
import './styles/base.css';
import './styles/sections.css';

import { SITE_CONFIG } from './data/config';
import { ZODIAC_SIGNS } from './data/zodiac';
import { FAQ_ITEMS, PRICING_TIERS, SERVICES } from './data/services';
import { GALLERY_CARD_IDS, MAJOR_ARCANA } from './data/tarotCards';
import { mountCelestialCanvas, type CelestialSceneHandle } from './components/celestialCanvas';
import { renderTarotBackMarkup, renderTarotFrontMarkup } from './components/tarotArt';
import { attachCardTilt } from './components/cardTilt';
import { initDrawSection } from './components/drawSection';
import { initBookingForm } from './components/bookingForm';
import { getInitialTheme, initThemeToggle } from './components/theme';

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
        if (serviceSelect) serviceSelect.value = svc.value;
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
        if (durationSelect) durationSelect.value = tier.duration;
        document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
      });
      pricingGrid.appendChild(card);
    });
  }

  if (priceNote) {
    priceNote.textContent = SITE_CONFIG.isDraftPricing
      ? '* Bảng giá tham khảo — có thể cập nhật trực tiếp trong src/data/services.ts.'
      : '* Giá áp dụng cho hình thức trải bài trực tiếp qua chat Zalo.';
  }
}

function renderGallery(): void {
  const row = document.getElementById('galleryRow');
  if (!row) return;

  GALLERY_CARD_IDS.forEach((id) => {
    const card = MAJOR_ARCANA.find((c) => c.id === id);
    if (!card) return;

    const item = document.createElement('div');
    item.className = 'gallery-card';
    item.innerHTML = `
      <button type="button" class="gallery-flip-btn js-tilt" aria-label="Lật lá bài ${card.nameEn}">
        <span class="card-3d-inner">
          <span class="card-face card-face-back">${renderTarotBackMarkup()}</span>
          <span class="card-face card-face-front">${renderTarotFrontMarkup(card)}</span>
        </span>
      </button>
      <p class="gallery-card-title">${card.nameEn}</p>
      <p class="gallery-card-hint">${card.nameVi} · Chạm để lật</p>
    `;

    const btn = item.querySelector<HTMLButtonElement>('.gallery-flip-btn');
    btn?.addEventListener('click', () => {
      btn.classList.toggle('is-flipped');
    });

    row.appendChild(item);
  });
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
  const toggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
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
  renderGallery();
  renderFaq();
  initMobileMenu();
  initScrollReveal();
  attachCardTilt('.js-tilt', 9);

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

bootstrap();
