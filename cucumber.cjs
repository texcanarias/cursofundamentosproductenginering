module.exports = {
  default: {
    paths: [
      'spec/001-entorno-desarrollo/*.feature',
      'spec/003-caducidad-localizacion-frontend/*.feature',
      'spec/004-identidad-marca/*.feature',
      'spec/006-registro-entregas-familias-frontend/*.feature',
      'spec/009-persistencia-navegador/*.feature',
      'spec/010-mejora-visualizacion-dispositivos/*.feature',
    ],
    require: ['e2e/steps/**/*.cjs'],
    format: ['progress'],
  },
};
