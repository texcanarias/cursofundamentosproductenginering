const assert = require('node:assert/strict');
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const inventory = require('../support/inventory.cjs');
const sections = require('../support/sections.cjs');
const storage = require('../support/storage.cjs');
const visualization = require('../support/visualization.cjs');

async function applyTextScale(world, percent) {
  await world.page.evaluate((value) => {
    document.documentElement.style.fontSize = `${value}%`;
  }, percent);
}

async function tabToLabel(page, prefix) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    await page.keyboard.press('Tab');
    const label = await page.evaluate(
      () => document.activeElement?.getAttribute('aria-label') ?? '',
    );
    if (label.startsWith(prefix)) return label;
  }
  throw new Error(`No se alcanzó con el teclado el control ${prefix}`);
}

Given('que abro el inventario en un móvil', async function () {
  await visualization.openAt(this, 320);
});

Then('cada botón de ver, editar y eliminar mide al menos 48 por 48 píxeles', async function () {
  await visualization.expectTouchTargets(this);
});

Then('los botones tienen una separación que evita pulsaciones accidentales', async function () {
  await visualization.expectTouchTargets(this);
});

Then('cada botón tiene un nombre accesible', async function () {
  await visualization.expectTouchTargets(this);
});

Given('que amplío el texto al 200 por ciento', async function () {
  await visualization.setViewport(this, 320);
  await applyTextScale(this, 200);
  this.textScale = 200;
});

When('consulto el inventario o las entregas', async function () {
  await visualization.ensureSeed(this);
  await sections.open(this);
  await applyTextScale(this, this.textScale);
});

Then('todo el texto se lee sin cortarse', async function () {
  await visualization.expectNoOverflow(this);
});

Then('todas las acciones siguen visibles y utilizables', async function () {
  const layout = await visualization.metrics(this);
  assert.ok(layout.buttons.length > 0);
  assert.ok(layout.buttons.every((button) => button.width > 0 && button.height > 0));
});

Given('que navego con el teclado por el inventario', async function () {
  await visualization.openAt(this, 375);
});

When('recorro las tarjetas y sus acciones', async function () {
  await this.page.keyboard.press('Tab');
  await expect(this.page.locator(':focus')).toHaveText('Saltar al contenido');
  await this.page.keyboard.press('Enter');
  await expect(this.page.locator(':focus')).toHaveAttribute('id', 'main-content');
  this.focusedAction = await tabToLabel(this.page, 'Ver detalle');
});

Then('el orden del foco coincide con el orden visual', async function () {
  await visualization.expectFocusOrder(this);
});

Then('el foco se ve claramente en cada control', async function () {
  const outline = await this.page
    .locator(':focus')
    .evaluate((element) => getComputedStyle(element).outlineStyle);
  assert.notEqual(outline, 'none');
});

Then('puedo llegar al contenido con el enlace de salto', async function () {
  assert.ok(this.focusedAction);
  assert.equal(await this.page.evaluate(() => location.hash), '#main-content');
});

Given('que consulto el inventario en un móvil en vertical', async function () {
  await visualization.openAt(this, 375, 667);
});

When('giro el dispositivo a horizontal', async function () {
  const trigger = sections.article(this).getByRole('button', { name: /Ver detalle/ });
  await trigger.focus();
  this.focusedAction = await trigger.getAttribute('aria-label');
  await visualization.setViewport(this, 667, 375);
  await expect(trigger).toBeFocused();
});

Then('la información sigue completa y ordenada', async function () {
  await visualization.expectCardsComplete(this);
  await visualization.expectNoOverflow(this);
});

Then('no se pierde el foco ni el contenido visible', async function () {
  await expect(this.page.locator(':focus')).toHaveAttribute('aria-label', this.focusedAction);
  await expect(sections.article(this)).toBeInViewport();
});

Given('que abro la aplicación en un móvil', async function () {
  await visualization.setViewport(this, 320);
  await this.page.goto(this.frontendUrl);
  await expect(this.page.getByRole('heading', { name: 'Inventario', exact: true })).toBeVisible();
});

Then('veo el nombre {string} y su descriptor sin recortes', async function (name) {
  const info = await this.page.evaluate(() => {
    const nameElement = document.querySelector('.brand-name');
    const purpose = document.querySelector('.brand-purpose');
    const fits = (element) => element.scrollWidth <= element.clientWidth + 1;
    return {
      name: nameElement.textContent.trim(),
      purpose: purpose.textContent.trim(),
      fits: fits(nameElement) && fits(purpose),
    };
  });
  assert.equal(info.name, `${name} Gestión comunitaria`);
  assert.equal(info.purpose, 'Gestión comunitaria');
  assert.ok(info.fits, 'El nombre o el descriptor de marca se recortan');
});

Then('puedo acceder a Inventario y Entregas sin desplazamiento horizontal', async function () {
  await expect(this.page.getByRole('link', { name: 'Inventario' })).toBeVisible();
  await expect(this.page.getByRole('link', { name: 'Entregas' })).toBeVisible();
  await visualization.expectNoOverflow(this);
});

Then('la cabecera no tapa el contenido', async function () {
  const layout = await visualization.metrics(this);
  assert.ok(layout.header.bottom <= layout.main.top + 1);
});

Given('que abro el formulario de añadir producto en un móvil', async function () {
  await visualization.setViewport(this, 320);
  await inventory.open(this);
  await this.page.getByRole('button', { name: 'Añadir producto', exact: true }).click();
  await expect(
    this.page.getByRole('heading', { name: 'Añadir producto', exact: true }),
  ).toBeVisible();
});

Then('cada campo ocupa el ancho disponible y su etiqueta se lee completa', async function () {
  const info = await this.page.evaluate(() => {
    const form = document.querySelector('.lot-form');
    const fields = [...form.querySelectorAll('mat-form-field')];
    return {
      formWidth: form.getBoundingClientRect().width,
      fields: fields.map((field) => ({
        width: field.getBoundingClientRect().width,
        label: field.querySelector('mat-label')?.textContent.trim() ?? '',
        labelFits: (field.querySelector('mat-label')?.getBoundingClientRect().width ?? 0) > 0,
      })),
    };
  });
  assert.deepEqual(
    info.fields.map((field) => field.label),
    ['Nombre del producto', 'Fecha de caducidad', 'Dónde está'],
  );
  for (const field of info.fields) {
    assert.ok(field.width >= info.formWidth - 1, 'Un campo no ocupa el ancho disponible');
    assert.ok(field.labelFits, `La etiqueta ${field.label} se recorta`);
  }
});

async function readFormButtons(page) {
  return page.evaluate(() =>
    [...document.querySelectorAll('.form-actions button')].map((button) => {
      const box = button.getBoundingClientRect();
      return { label: button.textContent.trim(), top: box.top, right: box.right, width: box.width };
    }),
  );
}

Then('las acciones de guardar y cancelar se apilan sin salir de la pantalla', async function () {
  this.formButtons = await readFormButtons(this.page);
  assert.equal(this.formButtons.length, 2);
  assert.notEqual(this.formButtons[0].top, this.formButtons[1].top);
  for (const button of this.formButtons) {
    assert.ok(button.right <= 320 + 1, `${button.label} sale de la pantalla`);
  }
});

Then('todas las acciones se pueden pulsar con una sola mano', async function () {
  const viewport = await this.page.evaluate(() => document.documentElement.clientWidth);
  for (const button of this.formButtons) {
    assert.ok(button.width >= 48);
    assert.ok(button.right <= viewport + 1);
    assert.ok(button.top + 48 <= (await this.page.evaluate(() => window.innerHeight)));
  }
});

Given('que abro el inventario vacío en un móvil', async function () {
  await visualization.setViewport(this, 320);
  await sections.seed(this, []);
  await sections.open(this);
  await expect(this.page.locator('.empty-state')).toBeVisible();
});

When('no hay partidas o se produce un error de lectura', async function () {
  this.stateMessages = [];
  await captureState.call(this, this.page.locator('.empty-state'));
  await storage.corrupt(this);
  await this.page.reload();
  await expect(this.page.getByRole('heading', { name: 'Inventario', exact: true })).toBeVisible();
  await expect(this.page.getByText('Cargando inventario…', { exact: true })).toBeHidden();
  await captureState.call(this, this.page.getByRole('alert'));
});

Then('el mensaje se muestra completo y con un ancho legible', async function () {
  assert.equal(this.stateMessages.length, 2);
  for (const message of this.stateMessages) {
    assert.ok(message.width <= 320, 'El mensaje supera el ancho de la pantalla');
    assert.ok(message.text.length > 0);
  }
});

Then('la acción de reintentar o de añadir producto sigue visible', async function () {
  await expect(this.page.getByRole('button', { name: 'Reintentar' })).toBeVisible();
  await expect(
    this.page.getByRole('button', { name: 'Añadir producto', exact: true }),
  ).toBeVisible();
});

async function captureState(locator) {
  const box = await locator.boundingBox();
  const text = (await locator.textContent()).trim();
  this.stateMessages.push({ width: box.width, text });
}
