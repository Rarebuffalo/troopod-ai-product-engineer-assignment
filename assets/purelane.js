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
    if (this.reduceMotion || !this.prod) return;

    let mx = 0, my = 0;
    let tick = false;
    const hdr = document.getElementById('pl-hdr');

    const updatePosition = () => {
      const y = window.scrollY || window.pageYOffset;

      // Toggle sticky header position offset
      if (hdr) {
        hdr.classList.toggle('up', y > 90);
      }

      // Parallax on product stage bottle compositions
      if (window.matchMedia('(min-width: 1024px)').matches) {
        const scrollFactor = Math.min(y / 700, 1);
        const tx = (mx * -16).toFixed(2);
        const ty = (-scrollFactor * 54 + my * -10).toFixed(2);
        const scaleVal = (1 - scrollFactor * 0.06).toFixed(3);
        this.prod.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${scaleVal})`;
      } else {
        // Reset layout values on smaller mobile viewport sizes
        this.prod.style.transform = '';
      }
      tick = false;
    };

    this.onScroll = () => {
      if (!tick) {
        requestAnimationFrame(updatePosition);
        tick = true;
      }
    };

    this.onMouseMove = (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
      this.onScroll();
    };

    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onScroll);
    window.addEventListener('mousemove', this.onMouseMove, { passive: true });

    // Initial position call
    this.onScroll();
  }

  destroy() {
    this.stopAutoplay();
    this.section.removeEventListener('mouseenter', this.onMouseEnter);
    this.section.removeEventListener('mouseleave', this.onMouseLeave);
    if (this.onScroll) {
      window.removeEventListener('scroll', this.onScroll);
      window.removeEventListener('resize', this.onScroll);
    }
    if (this.onMouseMove) {
      window.removeEventListener('mousemove', this.onMouseMove);
    }
  }
}

class PurelaneRotator {
  constructor(element) {
    this.rot = element;
    this.imgs = Array.from(this.rot.querySelectorAll('.pl-rot-pimg'));
    this.dots = Array.from(this.rot.querySelectorAll('.pl-rot-dot'));
    this.capB = this.rot.querySelector('.pl-rot-cap-title');
    this.capS = this.rot.querySelector('.pl-rot-cap-sub');
    this.idx = 0;
    this.timer = null;
    this.interval = 2900;
    this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (this.imgs.length <= 1) return;

    if (!this.reduceMotion && 'IntersectionObserver' in window) {
      this.io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.timer) {
            this.start();
          } else if (!entry.isIntersecting && this.timer) {
            this.stop();
          }
        });
      }, { threshold: 0.25 });
      this.io.observe(this.rot);
    } else {
      this.start();
    }
  }

  step() {
    this.imgs[this.idx].classList.remove('on');
    if (this.dots[this.idx]) this.dots[this.idx].classList.remove('on');
    this.idx = (this.idx + 1) % this.imgs.length;
    this.imgs[this.idx].classList.add('on');
    if (this.dots[this.idx]) this.dots[this.idx].classList.add('on');
    
    const name = this.imgs[this.idx].getAttribute('data-name');
    const note = this.imgs[this.idx].getAttribute('data-note');
    if (this.capB && name) this.capB.innerHTML = name;
    if (this.capS && note) this.capS.textContent = note;
  }

  start() {
    this.stop();
    this.timer = setInterval(() => this.step(), this.interval);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  destroy() {
    this.stop();
    if (this.io) {
      this.io.disconnect();
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

  window.purelaneRotators = [];
  document.querySelectorAll('.pl-rot').forEach(el => {
    window.purelaneRotators.push(new PurelaneRotator(el));
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

  // Vertical progress dots rail indicator synchronization on scroll
  const rail = document.querySelector('.pl-rail');
  if (rail) {
    const railLinks = Array.from(rail.querySelectorAll('a'));
    const targets = railLinks.map(a => document.querySelector(a.getAttribute('href')));

    const syncRail = () => {
      const mid = window.scrollY + window.innerHeight * 0.42;
      let activeIdx = 0;
      targets.forEach((target, i) => {
        if (target && target.offsetTop <= mid) {
          activeIdx = i;
        }
      });
      railLinks.forEach((link, i) => {
        link.classList.toggle('on', i === activeIdx);
      });
    };

    window.addEventListener('scroll', syncRail, { passive: true });
    // Initial trigger
    syncRail();
  }

  // Dynamic AJAX add-to-cart handler for reusable Purelane cards
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.pl-card-add-btn');
    if (!btn || btn.disabled) return;

    const variantId = btn.getAttribute('data-variant-id');
    if (!variantId) return;

    btn.disabled = true;
    const oldText = btn.textContent;
    btn.textContent = 'Adding...';

    const rootPath = (window.Shopify && window.Shopify.routes) ? window.Shopify.routes.root : '/';

    fetch(rootPath + 'cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: variantId,
        quantity: 1
      })
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed adding product to cart');
      return res.json();
    })
    .then(data => {
      btn.textContent = 'Added!';
      return fetch(rootPath + 'cart.js');
    })
    .then(res => res.json())
    .then(cart => {
      // Synchronize all custom cart count bubbles
      document.querySelectorAll('.pl-dot').forEach(el => {
        el.textContent = cart.item_count;
      });

      // Update Dawn's cart drawer state if active
      const cartDrawer = document.querySelector('cart-drawer');
      if (cartDrawer && typeof cartDrawer.renderContents === 'function') {
        // Dawn native cart drawer update
        cartDrawer.renderContents(cart);
      } else {
        // Fallback: direct redirect to Cart view
        window.location.href = rootPath + 'cart';
      }
    })
    .catch(err => {
      console.warn('Fallback to standard add to cart path:', err);
      window.location.href = rootPath + 'cart/add?id=' + variantId + '&quantity=1';
    })
    .finally(() => {
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = oldText;
      }, 1200);
    });
  });
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

  const rot = e.target.querySelector('.pl-rot');
  if (rot) {
    if (!window.purelaneRotators) window.purelaneRotators = [];
    window.purelaneRotators.push(new PurelaneRotator(rot));
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

  const rot = e.target.querySelector('.pl-rot');
  if (rot && window.purelaneRotators) {
    const idx = window.purelaneRotators.findIndex(inst => inst.rot === rot);
    if (idx > -1) {
      window.purelaneRotators[idx].destroy();
      window.purelaneRotators.splice(idx, 1);
    }
  }
});
