(function () {
  const config = window.CINDERELLA_CONFIG || {};
  const configured = Boolean(config.supabaseUrl && config.supabaseAnonKey);
  const LOCAL_KEY = 'cinderella_content_preview_v2';
  const SESSION_KEY = 'cinderella_supabase_session';
  let cache = null;

  const base = () => String(config.supabaseUrl || '').replace(/\/$/, '');
  const headers = (token) => ({
    apikey: config.supabaseAnonKey,
    Authorization: `Bearer ${token || config.supabaseAnonKey}`,
    'Content-Type': 'application/json'
  });

  async function fallback() {
    const local = localStorage.getItem(LOCAL_KEY);
    if (local) try { return JSON.parse(local); } catch (_) { /* continue */ }
    const response = await fetch('content/site-content.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('기본 콘텐츠를 불러오지 못했습니다.');
    return response.json();
  }

  async function load(force = false) {
    if (cache && !force) return cache;
    if (configured) {
      try {
        const response = await fetch(`${base()}/rest/v1/site_content?id=eq.main&select=content`, { headers: headers() });
        if (response.ok) {
          const rows = await response.json();
          if (rows[0]?.content) return (cache = rows[0].content);
        }
      } catch (_) { /* fallback below */ }
    }
    return (cache = await fallback());
  }

  async function login(email, password) {
    if (!configured) throw new Error('먼저 config.js에 Supabase 정보를 입력해 주세요.');
    const response = await fetch(`${base()}/auth/v1/token?grant_type=password`, {
      method: 'POST', headers: headers(), body: JSON.stringify({ email, password })
    });
    const session = await response.json();
    if (!response.ok || !session.access_token) throw new Error(session.error_description || session.msg || '로그인에 실패했습니다.');
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }

  function session() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); } catch (_) { return null; }
  }

  function logout() { sessionStorage.removeItem(SESSION_KEY); }

  async function save(content) {
    if (!configured) {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(content));
      cache = content;
      return { preview: true };
    }
    const current = session();
    if (!current?.access_token) throw new Error('관리자 로그인이 필요합니다.');
    const response = await fetch(`${base()}/rest/v1/site_content?on_conflict=id`, {
      method: 'POST',
      headers: { ...headers(current.access_token), Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({ id: 'main', content, updated_at: new Date().toISOString() })
    });
    if (!response.ok) {
      if (response.status === 401) logout();
      throw new Error('콘텐츠를 게시하지 못했습니다. 로그인과 RLS 정책을 확인해 주세요.');
    }
    cache = content;
    return { preview: false };
  }

  function clearPreview() { localStorage.removeItem(LOCAL_KEY); cache = null; }
  function safeImage(value) {
    const image = String(value || '').trim();
    return /^(https?:\/\/|assets\/|\.\/assets\/|data:image\/(?:png|jpeg|webp);base64,)/i.test(image) ? image : 'assets/hero-palace.png';
  }
  function safeLink(value) { const link=String(value||'').trim(); return /^https?:\/\//i.test(link)?link:''; }
  function makeId(value) { return String(value || '').toLowerCase().trim().replace(/[^a-z0-9가-힣]+/g, '-').replace(/^-+|-+$/g, '') || `item-${Date.now()}`; }

  window.ContentStore = { load, login, logout, session, save, clearPreview, configured, safeImage, safeLink, makeId };
})();
