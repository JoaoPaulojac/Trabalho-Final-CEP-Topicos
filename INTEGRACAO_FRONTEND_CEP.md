# 🔗 Integração Frontend + Backend + CEP

## ✅ Funcionalidades Implementadas

### Backend - Novos Endpoints CEP

**Base URL:** `http://localhost:8000`

#### 1. `POST /cep/analyze`
Executa análise CEP completa nos dados de temperatura.

**Resposta:**
```json
{
  "status": "success",
  "message": "Análise CEP executada com sucesso",
  "data": {
    "x_double_mean": 23.82,
    "r_mean": 13.14,
    "sigma": 5.19,
    "lsc_x_bar": 30.17,
    "lic_x_bar": 17.48,
    "lsc_r": 26.33,
    "lic_r": 0.0,
    "lse": 28.0,
    "lie": 18.0,
    "total_samples": 5,
    "out_of_control_x": 0,
    "out_of_control_r": 0,
    "capability": {
      "rcp": 0.321,
      "rcpk": 0.278,
      "rcps": 0.278,
      "rcpi": 0.321
    }
  },
  "chart_base64": "iVBORw0KGgoAAAANSUhEUg...",
  "report_available": true
}
```

#### 2. `GET /cep/status`
Verifica status e disponibilidade de análise.

**Resposta:**
```json
{
  "data_available": true,
  "total_samples": 5,
  "minimum_required": 5,
  "chart_exists": true,
  "report_exists": true,
  "can_analyze": true
}
```

#### 3. `GET /cep/chart`
Baixa o gráfico PNG gerado.

#### 4. `GET /cep/report`
Abre o relatório HTML completo.

### Frontend - Nova Página CEP

**Rota:** Acessível pelo menu de navegação

#### Funcionalidades da Interface

1. **Dashboard de Status**
   - Amostras coletadas vs. mínimo necessário
   - Status da análise (disponível/não disponível)
   - Indicadores de arquivos gerados

2. **Botão "Gerar Análise CEP"**
   - Executa análise on-demand
   - Desabilitado se dados insuficientes
   - Feedback visual durante processamento

3. **Visualização de Resultados**
   - Gráficos de controle X-R (inline base64)
   - Estatísticas do processo
   - Limites de controle (LSC, LC, LIC)
   - Limites de especificação (LSE, LIE)
   - Status de controle (sob controle/fora de controle)
   - Índices de capacidade (Cp, Cpk, Cps, Cpi)

4. **Ações Disponíveis**
   - Baixar gráfico PNG
   - Abrir relatório HTML completo
   - Atualizar status

5. **Navegação**
   - Menu superior com duas páginas:
     - 📊 Monitor (temperatura em tempo real)
     - 📈 Análise CEP (análise estatística)

## 🚀 Como Usar

### 1. Iniciar o Backend

```powershell
cd backend
# Ativar ambiente virtual (se necessário)
.venv\Scripts\Activate.ps1

# Instalar dependências
pip install -r requirements.txt

# Iniciar servidor
python main.py
```

Servidor disponível em: `http://localhost:8000`

### 2. Iniciar o Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend disponível em: `http://localhost:5173`

### 3. Coletar Dados

**Opção A - ESP32 Real:**
1. Configure o ESP32 com o código fornecido
2. Aguarde coleta de pelo menos 5 amostras (25 leituras)

**Opção B - Simulação:**
```powershell
cd backend
python simulate_esp32.py
```

### 4. Executar Análise CEP

1. Acesse o frontend: `http://localhost:5173`
2. Clique no menu **📈 Análise CEP**
3. Aguarde até ter pelo menos 5 amostras
4. Clique em **🔬 Gerar Análise CEP**
5. Visualize os resultados na tela

## 📊 Fluxo de Dados

```
ESP32 → POST /data → Backend → temperature_data.json
                                    ↓
                    Frontend ← GET /cep/status
                        ↓
            Usuário clica "Gerar Análise"
                        ↓
                POST /cep/analyze → CEP-Prova (Python)
                        ↓
            Gera: grafico_controle_xr.png
                  relatorio_cep_xr.html
                        ↓
                Frontend exibe resultados
```

## 📁 Arquivos Modificados/Criados

### Backend
- ✏️ `backend/main.py` - Adicionados endpoints CEP
- ✅ `backend/cep_temperature_analysis.py` - Script standalone

### Frontend
- ✏️ `frontend/src/App.jsx` - Adicionada navegação e rotas
- ✅ `frontend/src/components/CEPAnalysis.jsx` - Componente da página CEP

### Documentação
- ✅ `INTEGRACAO_FRONTEND_CEP.md` - Este arquivo

## 🎨 Capturas de Tela

### Página de Análise CEP
- Dashboard de status com métricas
- Botão de análise on-demand
- Gráficos de controle X-R
- Tabelas de estatísticas
- Indicadores de capacidade com cores

### Menu de Navegação
- Monitor de temperatura (página principal)
- Análise CEP (nova página)

## 🔧 Configuração

### Limites de Especificação

Editar em `backend/main.py`:
```python
LSE_TEMP = 28.0  # Limite Superior
LIE_TEMP = 18.0  # Limite Inferior
```

### Mínimo de Amostras

Editar em `backend/main.py`:
```python
if len(data) < 5:  # Alterar aqui
    raise HTTPException(...)
```

## 🐛 Troubleshooting

### Erro: "Dados insuficientes"
**Solução:** Colete pelo menos 5 amostras (25 leituras) antes de executar análise.

### Erro: "ModuleNotFoundError: pandas"
**Solução:** 
```powershell
cd backend
pip install pandas matplotlib numpy scipy
```

### Gráfico não aparece
**Solução:** Verifique console do navegador. O gráfico é carregado em base64.

### CORS Error
**Solução:** Certifique-se de que o backend está rodando na porta 8000.

## 📈 Métricas e Indicadores

### Interpretação dos Resultados

#### Índices de Capacidade
| Índice | ≥ 1.33 | 1.00 - 1.33 | < 1.00 |
|--------|---------|-------------|---------|
| **Cp** | ✅ Capaz | ⚠️ Aceitável | ❌ Incapaz |
| **Cpk** | ✅ Capaz | ⚠️ Aceitável | ❌ Incapaz |

#### Status de Controle
- ✅ **SOB CONTROLE**: Todos os pontos dentro dos limites
- ❌ **FORA DE CONTROLE**: Pontos além dos limites LSC/LIC

#### Regras de Western Electric (no relatório HTML)
1. Um ponto além de 3σ
2. 2 de 3 pontos além de 2σ
3. 4 de 5 pontos além de 1σ
4. 8 pontos consecutivos no mesmo lado

## 🎯 Próximos Passos

### Melhorias Futuras
- [ ] Histórico de análises
- [ ] Comparação entre análises
- [ ] Alertas automáticos
- [ ] Exportação de relatórios em PDF
- [ ] Análise de tendências
- [ ] Dashboard com múltiplos gráficos
- [ ] Filtros por período
- [ ] Análise preditiva

### Integrações
- [ ] Notificações por email
- [ ] Webhooks para alertas
- [ ] API RESTful completa
- [ ] Autenticação de usuários
- [ ] Multi-sensores

## 📚 Tecnologias Utilizadas

### Backend
- **FastAPI** - Framework web assíncrono
- **Pandas** - Manipulação de dados
- **Matplotlib** - Geração de gráficos
- **NumPy** - Cálculos numéricos
- **SciPy** - Estatística avançada

### Frontend
- **React** - Framework UI
- **Tailwind CSS** - Estilização
- **Vite** - Build tool

### CEP
- **CEP-Prova** - Sistema de controle estatístico
- **Western Electric Rules** - Detecção de padrões
- **Process Capability Analysis** - Análise de capacidade

## 📞 Suporte

Para problemas ou dúvidas:
1. Verifique os logs do backend
2. Verifique o console do navegador
3. Revise a documentação do CEP-Prova
4. Verifique a estrutura dos dados JSON

---

**Status:** 🟢 Totalmente Funcional

**Última Atualização:** Dezembro 2025
