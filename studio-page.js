(async function () {
  const grid = document.querySelector('[data-studio-grid]');
  if (!grid || !window.ContentStore) return;

  const defaults = {
    studioPage: {
      pageTitle: 'OUR\nSTUDIOS.',
      deck: 'Cinderella 아래에서 각자 다른 감각과 장르를 실험하는 산하 스튜디오와 레이블을 소개합니다.',
      introTitle: '하나의 팀,\n여러 개의 실험실.',
      introCopy: '각 스튜디오는 독립된 톤과 제작 방식을 갖고 움직입니다. 공통의 기술과 제작 문화를 공유하지만, 플레이어에게 닿는 감각은 서로 다르게 설계합니다.'
    },
    studios: [
      { id: 'cinderella-core', name: 'Cinderella Core', tagline: 'Narrative games after midnight', status: 'Main studio', focus: 'Action narrative', location: 'Seoul', since: '2026', members: '05', description: 'Cinderella의 메인 개발팀입니다. 이야기, 액션, 분위기가 한 방향으로 움직이는 게임을 만듭니다.', image: 'assets/hero-palace.png', url: '', accent: '#c7ff2f', order: 1 },
      { id: 'second-sun-lab', name: 'Second Sun Lab', tagline: 'Co-op prototypes and light puzzles', status: 'Prototype label', focus: 'Co-op puzzle', location: 'Remote / Seoul', since: '2026', members: '02', description: '협동 플레이, 서로 다른 시야, 말로만 이어지는 퍼즐 구조를 실험하는 작은 레이블입니다.', image: 'assets/hero-palace.png', url: '', accent: '#8ad8f3', order: 2 }
    ]
  };

  let content = {};
  try {
    content = await window.ContentStore.load();
  } catch (_) {
    content = {};
  }

  const page = { ...defaults.studioPage, ...(content.studioPage || {}) };
  const studios = (Array.isArray(content.studios) && content.studios.length ? content.studios : defaults.studios)
    .slice()
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const setLines = (element, value) => {
    if (!element || !value) return;
    element.replaceChildren();
    String(value).split('\n').forEach((line, index, array) => {
      element.append(document.createTextNode(line));
      if (index < array.length - 1) element.append(document.createElement('br'));
    });
  };

  const renderIntroTitle = () => {
    const intro = document.querySelector('[data-studio-intro]');
    if (!intro) return;
    const lines = String(page.introTitle || defaults.studioPage.introTitle).split('\n');
    const last = lines.pop() || '';
    intro.replaceChildren();
    lines.forEach((line) => intro.append(document.createTextNode(line), document.createElement('br')));
    const match = last.match(/^(.*?)([^,\s.。]+)([.。]?)$/);
    if (!match) {
      intro.append(document.createTextNode(last));
      return;
    }
    intro.append(document.createTextNode(match[1]));
    const em = document.createElement('em');
    em.textContent = `${match[2]}${match[3] || '.'}`;
    intro.appendChild(em);
  };

  setLines(document.querySelector('[data-studio-title]'), page.pageTitle);
  const deck = document.querySelector('[data-studio-deck]');
  if (deck) deck.textContent = page.deck || defaults.studioPage.deck;
  renderIntroTitle();
  const copy = document.querySelector('[data-studio-copy]');
  if (copy) copy.textContent = page.introCopy || defaults.studioPage.introCopy;

  grid.replaceChildren();
  studios.forEach((studio, index) => {
    const url = window.ContentStore.safeLink(studio.url);
    const card = document.createElement(url ? 'a' : 'article');
    card.className = `studio-card reveal visible${index === 0 ? ' studio-card-featured' : ''}`;
    card.style.setProperty('--studio-accent', studio.accent || '#c7ff2f');
    if (url) {
      card.href = url;
      card.target = '_blank';
      card.rel = 'noopener';
      card.setAttribute('aria-label', `${studio.name} 사이트 열기`);
    }

    const visual = document.createElement('div');
    visual.className = 'studio-card-visual';
    visual.style.backgroundImage = `linear-gradient(120deg, rgba(8,11,13,.16), rgba(8,11,13,.62)), url("${window.ContentStore.safeImage(studio.image).replace(/"/g, '%22')}")`;
    const mark = document.createElement('span');
    mark.textContent = String(studio.name || 'S').trim().charAt(0).toUpperCase();
    visual.appendChild(mark);

    const body = document.createElement('div');
    body.className = 'studio-card-body';

    const meta = document.createElement('div');
    meta.className = 'studio-card-meta';
    [studio.status, studio.focus].filter(Boolean).forEach((item) => {
      const pill = document.createElement('span');
      pill.className = 'pill';
      pill.textContent = item;
      meta.appendChild(pill);
    });

    const title = document.createElement('h2');
    title.textContent = studio.name || 'Untitled Studio';
    const tagline = document.createElement('p');
    tagline.className = 'studio-tagline';
    tagline.textContent = studio.tagline || '';
    const description = document.createElement('p');
    description.className = 'studio-description';
    description.textContent = studio.description || '';

    const facts = document.createElement('dl');
    facts.className = 'studio-facts';
    [
      ['Since', studio.since],
      ['Location', studio.location],
      ['Members', studio.members]
    ].filter(([, value]) => value).forEach(([label, value]) => {
      const row = document.createElement('div');
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');
      dt.textContent = label;
      dd.textContent = value;
      row.append(dt, dd);
      facts.appendChild(row);
    });

    body.append(meta, title, tagline, description, facts);
    if (url) {
      const link = document.createElement('span');
      link.className = 'studio-open';
      link.textContent = 'Open studio ↗';
      body.appendChild(link);
    }
    card.append(visual, body);
    grid.appendChild(card);
  });
})();
