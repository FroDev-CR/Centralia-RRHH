# Centralia Personas — RRHH y Nómina (multi-empresa)

RRHH y Nómina para Costa Rica, parte de la suite Centralia (ChatBot · POS · Marcaje · Personas).
Aplicación **Next.js** con autenticación **Clerk** (patrón/admin), base de datos **MongoDB**
multi-tenant, y **portal de empleados** con login propio.

## Cómo funciona el multi-tenant

- El **patrón/admin** se registra/inicia sesión con **Clerk**. En su primer ingreso se crea
  automáticamente su **empresa (tenant)** con un **código único** (ej. `ABC123`).
- El admin administra su empresa en **`/dashboard`**: empleados, vacaciones, solicitudes,
  ausencias, nómina (CCSS), aguinaldo, liquidaciones, reportes y ajustes.
- El admin da a cada empleado un **usuario + contraseña** y le comparte el **código de empresa**.
- El **empleado** entra en **`/portal/login`** con `código de empresa + usuario + contraseña`
  (no usa Clerk; usa una sesión propia con cookie firmada). Puede ver su saldo de vacaciones,
  sus colillas y **crear solicitudes**. Los roles **Supervisor** (su sucursal) y **RRHH**
  (toda la empresa) además **aprueban/rechazan** solicitudes de su equipo.

Todos los datos están aislados por `companyId`; ninguna empresa ve datos de otra.

## Estructura

```
app/
  page.js                      # Landing (botón "Iniciar sesión")
  sign-in / sign-up            # Clerk
  dashboard/page.js            # Panel del patrón (Server) -> <DashboardApp/>
  portal/login                 # Login del empleado
  portal/page.js               # Portal del empleado (Server) -> <PortalApp/>
  api/                         # Route handlers (CRUD por tenant + auth de empleados)
components/
  DashboardApp.js              # Panel admin (cliente)
  PortalApp.js                 # Portal empleado (cliente)
lib/
  mongodb.js  company.js  apiAuth.js  employeeAuth.js  serialize.js  calc.js
middleware.js                  # Clerk protege /dashboard y las APIs del admin
legacy/                        # App estática anterior (referencia)
docs/                          # Roadmap, propuesta, pitch
```

## Variables de entorno

Copiá `.env.example` a `.env.local` (ya está creado con tus credenciales) y en **Vercel**
configurá las mismas variables (Project → Settings → Environment Variables):

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | tu `pk_test_...` |
| `CLERK_SECRET_KEY` | tu `sk_test_...` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | `/dashboard` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | `/dashboard` |
| `MONGODB_URI` | tu connection string de Atlas |
| `MONGODB_DB` | `centralia_personas` |
| `EMPLOYEE_JWT_SECRET` | secreto de 32+ bytes (está en tu `.env.local`) |

> `.env.local` está en `.gitignore` y **no se sube**. Copiá sus valores a Vercel a mano.
> Para ver tu `EMPLOYEE_JWT_SECRET`: abrí `.env.local`.

## Desarrollo local

```bash
npm install
npm run dev   # http://localhost:3000
```

## Despliegue en Vercel (arregla el 404)

El 404 era porque el repo servía HTML estático desde una subcarpeta. Ahora es una app Next.js
en la **raíz** del repo.

1. **MongoDB Atlas → Network Access:** agregá `0.0.0.0/0` (las funciones de Vercel usan IPs
   dinámicas) para que el servidor pueda conectarse.
2. **Vercel → Project → Settings → General → Root Directory:** dejalo en la raíz (vacío / `./`).
   Si antes apuntaba a una subcarpeta, corregilo.
3. **Vercel → Settings → Environment Variables:** cargá todas las variables de arriba.
4. Framework Preset: **Next.js** (se detecta solo).
5. `git add . && git commit -m "Centralia Personas: app Next.js (Clerk + MongoDB multi-tenant)" && git push`
   Vercel despliega automáticamente.

Después del deploy: la landing queda en `/`, el panel del patrón en `/dashboard` y el portal
del empleado en `/portal/login`.

## Notas legales

Las cifras regulatorias (CCSS obrero 10,67% / patrono 26,67% en 2025; vacaciones 14 días/año;
cesantía con tope de 8 años; aguinaldo ciclo dic–nov) son **referencia 2025-2026** y deben
validarse con asesoría laboral costarricense antes de usarse en producción.

---
Hecho en Costa Rica · Centralia.
