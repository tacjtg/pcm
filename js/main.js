/* ============================================
   MAIN — Orchestrates all modules
   ============================================ */

let lenis;

function initLenis() {
  // Destroy previous instance
  if (lenis) {
    lenis.destroy();
  }

  lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
  });

  // Connect Lenis to GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

/* --- Navigation --- */
function initNav() {
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile-menu');
  const mobileLinks = document.querySelectorAll('.nav__mobile-link');
  const nav = document.querySelector('.nav');

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');

      // Prevent body scroll when menu is open
      if (mobileMenu.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close on link click
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Scroll-based nav styling
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }
}

/* --- Testimonials Auto-rotation --- */
function initTestimonials() {
  // Handled in animations.js
}

/* --- Initialize Everything --- */
document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll
  initLenis();

  // Navigation
  initNav();

  // Custom cursor
  Cursor.init();

  // Three.js hero (only on home page)
  if (document.getElementById('hero-canvas')) {
    HeroScene.init();
  }

  // GSAP Animations
  Animations.init();

  // Page transitions (Barba.js)
  Transitions.init();
});
