const assert = require('node:assert/strict');
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { sample, seed, open, startCreate, saved } = require('../support/inventory.cjs');
const deliveries = require('../support/deliveries.cjs');
const sections = require('../support/sections.cjs');
const storage = require('../support/storage.cjs');

Given('que hay una partida guardada en el navegador', async function () {
  this.section = 'inventory';
  await seed(this, [sample]);
  await open(this);
});

When('creo una partida desde la interfaz', async function () {
  this.section = 'inventory';
  await startCreate(this);
  await saved(this);
  this.lots = await sections.api(this);
});

When('registro una entrega desde la interfaz', async function () {
  this.section = 'deliveries';
  await deliveries.startCreate(this);
  await deliveries.saved(this);
  this.deliveries = await deliveries.api(this);
});

When('recargo la página', async function () {
  await this.page.reload();
  await expect(this.page.getByText('Cargando', { exact: false })).toBeHidden();
});

Then('la partida sigue disponible en el inventario', async function () {
  await expect(this.page.getByRole('heading', { name: 'Inventario', exact: true })).toBeVisible();
  const lots = await sections.api(this, 'GET');
  assert.equal(lots.length, 1);
  await expect(this.page.locator(`[data-lot-id="${lots[0].id}"]`)).toContainText(
    sample.nombreProducto,
  );
});

Then('la entrega sigue disponible en el listado', async function () {
  await expect(this.page.getByRole('heading', { name: 'Entregas', exact: true })).toBeVisible();
  const entries = await deliveries.api(this, 'GET');
  assert.equal(entries.length, 1);
  await expect(this.page.locator(`[data-delivery-id="${entries[0].id}"]`)).toContainText(
    deliveries.sample.familiaId,
  );
});

When('guardo una partida y una entrega', async function () {
  this.section = 'inventory';
  await startCreate(this);
  await saved(this);
  this.lots = await sections.api(this);
  this.section = 'deliveries';
  await deliveries.startCreate(this);
  await deliveries.saved(this);
  this.deliveries = await deliveries.api(this);
  this.section = 'inventory';
});

Then('cada una se guarda bajo su propia clave', async function () {
  assert.equal((await storage.read(this, 'inventory')).length, 1);
  assert.equal((await storage.read(this, 'deliveries')).length, 1);
});

Then('las operaciones de inventario no alteran las entregas', async function () {
  const deliveriesBefore = await storage.read(this, 'deliveries');
  this.section = 'inventory';
  await open(this);
  await sections
    .article(this)
    .getByRole('button', { name: /Eliminar/ })
    .click();
  await this.page.getByRole('button', { name: 'Eliminar partida', exact: true }).click();
  await expect(this.page.getByRole('dialog')).toBeHidden();
  assert.deepEqual(await storage.read(this, 'deliveries'), deliveriesBefore);
  this.section = 'deliveries';
});

When('intento crear otra partida', async function () {
  this.section = 'inventory';
  await this.page.getByRole('button', { name: 'Añadir producto', exact: true }).click();
  await sections.fill(this, { ...sample, nombreProducto: 'Lentejas' });
  await this.page.getByRole('button', { name: 'Guardar producto', exact: true }).click();
});

Then('la partida anterior permanece intacta', async function () {
  const lots = await sections.api(this, 'GET');
  assert.equal(lots.length, 1);
  assert.equal(lots[0].nombreProducto, sample.nombreProducto);
});
