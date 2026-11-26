import type { TarotCard } from '../data/tarotCards';

let svgInstanceCounter = 0;

/**
 * Crisp inline SVG artwork for the midnight-blue & gold Tarot card back.
 * Generates unique gradient IDs per instance to avoid duplicate DOM IDs.
 */
export function renderTarotBackMarkup(): string {
  const uid = ++svgInstanceCounter;
  const bgId = `tbBg-${uid}`;
  const goldId = `tbGold-${uid}`;

  return `
    <div class="tarot-back" aria-hidden="true">
      <svg class="tarot-svg" viewBox="0 0 220 330" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="${bgId}" cx="50%" cy="48%" r="65%">
            <stop offset="0%" stop-color="#29486b"/>
            <stop offset="45%" stop-color="#14294a"/>
            <stop offset="100%" stop-color="#091026"/>
          </radialGradient>
          <linearGradient id="${goldId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f7e7b9"/>
            <stop offset="50%" stop-color="#ddc38a"/>
            <stop offset="100%" stop-color="#b49154"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="220" height="330" rx="10" fill="url(#${bgId})"/>
        <!-- Outer & inner filigree borders -->
        <rect x="8" y="8" width="204" height="314" rx="6" stroke="url(#${goldId})" stroke-width="1.2" opacity="0.9"/>
        <rect x="15" y="15" width="190" height="300" rx="4" stroke="url(#${goldId})" stroke-width="0.7" opacity="0.55"/>
        <!-- Celestial oval frame -->
        <ellipse cx="110" cy="165" rx="74" ry="122" stroke="url(#${goldId})" stroke-width="0.9" opacity="0.65"/>
        <ellipse cx="110" cy="165" rx="66" ry="114" stroke="url(#${goldId})" stroke-width="0.45" stroke-dasharray="3 4" opacity="0.45"/>
        <!-- Corner diamonds -->
        <path d="M24 24l3 4-3 4-3-4 3-4ZM196 24l3 4-3 4-3-4 3-4ZM24 298l3 4-3 4-3-4 3-4ZM196 298l3 4-3 4-3-4 3-4Z" fill="#e6ce91" opacity="0.8"/>
        <!-- Top crescent & stars -->
        <path d="M114 54a11 11 0 1 0 7.2 19.2 9 9 0 1 1-7.2-19.2Z" fill="url(#${goldId})"/>
        <path d="M84 62l1.8 4 4 1.8-4 1.8-1.8 4-1.8-4-4-1.8 4-1.8 1.8-4ZM136 62l1.8 4 4 1.8-4 1.8-1.8 4-1.8-4-4-1.8 4-1.8 1.8-4Z" fill="#f3e1b2" opacity="0.85"/>
        <!-- Central radiant sun / Arcturus star -->
        <circle cx="110" cy="165" r="44" stroke="url(#${goldId})" stroke-width="1.1" opacity="0.85"/>
        <circle cx="110" cy="165" r="52" stroke="url(#${goldId})" stroke-width="0.5" opacity="0.4"/>
        <g stroke="url(#${goldId})" stroke-width="1" stroke-linecap="round" opacity="0.9">
          <line x1="110" y1="127" x2="110" y2="141"/>
          <line x1="110" y1="189" x2="110" y2="203"/>
          <line x1="72" y1="165" x2="86" y2="165"/>
          <line x1="134" y1="165" x2="148" y2="165"/>
          <line x1="83" y1="138" x2="93" y2="148"/>
          <line x1="127" y1="182" x2="137" y2="192"/>
          <line x1="137" y1="138" x2="127" y2="148"/>
          <line x1="93" y1="182" x2="83" y2="192"/>
        </g>
        <path d="M110 138l6 21 21 6-21 6-6 21-6-21-21-6 21-6 6-21Z" fill="url(#${goldId})" opacity="0.95"/>
        <circle cx="110" cy="165" r="6" fill="#0e1b35" stroke="#f7e7b9" stroke-width="1"/>
        <!-- Bottom constellation -->
        <circle cx="90" cy="264" r="1.8" fill="#f3e1b2"/>
        <circle cx="110" cy="258" r="2.4" fill="#f7e7b9"/>
        <circle cx="130" cy="264" r="1.8" fill="#f3e1b2"/>
        <path d="M90 264L110 258L130 264" stroke="#ddc38a" stroke-width="0.7" opacity="0.65"/>
        <path d="M110 272l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z" fill="#e6ce91" opacity="0.85"/>
      </svg>
      <div class="card-foil"></div>
    </div>
  `;
}

function getEmblemSvg(emblem: TarotCard['emblem']): string {
  switch (emblem) {
    case 'star':
      return `
        <circle cx="110" cy="152" r="40" stroke="currentColor" stroke-width="0.9" stroke-dasharray="3 4" opacity="0.55"/>
        <path d="M110 104l9 39 39 9-39 9-9 39-9-39-39-9 39-9 9-39Z" fill="currentColor" opacity="0.92"/>
        <circle cx="72" cy="116" r="2.2" fill="currentColor"/><circle cx="148" cy="118" r="2.2" fill="currentColor"/>
        <circle cx="78" cy="190" r="1.8" fill="currentColor"/><circle cx="144" cy="186" r="2" fill="currentColor"/>
      `;
    case 'moon':
      return `
        <circle cx="110" cy="152" r="42" stroke="currentColor" stroke-width="0.8" opacity="0.45"/>
        <path d="M122 114a38 38 0 1 0 24 66 31 31 0 1 1-24-66Z" fill="currentColor" opacity="0.92"/>
        <path d="M138 124l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z" fill="currentColor" opacity="0.85"/>
      `;
    case 'sun':
      return `
        <circle cx="110" cy="152" r="24" fill="currentColor" opacity="0.9"/>
        <circle cx="110" cy="152" r="34" stroke="currentColor" stroke-width="1" opacity="0.65"/>
        <g stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
          <line x1="110" y1="102" x2="110" y2="116"/><line x1="110" y1="188" x2="110" y2="202"/>
          <line x1="60" y1="152" x2="74" y2="152"/><line x1="146" y1="152" x2="160" y2="152"/>
          <line x1="75" y1="117" x2="85" y2="127"/><line x1="135" y1="177" x2="145" y2="187"/>
          <line x1="145" y1="117" x2="135" y2="127"/><line x1="85" y1="177" x2="75" y2="187"/>
        </g>
      `;
    case 'crown':
      return `
        <path d="M68 178L78 134l22 22 10-32 10 32 22-22 10 44H68Z" stroke="currentColor" stroke-width="1.8" fill="currentColor" fill-opacity="0.18"/>
        <circle cx="110" cy="116" r="4" fill="currentColor"/>
        <circle cx="76" cy="128" r="3" fill="currentColor"/><circle cx="144" cy="128" r="3" fill="currentColor"/>
        <line x1="70" y1="188" x2="150" y2="188" stroke="currentColor" stroke-width="1.3"/>
      `;
    case 'chalice':
      return `
        <path d="M80 120h60c0 28-14 44-30 44s-30-16-30-44Z" stroke="currentColor" stroke-width="1.8" fill="currentColor" fill-opacity="0.14"/>
        <line x1="110" y1="164" x2="110" y2="194" stroke="currentColor" stroke-width="1.8"/>
        <path d="M88 194h44" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M110 104l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z" fill="currentColor"/>
      `;
    case 'flame':
      return `
        <path d="M110 106c14 20 30 34 30 56a30 30 0 1 1-60 0c0-22 16-36 30-56Z" stroke="currentColor" stroke-width="1.7" fill="currentColor" fill-opacity="0.16"/>
        <path d="M110 138c8 10 14 18 14 28a14 14 0 1 1-28 0c0-10 6-18 14-28Z" fill="currentColor" opacity="0.85"/>
      `;
    case 'scales':
      return `
        <line x1="110" y1="110" x2="110" y2="194" stroke="currentColor" stroke-width="1.6"/>
        <line x1="72" y1="130" x2="148" y2="130" stroke="currentColor" stroke-width="1.6"/>
        <path d="M72 130l-12 28h24l-12-28ZM148 130l-12 28h24l-12-28Z" stroke="currentColor" stroke-width="1.3" fill="currentColor" fill-opacity="0.15"/>
        <line x1="88" y1="194" x2="132" y2="194" stroke="currentColor" stroke-width="1.8"/>
      `;
    case 'compass':
      return `
        <circle cx="110" cy="152" r="40" stroke="currentColor" stroke-width="1.3"/>
        <polygon points="110,108 119,152 110,196 101,152" fill="currentColor" opacity="0.85"/>
        <polygon points="66,152 110,143 154,152 110,161" stroke="currentColor" stroke-width="1.1" fill="currentColor" fill-opacity="0.22"/>
      `;
    case 'eye':
      return `
        <path d="M62 152c16-24 34-34 48-34s32 10 48 34c-16 24-34 34-48 34s-32-10-48-34Z" stroke="currentColor" stroke-width="1.7" fill="currentColor" fill-opacity="0.12"/>
        <circle cx="110" cy="152" r="16" stroke="currentColor" stroke-width="1.5"/>
        <circle cx="110" cy="152" r="6" fill="currentColor"/>
      `;
    case 'wheel':
      return `
        <circle cx="110" cy="152" r="40" stroke="currentColor" stroke-width="1.6"/>
        <circle cx="110" cy="152" r="12" stroke="currentColor" stroke-width="1.4" fill="currentColor" fill-opacity="0.2"/>
        <g stroke="currentColor" stroke-width="1.2">
          <line x1="110" y1="112" x2="110" y2="192"/><line x1="70" y1="152" x2="150" y2="152"/>
          <line x1="82" y1="124" x2="138" y2="180"/><line x1="138" y1="124" x2="82" y2="180"/>
        </g>
      `;
    case 'wings':
      return `
        <path d="M110 166c-12-24-32-36-48-34 6 18 18 32 36 40M110 166c12-24 32-36 48-34-6 18-18 32-36 40" stroke="currentColor" stroke-width="1.7" fill="currentColor" fill-opacity="0.16"/>
        <path d="M110 116l4 10 10 4-10 4-4 10-4-10-10-4 10-4 4-10Z" fill="currentColor"/>
      `;
    case 'lotus':
      return `
        <path d="M110 112c14 20 14 44 0 64-14-20-14-44 0-64Z" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity="0.25"/>
        <path d="M110 176c-22-6-36-22-38-42 18 4 32 18 38 42ZM110 176c22-6 36-22 38-42-18 4-32 18-38 42Z" stroke="currentColor" stroke-width="1.4" fill="currentColor" fill-opacity="0.14"/>
        <line x1="74" y1="188" x2="146" y2="188" stroke="currentColor" stroke-width="1.2"/>
      `;
  }
}

/**
 * Illustrated SVG front face for a revealed Major Arcana card.
 */
export function renderTarotFrontMarkup(card: TarotCard): string {
  const uid = ++svgInstanceCounter;
  const frontBgId = `tfBg-${card.id}-${uid}`;

  return `
    <div class="tarot-front" style="--card-accent:${card.accent}">
      <svg class="tarot-svg" viewBox="0 0 220 330" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="${frontBgId}" cx="50%" cy="42%" r="68%">
            <stop offset="0%" stop-color="#2c2444"/>
            <stop offset="55%" stop-color="#17162a"/>
            <stop offset="100%" stop-color="#0d0d16"/>
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="220" height="330" rx="10" fill="url(#${frontBgId})"/>
        <rect x="8" y="8" width="204" height="314" rx="6" stroke="${card.accent}" stroke-width="1.3" opacity="0.9"/>
        <path d="M26 254V92a84 84 0 0 1 168 0v162H26Z" stroke="${card.accent}" stroke-width="0.9" opacity="0.45"/>
        <text x="110" y="42" text-anchor="middle" fill="${card.accent}" font-family="'Cormorant Garamond', Georgia, serif" font-size="18" letter-spacing="4" font-weight="600">${card.numeral}</text>
        <g style="color:${card.accent}">
          ${getEmblemSvg(card.emblem)}
        </g>
        <line x1="48" y1="266" x2="172" y2="266" stroke="${card.accent}" stroke-width="0.7" opacity="0.5"/>
        <text x="110" y="288" text-anchor="middle" fill="#f7eedd" font-family="'Cormorant Garamond', Georgia, serif" font-size="18" letter-spacing="1.4" font-weight="600">${card.nameEn.toUpperCase()}</text>
        <text x="110" y="306" text-anchor="middle" fill="${card.accent}" font-family="'Be Vietnam Pro', sans-serif" font-size="10" letter-spacing="1.5" opacity="0.9">${card.nameVi}</text>
      </svg>
      <div class="card-foil"></div>
    </div>
  `;
}
