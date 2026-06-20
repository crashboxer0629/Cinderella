(async function () {
  const container = document.querySelector('[data-game-list]');
  if (!container || !window.CinderellaGames) return;

  const content = await window.ContentStore.load();
  const page = content.gamesPage || {};
  const titleEl = document.querySelector('[data-games-title]');
  if (titleEl && page.pageTitle) { titleEl.replaceChildren(); String(page.pageTitle).split('\n').forEach((line,index,array)=>{titleEl.append(document.createTextNode(line));if(index<array.length-1)titleEl.append(document.createElement('br'));}); }
  const deckEl = document.querySelector('[data-games-deck]'); if (deckEl) deckEl.textContent = page.deck || '';
  const games = content.games || [];
  if (!games.length) {
    container.innerHTML = '<p class="empty-state">등록된 게임이 없습니다. 관리자 페이지에서 첫 게임을 추가해 주세요.</p>';
    return;
  }

  games.forEach((game, index) => {
    const card = document.createElement('a');
    card.className = 'game-card reveal visible';
    card.href = `game-detail.html?id=${encodeURIComponent(game.id)}`;
    card.setAttribute('aria-label', `${game.title} 상세 페이지 보기`);

    const bg = document.createElement('div');
    bg.className = 'game-bg';
    bg.style.backgroundImage = `url("${window.CinderellaGames.safeImage(game.image).replace(/"/g, '%22')}")`;
    if (index === 1) bg.style.filter = 'hue-rotate(48deg) saturate(.6)';
    if (index === 2) bg.style.filter = 'grayscale(1) contrast(1.2)';

    const content = document.createElement('div');
    content.className = 'game-card-content';

    const heading = document.createElement('div');
    const meta = document.createElement('div');
    meta.className = 'game-meta';
    [game.status, game.genre].filter(Boolean).forEach((item) => {
      const pill = document.createElement('span');
      pill.className = 'pill';
      pill.textContent = item;
      meta.appendChild(pill);
    });
    const title = document.createElement('h2');
    title.textContent = game.title;
    heading.append(meta, title);

    const copy = document.createElement('div');
    const summary = document.createElement('p');
    summary.textContent = game.summary;
    const link = document.createElement('span');
    link.className = 'text-link';
    link.innerHTML = `${game.platform || 'Platform TBA'} · ${game.release || 'TBA'} <span>↗</span>`;
    copy.append(summary, link);

    content.append(heading, copy);
    card.append(bg, content);
    container.appendChild(card);
  });
})();
