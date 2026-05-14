/**
 * script.js — Mascafer Pipes Website
 * ─────────────────────────────────────
 * Implements all assignment requirements:
 *
 * 1. STICKY HEADER
 *    - Hidden initially (CSS: translateY(-100%))
 *    - Slides in when user scrolls PAST first fold (> 100vh)
 *    - Slides out when user scrolls BACK to within first fold
 *    - Smooth CSS transition handles animation
 *
 * 2. IMAGE CAROUSEL (product images in hero)
 *    - Single-slide view (full width)
 *    - Prev / Next arrows
 *    - Dot indicators
 *    - Auto-plays every 4 seconds; pauses on hover
 *    - Touch swipe support
 *
 * 3. CAROUSEL ZOOM
 *    - Circular lens follows cursor inside the image
 *    - Zoomed preview panel (2.5×) appears beside the image
 *    - Smooth show/hide on mouseenter/mouseleave
 *
 * 4. MOBILE NAV — hamburger toggle
 *
 * 5. SCROLL REVEAL — IntersectionObserver
 *
 * 6. STATS COUNTER — count-up animation
 *
 * 7. CONTACT FORM VALIDATION
 *
 * 8. SMOOTH ANCHOR SCROLL with sticky header offset
 */

'use strict';

/* ─────────────────────────────────────────────────────────────
   TINY UTILITY HELPERS
   ───────────────────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ─────────────────────────────────────────────────────────────
   1. STICKY HEADER
   ─────────────────────────────────────────────────────────────
   Logic:
     • "First fold" = viewport height (window.innerHeight)
     • If scrollY > firstFold → show sticky header (.is-visible)
     • If scrollY <= firstFold → hide sticky header
   ───────────────────────────────────────────────────────────── */
(function stickyHeader() {
  const header = $('#stickyHeader');
  if (!header) return;

  let ticking = false;

  function update() {
    // First fold ends at one full viewport height
    const firstFoldEnd = window.innerHeight;

    if (window.scrollY > firstFoldEnd) {
      // User scrolled past the first fold — show the sticky header
      if (!header.classList.contains('is-visible')) {
        header.classList.add('is-visible');
      }
    } else {
      // Still within the first fold — hide the sticky header
      if (header.classList.contains('is-visible')) {
        header.classList.remove('is-visible');
      }
    }

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    // Use requestAnimationFrame to throttle scroll handler for performance
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  // Run once on page load (handles mid-page refreshes)
  update();
})();


/* ─────────────────────────────────────────────────────────────
   2. MOBILE NAV — hamburger toggle
   ───────────────────────────────────────────────────────────── */
(function mobileNav() {
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobileMenu');
  if (!hamburger || !mobileMenu) return;

  function toggle(open) {
    hamburger.classList.toggle('is-open', open);
    mobileMenu.classList.toggle('is-open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  }

  hamburger.addEventListener('click', () => {
    toggle(!mobileMenu.classList.contains('is-open'));
  });

  // Close when a nav link is clicked
  $$('.mob-link, .mob-cta', mobileMenu).forEach(el => {
    el.addEventListener('click', () => toggle(false));
  });

  // Close when clicking outside nav
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      toggle(false);
    }
  });
})();


/* ─────────────────────────────────────────────────────────────
   3. PRODUCT IMAGE CAROUSEL (hero section)
   ─────────────────────────────────────────────────────────────
   Single-visible-slide carousel with:
   - Prev / Next buttons
   - Dot indicators
   - Auto-play (pauses on hover)
   - Touch swipe
   ───────────────────────────────────────────────────────────── */
(function productCarousel() {
  const track   = $('#productTrack');
  const dotsWrap = $('#prodDots');
  const btnPrev  = $('#prodPrev');
  const btnNext  = $('#prodNext');
  if (!track) return;

  const slides  = $$('.product-slide', track);
  const total   = slides.length;
  let   current = 0;
  let   autoTimer;

  /* Build dot indicators */
  function buildDots() {
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'prod-dot' + (i === current ? ' is-active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Slide ' + (i + 1));
      dot.setAttribute('aria-selected', String(i === current));
      dot.addEventListener('click', () => { goTo(i); });
      dotsWrap.appendChild(dot);
    });
  }

  /* Move carousel to index `idx` */
  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    buildDots();
  }

  /* Previous slide */
  function prev() { goTo(current - 1); }

  /* Next slide */
  function next() { goTo(current + 1); }

  /* Auto-play */
  function startAuto() {
    autoTimer = setInterval(next, 4000);
  }
  function stopAuto() {
    clearInterval(autoTimer);
  }

  /* Arrow buttons */
  btnPrev && btnPrev.addEventListener('click', prev);
  btnNext && btnNext.addEventListener('click', next);

  /* Keyboard navigation (when carousel section visible) */
  document.addEventListener('keydown', (e) => {
    const section = $('#top');
    if (!section) return;
    const rect = section.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
  });

  /* Touch swipe */
  let swipeStartX = 0;
  let swipeStartY = 0;
  let swiping     = false;

  track.addEventListener('touchstart', (e) => {
    swipeStartX = e.touches[0].clientX;
    swipeStartY = e.touches[0].clientY;
    swiping = false;
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    const dx = Math.abs(e.touches[0].clientX - swipeStartX);
    const dy = Math.abs(e.touches[0].clientY - swipeStartY);
    if (dx > dy && dx > 10) swiping = true;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    if (!swiping) return;
    const delta = e.changedTouches[0].clientX - swipeStartX;
    if (delta < -40) next();
    else if (delta > 40) prev();
    swiping = false;
  }, { passive: true });

  /* Pause on hover */
  const wrapper = $('.product-carousel');
  if (wrapper) {
    wrapper.addEventListener('mouseenter', stopAuto);
    wrapper.addEventListener('mouseleave', startAuto);
    wrapper.addEventListener('focusin',    stopAuto);
    wrapper.addEventListener('focusout',   startAuto);
  }

  /* Init */
  goTo(0);
  startAuto();
})();


/* ─────────────────────────────────────────────────────────────
   4. CAROUSEL IMAGE ZOOM
   ─────────────────────────────────────────────────────────────
   For each .product-img-wrap:
   • A circular lens follows the cursor
   • A magnified preview (2.5×) appears beside the image
   ───────────────────────────────────────────────────────────── */
(function carouselZoom() {
  const imgWraps = $$('.product-img-wrap');

  imgWraps.forEach(wrap => {
    const lens       = $('.zoom-lens',    wrap);
    const preview    = $('.zoom-preview', wrap);
    const previewImg = preview ? $('img', preview) : null;
    if (!lens || !preview || !previewImg) return;

    const ZOOM  = 2.5;   // magnification factor
    const LSIZE = 110;   // lens diameter in px (matches CSS)

    /* Show zoom elements */
    wrap.addEventListener('mouseenter', () => {
      lens.style.opacity    = '1';
      preview.style.opacity = '1';
    });

    /* Hide zoom elements */
    wrap.addEventListener('mouseleave', () => {
      lens.style.opacity    = '0';
      preview.style.opacity = '0';
    });

    /* Update positions on mouse move */
    wrap.addEventListener('mousemove', (e) => {
      const rect  = wrap.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;   // px from left of image
      const mouseY = e.clientY - rect.top;    // px from top of image

      /* ── 1. Position lens (centred on cursor) ── */
      lens.style.left = mouseX + 'px';
      lens.style.top  = mouseY + 'px';

      /* ── 2. Position preview panel ── */
      const previewW = preview.offsetWidth  || 240;
      const previewH = preview.offsetHeight || 160;
      const margin   = 12;

      // Default: show to the right of cursor
      let px = mouseX + LSIZE / 2 + margin;
      let py = mouseY - previewH / 2;

      // Flip left if too close to right edge
      if (px + previewW > rect.width - margin) {
        px = mouseX - LSIZE / 2 - margin - previewW;
      }
      // Clamp vertically within image bounds
      py = Math.max(margin, Math.min(rect.height - previewH - margin, py));

      preview.style.left = px + 'px';
      preview.style.top  = py + 'px';

      /* ── 3. Calculate zoomed image offset ── */
      // Fraction of image where cursor is
      const fracX = mouseX / rect.width;
      const fracY = mouseY / rect.height;

      // Zoomed image rendered size
      const zW = previewW * ZOOM;
      const zH = previewH * ZOOM;

      // Offset to centre the zoomed region on the preview
      let oX = fracX * zW - previewW / 2;
      let oY = fracY * zH - previewH / 2;

      // Clamp so we don't go out of bounds
      oX = Math.max(0, Math.min(zW - previewW, oX));
      oY = Math.max(0, Math.min(zH - previewH, oY));

      // Apply to preview image
      previewImg.style.width     = zW + 'px';
      previewImg.style.height    = zH + 'px';
      previewImg.style.transform = `translate(-${oX}px, -${oY}px)`;
    });
  });
})();


/* ─────────────────────────────────────────────────────────────
   5. SCROLL REVEAL — IntersectionObserver
   ───────────────────────────────────────────────────────────── */
(function scrollReveal() {
  const targets = $$('.reveal');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    // Fallback: show everything immediately
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // animate only once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px',
  });

  targets.forEach(el => observer.observe(el));
})();


/* ─────────────────────────────────────────────────────────────
   6. STATS COUNTER ANIMATION
   ─────────────────────────────────────────────────────────────
   Counts from 0 to data-target when element enters viewport.
   ───────────────────────────────────────────────────────────── */
(function statsCounter() {
  const statEls = $$('.stat-num[data-target]');
  if (!statEls.length) return;

  const DURATION = 1400;

  // Ease-out cubic for natural deceleration
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function animateNum(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const start  = performance.now();

    (function tick(now) {
      const progress = Math.min((now - start) / DURATION, 1);
      el.textContent  = Math.round(easeOut(progress) * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    })(start);
  }

  if (!('IntersectionObserver' in window)) {
    statEls.forEach(el => {
      el.textContent = parseInt(el.getAttribute('data-target'), 10);
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateNum(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statEls.forEach(el => observer.observe(el));
})();


/* ─────────────────────────────────────────────────────────────
   7. CONTACT FORM VALIDATION
   ───────────────────────────────────────────────────────────── */
(function contactForm() {
  const form  = $('#contactForm');
  if (!form) return;

  const nameInput  = $('#fullName');
  const emailInput = $('#companyEmail');
  const emailRe    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    // Name check
    if (!nameInput.value.trim()) {
      nameInput.classList.add('error');
      nameInput.focus();
      valid = false;
    }

    // Email check
    if (!emailRe.test(emailInput.value.trim())) {
      emailInput.classList.add('error');
      if (valid) emailInput.focus();
      valid = false;
    }

    if (!valid) return;

    // Success state
    emailInput.classList.remove('error');
    nameInput.classList.remove('error');
    form.innerHTML = `
      <div style="
        text-align: center;
        padding: 32px 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
      ">
        <div style="
          width: 56px; height: 56px;
          background: #F0FFF4;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        ">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2.5">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <h4 style="font-family:'Outfit',sans-serif; font-size:1.1rem; color:#0D1B2A;">
          Request Submitted!
        </h4>
        <p style="font-size:0.88rem; color:#718096; max-width:280px;">
          Thank you. Our team will get back to you within 24 hours with a customised quote.
        </p>
      </div>
    `;
  });

  // Clear error state when user types
  [nameInput, emailInput].forEach(input => {
    input && input.addEventListener('input', () => input.classList.remove('error'));
  });
})();


/* ─────────────────────────────────────────────────────────────
   8. SMOOTH ANCHOR SCROLL WITH HEADER OFFSET
   ─────────────────────────────────────────────────────────────
   Intercepts all <a href="#..."> clicks and scrolls smoothly
   with offset for sticky header height.
   ───────────────────────────────────────────────────────────── */
(function smoothScroll() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const id = link.getAttribute('href').slice(1);
    if (!id) return;

    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();

    // Account for sticky header height + small breathing room
    const offset = 72;
    const y = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top: y, behavior: 'smooth' });
  });
})();
