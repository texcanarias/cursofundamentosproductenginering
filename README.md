# Entorno de desarrollo

Frontend Angular 22 y backend Node.js/TypeScript en paquetes independientes. El backend usa Express y persiste registros CSV mediante un adaptador de infraestructura.

## Requisitos

Node.js 24.15 o superior. Con nvm, ejecuta `nvm use` desde la raíz para activar la versión de `.nvmrc`.

## Frontend

```bash
cd front
npm ci
npx playwright install chromium
npm start
```

Angular Material está configurado. Las llamadas `/api/*` se reenvían al backend local en el puerto 3000.

## PWA

El build de producción genera el manifiesto y los archivos `ngsw.json`/`ngsw-worker.js`. El service worker no se registra en desarrollo; para instalar la app, sirve el build sobre HTTPS o `localhost`. Los iconos actuales son placeholders de Angular y deben sustituirse por la identidad visual del producto antes de publicar.

## Backend

```bash
cd back
npm ci
npm run dev
```

La API de salud está disponible en `http://localhost:3000/api/health`. Los datos locales van en `back/data/`, ignorado por Git.

## Validaciones

Ejecuta estos comandos desde la raíz, en terminales separadas si ambos servidores están activos:

```bash
npm --prefix front run lint
npm --prefix front test
npm --prefix front run test:gherkin
npm --prefix back run lint
npm --prefix back run test
npm --prefix back run build
```
