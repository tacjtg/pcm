/* ============================================
   GSAP ANIMATIONS — ScrollTrigger + SplitText
   ============================================ */

const Animations = (() => {

  function init() {
    gsap.registerPlugin(ScrollTrigger);

    animateSplitText();
    animateElements();
    animateStats();
    animateImageReveals();
    initTestimonials();
    initCourseAccordion();
  }

  /* --- Split Text Animations --- */
  function animateSplitText() {
    const splitTargets = document.querySelectorAll('[data-split]');

    splitTargets.forEach(target => {
      const type = target.dataset.split; // "chars" or "words"

      // Check if SplitText is available (it's a premium GSAP plugin)
      if (typeof SplitText !== 'undefined') {
        const split = new SplitText(target, {
          type: type === 'chars' ? 'chars,words' : 'words',
          charsClass: 'char',
          wordsClass: 'word'
        });

        const elements = type === 'chars' ? split.chars : split.words;

        gsap.set(elements, { yPercent: 110, opacity: 0 });

        gsap.to(elements, {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          ease: 'power4.out',
          stagger: type === 'chars' ? 0.02 : 0.06,
          scrollTrigger: {
            trigger: target,
            start: 'top 85%',
            once: true
          }
        });
      } else {
        // Fallback: wrap words manually, preserving <br> tags
        const html = target.innerHTML.replace(/<br\s*\/?>/gi, ' <br> ');
        const text = html.replace(/<[^>]*>/g, ' ');
        const words = text.split(/\s+/).filter(w => w.length > 0);

        // Rebuild with <br> in proper positions
        let result = '';
        const originalHtml = target.innerHTML;
        const brPositions = [];
        let wordIndex = 0;
        const rawWords = originalHtml.replace(/<br\s*\/?>/gi, '|||BR|||').split(/\s+/);
        rawWords.forEach(w => {
          if (w.includes('|||BR|||')) {
            brPositions.push(wordIndex);
            const clean = w.replace(/\|\|\|BR\|\|\|/g, '');
            if (clean.length > 0) wordIndex++;
          } else if (w.length > 0) {
            wordIndex++;
          }
        });

        words.forEach((word, i) => {
          if (brPositions.includes(i)) result += '<br>';
          result += `<span class="word" style="display:inline-block;overflow:hidden;"><span style="display:inline-block;">${word}</span></span> `;
        });

        target.innerHTML = result;

        const spans = target.querySelectorAll('.word > span');
        gsap.set(spans, { yPercent: 110, opacity: 0 });

        gsap.to(spans, {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          ease: 'power4.out',
          stagger: 0.06,
          scrollTrigger: {
            trigger: target,
            start: 'top 85%',
            once: true
          }
        });
      }
    });
  }

  /* --- General Element Animations --- */
  function animateElements() {
    const elements = document.querySelectorAll('[data-animate]');

    elements.forEach((el, i) => {
      const type = el.dataset.animate;
      const props = { opacity: 0 };
      const toProps = { opacity: 1, duration: 1, ease: 'power3.out' };

      switch (type) {
        case 'fade-up':
          props.y = 40;
          toProps.y = 0;
          break;
        case 'fade-left':
          props.x = -40;
          toProps.x = 0;
          break;
        case 'fade-right':
          props.x = 40;
          toProps.x = 0;
          break;
        case 'scale-up':
          props.scale = 0.9;
          toProps.scale = 1;
          break;
      }

      gsap.set(el, props);

      gsap.to(el, {
        ...toProps,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true
        },
        delay: el.closest('.training-grid') ? (Array.from(el.parentNode.children).indexOf(el)) * 0.1 : 0
      });
    });
  }

  /* --- Stats Counter --- */
  function animateStats() {
    const counters = document.querySelectorAll('[data-count]');

    counters.forEach(counter => {
      const target = parseInt(counter.dataset.count);
      const suffix = target === 100 ? '%' : '+';

      ScrollTrigger.create({
        trigger: counter,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(counter, {
            duration: 2,
            ease: 'power2.out',
            onUpdate: function () {
              const progress = this.progress();
              counter.textContent = Math.round(target * progress).toLocaleString() + suffix;
            }
          });
        }
      });
    });
  }

  /* --- Image Reveals --- */
  function animateImageReveals() {
    const reveals = document.querySelectorAll('.about-preview__image-reveal');

    reveals.forEach(reveal => {
      gsap.to(reveal, {
        scaleY: 0,
        transformOrigin: 'bottom',
        duration: 1.2,
        ease: 'power4.inOut',
        scrollTrigger: {
          trigger: reveal.parentElement,
          start: 'top 70%',
          once: true
        }
      });
    });
  }

  /* --- Testimonials --- */
  function initTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.testimonials__dot');
    if (testimonials.length === 0) return;

    let current = 0;
    let interval;

    function show(index) {
      testimonials.forEach(t => t.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));
      testimonials[index].classList.add('active');
      dots[index].classList.add('active');
      current = index;
    }

    function next() {
      show((current + 1) % testimonials.length);
    }

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        clearInterval(interval);
        show(parseInt(dot.dataset.index));
        interval = setInterval(next, 5000);
      });
    });

    interval = setInterval(next, 5000);
  }

  /* --- Course Accordion --- */
  function initCourseAccordion() {
    const items = document.querySelectorAll('.course-item__header');

    items.forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        const wasOpen = item.classList.contains('open');

        // Close all
        document.querySelectorAll('.course-item.open').forEach(openItem => {
          openItem.classList.remove('open');
        });

        // Open clicked if it wasn't open
        if (!wasOpen) {
          item.classList.add('open');
        }
      });
    });
  }

  /* --- Refresh (for page transitions) --- */
  function refresh() {
    ScrollTrigger.getAll().forEach(st => st.kill());
    init();
  }

  function destroy() {
    ScrollTrigger.getAll().forEach(st => st.kill());
  }

  return { init, refresh, destroy };
})();
