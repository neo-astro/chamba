# Solución: Eliminar conflicto pnpm vs npm

## Problema
El proyecto tenía conflictos entre múltiples lockfiles (pnpm-lock.yaml y package-lock.json), causando que Next.js no pudiera iniciar correctamente.

## Solución Implementada
He eliminado:
- `pnpm-lock.yaml` (lockfile de pnpm)
- `.npmrc` (configuración de pnpm)

El proyecto ahora usa **npm** estándar.

## Pasos para arreglarlo en tu máquina

### 1. Elimina los archivos locales conflictivos
```bash
# En PowerShell (Windows):
del C:\Users\ADRIAN\package-lock.json

# Opcionalmente, limpia la caché de npm:
npm cache clean --force
```

### 2. Asegúrate de estar en el directorio correcto
```bash
cd C:\Users\ADRIAN\Desktop\TRABAJO\chamba\chamba
```

### 3. Reinstala las dependencias
```bash
# Elimina node_modules existentes (opcional pero recomendado)
rmdir /s /q node_modules

# Instala con npm
npm install
```

### 4. Inicia el proyecto
```bash
npm run dev
```

## ¿Qué cambió?
- Proyecto ahora usa **npm** (no pnpm)
- Usar `npm` en lugar de `pnpm` para todos los comandos
- Compatible con npm estándar

## Comandos útiles
```bash
npm run dev      # Inicia desarrollo
npm run build    # Build para producción
npm run start    # Inicia servidor de producción
npm test         # Ejecuta tests (si están configurados)
```

Si aún tienes problemas, asegúrate de:
1. Tener Node.js y npm instalados globalmente
2. Eliminar completamente el `node_modules` y reinstalar
3. Limpiar la caché de npm con `npm cache clean --force`
