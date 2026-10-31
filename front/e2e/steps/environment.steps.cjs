const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const {
  After,
  AfterAll,
  Before,
  BeforeAll,
  Given,
  Then,
  When,
  setDefaultTimeout,
} = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');

const frontendUrl = 'http://127.0.0.1:4300';
let frontendProcess;
let browser;
let page;

setDefaultTimeout(30_000);

BeforeAll(async () => {
  frontendProcess = spawn(
    process.execPath,
    ['node_modules/@angular/cli/bin/ng.js', 'serve', '--host=127.0.0.1', '--port=4300'],
    { cwd: process.cwd(), stdio: 'ignore' },
  );
  await waitForFrontend();
  browser = await chromium.launch({ headless: true });
});

Before(async () => {
  page = await browser.newPage();
});

After(async () => {
  await page?.close();
});

AfterAll(async () => {
  await browser?.close();
  frontendProcess?.kill();
});

Given('el frontend está disponible', async () => {
  const response = await fetch(frontendUrl);
  assert.equal(response.status, 200);
});

When('abro la página principal', async () => {
  await page.goto(frontendUrl);
});

Then('existe la región principal de la aplicación', async () => {
  const mainRegion = page.locator('main#main-content');
  assert.equal(await mainRegion.count(), 1);
});

async function waitForFrontend() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (frontendProcess.exitCode !== null) throw new Error('El servidor Angular terminó.');
    try {
      if ((await fetch(frontendUrl)).ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error('Angular no respondió dentro del tiempo esperado.');
}
