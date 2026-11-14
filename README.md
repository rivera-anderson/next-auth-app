# MyAuthApp — NextAuth.js con Google, GitHub y credenciales

Laboratorio de autenticación con **Next.js 16 (App Router)** y **NextAuth.js v4**.

## Funcionalidades

- Inicio de sesión con **Google** y **GitHub** (OAuth).
- Inicio de sesión con **email y contraseña** (`CredentialsProvider`).
- **Registro** de usuarios (`/register`) con contraseñas cifradas con **bcrypt** (10 rondas).
- **Bloqueo de cuenta** tras 5 intentos fallidos durante 15 minutos.
- Rutas protegidas (`/dashboard`, `/profile`) con `proxy.ts` (antes `middleware.ts`).
- Usuarios guardados en **Supabase** (Postgres).

## Tecnologías

Next.js 16 · React 19 · NextAuth.js 4 · Supabase · bcryptjs · Tailwind CSS 4

## Estructura

```
src/
├── app/
│   ├── api/auth/[...nextauth]/route.ts   # handler de NextAuth
│   ├── api/register/route.ts             # registro con bcrypt
│   ├── signIn/  register/  dashboard/  profile/
│   └── layout.tsx                        # navbar + SessionProvider
├── components/                           # AccessPass, LogoutButton, SessionProvider
├── lib/
│   ├── auth.ts                           # authOptions (proveedores, bloqueo, callbacks)
│   ├── supabase.ts                       # cliente de Supabase (solo servidor)
│   └── users.ts                          # consultas a la tabla users
├── types/next-auth.d.ts
└── proxy.ts                              # protección de rutas
supabase/schema.sql                       # tabla users
```

## Cómo ejecutarlo

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Copiar `.env.example` como `.env.local` y llenar las variables.
3. En Supabase, ejecutar `supabase/schema.sql` en el **SQL Editor**.
4. Configurar las URLs de callback de OAuth:
   - Google: `http://localhost:3000/api/auth/callback/google`
   - GitHub: `http://localhost:3000/api/auth/callback/github`
5. Iniciar el servidor:
   ```bash
   npm run dev
   ```
   y abrir http://localhost:3000

## Despliegue en Vercel

1. Importar el repositorio en Vercel.
2. Agregar todas las variables de `.env.example` en *Settings → Environment Variables*, con
   `NEXTAUTH_URL=https://<tu-app>.vercel.app`.
3. Agregar las callbacks de producción en Google y GitHub
   (`https://<tu-app>.vercel.app/api/auth/callback/google` y `.../github`).
