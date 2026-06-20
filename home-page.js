(async function () {
  const content = await window.ContentStore.load();
  const home = content.home || {};
  const set = (selector, value) => { const el = document.querySelector(selector); if (el && value != null) el.textContent = value; };
  const lines = (selector, value, outlineIndex = -1) => {
    const el = document.querySelector(selector); if (!el || !value) return;
    el.replaceChildren();
    String(value).split('\n').forEach((line, index, array) => {
      const span = document.createElement('span'); span.textContent = line;
      if (index === outlineIndex) span.className = 'outline';
      el.append(span); if (index < array.length - 1) el.append(document.createElement('br'));
    });
  };
  set('[data-home-kicker]', home.heroKicker);
  lines('[data-home-title]', home.heroTitle, 1);
  set('[data-home-copy]', home.heroCopy);
  document.querySelectorAll('[data-home-ticker]').forEach((el) => { el.textContent = home.ticker || ''; });
  lines('[data-home-intro-title]', home.introTitle);
  set('[data-home-intro-copy]', home.introCopy);

  const featured = (content.games || []).find((game) => game.id === home.featuredGameId) || content.games?.[0];
  const feature = document.querySelector('[data-feature-game]');
  if (feature && featured) {
    feature.href = `game-detail.html?id=${encodeURIComponent(featured.id)}`;
    feature.style.backgroundImage = `linear-gradient(0deg, rgba(4,8,10,.95), transparent 62%), url("${window.ContentStore.safeImage(featured.image).replace(/"/g,'%22')}")`;
    set('[data-feature-title]', featured.title);
    set('[data-feature-summary]', featured.summary);
    const meta = document.querySelector('[data-feature-meta]');
    if (meta) {
      meta.replaceChildren();
      [featured.status, featured.genre, featured.platform].filter(Boolean).forEach((value) => { const pill = document.createElement('span'); pill.className = 'pill'; pill.textContent = value; meta.appendChild(pill); });
    }
  }

  const newsGrid = document.querySelector('[data-home-news]');
  if (newsGrid) {
    newsGrid.replaceChildren();
    (content.news || []).slice(0, 3).forEach((item) => {
      const card = document.createElement('a'); card.className = 'news-card reveal visible'; card.href = `news-detail.html?id=${encodeURIComponent(item.id)}`;
      const time = document.createElement('time'); time.dateTime = item.date; time.textContent = item.date.replaceAll('-', '. ');
      const title = document.createElement('h3'); title.textContent = item.title;
      const meta = document.createElement('p'); meta.textContent = `${item.category || 'NEWS'} · READ STORY`;
      card.append(time, title, meta); newsGrid.appendChild(card);
    });
  }
})();
