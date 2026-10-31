const assert = require('node:assert/strict');
const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const { sample, seed, open, article } = require('../support/inventory.cjs');
const { keyboardCrud } = require('../support/keyboard.cjs');

When('recorro el inventario, los formularios y las confirmaciones', async function () {
  const long = {
    ...sample,
    nombreProducto: 'Arroz integral de grano largo para compartir en equipo',
    ubicacion: 'Almacén principal, estantería del fondo, balda superior derecha',
  };
  await seed(this, [long, sample]);
  await this.page.setViewportSize({ width: 320, height: 900 });
  this.views = [];
  await inspectViews(this);
});

Then('puedo completar el CRUD usando únicamente el teclado', async function () {
  await keyboardCrud(this);
});

Then('los campos tienen etiquetas y los controles tienen nombres accesibles', function () {
  assert.deepEqual(
    this.views.flatMap((view) => view.violations),
    [],
  );
});

Then('el foco es visible y se gestiona al abrir y cerrar las confirmaciones', async function () {
  assert.ok(this.dialogFocus);
  const outline = await this.page
    .locator(':focus')
    .evaluate((element) => getComputedStyle(element).outlineStyle);
  assert.notEqual(outline, 'none');
});

Then('los botones tienen un área interactiva de al menos 44 por 44 píxeles CSS', function () {
  assert.ok(
    this.views.every((view) =>
      view.buttons.every((button) => button.width >= 48 && button.height >= 48),
    ),
  );
});

Then('el texto tiene un tamaño mínimo de 16 píxeles CSS', function () {
  assert.ok(this.views.every((view) => view.sizes.every((size) => size >= 16)));
});

Then(
  'en una pantalla de 320 píxeles CSS de ancho no se ocultan datos ni acciones ni se exige desplazamiento horizontal',
  function () {
    assert.ok(this.views.every((view) => view.fits));
  },
);

async function inspectViews(world) {
  await open(world);
  await inspect(world, 'list');
  for (const action of ['Ver detalle', 'Editar']) {
    await article(world)
      .getByRole('button', { name: new RegExp(action) })
      .click();
    await expect(world.page.getByText('Cargando inventario…', { exact: true })).toBeHidden();
    await inspect(world, action);
    await world.page.getByRole('button', { name: 'Volver al inventario' }).click();
    await expect(article(world)).toBeVisible();
  }
  const trigger = article(world).getByRole('button', { name: /Eliminar/ });
  await trigger.click();
  await expect(world.page.getByRole('dialog')).toBeVisible();
  await expect(
    world.page.getByRole('dialog').getByRole('button', { name: 'Cancelar' }),
  ).toBeFocused();
  world.dialogFocus = await world.page
    .getByRole('dialog')
    .evaluate((element) => element.contains(document.activeElement));
  await inspect(world, 'dialog');
  await world.page.getByRole('dialog').getByRole('button', { name: 'Cancelar' }).click();
  await expect(trigger).toBeFocused();
}

async function inspect(world, name) {
  await world.page.evaluate(() => document.fonts.ready);
  await world.page.evaluate(() =>
    Promise.all(
      document.getAnimations().map((animation) => animation.finished.catch(() => undefined)),
    ),
  );
  const result = await new AxeBuilder({ page: world.page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  const layout = await world.page.evaluate(() => {
    const visible = (element) =>
      element.getBoundingClientRect().width > 0 && !element.closest('[aria-hidden="true"]');
    return {
      fits: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      buttons: [...document.querySelectorAll('button')].filter(visible).map((element) => ({
        width: element.getBoundingClientRect().width,
        height: element.getBoundingClientRect().height,
      })),
      sizes: [...document.querySelectorAll('h1,h2,dt,dd,input,.mdc-button__label')]
        .filter(visible)
        .map((element) => parseFloat(getComputedStyle(element).fontSize)),
    };
  });
  world.views.push({
    name,
    ...layout,
    violations: result.violations.map((violation) => ({
      name,
      id: violation.id,
      nodes: violation.nodes.map((node) => node.target),
    })),
  });
}
