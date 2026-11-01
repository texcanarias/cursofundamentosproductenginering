const assert = require('node:assert/strict');
const { expect } = require('@playwright/test');

const sample = { familiaId: 'FAM-001', fecha: '2026-10-31', observacion: 'Entrega completa' };
const second = { familiaId: 'FAM-002', fecha: '2026-09-15', observacion: 'Entrega parcial' };

async function api(world, method = 'GET', data, id = '') {
  const response = await fetch(`${world.backendUrl}/api/entregas${id ? `/${id}` : ''}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: data ? JSON.stringify(data) : undefined,
  });
  assert.ok(response.ok, `Backend response: ${response.status}`);
  return response.status === 204 ? undefined : response.json();
}

async function seed(world, entries = [sample, second]) {
  for (const delivery of await api(world)) {
    await api(world, 'DELETE', undefined, delivery.id);
  }
  world.deliveries = [];
  for (const data of entries) world.deliveries.push(await api(world, 'POST', data));
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

function writes(world) {
  return world.requests.filter(
    (request) =>
      ['POST', 'PUT', 'DELETE'].includes(request.method) && request.url.includes('/api/entregas'),
  );
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
  await startCreate(world, data);
  await world.page.getByRole('button', { name: 'Guardar entrega', exact: true }).click();
  await expect(world.page.getByRole('alert')).toContainText(world.failure);
  await checkForm(world, data);
  world.preserved = (world.preserved ?? 0) + 1;
  await world.page.getByRole('button', { name: 'Cancelar', exact: true }).click();
}

async function rejectedDelete(world) {
  await open(world);
  await article(world)
    .getByRole('button', { name: /Eliminar entrega/ })
    .click();
  await world.page.getByRole('button', { name: 'Eliminar entrega', exact: true }).click();
  await expect(world.page.getByRole('dialog').getByRole('alert')).toContainText(world.failure);
  await expect(
    world.page.getByRole('button', { name: 'Eliminar entrega', exact: true }),
  ).toBeEnabled();
}

module.exports = {
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
  writes,
  checkForm,
  rejectedCreate,
  rejectedDelete,
};
