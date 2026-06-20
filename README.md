# Cinderella Studio Website

GitHub Pages에 바로 배포할 수 있는 게임 스튜디오 웹사이트와 관리자 CMS입니다.

## 완성된 페이지

- `index.html` — 홈
- `about.html` — 스튜디오와 개발자 목록
- `developer-detail.html?id=...` — 개발자 상세
- `games.html` — 게임 목록
- `game-detail.html?id=...` — 게임 상세
- `goods.html` — 굿즈 목록
- `goods-detail.html?id=...` — 굿즈 상세 및 구매 링크
- `news.html` — 뉴스 목록
- `news-detail.html?id=...` — 뉴스 상세
- `admin.html` — 전체 콘텐츠 관리자

관리자에서는 기본 정보와 SNS 주소, 홈, About, 개발자, 게임, 굿즈, 뉴스를 편집할 수 있습니다.

## 로컬 미리보기

```powershell
npm start
```

`http://localhost:8080`을 엽니다. Supabase 설정 전 `admin.html`의 로컬 데모 모드로 편집 UI를 시험할 수 있습니다. 데모 변경은 해당 브라우저에만 저장됩니다.

## 실제 관리자와 GitHub Pages 배포

[SETUP_GITHUB_PAGES.md](SETUP_GITHUB_PAGES.md)를 따라 Supabase와 GitHub Pages를 연결하세요.

- 사이트 호스팅: GitHub Pages
- 비밀번호 로그인: Supabase Auth
- 공개 콘텐츠: Supabase Postgres + Row Level Security
- 자동 배포: `.github/workflows/pages.yml`

`config.js`에는 공개용 Publishable/Anon key만 넣습니다. `service_role` 키는 절대 넣지 마세요.
