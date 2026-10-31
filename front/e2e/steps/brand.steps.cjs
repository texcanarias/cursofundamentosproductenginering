const assert = require('node:assert/strict');
const { Then, When } = require('@cucumber/cucumber');

Then('reconozco A la par en la cabecera y el título de la página', async function () {
  assert.equal(await this.page.title(), 'Inventario · A la par');
  assert.equal(
    await this.page.getByRole('link', { name: 'A la par Gestión comunitaria, inicio' }).count(),
    1,
  );
  const image = this.page.locator('.brand img');
  assert.equal(await image.getAttribute('alt'), '');
  assert.ok(await image.evaluate((element) => element.complete && element.naturalWidth > 0));
});

Then('la tipografía de lectura se carga desde la propia aplicación', async function () {
  await this.page.evaluate(() => document.fonts.ready);
  const loaded = await this.page.evaluate(() =>
    document.fonts.check('18px "Atkinson Hyperlegible"'),
  );
  assert.ok(loaded);
  assert.equal(await this.page.locator('link[href*="fonts.googleapis.com"]').count(), 0);
  const response = await this.page.request.get(
    new URL('/fonts/AtkinsonHyperlegible-Regular.ttf', this.page.url()).href,
  );
  assert.ok(response.ok());
});

When('uso una pantalla de {int} píxeles de ancho', async function (width) {
  await this.page.setViewportSize({ width, height: 900 });
});

When('amplío el texto al doble', async function () {
  await this.page.evaluate(() => {
    document.documentElement.style.fontSize = '225%';
  });
});

Then(
  'la cabecera no exige desplazamiento horizontal y el texto mide al menos 18 píxeles',
  async function () {
    const layout = await this.page.evaluate(() => ({
      fits: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      sizes: ['.brand-name', '.brand-purpose', '.brand-motto'].map((selector) =>
        parseFloat(getComputedStyle(document.querySelector(selector)).fontSize),
      ),
    }));
    assert.ok(layout.fits, 'La cabecera desborda la pantalla');
    assert.ok(layout.sizes.every((size) => size >= 18));
  },
);

When('salto al contenido utilizando el teclado', async function () {
  await this.page.keyboard.press('Tab');
  assert.equal(await this.page.locator(':focus').textContent(), 'Saltar al contenido');
  await this.page.keyboard.press('Enter');
});

Then('el foco está en la región principal', async function () {
  assert.equal(await this.page.locator(':focus').getAttribute('id'), 'main-content');
  const style = await this.page
    .locator(':focus')
    .evaluate((element) => getComputedStyle(element).outlineStyle);
  assert.notEqual(style, 'none');
});

Then('la paleta cumple estos contrastes mínimos', async function (table) {
  for (const { texto, fondo, minimo } of table.hashes()) {
    const colors = await this.page.evaluate(
      ({ texto, fondo }) => {
        const style = getComputedStyle(document.documentElement);
        return [style.getPropertyValue(texto).trim(), style.getPropertyValue(fondo).trim()];
      },
      { texto, fondo },
    );
    const ratio = contrastRatio(...colors);
    assert.ok(ratio >= Number(minimo), `${texto} / ${fondo}: ${ratio.toFixed(2)}:1`);
  }
});

Then('el manifiesto y los iconos instalables usan la identidad A la par', async function () {
  const response = await this.page.request.get(
    new URL('/manifest.webmanifest', this.page.url()).href,
  );
  const manifest = await response.json();
  assert.equal(manifest.short_name, 'A la par');
  assert.equal(manifest.theme_color, '#14634f');
  for (const icon of manifest.icons) {
    const asset = await this.page.request.get(new URL(`/${icon.src}`, this.page.url()).href);
    assert.ok(asset.ok());
    const bytes = await asset.body();
    assert.equal(bytes.subarray(1, 4).toString(), 'PNG');
    assert.equal(`${bytes.readUInt32BE(16)}x${bytes.readUInt32BE(20)}`, icon.sizes);
  }
});

function contrastRatio(foreground, background) {
  const values = [luminance(foreground), luminance(background)].sort(
    (first, second) => second - first,
  );
  return (values[0] + 0.05) / (values[1] + 0.05);
}

function luminance(hex) {
  const channels = [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255);
  const linear = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}
