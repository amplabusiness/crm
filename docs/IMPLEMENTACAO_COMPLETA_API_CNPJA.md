# Implementação completa da API CNPJa no Organizador

Este guia consolida o que você precisa para integrar a CNPJa ao app (Flask + SQLite), incluindo cliente Python, mapeamentos de dados, alterações no banco, rotas de sincronização e dicas de uso.

## 1) Pré-requisitos
- Variáveis no `.env`:
  - CNPJA_API_KEY=... (ou `api_cnpja`, já suportado)
  - CNPJA_BASE_URL=https://api.cnpja.com (opcional)
- Dependências Python: `requests`
- Banco SQLite já configurado com WAL e busy_timeout (já no app)

## 2) Cliente Python
Arquivo: `cnpja_client.py`
- Métodos principais:
  - `company_full(cnpj)`: GET /office/{cnpj}
  - `simples(cnpj)`: GET /simples?taxId={cnpj}
- Helper `map_company_to_db(data)` retorna:
  - `empresa`: razao_social, cnpj, regime_tributario, telefone, email, endereco, status, cnae_principal, data_abertura, natureza_juridica, porte
  - `socios`: lista com nome, tipo_pessoa, cpf_cnpj, qualificacao, pais_origem, data_entrada

## 3) Alterações no Banco de Dados
- Tabela `empresas`: adicionar colunas (se não existirem)
  - `cnae_principal TEXT`
  - `data_abertura TEXT`
  - `natureza_juridica TEXT`
  - `porte TEXT`
  - `regime_tributario TEXT`
  - `telefone TEXT`
  - `email TEXT`
  - `endereco TEXT`
  - `status TEXT`
- Tabela `socios` (nova):
  - `id INTEGER PRIMARY KEY AUTOINCREMENT`
  - `empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE`
  - `nome TEXT`
  - `tipo_pessoa TEXT`
  - `cpf_cnpj TEXT`
  - `qualificacao TEXT`
  - `pais_origem TEXT`
  - `data_entrada TEXT`
  - `created_at TEXT DEFAULT (datetime('now'))`

Sugestão de migração (SQL idempotente):
```
ALTER TABLE empresas ADD COLUMN cnae_principal TEXT;
ALTER TABLE empresas ADD COLUMN data_abertura TEXT;
ALTER TABLE empresas ADD COLUMN natureza_juridica TEXT;
ALTER TABLE empresas ADD COLUMN porte TEXT;
ALTER TABLE empresas ADD COLUMN regime_tributario TEXT;
ALTER TABLE empresas ADD COLUMN telefone TEXT;
ALTER TABLE empresas ADD COLUMN email TEXT;
ALTER TABLE empresas ADD COLUMN endereco TEXT;
ALTER TABLE empresas ADD COLUMN status TEXT;

CREATE TABLE IF NOT EXISTS socios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  nome TEXT,
  tipo_pessoa TEXT,
  cpf_cnpj TEXT,
  qualificacao TEXT,
  pais_origem TEXT,
  data_entrada TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_socios_empresa_id ON socios(empresa_id);
```

## 4) Rotas de Sincronização (Flask)
- `POST /api/v1/cnpja/sincronizar/<cnpj>`
  - Busca `company_full`; faz upsert em `empresas` e substitui os `socios` da empresa pelo retorno atual.
- `POST /api/v1/cnpja/sincronizar/empresa/<id>`
  - Resolve CNPJ da empresa local e chama o fluxo acima.
- `POST /api/v1/cnpja/lote`
  - Body: `{ "cnpjs": ["..."] }`
  - Processa em background com retry/backoff (HTTP 429/5xx), loga sucessos e falhas.

Contrato de entrada/saída (resumo):
- Inputs: path param `cnpj` (somente dígitos), ou `id` (int); para lote, JSON com `cnpjs`.
- Outputs: JSON com status e resumos dos registros afetados.
- Erros: 400 (entrada inválida), 404 (empresa não encontrada), 502 (falha externa), 500 (erro interno).

## 5) Exemplo de Uso no Backend
```
from cnpja_client import CNPJaClient
client = CNPJaClient()
raw = client.company_full("12.345.678/0001-99")
normalized = client.map_company_to_db(raw)
# normalized["empresa"], normalized["socios"]
```

## 6) UI e Fluxo
- Página de Cliente: botão "Enriquecer via CNPJa"
  - Chama `POST /api/v1/cnpja/sincronizar/empresa/<id>`
- Lista de Sócios e Dados Cadastrais
  - Renderizar tabela `socios` e mostrar `empresa` com os novos campos
- Documentos vinculados
  - Exibir documentos com o mesmo CNPJ/CPF identificado

## 7) Boas Práticas e Limites
- Respeitar rate limits: aplicar backoff exponencial em 429 e 5xx
- Cache opcional (TTL curto) para reduzir chamadas repetidas
- Sanitizar CNPJ/CPF (somente dígitos) antes de chamadas e persistência
- Logs estruturados para auditoria

## 8) Testes rápidos
- CNPJ válido: garante upsert de `empresas` e preenchimento de `socios`
- CNPJ inválido: 400
- Falha 429/5xx: retry com backoff e relatório de erro coerente

## 9) Troubleshooting
- 401/403: verifique `CNPJA_API_KEY` (ou `api_cnpja`) no `.env`
- 5xx: aguarde e tente novamente; verifique backoff
- Locks no SQLite: use conexão dedicada por thread e mantenha commits curtos

---
Esse documento é um guia operacional para que a integração seja direta e consistente com o padrão já adotado no app.
