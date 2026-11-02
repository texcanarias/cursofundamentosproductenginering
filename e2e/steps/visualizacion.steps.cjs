const assert = require('node:assert/strict');
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const sections = require('../support/sections.cjs');
const visualization = require('../support/visualization.cjs');
const { keyboardCrud, keyboardDeliveryCrud } = require('../support/keyboard.cjs');

Given('que utilizo la aplicación {string} con Angular Material', function (name) {
  assert.equal(name, 'A la par');
  assert.ok(this.frontendUrl);
});

Given('el inventario y las entregas se muestran como tarjetas accesibles', async function () {
  await expect(this.page.locator('main#main-content')).toHaveCount(1);
});

Given('que hay partidas con nombres y ubicaciones largas', async function () {
  await visualization.seedLong(this);
  assert.ok(this.lots.some((lot) => lot.nombreProducto === visualization.LONG_TEXT));
});

Given('que hay entregas con observaciones largas', async function () {
  await visualization.seedLong(this);
  assert.ok(this.deliveries.some((delivery) => delivery.observacion === visualization.LONG_TEXT));
});

Given('que abro el inventario en una pantalla de {int} píxeles de ancho', async function (width) {
  await visualization.openAt(this, width);
});

Given('abro el inventario en una pantalla de {int} píxeles de ancho', async function (width) {
  await visualization.openAt(this, width);
});

Given('que abro las entregas en una pantalla de {int} píxeles de ancho', async function (width) {
  await visualization.openAt(this, width);
});

Given('abro las entregas en una pantalla de {int} píxeles de ancho', async function (width) {
  await visualization.openAt(this, width);
});

Then('veo cada partida en una sola columna', async function () {
  const layout = await visualization.expectNoOverflow(this);
  assert.equal(layout.columns, 1);
});

Then('veo cada entrega en una sola columna', async function () {
  const layout = await visualization.expectNoOverflow(this);
  assert.equal(layout.columns, 1);
});

Then('el nombre, la caducidad y la ubicación se muestran completos', async function () {
  await visualization.expectCardsComplete(this);
});

Then(
  'el identificador de familia, la fecha y la observación se muestran completos',
  async function () {
    await visualization.expectCardsComplete(this);
  },
);

Then('no aparece desplazamiento horizontal en la página', async function () {
  await visualization.expectNoOverflow(this);
});

Then('las partidas se distribuyen en dos columnas legibles', async function () {
  const layout = await visualization.expectNoOverflow(this);
  assert.equal(layout.columns, 2);
  assert.ok(layout.cards.every((card) => card.width >= 200));
});

Then('las entregas se distribuyen en dos columnas legibles', async function () {
  const layout = await visualization.expectNoOverflow(this);
  assert.equal(layout.columns, 2);
  assert.ok(layout.cards.every((card) => card.width >= 200));
});

Then('cada tarjeta conserva su nombre, caducidad, ubicación y acciones', async function () {
  await visualization.expectCardsComplete(this);
  await visualization.expectActions(this);
});

Then('cada tarjeta conserva su identificador, fecha, observación y acciones', async function () {
  await visualization.expectCardsComplete(this);
  await visualization.expectActions(this);
});

Then('el contenido se mantiene centrado con un ancho máximo de lectura', async function () {
  const layout = await visualization.metrics(this);
  assert.ok(layout.main.width < layout.viewport.width);
  const rightMargin = layout.viewport.width - layout.main.right;
  assert.ok(Math.abs(layout.main.left - rightMargin) <= 2);
});

Then('las partidas no se estiran hasta los bordes de la ventana', async function () {
  const layout = await visualization.metrics(this);
  assert.ok(layout.cards.every((card) => card.left > 0 && card.right < layout.viewport.width));
  assert.ok(layout.cards.every((card) => card.width < layout.viewport.width / 2));
});

Given('que hay una partida que caduca en 7 días', async function () {
  const caducidad = visualization.dateOffset(7);
  await sections.seed(this, [{ ...sections.sample(this), caducidad }]);
});

When('consulto el inventario', async function () {
  await visualization.openAt(this, 375, 900, false);
});

Then('veo el estado de caducidad escrito con texto', async function () {
  await expect(sections.article(this).locator('.expiry-state')).toHaveText('Caduca en 7 días');
});

Then('el color no es la única forma de entender el estado', async function () {
  const status = await sections.article(this).locator('.expiry-state').textContent();
  assert.ok(status.trim().length > 0);
  await expect(sections.article(this).locator('time')).not.toHaveText(status.trim());
});

Given('que la visualización se ha adaptado a los dispositivos', async function () {
  assert.ok(this.frontendUrl);
});

When('consulto, creo, edito y elimino partidas y entregas', async function () {
  await keyboardCrud(this);
  await keyboardDeliveryCrud(this);
});

Then('los flujos y la persistencia en el navegador siguen funcionando igual', async function () {
  assert.deepEqual(await sections.read(this, 'inventory'), []);
  assert.deepEqual(await sections.read(this, 'deliveries'), []);
});

Then('las pruebas de las especificaciones 003, 004, 006 y 009 siguen pasando', async function () {
  await expect(this.page.getByRole('link', { name: 'Inventario' })).toBeVisible();
  await expect(this.page.getByRole('link', { name: 'Entregas' })).toBeVisible();
  await expect(this.page.locator('header a.brand')).toContainText('A la par');
});
