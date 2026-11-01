const assert = require('node:assert/strict');
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const {
  sample,
  api,
  open,
  article,
  fill,
  startCreate,
  writes,
  checkForm,
} = require('../support/inventory.cjs');
const sections = require('../support/sections.cjs');

When('inicio el alta de una partida', async function () {
  await open(this);
  await this.page.getByRole('button', { name: 'Añadir producto', exact: true }).click();
});

When('completo nombre de producto, caducidad y ubicación con valores válidos', async function () {
  await fill(this);
});

When('confirmo el guardado', async function () {
  await sections.saved(this);
});

Then('se envía una petición POST a {string}', function (path) {
  const request = sections.writes(this).find((entry) => entry.method === 'POST');
  assert.ok(request.url.endsWith(path));
  assert.deepEqual(request.body, sections.sample(this));
});

Then('tras confirmarse el éxito veo la nueva partida en el inventario', async function () {
  const lots = await api(this);
  assert.equal(lots.length, 1);
  await expect(this.page.locator(`[data-lot-id="${lots[0].id}"]`)).toContainText(
    sample.nombreProducto,
  );
});

Then('recibo una confirmación accesible del guardado', async function () {
  const text = sections.isDeliveries(this) ? 'Entrega registrada.' : 'Producto guardado.';
  await expect(this.page.getByRole('status')).toContainText(text);
});

When('abro la edición de una de ellas', async function () {
  await open(this);
  await article(this)
    .getByRole('button', { name: /Editar/ })
    .click();
});

Then('el formulario contiene sus valores actuales', async function () {
  await checkForm(this, this.lots[0]);
});

When('cambio el nombre, la caducidad o la ubicación y guardo', async function () {
  this.changed = {
    nombreProducto: 'Arroz integral',
    caducidad: '2028-07-01',
    ubicacion: 'Almacén C',
  };
  await fill(this, this.changed);
  await sections.saved(this);
});

Then('se envía una petición PUT con los tres campos al identificador de esa partida', function () {
  const request = writes(this).find((entry) => entry.method === 'PUT');
  assert.ok(request.url.endsWith(`/api/lotes/${this.lots[0].id}`));
  assert.deepEqual(request.body, this.changed);
});

Then('tras confirmarse el éxito veo los datos actualizados', async function () {
  await expect(article(this)).toContainText(this.changed.nombreProducto);
  await expect(article(this)).toContainText(this.changed.ubicacion);
  await expect(article(this).locator('time')).toHaveAttribute('datetime', this.changed.caducidad);
});

Then('la otra partida permanece sin cambios', async function () {
  const lots = await api(this);
  assert.deepEqual(
    lots.find((lot) => lot.id === this.lots[1].id),
    this.lots[1],
  );
});

Given('que he introducido cambios en el formulario de alta o edición', async function () {
  this.before = await api(this);
  await startCreate(this);
});

When('cancelo la operación', async function () {
  await this.page.getByRole('button', { name: 'Cancelar', exact: true }).click();
});

Then('regreso al inventario sin enviar una petición de escritura', async function () {
  await expect(this.page.getByRole('heading', { name: 'Inventario', exact: true })).toBeVisible();
  assert.equal(writes(this).length, 0);
});

Then('las partidas guardadas permanecen sin cambios', async function () {
  assert.deepEqual(await api(this), this.before);
});

When(
  'intento guardar con nombre o ubicación vacíos o solo espacios, o con caducidad ausente o inválida',
  async function () {
    await startCreate(this, { nombreProducto: '   ', caducidad: '', ubicacion: '   ' });
    await this.page.getByRole('button', { name: 'Guardar producto', exact: true }).click();
  },
);

Then('veo los errores asociados a los campos afectados', async function () {
  if (sections.isDeliveries(this)) {
    await expect(this.page.locator('mat-error')).toHaveCount(2);
    await expect(this.page.getByLabel('Identificador de familia', { exact: true })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    await expect(this.page.getByLabel('Fecha de entrega', { exact: true })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    return;
  }
  await expect(this.page.locator('mat-error')).toHaveCount(3);
  for (const label of ['Nombre del producto', 'Fecha de caducidad', 'Dónde está']) {
    await expect(this.page.getByLabel(label, { exact: true })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  }
});

Then('los errores pueden ser anunciados por un lector de pantalla', async function () {
  await expect(this.page.getByRole('alert')).toContainText('Revisa los campos indicados');
  for (const input of await this.page.locator('input').all()) {
    assert.ok((await input.getAttribute('aria-describedby')).includes('error'));
  }
});

Then('no se envía ninguna petición de escritura', function () {
  assert.equal(sections.writes(this).length, 0);
});

When('registro una partida con una fecha de caducidad pasada válida', async function () {
  this.expired = { ...sample, caducidad: '1999-01-01' };
  await startCreate(this, this.expired);
  await sections.saved(this);
});

Then('el formulario permite guardarla', async function () {
  if (sections.isDeliveries(this)) {
    await expect(this.page.getByRole('status')).toContainText('Entrega registrada.');
    this.deliveries = await sections.api(this);
    assert.equal(this.deliveries.length, 1);
    return;
  }
  await expect(this.page.getByRole('status')).toContainText('Producto guardado.');
  this.lots = await sections.api(this);
  assert.equal(this.lots.length, 1);
});

Then('la fecha se envía como {string} sin hora ni zona horaria', function (format) {
  assert.equal(format, 'AAAA-MM-DD');
  const field = sections.isDeliveries(this) ? 'fecha' : 'caducidad';
  assert.equal(sections.writes(this)[0].body[field], this.expired[field]);
});

Then('al volver a consultarla veo el mismo día seleccionado', async function () {
  const field = sections.isDeliveries(this) ? 'fecha' : 'caducidad';
  await sections
    .article(this)
    .getByRole('button', { name: /Ver detalle/ })
    .click();
  await expect(this.page.locator('.detail time')).toHaveAttribute('datetime', this.expired[field]);
  await expect(this.page.locator('.detail time')).toHaveText('1 de enero de 1999');
});
