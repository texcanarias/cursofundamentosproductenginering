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
    assert.equal(deliveries.writes(this).length, 0);
  },
);

Then('se envía DELETE al identificador de esa entrega', function () {
  const request = deliveries.writes(this).find((entry) => entry.method === 'DELETE');
  assert.ok(request.url.endsWith(`/api/entregas/${this.deliveries[0].id}`));
});

Then('solo desaparece del listado tras confirmarse el éxito', async function () {
  await expect(deliveries.article(this)).toBeHidden();
  await expect(this.page.getByRole('status')).toContainText('Entrega eliminada.');
  assert.ok(!(await deliveries.api(this)).some((entry) => entry.id === this.deliveries[0].id));
});

Given('que he abierto la confirmación de eliminación de una entrega', async function () {
  await deliveries.seed(this, [deliveries.sample]);
  await deliveries.open(this);
  this.trigger = deliveries.article(this).getByRole('button', { name: /Eliminar entrega/ });
  await this.trigger.click();
  await expect(this.page.getByRole('dialog')).toBeVisible();
});

Then('la entrega permanece visible', async function () {
  await expect(deliveries.article(this)).toBeVisible();
});
