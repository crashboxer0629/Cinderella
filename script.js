const body = document.body;
const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');

const setHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
setHeader();
window.addEventListener('scroll', setHeader, { passive: true });

menuToggle?.addEventListener('click', () => {
  const open = body.classList.toggle('menu-open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
});

document.querySelectorAll('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    body.classList.remove('menu-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = new Date().getFullYear();
});

const socialData = [
  ['YouTube', 'https://www.youtube.com/', '<path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z"/>'],
  ['Instagram', 'https://www.instagram.com/', '<path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm10.5 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/>'],
  ['Discord', 'https://discord.com/', '<path d="M20.3 4.4A16 16 0 0 0 16.4 3l-.5 1a14 14 0 0 0-7.8 0l-.5-1a16 16 0 0 0-3.9 1.4C1.2 8.2.5 12 .8 15.8a16 16 0 0 0 4.8 2.4l1.2-1.7-1.7-.8.4-.3c3.2 1.5 6.6 1.8 10.9 0l.5.3-1.8.8 1.2 1.7a16 16 0 0 0 4.8-2.4c.4-4.4-.8-8.2-2.8-11.4ZM8.2 14.1c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm7.6 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z"/>'],
  ['X (Twitter)', 'https://x.com/', '<path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 15.6 6.4 22H3.2l7.3-8.4L.8 2h6.5l4.4 5.8L16.8 2h2.1Zm-1.1 17.8h1.7L6.4 4.1H4.6l13.2 15.7Z"/>']
];

document.querySelectorAll('.socials:empty').forEach((container) => {
  container.innerHTML = socialData.map(([label, href, icon]) =>
    `<a class="social-link" href="${href}" target="_blank" rel="noopener" aria-label="${label}"><svg viewBox="0 0 24 24">${icon}</svg></a>`
  ).join('');
});

document.querySelectorAll('.footer-bottom').forEach((footer) => {
  if (footer.querySelector('.admin-footer-link')) return;
  const link = document.createElement('a');
  link.className = 'admin-footer-link';
  link.href = 'admin.html';
  link.textContent = 'Admin';
  footer.appendChild(link);
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const progress = document.createElement('div');
progress.className = 'scroll-progress';
progress.setAttribute('aria-hidden', 'true');
body.appendChild(progress);

const setScrollProgress = () => {
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  document.documentElement.style.setProperty('--scroll-progress', `${Math.min(100, (window.scrollY / max) * 100)}%`);
};
setScrollProgress();
window.addEventListener('scroll', setScrollProgress, { passive: true });
window.addEventListener('resize', setScrollProgress, { passive: true });

document.querySelectorAll('.main-nav a').forEach((link) => {
  const current = location.pathname.replace(/\/index\.html$/, '/');
  const target = new URL(link.getAttribute('href'), location.href).pathname.replace(/\/index\.html$/, '/');
  const currentSection = current.split('/').filter(Boolean)[0] || 'home';
  const targetSection = target.split('/').filter(Boolean)[0] || 'home';
  link.classList.toggle('active', currentSection === targetSection);
});

const interactiveSelector = [
  '.team-card',
  '.game-facts > div'
].join(',');

const magneticSelector = [
  '.brand',
  '.main-nav a',
  '.round-link',
  '.text-link',
  '.social-link',
  '.buy-button',
  '.news-row .arrow',
  '.admin-footer-link'
].join(',');

const setPointerVars = (element, event) => {
  const rect = element.getBoundingClientRect();
  element.style.setProperty('--mx', `${event.clientX - rect.left}px`);
  element.style.setProperty('--my', `${event.clientY - rect.top}px`);
};

const enhanceSurface = (element) => {
  if (!(element instanceof Element) || element.dataset.surfaceReady) return;
  element.dataset.surfaceReady = 'true';
  element.classList.add('interactive-surface');
  if (!finePointer || reduceMotion) return;
  element.addEventListener('pointermove', (event) => setPointerVars(element, event), { passive: true });
  element.addEventListener('pointerleave', () => {
    element.style.removeProperty('--mx');
    element.style.removeProperty('--my');
  });
};

const enhanceMagnetic = (element) => {
  if (!(element instanceof Element) || element.dataset.magneticReady) return;
  element.dataset.magneticReady = 'true';
  element.classList.add('magnetic-target');
  if (!finePointer || reduceMotion) return;
  element.addEventListener('pointermove', (event) => {
    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - .5) * 12;
    const y = ((event.clientY - rect.top) / rect.height - .5) * 12;
    element.style.setProperty('--mag-x', `${x}px`);
    element.style.setProperty('--mag-y', `${y}px`);
  }, { passive: true });
  element.addEventListener('pointerleave', () => {
    element.style.removeProperty('--mag-x');
    element.style.removeProperty('--mag-y');
  });
};

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const element = entry.target;
    if (!entry.isIntersecting) {
      element.dataset.countVisible = 'false';
      if (element.dataset.countFrame) {
        cancelAnimationFrame(Number(element.dataset.countFrame));
        delete element.dataset.countFrame;
      }
      return;
    }
    if (element.dataset.countVisible === 'true') return;
    const target = Number(element.dataset.countTarget || element.textContent.trim());
    const width = Number(element.dataset.countWidth || String(target).length);
    if (!Number.isFinite(target)) return;
    element.dataset.countVisible = 'true';
    const duration = reduceMotion ? 1 : 850;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = String(Math.round(target * eased)).padStart(width, '0');
      if (progress < 1 && element.dataset.countVisible === 'true') {
        element.dataset.countFrame = String(requestAnimationFrame(tick));
      } else {
        element.textContent = String(target).padStart(width, '0');
        delete element.dataset.countFrame;
      }
    };
    element.textContent = '0'.padStart(width, '0');
    element.dataset.countFrame = String(requestAnimationFrame(tick));
  });
}, { threshold: 0.55 });

const enhanceCounter = (element) => {
  if (!(element instanceof Element) || element.dataset.counterReady) return;
  const text = element.textContent.trim();
  if (!/^\d+$/.test(text)) return;
  element.dataset.counterReady = 'true';
  element.dataset.countTarget = String(Number(text));
  element.dataset.countWidth = String(text.length);
  countObserver.observe(element);
};

const kineticWordObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const element = entry.target;
    if (!entry.isIntersecting) {
      if (element.dataset.wordTimer) {
        clearInterval(Number(element.dataset.wordTimer));
        delete element.dataset.wordTimer;
      }
      return;
    }
    if (element.dataset.wordTimer) return;
    const words = (element.dataset.rotatingWords || element.textContent)
      .split(',')
      .map((word) => word.trim().replace(/\.$/, ''))
      .filter(Boolean);
    if (words.length < 2) return;
    const switchWord = () => {
      const index = (Number(element.dataset.wordIndex || 0) + 1) % words.length;
      element.dataset.wordIndex = String(index);
      element.classList.add('is-switching');
      window.setTimeout(() => {
        element.textContent = `${words[index]}.`;
      }, reduceMotion ? 0 : 130);
      window.setTimeout(() => {
        element.classList.remove('is-switching');
      }, reduceMotion ? 0 : 360);
    };
    element.dataset.wordTimer = String(window.setInterval(switchWord, reduceMotion ? 3600 : 1650));
  });
}, { threshold: 0.55 });

const enhanceKineticWord = (element) => {
  if (!(element instanceof Element) || element.dataset.kineticReady) return;
  element.dataset.kineticReady = 'true';
  const words = (element.dataset.rotatingWords || element.textContent)
    .split(',')
    .map((word) => word.trim().replace(/\.$/, ''))
    .filter(Boolean);
  element.dataset.wordIndex = String(Math.max(0, words.indexOf(element.textContent.trim().replace(/\.$/, ''))));
  kineticWordObserver.observe(element);
};

const infinityObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const element = entry.target;
    if (!entry.isIntersecting) {
      element.dataset.infinityVisible = 'false';
      element.textContent = '∞';
      if (element.dataset.infinityFrame) {
        cancelAnimationFrame(Number(element.dataset.infinityFrame));
        delete element.dataset.infinityFrame;
      }
      return;
    }
    if (element.dataset.infinityVisible === 'true') return;
    element.dataset.infinityVisible = 'true';
    const duration = reduceMotion ? 1 : 980;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const burst = Math.min(99, Math.floor((1 - Math.pow(1 - progress, 2.8)) * 100));
      element.textContent = String(burst).padStart(2, '0');
      if (progress < 1 && element.dataset.infinityVisible === 'true') {
        element.dataset.infinityFrame = String(requestAnimationFrame(tick));
      } else {
        element.textContent = '∞';
        element.classList.add('infinity-landed');
        window.setTimeout(() => element.classList.remove('infinity-landed'), reduceMotion ? 0 : 520);
        delete element.dataset.infinityFrame;
      }
    };
    element.classList.remove('infinity-landed');
    element.textContent = '00';
    element.dataset.infinityFrame = String(requestAnimationFrame(tick));
  });
}, { threshold: 0.55 });

const enhanceInfinityCounter = (element) => {
  if (!(element instanceof Element) || element.dataset.infinityReady) return;
  element.dataset.infinityReady = 'true';
  infinityObserver.observe(element);
};

const enhanceInteractions = (root = document) => {
  const roots = root instanceof Element ? [root] : [];
  roots.forEach((element) => {
    if (element.matches(interactiveSelector)) enhanceSurface(element);
    if (element.matches(magneticSelector)) enhanceMagnetic(element);
    if (element.matches('.stat strong')) enhanceCounter(element);
    if (element.matches('.kinetic-word')) enhanceKineticWord(element);
    if (element.matches('[data-infinity-stat]')) enhanceInfinityCounter(element);
  });
  root.querySelectorAll?.(interactiveSelector).forEach(enhanceSurface);
  root.querySelectorAll?.(magneticSelector).forEach(enhanceMagnetic);
  root.querySelectorAll?.('.stat strong').forEach(enhanceCounter);
  root.querySelectorAll?.('.kinetic-word').forEach(enhanceKineticWord);
  root.querySelectorAll?.('[data-infinity-stat]').forEach(enhanceInfinityCounter);
};

enhanceInteractions();

const interactionObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) enhanceInteractions(node);
    });
  });
});

interactionObserver.observe(body, { childList: true, subtree: true });
