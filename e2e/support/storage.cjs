const KEYS = {
  inventory: 'a-la-par:lotes',
  deliveries: 'a-la-par:entregas',
};

function key(section) {
  return section === 'deliveries' ? KEYS.deliveries : KEYS.inventory;
}

async function read(world, section = world.section) {
  return world.page.evaluate((storageKey) => {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : [];
  }, key(section));
}

async function write(world, records, section = world.section) {
  await world.page.evaluate(
    ({ storageKey, value }) => localStorage.setItem(storageKey, JSON.stringify(value)),
    { storageKey: key(section), value: records },
  );
}

async function raw(world, value, section = world.section) {
  await world.page.evaluate(
    ({ storageKey, content }) => localStorage.setItem(storageKey, content),
    { storageKey: key(section), content: value },
  );
}

async function clear(world, section = world.section) {
  await world.page.evaluate((storageKey) => localStorage.removeItem(storageKey), key(section));
}

async function corrupt(world, section = world.section) {
  await raw(world, '{invalid', section);
}

async function failWrites(world, fail = true) {
  await world.page.evaluate((value) => {
    window.__failStorageWrites = value;
  }, fail);
}

async function allowWrites(world) {
  await failWrites(world, false);
}

module.exports = {
  KEYS,
  key,
  read,
  write,
  raw,
  clear,
  corrupt,
  failWrites,
  allowWrites,
};
