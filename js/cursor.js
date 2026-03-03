/* ============================================
   CUSTOM CURSOR — Magnetic + Blend Mode
   ============================================ */

const Cursor = (() => {
  let dot, follower;
  let mouseX = 0, mouseY = 0;
  let dotX = 0, dotY = 0;
  let followerX = 0, followerY = 0;
  let isHovering = false;
  let magnetTargets = [];
  let rafId = null;

  function init() {
    // Skip on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    dot = document.querySelector('.cursor-dot');
    follower = document.querySelector('.cursor-follower');
    if (!dot || !follower) return;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; follower.style.opacity = '1'; });
    document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; follower.style.opacity = '0'; });

    bindHoverTargets();
    animate();
  }

  function bindHoverTargets() {
    const targets = document.querySelectorAll('a, button, [data-magnetic], input, textarea, select');
    targets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        isHovering = true;
        dot.classList.add('hovering');
        follower.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        isHovering = false;
        dot.classList.remove('hovering');
        follower.classList.remove('hovering');
      });
    });

    // Magnetic effect
    magnetTargets = document.querySelectorAll('[data-magnetic]');
    magnetTargets.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.3;
        const deltaY = (e.clientY - centerY) * 0.3;
        el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function animate() {
    // Dot follows immediately
    dotX += (mouseX - dotX) * 0.8;
    dotY += (mouseY - dotY) * 0.8;
    dot.style.left = dotX + 'px';
    dot.style.top = dotY + 'px';

    // Follower has delay
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';

    rafId = requestAnimationFrame(animate);
  }

  function refresh() {
    bindHoverTargets();
  }

  function destroy() {
    if (rafId) cancelAnimationFrame(rafId);
    document.removeEventListener('mousemove', onMouseMove);
  }

  return { init, refresh, destroy };
})();
