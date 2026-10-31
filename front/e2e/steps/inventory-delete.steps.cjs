const assert = require('node:assert/strict');
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { sample, api, seed, open, article, writes } = require('../support/inventory.cjs');

When('solicito eliminar una de ellas', async function () {
  await open(this);
  await article(this)
    .getByRole('button', { name: /Eliminar/ })
    .click();
});

Then('aparece una confirmación que identifica su nombre, caducidad y ubicación', async function () {
  const dialog = this.page.getByRole('dialog');
  await expect(dialog).toContainText(sample.nombreProducto);
  await expect(dialog).toContainText('15 de marzo de 2027');
  await expect(dialog).toContainText(sample.ubicacion);
  await expect(article(this)).toBeVisible();
  assert.equal(writes(this).length, 0);
});

When('confirmo la eliminación', async function () {
  await this.page
    .getByRole('dialog')
    .getByRole('button', { name: 'Eliminar partida', exact: true })
    .click();
  await expect(this.page.getByRole('dialog')).toBeHidden();
  await expect(article(this)).toBeHidden();
});

Then('se envía DELETE al identificador de esa partida', function () {
  const request = writes(this).find((request) => request.method === 'DELETE');
  assert.ok(request.url.endsWith(`/api/lotes/${this.lots[0].id}`));
});

Then('solo desaparece del inventario tras confirmarse el éxito', async function () {
  await expect(article(this)).toBeHidden();
  await expect(this.page.getByRole('status')).toContainText('Partida eliminada.');
  assert.ok(!(await api(this)).some((lot) => lot.id === this.lots[0].id));
});

Then('la otra partida permanece visible y sin cambios', async function () {
  await expect(article(this, 1)).toBeVisible();
  assert.deepEqual(await api(this), [this.lots[1]]);
});

Given('que he abierto la confirmación de eliminación de una partida', async function () {
  await seed(this, [sample]);
  await open(this);
  this.trigger = article(this).getByRole('button', { name: /Eliminar/ });
  await this.trigger.click();
  await expect(this.page.getByRole('dialog')).toBeVisible();
});

When('cancelo la eliminación', async function () {
  await this.page.getByRole('dialog').getByRole('button', { name: 'Cancelar' }).click();
  await expect(this.page.getByRole('dialog')).toBeHidden();
});

Then('no se envía ninguna petición DELETE', function () {
  assert.equal(writes(this).filter((request) => request.method === 'DELETE').length, 0);
});

Then('la partida permanece visible', async function () {
  await expect(article(this)).toBeVisible();
});
Then('el foco regresa al control que abrió la confirmación', async function () {
  await expect(this.trigger).toBeFocused();
});
