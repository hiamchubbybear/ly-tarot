import * as THREE from 'three';

export type ThemeMode = 'dark' | 'light';

export interface CelestialSceneHandle {
  setTheme: (theme: ThemeMode) => void;
  destroy: () => void;
}

function createGlowTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const half = size / 2;
  const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.28, 'rgba(255, 244, 214, 0.85)');
  grad.addColorStop(0.6, 'rgba(221, 195, 138, 0.25)');
  grad.addColorStop(1, 'rgba(221, 195, 138, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

const PALETTES = {
  dark: {
    stars: [0xf7e7b9, 0xddc38a, 0xd5a0bb, 0xb8a6dc],
    dust: [0xf3e1b2, 0xd5a0bb, 0x8b76aa],
    ringPrimary: 0xddc38a,
    ringSecondary: 0xa689c7,
    starOpacity: 0.85,
    dustOpacity: 0.72,
    ringOpacity: 0.26,
  },
  light: {
    stars: [0x9f7a4a, 0x9b6fa8, 0xc082a4, 0x7c639c],
    dust: [0xb48a54, 0xa876b5, 0xc789a8],
    ringPrimary: 0x9e794c,
    ringSecondary: 0x9b7ab0,
    starOpacity: 0.55,
    dustOpacity: 0.45,
    ringOpacity: 0.2,
  },
} as const;

export function mountCelestialCanvas(
  canvas: HTMLCanvasElement,
  initialTheme: ThemeMode
): CelestialSceneHandle {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !isMobile,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    52,
    window.innerWidth / window.innerHeight,
    0.1,
    120
  );
  camera.position.z = 16;

  const glowTexture = createGlowTexture();

  // Layer 1: Distant twinkling stars
  const starCount = isMobile ? 160 : 300;
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);
  const starColorSeeds = new Uint8Array(starCount);

  for (let i = 0; i < starCount; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 44;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 30;
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 24 - 4;
    starColorSeeds[i] = i % 4;
  }

  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

  const starMaterial = new THREE.PointsMaterial({
    size: isMobile ? 0.32 : 0.28,
    map: glowTexture,
    vertexColors: true,
    transparent: true,
    opacity: PALETTES[initialTheme].starOpacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const starsMesh = new THREE.Points(starGeometry, starMaterial);
  scene.add(starsMesh);

  // Layer 2: Dreamy drifting stardust / fireflies
  const dustCount = isMobile ? 65 : 130;
  const dustPositions = new Float32Array(dustCount * 3);
  const dustBaseX = new Float32Array(dustCount);
  const dustSpeeds = new Float32Array(dustCount);
  const dustPhases = new Float32Array(dustCount);
  const dustColors = new Float32Array(dustCount * 3);
  const dustColorSeeds = new Uint8Array(dustCount);

  for (let i = 0; i < dustCount; i++) {
    const x = (Math.random() - 0.5) * 28;
    dustBaseX[i] = x;
    dustPositions[i * 3] = x;
    dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 22;
    dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 14 + 1;
    dustSpeeds[i] = 0.16 + Math.random() * 0.28;
    dustPhases[i] = Math.random() * Math.PI * 2;
    dustColorSeeds[i] = i % 3;
  }

  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
  dustGeometry.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));

  const dustMaterial = new THREE.PointsMaterial({
    size: isMobile ? 0.44 : 0.4,
    map: glowTexture,
    vertexColors: true,
    transparent: true,
    opacity: PALETTES[initialTheme].dustOpacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const dustMesh = new THREE.Points(dustGeometry, dustMaterial);
  scene.add(dustMesh);

  // Layer 3: Subtle ethereal astrolabe rings behind the Hero visual
  const astrolabeGroup = new THREE.Group();
  astrolabeGroup.position.set(isMobile ? 0 : 4.2, isMobile ? -1.4 : 0.3, -2.5);

  const ringMatPrimary = new THREE.MeshBasicMaterial({
    color: PALETTES[initialTheme].ringPrimary,
    transparent: true,
    opacity: PALETTES[initialTheme].ringOpacity,
    wireframe: false,
  });
  const ringMatSecondary = new THREE.MeshBasicMaterial({
    color: PALETTES[initialTheme].ringSecondary,
    transparent: true,
    opacity: PALETTES[initialTheme].ringOpacity * 0.85,
  });

  const outerRing = new THREE.Mesh(
    new THREE.TorusGeometry(4.3, 0.016, 12, 120),
    ringMatPrimary
  );
  const middleRing = new THREE.Mesh(
    new THREE.TorusGeometry(3.35, 0.013, 12, 100),
    ringMatSecondary
  );
  middleRing.rotation.x = Math.PI * 0.34;
  middleRing.rotation.y = Math.PI * 0.18;

  const innerRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.35, 0.011, 12, 90),
    ringMatPrimary
  );
  innerRing.rotation.x = -Math.PI * 0.25;
  innerRing.rotation.z = Math.PI * 0.2;

  // Tiny orbiting star beads on the outer ring
  const orbGeo = new THREE.SphereGeometry(0.065, 10, 10);
  const orb1 = new THREE.Mesh(orbGeo, ringMatPrimary);
  orb1.position.set(4.3, 0, 0);
  const orb2 = new THREE.Mesh(orbGeo, ringMatSecondary);
  orb2.position.set(-3.35, 0, 0);
  outerRing.add(orb1);
  middleRing.add(orb2);

  astrolabeGroup.add(outerRing, middleRing, innerRing);
  scene.add(astrolabeGroup);

  const applyThemeColors = (theme: ThemeMode) => {
    const palette = PALETTES[theme];
    const tmpColor = new THREE.Color();

    const sAttr = starGeometry.getAttribute('color') as THREE.BufferAttribute;
    for (let i = 0; i < starCount; i++) {
      tmpColor.setHex(palette.stars[starColorSeeds[i]]);
      sAttr.setXYZ(i, tmpColor.r, tmpColor.g, tmpColor.b);
    }
    sAttr.needsUpdate = true;

    const dAttr = dustGeometry.getAttribute('color') as THREE.BufferAttribute;
    for (let i = 0; i < dustCount; i++) {
      tmpColor.setHex(palette.dust[dustColorSeeds[i]]);
      dAttr.setXYZ(i, tmpColor.r, tmpColor.g, tmpColor.b);
    }
    dAttr.needsUpdate = true;

    starMaterial.opacity = palette.starOpacity;
    dustMaterial.opacity = palette.dustOpacity;
    starMaterial.blending = theme === 'light' ? THREE.NormalBlending : THREE.AdditiveBlending;
    dustMaterial.blending = theme === 'light' ? THREE.NormalBlending : THREE.AdditiveBlending;
    starMaterial.needsUpdate = true;
    dustMaterial.needsUpdate = true;

    ringMatPrimary.color.setHex(palette.ringPrimary);
    ringMatSecondary.color.setHex(palette.ringSecondary);
    baseRingOpacity = palette.ringOpacity;
  };

  let baseRingOpacity: number = PALETTES[initialTheme].ringOpacity;
  applyThemeColors(initialTheme);

  // Pointer & scroll state for smooth parallax
  let targetMouseX = 0;
  let targetMouseY = 0;
  let currentMouseX = 0;
  let currentMouseY = 0;
  let scrollProgress = 0;

  const onPointerMove = (e: PointerEvent) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  };

  const onScroll = () => {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    scrollProgress = Math.min(1, window.scrollY / maxScroll);
  };

  const onResize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    const narrow = w < 950;
    astrolabeGroup.position.x = narrow ? 0 : 4.2;
    astrolabeGroup.position.y = narrow ? -1.4 : 0.3;
  };

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });

  let rafId = 0;
  const clock = new THREE.Clock();

  const renderFrame = (elapsed: number, delta: number) => {
    currentMouseX += (targetMouseX - currentMouseX) * 0.04;
    currentMouseY += (targetMouseY - currentMouseY) * 0.04;

    camera.position.x = currentMouseX * 0.75;
    camera.position.y = -currentMouseY * 0.45 - scrollProgress * 2.2;
    camera.lookAt(0, -scrollProgress * 1.4, -2);

    // Gentle rotation for background stars
    starsMesh.rotation.y = elapsed * 0.015;
    starsMesh.rotation.x = Math.sin(elapsed * 0.08) * 0.04;

    // Dreamy upward drift for golden stardust
    const posAttr = dustGeometry.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < dustCount; i++) {
      let y = posAttr.getY(i) + dustSpeeds[i] * delta;
      if (y > 11.5) y = -11.5;
      const x = dustBaseX[i] + Math.sin(elapsed * 0.45 + dustPhases[i]) * 0.6;
      posAttr.setXY(i, x, y);
    }
    posAttr.needsUpdate = true;

    // Slow celestial astrolabe orbit, fading gracefully below hero
    const heroFade = Math.max(0.18, 1 - scrollProgress * 2.4);
    ringMatPrimary.opacity = baseRingOpacity * heroFade;
    ringMatSecondary.opacity = baseRingOpacity * 0.85 * heroFade;

    outerRing.rotation.z = elapsed * 0.09;
    outerRing.rotation.x = Math.sin(elapsed * 0.2) * 0.25 + 0.35;
    middleRing.rotation.y = elapsed * 0.13 + Math.PI * 0.18;
    middleRing.rotation.x = Math.cos(elapsed * 0.17) * 0.35 + Math.PI * 0.34;
    innerRing.rotation.z = -elapsed * 0.16;
    innerRing.rotation.y = Math.sin(elapsed * 0.22) * 0.4;

    renderer.render(scene, camera);
  };

  if (prefersReducedMotion) {
    renderFrame(0, 0);
  } else {
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (document.hidden) return;
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();
      renderFrame(elapsed, delta);
    };
    animate();
  }

  return {
    setTheme(theme: ThemeMode) {
      applyThemeColors(theme);
      if (prefersReducedMotion) {
        renderFrame(0, 0);
      }
    },
    destroy() {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      starGeometry.dispose();
      starMaterial.dispose();
      dustGeometry.dispose();
      dustMaterial.dispose();
      outerRing.geometry.dispose();
      middleRing.geometry.dispose();
      innerRing.geometry.dispose();
      orbGeo.dispose();
      ringMatPrimary.dispose();
      ringMatSecondary.dispose();
      glowTexture.dispose();
      renderer.dispose();
    },
  };
}
