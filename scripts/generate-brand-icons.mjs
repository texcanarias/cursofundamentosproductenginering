import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const source = await readFile(new URL('../public/brand/simbolo.svg', import.meta.url), 'utf8');
const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage();
  await renderSymbol(page);
  for (const size of [32, 72, 96, 128, 144, 152, 192, 384, 512]) {
    const relative = size === 32 ? 'brand/favicon.png' : `icons/icon-${size}x${size}.png`;
    await page.setViewportSize({ width: size, height: size });
    await page.locator('svg').screenshot({
      path: fileURLToPath(new URL(`../public/${relative}`, import.meta.url)),
    });
  }
} finally {
  await browser.close();
}

async function renderSymbol(page) {
  await page.setContent(`
    <style>body{margin:0}svg{display:block;width:100vw;height:100vh}</style>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <rect width="128" height="128" fill="#ffffff" />
      <g id="symbol" transform="translate(24 24) scale(0.8333333)"></g>
    </svg>
  `);
  await page.evaluate((source) => {
    const parsed = new DOMParser().parseFromString(source, 'image/svg+xml');
    document.querySelector('#symbol').append(...parsed.documentElement.children);
  }, source);
}
