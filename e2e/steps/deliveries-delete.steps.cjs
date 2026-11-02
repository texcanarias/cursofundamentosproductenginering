const assert = require('node:assert/strict');
const { Given, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const deliveries = require('../support/deliveries.cjs');

Given('que existen entregas en el listado', async function () {
  await deliveries.seed(this);
});

Then(
  'aparece una confirmación que identifica su identificador de familia, fecha y observación',
  async function () {
    const dialog = this.page.getByRole('dialog');
    await expect(dialog).toContainText(deliveries.sample.familiaId);
    await expect(dialog).toContainText(deliveries.label(deliveries.sample.fecha));
    await expect(dialog).toContainText(deliveries.sample.observacion);
    await expect(deliveries.article(this)).toBeVisible();
    assert.deepEqual(await deliveries.api(this), this.deliveries);
  },
);

Then('se elimina solo esa entrega del almacenamiento del navegador', async function () {
  const entries = await deliveries.api(this);
  assert.ok(!entries.some((entry) => entry.id === this.deliveries[0].id));
  assert.deepEqual(entries, [this.deliveries[1]]);
});

Then('solo desaparece del listado tras confirmarse el éxito', async function () {
  await expect(deliveries.article(this)).toBeHidden();
  await expect(this.page.getByRole('status')).toContainText('Entrega eliminada.');
  assert.ok(!(await deliveries.api(this)).some((entry) => entry.id === this.deliveries[0].id));
});

Given('que he abierto la confirmación de eliminación de una entrega', async function () {
  await deliveries.seed(this, [deliveries.sample]);
  await deliveries.open(this);
  this.before = await deliveries.api(this);
  this.trigger = deliveries.article(this).getByRole('button', { name: /Eliminar entrega/ });
  await this.trigger.click();
  await expect(this.page.getByRole('dialog')).toBeVisible();
});

Then('la entrega permanece visible', async function () {
  await expect(deliveries.article(this)).toBeVisible();
});
