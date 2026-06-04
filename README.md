# Stencil - Backend

Este es el backend de **Stencil**, la API RESTful que alimenta la plataforma de tatuadores. Está diseñado para gestionar la autenticación de usuarios (Clientes y Artistas), perfiles, portafolios, citas, favoritos y reseñas.

El proyecto está construido con **Node.js**, **Express**, **TypeScript** y **Prisma ORM**, utilizando una base de datos **PostgreSQL**.

## Requisitos Previos

- [Node.js](https://nodejs.org/es/) (versión 18 o superior)
- npm o yarn
- Una base de datos PostgreSQL (puede ser local o usando servicios como Supabase/Neon)

## Variables de Entorno

Este proyecto requiere variables de entorno para funcionar. Hemos provisto un archivo llamado `.env.example` que contiene la estructura necesaria.

**Nunca subas el archivo `.env` real a GitHub.**

1. Copia el archivo `.env.example` y renómbralo a `.env`:
   ```bash
   cp .env.example .env
   ```
2. Llena los valores reales de tu base de datos y tus claves secretas en el nuevo archivo `.env`.

### Descripción de las variables (`.env`)

- `DATABASE_URL`: URL de conexión a tu base de datos PostgreSQL (usado por Prisma).
- `DIRECT_URL`: (Opcional/Supabase) URL directa a la base de datos para migraciones si usas connection pooling.
- `JWT_SECRET`: Cadena de texto secreta utilizada para firmar los tokens de autenticación.
- `JWT_EXPIRES_IN`: Tiempo de expiración del token (ej. `1h`, `7d`).
- `PORT`: Puerto en el que correrá el servidor localmente (por defecto `3000`).
- `SUPABASE_URL` / `SUPABASE_KEY`: Credenciales de Supabase si utilizas su servicio de Storage para imágenes.

## Setup y Ejecución Local

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Configura la base de datos (Migraciones de Prisma):
   ```bash
   npx prisma migrate dev
   ```
   *(Esto creará las tablas en tu base de datos basándose en el esquema de Prisma y generará el Prisma Client).*

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

El backend estará disponible por defecto en `http://localhost:3000`. Puedes probar la API apuntando a la ruta base `/api/v1`.

## Comandos Útiles

- `npm run dev`: Ejecuta el servidor en modo desarrollo usando `ts-node-dev`.
- `npm run build`: Compila el código TypeScript a JavaScript en la carpeta `dist`.
- `npm start`: Ejecuta el código ya compilado desde la carpeta `dist`.
- `npx prisma studio`: Abre una interfaz gráfica local para explorar y editar los datos de tu base de datos.
