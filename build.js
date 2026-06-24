const fs = require('fs');
const path = require('path');

const root = __dirname;
const output = path.join(root, 'dist');

const routes = new Map([
  ['index.html', '/'],
  ['about.html', '/about/'],
  ['developer-detail.html', '/about/developer/'],
  ['studio.html', '/studio/'],
  ['games.html', '/games/'],
  ['game-detail.html', '/games/detail/'],
  ['roadmap.html', '/roadmap/'],
  ['goods.html', '/goods/'],
  ['goods-detail.html', '/goods/detail/'],
  ['news.html', '/news/'],
  ['news-detail.html', '/news/detail/'],
  ['admin.html', '/admin/']
]);

const publicFiles = [
  '.nojekyll',
  'CNAME',
  'about-page.js',
  'admin.js',
  'cms-common.js',
  'config.js',
  'content-store.js',
  'entry-detail.js',
  'game-data.js',
  'game-detail.js',
  'games-page.js',
  'studio-page.js',
  'roadmap-page.js',
  'goods-page.js',
  'home-page.js',
  'news-page.js',
  'script.js',
  'styles.css'
];

const forceSecureOriginScript = `<script>
  (() => {
    const canonicalHost = 'www.teamcnd.kro.kr';
    const isLocal = /^(localhost|127\\.0\\.0\\.1|\\[::1\\])$/.test(location.hostname);
    if (!isLocal && (location.protocol !== 'https:' || location.hostname === 'teamcnd.kro.kr')) {
      const next = new URL(location.href);
      next.protocol = 'https:';
      if (location.hostname === 'teamcnd.kro.kr') next.hostname = canonicalHost;
      location.replace(next.href);
    }
  })();
</script>`;

const cleanUrlScript = `<script>
  (() => {
    const routes = ${JSON.stringify(Object.fromEntries(routes))};
    const file = location.pathname.split('/').pop();
    if (routes[file]) history.replaceState(null, '', routes[file] + location.search + location.hash);
  })();
</script>`;

const siteIcons = [
  '<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">',
  '<meta name="theme-color" content="#080b0d">',
  '<link rel="icon" type="image/svg+xml" href="/assets/cinderella-favicon.svg?v=2">'
].join('');

function transform(source, isHtml = false) {
  let result = source;
  for (const [file, route] of routes) result = result.replaceAll(file, route);
  if (isHtml) {
    result = result.replace(/<head>/i, `<head><base href="/">${siteIcons}${forceSecureOriginScript}${cleanUrlScript}`);
  }
  return result;
}

function copyDirectory(name, optional = false) {
  const source = path.join(root, name);
  if (!fs.existsSync(source)) {
    if (optional) return;
    throw new Error(`Missing required directory: ${name}`);
  }
  fs.cpSync(source, path.join(output, name), { recursive: true });
}

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

for (const file of publicFiles) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  fs.writeFileSync(path.join(output, file), transform(source));
}

for (const directory of ['assets', 'content']) copyDirectory(directory);
copyDirectory('data', true);

for (const [file, route] of routes) {
  const html = transform(fs.readFileSync(path.join(root, file), 'utf8'), true);
  const cleanTarget = route === '/'
    ? path.join(output, 'index.html')
    : path.join(output, route.slice(1), 'index.html');

  fs.mkdirSync(path.dirname(cleanTarget), { recursive: true });
  fs.writeFileSync(cleanTarget, html);

  if (file !== 'index.html') fs.writeFileSync(path.join(output, file), html);
}

console.log(`Built ${routes.size} clean routes in ${output}`);
