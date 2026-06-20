(async function () {
  if (!window.CinderellaGames) return;
  const id = new URLSearchParams(location.search).get('id');
  const games = await window.CinderellaGames.getGames();
  const game = games.find((item) => item.id === id);
  const root = document.querySelector('[data-game-detail]');
  if (!root) return;

  if (!game) {
    document.title = 'Game not found — Cinderella';
    root.innerHTML = '<section class="detail-not-found"><span class="page-count">404 / GAME</span><h1>세계가<br>사라졌습니다.</h1><p>요청한 게임을 찾을 수 없습니다.</p><a class="text-link" href="games.html">Back to games <span>→</span></a></section>';
    return;
  }

  document.title = `${game.title} — Cinderella`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', game.summary || game.title);
  root.style.setProperty('--game-accent', game.accent || '#c7ff2f');

  const hero = document.createElement('section');
  hero.className = 'game-detail-hero';
  hero.style.backgroundImage = `linear-gradient(90deg, rgba(5,8,10,.82), rgba(5,8,10,.08)), linear-gradient(0deg, #080b0d, transparent 45%), url("${window.CinderellaGames.safeImage(game.image).replace(/"/g, '%22')}")`;

  const heroInner = document.createElement('div');
  heroInner.className = 'game-detail-hero-inner';
  const kicker = document.createElement('p');
  kicker.className = 'hero-kicker';
  kicker.textContent = `${game.status || 'Cinderella game'} · ${game.genre || 'Game'}`;
  const title = document.createElement('h1');
  title.textContent = game.title;
  const summary = document.createElement('p');
  summary.className = 'game-detail-summary';
  summary.textContent = game.summary;
  heroInner.append(kicker, title, summary);
  hero.appendChild(heroInner);

  const info = document.createElement('section');
  info.className = 'section game-detail-info';
  const infoInner = document.createElement('div');
  infoInner.className = 'section-inner';
  const facts = document.createElement('div');
  facts.className = 'game-facts';
  [['Platform', game.platform], ['Genre', game.genre], ['Release', game.release]].forEach(([label, value]) => {
    const item = document.createElement('div');
    const dt = document.createElement('span');
    dt.textContent = label;
    const dd = document.createElement('strong');
    dd.textContent = value || 'TBA';
    item.append(dt, dd);
    facts.appendChild(item);
  });
  const story = document.createElement('div');
  story.className = 'game-story';
  story.innerHTML = '<p class="section-label">About the game</p>';
  const body = document.createElement('p');
  body.textContent = game.description || game.summary;
  const back = document.createElement('a');
  back.className = 'text-link';
  back.href = 'games.html';
  back.innerHTML = 'All games <span>→</span>';
  story.append(body, back);
  infoInner.append(facts, story);
  info.appendChild(infoInner);
  root.append(hero, info);
})();
