# Jake’s Dev Log

개발과 AI를 공부하며 남기는 한국어 기술 블로그. Astro, TypeScript, Markdown으로 구성했으며 GitHub Pages에 정적으로 배포합니다.

블로그 주소: **https://jake-song.github.io**

## 로컬 실행

Node.js 24와 npm을 사용합니다.

```sh
npm install
npm run dev
```

브라우저에서 http://localhost:4321 을 엽니다.

```sh
npm run check
npm run build
npm test
npm run preview
```

`npm test`는 빌드 결과의 내부 링크, 목차, 메타데이터, 초안 제외 여부를 검사하므로 빌드를 먼저 실행합니다.

브라우저 검증은 `npx playwright install chromium` 후 `npm run test:browser`로 실행합니다. 데스크톱·모바일 화면, 목차, 코드 복사, 키보드 접근과 초안 제외를 검사합니다. GitHub Actions에서도 배포 전에 실행하며 스크린샷은 `browser-checks` 아티팩트에 저장됩니다.

## 새 글 작성

`src/content/posts/my-first-post.md` 파일을 만듭니다.

```markdown
---
title: "새로운 글 제목"
description: "글 목록과 공유 화면에 표시할 짧은 요약"
date: 2026-10-17
tags: ["개발", "AI"]
draft: false
---

글의 첫 문단입니다.

## 소제목

본문을 작성합니다.
```

- 글 주소는 `/posts/my-first-post/`입니다. 게시 후 파일명을 바꾸면 주소도 바뀝니다.
- 날짜 내림차순으로 표시합니다. 미래 날짜를 지정해도 자동 예약 발행되지 않습니다.
- `draft: true`인 글은 로컬 개발 서버와 공개 사이트, 태그, RSS, 사이트맵에서 제외됩니다. 초안 화면을 미리 보려면 로컬에서 잠시 `false`로 바꾸고 커밋 전에 되돌리세요.
- 초안 원문은 공개 GitHub 저장소에서 읽을 수 있으므로 비밀 정보는 작성하지 마세요.
- `##`, `###` 제목은 목차에 자동으로 추가됩니다.
- 코드 블록에 언어 이름을 지정하면 문법 강조와 복사 버튼이 적용됩니다.
- 이미지는 `public/images/`에 저장하고 `![설명](/images/file.png)`로 삽입합니다.
- 예제는 `src/content/posts/writing-guide.md`를 참고하세요.

## 블로그 정보 수정

이름, 작성자, 소개, GitHub 링크는 `src/site.ts`에서 수정합니다. 색상과 레이아웃은 `src/styles/global.css`에 있습니다. 주소를 바꿀 때에는 `astro.config.mjs`의 `site`와 `public/robots.txt`의 사이트맵 주소도 함께 변경하세요.

## GitHub Pages 배포

1. GitHub에 로그인하고 `Jake-Song/Jake-Song.github.io` 공개 저장소를 확인합니다. 기존 저장소가 있다면 먼저 내려받아 내용을 검토하고, 기존 사이트를 무조건 덮어쓰지 마세요.
2. 이 프로젝트를 저장소의 루트에 추가하고 `main` 브랜치로 push합니다. `node_modules`, `dist`, `.astro`는 올리지 않습니다. `package-lock.json`은 함께 커밋합니다.
3. 저장소의 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 지정합니다.
4. **Actions → Deploy blog to GitHub Pages**에서 빌드와 배포 성공 여부를 확인합니다. 필요하면 **Run workflow**로 다시 실행합니다.
5. https://jake-song.github.io 에서 홈, 게시글 직접 접속, RSS를 확인합니다.

Pull request에서는 검사와 빌드만 실행하며, `main`에 반영되면 자동으로 공개 배포합니다. 서버나 별도 데이터베이스는 필요하지 않습니다.

기존 Ethereum Dapp 소스는 [`archive/pre-blog-2026-10-17`](https://github.com/Jake-Song/jake-song.github.io/tree/archive/pre-blog-2026-10-17) 브랜치에 보관하며, 기존 `master` 브랜치도 유지합니다.

## 기본 기능

- 모바일 대응 다크 테마, 글 목록, 태그별 페이지, 소개, 404
- 본문 목차, 코드 문법 강조와 복사, 표 가로 스크롤
- 키보드 포커스, 본문 바로가기, 동작 줄이기 설정 대응
- canonical / Open Graph 메타데이터, RSS, 사이트맵

폰트는 Google Fonts를 사용하며, 연결되지 않아도 시스템 폰트로 표시됩니다. 코드 복사에는 HTTPS 또는 localhost 및 브라우저 클립보드 권한이 필요합니다.
