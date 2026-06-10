# Solución de Conflicto de Lockfiles

## Problema
Next.js detectaba múltiples lockfiles en conflicto:
- `C:\Users\ADRIAN\package-lock.json` (npm)
- `C:\Users\ADRIAN\Desktop\TRABAJO\chamba\chamba\pnpm-lock.yaml` (pnpm)

## Solución Aplicada

### 1. Configuración de Next.js
Se creó `next.config.ts` con configuración de Turbopack:
```typescript
const nextConfig: NextConfig = {
  turbopack: {
    root: './',
  },
}
```

### 2. Configuración de pnpm
Se creó `.npmrc` para especificar configuración de pnpm:
```
shamefully-hoist=true
strict-peer-dependencies=false
auto-install-peers=true
```

## Pasos para Resolver en tu Máquina Local

1. **Eliminar lockfile conflictivo de npm**
   ```bash
   del C:\Users\ADRIAN\package-lock.json
   ```

2. **Eliminar node_modules globales si existen**
   ```bash
   rmdir /s /q C:\Users\ADRIAN\node_modules 2>nul
   ```

3. **Instalar dependencias con pnpm**
   ```bash
   cd C:\Users\ADRIAN\Desktop\TRABAJO\chamba\chamba
   pnpm install
   ```

4. **Verificar que solo existe pnpm-lock.yaml**
   ```bash
   dir pnpm-lock.yaml
   ```

5. **Iniciar el proyecto**
   ```bash
   pnpm run dev
   ```

## Verificación
- No debería haber advertencia sobre múltiples lockfiles
- Next.js debería iniciar en http://localhost:3000 sin warnings

## Nota Importante
Asegúrate de usar `pnpm` en lugar de `npm` o `yarn` para este proyecto.
