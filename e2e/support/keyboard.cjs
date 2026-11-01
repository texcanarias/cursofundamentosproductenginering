const assert = require('node:assert/strict');
const { expect } = require('@playwright/test');
const inventory = require('./inventory.cjs');
const deliveries = require('./deliveries.cjs');

async function focusByKeyboard(page, locator) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    if (await locator.evaluate((element) => element === document.activeElement)) return;
    await page.keyboard.press('Tab');
  }
  throw new Error('El control no se alcanza con el teclado');
}

async function activate(world, name) {
  await focusByKeyboard(world.page, world.page.getByRole('button', { name, exact: true }));
  await world.page.keyboard.press('Enter');
}

async function enterText(world, label, value) {
  await focusByKeyboard(world.page, world.page.getByLabel(label, { exact: true }));
  await world.page.keyboard.press('ControlOrMeta+A');
  await world.page.keyboard.insertText(value);
}

async function enterDate(world, label) {
  const date = world.page.getByLabel(label, { exact: true });
  await focusByKeyboard(world.page, date);
  for (const key of ['ArrowUp', 'ArrowRight', 'ArrowUp', 'ArrowRight', 'ArrowUp']) {
    await world.page.keyboard.press(key);
  }
  await expect(date).not.toHaveValue('');
}

async function keyboardCreate(world) {
  await inventory.open(world);
  await activate(world, 'Añadir producto');
  await enterText(world, 'Nombre del producto', 'Producto de prueba de teclado');
  await enterDate(world, 'Fecha de caducidad');
  await enterText(world, 'Dónde está', 'Almacén de prueba');
  await activate(world, 'Guardar producto');
  await expect(world.page.getByRole('heading', { name: 'Inventario', exact: true })).toBeVisible();
  return (await inventory.api(world)).find(
    (lot) => lot.nombreProducto === 'Producto de prueba de teclado',
  );
}

async function keyboardCrud(world) {
  const lot = await keyboardCreate(world);
  assert.ok(lot);
  await activate(world, `Ver detalle de ${lot.nombreProducto}`);
  await expect(world.page.locator('.detail')).toBeVisible();
  await activate(world, 'Editar producto');
  await enterText(world, 'Nombre del producto', 'Producto actualizado con teclado');
  await activate(world, 'Guardar producto');
  await expect(world.page.getByRole('heading', { name: 'Inventario', exact: true })).toBeVisible();
  await activate(world, 'Eliminar partida de Producto actualizado con teclado');
  await expect(world.page.getByRole('dialog')).toBeVisible();
  await activate(world, 'Eliminar partida');
  await expect(world.page.getByRole('dialog')).toBeHidden();
  assert.ok(!(await inventory.api(world)).some((entry) => entry.id === lot.id));
}

async function keyboardDeliveryCreate(world) {
  await deliveries.open(world);
  await activate(world, 'Registrar entrega');
  await enterText(world, 'Identificador de familia', 'FAM-TECLADO');
  await enterDate(world, 'Fecha de entrega');
  await enterText(world, 'Observación (opcional)', 'Entrega de prueba de teclado');
  await activate(world, 'Guardar entrega');
  await expect(world.page.getByRole('heading', { name: 'Entregas', exact: true })).toBeVisible();
  await expect(world.page.getByText('Cargando entregas…', { exact: true })).toBeHidden();
  return (await deliveries.api(world)).find((entry) => entry.familiaId === 'FAM-TECLADO');
}

async function keyboardDeliveryCrud(world) {
  const delivery = await keyboardDeliveryCreate(world);
  assert.ok(delivery);
  const date = deliveries.label(delivery.fecha);
  await activate(world, `Ver detalle de la entrega de ${delivery.familiaId} del ${date}`);
  await expect(world.page.locator('.detail')).toBeVisible();
  await activate(world, 'Volver a las entregas');
  await activate(world, `Eliminar entrega de ${delivery.familiaId} del ${date}`);
  await expect(world.page.getByRole('dialog')).toBeVisible();
  await activate(world, 'Eliminar entrega');
  await expect(world.page.getByRole('dialog')).toBeHidden();
  assert.ok(!(await deliveries.api(world)).some((entry) => entry.id === delivery.id));
}

module.exports = { keyboardCrud, keyboardDeliveryCrud };
