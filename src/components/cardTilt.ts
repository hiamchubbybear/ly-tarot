/**
 * Smooth 3D tilt + golden holographic foil sheen on hover.
 * Automatically disabled on touch devices and when prefers-reduced-motion is enabled.
 */
export function attachCardTilt(selector: string, maxTiltDeg = 10): void {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (reduced || !finePointer) return;

  const elements = document.querySelectorAll<HTMLElement>(selector);
  elements.forEach((el) => {
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * maxTiltDeg * 2;
      const rotateX = (0.5 - py) * maxTiltDeg * 2;
      el.style.setProperty('--tilt-rx', `${rotateX.toFixed(2)}deg`);
      el.style.setProperty('--tilt-ry', `${rotateY.toFixed(2)}deg`);
      el.style.setProperty('--foil-x', `${(px * 100).toFixed(1)}%`);
      el.style.setProperty('--foil-y', `${(py * 100).toFixed(1)}%`);
      el.classList.add('is-tilting');
    };

    const onLeave = () => {
      el.style.setProperty('--tilt-rx', '0deg');
      el.style.setProperty('--tilt-ry', '0deg');
      el.classList.remove('is-tilting');
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
  });
}
