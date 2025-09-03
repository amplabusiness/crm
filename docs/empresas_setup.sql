-- Criação idempotente da tabela empresas + RLS + políticas + reload do schema
create table if not exists public.empresas (
  id bigserial primary key,
  cnpj text unique not null,
  created_at timestamptz default now()
);

alter table public.empresas enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='empresas' and policyname='empresas_select_all'
  ) then
    create policy "empresas_select_all" on public.empresas for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='empresas' and policyname='empresas_insert_anon'
  ) then
    create policy "empresas_insert_anon" on public.empresas for insert with check (true);
  end if;
end $$;

-- Atualiza cache do PostgREST
select pg_notify('pgrst','reload schema');
