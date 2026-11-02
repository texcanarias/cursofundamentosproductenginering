const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
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
let context;
let page;

setDefaultTimeout(30_000);

BeforeAll(async () => {
  frontendProcess = spawn(
    process.execPath,
    ['node_modules/@angular/cli/bin/ng.js', 'serve', '--host=127.0.0.1', '--port=4300'],
    { cwd: process.cwd(), stdio: 'ignore' },
  );
  await waitForService(frontendUrl, frontendProcess);
  browser = await chromium.launch({ headless: true });
});

Before(async function (scenario) {
  const uri = String(scenario?.gherkinDocument?.uri ?? '');
  const tags = (scenario?.pickle?.tags ?? []).map((tag) => tag.name);
  this.section =
    tags.includes('@entregas') || uri.includes('006-registro-entregas')
      ? 'deliveries'
      : 'inventory';
  context = await browser.newContext();
  await context.addInitScript(() => {
    window.__failStorageWrites = false;
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (window.__failStorageWrites && String(key).startsWith('a-la-par:')) {
        throw new DOMException('No hay espacio disponible', 'QuotaExceededError');
      }
      return original.call(this, key, value);
    };
  });
  page = await context.newPage();
  this.page = page;
  this.frontendUrl = frontendUrl;
  await page.goto(frontendUrl);
});

After(async () => {
  await context?.close();
});

AfterAll(async () => {
  await browser?.close();
  await stopProcess(frontendProcess);
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

async function waitForService(url, process) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (process.exitCode !== null) throw new Error(`El servidor terminó: ${url}`);
    try {
      if ((await fetch(url)).ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`El servidor no respondió: ${url}`);
}

async function stopProcess(process) {
  if (!process || process.exitCode !== null) return;
  const exited = once(process, 'exit');
  process.kill();
  await exited;
}
