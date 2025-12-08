# Análise CEP - Dados de Temperatura

Este projeto integra o sistema CEP (Controle Estatístico de Processo) com dados de temperatura coletados do ESP32.

## 📁 Estrutura

```
backend/
├── temperature_data.json          # Dados de temperatura do ESP32
├── cep_temperature_analysis.py   # Script de análise CEP
├── run_cep_analysis.ps1           # Script PowerShell para executar
└── requirements.txt               # Dependências Python

CEP-Prova/                         # Sistema CEP original
└── src/
    ├── x_r_graphs.py              # Gráficos X-R
    ├── AbstractCEP.py             # Classe base
    ├── process_capability.py     # Cálculo de capacidade
    └── ...
```

## 🚀 Como Usar

### Opção 1: Script PowerShell (Recomendado)

```powershell
cd backend
.\run_cep_analysis.ps1
```

### Opção 2: Comando Python Direto

```powershell
cd backend
python cep_temperature_analysis.py
```

## 📊 O que a Análise Faz

1. **Lê os dados de temperatura** do arquivo `temperature_data.json`
2. **Calcula estatísticas CEP**:
   - Média das amostras (X̄)
   - Amplitude (R)
   - Desvio padrão (σ)
   - Limites de controle (LSC, LIC)

3. **Analisa o processo**:
   - Verifica pontos fora de controle
   - Aplica regras de Western Electric
   - Calcula capacidade do processo (Cp, Cpk)

4. **Gera saídas**:
   - `grafico_controle_xr.png` - Gráficos de controle
   - `relatorio_cep_xr.html` - Relatório HTML completo

## 🎯 Limites de Especificação

O script está configurado com limites de temperatura confortável:
- **LSE (Limite Superior):** 28°C
- **LIE (Limite Inferior):** 18°C

Para alterar, edite no arquivo `cep_temperature_analysis.py`:

```python
LSE_TEMP = 28.0  # Seu limite superior
LIE_TEMP = 18.0  # Seu limite inferior
```

## 📋 Formato dos Dados

O arquivo `temperature_data.json` deve seguir este formato:

```json
[
  {
    "Amostra": "1",
    "Dados": [22.67, 24.86, 25.25, 32.34, 19.27]
  },
  {
    "Amostra": "2",
    "Dados": [16.83, 17.70, 20.25, 27.61, 28.73]
  }
]
```

- **Amostra:** Identificador da amostra
- **Dados:** Array com 5 medições de temperatura

## 📦 Dependências

```
pandas
matplotlib
numpy
scipy
```

Instaladas automaticamente pelo script ou com:
```powershell
pip install -r requirements.txt
```

## 📈 Interpretação dos Resultados

### Gráfico X-R
- **Gráfico X̄:** Mostra a média de cada amostra
- **Gráfico R:** Mostra a amplitude (variabilidade) de cada amostra

### Indicadores de Capacidade
- **Cp ≥ 1.33:** Processo capaz
- **1.00 ≤ Cp < 1.33:** Processo aceitável
- **Cp < 1.00:** Processo incapaz

### Regras de Western Electric
Detecta padrões não-aleatórios:
1. Um ponto além de 3σ
2. 2 de 3 pontos além de 2σ
3. 4 de 5 pontos além de 1σ
4. 8 pontos consecutivos no mesmo lado da LC

## 🔧 Troubleshooting

### Erro: ModuleNotFoundError
```powershell
pip install pandas matplotlib numpy scipy
```

### Erro: Arquivo não encontrado
Certifique-se de que `temperature_data.json` existe em `backend/`

### Gráfico não gerado
Verifique se há dados suficientes (mínimo 5 amostras recomendado)

## 📝 Exemplo de Saída

```
================================================================================
ANÁLISE CEP - DADOS DE TEMPERATURA
================================================================================
DataFrame completo:
  Amostra     X1     X2     X3     X4     X5
0       1  22.67  24.86  25.25  32.34  19.27
...

R_BAR: 13.14
SIGMA: 5.19
X_DOUBLE_BAR: 23.82
LSC (X_BAR): 30.17
LIC (X_BAR): 17.48
...

Quantidade de termos fora dos limites de controle (X-barra): 0
Total de termos fora dos limites de controle: 0

Relatório HTML gerado: relatorio_cep_xr.html
Gráfico salvo: grafico_controle_xr.png
```

## 🎓 Referências

- Montgomery, D.C. (2009). Introduction to Statistical Quality Control
- Regras de Western Electric para Controle de Qualidade
- Normas ISO 9000 para Gestão da Qualidade
