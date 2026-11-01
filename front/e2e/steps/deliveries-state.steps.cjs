const assert = require('node:assert/strict');
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const deliveries = require('../support/deliveries.cjs');

Given('que el backend rechaza un alta o una eliminación', async function () {
  await deliveries.seed(this, [deliveries.sample]);
  this.failure = 'No se pudo guardar en el almacén.';
  await this.page.route('**/api/entregas**', (route) =>
    route.request().method() === 'GET'
      ? route.continue()
      : route.fulfill({ status: 500, json: { error: { mensaje: this.failure } } }),
  );
});

Then('se conservan los valores del formulario si estaba creando', function () {
  assert.equal(this.preserved, 1);
});

Given('que una entrega visible se ha eliminado en el backend', async function () {
  await deliveries.seed(this, [deliveries.sample]);
  await deliveries.open(this);
  await deliveries.api(this, 'DELETE', undefined, this.deliveries[0].id);
});

When('intento consultar o eliminar esa entrega y recibo HTTP 404', async function () {
  await deliveries
    .article(this)
    .getByRole('button', { name: /Ver detalle/ })
    .click();
});

Then('se informa de que la entrega ya no está disponible', async function () {
  await expect(this.page.getByRole('alert')).toContainText('ya no está disponible');
});

Then('puedo volver al listado actualizado', async function () {
  await this.page.getByRole('button', { name: 'Volver a las entregas' }).click();
  await expect(
    this.page.getByRole('heading', { name: 'No hay entregas registradas' }),
  ).toBeVisible();
});

When('intento guardar o eliminar una entrega', async function () {
  await deliveries.rejectedCreate(this);
  await deliveries.rejectedDelete(this);
});

Then('el error no se presenta como un listado vacío', async function () {
  await expect(this.page.getByText('No hay entregas registradas')).toBeHidden();
  await this.page.getByRole('button', { name: 'Reintentar' }).click();
  await expect(this.page.getByText('No hay entregas registradas')).toBeVisible();
});
