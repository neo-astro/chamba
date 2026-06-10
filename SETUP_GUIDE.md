# ProConnect - Full Stack Application

Una plataforma para conectar clientes con profesionales de diversos oficios. Frontend con Next.js 16 y backend con Hono + PostgreSQL.

## Arquitectura

### Frontend (Next.js 16)
- **Framework**: Next.js 16 con App Router
- **Styling**: Tailwind CSS + Design Tokens
- **UI Components**: shadcn/ui
- **Location**: `/` (raíz del proyecto)

### Backend (Hono + Bun)
- **Framework**: Hono 4.0
- **Runtime**: Bun
- **Database**: PostgreSQL
- **Auth**: JWT (Access Token + Refresh Token)
- **Location**: `/backend`

## Requisitos Previos

- **Node.js/Bun**: 20+ o Bun 1.0+
- **PostgreSQL**: 14+
- **npm/pnpm/bun**: Gestor de paquetes

## Setup Inicial

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd chamba
```

### 2. Configurar variables de entorno

**Frontend (`.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Backend (`backend/.env`):**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/proconnect
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
PORT=3001
NODE_ENV=development
```

### 3. Crear base de datos PostgreSQL
```bash
createdb proconnect
```

### 4. Instalar y ejecutar migraciones del backend
```bash
cd backend
bun install
bun run db:migrate
```

### 5. Iniciar el servidor backend
```bash
cd backend
bun run dev
```
El backend estará disponible en `http://localhost:3001`

### 6. En otra terminal, iniciar el frontend
```bash
bun install
bun run dev
```
El frontend estará disponible en `http://localhost:3000`

## Estructura del Proyecto

```
chamba/
├── app/                          # Next.js app router
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/                   # Componentes React reutilizables
│   ├── pages/                   # Páginas principales
│   ├── ui/                      # Componentes UI base
│   └── ...
├── lib/                         # Utilidades y funciones
│   ├── api.ts                   # Cliente API para backend
│   └── ...
├── backend/                     # Servidor Hono
│   ├── src/
│   │   ├── index.ts            # Servidor principal
│   │   ├── db.ts               # Pool de conexión PostgreSQL
│   │   ├── jwt.ts              # Funciones JWT
│   │   └── middleware/
│   │       └── auth.ts         # Middleware de autenticación
│   ├── database/
│   │   └── migrate.ts          # Migraciones y schema
│   ├── .env                    # Variables de entorno (NO incluir en git)
│   └── package.json
├── public/                      # Archivos estáticos
├── package.json
├── next.config.ts
├── tsconfig.json
└── tailwind.config.ts
```

## Endpoints de API

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/refresh` - Renovar token de acceso
- `POST /api/auth/logout` - Cerrar sesión

### Usuarios
- `GET /api/users/profile` - Obtener perfil del usuario (requiere auth)
- `PATCH /api/users/profile` - Actualizar perfil (requiere auth)

### Profesionales
- `GET /api/professionals` - Buscar profesionales (con filtros)
- `GET /api/professionals/:id` - Obtener detalles de un profesional
- `POST /api/professionals` - Crear perfil profesional (requiere auth)
- `PATCH /api/professionals/:id` - Actualizar perfil profesional (requiere auth)

### Portfolio
- `GET /api/professionals/:id/portfolio` - Obtener portfolio de un profesional
- `POST /api/professionals/:id/portfolio` - Agregar foto al portfolio (requiere auth)
- `DELETE /api/professionals/:id/portfolio/:photoId` - Eliminar foto (requiere auth)

### Reseñas
- `GET /api/professionals/:id/reviews` - Obtener reseñas de un profesional
- `GET /api/professionals/:id/rating-stats` - Obtener estadísticas de calificación
- `POST /api/reviews` - Crear reseña (requiere auth)

### Mensajes
- `GET /api/messages/conversations` - Obtener conversaciones (requiere auth)
- `GET /api/messages/conversation/:userId` - Obtener mensajes con un usuario (requiere auth)
- `POST /api/messages` - Enviar mensaje (requiere auth)
- `PATCH /api/messages/:id/read` - Marcar mensaje como leído (requiere auth)

## Desarrollo

### Frontend
```bash
# Iniciar en desarrollo con hot reload
bun run dev

# Build para producción
bun run build

# Iniciar servidor de producción
bun run start

# Lint
bun run lint
```

### Backend
```bash
# Iniciar en desarrollo con hot reload
cd backend
bun run dev

# Build
bun run build

# Iniciar en producción
bun run start

# Correr migraciones
bun run db:migrate
```

## Autenticación

El sistema de autenticación utiliza JWT con dos tokens:

1. **Access Token**: Válido por 1 hora, se usa para autenticar requests
2. **Refresh Token**: Válido por 7 días, se usa para obtener nuevos access tokens

### Flujo de autenticación
1. Usuario se registra o inicia sesión
2. Backend retorna `access_token` y `refresh_token`
3. Frontend guarda tokens en `localStorage`
4. Para cada request autenticado, se envía el `access_token` en header `Authorization: Bearer <token>`
5. Si el token expira, se usa el `refresh_token` para obtener uno nuevo

## Variables de Entorno

### Frontend
| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | URL del backend API | `http://localhost:3001` |

### Backend
| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | Conexión PostgreSQL | `postgresql://user:pass@localhost:5432/proconnect` |
| `JWT_SECRET` | Clave secreta para JWT | (generar con `openssl rand -base64 32`) |
| `JWT_REFRESH_SECRET` | Clave secreta para refresh tokens | (generar con `openssl rand -base64 32`) |
| `PORT` | Puerto del servidor | `3001` |
| `NODE_ENV` | Ambiente | `development` o `production` |

## Deploy

### Frontend (Vercel)
```bash
# El frontend está configurado para deployarse automáticamente en Vercel
# Asegúrate de tener NEXT_PUBLIC_API_URL configurado en las variables de entorno
```

### Backend (Railway/Heroku/Digital Ocean)
```bash
# Asegúrate de:
# 1. Tener PostgreSQL en la nube
# 2. Configurar todas las variables de entorno
# 3. Ejecutar migraciones en la BD de producción
# 4. Deployar usando Bun runtime
```

## Troubleshooting

### Error: "Can't find PostgreSQL"
- Instala PostgreSQL: https://www.postgresql.org/download/
- Verifica que el servicio esté corriendo

### Error: "ECONNREFUSED 127.0.0.1:5432"
- Verifica que PostgreSQL esté corriendo
- Verifica `DATABASE_URL` en `.env`

### Error: "Invalid token"
- Verifica que `JWT_SECRET` sea la misma en backend
- Borra tokens del localStorage y vuelve a iniciar sesión

### Error CORS
- Verifica que `NEXT_PUBLIC_API_URL` sea correcto
- Verifica que el backend tenga CORS habilitado para el origen del frontend

## Contribuir

1. Crea una rama para tu feature: `git checkout -b feature/nueva-feature`
2. Haz commit de tus cambios: `git commit -am 'Agregar nueva feature'`
3. Push a la rama: `git push origin feature/nueva-feature`
4. Abre un Pull Request

## Licencia

MIT

## Contacto

Para más información o preguntas, contacta al equipo de desarrollo.
