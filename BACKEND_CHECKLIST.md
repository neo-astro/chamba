# ProConnect - Backend Setup Checklist

Este documento contiene todos los pasos necesarios para que el backend y frontend funcionen correctamente.

## ✅ Backend Files Created

- [x] `backend/.env` - Variables de entorno
- [x] `backend/src/index.ts` - Servidor Hono principal con todas las rutas
- [x] `backend/database/migrate.ts` - Migraciones y schema de BD
- [x] `backend/src/db.ts` - Pool de conexión PostgreSQL (ya existía)
- [x] `backend/src/jwt.ts` - Funciones JWT (ya existía)
- [x] `backend/src/middleware/auth.ts` - Middleware de autenticación (ya existía)

## ✅ Frontend Files Updated

- [x] `.env.local` - Variables de entorno del frontend
- [x] `components/pages/auth-page.tsx` - Actualizado para conectarse al backend
- [x] `lib/api.ts` - Cliente API con endpoints completos (ya existía)
- [x] `hooks/useAuth.ts` - Hook personalizado para autenticación

## ✅ Utilities & Documentation

- [x] `setup-backend.sh` - Script para setup del backend
- [x] `test-api.sh` - Script para testing de endpoints
- [x] `SETUP_GUIDE.md` - Guía completa de setup
- [x] Este documento

## 🚀 Pasos para Ejecutar

### 1. Preparar la Base de Datos

```bash
# Crear base de datos (si no existe)
createdb proconnect

# O si necesitas especificar user/password:
psql -U postgres -c "CREATE DATABASE proconnect;"
```

### 2. Configurar Variables de Entorno

**Backend (`backend/.env`):**
```env
DATABASE_URL=postgresql://localhost/proconnect
# O con usuario/contraseña:
# DATABASE_URL=postgresql://user:password@localhost:5432/proconnect

JWT_SECRET=dev-secret-key-12345  # Cambiar en producción
JWT_REFRESH_SECRET=dev-refresh-key-12345  # Cambiar en producción
PORT=3001
NODE_ENV=development
```

**Frontend (`.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Instalar Dependencias y Ejecutar Migraciones

```bash
cd backend
bun install
bun run db:migrate
```

### 4. Iniciar Backend (Terminal 1)

```bash
cd backend
bun run dev
```

Verificar que el servidor inicie correctamente:
```
[Server] Starting ProConnect backend on port 3001...
```

### 5. Iniciar Frontend (Terminal 2)

```bash
bun install
bun run dev
```

Verificar en: `http://localhost:3000`

## 🧪 Testing

### Verificar que el backend esté funcionando

```bash
curl http://localhost:3001/health
# Respuesta esperada: {"status":"ok","timestamp":"..."}
```

### Ejecutar test completo de API

```bash
bash test-api.sh
```

### Test manual de login en el navegador

1. Ir a `http://localhost:3000`
2. Click en "Registrarse"
3. Llenar el formulario con:
   - Email: `test@example.com`
   - Contraseña: `password123`
   - Nombre: `Test User`
   - Rol: `professional`
4. Click "Crear cuenta"
5. Verificar que se redirija al dashboard

## ⚠️ Problemas Comunes

### Error: "connect ECONNREFUSED 127.0.0.1:5432"
**Problema**: PostgreSQL no está corriendo
**Solución**:
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Windows
# Abre Services y busca "PostgreSQL", asegúrate que esté running
```

### Error: "database 'proconnect' does not exist"
**Problema**: Base de datos no creada
**Solución**:
```bash
createdb proconnect
```

### Error: "CORS policy: No 'Access-Control-Allow-Origin' header"
**Problema**: Frontend y backend no están configurados correctamente
**Verificar**:
- Frontend: `NEXT_PUBLIC_API_URL=http://localhost:3001`
- Backend: `app.use('*', cors({...}))`

### Error: "Invalid token" al hacer login
**Problema**: JWT_SECRET es diferente entre peticiones
**Verificar**:
- `backend/.env` tiene los valores correctos
- Backend se reinició después de cambiar `.env`

### Error: "Invalid credentials" al hacer login
**Problema**: Usuario no existe o contraseña incorrecta
**Verificar**:
- Usuario fue creado correctamente (check en DB)
- Contraseña es correcta
- Backend está devolviendo tokens en respuesta

## 📊 Verificar Base de Datos

```bash
# Conectar a la BD
psql proconnect

# Ver tablas creadas
\dt

# Ver usuarios
SELECT * FROM users;

# Ver profesionales
SELECT * FROM professionals;

# Salir
\q
```

## 🔐 Seguridad (IMPORTANTE para Producción)

**NUNCA** usar estos valores en producción:
- `JWT_SECRET=dev-secret-key-12345`
- `JWT_REFRESH_SECRET=dev-refresh-key-12345`

Generar claves seguras:
```bash
openssl rand -base64 32
```

## 📦 Estructura de Respuesta de API

### Login/Register Success
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "full_name": "Test User",
    "role": "professional"
  }
}
```

### Error Response
```json
{
  "error": "Email already registered"
}
```

## 🔄 Flujo de Autenticación

1. **Register**: Usuario llena formulario → Backend crea usuario y retorna tokens
2. **Login**: Usuario ingresa credenciales → Backend verifica y retorna tokens
3. **Requests Autenticados**: Frontend envía `Authorization: Bearer <token>`
4. **Token Expira**: Frontend usa `refresh_token` para obtener nuevo `access_token`
5. **Logout**: Frontend limpia tokens del localStorage

## 📝 Próximos Pasos

- [ ] Configurar variables de entorno de producción
- [ ] Deployar a Vercel (frontend)
- [ ] Deployar a Railway/Heroku (backend)
- [ ] Configurar dominio personalizado
- [ ] Implementar email verification
- [ ] Agregar 2FA
- [ ] Rate limiting en API
- [ ] Logging y monitoring

## 📞 Contacto / Soporte

Si encuentras problemas:
1. Verifica esta checklist
2. Revisa los logs del backend y frontend
3. Verifica que las URLs sean correctas
4. Verifica que los puertos estén disponibles (3000, 3001)

---

**Última actualización**: Junio 10, 2026
**Status**: ✅ Backend listo para testing
