import type { ThemeMode } from './celestialCanvas';

const STORAGE_KEY = 'lyly-arcturus-theme';

export function getInitialTheme(): ThemeMode {
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'light' || attr === 'dark') return attr;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // ignore storage errors
  }
  return 'dark';
}

export function initThemeToggle(onThemeChange?: (theme: ThemeMode) => void): ThemeMode {
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const label = document.getElementById('themeLabel');

  const apply = (theme: ThemeMode) => {
    const isLight = theme === 'light';
    root.setAttribute('data-theme', theme);
    if (icon) {
      icon.innerHTML = isLight
        ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M16.5 4.5a8.5 8.5 0 1 0 3 14.4A7 7 0 1 1 16.5 4.5Z"/></svg>'
        : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>';
    }
    if (label) label.textContent = isLight ? 'Tối' : 'Sáng';
    if (btn) {
      btn.setAttribute('aria-label', isLight ? 'Chuyển sang giao diện tối' : 'Chuyển sang giao diện sáng');
      btn.setAttribute('title', isLight ? 'Bật giao diện tối' : 'Bật giao diện sáng');
      btn.setAttribute('aria-pressed', String(isLight));
    }
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', isLight ? '#fffaf3' : '#0b0b0e');

    onThemeChange?.(theme);
  };

  const initial = getInitialTheme();
  apply(initial);

  btn?.addEventListener('click', () => {
    const next: ThemeMode = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    apply(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore storage errors
    }
  });

  return initial;
}
