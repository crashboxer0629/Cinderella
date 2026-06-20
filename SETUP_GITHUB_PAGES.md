# GitHub Pages + 관리자 CMS 설정

GitHub Pages는 정적 파일만 호스팅하므로 관리자 로그인과 공용 콘텐츠 저장소로 Supabase를 사용합니다.

## 1. Supabase 준비

1. Supabase에서 새 프로젝트를 만듭니다.
2. SQL Editor에서 `supabase-setup.sql` 전체를 실행합니다.
3. Authentication → Users에서 관리자 계정을 하나 만듭니다. 이 이메일과 비밀번호로 `admin.html`에 로그인합니다.
4. Project Settings → API에서 Project URL과 Publishable key 또는 legacy `anon` key를 복사합니다.
5. `config.js`에 두 값을 입력합니다.

```js
window.CINDERELLA_CONFIG = {
  supabaseUrl: 'https://YOUR_PROJECT.supabase.co',
  supabaseAnonKey: 'YOUR_PUBLISHABLE_OR_ANON_KEY'
};
```

`service_role` 키는 관리자 권한 전체를 갖기 때문에 절대 HTML/JavaScript/GitHub 저장소에 넣으면 안 됩니다. 공개용 키의 쓰기 권한은 SQL의 RLS 정책이 로그인 사용자에게만 허용합니다.

## 2. 첫 콘텐츠 게시

1. 로컬 서버 또는 GitHub Pages의 `admin.html`을 엽니다.
2. 위에서 만든 관리자 계정으로 로그인합니다.
3. 필요한 내용을 편집하고 `변경사항 게시`를 누릅니다.
4. 최초 게시 때 `main` 콘텐츠 행이 자동 생성됩니다.

## 3. GitHub Pages 배포

1. `cinderella-site` 폴더의 내용 전체를 GitHub 저장소 루트에 올립니다.
2. 기본 브랜치를 `main`으로 사용합니다.
3. 저장소 Settings → Pages → Source를 `GitHub Actions`로 선택합니다.
4. `main`에 push하면 `.github/workflows/pages.yml`이 자동 배포합니다.

프로젝트 저장소라면 주소는 보통 `https://사용자명.github.io/저장소명/`입니다. 모든 내부 링크는 상대경로라 하위 경로에서도 동작합니다.
