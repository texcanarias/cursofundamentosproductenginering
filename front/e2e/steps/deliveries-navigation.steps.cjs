const assert = require('node:assert/strict');
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const deliveries = require('../support/deliveries.cjs');

Given(
  'el frontend consume el contrato de {string} de la especificación 005',
  async function (path) {
    assert.equal(path, '/api/entregas');
    assert.deepEqual(await deliveries.api(this), []);
  },
);

Given('cada entrega tiene identificador de familia, fecha y observación opcional', function () {
  assert.deepEqual(Object.keys(deliveries.sample), ['familiaId', 'fecha', 'observacion']);
});

Given('que el backend contiene varias entregas', async function () {
  await deliveries.seed(this);
});

When('accedo a la vista de entregas', async function () {
  await deliveries.open(this);
});

Then(
  'veo el identificador de familia, la fecha y la observación de cada entrega',
  async function () {
    for (const delivery of this.deliveries) {
      const item = this.page.locator(`[data-delivery-id="${delivery.id}"]`);
      await expect(item).toContainText(delivery.familiaId);
      await expect(item).toContainText(delivery.observacion);
      await expect(item.locator('time')).toHaveAttribute('datetime', delivery.fecha);
    }
  },
);

Then('cada entrega dispone de acciones para consultar su detalle y eliminarla', async function () {
  for (const item of await this.page.locator('article').all()) {
    await expect(item.getByRole('button', { name: /Ver detalle/ })).toBeVisible();
    await expect(item.getByRole('button', { name: /Eliminar entrega/ })).toBeVisible();
  }
});

Given(
  'que existen dos entregas para la familia {string} con distintas fechas',
  async function (familiaId) {
    const entries = [
      { ...deliveries.sample, familiaId, fecha: '2026-10-31' },
      { ...deliveries.second, familiaId, fecha: '2026-09-15' },
    ];
    await deliveries.seed(this, entries);
    assert.ok(this.deliveries.every((delivery) => delivery.familiaId === familiaId));
  },
);

Then('veo ambas entregas por separado con sus propios datos', async function () {
  await expect(this.page.locator('article')).toHaveCount(2);
  await expect(deliveries.article(this, 0)).toContainText(this.deliveries[0].observacion);
  await expect(deliveries.article(this, 1)).toContainText(this.deliveries[1].observacion);
});

Then(
  'las acciones de cada entrega utilizan su identificador, no el identificador de familia',
  async function () {
    const target = this.deliveries[1];
    await deliveries
      .article(this, 1)
      .getByRole('button', { name: /Ver detalle/ })
      .click();
    await expect(this.page.locator('.detail')).toContainText(target.observacion);
    assert.ok(this.requests.some((request) => request.url.endsWith(`/api/entregas/${target.id}`)));
  },
);

Then('veo un estado de listado sin entregas', async function () {
  await expect(
    this.page.getByRole('heading', { name: 'No hay entregas registradas' }),
  ).toBeVisible();
});

Then('puedo iniciar el alta de una entrega', async function () {
  await this.page.getByRole('button', { name: 'Registrar entrega', exact: true }).click();
  await expect(
    this.page.getByRole('heading', { name: 'Registrar entrega', exact: true }),
  ).toBeVisible();
});

Given('que veo una entrega en el listado', async function () {
  await deliveries.seed(this, [deliveries.sample]);
  await deliveries.open(this);
});

Then('se consulta la entrega por su identificador', async function () {
  await expect(this.page.locator('.detail')).toBeVisible();
  assert.ok(
    this.requests.some((request) => request.url.endsWith(`/api/entregas/${this.deliveries[0].id}`)),
  );
});

Then('veo su identificador de familia, fecha y observación completos', async function () {
  const detail = this.page.locator('.detail');
  await expect(detail).toContainText(deliveries.sample.familiaId);
  await expect(detail).toContainText(deliveries.sample.observacion);
  await expect(detail.locator('time')).toHaveAttribute('datetime', deliveries.sample.fecha);
});

Then('puedo regresar al listado', async function () {
  await this.page.getByRole('button', { name: 'Volver a las entregas' }).click();
  await expect(this.page.getByRole('heading', { name: 'Entregas', exact: true })).toBeVisible();
});
