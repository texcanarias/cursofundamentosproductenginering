const { expect } = require('@playwright/test');
const storage = require('./storage.cjs');

const section = 'deliveries';
const sample = { familiaId: 'FAM-001', fecha: '2026-10-31', observacion: 'Entrega completa' };
const second = { familiaId: 'FAM-002', fecha: '2026-09-15', observacion: 'Entrega parcial' };

async function api(world, method = 'GET', data, id = '') {
  const records = await storage.read(world, section);
  if (method === 'GET') return id ? records.find((record) => record.id === id) : records;
  if (method === 'POST') {
    const record = { id: `delivery-${crypto.randomUUID()}`, ...data };
    await storage.write(world, [...records, record], section);
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
  world.deliveries = entries.map((data, index) => ({ id: `delivery-${index + 1}`, ...data }));
  await storage.write(world, world.deliveries, section);
}

async function open(world) {
  await world.page.goto(`${world.frontendUrl}/entregas`);
  await expect(world.page.getByRole('heading', { name: 'Entregas', exact: true })).toBeVisible();
  await expect(world.page.getByText('Cargando entregas…', { exact: true })).toBeHidden();
}

function article(world, index = 0) {
  return world.page.locator(`[data-delivery-id="${world.deliveries[index].id}"]`);
}

function label(value) {
  return new Intl.DateTimeFormat('es', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00.000Z`));
}

async function fill(world, data = sample) {
  await world.page.getByLabel('Identificador de familia', { exact: true }).fill(data.familiaId);
  await world.page.getByLabel('Fecha de entrega', { exact: true }).fill(data.fecha);
  await world.page
    .getByLabel('Observación (opcional)', { exact: true })
    .fill(data.observacion ?? '');
}

async function startCreate(world, data = sample) {
  await open(world);
  await world.page.getByRole('button', { name: 'Registrar entrega', exact: true }).click();
  await fill(world, data);
}

async function saved(world) {
  await world.page.getByRole('button', { name: 'Guardar entrega', exact: true }).click();
  await expect(world.page.getByRole('heading', { name: 'Entregas', exact: true })).toBeVisible();
  await expect(world.page.getByText('Cargando entregas…', { exact: true })).toBeHidden();
}

async function checkForm(world, data = sample) {
  await expect(world.page.getByLabel('Identificador de familia', { exact: true })).toHaveValue(
    data.familiaId,
  );
  await expect(world.page.getByLabel('Fecha de entrega', { exact: true })).toHaveValue(data.fecha);
  await expect(world.page.getByLabel('Observación (opcional)', { exact: true })).toHaveValue(
    data.observacion ?? '',
  );
}

async function rejectedCreate(world) {
  const data = { ...sample, observacion: 'Entrega rechazada' };
  await world.page.getByRole('button', { name: 'Registrar entrega', exact: true }).click();
  await fill(world, data);
  await world.page.getByRole('button', { name: 'Guardar entrega', exact: true }).click();
  await expect(world.page.getByRole('alert')).toContainText(world.failure);
  await checkForm(world, data);
  world.preserved = (world.preserved ?? 0) + 1;
  await world.page.getByRole('button', { name: 'Cancelar', exact: true }).click();
}

async function rejectedDelete(world) {
  await article(world)
    .getByRole('button', { name: /Eliminar entrega/ })
    .click();
  await world.page.getByRole('button', { name: 'Eliminar entrega', exact: true }).click();
  await expect(world.page.getByRole('dialog').getByRole('alert')).toContainText(world.failure);
  await expect(
    world.page.getByRole('button', { name: 'Eliminar entrega', exact: true }),
  ).toBeEnabled();
}

function pick(record) {
  return { familiaId: record.familiaId, fecha: record.fecha, observacion: record.observacion };
}

module.exports = {
  section,
  sample,
  second,
  api,
  seed,
  open,
  article,
  label,
  fill,
  startCreate,
  saved,
  checkForm,
  rejectedCreate,
  rejectedDelete,
  pick,
};
