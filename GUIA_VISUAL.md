'# 🎯 Guia de Uso - Interface CEP

## 🖥️ Interface do Sistema

### Página 1: Monitor de Temperatura

```
┌────────────────────────────────────────────────────┐
│  🌡️ ESP32 Monitor      [📊 Monitor] [📈 Análise CEP]│
├────────────────────────────────────────────────────┤
│                                                    │
│        🌡️ ESP32 Temperature Monitor               │
│        Monitoramento em tempo real via FastAPI    │
│                                                    │
│  [🟢 API: healthy]  [🟢 Amostras: 5 (25 leituras)]│
│                                                    │
│  ┌──────────────────────────────────────────┐     │
│  │           23.8°C                         │     │
│  │      Última Leitura                      │     │
│  │                                          │     │
│  │   [🔄 Atualizar]  [▶️ Auto-Refresh]     │     │
│  └──────────────────────────────────────────┘     │
│                                                    │
└────────────────────────────────────────────────────┘
```

### Página 2: Análise CEP (Estado Inicial)

```
┌────────────────────────────────────────────────────┐
│  🌡️ ESP32 Monitor      [📊 Monitor] [📈 Análise CEP]│
├────────────────────────────────────────────────────┤
│                                                    │
│     📊 Análise CEP - Controle Estatístico          │
│     Análise estatística dos dados coletados       │
│                                                    │
│  ┌──────────────────────────────────────────┐     │
│  │         Status do Sistema                │     │
│  │                                          │     │
│  │  Amostras: 5        Análise: ✓ Sim      │     │
│  │  Mínimo: 5         Relatórios: ✓✓       │     │
│  │                                          │     │
│  │  [🔬 GERAR ANÁLISE CEP]                 │     │
│  └──────────────────────────────────────────┘     │
│                                                    │
└────────────────────────────────────────────────────┘
```

### Página 2: Análise CEP (Após Análise)

```
┌────────────────────────────────────────────────────┐
│  🌡️ ESP32 Monitor      [📊 Monitor] [📈 Análise CEP]│
├────────────────────────────────────────────────────┤
│                                                    │
│  ┌──────────────────────────────────────────┐     │
│  │    Gráficos de Controle X-R  [📥 Baixar]│     │
│  │                                          │     │
│  │  [════════ GRÁFICO X-BAR ════════]      │     │
│  │  [════════ GRÁFICO R     ════════]      │     │
│  └──────────────────────────────────────────┘     │
│                                                    │
│  ┌──────────────────────────────────────────┐     │
│  │    Estatísticas do Processo              │     │
│  │                                          │     │
│  │  X̄̄: 23.82°C    R̄: 13.14°C             │     │
│  │  σ: 5.19°C     Amostras: 5              │     │
│  └──────────────────────────────────────────┘     │
│                                                    │
│  ┌──────────────────────────────────────────┐     │
│  │    Limites de Controle                   │     │
│  │                                          │     │
│  │  Gráfico X̄:           Gráfico R:        │     │
│  │  🔴 LSC: 30.17°C      🔴 LSC: 26.33°C   │     │
│  │  🟢 LC:  23.82°C      🟢 LC:  13.14°C   │     │
│  │  🔴 LIC: 17.48°C      🔴 LIC:  0.00°C   │     │
│  └──────────────────────────────────────────┘     │
│                                                    │
│  ┌──────────────────────────────────────────┐     │
│  │    Status de Controle                    │     │
│  │                                          │     │
│  │  🟢 Gráfico X̄: SOB CONTROLE             │     │
│  │  🟢 Gráfico R:  SOB CONTROLE             │     │
│  └──────────────────────────────────────────┘     │
│                                                    │
│  ┌──────────────────────────────────────────┐     │
│  │    Capacidade do Processo                │     │
│  │                                          │     │
│  │  Cp:  0.321 🔴  Cpk: 0.278 🔴           │     │
│  │  Cps: 0.278      Cpi: 0.321             │     │
│  │                                          │     │
│  │  🔴 Processo INCAPAZ                     │     │
│  └──────────────────────────────────────────┘     │
│                                                    │
│         [📄 Ver Relatório Completo (HTML)]        │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## 🔄 Fluxo de Uso

### Cenário 1: Primeira Análise

```
1. Abrir Frontend
   http://localhost:5173
   
2. Verificar Amostras
   [🟢 Amostras: 5 (25 leituras)]
   
3. Ir para Análise CEP
   Clicar: [📈 Análise CEP]
   
4. Verificar Status
   ✓ Dados suficientes
   ✓ Botão habilitado
   
5. Gerar Análise
   Clicar: [🔬 GERAR ANÁLISE CEP]
   
   Aguardar:
   [⌛ Executando Análise CEP...]
   
6. Visualizar Resultados
   ✓ Gráficos exibidos
   ✓ Estatísticas calculadas
   ✓ Status determinado
   ✓ Capacidade avaliada
   
7. Ver Relatório Completo
   Clicar: [📄 Ver Relatório Completo]
   Nova aba abre com HTML
```

### Cenário 2: Dados Insuficientes

```
1. Ir para Análise CEP
   Clicar: [📈 Análise CEP]
   
2. Verificar Status
   ❌ Amostras: 2/5
   ⚠️ Botão desabilitado
   
3. Mensagem Exibida
   "⚠️ Colete pelo menos 3 amostra(s)"
   
4. Coletar Mais Dados
   - Voltar ao Monitor
   - Aguardar/simular mais leituras
   - Status atualiza automaticamente
   
5. Quando Pronto
   ✓ Amostras: 5/5
   ✓ Botão habilitado
   ✓ Pode gerar análise
```

### Cenário 3: Analisar Novamente

```
1. Já tem análise anterior
   ✓ Gráficos exibidos
   ✓ Dados em tela
   
2. Coletar Mais Dados
   Voltar ao Monitor
   Aguardar novas amostras
   
3. Regerar Análise
   Voltar para CEP
   Clicar: [🔬 GERAR ANÁLISE CEP]
   
4. Análise Atualizada
   ✓ Novos cálculos
   ✓ Gráficos atualizados
   ✓ Status recalculado
```

---

## 🎨 Elementos da Interface

### Cards de Status

```
┌─────────────────────────────┐
│  Amostras Coletadas         │
│                             │
│         5                   │
│                             │
│  Mínimo necessário: 5       │
└─────────────────────────────┘

┌─────────────────────────────┐
│  Análise Disponível         │
│                             │
│      🟢 Sim                 │
│                             │
│  Dados suficientes          │
└─────────────────────────────┘
```

### Botões

```
Estado Normal:
┌────────────────────────────────┐
│  🔬 GERAR ANÁLISE CEP          │
└────────────────────────────────┘

Estado Loading:
┌────────────────────────────────┐
│  ⌛ Executando Análise CEP...  │
└────────────────────────────────┘

Estado Desabilitado:
┌────────────────────────────────┐
│  🔬 GERAR ANÁLISE CEP (cinza)  │
└────────────────────────────────┘
```

### Indicadores de Capacidade

```
🟢 Cp ≥ 1.33    →  Capaz
🟡 1.0 ≤ Cp < 1.33  →  Aceitável
🔴 Cp < 1.0     →  Incapaz
```

---

## 📱 Responsividade

### Desktop (> 768px)
- Grade de 2-4 colunas
- Gráficos em tamanho completo
- Menu horizontal

### Mobile (< 768px)
- Grade de 1 coluna
- Gráficos responsivos
- Menu empilhado

---

## 🎯 Interações

### Hover
```
Botão Normal:     [Azul]
Botão Hover:      [Azul + Sombra]
Link Normal:      [Branco]
Link Hover:       [Destaque]
```

### Loading States
```
Botão:    Spinner animado + texto
Análise:  Overlay com progresso
Status:   Atualização automática
```

### Error States
```
┌──────────────────────────────┐
│  ❌ Erro: Mensagem clara     │
│                              │
│  Dados insuficientes...      │
└──────────────────────────────┘
```

---

## 📊 Interpretação Visual

### Processo Capaz
```
┌─────────────────────────┐
│  Cp: 1.45  🟢 Capaz     │
│  Cpk: 1.38  🟢 Capaz    │
│                         │
│  ✅ Processo Capaz e    │
│     Centrado            │
└─────────────────────────┘
```

### Processo Aceitável
```
┌─────────────────────────┐
│  Cp: 1.15  🟡 Aceitável │
│  Cpk: 1.08  🟡 Aceitável│
│                         │
│  ⚠️ Processo Aceitável  │
│     porém próximo do    │
│     limite              │
└─────────────────────────┘
```

### Processo Incapaz
```
┌─────────────────────────┐
│  Cp: 0.82  🔴 Incapaz   │
│  Cpk: 0.75  🔴 Incapaz  │
│                         │
│  ❌ Processo Incapaz    │
│     Requer ação         │
└─────────────────────────┘
```

---

## 🚀 Dicas de Uso

### 1. Primeira Vez
- Colete pelo menos 5 amostras
- Verifique status antes de analisar
- Explore o relatório HTML completo

### 2. Análises Regulares
- Analise após cada 5 novas amostras
- Compare resultados ao longo do tempo
- Monitore tendências nos gráficos

### 3. Problemas Detectados
- Processo fora de controle → Investigar causa
- Cp/Cpk baixo → Melhorar processo
- Tendências → Ajustar parâmetros

### 4. Otimização
- Use auto-refresh no monitor
- Gere relatórios para documentação
- Baixe gráficos para apresentações

---

## 📚 Atalhos Úteis

```
F5             → Atualizar página
Ctrl + Click   → Abrir link em nova aba
Tab            → Navegar entre botões
Enter          → Ativar botão focado
```

---

## 🎓 Legenda de Símbolos

```
🌡️  Temperatura
📊  Monitor/Dashboard
📈  Análise/Gráficos
🔬  Análise Científica
📄  Relatório/Documento
📥  Download
🟢  Status OK/Positivo
🟡  Status Atenção
🔴  Status Crítico/Erro
✓   Confirmação
✗   Negação
⚠️  Aviso
❌  Erro
⌛  Carregando
▶️  Play/Iniciar
```

---

## 💡 Exemplo Prático Completo

```
SITUAÇÃO: Monitorar temperatura de ambiente

1. INICIAR SISTEMA
   Terminal 1: python main.py
   Terminal 2: npm run dev
   Terminal 3: python simulate_esp32.py

2. COLETAR DADOS (5 minutos)
   Aguardar 25 leituras (5 amostras)
   Monitor mostra: Amostras: 5

3. ANALISAR
   Clicar: 📈 Análise CEP
   Clicar: 🔬 GERAR ANÁLISE CEP
   Aguardar processamento (~2s)

4. INTERPRETAR
   Ver gráficos: Pontos dentro dos limites?
   Ver capacidade: Cp/Cpk adequados?
   Ver status: Sob controle?

5. DECIDIR
   ✅ Tudo OK → Continuar monitoramento
   ⚠️ Atenção → Investigar tendências
   ❌ Problema → Ação corretiva necessária

6. DOCUMENTAR
   Clicar: 📄 Ver Relatório Completo
   Salvar/Imprimir relatório HTML
   Baixar gráfico PNG
```

---

**Sistema pronto para uso profissional! 🎉**
