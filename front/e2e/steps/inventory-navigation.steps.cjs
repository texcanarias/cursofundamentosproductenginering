const assert = require('node:assert/strict');
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { sample, api, seed, open, article } = require('../support/inventory.cjs');
const sections = require('../support/sections.cjs');

Given('que utilizo el frontend Angular con Angular Material', function () {
  assert.ok(this.frontendUrl);
});

Given(
  'el frontend consume el contrato de {string} de la especificación 002',
  async function (path) {
    assert.equal(path, '/api/lotes');
    assert.deepEqual(await api(this), []);
  },
);

Given('cada partida tiene nombre de producto, caducidad y ubicación', function () {
  assert.deepEqual(Object.keys(sample), ['nombreProducto', 'caducidad', 'ubicacion']);
});

Given('que el backend contiene varias partidas', async function () {
  await seed(this);
});
Given(
  'que existen dos partidas de {string} con distintas caducidades y ubicaciones',
  async function (name) {
    await seed(this);
    assert.ok(this.lots.every((lot) => lot.nombreProducto === name));
  },
);
Given('que el backend devuelve una lista vacía', async function () {
  await sections.seed(this, []);
});
Given('que existen dos partidas del mismo producto', async function () {
  await seed(this);
});
Given('que veo una partida en el inventario', async function () {
  await seed(this, [sample]);
  await open(this);
});

When('accedo a la vista de inventario', async function () {
  await open(this);
});

Then('veo el nombre del producto, la caducidad y la ubicación de cada partida', async function () {
  for (const lot of this.lots) {
    const item = this.page.locator(`[data-lot-id="${lot.id}"]`);
    await expect(item).toContainText(lot.nombreProducto);
    await expect(item).toContainText(lot.ubicacion);
    await expect(item.locator('time')).toHaveAttribute('datetime', lot.caducidad);
  }
});

Then(
  'cada partida dispone de acciones para consultar su detalle, editarla y eliminarla',
  async function () {
    for (const item of await this.page.locator('article').all()) {
      await expect(item.getByRole('button', { name: /Ver detalle/ })).toBeVisible();
      await expect(item.getByRole('button', { name: /Editar/ })).toBeVisible();
      await expect(item.getByRole('button', { name: /Eliminar/ })).toBeVisible();
    }
  },
);

Then('veo ambas partidas por separado con sus propios datos', async function () {
  await expect(this.page.locator('article')).toHaveCount(2);
  await expect(article(this, 0)).toContainText('Almacén A');
  await expect(article(this, 1)).toContainText('Almacén B');
});

Then(
  'las acciones de cada partida utilizan su identificador, no el nombre del producto',
  async function () {
    await article(this, 1)
      .getByRole('button', { name: /Ver detalle/ })
      .click();
    await expect(this.page.locator('.detail')).toContainText(this.lots[1].ubicacion);
    assert.ok(
      this.requests.some((request) => request.url.endsWith(`/api/lotes/${this.lots[1].id}`)),
    );
  },
);

Then('veo un estado de inventario sin productos', async function () {
  await expect(
    this.page.getByRole('heading', { name: 'No hay productos registrados' }),
  ).toBeVisible();
});

Then('puedo iniciar el alta de una partida', async function () {
  await this.page.getByRole('button', { name: 'Añadir producto', exact: true }).click();
  await expect(
    this.page.getByRole('heading', { name: 'Añadir producto', exact: true }),
  ).toBeVisible();
});

When('abro su detalle', async function () {
  await sections
    .article(this)
    .getByRole('button', { name: /Ver detalle/ })
    .click();
});

Then('se consulta la partida por su identificador', async function () {
  await expect(this.page.locator('.detail')).toBeVisible();
  assert.ok(this.requests.some((request) => request.url.endsWith(`/api/lotes/${this.lots[0].id}`)));
});

Then('veo su nombre, caducidad y ubicación completos', async function () {
  await expect(this.page.locator('.detail')).toContainText(sample.nombreProducto);
  await expect(this.page.locator('.detail')).toContainText(sample.ubicacion);
  await expect(this.page.locator('.detail time')).toHaveAttribute('datetime', sample.caducidad);
});

Then('puedo regresar al inventario', async function () {
  await this.page.getByRole('button', { name: 'Volver al inventario' }).click();
  await expect(this.page.getByRole('heading', { name: 'Inventario', exact: true })).toBeVisible();
});
