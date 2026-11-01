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

## Despliegue en Render

### Archivo de configuración automática: `render.yaml`

El repositorio incluye un archivo `render.yaml` (Render Blueprint) en la raíz que define automáticamente los servicios, variables de entorno y rutas de proxy. Al conectar el repositorio en Render, el dashboard detecta este archivo y configura ambos servicios sin intervención manual.

### Backend (Node service)

1. Crear un nuevo Web Service en Render conectado al repositorio.
2. Configurar las variables de entorno:
   - `PORT`: Render lo asigna automáticamente.
   - `LOTES_CSV_PATH`: `/opt/render/project/src/back/data/lotes.csv` (o ruta absoluta al CSV).
   - `ENTREGAS_CSV_PATH`: `/opt/render/project/src/back/data/entregas.csv`.
   - `NODE_ENV`: `production`.
3. Build command: `npm --prefix back run build`
4. Start command: `npm --prefix back run start`
5. El health check responde en `/api/health`.

### Frontend (Static Site)

1. Crear un nuevo Static Site en Render.
2. Build command: `npm --prefix front run build`
3. Publish directory: `front/dist/front/browser`
4. Configurar el proxy hacia el backend en el dashboard de Render (redirigir `/api/*` a la URL del backend).
5. El frontend incluye un Service Worker (PWA) que se activa automáticamente sobre HTTPS.

### Variables de entorno requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor (Render lo asigna) | `3000` |
| `LOTES_CSV_PATH` | Ruta al CSV de inventario | `back/data/lotes.csv` |
| `ENTREGAS_CSV_PATH` | Ruta al CSV de entregas | `back/data/entregas.csv` |
| `NODE_ENV` | Entorno de ejecución | `production` |

### Notas

- Los archivos CSV en `back/data/` están en `.gitignore`; se crean automáticamente en el primer arranque si no existen (directorio y archivos vacíos).
- El backend usa `process.env['PORT'] ?? 3000` para respetar el puerto asignado por Render.
- El frontend compila a `front/dist/front/browser/` y Render sirve esa carpeta estáticamente.
