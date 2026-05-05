(function () {
  'use strict';

  var prefersReducedMotion = false;
  try {
    prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {
    prefersReducedMotion = false;
  }

  function initTyped() {
    var el = document.getElementById('typed');
    if (!el || !window.Typed) return;
    if (prefersReducedMotion) return;

    // eslint-disable-next-line no-new
    new window.Typed('#typed', {
      strings: ['websites', 'landing pages', 'booking flows', 'web apps', 'product UIs'],
      typeSpeed: 46,
      backSpeed: 22,
      backDelay: 1150,
      loop: true,
      smartBackspace: true,
      showCursor: true,
      cursorChar: '▍',
    });
  }

  function initTilt() {
    if (!window.VanillaTilt || prefersReducedMotion) return;
    var nodes = document.querySelectorAll('.wg-card3d');
    if (!nodes.length) return;
    window.VanillaTilt.init(nodes, {
      max: 8,
      speed: 700,
      glare: true,
      'max-glare': 0.18,
      perspective: 900,
      scale: 1.01,
    });
  }

  function initGsap() {
    if (!window.gsap) return;
    if (window.ScrollTrigger && window.gsap.registerPlugin) {
      window.gsap.registerPlugin(window.ScrollTrigger);
    }

    // Hero entrance
    try {
      window.gsap.fromTo(
        '.wg-pill, h1, .wg-hero p, .wg-hero a, .wg-stat',
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.06,
          delay: 0.1,
        }
      );
    } catch (e) {
      // ignore
    }

    if (prefersReducedMotion || !window.ScrollTrigger) return;

    // Stagger cards inside each section for a premium feel.
    var groups = document.querySelectorAll('.wg-section');
    groups.forEach(function (section) {
      var cards = section.querySelectorAll('.wg-reveal');
      if (!cards.length) return;
      window.gsap.set(cards, { y: 26, opacity: 0, rotateX: 8, transformOrigin: '50% 100%' });
      window.gsap.to(cards, {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.09,
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
        },
      });
    });

    // Subtle parallax on project images.
    var imgs = document.querySelectorAll('.wg-project-img');
    imgs.forEach(function (img) {
      window.gsap.to(img, {
        yPercent: -6,
        ease: 'none',
        scrollTrigger: {
          trigger: img,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
        },
      });
    });
  }

  function initHero3D() {
    var canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    if (!window.THREE) return;

    var THREE = window.THREE;

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'low-power',
      });
    } catch (e) {
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.2, 5.3);

    var ambient = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambient);

    var key = new THREE.DirectionalLight(0x93c5fd, 1.05);
    key.position.set(3.2, 2.2, 2.0);
    scene.add(key);

    var fill = new THREE.DirectionalLight(0x34d399, 0.55);
    fill.position.set(-3.2, -1.2, 2.2);
    scene.add(fill);

    var geo = new THREE.TorusKnotGeometry(1.08, 0.33, 180, 14);
    var mat = new THREE.MeshStandardMaterial({
      color: 0x60a5fa,
      roughness: 0.28,
      metalness: 0.6,
      emissive: 0x1e3a8a,
      emissiveIntensity: 0.12,
    });
    var mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(0.2, -0.1, 0);
    scene.add(mesh);

    var mouseX = 0;
    var mouseY = 0;
    var hasPointer = false;

    function onMove(e) {
      var t = e.touches && e.touches[0];
      var clientX = t ? t.clientX : e.clientX;
      var clientY = t ? t.clientY : e.clientY;
      if (typeof clientX !== 'number' || typeof clientY !== 'number') return;

      var rect = canvas.getBoundingClientRect();
      var x = (clientX - rect.left) / Math.max(rect.width, 1);
      var y = (clientY - rect.top) / Math.max(rect.height, 1);
      mouseX = (x - 0.5) * 2;
      mouseY = (y - 0.5) * -2;
      hasPointer = true;
    }

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });

    function resize() {
      var rect = canvas.getBoundingClientRect();
      var w = Math.max(1, rect.width);
      var h = Math.max(1, rect.height);
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    var raf = 0;
    var last = performance.now();

    function animate(now) {
      var dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      var t = now / 1000;
      var base = prefersReducedMotion ? 0.14 : 0.6;
      mesh.rotation.x = t * base * 0.55;
      mesh.rotation.y = t * base;

      var tx = hasPointer ? mouseY * 0.16 : Math.sin(t * 0.55) * 0.06;
      var ty = hasPointer ? mouseX * 0.22 : Math.cos(t * 0.48) * 0.06;
      mesh.rotation.x += tx * dt * 8;
      mesh.rotation.y += ty * dt * 8;

      mesh.position.y = -0.1 + Math.sin(t * 0.9) * (prefersReducedMotion ? 0.05 : 0.12);
      renderer.render(scene, camera);

      if (!prefersReducedMotion) raf = window.requestAnimationFrame(animate);
    }

    // Render one frame for reduced motion.
    raf = window.requestAnimationFrame(animate);

    document.addEventListener('visibilitychange', function () {
      if (document.hidden && raf) window.cancelAnimationFrame(raf);
      if (!document.hidden && !prefersReducedMotion) raf = window.requestAnimationFrame(animate);
      if (!document.hidden && prefersReducedMotion) renderer.render(scene, camera);
    });
  }

  function onReady(fn) {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(fn, 0);
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  onReady(function () {
    initTyped();
    initTilt();
    initGsap();
    initHero3D();
  });
})();

