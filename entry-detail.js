(async function () {
  const root = document.querySelector('[data-entry-detail]'); if (!root) return;
  const type = root.dataset.entryDetail; const id = new URLSearchParams(location.search).get('id');
  const content = await window.ContentStore.load();
  const map = { news: 'news', goods: 'goods', team: 'team' }; const collection = content[map[type]] || [];
  const item = collection.find((entry) => entry.id === id);
  if (!item) { root.innerHTML = '<section class="detail-not-found"><span class="page-count">404 / ENTRY</span><h1>페이지를<br>찾지 못했습니다.</h1><p>요청한 콘텐츠가 없거나 이동되었습니다.</p><a class="text-link" href="index.html">Back home <span>→</span></a></section>'; return; }
  document.title = `${item.title || item.name} — Cinderella`;
  const image = window.ContentStore.safeImage(item.image);
  if (type === 'news') {
    root.innerHTML = `<article class="article-detail"><header class="article-hero"><div><p class="hero-kicker"></p><h1></h1><p class="article-excerpt"></p></div></header><div class="article-body"><p class="article-lead"></p><a class="text-link" href="news.html">All news <span>→</span></a></div></article>`;
    root.querySelector('.article-hero').style.backgroundImage=`linear-gradient(0deg,#080b0d,transparent 60%),url("${image.replace(/"/g,'%22')}")`;
    root.querySelector('.hero-kicker').textContent = `${item.date} · ${item.category}`; root.querySelector('h1').textContent = item.title; root.querySelector('.article-excerpt').textContent = item.excerpt; root.querySelector('.article-lead').textContent = item.body;
  } else if (type === 'goods') {
    root.innerHTML = `<section class="goods-detail section"><div class="section-inner goods-detail-grid"><div class="goods-detail-visual"><span class="product-orbit"></span><strong></strong></div><div class="goods-detail-copy"><p class="eyebrow">Cinderella Goods</p><h1></h1><p class="goods-spec"></p><p class="goods-description"></p><div class="goods-detail-actions"></div><a class="text-link" href="goods.html">All goods <span>→</span></a></div></div></section>`;
    root.querySelector('.goods-detail-visual strong').textContent = item.visualText; root.querySelector('h1').textContent = item.title; root.querySelector('.goods-spec').textContent = `${item.spec} · ${item.price}`; root.querySelector('.goods-description').textContent = item.description;
    const actions = root.querySelector('.goods-detail-actions'); const buyUrl=window.ContentStore.safeLink(item.buyUrl); if (buyUrl) { const buy=document.createElement('a');buy.className='admin-primary goods-buy';buy.href=buyUrl;buy.target='_blank';buy.rel='noopener';buy.textContent='Buy now ↗';actions.appendChild(buy); } else { const note=document.createElement('span');note.className='pill';note.textContent='Coming soon';actions.appendChild(note); }
  } else {
    root.innerHTML = `<section class="developer-detail"><div class="developer-portrait"><span></span></div><div class="developer-copy"><p class="hero-kicker"></p><h1></h1><p class="developer-bio"></p><p class="developer-description"></p><div class="developer-contact" hidden><p class="section-label">Contact slot</p><p class="developer-contact-note"></p><div class="developer-contact-grid"></div></div><a class="text-link" href="about.html">Back to studio <span>→</span></a></div></section>`;
    root.querySelector('.developer-portrait').style.backgroundImage=`linear-gradient(0deg,#080b0d,transparent 55%),url("${image.replace(/"/g,'%22')}")`;
    root.querySelector('.developer-portrait span').textContent=item.initial||'C';root.querySelector('.hero-kicker').textContent=item.role;root.querySelector('h1').textContent=`${item.name}\n${item.englishName}`;root.querySelector('.developer-bio').textContent=item.bio;root.querySelector('.developer-description').textContent=item.description;
    const email=String(item.email||'').trim();
    const safeEmail=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)?`mailto:${email}`:'';
    const links=[
      ['Email',safeEmail],
      ['Instagram',window.ContentStore.safeLink(item.instagram)],
      ['YouTube',window.ContentStore.safeLink(item.youtube)],
      ['X / Twitter',window.ContentStore.safeLink(item.twitter)],
      ['GitHub',window.ContentStore.safeLink(item.github)],
      ['Website',window.ContentStore.safeLink(item.website)]
    ].filter(([,href])=>href);
    const contact=root.querySelector('.developer-contact');
    const note=root.querySelector('.developer-contact-note');
    const grid=root.querySelector('.developer-contact-grid');
    if(item.contactNote) note.textContent=item.contactNote;
    links.forEach(([label,href])=>{const link=document.createElement('a');link.className='developer-contact-link';link.href=href;link.textContent=label;link.rel='noopener';if(!href.startsWith('mailto:'))link.target='_blank';grid.appendChild(link);});
    if(item.contactNote||links.length) contact.hidden=false;
  }
})();
