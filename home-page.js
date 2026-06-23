(async function () {
  const content = await window.ContentStore.load();
  const home = content.home || {};
  const set = (selector, value) => { const el = document.querySelector(selector); if (el && value != null) el.textContent = value; };
  const configuredNumber = (...values) => {
    for (const value of values) {
      if (value === '' || value == null) continue;
      const number = Number(value);
      if (Number.isFinite(number)) return Math.max(0, Math.round(number));
    }
    return null;
  };
  const currentStatNumber = (key) => {
    const value = document.querySelector(`[data-home-stat="${key}"]`)?.textContent || '';
    const numericText = value.replace(/[^\d.-]/g, '');
    if (!numericText) return null;
    const number = Number(numericText);
    return Number.isFinite(number) ? number : null;
  };
  const formatStat = (value) => String(Math.max(0, Math.round(value))).padStart(2, '0');
  const setStat = (key, value, label) => {
    set(`[data-home-stat="${key}"]`, formatStat(value));
    set(`[data-home-stat-label="${key}"]`, label);
  };
  const inDevelopmentWorlds = (games) => games.filter((game) => {
    const status = `${game.status || ''} ${game.release || ''}`.toLowerCase();
    if (/(released|launched|complete|done|cancel|archive|experiment|출시|완료|취소|보관|실험)/.test(status)) return false;
    return /(development|prototype|alpha|beta|tba|wip|progress|개발|프로토타입|제작|진행)/.test(status);
  }).length;
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

  const statSettings = home.stats || {};
  const games = content.games || [];
  const creatorCount = configuredNumber(statSettings.creatorCount, statSettings.creators, home.creatorCount) ?? currentStatNumber('creators') ?? (content.team || []).length;
  const calculatedWorldCount = inDevelopmentWorlds(games) || games.length || currentStatNumber('worlds') || 0;
  const worldCount = configuredNumber(statSettings.worldCount, statSettings.worlds, home.worldCount) ?? calculatedWorldCount;
  setStat('creators', creatorCount, statSettings.creatorLabel || home.creatorLabel || 'Creators in one room');
  setStat('worlds', worldCount, statSettings.worldLabel || home.worldLabel || 'Worlds in development');

  const featured = games.find((game) => game.id === home.featuredGameId) || games[0];
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
