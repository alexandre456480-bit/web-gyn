/* ═══════════════════════════════════════
   WebGyn — Performance Mobile Optimizer
   Reduz FCP, LCP e Speed Index no mobile
═══════════════════════════════════════ */

(function () {
  'use strict';

  const isMobile = window.innerWidth <= 768;
  const isSlowConnection = navigator.connection &&
    (navigator.connection.effectiveType === '2g' ||
     navigator.connection.effectiveType === 'slow-2g' ||
     navigator.connection.saveData === true);

  // ── 1. Hero background: no mobile, esconder strip e usar cor sólida ──
  if (isMobile) {
    const bgTrack = document.querySelector('.hero-bg-track');
    if (bgTrack) {
      // No mobile, a strip quase não é visível sob o overlay.
      // Remove completamente para eliminar o download das 16 imagens
      bgTrack.remove();
    }

    // Remove partículas decorativas desnecessárias no mobile
    const particles = document.querySelector('.particles');
    if (particles) particles.remove();

    const servicosParticles = document.querySelector('.servicos-particles');
    if (servicosParticles) servicosParticles.remove();

    // Remove SVG golden trail com filter blur pesado
    const goldenTrail = document.querySelector('.portfolio-golden-trail');
    if (goldenTrail) goldenTrail.remove();

    // Remove orbs decorativos
    document.querySelectorAll('.orb').forEach(o => o.remove());

    // Remove showcase glow (radial gradient + blur animado)
    const glow = document.querySelector('.showcase-glow');
    if (glow) glow.remove();
  }

  // ── 2. Lazy-load inteligente para imagens abaixo do fold ──
  if ('IntersectionObserver' in window) {
    const lazyImgs = document.querySelectorAll('img.hero-lazy');
    const imgObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          img.classList.remove('hero-lazy');
          obs.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    lazyImgs.forEach(img => imgObserver.observe(img));
  }

  // ── 3. Defer imagens showcase que não são a ativa (LCP) ──
  const showcaseImgs = document.querySelectorAll('.showcase-img:not(.active)');
  showcaseImgs.forEach(img => {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
  });

  // ── 4. Reduzir animações no mobile para acelerar Speed Index ──
  if (isMobile || isSlowConnection) {
    const style = document.createElement('style');
    style.textContent = `
      /* Desabilita animações decorativas pesadas no mobile */
      .hero-bg-strip { animation: none !important; }
      .sp { animation: none !important; opacity: 0 !important; }
      .particle { animation: none !important; opacity: 0 !important; }
      .orb { animation: none !important; opacity: 0 !important; }
      .showcase-glow { animation: none !important; }
      .marquee-content,
      .marquee-content--reverse { animation-duration: 40s !important; }
      
      /* Simplifica backdrop-filter no mobile (CPU-heavy) */
      .navbar.scrolled {
        backdrop-filter: blur(12px) !important;
        -webkit-backdrop-filter: blur(12px) !important;
      }
      .servico-card {
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }
      
      /* Reduz will-change footprint */
      .hero-bg-strip { will-change: auto !important; }
      .showcase-img { will-change: auto !important; }
      
      /* Simplifica transitions de reveal para serem mais leves */
      .reveal, .reveal-left, .reveal-up, .reveal-right {
        transition-duration: 0.4s !important;
      }
    `;
    document.head.appendChild(style);
  }

  // ── 5. Abort Lucide download em conexões lentas ──
  // Fallback: esconde ícones lucide que ainda não carregaram
  if (isSlowConnection) {
    const style = document.createElement('style');
    style.textContent = `[data-lucide] { display: none !important; }`;
    document.head.appendChild(style);
  }

})();
