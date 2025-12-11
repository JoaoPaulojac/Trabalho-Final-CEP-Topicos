# 📊 Análise de Funções CEP no Projeto

## Resumo Executivo

Sim! O projeto **possui implementadas** as seguintes funcionalidades:

1. ✅ **Probabilidade de Sucesso** - Calculada e exibida nos relatórios
2. ✅ **Arranjo/Combinações** - Implícitas nas Regras de Western Electric
3. ✅ **Sinais Amarelos (Aviso)** - Implementados via Regras de Western Electric

---

## 📈 1. Probabilidade de Sucesso

### Onde está implementada?
- **Relatórios HTML**: `relatorio_cep_temperature.html` e `relatorio_cep_humidity.html`
- **Fórmula**: Percentual de itens dentro dos limites de especificação

### Exemplo de Saída

```html
<!-- Nos relatórios -->
<strong>Probabilidade de Sucesso:</strong> 65.90% 
(itens dentro dos limites de especificação)
```

### Valor Atual

| Tipo | Valor |
|------|-------|
| Temperatura | 65.90% |
| Umidade | 97.26% |

### O que significa?

- **Temperatura**: 65.9% dos itens produzidos estarão dentro da faixa 18°C - 28°C
- **Umidade**: 97.26% dos itens produzidos estarão dentro da faixa 40% - 70%

### Cálculo

```
Probabilidade = (Itens dentro dos limites) / (Total de itens) × 100%
```

Calculado usando a distribuição normal a partir de:
- Média do processo (X̄)
- Desvio padrão (σ)
- Limites de especificação (LSE, LIE)

---

## 🔢 2. Arranjos e Combinações (Regras de Western Electric)

### Onde estão implementadas?

Nos relatórios HTML, há **4 regras de Western Electric** que usam conceitos de arranjos:

### As 4 Regras

#### **Regra 1: Sinais Vermelhos (Críticos)**
```
Condição: 1 ponto ALÉM de 3σ (Limite de Controle)
Significado: Causa especial detectada
Status: FORA DE CONTROLE
Violações atuais: 0
```

#### **Regra 2: Sinais Amarelos (Aviso) - Tipo 1**
```
Condição: 2 de 3 pontos consecutivos ALÉM de 2σ
Significado: Tendência forte em andamento
Status: AVISO
Violações atuais: 0
```

#### **Regra 3: Sinais Amarelos (Aviso) - Tipo 2**
```
Condição: 4 de 5 pontos consecutivos ALÉM de 1σ
Significado: Tendência moderada detectada
Status: AVISO
Violações atuais: 0
```

#### **Regra 4: Sinais Amarelos (Aviso) - Tipo 3**
```
Condição: 8 pontos consecutivos no MESMO LADO da LC
Significado: Mudança no processo
Status: AVISO
Violações atuais: 0
```

### Combinações Implícitas

As regras usam combinações de pontos:

| Regra | Combinação | Total de Verificações |
|-------|-----------|---------------------|
| R2 | C(3,2) = 3 | Para cada grupo de 3 pontos |
| R3 | C(5,4) = 5 | Para cada grupo de 5 pontos |
| R4 | 8 consecutivos | Sequência simples |

---

## 🟡 3. Sinais Amarelos (Yellow Signals)

### Status nos Relatórios

```html
<!-- Tipo de Status -->
<div class="bg-yellow-50 text-yellow-700 border-l-4 border-yellow-400 p-3">
    AVISO: Análise de regras detectadas
</div>

<!-- Tipo de Resultado -->
PASSOU ✓ (Verde - Sem problemas)
FALHOU ✗ (Vermelho - Problema detectado)
```

### Níveis de Alerta

```
🟢 Verde    → Sob controle (0 violações)
🟡 Amarelo  → Aviso (1-2 violações)
🔴 Vermelho → Crítico (3+ violações)
```

### Exemplos de Relatório

```html
<tr class="text-gray-700">
    <td><strong>Regra 1:</strong> Pontos além de 3σ</td>
    <td style="color: green; font-weight: bold;">PASSOU ✓</td>
    <td font-mono>0 violações</td>
</tr>

<tr class="text-gray-700">
    <td><strong>Regra 2:</strong> 2 de 3 além de 2σ</td>
    <td style="color: green; font-weight: bold;">PASSOU ✓</td>
    <td font-mono>0 violações</td>
</tr>
```

---

## 📊 4. Onde Estão Implementadas as Funções

### Backend
- **Arquivo**: `backend/main.py`
- **Funções usadas**:
  ```python
  from x_r_graphs import XR_graph          # Gráficos X-R
  from process_capability import calculate_capability  # Cp, Cpk
  # (implementado em CEP-Prova/src/)
  ```

### Geração de Relatórios
- **Função**: `xr.analyze_control_status()` 
  - Calcula todas as 4 regras de Western Electric
  - Detecta sinais amarelos e vermelhos
  - Gera estatísticas de violações

- **Função**: `calculate_capability()`
  - Calcula índices de capacidade (Cp, Cpk)
  - Calcula probabilidade de sucesso

### Frontend (React)
- **Arquivo**: `frontend/src/components/CEPAnalysis.jsx`
- **Exibe**:
  - Indicadores de capacidade com cores (🟢🟡🔴)
  - Status de controle (Sob controle / Fora de controle)
  - Botões para gerar análises

---

## 🔧 5. Como Usar as Funções

### Gerar Análise CEP

```bash
# Opção 1: Via backend API
curl -X POST http://localhost:8000/cep/analyze

# Opção 2: Via PowerShell
cd backend
.\run_cep_analysis.ps1

# Opção 3: Script Python direto
python cep_temperature_analysis.py
```

### Acessar Relatórios

```bash
# Gráfico PNG
http://localhost:8000/cep/chart

# Relatório HTML completo
http://localhost:8000/cep/report

# Status da análise
http://localhost:8000/cep/status
```

### Via Interface Web

1. Acesse: `http://localhost:5173`
2. Clique em "📈 Análise CEP"
3. Clique em "🔬 Gerar Análise"
4. Visualize os resultados em tempo real

---

## 📋 6. Campos no Relatório

### Dados de Entrada

| Campo | Valor | Unidade |
|-------|-------|---------|
| Amostra | 1-5 | - |
| X̄ (Média) | 23.81 | °C |
| R (Range) | 13.14 | °C |

### Limite de Especificação

| Limite | Temperatura | Umidade |
|--------|------------|---------|
| LSE | 28.0°C | 70% |
| LIE | 18.0°C | 40% |

### Índices de Capacidade

| Índice | Significado | Fórmula |
|--------|------------|---------|
| **Cp** | Capacidade potencial | (LSE - LIE) / (6σ) |
| **Cpk** | Capacidade real | min((LSE-X̄)/(3σ), (X̄-LIE)/(3σ)) |

### Status de Interpretação

```
Cpk ≥ 1.33  →  🟢 CAPAZ (Excelente)
1.00 ≤ Cpk < 1.33  →  🟡 ACEITÁVEL (Aviso)
Cpk < 1.00  →  🔴 INCAPAZ (Crítico)
```

---

## ✅ Checklist: O que Existe

- ✅ **Probabilidade de Sucesso**: 65.90% (Temperatura), 97.26% (Umidade)
- ✅ **Regra 1 (Vermelha)**: Pontos além de 3σ - IMPLEMENTADA
- ✅ **Regra 2 (Amarela)**: 2 de 3 além de 2σ - IMPLEMENTADA
- ✅ **Regra 3 (Amarela)**: 4 de 5 além de 1σ - IMPLEMENTADA
- ✅ **Regra 4 (Amarela)**: 8 consecutivos - IMPLEMENTADA
- ✅ **Índices de Capacidade (Cp, Cpk)**: IMPLEMENTADOS
- ✅ **Gráficos X-R**: IMPLEMENTADOS
- ✅ **Relatório HTML**: IMPLEMENTADO

---

## ❌ O que NÃO Existe

- ❌ **Funções matemáticas de Arranjo/Combinação**: Não estão explícitas no código
  - (Mas são usadas implicitamente nas regras de Western Electric)
- ❌ **Documentação separada**: De arranjos e combinações
- ❌ **API específica**: Para calcular arranjos/combinações independentes

---

## 🎯 Próximos Passos (Sugestões)

Se você quer implementar funções explícitas de **Arranjo, Combinação e Probabilidade**:

### 1. Criar módulo de Cálculos Matemáticos

```python
# backend/math_utils.py

import math
from math import factorial, comb

def arranjo(n: int, k: int) -> int:
    """A(n, k) = n! / (n-k)!"""
    return factorial(n) // factorial(n - k)

def combinacao(n: int, k: int) -> int:
    """C(n, k) = n! / (k! * (n-k)!)"""
    return comb(n, k)

def permutacao(n: int) -> int:
    """P(n) = n!"""
    return factorial(n)

def probabilidade(casos_favoraveis: int, casos_totais: int) -> float:
    """P = Casos Favoráveis / Casos Totais"""
    return casos_favoraveis / casos_totais if casos_totais > 0 else 0

def probabilidade_binomial(n: int, k: int, p: float) -> float:
    """Distribuição Binomial: C(n,k) * p^k * (1-p)^(n-k)"""
    return comb(n, k) * (p ** k) * ((1 - p) ** (n - k))
```

### 2. Adicionar Endpoints API

```python
@app.get("/math/arranjo/{n}/{k}")
async def calc_arranjo(n: int, k: int):
    return {"resultado": arranjo(n, k), "operacao": f"A({n},{k})"}

@app.get("/math/combinacao/{n}/{k}")
async def calc_combinacao(n: int, k: int):
    return {"resultado": combinacao(n, k), "operacao": f"C({n},{k})"}

@app.get("/math/probabilidade/{favoraveis}/{totais}")
async def calc_probabilidade(favoraveis: int, totais: int):
    prob = probabilidade(favoraveis, totais)
    return {"probabilidade": prob, "percentual": f"{prob*100:.2f}%"}
```

### 3. Exibir no Frontend

Adicionar seção na página de CEP para mostrar:
- Cálculos de arranjo para as regras
- Combinações verificadas
- Probabilidades calculadas

---

## 📚 Referências Documentadas

- `INTEGRACAO_CEP.md` - Documentação completa de CEP
- `backend/README_CEP.md` - Guia de uso da análise CEP
- `INTEGRACAO_FRONTEND_CEP.md` - Integração frontend
- `CHANGELOG_CEP.md` - Histórico de mudanças

---

**Desenvolvido para: ESP32 Temperature Monitor + Análise CEP**
