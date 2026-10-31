const assert = require('node:assert/strict');
const { expect } = require('@playwright/test');

const sample = { nombreProducto: 'Arroz', caducidad: '2027-03-15', ubicacion: 'Almacén A' };
const second = { ...sample, caducidad: '2027-06-20', ubicacion: 'Almacén B' };

async function api(world, method = 'GET', data, id = '') {
  const response = await fetch(`${world.backendUrl}/api/lotes${id ? `/${id}` : ''}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: data ? JSON.stringify(data) : undefined,
  });
  assert.ok(response.ok, `Backend response: ${response.status}`);
  return response.status === 204 ? undefined : response.json();
}

async function seed(world, entries = [sample, second]) {
  for (const lot of await api(world)) await api(world, 'DELETE', undefined, lot.id);
  world.lots = [];
  for (const data of entries) world.lots.push(await api(world, 'POST', data));
}

async function open(world) {
  await world.page.goto(`${world.frontendUrl}/inventario`);
  await expect(world.page.getByRole('heading', { name: 'Inventario', exact: true })).toBeVisible();
  await expect(world.page.getByText('Cargando inventario…', { exact: true })).toBeHidden();
}

function article(world, index = 0) {
  return world.page.locator(`[data-lot-id="${world.lots[index].id}"]`);
}

async function fill(world, data = sample) {
  await world.page.getByLabel('Nombre del producto', { exact: true }).fill(data.nombreProducto);
  await world.page.getByLabel('Fecha de caducidad', { exact: true }).fill(data.caducidad);
  await world.page.getByLabel('Dónde está', { exact: true }).fill(data.ubicacion);
}

async function startCreate(world, data = sample) {
  await open(world);
  await world.page.getByRole('button', { name: 'Añadir producto', exact: true }).click();
  await fill(world, data);
}

async function saved(world) {
  await world.page.getByRole('button', { name: 'Guardar producto', exact: true }).click();
  await expect(world.page.getByRole('heading', { name: 'Inventario', exact: true })).toBeVisible();
  await expect(world.page.getByText('Cargando inventario…', { exact: true })).toBeHidden();
}

function writes(world) {
  return world.requests.filter((request) => ['POST', 'PUT', 'DELETE'].includes(request.method));
}

async function checkForm(world, data = sample) {
  await expect(world.page.getByLabel('Nombre del producto', { exact: true })).toHaveValue(
    data.nombreProducto,
  );
  await expect(world.page.getByLabel('Fecha de caducidad', { exact: true })).toHaveValue(
    data.caducidad,
  );
  await expect(world.page.getByLabel('Dónde está', { exact: true })).toHaveValue(data.ubicacion);
}

module.exports = {
  sample,
  second,
  api,
  seed,
  open,
  article,
  fill,
  startCreate,
  saved,
  writes,
  checkForm,
};
