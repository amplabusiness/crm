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
