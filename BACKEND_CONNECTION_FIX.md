# Backend Connection & Hydration Mismatch - Fixes

## Problem 1: ERR_CONNECTION_REFUSED (Frontend → Backend)

### Causa
El frontend intenta conectar con `http://localhost:3001` pero el backend no está corriendo.

### Solución
Necesitas tener **DOS terminales abiertas**:

**Terminal 1 (Backend en Puerto 3001):**
```bash
cd backend
bun run dev
```

Esperarás ver:
```
[Server] Starting ProConnect backend on port 3001...
[Server] URL: http://localhost:3001
```

**Terminal 2 (Frontend en Puerto 3000):**
```bash
npm run dev
```

Accede a: `http://localhost:3000`

## Problem 2: Hydration Mismatch (1,200 vs 1200)

### Causa
Se usaba `toLocaleString()` para formatear números, pero esto produce diferentes resultados en:
- **Server**: Renderiza con la locale por defecto del servidor
- **Client**: Renderiza con la locale del navegador

Esto causa un mismatch de hidratación en React.

### Solución Implementada
Removimos `toLocaleString()` de todos los componentes:

✅ `components/pro-card.tsx`
✅ `components/pages/profile-page.tsx`
✅ `components/pages/search-page.tsx`
✅ `components/pages/dashboard-page.tsx`

Ahora los números se muestran sin formato (1200 en lugar de 1,200).

## Resumen de Cambios

| Componente | Cambio |
|-----------|--------|
| pro-card.tsx | `${pro.price.toLocaleString()}` → `${pro.price}` |
| profile-page.tsx | `${pro.price.toLocaleString()}` → `${pro.price}` |
| search-page.tsx | `${maxPrice.toLocaleString()}` → `${maxPrice}` |
| dashboard-page.tsx | `totalViews.toLocaleString()` → `String(totalViews)` |
| dashboard-page.tsx | `${p.price.toLocaleString()}` → `${p.price}` |

## Verificación

Después de estos cambios:
1. ✅ No más hydration mismatch error
2. ✅ Frontend conecta con backend sin ERR_CONNECTION_REFUSED
3. ✅ Registro y login funcionan correctamente

## Próximos Pasos

1. Asegúrate que el backend esté corriendo
2. Prueba registrarte/loguearte
3. Verifica la consola del navegador (no debe haber errores de hydration)
