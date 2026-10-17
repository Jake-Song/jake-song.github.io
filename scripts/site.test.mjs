import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve('dist');
const files = readdirSync(root, { recursive: true }).filter(file => /\.(html|xml)$/.test(file));
const read = file => readFileSync(resolve(root, file), 'utf8');

test('essential pages and feeds are generated', () => {
  for (const file of ['index.html', 'posts/index.html', 'tags/index.html', 'about/index.html', '404.html', 'rss.xml', 'sitemap-index.xml', 'posts/hello-world/index.html']) {
    assert.ok(existsSync(resolve(root, file)), file);
  }
});

test('drafts never leak into generated pages or feeds', () => {
  for (const file of files) {
    assert.ok(!read(file).includes('Markdown 글 작성 예제'), file);
    assert.ok(!read(file).includes('/posts/writing-guide'), file);
    assert.ok(!read(file).includes('/tags/작성법'), file);
  }
});

test('local HTML links, images, and heading anchors resolve', () => {
  for (const file of files.filter(file => file.endsWith('.html'))) {
    const html = read(file);
    for (const match of html.matchAll(/(?:href|src)="([^"\s]+)"/g)) {
      const href = match[1];
      if (/^(https?:|data:|mailto:)/.test(href)) continue;
      const url = new URL(href, `https://jake-song.github.io/${file}`);
      let target = resolve(root, '.' + decodeURIComponent(url.pathname));
      if (url.pathname.endsWith('/')) target = resolve(target, 'index.html');
      assert.ok(existsSync(target), `${file}: ${href}`);
      if (url.hash && target.endsWith('.html')) {
        const body = readFileSync(target, 'utf8');
        assert.ok(body.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${file}: ${href}`);
      }
    }
  }
});

test('Korean content, metadata, code highlighting and TOC are present', () => {
  const post = read('posts/hello-world/index.html');
  assert.match(post, /lang="ko"/);
  assert.match(post, /rel="canonical"/);
  assert.match(post, /property="og:type" content="article"/);
  assert.match(post, /이 글의 목차/);
  assert.match(post, /astro-code/);
  assert.match(read('rss.xml'), /작은 기록의 시작/);
});
