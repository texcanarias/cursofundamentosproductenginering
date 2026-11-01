const assert = require('node:assert/strict');
const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const deliveries = require('../support/deliveries.cjs');
const { inspect } = require('../support/accessibility.cjs');

When('recorro el listado, los formularios y las confirmaciones', async function () {
  const long = {
    ...deliveries.sample,
    observacion: 'Entrega de alimentos para compartir en equipo durante todo el mes',
  };
  await deliveries.seed(this, [long, deliveries.sample]);
  await this.page.setViewportSize({ width: 320, height: 900 });
  this.views = [];
  await inspectViews(this);
});

Then('los botones tienen un área interactiva de al menos 48 por 48 píxeles CSS', function () {
  assert.ok(
    this.views.every((view) =>
      view.buttons.every((button) => button.width >= 48 && button.height >= 48),
    ),
  );
});

async function inspectViews(world) {
  await deliveries.open(world);
  await inspect(world, 'list');
  await deliveries
    .article(world)
    .getByRole('button', { name: /Ver detalle/ })
    .click();
  await expect(world.page.locator('.detail')).toBeVisible();
  await inspect(world, 'detail');
  await world.page.getByRole('button', { name: 'Volver a las entregas' }).click();
  await expect(deliveries.article(world)).toBeVisible();
  await world.page.getByRole('button', { name: 'Registrar entrega', exact: true }).click();
  await inspect(world, 'create');
  await world.page.getByRole('button', { name: 'Cancelar', exact: true }).click();
  await expect(deliveries.article(world)).toBeVisible();
  const trigger = deliveries.article(world).getByRole('button', { name: /Eliminar entrega/ });
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
