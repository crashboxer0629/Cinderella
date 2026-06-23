(async function () {
  const content = await window.ContentStore.load();
  const about = content.about || {};
  const multiline = (el, text) => { if (!el || !text) return; el.replaceChildren(); String(text).split('\n').forEach((line, i, arr) => { el.append(document.createTextNode(line)); if (i < arr.length - 1) el.append(document.createElement('br')); }); };
  multiline(document.querySelector('[data-about-title]'), about.pageTitle);
  const deck = document.querySelector('[data-about-deck]'); if (deck) deck.textContent = about.deck || '';
  multiline(document.querySelector('[data-about-intro]'), about.introTitle);
  const manifesto = document.querySelector('[data-manifesto]');
  if (manifesto) {
    manifesto.replaceChildren();
    (about.manifesto || []).forEach((item) => { const row = document.createElement('div'); row.className = 'manifesto-row reveal visible'; const label = document.createElement('span'); label.textContent = item.label; const title = document.createElement('h3'); title.textContent = item.text; row.append(label, title); manifesto.appendChild(row); });
  }
  const teamGrid = document.querySelector('[data-team-grid]');
  if (teamGrid) {
    teamGrid.replaceChildren();
    (content.team || []).sort((a,b) => a.order-b.order).forEach((member) => {
      const card = document.createElement('a'); card.className = 'team-card reveal visible'; card.href = `developer-detail.html?id=${encodeURIComponent(member.id)}`;
      card.setAttribute('aria-label', `${member.name} ${member.englishName || ''} 프로필 보기`.trim());
      const role = document.createElement('span'); role.className = 'role'; role.textContent = member.role;
      const initial = document.createElement('span'); initial.className = 'initial'; initial.textContent = member.initial || member.name?.[0] || 'C';
      const info = document.createElement('div'); const name = document.createElement('h3'); name.textContent = `${member.name} · ${member.englishName}`; const bio = document.createElement('p'); bio.textContent = member.bio; info.append(name, bio);
      card.append(role, initial, info); teamGrid.appendChild(card);
    });
  }
})();
