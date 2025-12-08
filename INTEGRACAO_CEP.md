# 📊 Integração CEP-Prova com Dados de Temperatura

## ✅ O que foi feito

Integrei o sistema **CEP-Prova** (Controle Estatístico de Processo) com os dados de temperatura do `temperature_data.json`, criando uma análise estatística completa dos dados coletados.

## 📁 Arquivos Criados

### Backend (Principal)
1. **`cep_temperature_analysis.py`** - Script principal de análise CEP
2. **`generate_and_analyze.py`** - Gerador de dados + análise interativa
3. **`run_cep_analysis.ps1`** - Script PowerShell para execução rápida
4. **`README_CEP.md`** - Documentação completa
5. **`requirements.txt`** - Atualizado com dependências CEP

### Arquivos Gerados pela Análise
- **`grafico_controle_xr.png`** - Gráficos de controle X-barra e R
- **`relatorio_cep_xr.html`** - Relatório HTML completo com análise

## 🚀 Como Usar

### Método 1: Análise Rápida (Recomendado)
```powershell
cd backend
python cep_temperature_analysis.py
```

### Método 2: Interface Interativa
```powershell
cd backend
python generate_and_analyze.py
```

Opções disponíveis:
1. **Gerar novos dados simulados e analisar** - Cria dados aleatórios e analisa
2. **Analisar dados existentes** - Usa o `temperature_data.json` atual
3. **Gerar apenas dados simulados** - Cria novos dados sem analisar

### Método 3: Script PowerShell
```powershell
cd backend
.\run_cep_analysis.ps1
```

## 📊 O que a Análise CEP Calcula

### 1. **Estatísticas Básicas**
- **X̄ (X-barra)**: Média de cada amostra
- **X̿ (X-barra-barra)**: Média das médias
- **R (Amplitude)**: Variação dentro de cada amostra
- **R̄ (R-barra)**: Média das amplitudes
- **σ (Sigma)**: Desvio padrão do processo

### 2. **Limites de Controle**
- **LSC (Limite Superior de Controle)**: X̿ + A₂×R̄
- **LC (Linha Central)**: X̿
- **LIC (Limite Inferior de Controle)**: X̿ - A₂×R̄

### 3. **Análise de Capacidade**
- **Cp (Índice de Capacidade Potencial)**
  - Cp ≥ 1.33: ✅ Processo CAPAZ
  - 1.00 ≤ Cp < 1.33: ⚠️ Processo ACEITÁVEL
  - Cp < 1.00: ❌ Processo INCAPAZ

- **Cpk (Índice de Capacidade Real)**
  - Considera a centralização do processo
  - Cpk < Cp indica processo descentrado

### 4. **Regras de Western Electric**
Detecta padrões não-aleatórios que indicam problemas:

| Regra | Descrição | Indica |
|-------|-----------|--------|
| **Regra 1** | 1 ponto além de 3σ | Causa especial |
| **Regra 2** | 2 de 3 pontos além de 2σ | Tendência forte |
| **Regra 3** | 4 de 5 pontos além de 1σ | Tendência moderada |
| **Regra 4** | 8 pontos consecutivos no mesmo lado | Mudança no processo |

## 📈 Interpretando os Resultados

### Gráfico X̄ (Média)
- Mostra se a média do processo está sob controle
- Pontos fora dos limites indicam problema na centralização

### Gráfico R (Amplitude)
- Mostra se a variabilidade está sob controle
- Pontos fora dos limites indicam inconsistência

### Relatório HTML
Contém:
- ✅ Tabela de dados processados
- ✅ Gráficos de controle
- ✅ Análise de Western Electric
- ✅ Índices de capacidade (Cp, Cpk)
- ✅ Interpretação dos resultados

## 🎯 Exemplo Prático

### Dados de Entrada (`temperature_data.json`)
```json
[
  {"Amostra": "1", "Dados": [22.67, 24.86, 25.25, 32.34, 19.27]},
  {"Amostra": "2", "Dados": [16.83, 17.70, 20.25, 27.61, 28.73]},
  ...
]
```

### Saída da Análise
```
R_BAR: 13.14
SIGMA: 5.19
X_DOUBLE_BAR: 23.82
LSC (X_BAR): 30.17
LIC (X_BAR): 17.48

Quantidade de termos fora dos limites de controle: 0
✅ Processo SOB CONTROLE
```

## 🔧 Configurações

### Alterar Limites de Especificação
No arquivo `cep_temperature_analysis.py`:
```python
LSE_TEMP = 28.0  # Limite Superior (°C)
LIE_TEMP = 18.0  # Limite Inferior (°C)
```

### Gerar Mais Amostras
No arquivo `generate_and_analyze.py`:
```python
samples = generate_temperature_samples(
    num_samples=10,        # Número de amostras
    readings_per_sample=5, # Leituras por amostra
    mean_temp=23.0,        # Temperatura média
    std_dev=5.0            # Desvio padrão
)
```

## 📦 Dependências

```txt
pandas       # Manipulação de dados
matplotlib   # Geração de gráficos
numpy        # Cálculos numéricos
scipy        # Cálculos estatísticos
```

Instalação:
```powershell
pip install -r requirements.txt
```

## 🔍 Estrutura do Projeto

```
Trabalho-Final-CEP-Topicos/
│
├── backend/
│   ├── temperature_data.json           # ← Dados de entrada
│   ├── cep_temperature_analysis.py     # ← Script de análise
│   ├── generate_and_analyze.py         # ← Gerador interativo
│   ├── run_cep_analysis.ps1            # ← Script PowerShell
│   ├── README_CEP.md                   # ← Documentação
│   ├── grafico_controle_xr.png         # ← Saída: Gráfico
│   └── relatorio_cep_xr.html           # ← Saída: Relatório
│
└── CEP-Prova/                          # Sistema CEP original
    └── src/
        ├── x_r_graphs.py               # Gráficos X-R
        ├── AbstractCEP.py              # Classe base
        ├── process_capability.py       # Capacidade
        ├── western_electric_rules.py   # Regras WE
        └── json_files/
            └── constantes_cep.json     # Constantes
```

## 🎓 Conceitos CEP

### Carta de Controle X-R
- **X̄ (X-barra)**: Monitora a média (tendência central)
- **R (Range)**: Monitora a variabilidade (dispersão)

### Quando o Processo Está Sob Controle
1. ✅ Todos os pontos dentro dos limites
2. ✅ Nenhuma violação das regras de Western Electric
3. ✅ Distribuição aleatória em torno da LC

### Quando o Processo Está Fora de Controle
1. ❌ Pontos além dos limites de controle
2. ❌ Padrões não-aleatórios detectados
3. ❌ Tendências ou ciclos visíveis

## 🚨 Troubleshooting

### Erro: ModuleNotFoundError
```powershell
pip install pandas matplotlib numpy scipy
```

### Erro: Arquivo não encontrado
Certifique-se de estar no diretório `backend`:
```powershell
cd backend
```

### Gráfico não aparece
O gráfico é salvo como PNG, não é exibido na tela:
```powershell
# Abrir o gráfico
start grafico_controle_xr.png
```

### Análise sem dados suficientes
Mínimo recomendado: **5 amostras com 5 leituras cada**

## 📚 Referências

- Montgomery, D.C. (2009). *Introduction to Statistical Quality Control*
- Western Electric Company (1956). *Statistical Quality Control Handbook*
- ISO 9000 - Gestão da Qualidade
- AIAG - Statistical Process Control (SPC)

## 💡 Próximos Passos

1. **Integrar com o backend FastAPI** - Criar endpoint para análise CEP
2. **Dashboard interativo** - Visualização em tempo real no frontend
3. **Alertas automáticos** - Notificações quando processo sair de controle
4. **Histórico de análises** - Salvar e comparar análises anteriores
5. **Exportação de relatórios** - PDF, Excel, etc.

---

## ✨ Resumo

✅ Sistema CEP-Prova integrado com `temperature_data.json`  
✅ Análise estatística completa dos dados de temperatura  
✅ Gráficos de controle X-R gerados automaticamente  
✅ Relatório HTML detalhado com interpretações  
✅ Scripts facilitadores (Python e PowerShell)  
✅ Documentação completa e exemplos práticos  

**Status:** 🟢 Pronto para uso!
