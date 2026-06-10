# Frontend-Backend Integration Guide

Este documento proporciona instrucciones paso a paso para conectar el frontend de ProConnect con el backend Bun.js.

## Visión General

El frontend está diseñado para trabajar tanto con **datos mock** (desarrollo) como con **APIs reales** (producción). Todos los componentes pueden cambiar entre modo desarrollo y modo producción con simples cambios de configuración.

## 1. Configuración de Ambiente

### Variables de Entorno

Crear o actualizar `.env.local` en la raíz del proyecto:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_USE_MOCK_DATA=true

# Optional: Vercel/Production
NEXT_PUBLIC_API_URL_PROD=https://api.proconnect.app
```

## 2. API Client Setup

El archivo `lib/api.ts` contiene todos los endpoints necesarios organizados por funcionalidad:

### Módulos Disponibles

- **`auth`** - Login, Register, Refresh Token, Logout
- **`users`** - Get Profile, Update Profile, Upload Avatar
- **`professionals`** - Search, Get By ID, Get Top, Create, Update
- **`portfolio`** - Get Portfolio, Upload Photos, Delete Photos
- **`reviews`** - Get Reviews, Create Review, Get Stats
- **`messages`** - Get Conversations, Send Message, Mark as Read

### Ejemplo de Uso

```typescript
import { auth, professionals } from '@/lib/api'

// Login
const response = await auth.login({
  email: 'user@example.com',
  password: 'password123'
})

// Search Professionals
const results = await professionals.search({
  search: 'plumber',
  categories: ['Plumbing'],
  max_price: 1000,
  sort: 'rating',
  limit: 10
})
```

## 3. Custom Hooks para Consumir APIs

Ubicadas en `lib/hooks/use-professionals.ts`:

### useProfessionals()

```typescript
import { useProfessionals } from '@/lib/hooks/use-professionals'

function SearchComponent() {
  const { data, loading, error, refetch } = useProfessionals(
    { categories: ['Plumbing'], max_price: 1000 },
    { useMockData: true } // Set to false for real API
  )

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {data.map(pro => (
        <div key={pro.id}>{pro.name}</div>
      ))}
    </div>
  )
}
```

### useProfessional()

```typescript
import { useProfessional } from '@/lib/hooks/use-professionals'

function ProfileComponent({ proId }: { proId: string }) {
  const { data: professional, loading, error } = useProfessional(proId)

  if (loading) return <div>Loading...</div>

  return <div>{professional?.name}</div>
}
```

### useTopProfessionals()

```typescript
import { useTopProfessionals } from '@/lib/hooks/use-professionals'

function TopWorkersComponent() {
  const { data: topWorkers } = useTopProfessionals(10)

  return (
    <div>
      {topWorkers.map((pro, index) => (
        <div key={pro.id}>#{index + 1} {pro.name}</div>
      ))}
    </div>
  )
}
```

## 4. Componentes Integrados

### SearchPage (`components/pages/search-page.tsx`)

Actualmente usa datos mock. Para conectar con API:

```typescript
// Replace PROFESSIONALS with API hook
const { data: professionals, loading } = useProfessionals(params, {
  useMockData: false // Enable real API
})
```

### TopWorkersPage (`components/pages/top-workers-page.tsx`)

```typescript
// Use the custom hook
const { data: topWorkers, loading } = useTopProfessionals(10, false)
```

### ProCard (`components/pro-card.tsx`)

Ya integrado con `getProfessionalPortfolio()` para cargar fotos del backend:

```typescript
useEffect(() => {
  if (pro.id) {
    getProfessionalPortfolio(pro.id)
      .then(data => setPortfolio(data))
      .catch(() => {
        // Fallback to mock data
      })
  }
}, [pro.id])
```

## 5. Autenticación

### Login/Register Flow

```typescript
import { auth, setAuthToken, clearAuthToken } from '@/lib/api'

// Login
const response = await auth.login({
  email: 'user@example.com',
  password: 'password123'
})

// Store token
setAuthToken(response.access_token)

// Token se incluye automáticamente en futuras requests

// Logout
await auth.logout()
clearAuthToken()
```

### Verificar Autenticación

```typescript
import { isAuthenticated, getAuthToken } from '@/lib/api'

if (isAuthenticated()) {
  // User is logged in
  const token = getAuthToken()
}
```

### AuthProvider (Optional Enhancement)

El proyecto incluye `lib/auth-context.tsx` para gestionar estado global de autenticación. Para mejorar:

```typescript
// app/layout.tsx
import { AuthProvider } from '@/lib/auth-context'

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}
```

## 6. Migration Checklist

### Phase 1: Backend Setup
- [ ] PostgreSQL database setup con schema y seed data
- [ ] Bun backend corriendo en `http://localhost:3001`
- [ ] CORS configurado para `http://localhost:3000`
- [ ] JWT tokens funcionando

### Phase 2: API Integration
- [ ] Actualizar `.env.local` con `NEXT_PUBLIC_USE_MOCK_DATA=false`
- [ ] Reemplazar datos mock en SearchPage con `useProfessionals()`
- [ ] Conectar TopWorkersPage con `useTopProfessionals()`
- [ ] Probar login/register

### Phase 3: Advanced Features
- [ ] Implementar WebSocket para chat en tiempo real
- [ ] Agregar upload de fotos a portafolio
- [ ] Integrar sistema de notificaciones
- [ ] Agregar calificaciones y reseñas

## 7. Testing API Endpoints

Usando cURL o Postman:

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Search Professionals
curl http://localhost:3001/api/professionals?search=plumber&limit=10

# Get Professional by ID
curl http://localhost:3001/api/professionals/1

# Get Top Professionals
curl http://localhost:3001/api/professionals/top?limit=10
```

## 8. Environment-Specific Configuration

### Development (Mock Data)
```env
NEXT_PUBLIC_USE_MOCK_DATA=true
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Staging (Real API)
```env
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_API_URL=https://staging-api.proconnect.app
```

### Production
```env
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_API_URL=https://api.proconnect.app
```

## 9. Troubleshooting

### CORS Errors
Asegúrate de que el backend tiene CORS configurado:

```typescript
// backend/src/index.ts
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})
```

### Token Expiración
El cliente maneja refresh tokens automáticamente. Si recibe un 401:

```typescript
// lib/api.ts hace esto automáticamente
const refreshed = await auth.refreshToken(localStorage.getItem('refresh_token'))
setAuthToken(refreshed.access_token)
```

### Mock Data Testing
Para testing, puedes mantener mock data mientras desarrollas:

```typescript
const USE_MOCK = process.env.NODE_ENV === 'development'
const { data } = useProfessionals(params, { useMockData: USE_MOCK })
```

## 10. Next Steps

1. **Configurar Backend** - Seguir instrucciones en `backend/README.md`
2. **Conectar Base de Datos** - PostgreSQL con schema y seed data
3. **Iniciar Backend** - `cd backend && bun run src/index.ts`
4. **Actualizar Env Vars** - `NEXT_PUBLIC_USE_MOCK_DATA=false`
5. **Testear APIs** - Verificar endpoints con cURL/Postman
6. **Implementar Características** - Chat en vivo, notificaciones, pagos

---

**Última actualización**: Junio 2026  
**Versión**: 1.0
