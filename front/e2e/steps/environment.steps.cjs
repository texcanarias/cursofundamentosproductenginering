const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { mkdtemp, rm, writeFile } = require('node:fs/promises');
const { once } = require('node:events');
const { join } = require('node:path');
const { tmpdir } = require('node:os');
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
const backendUrl = 'http://127.0.0.1:4302';
let frontendProcess;
let backendProcess;
let directory;
let csvPath;
let deliveriesCsvPath;
let browser;
let context;
let page;

setDefaultTimeout(30_000);

BeforeAll(async () => {
  await startBackend();
  frontendProcess = spawn(
    process.execPath,
    [
      'node_modules/@angular/cli/bin/ng.js',
      'serve',
      '--host=127.0.0.1',
      '--port=4300',
      '--proxy-config=e2e/proxy.conf.cjs',
    ],
    { cwd: process.cwd(), stdio: 'ignore' },
  );
  await waitForService(frontendUrl, frontendProcess);
  browser = await chromium.launch({ headless: true });
});

Before(async function (scenario) {
  this.section = String(scenario?.gherkinDocument?.uri ?? '').includes('006-registro-entregas')
    ? 'deliveries'
    : 'inventory';
  await writeFile(csvPath, '', 'utf8');
  await writeFile(deliveriesCsvPath, '', 'utf8');
  context = await browser.newContext();
  page = await context.newPage();
  this.page = page;
  this.frontendUrl = frontendUrl;
  this.backendUrl = backendUrl;
  this.requests = [];
  page.on('request', (request) => {
    if (request.url().includes('/api/lotes') || request.url().includes('/api/entregas')) {
      this.requests.push({
        method: request.method(),
        url: request.url(),
        body: request.postDataJSON(),
      });
    }
  });
});

After(async () => {
  await context?.close();
});

AfterAll(async () => {
  await browser?.close();
  await stopProcess(frontendProcess);
  await stopProcess(backendProcess);
  if (directory) await rm(directory, { recursive: true, force: true });
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

async function startBackend() {
  directory = await mkdtemp(join(tmpdir(), 'a-la-par-e2e-'));
  csvPath = join(directory, 'lotes.csv');
  deliveriesCsvPath = join(directory, 'entregas.csv');
  backendProcess = spawn(
    process.execPath,
    ['--import', '../back/node_modules/tsx/dist/loader.mjs', '../back/src/main.ts'],
    {
      cwd: process.cwd(),
      stdio: 'ignore',
      env: {
        ...process.env,
        PORT: '4302',
        LOTES_CSV_PATH: csvPath,
        ENTREGAS_CSV_PATH: deliveriesCsvPath,
      },
    },
  );
  await waitForService(`${backendUrl}/api/health`, backendProcess);
}

async function stopProcess(process) {
  if (!process || process.exitCode !== null) return;
  const exited = once(process, 'exit');
  process.kill();
  await exited;
}
