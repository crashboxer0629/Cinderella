(async function () {
  if (!window.ContentStore) return;
  const content = await window.ContentStore.load();
  const global = content.global || {};
  document.querySelectorAll('.brand > span:last-child').forEach((el) => { el.textContent = global.studioName || 'CINDERELLA'; });
  const navMap = { 'about.html': global.navAbout, 'games.html': global.navGames, 'roadmap.html': global.navRoadmap, 'goods.html': global.navGoods, 'news.html': global.navNews };
  document.querySelectorAll('.main-nav a').forEach((link) => {
    const file = link.getAttribute('href');
    if (navMap[file]) link.textContent = navMap[file];
  });
  const socialMap = { YouTube: global.youtube, Instagram: global.instagram, Discord: global.discord, 'X (Twitter)': global.twitter };
  document.querySelectorAll('.social-link').forEach((link) => {
    const url = socialMap[link.getAttribute('aria-label')];
    const safe = window.ContentStore.safeLink(url); if (safe) link.href = safe;
  });
  const footerTitle = document.querySelector('.footer-title');
  if (footerTitle && global.footerTitle) {
    footerTitle.replaceChildren(document.createTextNode(global.footerTitle), document.createElement('br'));
    const accent = document.createElement('span'); accent.textContent = global.footerAccent || '';
    footerTitle.appendChild(accent);
  }
  const footerBottom = document.querySelector('.footer-bottom');
  if (footerBottom && global.footerNote) {
    const spans = footerBottom.querySelectorAll(':scope > span');
    if (spans[1]) spans[1].textContent = global.footerNote;
  }
  if (footerBottom && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(global.email || '') && !footerBottom.querySelector('.footer-email')) {
    const email = document.createElement('a'); email.className = 'footer-email'; email.href = `mailto:${global.email}`; email.textContent = global.email; footerBottom.appendChild(email);
  }
  window.dispatchEvent(new CustomEvent('cinderella:content', { detail: content }));
})();
