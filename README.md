# 🌡️ ESP32 Temperature Monitor + Análise CEP

Sistema completo de monitoramento de temperatura com ESP32, integrado a análise estatística CEP (Controle Estatístico de Processo).

## 🚀 Quick Start

### 1. Iniciar Backend
```powershell
cd backend
python main.py
```
✅ Backend: `http://localhost:8000`

### 2. Iniciar Frontend
```powershell
cd frontend
npm run dev
```
✅ Frontend: `http://localhost:5173`

### 3. Simular Dados (Opcional)
```powershell
cd backend
python simulate_esp32.py
```

## 📊 Funcionalidades

### 🌡️ Monitor de Temperatura
- Leitura em tempo real via ESP32
- Auto-refresh configurável
- Histórico de amostras
- API RESTful FastAPI

### 📈 Análise CEP
- **Gráficos de Controle X-R** (Média e Amplitude)
- **Limites de Controle** (LSC, LC, LIC)
- **Capacidade do Processo** (Cp, Cpk)
- **Regras de Western Electric**
- **Relatórios HTML** detalhados
- **Análise sob demanda** via interface web

## 🏗️ Arquitetura

```
ESP32 → FastAPI Backend → React Frontend
                ↓
          CEP-Prova (Análise Estatística)
                ↓
     Gráficos + Relatórios HTML
```

## 📁 Estrutura do Projeto

```
Trabalho-Final-CEP-Topicos/
├── backend/
│   ├── main.py                    # API FastAPI + Endpoints CEP
│   ├── cep_temperature_analysis.py # Script CEP standalone
│   ├── simulate_esp32.py           # Simulador de dados
│   ├── temperature_data.json       # Dados coletados
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                 # App principal + Navegação
│   │   └── components/
│   │       ├── TemperatureCard.jsx # Card de temperatura
│   │       └── CEPAnalysis.jsx     # Página de análise CEP
│   └── package.json
│
├── CEP-Prova/                      # Sistema de análise CEP
│   └── src/
│       ├── x_r_graphs.py           # Gráficos X-R
│       ├── process_capability.py   # Capacidade do processo
│       └── western_electric_rules.py
│
├── topicos.ino                     # Código ESP32
│
└── Documentação/
    ├── QUICK_START.md              # Guia rápido
    ├── INTEGRACAO_FRONTEND_CEP.md  # Documentação completa
    ├── GUIA_VISUAL.md              # Interface e uso
    └── CHANGELOG_CEP.md            # Resumo de alterações
```

## 🎯 Endpoints API

### Temperatura
- `POST /data` - ESP32 envia temperatura
- `GET /temperature` - Última leitura
- `GET /history` - Histórico completo
- `GET /health` - Status do sistema

### Análise CEP
- `POST /cep/analyze` - **Executar análise CEP**
- `GET /cep/status` - Status e disponibilidade
- `GET /cep/chart` - Download do gráfico PNG
- `GET /cep/report` - Relatório HTML completo

## 📊 Interface Web

### Página 1: Monitor
- Temperatura em tempo real
- Status da API e coleta
- Auto-refresh
- Histórico de amostras

### Página 2: Análise CEP
- Dashboard de status
- Botão "Gerar Análise CEP"
- Gráficos de controle inline
- Estatísticas e capacidade
- Link para relatório completo

## 🔧 Tecnologias

### Backend
- **FastAPI** - Framework web
- **Pandas** - Manipulação de dados
- **Matplotlib** - Gráficos
- **NumPy/SciPy** - Cálculos estatísticos

### Frontend
- **React** - Framework UI
- **Tailwind CSS** - Estilização
- **Vite** - Build tool

### Hardware
- **ESP32** - Microcontrolador
- **DHT22** (ou similar) - Sensor de temperatura

## 📚 Documentação Completa

| Documento | Descrição |
|-----------|-----------|
| [QUICK_START.md](QUICK_START.md) | Guia rápido de 3 passos |
| [INTEGRACAO_FRONTEND_CEP.md](INTEGRACAO_FRONTEND_CEP.md) | Documentação técnica completa |
| [GUIA_VISUAL.md](GUIA_VISUAL.md) | Interface e exemplos de uso |
| [CHANGELOG_CEP.md](CHANGELOG_CEP.md) | Resumo de alterações |
| [backend/README_CEP.md](backend/README_CEP.md) | Sistema CEP standalone |

## 🎓 Conceitos CEP

### Gráficos de Controle
- **X̄ (X-barra):** Monitora média do processo
- **R (Amplitude):** Monitora variabilidade

### Índices de Capacidade
- **Cp:** Capacidade potencial
- **Cpk:** Capacidade real (considera centralização)
- **≥ 1.33:** Processo capaz ✅
- **1.0 - 1.33:** Processo aceitável ⚠️
- **< 1.0:** Processo incapaz ❌

### Regras de Western Electric
Detecta padrões não-aleatórios:
1. Um ponto além de 3σ
2. 2 de 3 pontos além de 2σ
3. 4 de 5 pontos além de 1σ
4. 8 pontos consecutivos no mesmo lado

## 🔬 Exemplo de Análise

```
Dados: 5 amostras × 5 leituras = 25 temperaturas

Resultados:
├── X̄̄ (Média): 23.82°C
├── σ (Desvio): 5.19°C
├── Limites de Controle:
│   ├── LSC: 30.17°C
│   └── LIC: 17.48°C
├── Status: ✅ SOB CONTROLE
└── Capacidade:
    ├── Cp: 0.321 (Incapaz)
    └── Cpk: 0.278 (Incapaz)

Interpretação: Processo sob controle estatístico,
mas com alta variabilidade (precisa melhorias)
```

## 🛠️ Instalação

### Backend
```powershell
cd backend
pip install -r requirements.txt
```

### Frontend
```powershell
cd frontend
npm install
```

### ESP32
1. Instalar Arduino IDE
2. Adicionar suporte ESP32
3. Instalar bibliotecas: WiFi, HTTPClient
4. Upload do código `topicos.ino`

## 🐛 Troubleshooting

### Backend não inicia
```powershell
pip install fastapi uvicorn pandas matplotlib numpy scipy
```

### Frontend não inicia
```powershell
npm install
npm run dev
```

### Análise CEP falha
- Verificar mínimo 5 amostras
- Verificar formato do JSON
- Ver logs do backend

### ESP32 não conecta
- Verificar WiFi configurado
- Verificar IP do backend
- Ver Serial Monitor (115200 baud)

## 📈 Roadmap

- [ ] Dashboard com múltiplos sensores
- [ ] Histórico de análises
- [ ] Alertas por email/WhatsApp
- [ ] Exportação PDF
- [ ] Análise preditiva com ML
- [ ] Autenticação de usuários

## 👥 Contribuição

Desenvolvido como trabalho final da disciplina de Tópicos Especiais.

## 📄 Licença

Projeto acadêmico - Universidade

---

**Status:** 🟢 Totalmente Funcional

**Última Atualização:** Dezembro 2025

## 🎉 Começar Agora

1. Clone o repositório
2. Siga o [QUICK_START.md](QUICK_START.md)
3. Acesse `http://localhost:5173`
4. Clique em **📈 Análise CEP**
5. Gere sua primeira análise!

---

# Trabalho-Final-CEP-Topicos
