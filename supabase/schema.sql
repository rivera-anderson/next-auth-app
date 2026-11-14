-- Ejecutar en Supabase: SQL Editor -> New query -> Run
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password text not null,           -- hash de bcrypt
  failed_attempts integer not null default 0,
  lock_until timestamptz,
  created_at timestamptz not null default now()
);

-- RLS activado y sin políticas: nadie puede leer la tabla desde el navegador.
-- El servidor de Next usa la secret key (sb_secret_...), que salta RLS.
alter table public.users enable row level security;

-- Refresca la caché de la API para que vea la tabla nueva al instante
notify pgrst, 'reload schema';
