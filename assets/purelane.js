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

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  window.purelaneBackdrop = new PurelaneBackdrop();
  
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
});

document.addEventListener('shopify:section:unload', (e) => {
  if (window.purelaneBackdrop) {
    window.purelaneBackdrop.refresh();
  }
});
