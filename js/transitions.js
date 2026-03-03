/* ============================================
   BARBA.JS PAGE TRANSITIONS
   ============================================ */

const Transitions = (() => {

  function init() {
    if (typeof barba === 'undefined') return;

    const overlay = document.querySelector('.transition-overlay');

    barba.init({
      preventRunning: true,
      transitions: [{
        name: 'overlay-transition',

        leave(data) {
          const done = this.async();

          // Animate overlay in
          gsap.timeline()
            .set(overlay, { transformOrigin: 'bottom', scaleY: 0 })
            .to(overlay, {
              scaleY: 1,
              duration: 0.6,
              ease: 'power4.inOut'
            })
            .call(() => {
              window.scrollTo(0, 0);
              done();
            });
        },

        enter(data) {
          // Animate overlay out
          gsap.timeline()
            .set(overlay, { transformOrigin: 'top' })
            .to(overlay, {
              scaleY: 0,
              duration: 0.6,
              ease: 'power4.inOut',
              delay: 0.2
            });
        },

        after(data) {
          // Re-init everything for new page
          Animations.refresh();
          Cursor.refresh();

          // Re-init Three.js only on home page
          if (data.next.namespace === 'home') {
            HeroScene.init();
          }

          // Update active nav link
          updateActiveNav(data.next.url.path);

          // Re-init Lenis
          if (typeof initLenis === 'function') {
            initLenis();
          }
        }
      }]
    });
  }

  function updateActiveNav(path) {
    const links = document.querySelectorAll('.nav__link');
    links.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (path.endsWith(href) || (path === '/' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  return { init };
})();
