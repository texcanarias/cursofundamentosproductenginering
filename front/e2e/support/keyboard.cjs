const assert = require('node:assert/strict');
const { expect } = require('@playwright/test');
const { api, open } = require('./inventory.cjs');

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

async function keyboardCreate(world) {
  await open(world);
  await activate(world, 'Añadir producto');
  await enterText(world, 'Nombre del producto', 'Producto de prueba de teclado');
  const date = world.page.getByLabel('Fecha de caducidad', { exact: true });
  await focusByKeyboard(world.page, date);
  for (const key of ['ArrowUp', 'ArrowRight', 'ArrowUp', 'ArrowRight', 'ArrowUp']) {
    await world.page.keyboard.press(key);
  }
  await expect(date).not.toHaveValue('');
  await enterText(world, 'Dónde está', 'Almacén de prueba');
  await activate(world, 'Guardar producto');
  await expect(world.page.getByRole('heading', { name: 'Inventario', exact: true })).toBeVisible();
  return (await api(world)).find((lot) => lot.nombreProducto === 'Producto de prueba de teclado');
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
  assert.ok(!(await api(world)).some((entry) => entry.id === lot.id));
}

module.exports = { keyboardCrud };
