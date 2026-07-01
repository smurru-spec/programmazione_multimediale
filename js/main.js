/* ============================================================
   SARA MURRU — PORTFOLIO
   main.js
   ============================================================ */

function resetPageOverlays() {
  const pageTransition = document.getElementById('page-transition');
  if (pageTransition) {
    pageTransition.style.opacity = '0';
    pageTransition.style.pointerEvents = 'none';
  }

  const vinylOverlay = document.getElementById('vinyl-overlay');
  if (vinylOverlay) {
    vinylOverlay.classList.remove('active');
  }

  document.body.style.overflow = '';
}

// Reset immediato + quando Safari ripristina la pagina dalla cache
resetPageOverlays();
window.addEventListener('pageshow', resetPageOverlays);
window.addEventListener('popstate', resetPageOverlays);
window.addEventListener('pagehide', resetPageOverlays);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') resetPageOverlays();
});

document.addEventListener('DOMContentLoaded', () => {

  function initIntro() {
    const overlay = document.getElementById('intro-overlay');
    const btn = document.getElementById('intro-btn');
    const window_ = document.getElementById('intro-window');

    if (!overlay) return;

    const airportAudio = new Audio('audio/airport.wav');
    airportAudio.loop = true;
    airportAudio.volume = 0.4;
    airportAudio.preload = 'auto';

    const voloAudio = new Audio('audio/in_volo.webm');
    const voloStartTime = 75;
    voloAudio.currentTime = voloStartTime;
    voloAudio.loop = true;
    voloAudio.volume = 0.5;
    voloAudio.preload = 'auto';

    function fadeOut(audio, duration = 1000) {
      const startVolume = audio.volume;
      const step = startVolume / (duration / 50);
      const interval = setInterval(() => {
        if (audio.volume > step) {
          audio.volume -= step;
        } else {
          audio.volume = 0;
          audio.pause();
          clearInterval(interval);
        }
      }, 50);
    }

    function fadeVolume(audio, targetVolume, duration = 1000) {
      const step = (targetVolume - audio.volume) / (duration / 50);
      const interval = setInterval(() => {
        if (step > 0 && audio.volume + step < targetVolume) {
          audio.volume += step;
        } else if (step < 0 && audio.volume + step > targetVolume) {
          audio.volume += step;
        } else {
          audio.volume = targetVolume;
          clearInterval(interval);
        }
      }, 50);
    }

    function fadeIn(audio, targetVolume = 0.5, duration = 1000) {
      if (audio.paused) {
        audio.volume = 0;
        audio.play().catch(() => {});
      }
      fadeVolume(audio, targetVolume, duration);
    }

    const seen = sessionStorage.getItem('introSeen');
    if (seen) {
      overlay.style.display = 'none';
      addRestartBtn();
      return;
    }

    function startAirport() {
      if (!airportAudio.paused && airportAudio.volume > 0) return;
      airportAudio.currentTime = 0;
      airportAudio.volume = 0.4;
      airportAudio.play().catch(() => {});
    }

    startAirport();
    airportAudio.addEventListener('canplaythrough', () => startAirport(), { once: true });

    if (btn) {
      btn.addEventListener('click', () => {
        const scene = overlay.querySelector('.intro-scene');
        scene.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
        scene.style.transform = 'translateY(-40px) rotate(3deg)';
        scene.style.opacity = '0';
        fadeOut(airportAudio, 800);

        voloAudio.currentTime = voloStartTime;
        voloAudio.volume = 0;
        voloAudio.play().catch(() => {});

        setTimeout(() => {
          scene.style.display = 'none';
          window_.classList.add('active');

          const skipBtn = document.getElementById('intro-skip-btn');
          if (skipBtn) {
            skipBtn.addEventListener('click', () => {
              fadeOut(voloAudio, 500);
              overlay.classList.add('hidden');
              setTimeout(() => {
                overlay.style.display = 'none';
                sessionStorage.setItem('introSeen', 'true');
                addRestartBtn();
              }, 800);
            });
          }

          fadeIn(voloAudio, 0.5, 1500);

          const glass = document.getElementById('window-glass');
          const ground = document.getElementById('ground');
          const wing = document.getElementById('wing');
          const phaseText = document.getElementById('phase-text');
          const landingTextEl = document.getElementById('landing-text');

          phaseText.classList.add('visible');

          setTimeout(() => {
            glass.classList.add('takeoff');
            wing.classList.add('tilted');
            phaseText.textContent = '🛫 Decollo in corso...';
          }, 500);

          setTimeout(() => {
            ground.classList.add('hidden');
            phaseText.textContent = '☁️ Tra le nuvole...';
          }, 3000);

          setTimeout(() => {
            glass.classList.remove('takeoff');
            glass.classList.add('flying');
            wing.classList.remove('tilted');
            phaseText.textContent = '✈️ In volo verso il portfolio...';
          }, 5000);

          setTimeout(() => {
            phaseText.textContent = '🛬 Inizio discesa...';
            wing.classList.add('tilted');
          }, 9000);

          setTimeout(() => {
            glass.classList.remove('flying');
            glass.classList.add('landing');
            ground.classList.remove('hidden');
            ground.classList.add('landing');
            phaseText.textContent = '🛬 Atterraggio...';
          }, 11000);

          setTimeout(() => {
            phaseText.classList.remove('visible');
            if (landingTextEl) landingTextEl.classList.add('visible');
          }, 13000);

          setTimeout(() => {
            fadeOut(voloAudio, 1500);
            overlay.classList.add('hidden');
            setTimeout(() => {
              overlay.style.display = 'none';
              sessionStorage.setItem('introSeen', 'true');
              addRestartBtn();
            }, 800);
          }, 15000);

        }, 600);
      });
    }

    function addRestartBtn() {
      if (document.getElementById('intro-restart-btn')) return;
      const btn = document.createElement('button');
      btn.id = 'intro-restart-btn';
      btn.className = 'intro-restart-btn';
      btn.textContent = '✈ Rivivi il viaggio';
      btn.addEventListener('click', () => {
        sessionStorage.removeItem('introSeen');
        location.reload();
      });
      document.body.appendChild(btn);
    }
  }
  initIntro();

  /* ----------------------------------------------------------
     CURSORE CUSTOM — TRAIL
     ---------------------------------------------------------- */
  const cursor = document.querySelector('.cursor');
  if (cursor) cursor.style.display = 'none';
  const trail = [];
  const trailCount = 12;

  for (let i = 0; i < trailCount; i++) {
    const dot = document.createElement('div');
    dot.className = 'cursor-trail';
    dot.style.cssText = `position:fixed;width:${8 - i * 0.5}px;height:${8 - i * 0.5}px;border-radius:50%;background:rgba(27,79,255,${0.6 - i * 0.05});pointer-events:none;z-index:1000000;transform:translate(-50%,-50%);transition:opacity 0.1s;`;
    document.body.appendChild(dot);
    trail.push({ el: dot, x: 0, y: 0 });
  }

  let mouseX = 0, mouseY = 0;

  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      }
    });

    function animateTrail() {
      let x = mouseX, y = mouseY;
      trail.forEach((dot, i) => {
        const prev = trail[i - 1];
        if (prev) {
          dot.x += (prev.x - dot.x) * 0.6;
          dot.y += (prev.y - dot.y) * 0.6;
        } else {
          dot.x += (x - dot.x) * 0.6;
          dot.y += (y - dot.y) * 0.6;
        }
        dot.el.style.left = dot.x + 'px';
        dot.el.style.top = dot.y + 'px';
      });
      requestAnimationFrame(animateTrail);
    }
    animateTrail();

    const hoverTargets = document.querySelectorAll('a, button, .portfolio-item, .pf-item, .carousel-btn');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => cursor && cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor && cursor.classList.remove('hovering'));
    });
  }

  /* ----------------------------------------------------------
     HEADER STICKY
     ---------------------------------------------------------- */
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  /* ----------------------------------------------------------
     MENU HAMBURGER
     ---------------------------------------------------------- */
  const hamburger  = document.querySelector('.hamburger');
  const mobileNav  = document.querySelector('.mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      mobileNav.style.display = isOpen ? 'flex' : 'none';
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        mobileNav.style.display = 'none';
        document.body.style.overflow = '';
      });
    });
  }

  /* ----------------------------------------------------------
     CAROUSEL — generico, funziona su qualsiasi .carousel
     ---------------------------------------------------------- */
  document.querySelectorAll('.carousel').forEach(initCarousel);

  function initCarousel(carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dotsRoot = carousel.querySelector('.carousel-dots')
      || carousel.parentElement?.querySelector('.carousel-dots');
    const dots = dotsRoot ? dotsRoot.querySelectorAll('.carousel-dot') : carousel.querySelectorAll('.carousel-dot');
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    if (!track || slides.length === 0) return;

    let current = 0;

    track.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      height: 260px;
      perspective: 600px;
      transform-style: preserve-3d;
    `;

    slides.forEach((slide, i) => {
      slide.style.cssText = `
        position: absolute;
        width: 45%;
        transition: all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        border-radius: 4px;
        overflow: hidden;
        cursor: none;
      `;
    });

    function updateSlides() {
      slides.forEach((slide, i) => {
        const total = slides.length;
        let offset = ((i - current) % total + total) % total;
        if (offset > total / 2) offset -= total;

        if (offset === 0) {
          slide.style.transform = 'translateX(0%) translateZ(60px) rotateY(0deg) scale(1)';
          slide.style.zIndex = '10';
          slide.style.opacity = '1';
          slide.style.filter = 'brightness(1)';
        } else if (offset === 1 || offset === -(total - 1)) {
          slide.style.transform = 'translateX(80%) translateZ(-60px) rotateY(-70deg) scale(0.65)';
          slide.style.zIndex = '5';
          slide.style.opacity = '0.55';
          slide.style.filter = 'brightness(0.4)';
        } else if (offset === -1 || offset === (total - 1)) {
          slide.style.transform = 'translateX(-80%) translateZ(-60px) rotateY(70deg) scale(0.65)';
          slide.style.zIndex = '5';
          slide.style.opacity = '0.55';
          slide.style.filter = 'brightness(0.4)';
        } else {
          slide.style.transform = 'translateZ(-500px) scale(0.3)';
          slide.style.zIndex = '1';
          slide.style.opacity = '0';
        }
      });
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      updateSlides();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); }));

    let touchStartX = 0;
    carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { goTo(current + (diff > 0 ? 1 : -1)); }
    });

    let isScrolling = false;
    let accumulatedDelta = 0;
    carousel.addEventListener('wheel', e => {
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
      e.preventDefault();
      if (isScrolling) return;
      accumulatedDelta += e.deltaX;
      if (Math.abs(accumulatedDelta) > 30) {
        isScrolling = true;
        accumulatedDelta = 0;
        goTo(current + (e.deltaX > 0 ? 1 : -1));
        setTimeout(() => { isScrolling = false; }, 1000);
      }
    }, { passive: false });

    updateSlides();
  }

  /* ----------------------------------------------------------
     SCROLL REVEAL
     ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => observer.observe(el));
  }

  /* ----------------------------------------------------------
     PARALLAX LEGGERO HERO (solo desktop)
     ---------------------------------------------------------- */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      heroBg.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  /* ----------------------------------------------------------
     COOKIE BANNER
     ---------------------------------------------------------- */
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn    = document.getElementById('accept-cookies');

  if (cookieBanner) {
    if (!localStorage.getItem('cookieAccepted')) {
      setTimeout(() => { cookieBanner.style.display = 'block'; }, 1500);
    }

    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookieAccepted', 'true');
        cookieBanner.style.display = 'none';
      });
    }
  }

  /* ----------------------------------------------------------
     VALIDAZIONE FORM
     ---------------------------------------------------------- */
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const fields = form.querySelectorAll('[required]');
      let valid = true;
      fields.forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#FF4B6E';
          field.addEventListener('input', () => { field.style.borderColor = ''; }, { once: true });
        }
      });
      if (valid) {
        const btn = form.querySelector('button[type="submit"]');
        if (btn) {
          btn.textContent = 'Inviato ✓';
          btn.disabled = true;
        }
      }
    });
  });

});

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  if (!lightbox || !lightboxImg) return;

  const items = [...document.querySelectorAll('[data-lightbox]')];
  const images = items
    .map(el => el.dataset.lightbox || el.querySelector('img')?.src)
    .filter(Boolean);

  let currentIndex = 0;

  const btnStyle = 'position:absolute; top:50%; transform:translateY(-50%); color:#F0F4FF; font-size:28px; background:rgba(5,10,20,0.6); border:1px solid rgba(91,155,255,0.3); border-radius:2px; width:44px; height:44px; cursor:none; display:flex; align-items:center; justify-content:center; z-index:1;';

  const prevImgBtn = document.createElement('button');
  prevImgBtn.type = 'button';
  prevImgBtn.className = 'lightbox-prev-img';
  prevImgBtn.setAttribute('aria-label', 'Immagine precedente');
  prevImgBtn.textContent = '‹';
  prevImgBtn.style.cssText = `${btnStyle} left:24px;`;

  const nextImgBtn = document.createElement('button');
  nextImgBtn.type = 'button';
  nextImgBtn.className = 'lightbox-next-img';
  nextImgBtn.setAttribute('aria-label', 'Immagine successiva');
  nextImgBtn.textContent = '›';
  nextImgBtn.style.cssText = `${btnStyle} right:24px;`;

  lightbox.appendChild(prevImgBtn);
  lightbox.appendChild(nextImgBtn);

  function showImage(index) {
    if (!images.length) return;
    currentIndex = (index + images.length) % images.length;
    lightboxImg.src = images[currentIndex];
  }

  function openLightbox(src) {
    const idx = images.indexOf(src);
    currentIndex = idx > -1 ? idx : 0;
    showImage(currentIndex);
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    const showNav = images.length > 1;
    prevImgBtn.style.display = showNav ? 'flex' : 'none';
    nextImgBtn.style.display = showNav ? 'flex' : 'none';
  }

  function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  items.forEach(el => {
    el.addEventListener('click', (e) => {
      const src = el.dataset.lightbox || el.querySelector('img')?.src;
      if (!src) return;
      e.preventDefault();
      e.stopPropagation();
      openLightbox(src);
    });
  });

  prevImgBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showImage(currentIndex - 1);
  });

  nextImgBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showImage(currentIndex + 1);
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (lightbox.style.display !== 'flex') return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });
}
initLightbox();

function initGlitch() {
  const title = document.querySelector('.hero-title');
  if (!title) return;

  title.addEventListener('mouseenter', () => {
    let count = 0;
    const interval = setInterval(() => {
      const x = (Math.random() - 0.5) * 8;
      const y = (Math.random() - 0.5) * 4;
      title.style.textShadow = [
        `${x}px ${y}px 0 rgba(27, 79, 255, 0.9)`,
        `${-x}px ${-y}px 0 rgba(91, 155, 255, 0.6)`
      ].join(', ');
      count++;
      if (count > 6) {
        clearInterval(interval);
        title.style.textShadow = '';
      }
    }, 40);
  });
}
initGlitch();

function initParallax() {
  const parallaxEls = document.querySelectorAll('.bio-block-img img, .bio-extract-img img, .carousel-slide img');
  if (!parallaxEls.length || !window.matchMedia('(pointer: fine)').matches) return;
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    parallaxEls.forEach(el => {
      const rect = el.closest('figure, .carousel-slide, .bio-extract-img').getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const viewCenter = window.innerHeight / 2;
      const offset = (center - viewCenter) * 0.08;
      el.style.transform = `translateY(${offset}px) scale(1.1)`;
    });
  }, { passive: true });
}
initParallax();

function initPageTransitions() {
  resetPageOverlays();

  const overlay = document.getElementById('page-transition');
  if (!overlay) return;

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('http') || link.hasAttribute('download')) return;
    link.addEventListener('click', e => {
      e.preventDefault();
      overlay.style.pointerEvents = 'all';
      overlay.style.transition = 'opacity 0.5s ease';
      overlay.style.opacity = '1';
      setTimeout(() => { window.location.href = href; }, 500);
    });
  });
}
initPageTransitions();

function initMagnetic() {
  const magneticEls = document.querySelectorAll('.btn-primary, .btn-secondary, .social-link');
  if (!window.matchMedia('(pointer: fine)').matches) return;

  magneticEls.forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * 0.3;
      const deltaY = (e.clientY - centerY) * 0.3;
      el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
      el.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
    });
  });
}
initMagnetic();

function initTilt() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  document.querySelectorAll('.pf-item, .portfolio-item').forEach(card => {
    card.style.transformStyle = 'preserve-3d';
    card.style.transition = 'transform 0.1s ease';

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 20}deg) rotateX(${-y * 20}deg) scale(1.03)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale(1)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
    });
  });
}
initTilt();

function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    z: Math.random() * 3 + 0.5,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    size: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.5 + 0.1
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx * p.z;
      p.y += p.vy * p.z;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.z, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(27,79,255,${p.opacity})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}
initParticles();

function initTextDistort() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  const title = document.querySelector('.hero-title');
  if (!title) return;

  document.addEventListener('mousemove', e => {
    const rect = title.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = (e.clientX - centerX) / window.innerWidth;
    const distY = (e.clientY - centerY) / window.innerHeight;
    title.style.transform = `skewX(${distX * 4}deg) skewY(${distY * 1}deg)`;
    title.style.transition = 'transform 0.3s ease';
  });
}
initTextDistort();

function setupPolaroidDrag(card, options = {}) {
  let isDragging = false;
  let startX, startY, origX, origY;
  let hasMoved = false;

  card.querySelectorAll('img').forEach(img => { img.draggable = false; });

  if (!card.style.position || card.style.position === 'static') {
    card.style.position = 'relative';
  }
  if (!card.style.zIndex) {
    card.style.zIndex = '1';
  }

  card.addEventListener('mousedown', (e) => {
    if (e.button !== 0 || e.target.closest('button')) return;

    card.style.animation = 'none';
    const rot = card.style.getPropertyValue('--rot') || getComputedStyle(card).getPropertyValue('--rot') || '0deg';
    card.style.transform = `rotate(${rot.trim()})`;

    isDragging = true;
    hasMoved = false;
    options.onHasMovedChange?.(false);
    startX = e.clientX;
    startY = e.clientY;
    const rect = card.getBoundingClientRect();
    const parent = card.parentElement.getBoundingClientRect();
    origX = rect.left - parent.left;
    origY = rect.top - parent.top;
    card.style.position = 'absolute';
    card.style.left = origX + 'px';
    card.style.top = origY + 'px';
    card.style.zIndex = '1000';
    card.style.transition = 'none';
    card.style.cursor = 'grabbing';

    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      hasMoved = true;
      options.onHasMovedChange?.(true);
    }
    card.style.left = (origX + dx) + 'px';
    card.style.top = (origY + dy) + 'px';
    card.style.transform = `rotate(${dx * 0.05}deg)`;

    if (options.trashDelete) {
      const trash = document.getElementById('trash-zone');
      if (trash) {
        const tr = trash.getBoundingClientRect();
        const over = e.clientX > tr.left && e.clientX < tr.right && e.clientY > tr.top && e.clientY < tr.bottom;
        trash.classList.toggle('hover', over);
      }
    }
  });

  document.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;

    if (options.trashDelete) {
      const trash = document.getElementById('trash-zone');
      if (trash) {
        const tr = trash.getBoundingClientRect();
        const over = e.clientX > tr.left && e.clientX < tr.right && e.clientY > tr.top && e.clientY < tr.bottom;
        if (over && card.classList.contains('polaroid-selfie')) {
          card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
          card.style.transform = 'scale(0) rotate(20deg)';
          card.style.opacity = '0';

          const imgSrc = card.querySelector('img')?.src;
          if (imgSrc) {
            const saved = JSON.parse(localStorage.getItem('polaroids') || '[]');
            const updated = saved.filter(p => p.img !== imgSrc);
            localStorage.setItem('polaroids', JSON.stringify(updated));
          }

          setTimeout(() => card.remove(), 300);
          trash.classList.remove('hover');
          return;
        }
        trash.classList.remove('hover');
      }
    }

    card.style.zIndex = '1';
    card.style.cursor = 'none';
    card.style.transition = 'box-shadow 0.3s ease';

    if (card.classList.contains('polaroid-selfie')) {
      const allPolaroids = JSON.parse(localStorage.getItem('polaroids') || '[]');
      const imgSrc = card.querySelector('img')?.src;
      if (imgSrc) {
        const updated = allPolaroids.map(p => {
          if (p.img === imgSrc) {
            return { ...p, left: card.style.left, top: card.style.top };
          }
          return p;
        });
        localStorage.setItem('polaroids', JSON.stringify(updated));
      }
    }
  });

  card._polaroidHasMoved = () => hasMoved;

  if (options.onClick) {
    card.addEventListener('click', (e) => {
      if (hasMoved) { e.preventDefault(); return; }
      options.onClick(card, e);
    });
  }

  card.addEventListener('mouseenter', () => {
    if (!isDragging) card.style.zIndex = '100';
  });

  card.addEventListener('mouseleave', () => {
    if (!isDragging) {
      setTimeout(() => { card.style.zIndex = '1'; }, 400);
    }
  });
}

function initPolaroid() {
  let clickLock = false;

  document.querySelectorAll('.polaroid:not(.polaroid-selfie)').forEach(card => {
    setupPolaroidDrag(card, {
      onClick: () => {
        if (clickLock) return;
        const href = card.dataset.href;
        if (!href) return;
        clickLock = true;
        window.location.href = href;
      }
    });
  });

  setInterval(() => {
    const cards = document.querySelectorAll('.polaroid:not(:hover):not(.polaroid-selfie)');
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    if (!randomCard) return;
    randomCard.style.transform = `rotate(calc(var(--rot) + 2deg)) translateY(-4px)`;
    setTimeout(() => { randomCard.style.transform = ''; }, 400);
  }, 2000);
}
initPolaroid();

function initVinyl() {
  const overlay = document.getElementById('vinyl-overlay');
  if (!overlay) return;

  document.querySelectorAll('.vinyl-item').forEach(item => {
    item.addEventListener('click', () => {
      const href = item.dataset.href;
      if (!href) return;
      overlay.classList.add('active');
      setTimeout(() => {
        window.location.href = href;
      }, 900);
    });
  });
}
initVinyl();

function initCamera() {
  const video = document.getElementById('webcam-video');
  const canvas = document.getElementById('camera-canvas');
  const shutter = document.getElementById('camera-shutter');
  const cameraBody = document.querySelector('.camera-body');
  const cameraWrap = document.querySelector('.camera-wrap');
  const cameraSlot = document.querySelector('.camera-slot');

  if (!video || !canvas || !shutter) return;

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
    })
    .catch(err => {
      console.log('Webcam non disponibile:', err);
    });

  shutter.addEventListener('click', () => {
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    const flashOverlay = document.createElement('div');
    flashOverlay.style.cssText = 'position:fixed;inset:0;background:white;z-index:99999;opacity:1;transition:opacity 0.4s ease;pointer-events:none;';
    document.body.appendChild(flashOverlay);
    setTimeout(() => { flashOverlay.style.opacity = '0'; }, 50);
    setTimeout(() => flashOverlay.remove(), 500);

    if (cameraBody) {
      cameraBody.classList.add('flashing');
      setTimeout(() => cameraBody.classList.remove('flashing'), 400);
    }

    const imgData = canvas.toDataURL('image/jpeg', 0.8);

    const polaroid = document.createElement('div');
    polaroid.className = 'polaroid polaroid-selfie';

    const img = document.createElement('img');
    img.src = imgData;
    img.style.cssText = 'width:100%;aspect-ratio:1/1;object-fit:cover;display:block;';

    const label = document.createElement('p');
    label.textContent = new Date().toLocaleDateString('it-IT');
    label.style.cssText = 'font-family:Space Grotesk,sans-serif;font-size:11px;font-weight:700;color:#1a1a1a;text-align:center;margin-top:8px;';

    const saveBtn = document.createElement('button');
    saveBtn.textContent = '⬇ Salva';
    saveBtn.style.cssText = 'display:block;width:100%;margin-top:4px;background:#1B4FFF;color:white;border:none;border-radius:2px;padding:4px 0;font-family:Space Grotesk,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.05em;cursor:pointer;';
    saveBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const a = document.createElement('a');
      a.href = imgData;
      a.download = 'polaroid-saramurru.jpg';
      a.click();
    });

    polaroid.appendChild(img);
    polaroid.appendChild(label);
    polaroid.appendChild(saveBtn);

    const rot = (Math.random() - 0.5) * 16;

    const cameraImg = document.querySelector('.camera-polaroid-img');
    const cameraRect = cameraImg?.getBoundingClientRect() ||
      { left: window.innerWidth / 2 - 70, bottom: window.innerHeight / 2 + 100, width: 140 };
    const wrapRect = cameraWrap ? cameraWrap.getBoundingClientRect() : { left: 0, top: 0 };
    const left = cameraRect.left + cameraRect.width / 2 - 70 - wrapRect.left;
    const top = cameraRect.bottom - 10 - wrapRect.top;

    polaroid.style.setProperty('--rot', rot + 'deg');
    polaroid.style.position = 'absolute';
    polaroid.style.width = '140px';
    polaroid.style.left = left + 'px';
    polaroid.style.top = top + 'px';
    polaroid.style.zIndex = '200';
    polaroid.style.margin = '0';
    polaroid.style.animation = 'none';
    polaroid.style.transform = `rotate(${rot}deg)`;

    if (cameraWrap) {
      cameraWrap.appendChild(polaroid);
    } else {
      document.body.appendChild(polaroid);
    }

    const saved = JSON.parse(localStorage.getItem('polaroids') || '[]');
    saved.push({ img: imgData, rot: rot, date: new Date().toLocaleDateString('it-IT') });
    localStorage.setItem('polaroids', JSON.stringify(saved));

    setupPolaroidDrag(polaroid, { trashDelete: true });
  });

  loadSavedPolaroids();
}

function loadSavedPolaroids() {
  const saved = JSON.parse(localStorage.getItem('polaroids') || '[]');
  const cameraWrap = document.querySelector('.camera-wrap');
  if (!cameraWrap || !saved.length) return;

  saved.forEach((data, index) => {
    const polaroid = document.createElement('div');
    polaroid.className = 'polaroid polaroid-selfie';
    const rot = data.rot || ((Math.random() - 0.5) * 16);
    polaroid.style.setProperty('--rot', rot + 'deg');
    polaroid.style.position = 'absolute';
    polaroid.style.left = data.left || (150 + index * 50) + 'px';
    polaroid.style.top = data.top || (250 + index * 30) + 'px';
    polaroid.style.zIndex = '1';
    polaroid.style.animation = 'none';
    polaroid.style.transform = `rotate(${rot}deg)`;

    const img = document.createElement('img');
    img.src = data.img;

    const label = document.createElement('p');
    label.textContent = data.date || 'La mia visita 📸';

    const saveBtn = document.createElement('button');
    saveBtn.textContent = '⬇ Salva';
    saveBtn.style.cssText = 'display:block;width:100%;margin-top:6px;background:#1B4FFF;color:white;border:none;border-radius:2px;padding:4px 0;font-family:Space Grotesk,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.05em;cursor:pointer;';
    saveBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const a = document.createElement('a');
      a.href = data.img;
      a.download = 'polaroid-saramurru.jpg';
      a.click();
    });

    polaroid.appendChild(img);
    polaroid.appendChild(label);
    polaroid.appendChild(saveBtn);
    cameraWrap.appendChild(polaroid);
    setupPolaroidDrag(polaroid, { trashDelete: true });
  });
}

initCamera();

function initMusicPlayer() {
  const songs = [
    { file: 'audio/GoDownDeh_Spice.mp3', title: 'Go Down Deh — Spice' },
    { file: 'audio/Freaks_SurfCurse.mp3', title: 'Freaks — Surf Curse' },
    { file: 'audio/505 _ArcticMonkeys.mp3', title: '505 — Arctic Monkeys' },
    { file: 'audio/DelVerde_Calcuttamp3.mp3', title: 'Del Verde — Calcutta' },
    { file: 'audio/UpDown_TPain_Real.mp3', title: 'Up Down — T-Pain' },
    { file: 'audio/Affogare_Legno.mp3', title: 'Affogare — Legno' },
    { file: 'audio/ManonLisa_LePetitPe\u0302cheur.mp3', title: 'Manon Lisa — Le Petit Pêcheur' },
    { file: 'audio/BaciamiBaciami_Fulminacci.mp3', title: 'Baciami Baciami — Fulminacci' },
    { file: 'audio/StupidaScusa.mp3', title: 'Stupida Scusa — Still Charles' },
  ];

  const savedSong = sessionStorage.getItem('currentSong');
  const savedTime = parseFloat(sessionStorage.getItem('currentTime') || '0');
  const wasPlaying = sessionStorage.getItem('wasPlaying') === 'true';

  let current = 0;
  let isPlaying = false;
  const audio = new Audio();
  audio.volume = 0.5;

  if (savedSong) {
    current = parseInt(savedSong);
  }

  const pill = document.getElementById('music-pill');
  const pillExpanded = document.getElementById('music-pill-expanded');
  const playBtn = document.getElementById('pill-play');
  const playBtn2 = document.getElementById('pill-play-2');
  const prevBtn = document.getElementById('pill-prev');
  const nextBtn = document.getElementById('pill-next');
  const titleEl = document.getElementById('pill-title');
  const dots = document.querySelector('.pill-dots');

  if (!pill) return;

  let expandedOpen = false;

  pill.addEventListener('click', (e) => {
    if (e.target === playBtn || playBtn.contains(e.target)) return;
    expandedOpen = !expandedOpen;
    pillExpanded.classList.toggle('visible', expandedOpen);
  });

  function loadSong(index) {
    current = (index + songs.length) % songs.length;
    audio.src = songs[current].file;
    if (titleEl) titleEl.textContent = songs[current].title;
    if (isPlaying) audio.play().catch(() => {});
    sessionStorage.setItem('currentSong', current);
  }

  function togglePlay() {
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      sessionStorage.setItem('wasPlaying', 'false');
      if (playBtn) playBtn.textContent = '▶';
      if (playBtn2) playBtn2.textContent = '▶';
      if (dots) dots.classList.add('paused');
    } else {
      audio.play().catch(() => {});
      isPlaying = true;
      sessionStorage.setItem('wasPlaying', 'true');
      if (playBtn) playBtn.textContent = '⏸';
      if (playBtn2) playBtn2.textContent = '⏸';
      if (dots) dots.classList.remove('paused');
    }
  }

  if (playBtn) playBtn.addEventListener('click', (e) => { e.stopPropagation(); togglePlay(); });
  if (playBtn2) playBtn2.addEventListener('click', togglePlay);
  if (prevBtn) prevBtn.addEventListener('click', () => loadSong(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => loadSong(current + 1));

  audio.addEventListener('ended', () => loadSong(current + 1));

  document.addEventListener('click', (e) => {
    if (expandedOpen && !pill.contains(e.target) && !pillExpanded.contains(e.target)) {
      expandedOpen = false;
      pillExpanded.classList.remove('visible');
    }
  });

  loadSong(savedSong ? parseInt(savedSong) : 0);

  if (wasPlaying) {
    setTimeout(() => {
      audio.currentTime = savedTime;
      togglePlay();
    }, 50);
  }

  setInterval(() => {
    if (isPlaying) {
      sessionStorage.setItem('currentTime', audio.currentTime);
    }
  }, 1000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMusicPlayer);
} else {
  initMusicPlayer();
}
