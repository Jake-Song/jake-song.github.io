import { test, expect } from '@playwright/test';

test('home, tag navigation and responsive layout', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('배움의 조각');
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('home.png'), fullPage: true });
  await page.getByRole('link', { name: '#기록', exact: true }).first().click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('#기록');
  await page.getByRole('link', { name: /작은 기록의 시작/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('작은 기록의 시작, Hello World');
  await page.reload();
  await expect(page.getByRole('navigation', { name: '이 글의 목차' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('article TOC, clipboard and narrow screens', async ({ page, context }, testInfo) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/posts/hello-world/');
  await page.getByRole('button', { name: '코드 복사' }).click();
  await expect(page.getByRole('button', { name: '코드 복사' })).toHaveText('복사 완료');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('def learn(question):');
  await page.getByRole('navigation', { name: '이 글의 목차' }).getByRole('link', { name: '기록을 남기는 방식' }).click();
  expect(decodeURIComponent(new URL(page.url()).hash)).toBe('#기록을-남기는-방식');
  await page.screenshot({ path: testInfo.outputPath('article.png'), fullPage: true });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});

test('keyboard access, about page and draft exclusion', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: '본문으로 건너뛰기' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  await page.getByRole('link', { name: '소개', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Jake');
  const response = await page.goto('/posts/writing-guide/');
  expect(response?.status()).toBe(404);
  await page.goto('/404.html');
  await expect(page.getByRole('link', { name: '홈으로 돌아가기' })).toBeVisible();
});
