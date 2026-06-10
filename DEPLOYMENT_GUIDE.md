# 🚀 ProConnect - Deployment Guide

Guía para deployar ProConnect a producción.

## 📋 Pre-Deployment Checklist

- [ ] Tests pasando localmente
- [ ] Frontend y backend corriendo sin errores
- [ ] Variables de entorno seguras generadas
- [ ] Base de datos de producción creada
- [ ] Backups configurados
- [ ] SSL/TLS certificados listos
- [ ] Dominios configurados

---

## 🌐 Frontend - Vercel Deployment

### 1. Conectar Repositorio
```bash
# Tu repo debe estar en GitHub
git push origin main
```

### 2. Vercel Setup
```bash
# Instalar Vercel CLI (opcional)
npm i -g vercel

# Deploy
vercel
```

### 3. Configurar Variables de Entorno en Vercel

En Vercel Dashboard → Project Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://api.tudominio.com
```

### 4. Build Settings
- **Framework**: Next.js
- **Build Command**: `npm run build` (o `bun run build`)
- **Output Directory**: `.next`
- **Install Command**: `npm install` (o `bun install`)

---

## 🔧 Backend - Railway/Heroku Deployment

### Opción 1: Railway

#### 1. Conectar GitHub
1. Ir a railway.app
2. Click "Deploy from GitHub"
3. Seleccionar repositorio

#### 2. Configurar Variables
En Railway Dashboard → Environment:

```
DATABASE_URL=postgresql://user:pass@db.railway.internal:5432/proconnect
JWT_SECRET=<generar con openssl rand -base64 32>
JWT_REFRESH_SECRET=<generar con openssl rand -base64 32>
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://tudominio.com
```

#### 3. Database Setup
1. Click "Add Database" → PostgreSQL
2. Railway lo configura automáticamente
3. La `DATABASE_URL` se agrega automáticamente

#### 4. Deploy
Railway deployará automáticamente cuando hagas push a main.

### Opción 2: Heroku

#### 1. Instalar Heroku CLI
```bash
brew tap heroku/brew && brew install heroku
heroku login
```

#### 2. Crear aplicación
```bash
heroku create proconnect-api
```

#### 3. Agregar PostgreSQL
```bash
heroku addons:create heroku-postgresql:standard-0 -a proconnect-api
```

#### 4. Configurar variables
```bash
heroku config:set JWT_SECRET="<generar con openssl rand -base64 32>" -a proconnect-api
heroku config:set JWT_REFRESH_SECRET="<generar con openssl rand -base64 32>" -a proconnect-api
heroku config:set NODE_ENV=production -a proconnect-api
heroku config:set FRONTEND_URL=https://tudominio.com -a proconnect-api
```

#### 5. Deploy
```bash
# Crear git remote
git remote add heroku https://git.heroku.com/proconnect-api.git

# Deploy
git push heroku main
```

#### 6. Ejecutar migraciones
```bash
heroku run "cd backend && bun run db:migrate" -a proconnect-api
```

---

## 🔒 Generar Claves Seguras

```bash
# JWT_SECRET
openssl rand -base64 32
# Output: ejemplo2Fk9kD8xL4pM2vN7qR0sT4uV9wX1yZ3aB5cD7eF9...

# JWT_REFRESH_SECRET
openssl rand -base64 32
# Output: ejemplo9wX1yZ3aB5cD7eF9gH2iJ4kL6mN8oP0qR2sT4uV...
```

---

## 📊 Configuración de Dominios

### Frontend (Vercel)

1. Ir a Vercel Dashboard → Project → Settings → Domains
2. Agregar dominio personalizado
3. Configurar registros DNS:
   - `CNAME: cname.vercel-dns.com`
   - `TXT: (verification record)`

### Backend

**Con Railway:**
1. Railway asigna URL automática
2. Usarlo directamente o configurar dominio personalizado

**Con Heroku:**
1. Heroku asigna URL: `proconnect-api.herokuapp.com`
2. Para dominio personalizado:
   - Agregar CNAME en DNS: `proconnect-api.herokuapp.com`

---

## 🔗 Actualizar URLs

Una vez deployado, actualizar:

1. **Frontend `.env` en Vercel**:
   ```
   NEXT_PUBLIC_API_URL=https://api.tudominio.com
   ```

2. **Backend `.env`**:
   ```
   FRONTEND_URL=https://tudominio.com
   ```

3. **CORS en Backend** (`backend/src/index.ts`):
   ```typescript
   app.use(
     '*',
     cors({
       origin: ['https://tudominio.com', process.env.FRONTEND_URL],
       // ...
     })
   )
   ```

---

## 📈 Monitoreo y Logs

### Railway
- Dashboard → Deployments → View Logs
- Real-time logs visible

### Heroku
```bash
heroku logs -a proconnect-api -f
```

### Vercel
- Dashboard → Deployments → Logs

---

## 🔄 CI/CD Pipeline

### GitHub Actions para Auto-Deploy

Crear `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy Frontend
        run: |
          npm install -g vercel
          vercel deploy --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
      
      - name: Deploy Backend
        run: |
          git push heroku main
        env:
          HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}
```

---

## 🛡️ Security Best Practices

1. **Secrets Management**
   - Nunca commitear `.env` files
   - Usar secrets en CI/CD
   - Rotary secrets regularmente

2. **HTTPS Obligatorio**
   - Vercel tiene HTTPS automático
   - Railway/Heroku también incluyen HTTPS

3. **Rate Limiting**
   - Implementar en producción
   - Usar middleware como `hono/rate-limit`

4. **Logging y Monitoring**
   - Usar Sentry o similar
   - Monitorear errors y performance

5. **Database Backups**
   - Railway: Automático
   - Heroku: Configurar backups automáticos
   - Hacer backups manuales regularmente

---

## 🆘 Troubleshooting Deployment

### Error: "DATABASE_URL not found"
```bash
# Verificar que la variable esté configurada
heroku config -a proconnect-api
# o en Railway Dashboard → Environment
```

### Error: "Migration failed"
```bash
# Conectar a BD de producción y verificar
heroku pg:psql -a proconnect-api
SELECT * FROM users;
```

### Error: "CORS failed"
1. Verificar FRONTEND_URL en backend
2. Verificar que CORS incluya el dominio correcto
3. Reiniciar backend después de cambios

### Error: "Token invalid"
1. Verificar JWT_SECRET es igual en todos los deploys
2. No cambiar JWT_SECRET en medio de uso (invalidaría tokens)
3. Si necesitas cambiar: esperar a que expiren los tokens

---

## 📝 Post-Deployment Checklist

- [ ] Frontend accesible y sin errores de console
- [ ] Backend health check funciona (`/health`)
- [ ] Login/Register funciona end-to-end
- [ ] Búsqueda de profesionales funciona
- [ ] Mensajes entre usuarios funciona
- [ ] Portfolio uploads funciona
- [ ] SSL certificado válido
- [ ] Logs se guardan correctamente
- [ ] Database backups configurados
- [ ] Monitoring activo

---

## 🔄 Rollback Plan

Si algo sale mal:

### Frontend (Vercel)
1. Ir a Dashboard → Deployments
2. Click el deployment anterior
3. Click "Promote to Production"

### Backend (Railway/Heroku)
1. Revert el último commit
2. Push nuevamente
3. Verificar logs

---

## 📞 Support URLs

Post-Deployment:
- **Sitio**: https://tudominio.com
- **API**: https://api.tudominio.com
- **Status**: Crear página de status (statuspage.io)
- **Admin**: Crear dashboard de admin

---

## 💰 Costos Estimados (por mes)

- **Vercel Frontend**: Free o $20+ (según traffic)
- **Railway Backend**: $7 (Postgres) + $12+ (Backend)
- **Dominio**: ~$12/año
- **Total mínimo**: ~$20/mes

---

**Última actualización**: Junio 10, 2026
**Version**: 1.0.0
