# 🎯 Objetivo
Orquestrar **agentes de IA** (em Python, operados via VSCode/Copilot/Cursor) para: (1) **classificar** automaticamente documentos fiscais/contábeis/societários/DP; (2) **extrair** dados-chave com confiabilidade; (3) **normalizar** em um **esquema canônico JSON**; (4) **vincular** documentos relacionados (ex.: DAS pago ↔ PGDAS da competência); (5) **arquivar** em estrutura determinística de pastas; (6) **popular o dashboard** com **métricas sofisticadas** (carga efetiva, segregação, RBT12, status de certidões, parcelamentos, eventos societários etc.).

> **Contexto**: utilizar base existente (Flask + SQLite + páginas `documentos.html`/dashboard) com fila/background-worker, integração **CNPJa** e **OpenAI** (modelo sugerido `gpt-5-mini-preview`), OneDrive/SMB para ingestão.

---

## 🧩 Arquitetura Lógica de Agentes

**A1. Orquestrador**
Recebe o arquivo + contexto (empresa/CNPJ/IE/IM, origem, caminhos), cria um **Job** e invoca os agentes abaixo; aplica *routing* por tipo e fallback/retentativas.

**A2. Classificador**
Detecta o **`doc_type`** (taxonomia abaixo) + **competência** + **sensibilidade LGPD** + confiabilidade. Se `confidence < 0,70` → `status_processamento = REVISAR`.

**A3. Extratores Específicos (per doc_type)**
Plugins independentes: `extract_pgdas.py`, `extract_darf.py`, `extract_dare_go.py`, `extract_gnre.py`, `extract_nfse.py`, `extract_certidoes.py`, `extract_societario.py`, `extract_parcelamento.py`, `extract_balanco_dre.py`, `extract_sped.py` etc. Cada plugin retorna **JSON canônico**.

**A4. Normalizador**
Converte a saída de cada extrator para o **Esquema Canônico** (seções por domínio). Realiza sanidade (datas, valores, CNPJ válido, CEP, códigos de receita).

**A5. Reconciliador (linking)**
Concilia **pagamentos** ↔ **obrigações** (ex.: DAS/PIS/COFINS/ICMS/ISS): acha *match* por (CNPJ, competência, código/receita, valor ≈, janela de venc./pagamento). Cria `document_links` e atualiza indicadores.

**A6. Enriquecedor**
Consulta **CNPJa** (dados cadastrais, CNAE, inscrições) e completa metadados (regime, município/UF, sócios). Preferir identificadores (CNPJ/IE/IM) ao nome.

**A7. Validador/Auditor**
Aplica regras de consistência (ex.: `pgdas.valor_total ≈ das_pago`, `validade_certidao >= hoje`, `alteração_societária` coerente com timeline). Gera `alerts`.

**A8. Indexador/Arquivador**
Move arquivo de `uploads/pending/` para `ORGANIZED_FOLDER/<CNPJ>/<ANO>/<MES>/<CATEGORIA>/...` segundo `doc_type`/competência. Registra `caminho_final` e guarda `hash_conteudo`.

**A9. Explicador**
Gera resumos objetivos para UI (tooltips/modais), sem expor raciocínio interno. Apenas **resultado** + **fontes/text anchors**.

---

## 🗂️ Taxonomia de Documentos (`doc_type`)

- **FISCAL_DECL**
  - `PGDAS_D` (DAS/Simples)
  - `DCTF`, `PERDCOMP`, `DEFIS`, `SPED_EFD_ICMS_IPI`, `SPED_EFD_CONTRIB` (texto/SPED)
- **FISCAL_GUIA_PAGTO**
  - `DAS` (PGDAS), `DARF`, `DARE_GO`, `GNRE`, `GPS`, `GRF/GRRF`, `GARE`, `GDF`
- **FISCAL_DOC`**
  - `NFSE`, `NFE`, `CTE`, `MDFe`
- **SOCIETARIO**
  - `CONTRATO_SOCIAL`, `ALTERACAO_CONTRATUAL`, `ATA`, `NIRE/JUCEG` doc
- **CERTIDAO**
  - `RFB_CONJUNTA`, `CNDT_TRABALHISTA`, `FGTS_CRF`, `SEFAZ_GO_CND`, `MUNICIPAL_GOIANIA_CND`, `MUNICIPAL_APARECIDA_CND`
- **PARCELAMENTO**
  - `ECAC_RFB`, `SEFAZ_GO`, `MUNICIPAL`
- **CONTABIL`**
  - `BALANCO_PATRIMONIAL`, `DRE`, `ECD`, `ECF`, `RELATORIO_AUDITORIA`
- **DP**
  - `ESOCIAL_EVENTO`, `GFIP/SEFIP`, `ASO`, `HOLERITE`
- **IDENTIDADE/OUTROS (LGPD Alto)**
  - `RG`, `CNH`, `CPF_DOC`, `COMPROVANTE_ENDERECO`, `PROCURAÇÃO`, `CONTRATO_TERCEIROS`

> **Nota**: `doc_type` é granular: `FISCAL_DECL.PGDAS_D`, `FISCAL_GUIA_PAGTO.DARE_GO` etc. `categoria_ui` (pasta) deriva do prefixo.

---

## 🧾 Esquema Canônico — JSON (saída mínima por documento)

```json
{
  "doc_id": "uuid",
  "doc_type": "FISCAL_DECL.PGDAS_D",
  "empresa": {
    "cnpj": "20982311000100",
    "nome": "AVIZ ALIMENTOS LTDA",
    "ie": "",
    "im": "",
    "municipio": "Goiania",
    "uf": "GO",
    "regime": "SN|LP|LR|MEI"
  },
  "competencia": "2025-08",
  "emissao": "2025-09-05",
  "origem": "onedrive|smb|upload_manual",
  "hash_conteudo": "sha256...",
  "caminho_final": "/ORGANIZED_FOLDER/20982311000100/2025/08/FISCAL_PGDAS/pgdas_2025-08.pdf",
  "lgpd_sensibilidade": "NONE|DP|SAUDE|FINANCEIRO",
  "class_confidence": 0.94,
  "payload": {
    "pgdas": {
      "rbt12": 1234567.89,
      "receita_bruta_periodo": 125000.00,
      "segregacao": {
        "comercio": 40000.00,
        "industria": 0,
        "servicos": 85000.00,
        "monofasica": 10000.00,
        "st_antecipacao": 0,
        "exportacao": 0
      },
      "aliquota_nominal": 9.47,
      "aliquota_efetiva": 6.15,
      "reparticao": { "icms": 2300.00, "iss": 5400.00 },
      "valor_total_das": 7700.00,
      "faturamentos_anteriores": {
        "2025-07": 130000.00,
        "2025-06": 120000.00
      },
      "observacoes": "..."
    },
    "guia_pagto": {
      "tipo": "DAS",
      "linha_digitavel": "8586...",
      "vencimento": "2025-09-20",
      "pago_em": "2025-09-19",
      "valor_pago": 7700.00,
      "banco": "001"
    },
    "certidao": null,
    "societario": null,
    "parcelamento": null,
    "contabil": null,
    "dp": null
  },
  "links": [
    { "kind": "pagamento_de", "target_doc_id": "uuid_das" }
  ],
  "anchors": [
    { "label": "Período de Apuração", "text": "08/2025", "page": 1 },
    { "label": "RBT12", "text": "R$ 1.234.567,89", "page": 1 }
  ],
  "alerts": ["DAS pago após vencimento"],
  "created_at": "2025-09-02T10:00:00-03:00"
}
```

> **Todos os extratores** devem preencher as seções do `payload` pertinentes ao domínio, mantendo chaves padronizadas (ex.: `guia_pagto`, `certidao`, `societario`, `parcelamento`, `contabil`, `dp`).

---

## 🔎 Regras de Classificação (A2)

1) **Âncoras por tipo** (palavras-chave + layout):
- `PGDAS_D`: “PGDAS-D”, “Programa Gerador do Documento de Arrecadação do Simples Nacional”, “Período de Apuração”, “RBT12”, “Segregação de Receitas”, “Alíquota Efetiva”, “Repartição do DAS”.
- `DAS`: “DAS Documento de Arrecadação do Simples Nacional”, “Linha Digitável”, “Código de Acesso”, “Vencimento”.
- `DARF`: “Documento de Arrecadação de Receitas Federais”, “Código de Receita”, “Período de Apuração (PA)”.
- `DARE_GO`: “Documento de Arrecadação de Receitas Estaduais – GO”, “UG”, “Receita”, “Referência”.
- `GNRE`: “Guia Nacional de Recolhimento de Tributos Estaduais”.
- `NFSE`: “Nota Fiscal de Serviços Eletrônica”, “Prestador”, “Tomador”, “Código do Serviço”, “Alíquota ISS”.
- `CONTRATO_SOCIAL/ALTERACAO`: “Junta Comercial do Estado de Goiás – JUCEG”, “NIRE”, “Contrato/Alteração”.
- `CERTIDOES`: “Certidão Negativa”, “Positiva com Efeitos de Negativa”, “Validade/Emissão”, “Protocolo”.
- `PARCELAMENTO`: “Extrato do Parcelamento”, “Modalidade”, “Prestações”, “Saldo Devedor”, “Situação”.
- `BALANCO/DRE`: cabeçalhos “Balanço Patrimonial”, “Demonstração do Resultado do Exercício”.

2) **Competência**: heurística robusta
- Preferir campos explícitos: “Período de Apuração: mm/aaaa” → `YYYY-MM`.
- Se ausente: usar `emissao` e regras do documento (ex.: DAS vence **D+20** do mês seguinte; competência = mês de apuração do DAS).
- Para **NFSe/NFe**: competência = mês da **emissão**; para **balanço/DRE**: competência = fim do período do relatório.

3) **LGPD**
- Se contiver dados pessoais sensíveis (DP/saúde/identidade): `lgpd_sensibilidade ≠ NONE`. A UI deve **mascarar** campos a usuários sem permissão.

---

## 🧠 Extratores Específicos — Regras e Campos

### 1) `extract_pgdas.py`
- **Anchors**: “Período de Apuração”, “Receita Bruta Total”, “RBT12”, “Alíquota Efetiva”, “Repartição do DAS”, “Segregação de Receitas”.
- **Campos**: `competencia`, `rbt12`, `receita_bruta_periodo`, `segregacao{comercio, industria, servicos, monofasica, st_antecipacao, exportacao}`, `aliquota_nominal`, `aliquota_efetiva`, `reparticao{icms, iss}`, `valor_total_das`, `faturamentos_anteriores{…}`.
- **Pagamento vinculado**: buscar **DAS** com mesmo CNPJ, `competencia`, `valor` ≈; se múltiplos, escolher `pago_em` mais próximo do vencimento.
- **Pasta**: `FISCAL_PGDAS`.

### 2) `extract_das.py`
- **Anchors**: “DAS”, “Linha Digitável”, “Receita bruta”, “Código de Acesso”, “Vencimento”.
- **Campos**: `linha_digitavel`, `vencimento`, `valor_total`, `pago_em?`, `banco?`, `autenticacao?`.
- **Link**: reconciliar com `PGDAS_D` correspondente.

### 3) `extract_darf.py`
- **Anchors**: “Documento de Arrecadação de Receitas Federais”, “Código de Receita”, “Período de Apuração (PA)”.
- **Campos**: `codigo_receita`, `pa_competencia`, `cnpj_cpf`, `vencimento`, `principal`, `multa`, `juros`, `total`, `linha_digitavel`, `pago_em?`.
- **Pasta**: `FISCAL_DARF`.

### 4) `extract_dare_go.py`
- **Anchors**: “DARE”, “UG”, “Receita”, “Referência”, “Inscrição Estadual”, “SEFAZ GO”.
- **Campos**: `ug`, `receita_codigo`, `referencia`, `ie`, `cnpj`, `valor_principal`, `multa`, `juros`, `total`, `vencimento`, `pago_em?`.
- **Pasta**: `FISCAL_ICMS`.

### 5) `extract_gnre.py`
- **Anchors**: “GNRE”, “UF Favorecida”, “Código da Receita”, “Período de Referência”.
- **Campos**: `uf_favorecida`, `codigo_receita`, `referencia`, `identificador`, `vencimento`, `total`, `pago_em?`.

### 6) `extract_nfse.py`
- **Anchors**: “Nota Fiscal de Serviços Eletrônica”, “Prestador”, “Tomador”, “Código Serviço”, “Alíquota ISS”.
- **Campos**: `numero`, `serie?`, `emissao`, `prestador{cnpj, nome, municipio}`, `tomador{cnpj, nome, municipio}`, `atividade/codigo_servico`, `base_iss`, `aliquota_iss`, `valor_iss`, `retencoes{iss, inss, irrf, csll, pis, cofins}`.
- **Pasta**: `FISCAL_ISS`.

### 7) `extract_certidoes.py`
- **Anchors**: “Certidão”, “Situação”, “Validade”, “Emissão”, “Protocolo”.
- **Campos**: `orgao`, `tipo`, `situacao` (NEGATIVA, POSITIVA C/ EFEITOS DE NEGATIVA, POSITIVA), `emitida_em`, `validade`, `protocolo`, `observacoes`.
- **Alertas**: “Vence em ≤ 15 dias”.
- **Pasta**: `CERTIDOES`.

### 8) `extract_societario.py`
- **Anchors**: “Junta Comercial do Estado de Goiás”, “JUCEG”, “NIRE”, “Contrato Social”, “Alteração Contratual”, “Ata”.
- **Campos**: `tipo_ato`, `data_ato`, `nire`, `protocolo`, `mudancas{quadro_societario, capital_social, objeto, administradores, endereco}`, `texto_resumido`.
- **Timeline**: criar **linha do tempo societária**.

### 9) `extract_parcelamento.py`
- **Anchors**: “Extrato do Parcelamento”, “Modalidade”, “Número do Parcelamento”, “Prestações”, “Saldo Devedor”, “Situação”.
- **Campos**: `orgao`, `modalidade`, `numero`, `data_adesao`, `valor_consolidado`, `prestacoes_total`, `prestacoes_pag`, `prestacoes_vencidas`, `saldo_devedor`, `situacao`.

### 10) `extract_balanco_dre.py`
- **Anchors**: “Balanço Patrimonial”, “Demonstração do Resultado do Exercício”.
- **Campos (BP)**: `data_base`, `ativo_total`, `passivo_total`, `pl`, (`circulante`, `nao_circulante` etc. se estiverem).
- **Campos (DRE)**: `receita_liquida`, `cmv_csp`, `lucro_bruto`, `despesas_operacionais`, `resultado_financeiro`, `lucro_liquido`.
- **Observação**: se arquivo **SPED ECD/ECF** (TXT), delegar ao **extrator SPED**.

### 11) `extract_sped.py`
- **Entrada**: TXT EFD-ICMS/IPI, EFD-Contribuições, ECD, ECF.
- **Saída**: resumos (CFOP/NCM, débitos/créditos ICMS, bases PIS/COFINS, J100/J150 p/ BP/DRE, receitas ECF).
- **Obs.**: Armazenar também **blocos brutos** (para auditorias futuras).

---

## 🔗 Regras de Vinculação (A5)

- **DAS ↔ PGDAS-D**: `same(cnpj, competencia)` & `valor ≈ valor_total_das` & `|pagto - vencimento| ≤ 10d`.
- **DARE/ICMS ↔ EFD-ICMS**: `same(cnpj, competencia)` & `total ≈ apurado E110/E116` (se disponível).
- **GNRE ↔ NF-e/CFOP ST/Antecipação**: link por **chave**/CFOP e referência.
- **Certidões**: vinculadas ao **cliente** (não a competências), com alertas por validade.
- **Societário**: timeline global da empresa; alterações impactam dashboards e permissões.

---

## 🗃️ Organização em Pastas (A8)

```
ORGANIZED_FOLDER/
  <CNPJ>/
    <ANO>/<MES>/
      FISCAL_PGDAS/
      FISCAL_DAS/
      FISCAL_DARF/
      FISCAL_ICMS/
      FISCAL_ISS/
      CONTABIL_DRE_BP/
      CERTIDOES/
      SOCIETARIO/
      PARCELAMENTOS/
      DP/
```

- Itens sem competência → `OUTROS/`.
- Materiais do Escritório → `ORGANIZED_FOLDER/AMPLA_CONTABILIDADE/<Subpasta>`.

---

## 🔐 Segurança & LGPD

- Mascarar PII em UI para `lgpd_sensibilidade ≠ NONE`.
- Guardar **anchors** (rasuras dos campos capturados) para auditoria.
- Criptografia em repouso do volume dos `organizados`.
- Trilha em `auditoria_eventos` (download/movimentação/alteração).

---

## 🧪 Testes Automatizados (pytest)

- Unit: classificador, regex de âncoras, normalizador, conciliador.
- Integração: `/api/v1/upload`, `/api/v1/organize`, watchers.
- Mocks: OpenAI, CNPJa, OneDrive/SMB.
- Casos de erro: OCR falho; PDF escaneado; múltiplos DAS p/ mesma competência; certidão vencida.
- Métricas de qualidade: *precision/recall* por tipo; **coverage** ≥ 80%.

---

## 🧰 Ferramentas Técnicas (Python)

- **PDF/Imagem**: `pymupdf` (fitz), `pdfplumber`, `pytesseract` (OCR), `opencv-python` (pré-processamento), `python-stdnum` (CNPJ/CPF), `dateparser`, `unidecode`.
- **ETL**: `pandas` para tabelas (ex.: segregação do PGDAS).
- **Hash**: `hashlib.sha256`.
- **Fila**: `RQ/Celery` ou fila simples em BD com *lease*.
- **Storage**: mover com `pathlib` e registrar no BD.

---

## 🧱 Contrato do Agente (Entrada/Saída)

**Entrada** (por arquivo):
```json
{
  "path": "/uploads/pending/pgdas_2098.pdf",
  "origem": "onedrive",
  "empresa_contexto": { "cnpj": "20982311000100", "ie": "", "im": "", "municipio": "Goiania", "uf": "GO", "regime": "SN" },
  "hints": { "nome_arquivo": "PGDAS-AVIZ-08-2025.pdf" }
}
```

**Saída**: JSON **Canônico** (modelo acima). Apenas JSON + `anchors` (sem raciocínio textual). Em caso de erro, retorne `{ "error": {"code": "...", "message": "..."} }`.

---

## 🧭 Prompt Mestre (cole no VSCode/Cursor do agente Classificador/Extratores)

> **Sistema (não responda nada além de JSON quando solicitado a extrair)**
>
> Você é um **Agente de GED Fiscal/Contábil** para escritório de contabilidade em Goiás. Sua função é **classificar**, **extrair**, **normalizar** e **vincular** documentos contábeis/fiscais/societários/DP. Trabalhe sempre com **alta precisão**, cite **anchors** (trechos/exatas labels) e **NÃO** exponha cadeia de raciocínio; retorne **apenas JSON** no formato pedido. Em dúvidas, sinalize `status_processamento = "REVISAR"` com `class_confidence` baixo.
>
> **Entrada**: você receberá `{ path, origem, empresa_contexto, hints }`.
>
> **Tarefas**:
> 1. Detectar `doc_type` e `competencia` (YYYY-MM).
> 2. Extrair campos por tipo, conforme **Esquema Canônico**.
> 3. Preencher `anchors` com rótulos e páginas.
> 4. Estimar `class_confidence` (0–1) e `lgpd_sensibilidade`.
> 5. Propor `links` (ex.: DAS ↔ PGDAS) quando houver evidências.
> 6. Gerar `alerts` (ex.: “certidão a vencer”, “DAS atrasado”).
>
> **Taxonomia**: `FISCAL_DECL.PGDAS_D`, `FISCAL_GUIA_PAGTO.DAS`, `FISCAL_GUIA_PAGTO.DARF`, `FISCAL_GUIA_PAGTO.DARE_GO`, `FISCAL_GUIA_PAGTO.GNRE`, `FISCAL_DOC.NFSE`, `SOCIETARIO.CONTRATO_SOCIAL`, `SOCIETARIO.ALTERACAO_CONTRATUAL`, `CERTIDAO.RFB_CONJUNTA`, `CERTIDAO.CNDT_TRABALHISTA`, `CERTIDAO.FGTS_CRF`, `CERTIDAO.SEFAZ_GO_CND`, `CERTIDAO.MUNICIPAL_GOIANIA_CND`, `CERTIDAO.MUNICIPAL_APARECIDA_CND`, `PARCELAMENTO.ECAC_RFB`, `PARCELAMENTO.SEFAZ_GO`, `CONTABIL.BALANCO_PATRIMONIAL`, `CONTABIL.DRE`, `SPED.EFD_ICMS_IPI`, `SPED.EFD_CONTRIB`, `SPED.ECD`, `SPED.ECF`, `DP.ESOCIAL_EVENTO`, etc.
>
> **Regras-chaves de extração** (exemplos):
> - **PGDAS-D**: procurar “Período de Apuração”, “RBT12”, “Segregação de Receitas”, “Alíquota Efetiva”, “Repartição do DAS”. Converter valores em número decimal (pt-BR → US).
> - **DAS**: “Linha Digitável”, “Vencimento”, “Valor Total”. Se constar comprovante bancário, capturar `pago_em` e `banco`.
> - **DARF/DARE/GNRE**: `codigo_receita/receita_codigo`, `pa_competencia/referencia`, `vencimento`, `principal/multa/juros/total`, `linha_digitavel`.
> - **NFSe**: campos de prestador/tomador, `codigo_servico`, `base_iss`, `aliquota_iss`, retenções. Competência = mês de emissão.
> - **Certidões**: `orgao`, `tipo`, `situacao`, `emissao`, `validade`, `protocolo`.
> - **Societário**: identificar `tipo_ato`, `data_ato`, `nire`, `protocolo`, `mudancas{...}`.
> - **Parcelamento**: `modalidade`, `numero`, `data_adesao`, `saldo_devedor`, `situacao`.
> - **Balanço/DRE**: datas e totais principais.
>
> **Saída**: **apenas** o JSON Canônico. Caso não consiga, retorne `{ "error": {"code": "EXTRACAO_FALHA", "message": "motivo"} }`.

---

## 📊 Dashboard — KPIs Alimentados

- **PGDAS-D**: `rbt12`, `receita_bruta_periodo`, `aliquota_efetiva`, `valor_total_das`, `segregacao%`, `reparticao icms/iss`, histórico (M-1/M-2...).
- **Conformidade**: `DAS pago vs devido`, `atrasos`, `alertas`.
- **ICMS/ISS**: totais por competência; benefícios (GO: crédito outorgado, base reduzida quando aplicável).
- **Certidões**: status atual e prazos a vencer.
- **Societário**: timeline de eventos.
- **Contábil**: BP/DRE sintético por período.

---

## ✅ Passos de Implementação (rápidos)

1. Implementar interface de **plugins de extratores** (`extract_*.py`) com assinatura comum.
2. Conectar o **Orquestrador** à fila/worker (processa `PENDENTE`).
3. Integrar **Classificador** + **Extratores** ao `processar_documento_pendente(doc_id)`.
4. Persistir **JSON Canônico** em `documentos_avancados.analise_ia` (JSONB-like).
5. **Mover & indexar** o arquivo no padrão de pastas.
6. Alimentar **dashboard** a partir do canônico (consultas SQL/Views).
7. Cobrir com **pytest** (mocks para OpenAI/CNPJa; PDFs de exemplo).
14.838.598/0001-05
37.029.034/0001-19
57.115.455/0001-70
57.112.242/0001-94
25.132.963/0001-70
51.859.330/0001-78
49.332.028/0001-15
22.225.578/0001-89
05.870.487/0001-87
45.143.471/0001-97
48.254.400/0001-50
26.174.910/0001-84
26.763.165/0001-09
39.875.746/0001-84
36.457.937/0001-38
35.655.605/0001-03
45.428.404/0001-19
17.190.386/0001-44
13.494.261/0001-57
20.982.311/0001-00
26.780.564/0001-88
53.300.720/0001-39
31.264.095/0001-84
08.970.652/0001-60
31.319.248/0001-43
30.836.248/0001-58
13.381.861/0001-09
40.499.234/0001-40
06.091.828/0001-89
09.277.832/0001-24
00.362.472/0001-94
36.046.644/0001-68
40.410.933/0001-71
33.660.643/0001-10
52.474.052/0001-01
18.470.289/0001-78
04.288.608/0001-14
36.779.794/0001-80
58.368.299/0001-11
37.109.603/0001-36
23.961.612/0001-46
34.861.301/0001-21
15.002.885/0001-35
00.243.072/0001-60
33.359.266/0001-84
35.773.375/0001-79
00.107.311/0001-54
33.908.017/0001-09
52.590.669/0001-84
46.423.540/0001-89
06.926.317/0001-30
50.344.149/0001-66
35.027.938/0001-80
45.452.665/0001-74
25.190.488/0001-98
07.401.536/0001-68
07.798.664/0001-97
41.912.131/0001-22
50.156.789/0001-42
49.521.819/0001-93
11.469.393/0001-01
50.093.807/0001-94
55.776.490/0001-04
03.679.123/0001-99
31.500.841/0001-91
32.873.039/0001-00
33.060.015/0001-02
45.060.831/0001-97
41.414.660/0001-04
12.269.010/0001-06
46.356.542/0001-00
49.947.639/0001-78
03.261.977/0001-50
35.655.819/0001-71
11.505.838/0001-53
58.613.870/0001-16
34.127.552/0001-87
02.980.587/0001-78
18.640.823/0001-47
55.266.031/0001-80
11.728.894/0001-57
13.744.217/0001-58
13.744.217/0002-39
12.301.939/0001-75
07.205.272/0001-77
38.419.090/0001-22
25.072.295/0001-32
37.245.841/0001-79
40.799.943/0001-40
47.048.167/0001-96
31.541.744/0001-47
11.803.753/0001-51
51.938.925/0001-19
61.202.171/0001-98
49.623.272/0001-37
12.100.476/0001-83
11.914.321/0001-18
29.714.186/0001-22
61.050.265/0001-99
21.732.154/0001-48
514.818.986-04
33.035.671/0001-47
58.454.014/0001-65
18.871.745/0001-91
14.782.641/0001-50
43.366.802/0001-22
10.815.797/0001-39
07.119.310/0001-79
25.348.661/0001-33
13.478.872/0001-01
11.635.599/0001-56
20.055.300/0001-85
14.728.289/0001-74
27.951.345/0001-87
10.676.256/0001-77
07.211.566/0001-01
07.161.743/0001-92
34.939.379/0001-11
04.249.638/0001-11
47.121.019/0001-50
47.110.033/0001-58
06.990.595/0001-56
10.481.804/0001-03
23.047.355/0001-31
46.011.869/0001-32
55.693.131/0001-93
37.257.257/0001-33
10.293.532/0001-18
35.453.469/0001-60
20.234.203/0001-50
05.459.541/0001-04
50.046.850/0001-07
55.116.291/0001-70
20.878.163/0001-89
55.741.473/0001-31
51.049.134/0001-38
02.380.977/0001-07
26.505.109/0001-74
43.313.158/0001-24
44.682.471/0001-00
35.756.165/0001-72
14.757.445/0001-25
14.049.439/0001-13
50.632.097/0001-23
08.602.412/0001-03
03.832.285/0001-15
08.641.878/0001-18
08.641.878/0002-07
05.999.661/0001-96
47.070.387/0001-16
09.441.550/0001-10
23.746.719/0001-71
06.982.561/0001-10
56.924.358/0001-65
18.383.453/0001-00
02.678.916/0001-20
04.620.897/0001-07
12.764.099/0001-87
25.255.276/0001-41
56.340.104/0001-08
19.579.503/0001-91
28.048.711/0001-55
00.978.020/0001-31
26.543.367/0001-45
