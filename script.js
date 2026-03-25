/* ===========================
   HERO SHADER (Three.js)
=========================== */
function initHeroShader() {
  const canvas = document.getElementById('shaderCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);

  const camera = new THREE.Camera();
  camera.position.z = 1;
  const scene = new THREE.Scene();
  const geometry = new THREE.PlaneGeometry(2, 2);

  const uniforms = {
    time:       { value: 1.0 },
    resolution: { value: new THREE.Vector2() },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `void main() { gl_Position = vec4(position, 1.0); }`,
    fragmentShader: `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time * 0.05;
        float lineWidth = 0.002;
        vec3 color = vec3(0.0);
        for(int j = 0; j < 3; j++){
          for(int i = 0; i < 5; i++){
            color[j] += lineWidth * float(i * i) / abs(
              fract(t - 0.01 * float(j) + float(i) * 0.01) * 5.0
              - length(uv)
              + mod(uv.x + uv.y, 0.2)
            );
          }
        }
        gl_FragColor = vec4(color[0], color[1], color[2], 1.0);
      }
    `,
  });

  scene.add(new THREE.Mesh(geometry, material));

  const resize = () => {
    const w = canvas.parentElement.clientWidth;
    const h = canvas.parentElement.clientHeight;
    renderer.setSize(w, h);
    uniforms.resolution.value.set(renderer.domElement.width, renderer.domElement.height);
  };
  resize();
  window.addEventListener('resize', resize);

  let animId;
  (function animate() {
    animId = requestAnimationFrame(animate);
    uniforms.time.value += 0.05;
    renderer.render(scene, camera);
  })();
}

window.addEventListener('DOMContentLoaded', initHeroShader);

/* ===========================
   TYPEWRITER — HERO H1
=========================== */
(function initTypewriter() {
  const line1El  = document.getElementById('tw-line1');
  const line2El  = document.getElementById('tw-line2');
  const cursorEl = document.querySelector('.tw-cursor');
  if (!line1El || !line2El) return;

  const TEXT1 = 'Modern weboldalak és webshopok \u2014';
  const TEXT2 = 'gyorsabban, AI-alapon.';
  const SPEED = 42;   // ms/karakter
  const PAUSE = 320;  // szünet a két sor között

  function type(el, text, speed, onDone) {
    let i = 0;
    (function tick() {
      if (i < text.length) {
        el.textContent += text[i++];
        setTimeout(tick, speed);
      } else if (onDone) {
        setTimeout(onDone, PAUSE);
      }
    })();
  }

  // Kis késleltetés hogy a hero fadeIn animáció lefusson
  setTimeout(() => {
    type(line1El, TEXT1, SPEED, () => {
      type(line2El, TEXT2, SPEED, null);
    });
  }, 600);
})();

/* ===========================
   PARTICLE BACKGROUND
=========================== */
const particleCanvas = document.getElementById('particleCanvas');
const ctx = particleCanvas.getContext('2d');
let particles = [];
const COUNT = 90;

function resizeCanvas() {
  particleCanvas.width  = window.innerWidth;
  particleCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(true); }
  reset(init) {
    this.x  = Math.random() * particleCanvas.width;
    this.y  = init ? Math.random() * particleCanvas.height : (Math.random() < 0.5 ? -4 : particleCanvas.height + 4);
    this.r  = Math.random() * 1.4 + 0.4;
    this.vx = (Math.random() - 0.5) * 0.35;
    this.vy = (Math.random() - 0.5) * 0.35;
    this.a  = Math.random() * 0.45 + 0.1;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < -10 || this.x > particleCanvas.width  + 10 ||
        this.y < -10 || this.y > particleCanvas.height + 10) {
      this.reset(false);
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${this.a})`;
    ctx.fill();
  }
}

for (let i = 0; i < COUNT; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,255,255,${0.055 * (1 - dist / 130)})`;
        ctx.lineWidth   = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ===========================
   DARK / LIGHT MODE
=========================== */
const themeToggle = document.getElementById('themeToggle');

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  document.body.classList.toggle('light');
});

/* ===========================
   NAVBAR SCROLL
=========================== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

/* ===========================
   HAMBURGER MENU
=========================== */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* ===========================
   CAROUSEL
=========================== */
const carouselCards = Array.from(document.querySelectorAll('.carousel-card'));
const carouselDots  = Array.from(document.querySelectorAll('.carousel-dots .dot'));
let current = 0;
const n = carouselCards.length;

function updateCarousel(idx) {
  current = ((idx % n) + n) % n;

  carouselCards.forEach((card, i) => {
    card.classList.remove('active', 'prev', 'next', 'hidden-card');
    const diff = ((i - current) + n) % n;
    if      (diff === 0)     card.classList.add('active');
    else if (diff === 1)     card.classList.add('next');
    else if (diff === n - 1) card.classList.add('prev');
    else                     card.classList.add('hidden-card');
  });

  carouselDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === current);
  });
}

updateCarousel(0);

// Navigáció + auto-advance reset
let autoAdvance = setInterval(() => updateCarousel(current + 1), 5000);

function goTo(idx) {
  updateCarousel(idx);
  clearInterval(autoAdvance);
  autoAdvance = setInterval(() => updateCarousel(current + 1), 5000);
}

document.getElementById('carouselPrev').addEventListener('click', () => goTo(current - 1));
document.getElementById('carouselNext').addEventListener('click', () => goTo(current + 1));
carouselDots.forEach(dot => {
  dot.addEventListener('click', () => goTo(parseInt(dot.dataset.index)));
});

// Oldalkártyára kattintás → az válik aktívvá
carouselCards.forEach(card => {
  card.addEventListener('click', () => {
    if (!card.classList.contains('active')) goTo(parseInt(card.dataset.index));
  });
});

// Egér drag navigáció
const track = document.getElementById('carouselTrack');
let dragStartX = 0, isDragging = false;
track.addEventListener('mousedown', e => { isDragging = true; dragStartX = e.clientX; track.style.cursor = 'grabbing'; });
track.addEventListener('mousemove', e => { if (!isDragging) return; });
track.addEventListener('mouseup',   e => {
  if (!isDragging) return;
  isDragging = false;
  track.style.cursor = '';
  const diff = e.clientX - dragStartX;
  if (Math.abs(diff) > 50) goTo(diff < 0 ? current + 1 : current - 1);
});
track.addEventListener('mouseleave', () => { isDragging = false; track.style.cursor = ''; });

// Touch/swipe navigáció
let touchStartX = 0;
track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend',   e => {
  const diff = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(diff) > 50) goTo(diff < 0 ? current + 1 : current - 1);
});

// Scroll navigáció
track.addEventListener('wheel', e => {
  e.preventDefault();
  goTo(e.deltaY > 0 ? current + 1 : current - 1);
}, { passive: false });

/* ===========================
   SCROLL REVEAL
=========================== */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);
revealEls.forEach(el => revealObserver.observe(el));

/* ===========================
   VIDEO LIGHTBOX
=========================== */
const lightbox       = document.getElementById('videoLightbox');
const lightboxVideo  = document.getElementById('lightboxVideo');
const lightboxTitle  = document.getElementById('lightboxTitle');
const lightboxClose  = document.getElementById('lightboxClose');
const lightboxBg     = document.getElementById('lightboxBackdrop');

function openLightbox(src, title) {
  lightboxVideo.src = src;
  lightboxTitle.textContent = title;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  lightboxVideo.play().catch(() => {});
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  lightboxVideo.pause();
  lightboxVideo.src = '';
}

document.querySelectorAll('.carousel-card').forEach(card => {
  const thumb = card.querySelector('.card-thumb-video');

  // Hover: silent preview
  card.addEventListener('mouseenter', () => {
    if (thumb) thumb.play().catch(() => {});
  });
  card.addEventListener('mouseleave', () => {
    if (thumb) { thumb.pause(); thumb.currentTime = 0; }
  });

  // Click: open lightbox
  card.addEventListener('click', (e) => {
    if (e.target.closest('.btn-outline-pill')) return;
    const src = card.dataset.video;
    if (!src) return;
    openLightbox(src, card.dataset.title || '');
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxBg.addEventListener('click', closeLightbox);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

/* ===========================
   CONTACT FORM — Formspree
   → Form ID: xlgordzk (már be van állítva, ne változtasd meg)
   → formspree.io → Forms → xlgordzk
=========================== */
const FORMSPREE_URL = 'https://formspree.io/f/xlgordzk';

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const btn      = document.getElementById('contactSubmitBtn');
  const feedback = document.getElementById('formFeedback');

  function showFeedback(type, msg) {
    feedback.textContent    = msg;
    feedback.style.display  = 'block';
    if (type === 'success') {
      feedback.style.background = 'rgba(34,197,94,0.12)';
      feedback.style.border     = '1px solid rgba(34,197,94,0.35)';
      feedback.style.color      = '#86efac';
    } else {
      feedback.style.background = 'rgba(239,68,68,0.12)';
      feedback.style.border     = '1px solid rgba(239,68,68,0.35)';
      feedback.style.color      = '#fca5a5';
    }
  }

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // --- Validáció ---
    const name  = contactForm.querySelector('[name="from_name"]').value.trim();
    const email = contactForm.querySelector('[name="from_email"]').value.trim();
    if (!name || !email) {
      showFeedback('error', 'Kérjük töltsd ki a kötelező mezőket (Név, Email).');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFeedback('error', 'Kérjük adj meg egy érvényes email címet.');
      return;
    }

    // --- Küldés ---
    btn.textContent        = 'Küldés...';
    btn.disabled           = true;
    feedback.style.display = 'none';

    try {
      const res = await fetch(FORMSPREE_URL, {
        method:  'POST',
        headers: { 'Accept': 'application/json' },
        body:    new FormData(contactForm),
      });

      if (res.ok) {
        showFeedback('success', '✓ Üzeneted megérkezett! Hamarosan felvesszük veled a kapcsolatot.');
        contactForm.reset();
      } else {
        const data = await res.json();
        showFeedback('error', 'Hiba történt a küldés során. Kérjük próbáld újra, vagy írj közvetlenül a kryzenstu@gmail.com címre.');
      }
    } catch (err) {
      showFeedback('error', 'Hálózati hiba. Kérjük ellenőrizd az internetkapcsolatodat, majd próbáld újra.');
    } finally {
      btn.textContent = 'Üzenet küldése →';
      btn.disabled    = false;
    }
  });
}

/* ===========================
   3D TILT + SPOTLIGHT
=========================== */
function init3DCards() {
  // Carousel cards are excluded — their positional transform (translateX -50%)
  // must not be overwritten by an inline style.transform. They use CSS-only hover.
  const cards = document.querySelectorAll('.service-card, .why-card, .about-visual');

  function applyTilt(card, e) {
    const rect  = card.getBoundingClientRect();
    const x     = e.clientX - rect.left;
    const y     = e.clientY - rect.top;
    const cx    = rect.width  / 2;
    const cy    = rect.height / 2;

    const rotY   =  ((x - cx) / cx) * 14;
    const rotX   = -((y - cy) / cy) * 9.8;

    const pct_x = ((x / rect.width)  * 100).toFixed(1) + '%';
    const pct_y = ((y / rect.height) * 100).toFixed(1) + '%';

    card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.03,1.03,1.03)`;
    card.style.setProperty('--mx', pct_x);
    card.style.setProperty('--my', pct_y);
  }

  function resetTilt(card) {
    card.style.transform = '';
    card.style.removeProperty('--mx');
    card.style.removeProperty('--my');
  }

  cards.forEach(card => {
    card.addEventListener('mousemove', e => applyTilt(card, e));
    card.addEventListener('mouseleave', () => resetTilt(card));
  });

  // Carousel active card: only update spotlight CSS vars, never touch style.transform
  document.querySelectorAll('.carousel-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      if (!card.classList.contains('active')) return;
      const rect  = card.getBoundingClientRect();
      const x     = e.clientX - rect.left;
      const y     = e.clientY - rect.top;
      card.style.setProperty('--mx', ((x / rect.width)  * 100).toFixed(1) + '%');
      card.style.setProperty('--my', ((y / rect.height) * 100).toFixed(1) + '%');
    });
    card.addEventListener('mouseleave', () => {
      card.style.removeProperty('--mx');
      card.style.removeProperty('--my');
    });
  });
}

init3DCards();

/* ===========================
   ORBIT CONNECTION LINES
=========================== */
function initOrbitLines() {
  const system = document.getElementById('orbitSystem');
  const svg    = document.getElementById('orbitLines');
  if (!system || !svg) return;

  // Esemény a node-inner-en (pointer-events: auto) — nem az animált orbit-node-on
  const inners = system.querySelectorAll('.node-inner');

  inners.forEach(inner => {
    const node = inner.closest('.orbit-node');

    inner.addEventListener('mouseenter', () => {
      const sysRect   = system.getBoundingClientRect();
      const innerRect = inner.getBoundingClientRect();
      const cx = sysRect.width  / 2;
      const cy = sysRect.height / 2;
      const nx = innerRect.left - sysRect.left + innerRect.width  / 2;
      const ny = innerRect.top  - sysRect.top  + innerRect.height / 2;

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', cx);
      line.setAttribute('y1', cy);
      line.setAttribute('x2', nx);
      line.setAttribute('y2', ny);
      line.classList.add('orbit-line');
      svg.appendChild(line);
      node._orbitLine = line;
    });

    inner.addEventListener('mouseleave', () => {
      if (node._orbitLine) {
        svg.removeChild(node._orbitLine);
        node._orbitLine = null;
      }
    });
  });
}

initOrbitLines();

/* ===========================
   SMOOTH ANCHOR SCROLL
=========================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ===========================
   EMAIL OBFUSCATION
=========================== */
document.querySelectorAll('[data-email]').forEach(el => {
  const addr = el.dataset.email + '@' + el.dataset.domain;
  el.textContent = addr;
  const link = el.closest('a');
  if (link) link.href = 'mailto:' + addr;
});
