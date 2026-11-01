const inventory = require('./inventory.cjs');
const deliveries = require('./deliveries.cjs');

function isDeliveries(world) {
  return world.section === 'deliveries';
}

function support(world) {
  return isDeliveries(world) ? deliveries : inventory;
}

function apiPath(world) {
  return isDeliveries(world) ? '/api/entregas' : '/api/lotes';
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

async function api(world) {
  return support(world).api(world);
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

function writes(world) {
  return world.requests.filter(
    (request) =>
      ['POST', 'PUT', 'DELETE'].includes(request.method) && request.url.includes(apiPath(world)),
  );
}

function checkForm(world, data) {
  return support(world).checkForm(world, data);
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
  apiPath,
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
  writes,
  checkForm,
  dateLabel,
};
