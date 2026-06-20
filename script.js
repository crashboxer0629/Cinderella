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
