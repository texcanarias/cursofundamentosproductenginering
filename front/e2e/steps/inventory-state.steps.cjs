const assert = require('node:assert/strict');
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const {
  sample,
  api,
  seed,
  open,
  article,
  fill,
  startCreate,
  writes,
  checkForm,
} = require('../support/inventory.cjs');

When('una consulta o una operación CRUD está pendiente', async function () {
  await startCreate(this);
  const gate = new Promise((resolve) => {
    this.release = resolve;
  });
  await this.page.route('**/api/lotes', async (route) => {
    await gate;
    await route.continue();
  });
  await this.page.getByRole('button', { name: 'Guardar producto', exact: true }).click();
  await expect(this.page.getByRole('button', { name: 'Guardando…', exact: true })).toBeDisabled();
});

Then('se indica de forma accesible que la operación está en curso', async function () {
  await expect(this.page.getByRole('status')).toContainText('Guardando producto…');
});

Then(
  'no puedo repetir el envío del mismo formulario o confirmación mientras está pendiente',
  async function () {
    await this.page
      .getByRole('button', { name: 'Guardando…', exact: true })
      .evaluate((button) => button.click());
    assert.equal(writes(this).length, 1);
  },
);

Then('no se muestra éxito antes de la respuesta del backend', async function () {
  await expect(this.page.getByRole('status')).not.toContainText('Producto guardado.');
  this.release();
  await expect(this.page.getByRole('heading', { name: 'Inventario', exact: true })).toBeVisible();
  assert.equal((await api(this)).length, 1);
});

Given('que falla la consulta al backend', async function () {
  await this.page.route(
    '**/api/lotes',
    (route) =>
      route.fulfill({
        status: 500,
        json: { error: { mensaje: 'No se pudo consultar el inventario.' } },
      }),
    { times: 1 },
  );
});

Then('veo un mensaje de error accesible y una acción para reintentar', async function () {
  await expect(this.page.getByRole('alert')).toContainText('No se pudo consultar');
  await expect(this.page.getByRole('button', { name: 'Reintentar' })).toBeVisible();
});

Then('el error no se presenta como un inventario vacío', async function () {
  await expect(this.page.getByText('No hay productos registrados')).toBeHidden();
  await this.page.getByRole('button', { name: 'Reintentar' }).click();
  await expect(this.page.getByText('No hay productos registrados')).toBeVisible();
});

Given('que el backend rechaza un alta, una edición o una eliminación', async function () {
  await seed(this, [sample]);
  this.failure = 'No se pudo guardar en el almacén.';
  await this.page.route('**/api/lotes**', (route) =>
    route.request().method() === 'GET'
      ? route.continue()
      : route.fulfill({ status: 500, json: { error: { mensaje: this.failure } } }),
  );
});

When('recibo la respuesta de error', async function () {
  this.preserved = 0;
  await rejectedForm(this, 'create');
  await rejectedForm(this, 'edit');
  await rejectedDelete(this);
});

Then('veo un mensaje accesible con el motivo disponible', async function () {
  await expect(this.page.getByRole('alert')).toContainText(this.failure);
});

Then('no se presenta la operación como completada', async function () {
  assert.deepEqual(await api(this), this.lots);
  await expect(this.page.getByText('Producto guardado.', { exact: true })).toHaveCount(0);
});

Then('se conservan los valores del formulario si estaba creando o editando', function () {
  assert.equal(this.preserved, 2);
});

Then('puedo corregir los datos o reintentar cuando proceda', async function () {
  await this.page.unroute('**/api/lotes**');
  await this.page.getByRole('button', { name: 'Eliminar partida', exact: true }).click();
  await expect(this.page.getByRole('dialog')).toBeHidden();
  assert.deepEqual(await api(this), []);
});

Given('que una partida visible se ha eliminado en el backend', async function () {
  await seed(this, [sample]);
  await open(this);
  await api(this, 'DELETE', undefined, this.lots[0].id);
});

When('intento consultar, editar o eliminar esa partida y recibo HTTP 404', async function () {
  await article(this)
    .getByRole('button', { name: /Ver detalle/ })
    .click();
});

Then('se informa de que la partida ya no está disponible', async function () {
  await expect(this.page.getByRole('alert')).toContainText('ya no está disponible');
});

Then('puedo volver al inventario actualizado', async function () {
  await this.page.getByRole('button', { name: 'Volver al inventario' }).click();
  await expect(this.page.getByText('No hay productos registrados')).toBeVisible();
});

Given('que no hay conexión con el backend', async function () {
  await seed(this, [sample]);
  this.failure = 'No hay conexión';
  await this.page.route('**/api/lotes**', (route) =>
    route.request().method() === 'GET' ? route.continue() : route.abort('internetdisconnected'),
  );
});

When('intento guardar o eliminar una partida', async function () {
  await rejectedForm(this, 'create');
  await rejectedDelete(this);
});

Then('se informa de que no se ha podido completar la operación', async function () {
  await expect(this.page.getByRole('alert')).toContainText('No hay conexión');
});

Then('no se confirma ni se encola una escritura para sincronizarla después', async function () {
  assert.deepEqual(await api(this), this.lots);
  assert.equal(writes(this).length, 2);
  await this.page.unroute('**/api/lotes**');
  await open(this);
  assert.deepEqual(await api(this), this.lots);
  assert.equal(writes(this).length, 2);
});

async function rejectedForm(world, mode) {
  const data = { ...sample, nombreProducto: 'Arroz integral' };
  if (mode === 'create') await startCreate(world, data);
  else {
    await open(world);
    await article(world)
      .getByRole('button', { name: /Editar/ })
      .click();
    await fill(world, data);
  }
  await world.page.getByRole('button', { name: 'Guardar producto', exact: true }).click();
  await expect(world.page.getByRole('alert')).toContainText(world.failure);
  await checkForm(world, data);
  world.preserved = (world.preserved ?? 0) + 1;
  await world.page.getByRole('button', { name: 'Cancelar', exact: true }).click();
}

async function rejectedDelete(world) {
  await open(world);
  await article(world)
    .getByRole('button', { name: /Eliminar/ })
    .click();
  await world.page.getByRole('button', { name: 'Eliminar partida', exact: true }).click();
  await expect(world.page.getByRole('dialog').getByRole('alert')).toContainText(world.failure);
  await expect(
    world.page.getByRole('button', { name: 'Eliminar partida', exact: true }),
  ).toBeEnabled();
}
