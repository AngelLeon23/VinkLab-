-- VinkLab · Esquema de base de datos (pegar completo en Supabase > SQL Editor > Run)

create extension if not exists pgcrypto;
create extension if not exists vector;  -- pgvector: listo para búsquedas vectoriales a futuro

create table if not exists usuarios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text not null unique,
  rol text not null check (rol in ('creador','empresa')),
  created_at timestamptz not null default now()
);

create table if not exists proyectos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references usuarios(id) on delete cascade,
  titulo text not null,
  area text not null,
  descripcion text not null,
  impacto text,
  presupuesto numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists campanas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references usuarios(id) on delete cascade,
  titulo text not null,
  area text not null,
  descripcion text not null,
  requisitos text,
  monto numeric not null default 0,
  fecha_cierre date,
  created_at timestamptz not null default now()
);

create table if not exists postulaciones (
  id uuid primary key default gen_random_uuid(),
  proyecto_id uuid not null references proyectos(id) on delete cascade,
  campana_id uuid not null references campanas(id) on delete cascade,
  compatibilidad int not null default 0,
  created_at timestamptz not null default now(),
  unique (proyecto_id, campana_id)
);

create index if not exists proyectos_area_idx on proyectos(area);
create index if not exists campanas_area_idx on campanas(area);

-- Seguridad (RLS): cualquiera puede LEER; solo el servidor (service role) puede ESCRIBIR.
alter table usuarios enable row level security;
alter table proyectos enable row level security;
alter table campanas enable row level security;
alter table postulaciones enable row level security;

drop policy if exists "lectura publica usuarios" on usuarios;
drop policy if exists "lectura publica proyectos" on proyectos;
drop policy if exists "lectura publica campanas" on campanas;
drop policy if exists "lectura publica postulaciones" on postulaciones;

create policy "lectura publica usuarios" on usuarios for select using (true);
create policy "lectura publica proyectos" on proyectos for select using (true);
create policy "lectura publica campanas" on campanas for select using (true);
create policy "lectura publica postulaciones" on postulaciones for select using (true);
