const { expect } = require('@playwright/test');
const storage = require('./storage.cjs');

const section = 'inventory';
const sample = { nombreProducto: 'Arroz', caducidad: '2027-03-15', ubicacion: 'Almacén A' };
const second = { ...sample, caducidad: '2027-06-20', ubicacion: 'Almacén B' };

async function api(world, method = 'GET', data, id = '') {
  const records = await storage.read(world, section);
  if (method === 'GET') return id ? records.find((record) => record.id === id) : records;
  if (method === 'POST') {
    const record = { id: `lot-${crypto.randomUUID()}`, ...data };
    await storage.write(world, [...records, record], section);
    return record;
  }
  if (method === 'PUT') {
    const record = { ...data, id };
    await storage.write(
      world,
      records.map((entry) => (entry.id === id ? record : entry)),
      section,
    );
    return record;
  }
  if (method === 'DELETE') {
    await storage.write(
      world,
      records.filter((entry) => entry.id !== id),
      section,
    );
  }
  return undefined;
}

async function seed(world, entries = [sample, second]) {
  world.lots = entries.map((data, index) => ({ id: `lot-${index + 1}`, ...data }));
  await storage.write(world, world.lots, section);
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

async function checkForm(world, data = sample) {
  await expect(world.page.getByLabel('Nombre del producto', { exact: true })).toHaveValue(
    data.nombreProducto,
  );
  await expect(world.page.getByLabel('Fecha de caducidad', { exact: true })).toHaveValue(
    data.caducidad,
  );
  await expect(world.page.getByLabel('Dónde está', { exact: true })).toHaveValue(data.ubicacion);
}

function pick(record) {
  return {
    nombreProducto: record.nombreProducto,
    caducidad: record.caducidad,
    ubicacion: record.ubicacion,
  };
}

module.exports = {
  section,
  sample,
  second,
  api,
  seed,
  open,
  article,
  fill,
  startCreate,
  saved,
  checkForm,
  pick,
};
