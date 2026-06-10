## Solución: Base de Datos No Existe

**Error:** `error: no existe la base de datos "proconnect"`

### Causa
PostgreSQL no tiene creada la base de datos "proconnect" que especifica tu `DATABASE_URL`.

### Solución Rápida

#### Opción 1: Usar el nuevo script `db:setup` (RECOMENDADO)
```bash
cd backend
bun run db:setup
```

Este comando:
1. ✅ Crea la base de datos "proconnect" si no existe
2. ✅ Ejecuta todas las migraciones automáticamente

#### Opción 2: Paso a paso
```bash
cd backend

# Paso 1: Crear la base de datos
bun run db:create

# Paso 2: Ejecutar migraciones
bun run db:migrate
```

#### Opción 3: Manual con psql (si prefieres)
```bash
# Crear la base de datos
psql -U user -c "CREATE DATABASE proconnect;"

# Verificar que existe
psql -U user -l | grep proconnect

# Luego ejecutar migraciones
cd backend
bun run db:migrate
```

### Verificación

Para confirmar que la BD está creada:
```bash
psql -U user -l
```

Deberías ver "proconnect" en la lista.

### Cambios Realizados

1. **Nuevo archivo:** `backend/database/create-db.ts`
   - Script que crea la BD si no existe
   - Se conecta al servidor postgres predeterminado
   - Verifica antes de crear para evitar errores

2. **Actualizado:** `backend/package.json`
   - Nuevo script: `db:create` - Solo crea la BD
   - Nuevo script: `db:setup` - Crea BD + ejecuta migraciones
   - Mantiene script: `db:migrate` - Solo migraciones

### Notas Importantes

- El usuario de PostgreSQL es `user` y contraseña es `password` (según tu `.env`)
- El host es `localhost` en puerto `5432`
- Si tienes credenciales diferentes, actualiza `backend/database/create-db.ts`

### Próximos Pasos

Después de ejecutar `bun run db:setup`:

```bash
# Terminal 1 - Backend
cd backend
bun run dev

# Terminal 2 - Frontend (en otra terminal)
cd /ruta/del/proyecto
bun run dev
```

¡Listo! Tu backend debería estar funcionando en `http://localhost:3001`
