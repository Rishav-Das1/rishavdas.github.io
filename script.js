/* =====================================================================
   CONFIGURATION
   ===================================================================== */
const CONFIG = {
  // Roles that cycle in the hero typing animation
  typedRoles: [
    'Physicist & Researcher',
    'Computational Astrophysicist',
    'ML Enthusiast',
    'MSc Student at NISER',
  ],

  // Your timezone (IST — correct for Bhubaneswar)
  timezone: 'Asia/Kolkata',

  // Working hours (24-hour). Outside these the status dot turns grey.
  workStart: 9,
  workEnd:   19,

  // Set true to force "Currently offline" regardless of time
  forceBusy: false,
};

/* =====================================================================
   TYPED ANIMATION
   ===================================================================== */
(function initTyped() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const roles = CONFIG.typedRoles;
  let roleIndex  = 0;
  let charIndex  = 0;
  let isDeleting = false;
  let isPausing  = false;

  function tick() {
    const current = roles[roleIndex];

    if (isPausing) {
      isPausing = false;
      setTimeout(tick, isDeleting ? 400 : 1600);
      return;
    }

    if (isDeleting) {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex  = (roleIndex + 1) % roles.length;
        isPausing  = true;
      }
      setTimeout(tick, 55);
    } else {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        isDeleting = true;
        isPausing  = true;
      }
      setTimeout(tick, 100);
    }
  }

  setTimeout(tick, 700); // wait for hero fade-in
})();

/* =====================================================================
   LIVE CLOCK + AVAILABILITY STATUS
   ===================================================================== */
(function initClock() {
  const timeEl  = document.getElementById('statusTime');
  const labelEl = document.getElementById('statusLabel');
  const dotEl   = document.getElementById('statusDot');
  if (!timeEl) return;

  function update() {
    const now = new Date();

    timeEl.textContent = now.toLocaleTimeString('en-US', {
      timeZone: CONFIG.timezone,
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false,
    });

    const hour = parseInt(
      now.toLocaleString('en-US', { timeZone: CONFIG.timezone, hour: 'numeric', hour12: false }),
      10
    );
    const isWorking = hour >= CONFIG.workStart && hour < CONFIG.workEnd;

    if (CONFIG.forceBusy || !isWorking) {
      dotEl.className    = 'status-dot is-busy';
      labelEl.textContent = 'Currently offline';
    } else {
      dotEl.className    = 'status-dot';
      labelEl.textContent = 'Available for work';
    }
  }

  update();
  setInterval(update, 1000);
})();

/* =====================================================================
   SCROLL PROGRESS BAR
   ===================================================================== */
(function initProgressBar() {
  const bar = document.getElementById('progressBar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.body.scrollHeight - window.innerHeight;
    bar.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0%';
  }, { passive: true });
})();

/* =====================================================================
   SCROLLSPY
   ===================================================================== */
(function initScrollspy() {
  const links    = document.querySelectorAll('.nav-link[data-section]');
  const sections = document.querySelectorAll('section[id]');
  if (!sections.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
      if (active) active.classList.add('active');
    });
  }, { threshold: 0.35 });

  sections.forEach(s => obs.observe(s));
})();

/* =====================================================================
   SECTION REVEAL
   ===================================================================== */
(function initReveal() {
  const sections = document.querySelectorAll('.content-section');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  sections.forEach(s => obs.observe(s));
})();

/* =====================================================================
   SKILL BAR ANIMATION
   ===================================================================== */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill[data-width]');
  if (!fills.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.style.width = entry.target.dataset.width + '%';
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  fills.forEach(f => obs.observe(f));
})();

/* =====================================================================
   STAT COUNTER ANIMATION
   ===================================================================== */
(function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const dur    = 1800;
      const step   = 16;
      const inc    = Math.ceil(target / (dur / step));
      let count = 0;

      const timer = setInterval(() => {
        count = Math.min(count + inc, target);
        el.textContent = count;
        if (count === target) clearInterval(timer);
      }, step);

      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => obs.observe(c));
})();

/* =====================================================================
   BACK TO TOP
   ===================================================================== */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('is-visible', window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* =====================================================================
   THEME TOGGLE
   ===================================================================== */
(function initTheme() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
})();

/* =====================================================================
   MOBILE MENU
   ===================================================================== */
(function initMobileMenu() {
  const menuBtn  = document.getElementById('menuBtn');
  const sidebar  = document.getElementById('sidebar');
  const backdrop = document.getElementById('backdrop');
  if (!menuBtn || !sidebar) return;

  const open  = () => { document.body.classList.add('menu-open');    menuBtn.setAttribute('aria-expanded', 'true');  menuBtn.setAttribute('aria-label', 'Close menu'); };
  const close = () => { document.body.classList.remove('menu-open'); menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.setAttribute('aria-label', 'Open menu');  };

  menuBtn.addEventListener('click', () => document.body.classList.contains('menu-open') ? close() : open());
  backdrop.addEventListener('click', close);
  sidebar.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => { if (window.innerWidth < 1024) close(); }));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && document.body.classList.contains('menu-open')) close(); });
})();

/* =====================================================================
   CONTACT FORM  (powered by Formspree — free, no server needed)
   HOW TO ACTIVATE:
     1. Go to https://formspree.io and sign up (free)
     2. Create a new form → copy your endpoint, e.g.:
        https://formspree.io/f/xabcdefg
     3. Paste it into FORMSPREE_ENDPOINT below
   ===================================================================== */
(function initContactForm() {
  const FORMSPREE_ENDPOINT = ''; // ← paste your Formspree URL here

  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  const btn  = form ? form.querySelector('[type="submit"]') : null;
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    if (!FORMSPREE_ENDPOINT) {
      note.textContent = 'Form not configured yet — add your Formspree endpoint in script.js!';
      note.style.color = 'var(--accent-warm)';
      return;
    }

    btn.textContent = 'Sending…';
    btn.disabled    = true;
    note.textContent = '';

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method:  'POST',
        headers: { 'Accept': 'application/json' },
        body:    new FormData(form),
      });
      if (res.ok) {
        note.textContent = 'Message sent — I\'ll get back to you soon!';
        note.style.color = 'var(--success)';
        form.reset();
      } else {
        throw new Error('Server error');
      }
    } catch {
      note.textContent = 'Something went wrong. Try emailing me directly.';
      note.style.color = 'var(--accent-warm)';
    } finally {
      btn.textContent = 'Send Message';
      btn.disabled    = false;
    }
  });
})();

/* =====================================================================
   FOOTER YEAR
   ===================================================================== */
(function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();
