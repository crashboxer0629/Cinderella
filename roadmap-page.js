(async function () {
  const timeline = document.querySelector('[data-roadmap-timeline]');
  const panel = document.querySelector('.roadmap-panel');
  if (!timeline || !panel) return;

  const defaultPage = {
    pageTitle: 'NEXT\nPATCHES.',
    deck: 'Cinderella가 지금 만들고 있고, 곧 공개하고 싶은 것들. 일정은 개발 상황에 따라 바뀔 수 있지만 방향은 여기에서 확인할 수 있습니다.',
    introTitle: '작은 팀의 다음\n발자국.',
    rotatingWords: '발자국,빌드,장면,약속',
    focusLabel: 'Current focus',
    focusTitle: 'Glass Midnight\nVertical Slice',
    focusDescription: '대표 게임의 핵심 루프, 분위기, 첫 플레이 감각을 하나의 빌드로 묶는 중입니다.',
    focusProgress: 42,
    focusGameId: 'glass-midnight',
    metricNext: 'Playtest build'
  };

  const defaultRoadmap = [
    { id: 'site-identity', period: '2026.06', state: 'done', status: 'DONE', title: '사이트와 스튜디오 아이덴티티 정리', description: '클린 URL, 파비콘, 인터랙션, 팀/게임 소개 구조를 정리해서 공개 가능한 형태로 다듬습니다.', order: 1 },
    { id: 'glass-midnight-slice', period: '2026 Q3', state: 'active', status: 'IN PROGRESS', title: 'Glass Midnight 핵심 빌드 제작', description: '전투/탐험/서사 흐름이 한 번에 느껴지는 버티컬 슬라이스를 만들고 내부 테스트를 반복합니다.', gameId: 'glass-midnight', order: 2 },
    { id: 'first-playtest', period: '2026 Q4', state: 'next', status: 'NEXT', title: '첫 외부 플레이테스트', description: '소규모 플레이어에게 테스트 빌드를 공유하고, 조작감·난이도·분위기 피드백을 모읍니다.', gameId: 'glass-midnight', order: 3 },
    { id: 'store-demo', period: '2027 Q1', state: 'planned', status: 'PLANNED', title: '스토어 페이지와 데모 준비', description: '스크린샷, 트레일러, 소개 문구를 정리하고 플레이 가능한 공개 데모 범위를 확정합니다.', order: 4 },
    { id: 'launch-build', period: '2027+', state: 'planned', status: 'TBA', title: '출시 빌드로 확장', description: '콘텐츠 볼륨, 사운드, 최적화, 현지화, QA를 거쳐 정식 출시를 향해 확장합니다.', order: 5 }
  ];

  let content = {};
  try {
    content = await window.ContentStore.load();
  } catch (_) {
    content = {};
  }

  const page = { ...defaultPage, ...(content.roadmapPage || {}) };
  const games = Array.isArray(content.games) ? content.games : [];
  const gameById = new Map(games.map((game) => [game.id, game]));
  const entries = (Array.isArray(content.roadmap) && content.roadmap.length ? content.roadmap : defaultRoadmap)
    .slice()
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const pad = (value) => String(value || 0).padStart(2, '0');
  const escapeRegExp = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const setLines = (element, value) => {
    if (!element || !value) return;
    element.replaceChildren();
    String(value).split('\n').forEach((line, index, array) => {
      element.append(document.createTextNode(line));
      if (index < array.length - 1) element.append(document.createElement('br'));
    });
  };

  const renderIntro = () => {
    const intro = document.querySelector('[data-roadmap-intro]');
    if (!intro) return;
    const words = String(page.rotatingWords || defaultPage.rotatingWords)
      .split(',')
      .map((word) => word.trim().replace(/\.$/, ''))
      .filter(Boolean);
    const firstWord = words[0] || '발자국';
    const lines = String(page.introTitle || defaultPage.introTitle).split('\n');
    const lastLine = lines.pop() || '';
    const ending = new RegExp(`${escapeRegExp(firstWord)}\\.?$`);
    const prefix = ending.test(lastLine) ? lastLine.replace(ending, '') : `${lastLine} `;

    intro.replaceChildren();
    lines.forEach((line) => {
      intro.append(document.createTextNode(line), document.createElement('br'));
    });
    intro.append(document.createTextNode(prefix));
    const kinetic = document.createElement('em');
    kinetic.className = 'kinetic-word';
    kinetic.dataset.rotatingWords = words.join(',');
    kinetic.textContent = `${firstWord}.`;
    intro.append(kinetic);
  };

  const renderPanel = () => {
    const focusGame = gameById.get(page.focusGameId);
    const progress = clamp(Number(page.focusProgress ?? defaultPage.focusProgress) || 0, 0, 100);
    const metrics = [
      ['TEAM', page.metricTeam || `${pad((content.team || []).length)} creators`],
      ['WORLDS', page.metricWorlds || `${pad(games.length)} in dev`],
      ['NEXT DROP', page.metricNext || 'TBA']
    ];

    const label = document.createElement('p');
    label.className = 'section-label';
    label.textContent = page.focusLabel || defaultPage.focusLabel;

    const title = document.createElement('h2');
    setLines(title, page.focusTitle || focusGame?.title || defaultPage.focusTitle);

    const description = document.createElement('p');
    description.textContent = page.focusDescription || focusGame?.summary || defaultPage.focusDescription;

    const meter = document.createElement('div');
    meter.className = 'roadmap-meter';
    meter.setAttribute('aria-label', '현재 로드맵 진행률');
    const meterBar = document.createElement('span');
    meterBar.style.width = `${progress}%`;
    meter.appendChild(meterBar);

    const dl = document.createElement('dl');
    metrics.forEach(([term, detail]) => {
      const row = document.createElement('div');
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');
      dt.textContent = term;
      dd.textContent = detail;
      row.append(dt, dd);
      dl.appendChild(row);
    });

    panel.replaceChildren(label, title, description, meter, dl);

    if (focusGame) {
      const link = document.createElement('a');
      link.className = 'roadmap-focus-link';
      link.href = `game-detail.html?id=${encodeURIComponent(focusGame.id)}`;
      link.append(document.createTextNode(`Open ${focusGame.title} `));
      const arrow = document.createElement('span');
      arrow.textContent = '↗';
      link.appendChild(arrow);
      panel.appendChild(link);
    }
  };

  const renderTimeline = () => {
    timeline.replaceChildren();
    const progress = document.createElement('span');
    progress.className = 'roadmap-progress';
    progress.setAttribute('aria-hidden', 'true');
    timeline.appendChild(progress);

    entries.forEach((entry) => {
      const game = gameById.get(entry.gameId);
      const item = document.createElement('article');
      item.className = 'roadmap-item';
      item.dataset.state = entry.state || 'planned';

      const dot = document.createElement('span');
      dot.className = 'roadmap-dot';
      dot.setAttribute('aria-hidden', 'true');

      const card = document.createElement(game ? 'a' : 'div');
      card.className = `roadmap-card${game ? ' roadmap-card-link' : ''}`;
      if (game) {
        card.href = `game-detail.html?id=${encodeURIComponent(game.id)}`;
        card.setAttribute('aria-label', `${entry.title} · ${game.title} 게임 상세 보기`);
      }

      const meta = document.createElement('div');
      meta.className = 'roadmap-meta';
      const period = document.createElement('span');
      const status = document.createElement('strong');
      period.textContent = entry.period || 'TBA';
      status.textContent = entry.status || (entry.state || 'planned').toUpperCase();
      meta.append(period, status);

      const title = document.createElement('h3');
      title.textContent = entry.title || 'Untitled roadmap item';

      const description = document.createElement('p');
      description.textContent = entry.description || '';

      card.append(meta, title, description);

      if (game) {
        const linked = document.createElement('div');
        linked.className = 'roadmap-linked-game';
        const label = document.createElement('span');
        const gameTitle = document.createElement('strong');
        const gameStatus = document.createElement('em');
        label.textContent = 'Linked game';
        gameTitle.textContent = game.title;
        gameStatus.textContent = `${game.status || 'Status TBA'} ↗`;
        linked.append(label, gameTitle, gameStatus);
        card.appendChild(linked);
      }

      item.append(dot, card);
      timeline.appendChild(item);
    });
  };

  const setupProgress = () => {
    const items = Array.from(timeline.querySelectorAll('.roadmap-item'));
    if (!items.length) return;

    const updateProgress = () => {
      const viewportLine = window.innerHeight * 0.62;
      let activeIndex = 0;

      items.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        if (rect.top < viewportLine) activeIndex = index;
      });

      const percent = items.length <= 1 ? 100 : (activeIndex / (items.length - 1)) * 100;
      timeline.style.setProperty('--roadmap-progress', `${Math.max(6, percent)}%`);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
      });
      updateProgress();
    }, { threshold: 0.35 });

    items.forEach((item) => observer.observe(item));
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
  };

  setLines(document.querySelector('[data-roadmap-title]'), page.pageTitle);
  const deck = document.querySelector('[data-roadmap-deck]');
  if (deck) deck.textContent = page.deck || defaultPage.deck;
  renderIntro();
  renderPanel();
  renderTimeline();
  setupProgress();
})();
