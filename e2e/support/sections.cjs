const inventory = require('./inventory.cjs');
const deliveries = require('./deliveries.cjs');
const storage = require('./storage.cjs');

function isDeliveries(world) {
  return world.section === 'deliveries';
}

function support(world) {
  return isDeliveries(world) ? deliveries : inventory;
}

function key(world) {
  return storage.key(world.section);
}

function sample(world) {
  return support(world).sample;
}

function second(world) {
  return support(world).second;
}

function records(world) {
  return isDeliveries(world) ? world.deliveries : world.lots;
}

async function api(world, method = 'GET', data, id = '') {
  return support(world).api(world, method, data, id);
}

async function seed(world, entries) {
  return support(world).seed(world, entries);
}

async function open(world) {
  return support(world).open(world);
}

function article(world, index) {
  return support(world).article(world, index);
}

function fill(world, data) {
  return support(world).fill(world, data);
}

async function startCreate(world, data) {
  return support(world).startCreate(world, data);
}

async function saved(world) {
  return support(world).saved(world);
}

function checkForm(world, data) {
  return support(world).checkForm(world, data);
}

function pick(world, record) {
  return support(world).pick(record);
}

async function read(world, section = world.section) {
  return storage.read(world, section);
}

async function write(world, entries, section = world.section) {
  return storage.write(world, entries, section);
}

async function clear(world, section = world.section) {
  return storage.clear(world, section);
}

async function corrupt(world, section = world.section) {
  return storage.corrupt(world, section);
}

async function failWrites(world, fail = true) {
  return storage.failWrites(world, fail);
}

async function allowWrites(world) {
  return storage.allowWrites(world);
}

function dateLabel(value) {
  return new Intl.DateTimeFormat('es', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00.000Z`));
}

module.exports = {
  isDeliveries,
  key,
  sample,
  second,
  records,
  api,
  seed,
  open,
  article,
  fill,
  startCreate,
  saved,
  checkForm,
  pick,
  read,
  write,
  clear,
  corrupt,
  failWrites,
  allowWrites,
  dateLabel,
};
