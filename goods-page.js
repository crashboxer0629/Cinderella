(async function () {
  const content = await window.ContentStore.load(); const page = content.goodsPage || {};
  const multiline = (el, text) => { if (!el || !text) return; el.replaceChildren(); String(text).split('\n').forEach((line,i,a) => { el.append(document.createTextNode(line)); if(i<a.length-1) el.append(document.createElement('br')); }); };
  multiline(document.querySelector('[data-goods-title]'), page.pageTitle);
  const deck = document.querySelector('[data-goods-deck]'); if (deck) deck.textContent = page.deck || '';
  multiline(document.querySelector('[data-goods-collection]'), page.collectionTitle);
  const grid = document.querySelector('[data-goods-grid]'); if (!grid) return; grid.replaceChildren();
  (content.goods || []).sort((a,b)=>a.order-b.order).forEach((item) => {
    const card = document.createElement('a'); card.className = 'product-card reveal visible'; card.href = `goods-detail.html?id=${encodeURIComponent(item.id)}`;
    const visual = document.createElement('div'); visual.className = 'product-visual'; const orbit = document.createElement('span'); orbit.className = 'product-orbit'; const word = document.createElement('span'); word.className = 'product-word'; word.textContent = item.visualText; visual.append(orbit, word);
    const info = document.createElement('div'); info.className = 'product-info'; const copy = document.createElement('div'); const title = document.createElement('h2'); title.textContent = item.title; const meta = document.createElement('p'); meta.textContent = `${item.spec} · ${item.price}`; copy.append(title, meta); const arrow = document.createElement('span'); arrow.className = 'buy-button'; arrow.textContent = 'View'; info.append(copy, arrow); card.append(visual, info); grid.appendChild(card);
  });
})();
