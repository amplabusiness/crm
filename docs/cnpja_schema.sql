-- Empresas base já existe: public.empresas(cnpj)
-- Tabelas normalizadas + raw para cadastro completo

create table if not exists public.empresas_info (
  cnpj text primary key references public.empresas(cnpj) on delete cascade,
  razao_social text,
  nome_fantasia text,
  natureza_juridica text,
  cnae_principal text,
  cnae_principal_desc text,
  abertura date,
  situacao text,
  capital_social numeric,
  porte text
);

create table if not exists public.empresas_endereco (
  cnpj text primary key references public.empresas(cnpj) on delete cascade,
  cep text, uf text, municipio text, bairro text, logradouro text, numero text, complemento text
);

create table if not exists public.empresas_simples (
  cnpj text primary key references public.empresas(cnpj) on delete cascade,
  optante boolean, desde date,
  mei_optante boolean, mei_desde date
);

create table if not exists public.empresas_cnaes_sec (
  id bigserial primary key,
  cnpj text references public.empresas(cnpj) on delete cascade,
  cnae text,
  descricao text
);

create table if not exists public.empresas_socios (
  id bigserial primary key,
  cnpj text references public.empresas(cnpj) on delete cascade,
  socio_doc text,
  socio_nome text,
  tipo text,
  qualificacao text,
  pais text,
  entrada date
);

create table if not exists public.empresas_relacoes (
  id bigserial primary key,
  from_cnpj text references public.empresas(cnpj) on delete cascade,
  to_cnpj text,
  relacao text,
  grau int
);

create table if not exists public.empresas_raw (
  cnpj text primary key references public.empresas(cnpj) on delete cascade,
  payload jsonb not null,
  updated_at timestamptz default now()
);

-- RLS (leitura pública, escrita opcional para anon em dev)
alter table public.empresas_info enable row level security;
alter table public.empresas_endereco enable row level security;
alter table public.empresas_simples enable row level security;
alter table public.empresas_cnaes_sec enable row level security;
alter table public.empresas_socios enable row level security;
alter table public.empresas_relacoes enable row level security;
alter table public.empresas_raw enable row level security;

create policy if not exists emp_info_select_all on public.empresas_info for select using (true);
create policy if not exists emp_end_select_all on public.empresas_endereco for select using (true);
create policy if not exists emp_simples_select_all on public.empresas_simples for select using (true);
create policy if not exists emp_cnaes_select_all on public.empresas_cnaes_sec for select using (true);
create policy if not exists emp_socios_select_all on public.empresas_socios for select using (true);
create policy if not exists emp_rel_select_all on public.empresas_relacoes for select using (true);
create policy if not exists emp_raw_select_all on public.empresas_raw for select using (true);

create policy if not exists emp_info_insert_any on public.empresas_info for insert with check (true);
create policy if not exists emp_end_insert_any on public.empresas_endereco for insert with check (true);
create policy if not exists emp_simples_insert_any on public.empresas_simples for insert with check (true);
create policy if not exists emp_cnaes_insert_any on public.empresas_cnaes_sec for insert with check (true);
create policy if not exists emp_socios_insert_any on public.empresas_socios for insert with check (true);
create policy if not exists emp_rel_insert_any on public.empresas_relacoes for insert with check (true);
create policy if not exists emp_raw_insert_any on public.empresas_raw for insert with check (true);

-- Atualiza cache REST
select pg_notify('pgrst','reload schema');
