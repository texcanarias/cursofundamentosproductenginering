# A la par · Gestión comunitaria

Aplicación web para gestionar el inventario de productos y las entregas de ayuda alimentaria a
familias. El frontend está construido con Angular 22 y Angular Material, sigue un enfoque
mobile-first y accesible, y funciona como PWA.

La información se guarda **en el propio navegador** mediante `localStorage`, por lo que la
aplicación no necesita un servidor para funcionar. El backend Node.js/Express con persistencia CSV
se conserva en `back/` como pieza independiente y no lo usa el frontend.

## Requisitos

Node.js 24.15 o superior. Con nvm, ejecuta `nvm use` desde la raíz para activar la versión de
`.nvmrc`.

## Frontend

```bash
npm ci
npx playwright install chromium
npm start
```

La aplicación queda disponible en `http://localhost:4200`. Las rutas principales son:

| Ruta          | Contenido                    |
| ------------- | ---------------------------- |
| `/inventario` | Partidas de productos        |
| `/entregas`   | Entregas de ayuda a familias |

### Visualización en dispositivos

La interfaz prioriza móviles y tablets: las tarjetas se apilan en una columna, pasan a dos en
tablet y a tres en escritorio, sin desplazamiento horizontal. La caducidad se destaca con su estado
textual FEFO y la fecha de entrega aparece como dato principal. Las acciones mantienen zonas táctiles
de al menos 48 × 48 px. La especificación está en
[`spec/010-mejora-visualizacion-dispositivos/`](spec/010-mejora-visualizacion-dispositivos/).

### Persistencia en el navegador

| Clave               | Contenido                                      |
| ------------------- | ---------------------------------------------- |
| `a-la-par:lotes`    | Partidas con nombre, caducidad, ubicación e id |
| `a-la-par:entregas` | Entregas con familia, fecha, observación e id  |

- Una clave ausente equivale a una lista vacía.
- Los datos se conservan al recargar la página y se separan por tipo de registro.
- Si el navegador no puede leer o escribir, la interfaz muestra un error accesible y no confirma
  cambios que no se hayan guardado.
- Los datos pertenecen al navegador y al perfil de la persona que los creó. Limpiar los datos del
  sitio, cambiar de navegador o usar otro dispositivo elimina o separa esa información.

La especificación completa está en
[`spec/009-persistencia-navegador/`](spec/009-persistencia-navegador/).

## PWA

El build de producción genera el manifiesto y los archivos `ngsw.json`/`ngsw-worker.js`. El service
worker no se registra en desarrollo; para instalar la app, sirve el build sobre HTTPS o `localhost`.
Los iconos y el resto de activos de marca están en `public/brand/`.

## Backend opcional

El backend mantiene su propia API y persistencia CSV para desarrollo o experimentación:

```bash
cd back
npm ci
npm run dev
```

La API de salud está disponible en `http://localhost:3000/api/health`. Los datos locales van en
`back/data/`, ignorado por Git. El frontend no consume estos endpoints.

## Validaciones

Ejecuta estos comandos desde la raíz:

```bash
npm run lint
npm run format:check
npm test
npm run test:gherkin
npm run build
```

Las pruebas unitarias usan Vitest. Los escenarios Gherkin se ejecutan con Cucumber y Playwright
contra el frontend real, sembrando y verificando los datos en `localStorage`.

Validaciones opcionales del backend:

```bash
npm run lint:back
npm run test:back
npm run build:back
```

## Despliegue

Al guardar los datos en el navegador, el frontend puede publicarse como sitio estático. No se
necesitan reglas de proxy ni variables de entorno para que el CRUD funcione.

### Render

1. Crear un Static Site conectado al repositorio.
2. Build command: `npm run build`.
3. Publish directory: `dist/front/browser`.

### Vercel

1. Conectar el repositorio en [Vercel](https://vercel.com/dashboard).
2. Build command: `npm run build`.
3. Output directory: `dist/front/browser`.

El archivo `vercel.json` incluido conserva la función serverless opcional del backend; el frontend
no la utiliza. Si solo se publica la aplicación, el despliegue estático es suficiente.

## Estructura

| Tecnología | Ruta    | Descripción             |
| ---------- | ------- | ----------------------- |
| (raíz)     | `/`     | Frontend Angular        |
| Backend    | `back/` | Backend Node.js/CSV     |
| Specs      | `spec/` | Especificaciones        |
| E2E        | `e2e/`  | Pasos y soporte Gherkin |
