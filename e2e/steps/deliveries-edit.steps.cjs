const assert = require('node:assert/strict');
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const deliveries = require('../support/deliveries.cjs');

When('inicio el alta de una entrega', async function () {
  await deliveries.open(this);
  await this.page.getByRole('button', { name: 'Registrar entrega', exact: true }).click();
});

When(
  'completo identificador de familia, fecha y observación con valores válidos',
  async function () {
    await deliveries.fill(this);
  },
);

Then('tras confirmarse el éxito veo la nueva entrega en el listado', async function () {
  const entries = await deliveries.api(this);
  assert.equal(entries.length, 1);
  const item = this.page.locator(`[data-delivery-id="${entries[0].id}"]`);
  await expect(item).toContainText(deliveries.sample.familiaId);
  await expect(item).toContainText(deliveries.sample.observacion);
});

Given('que he introducido cambios en el formulario de alta', async function () {
  this.before = await deliveries.api(this);
  await deliveries.startCreate(this);
});

Then('regreso al listado sin enviar una petición de escritura', async function () {
  await expect(this.page.getByRole('heading', { name: 'Entregas', exact: true })).toBeVisible();
  assert.equal(deliveries.writes(this).length, 0);
});

Then('las entregas guardadas permanecen sin cambios', async function () {
  assert.deepEqual(await deliveries.api(this), this.before);
});

When(
  'intento guardar con identificador de familia vacío o solo espacios, o con fecha ausente o inválida',
  async function () {
    await deliveries.startCreate(this, { familiaId: '   ', fecha: '', observacion: '' });
    await this.page.getByRole('button', { name: 'Guardar entrega', exact: true }).click();
  },
);

When('registro una entrega con una fecha de entrega pasada válida', async function () {
  this.expired = { ...deliveries.sample, fecha: '1999-01-01' };
  await deliveries.startCreate(this, this.expired);
  await deliveries.saved(this);
});
