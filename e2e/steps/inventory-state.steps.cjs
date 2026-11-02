const assert = require('node:assert/strict');
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { sample, api, seed, open, article, fill, checkForm } = require('../support/inventory.cjs');
const sections = require('../support/sections.cjs');

Given('que los datos guardados en el navegador no se pueden leer', async function () {
  await sections.corrupt(this);
});

Then('veo un mensaje de error accesible y una acción para reintentar', async function () {
  await expect(this.page.getByRole('alert')).toContainText('No se pudieron leer');
  await expect(this.page.getByRole('button', { name: 'Reintentar' })).toBeVisible();
});

Then('el error no se presenta como un inventario vacío', async function () {
  await expect(this.page.getByText('No hay productos registrados')).toBeHidden();
  await seed(this, []);
  await this.page.getByRole('button', { name: 'Reintentar' }).click();
  await expect(this.page.getByText('No hay productos registrados')).toBeVisible();
});

Given('que el navegador rechaza nuevas escrituras', async function () {
  await sections.seed(this, [sections.sample(this)]);
  await sections.open(this);
  await sections.failWrites(this, true);
  this.failure = 'No se pudieron guardar';
});

When('intento crear, editar o eliminar una partida', async function () {
  this.preserved = 0;
  this.before = await api(this);
  await rejectedForm(this, 'create');
  await rejectedForm(this, 'edit');
  await rejectedDelete(this);
});

Then('veo un mensaje accesible con el motivo disponible', async function () {
  await expect(this.page.getByRole('alert')).toContainText(this.failure);
});

Then('no se presenta la operación como completada', async function () {
  assert.deepEqual(await sections.api(this), sections.records(this));
  const success = sections.isDeliveries(this) ? 'Entrega registrada.' : 'Producto guardado.';
  await expect(this.page.getByText(success, { exact: true })).toHaveCount(0);
});

Then('se conservan los valores del formulario si estaba creando o editando', function () {
  assert.equal(this.preserved, 2);
});

Then('puedo corregir los datos o reintentar cuando proceda', async function () {
  await sections.allowWrites(this);
  const name = sections.isDeliveries(this) ? 'Eliminar entrega' : 'Eliminar partida';
  await this.page.getByRole('button', { name, exact: true }).click();
  await expect(this.page.getByRole('dialog')).toBeHidden();
  assert.deepEqual(await sections.api(this), []);
});

Given('que una partida visible se ha eliminado en otra pestaña', async function () {
  await seed(this, [sample]);
  await open(this);
  await api(this, 'DELETE', undefined, this.lots[0].id);
});

When('intento consultar, editar o eliminar esa partida', async function () {
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

async function rejectedForm(world, mode) {
  const data = { ...sample, nombreProducto: `Arroz integral ${mode}` };
  const button = mode === 'create' ? 'Añadir producto' : 'Editar';
  await world.page.getByRole('button', { name: button }).first().click();
  await fill(world, data);
  await world.page.getByRole('button', { name: 'Guardar producto', exact: true }).click();
  await expect(world.page.getByRole('alert')).toContainText(world.failure);
  await checkForm(world, data);
  world.preserved = (world.preserved ?? 0) + 1;
  await world.page.getByRole('button', { name: 'Cancelar', exact: true }).click();
}

async function rejectedDelete(world) {
  await article(world)
    .getByRole('button', { name: /Eliminar/ })
    .click();
  await world.page.getByRole('button', { name: 'Eliminar partida', exact: true }).click();
  await expect(world.page.getByRole('dialog').getByRole('alert')).toContainText(world.failure);
  await expect(
    world.page.getByRole('button', { name: 'Eliminar partida', exact: true }),
  ).toBeEnabled();
}
