const assert = require('node:assert/strict');
const { expect } = require('@playwright/test');
const inventory = require('./inventory.cjs');
const deliveries = require('./deliveries.cjs');
const sections = require('./sections.cjs');
const storage = require('./storage.cjs');

const LONG_TEXT =
  'Arroz integral de grano largo para compartir en equipo durante todo el mes, con envase reutilizable';
const LONG_PLACE = 'Almacén principal, estantería del fondo, balda superior derecha';

function dateOffset(days) {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

async function setViewport(world, width, height = 900) {
  await world.page.setViewportSize({ width, height });
}

async function seedLong(world) {
  if (sections.isDeliveries(world)) {
    const long = { ...deliveries.sample, familiaId: 'FAM-2026-0001', observacion: LONG_TEXT };
    await deliveries.seed(world, [long, deliveries.sample]);
    return;
  }
  const long = { ...inventory.sample, nombreProducto: LONG_TEXT, ubicacion: LONG_PLACE };
  await inventory.seed(world, [long, inventory.sample]);
}

async function ensureSeed(world) {
  const records = await storage.read(world, world.section);
  if (records.length > 0) return;
  await sections.seed(world);
}

async function openAt(world, width, height = 900, seed = true) {
  await setViewport(world, width, height);
  if (seed) await ensureSeed(world);
  await sections.open(world);
}

async function metrics(world) {
  return world.page.evaluate(() => {
    const rect = (element) => {
      const box = element.getBoundingClientRect();
      return {
        left: box.left,
        right: box.right,
        top: box.top,
        bottom: box.bottom,
        width: box.width,
        height: box.height,
      };
    };
    const documentRoot = document.documentElement;
    const list = document.querySelector('.data-list');
    const main = document.querySelector('main');
    const header = document.querySelector('header');
    const focusable = [...document.querySelectorAll('.data-item [role="group"] button')];
    return {
      fits: documentRoot.scrollWidth <= documentRoot.clientWidth + 1,
      viewport: { width: documentRoot.clientWidth, height: documentRoot.clientHeight },
      columns: list
        ? getComputedStyle(list).gridTemplateColumns.split(/\s+/).filter(Boolean).length
        : 0,
      main: main ? rect(main) : null,
      header: header ? rect(header) : null,
      cards: [...document.querySelectorAll('.data-item')].map(rect),
      buttons: [...document.querySelectorAll('.data-item button')].map((element) => ({
        ...rect(element),
        label: element.getAttribute('aria-label') || element.textContent.trim(),
      })),
      focusOrder: focusable.map((element) => ({
        ...rect(element),
        label: element.getAttribute('aria-label') || element.textContent.trim(),
      })),
      overflow: [...document.querySelectorAll('.data-title, .data-field dt, .data-field dd')]
        .filter((element) => element.scrollWidth > element.clientWidth + 1)
        .map((element) => element.textContent.trim()),
    };
  });
}

async function expectNoOverflow(world) {
  const layout = await metrics(world);
  assert.ok(layout.fits, 'La página exige desplazamiento horizontal');
  assert.deepEqual(layout.overflow, [], 'Hay texto recortado o desbordado');
  for (const card of layout.cards) {
    assert.ok(card.left >= 0, 'Una tarjeta empieza fuera de la pantalla');
    assert.ok(card.right <= layout.viewport.width + 1, 'Una tarjeta termina fuera de la pantalla');
  }
  return layout;
}

async function expectCardsComplete(world) {
  const records = sections.records(world);
  const articles = world.page.locator('.data-item');
  await expect(articles).toHaveCount(records.length);
  for (const [index, record] of records.entries()) {
    const article = sections.article(world, index);
    if (sections.isDeliveries(world)) {
      await expect(article).toContainText(record.familiaId);
      await expect(article).toContainText(record.observacion);
      await expect(article.locator('time')).toHaveAttribute('datetime', record.fecha);
    } else {
      await expect(article).toContainText(record.nombreProducto);
      await expect(article).toContainText(record.ubicacion);
      await expect(article.locator('time')).toHaveAttribute('datetime', record.caducidad);
    }
  }
}

async function expectActions(world) {
  for (const article of await world.page.locator('.data-item').all()) {
    await expect(article.getByRole('button').first()).toBeVisible();
    const group = article.getByRole('group');
    await expect(group).toHaveCount(1);
    assert.ok((await group.getAttribute('aria-label')).length > 0);
  }
}

function gapsOverlap(first, second) {
  const vertical = Math.min(first.bottom, second.bottom) - Math.max(first.top, second.top);
  const horizontal = Math.min(first.right, second.right) - Math.max(first.left, second.left);
  return vertical > 0 && horizontal > 0;
}

async function expectTouchTargets(world) {
  const layout = await metrics(world);
  for (const button of layout.buttons) {
    assert.ok(button.width >= 48 && button.height >= 48, `${button.label} mide menos de 48 px`);
    assert.ok(button.label.length > 0, 'Un botón carece de nombre accesible');
  }
  for (let index = 0; index < layout.buttons.length; index += 1) {
    for (let other = index + 1; other < layout.buttons.length; other += 1) {
      const first = layout.buttons[index];
      const second = layout.buttons[other];
      if (!gapsOverlap(first, second)) continue;
      const horizontal = Math.max(first.left, second.left) - Math.min(first.right, second.right);
      const vertical = Math.max(first.top, second.top) - Math.min(first.bottom, second.bottom);
      assert.ok(Math.max(horizontal, vertical) >= 8, 'Dos botones están demasiado juntos');
    }
  }
}

async function expectFocusOrder(world) {
  const layout = await metrics(world);
  const visual = [...layout.focusOrder].sort(
    (first, second) => first.top - second.top || first.left - second.left,
  );
  assert.deepEqual(
    layout.focusOrder.map((button) => button.label),
    visual.map((button) => button.label),
  );
}

module.exports = {
  LONG_TEXT,
  LONG_PLACE,
  dateOffset,
  setViewport,
  seedLong,
  ensureSeed,
  openAt,
  metrics,
  expectNoOverflow,
  expectCardsComplete,
  expectActions,
  expectTouchTargets,
  expectFocusOrder,
};
