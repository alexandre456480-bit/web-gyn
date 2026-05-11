/* ═══════════════════════════════════════
   WebGyn — Script Principal
═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Lucide Icons ──
  if (typeof lucide !== 'undefined') lucide.createIcons();

  // ── Navbar scroll effect & Color Adaptation ──
  const navbar = document.getElementById('navbar');

  const navSectionsConfig = [
    { id: 'hero', bg: 'rgba(7, 23, 57, 0.4)', border: 'rgba(255, 255, 255, 0.08)', text: 'var(--white)', filter: 'none' },
    { id: 'portfolio', bg: 'rgba(248, 249, 250, 0.65)', border: 'rgba(7, 23, 57, 0.1)', text: 'var(--navy-dark)', filter: 'brightness(0) opacity(0.85)' },
    { id: 'servicos', bg: 'rgba(6, 14, 36, 0.5)', border: 'rgba(255, 255, 255, 0.08)', text: 'var(--white)', filter: 'none' },
    { id: 'vantagens', bg: 'rgba(26, 18, 6, 0.55)', border: 'rgba(227, 195, 157, 0.15)', text: 'var(--white)', filter: 'none' }
  ];

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const config = navSectionsConfig.find(s => s.id === entry.target.id);
        if (config) {
          navbar.style.setProperty('--nav-bg', config.bg);
          navbar.style.setProperty('--nav-border', config.border);
          navbar.style.setProperty('--nav-text', config.text);
          navbar.style.setProperty('--logo-filter', config.filter);
        }
      }
    });
  }, { root: null, rootMargin: '-10% 0px -80% 0px', threshold: 0 });

  navSectionsConfig.forEach(s => {
    const el = document.getElementById(s.id);
    if (el) navObserver.observe(el);
  });

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Hamburger menu ──
  const hamburger = document.getElementById('navHamburger');
  const navLinks = document.getElementById('navLinks');
  const navActions = document.querySelector('.nav-actions');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    navActions.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  // Fechar menu ao clicar em link
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      navActions.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ── Showcase Slider (devices) — transição 3D ──
  const slides = document.querySelectorAll('.showcase-img');
  let currentSlide = 0;
  let isTransitioning = false;

  const goToSlide = (index) => {
    if (isTransitioning || index === currentSlide) return;
    isTransitioning = true;

    const outgoing = slides[currentSlide];
    const incoming = slides[index];

    // Garantir que a imagem incoming tenha src carregado
    if (incoming.dataset.src) {
      incoming.src = incoming.dataset.src;
      incoming.removeAttribute('data-src');
    }

    // Saída: colapso circular + rotação 3D
    outgoing.classList.remove('active');
    outgoing.classList.add('exit');

    // Após a saída, revela o novo
    setTimeout(() => {
      outgoing.classList.remove('exit');
      incoming.classList.add('active');
      currentSlide = index;
      isTransitioning = false;
    }, 700);
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % slides.length);
  };

  if (slides.length > 0) setInterval(nextSlide, 4500);

  // ── Smooth scroll para links de navegação ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── 3D Carousel Logic ──
  const carousel3D = document.getElementById('carousel3D');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (carousel3D && prevBtn && nextBtn) {
    const items = document.querySelectorAll('.ring-item');
    // Ângulos reais de cada item
    let itemsAngles = [0, 90, 180, 270];

    const updateCarousel = () => {
      items.forEach((item, index) => {
        // Atualiza a variável CSS do ângulo para o item girar no próprio eixo
        item.style.setProperty('--angle', `${itemsAngles[index]}deg`);
        
        // Descobre qual item está de frente para a câmera (múltiplos de 360)
        const normalizedAngle = ((itemsAngles[index] % 360) + 360) % 360;
        if (normalizedAngle === 0) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    };

    // Estado inicial
    updateCarousel();

    const rotateCarousel = (direction) => {
      if (direction === 'next') {
        // Se clicar em próximo, todos os itens giram para a esquerda (-90)
        for(let i=0; i<4; i++) itemsAngles[i] -= 90;
      } else {
        // Se clicar em anterior, todos os itens giram para a direita (+90)
        for(let i=0; i<4; i++) itemsAngles[i] += 90;
      }
      updateCarousel();
    };

    nextBtn.addEventListener('click', () => rotateCarousel('next'));
    prevBtn.addEventListener('click', () => rotateCarousel('prev'));
  }

  // ── Scroll Reveal Animation ──
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-up, .reveal-right');
  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealOnScroll = new IntersectionObserver(function (entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  reveals.forEach(reveal => {
    revealOnScroll.observe(reveal);
  });

  // ── Golden Trail Scroll Animation (Apenas Seção 2) ──
  const trailPath = document.getElementById('portfolioTrailPath');
  const portfolioSection = document.getElementById('portfolio');

  if (trailPath && portfolioSection) {
    const pathLength = trailPath.getTotalLength();
    trailPath.style.strokeDasharray = pathLength;
    trailPath.style.strokeDashoffset = pathLength;

    const onScrollTrail = () => {
      const rect = portfolioSection.getBoundingClientRect();
      const sectionHeight = rect.height;
      const windowHeight = window.innerHeight;
      
      // O rastro começa a ser desenhado assim que a seção aparece
      // e termina quando a seção chega ao fim
      let scrollPercentage = (windowHeight - rect.top) / (sectionHeight + windowHeight / 2);
      
      if (scrollPercentage < 0) scrollPercentage = 0;
      if (scrollPercentage > 1) scrollPercentage = 1;

      // Suaviza a saída para que o traço chegue ao fim um pouco mais rápido
      const drawLength = pathLength * scrollPercentage;
      
      // Use requestAnimationFrame para melhor performance no desenho
      requestAnimationFrame(() => {
        trailPath.style.strokeDashoffset = pathLength - drawLength;
      });
    };

    window.addEventListener('scroll', onScrollTrail, { passive: true });
    onScrollTrail();
  }

});
