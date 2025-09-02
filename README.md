# 🏢 Sistema Organizador de Documentos Empresariais com IA

Sistema avançado de gestão e análise de documentos contábeis com agentes especialistas de inteligência artificial para escritórios de contabilidade.

## 🚀 Características Principais

### 🤖 Agentes Especialistas IA
- **👨‍💼 Contador Especialista**: Análise de balancetes, DRE e conformidade contábil
- **📊 Tributarista**: Cálculo de impostos, análise de PGDAS e otimização fiscal
- **👥 Departamento Pessoal**: Folha de pagamento, provisões trabalhistas e eSocial
- **⚖️ Advogado Empresarial**: Contratos sociais, conformidade legal e aspectos societários
- **🎯 Coordenador Geral**: Análises completas e relatórios executivos integrados

### 📊 Gestão de Clientes
- **Importação em massa** de clientes via planilha Excel/CSV
- **Auto-vinculação** de documentos por CNPJ
- **Dashboard individual** para cada empresa
- **Estrutura automática** de pastas organizadas
- **Relatórios gerenciais** completos

### 🔍 Análise Inteligente de Documentos
- **Reconhecimento automático** de tipos de documentos
- **Extração de informações** relevantes
- **Classificação por regime tributário**
- **Análise de conformidade** automática
- **Sugestões de otimização** fiscal

### 🎨 Interface Moderna
- **Design responsivo** Bootstrap 5
- **Dashboard interativo** com gráficos
- **Console de consultas** aos especialistas
- **Visualizador avançado** de documentos
- **Sistema de notificações** em tempo real

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Python 3.8+
- Chave da API OpenAI (ChatGPT)

### 1️⃣ Configurar API OpenAI
Crie um arquivo `.env` na raiz com:
```
OPENAI_API_KEY=sk-...sua-chave...
OPENAI_MODEL=gpt-5-mini-preview
```
O app carrega `.env` automaticamente e também lê variáveis de ambiente padrão do sistema.

### 2️⃣ Executar Sistema
```bash
python app.py
```
Acesse: http://localhost:5000

## 📊 Como Importar Clientes

### Estrutura da Planilha
A planilha deve ter as seguintes colunas:
- **Razão Social**: Nome da empresa
- **ID**: Código no sistema Domínio
- **CNPJ**: Documento da empresa
- **Fone**: Telefone de contato
- **Regime**: Regime tributário (SN, LP, LR, MEI)

### Processo de Importação
1. Acesse `/clientes`
2. Clique em **"Importar Clientes"**
3. Selecione a planilha Excel ou CSV
4. Aguarde o processamento
5. Verifique os resultados

## 🤖 Usando os Agentes Especialistas

### Console de Consultas
1. Acesse `/especialistas`
2. Selecione um especialista
3. Digite sua pergunta
4. Receba análise detalhada

### Exemplos de Consultas
```
📊 Contador:
"Analise este balancete com receita de R$ 100.000 e despesas de R$ 80.000"

💰 Tributarista:
"Calcule os impostos do Simples Nacional para faturamento de R$ 75.000/mês"

👥 Departamento Pessoal:
"Calcule provisões trabalhistas para folha de R$ 150.000 com 25 funcionários"

⚖️ Advogado:
"Verifique conformidade legal de uma sociedade limitada com 3 sócios"
```

## 🎯 Recursos Implementados

✅ **Agentes Especialistas IA** - Sistema completo com 5 especialistas
✅ **Importação de Clientes** - Planilha Excel/CSV automática
✅ **Dashboard Empresarial** - Interface moderna responsiva
✅ **Console de Consultas** - Chat com especialistas IA
✅ **Visualizador Avançado** - Documentos PDF, imagem, texto
✅ **Auto-vinculação** - Documentos por CNPJ automático
✅ **Estrutura de Pastas** - Organização automática
✅ **APIs RESTful** - Integração completa
✅ **Base de Dados** - SQLite com modelos avançados
✅ **Análise Inteligente** - ChatGPT integrado

## 🚀 Aplicação Web Moderna com Dashboard

Sistema completo para organização automática de documentos contábeis com interface web moderna, dashboard em tempo real e monitoramento avançado.

### 🛠️ Tecnologias Utilizadas

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Banco de Dados**: SQLite
- **Gráficos**: Chart.js / Plotly
- **UI Framework**: Bootstrap 5
- **Ícones**: Font Awesome

### 📁 Estrutura do Projeto

```
organizador-documentos/
├── app.py                 # Aplicação principal Flask
├── config.py             # Configurações
├── models.py             # Modelos do banco de dados
├── routes.py             # Rotas da API
├── organizer.py          # Motor organizador
├── requirements.txt      # Dependências
├── database/
│   └── init.sql         # Script inicial do banco
├── static/
│   ├── css/
│   │   └── style.css    # Estilos personalizados
│   ├── js/
│   │   └── app.js       # JavaScript da aplicação
│   └── uploads/         # Arquivos enviados
└── templates/
    ├── base.html        # Template base
    ├── dashboard.html   # Dashboard principal
    ├── clients.html     # Gestão de clientes
    └── reports.html     # Relatórios
```

### 🚀 Como Executar

1. **Instalar dependências:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Executar aplicação:**
   ```bash
   python app.py
   ```

3. **Acessar dashboard:**
   ```
   http://localhost:5000
   ```

### 🎯 Funcionalidades

- ✅ Dashboard moderno com métricas em tempo real
- ✅ Upload e organização automática de documentos
- ✅ Gestão de clientes
- ✅ Relatórios interativos
- ✅ Monitoramento de pastas
- ✅ API REST completa
- ✅ Interface responsiva

### 🔧 Configuração

A aplicação detecta automaticamente:
- Google Drive
- OneDrive
- Pastas locais

### 📊 Dashboard Features

- Estatísticas em tempo real
- Gráficos interativos
- Monitoramento de atividades
- Alertas e notificações
- Logs detalhados

### 🎨 Interface Moderna

- Design responsivo
- Tema escuro/claro
- Animações suaves
- UX/UI profissional
