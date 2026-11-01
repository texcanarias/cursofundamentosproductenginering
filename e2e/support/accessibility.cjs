const AxeBuilder = require('@axe-core/playwright').default;

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

module.exports = { inspect };
