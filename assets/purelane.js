class PurelaneBackdrop {
  constructor() {
    this.stage = document.getElementById('pl-scenes');
    if (!this.stage) return;
    this.scenes = Array.from(this.stage.querySelectorAll('.pl-scene'));
    this.currentScene = 0;
    this.observer = null;

    this.initObserver();
    this.initParallax();
  }

  setScene(n) {
    if (n === this.currentScene) return;
    this.currentScene = n;
    this.scenes.forEach((s, i) => {
      s.classList.toggle('on', i + 1 === n);
    });
    this.stage.setAttribute('data-d', String(n));
  }

  initObserver() {
    if (this.observer) {
      this.observer.disconnect();
    }

    // IntersectionObserver triggers when a [data-scene] section crosses the vertical center line
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sceneNum = parseInt(entry.target.getAttribute('data-scene'), 10);
          if (sceneNum) {
            this.setScene(sceneNum);
          }
        }
      });
    }, {
      root: null,
      rootMargin: '-50% 0px -50% 0px', // Horizontal center line trigger
      threshold: 0
    });

    this.observeSections();
  }

  observeSections() {
    const zones = document.querySelectorAll('[data-scene]');
    zones.forEach(z => {
      this.observer.observe(z);
    });
  }

  refresh() {
    this.stage = document.getElementById('pl-scenes');
    if (!this.stage) return;
    this.scenes = Array.from(this.stage.querySelectorAll('.pl-scene'));
    this.initObserver();
  }

  initParallax() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    let mx = 0, my = 0;
    let tick = false;

    const wl = this.stage.querySelectorAll('.pl-wl');

    const updateParallax = () => {
      const y = window.scrollY || window.pageYOffset;

      // Update water layers drift offset
      wl.forEach((layer, i) => {
        const d = [0.05, 0.09, 0.03, 0.02][i] || 0.05;
        const px = (mx * d * 130).toFixed(1);
        const py = (-y * d + my * d * 90).toFixed(1);
        layer.style.setProperty('--px', `${px}px`);
        layer.style.setProperty('--py', `${py}px`);
      });

      tick = false;
    };

    const onScroll = () => {
      if (!tick) {
        requestAnimationFrame(updateParallax);
        tick = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    // Listen to mouse movement for 3D parallax on large screens
    if (window.matchMedia('(min-width: 1024px)').matches) {
      window.addEventListener('mousemove', (e) => {
        mx = (e.clientX / window.innerWidth - 0.5) * 2;
        my = (e.clientY / window.innerHeight - 0.5) * 2;
        onScroll();
      }, { passive: true });
    }
  }
}

class PurelaneHero {
  constructor(sectionElement) {
    this.section = sectionElement;
    this.stage = this.section.querySelector('.pl-hstage');
    if (!this.stage) return;
    this.slides = Array.from(this.stage.querySelectorAll('.pl-hslide'));
    this.dots = Array.from(this.section.querySelectorAll('.pl-hdots button'));
    this.prod = this.section.querySelector('.pl-hero-prod');
    this.currentIdx = 0;
    this.timer = null;
    this.autoplayInterval = 3800; // 3.8 second autoplay duration matching prototype

    this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.initDots();
    this.startAutoplay();
    this.initParallax();

    // Event listeners for autoplay pause/resume on hover
    this.onMouseEnter = () => this.stopAutoplay();
    this.onMouseLeave = () => this.startAutoplay();

    this.section.addEventListener('mouseenter', this.onMouseEnter);
    this.section.addEventListener('mouseleave', this.onMouseLeave);
  }

  setSlide(index) {
    if (index < 0 || index >= this.slides.length) return;
    this.currentIdx = index;

    this.slides.forEach((slide, i) => {
      slide.classList.toggle('on', i === index);
    });

    this.dots.forEach((dot, i) => {
      dot.classList.toggle('on', i === index);
    });
  }

  nextSlide() {
    let nextIdx = (this.currentIdx + 1) % this.slides.length;
    this.setSlide(nextIdx);
  }

  startAutoplay() {
    if (this.reduceMotion || this.slides.length <= 1) return;
    this.stopAutoplay();
    this.timer = setInterval(() => {
      this.nextSlide();
    }, this.autoplayInterval);
  }

  stopAutoplay() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  initDots() {
    this.dots.forEach((dot, i) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        this.setSlide(i);
        this.startAutoplay(); // Restart autoplay loop with fresh timer
      });
    });
  }

  initParallax() {
    if (this.reduceMotion || !this.prod || !window.matchMedia('(min-width: 1024px)').matches) return;

    let mx = 0, my = 0;
    let tick = false;

    this.onMouseMove = (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!tick) {
        requestAnimationFrame(() => {
          if (!this.prod) return;
          const tx = (mx * 26).toFixed(1);
          const ty = (my * 18).toFixed(1);
          this.prod.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
          tick = false;
        });
        tick = true;
      }
    };

    window.addEventListener('mousemove', this.onMouseMove, { passive: true });
  }

  destroy() {
    this.stopAutoplay();
    this.section.removeEventListener('mouseenter', this.onMouseEnter);
    this.section.removeEventListener('mouseleave', this.onMouseLeave);
    if (this.onMouseMove) {
      window.removeEventListener('mousemove', this.onMouseMove);
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  window.purelaneBackdrop = new PurelaneBackdrop();

  window.purelaneHeroes = [];
  document.querySelectorAll('.pl-hero').forEach(el => {
    window.purelaneHeroes.push(new PurelaneHero(el));
  });

  // Custom reveal on scroll functionality using IntersectionObserver
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revs = document.querySelectorAll('.pl-rv');

  if ('IntersectionObserver' in window && !reduceMotion) {
    const ro = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          ro.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.12
    });

    revs.forEach(el => ro.observe(el));
  } else {
    revs.forEach(el => el.classList.add('in'));
  }
});

// Shopify Theme Editor Integration
document.addEventListener('shopify:section:load', (e) => {
  if (window.purelaneBackdrop) {
    window.purelaneBackdrop.refresh();
  } else {
    window.purelaneBackdrop = new PurelaneBackdrop();
  }

  const hero = e.target.querySelector('.pl-hero');
  if (hero) {
    if (!window.purelaneHeroes) window.purelaneHeroes = [];
    window.purelaneHeroes.push(new PurelaneHero(hero));
  }
});

document.addEventListener('shopify:section:unload', (e) => {
  if (window.purelaneBackdrop) {
    window.purelaneBackdrop.refresh();
  }

  const hero = e.target.querySelector('.pl-hero');
  if (hero && window.purelaneHeroes) {
    const idx = window.purelaneHeroes.findIndex(inst => inst.section === hero);
    if (idx > -1) {
      window.purelaneHeroes[idx].destroy();
      window.purelaneHeroes.splice(idx, 1);
    }
  }
});
