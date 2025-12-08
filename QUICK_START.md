# 🚀 GUIA RÁPIDO - Inicialização do Sistema

## ⚡ Início Rápido (3 passos)

### 1️⃣ Iniciar Backend (Terminal 1)

```powershell
cd backend
python main.py
```

✅ Backend rodando em: `http://localhost:8000`

---

### 2️⃣ Iniciar Frontend (Terminal 2)

```powershell
cd frontend
npm run dev
```

✅ Frontend rodando em: `http://localhost:5173`

---

### 3️⃣ Simular ESP32 (Terminal 3) - Opcional

```powershell
cd backend
python simulate_esp32.py
```

✅ Gerando leituras de temperatura automaticamente

---

## 📊 Acessar o Sistema

1. **Abrir navegador:** `http://localhost:5173`

2. **Página Principal (Monitor)**
   - Visualizar temperatura em tempo real
   - Ver status da API
   - Acompanhar coleta de amostras

3. **Página Análise CEP**
   - Clicar no menu: **📈 Análise CEP**
   - Aguardar 5 amostras (ou gerar via simulação)
   - Clicar: **🔬 Gerar Análise CEP**
   - Visualizar resultados

---

## 🔄 Fluxo Completo

```
┌─────────────┐
│ 1. Backend  │  ← Terminal 1: python main.py
└─────────────┘
      ↓
┌─────────────┐
│ 2. Frontend │  ← Terminal 2: npm run dev
└─────────────┘
      ↓
┌─────────────┐
│ 3. Simular  │  ← Terminal 3: python simulate_esp32.py
└─────────────┘
      ↓
┌─────────────┐
│ 4. Coletar  │  ← Aguardar 5 amostras (25 leituras)
└─────────────┘
      ↓
┌─────────────┐
│ 5. Analisar │  ← Clicar em "Gerar Análise CEP"
└─────────────┘
```

---

## 🎯 Endpoints Principais

### Backend (http://localhost:8000)

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/` | GET | Info da API |
| `/health` | GET | Status do sistema |
| `/data` | POST | ESP32 envia dados |
| `/temperature` | GET | Última temperatura |
| `/history` | GET | Histórico completo |
| `/cep/status` | GET | Status análise CEP |
| `/cep/analyze` | POST | ⭐ **Executar análise CEP** |
| `/cep/chart` | GET | Baixar gráfico PNG |
| `/cep/report` | GET | Abrir relatório HTML |

---

## 📦 Verificar Instalação

### Backend
```powershell
cd backend
pip list | Select-String "fastapi|pandas|matplotlib|numpy|scipy"
```

Esperado:
```
fastapi         0.x.x
pandas          2.x.x
matplotlib      3.x.x
numpy           1.x.x
scipy           1.x.x
```

### Frontend
```powershell
cd frontend
npm list --depth=0
```

Esperado:
```
react@18.x.x
tailwindcss@3.x.x
vite@5.x.x
```

---

## 🐛 Resolução de Problemas

### Backend não inicia
```powershell
# Reinstalar dependências
cd backend
pip install -r requirements.txt
```

### Frontend não inicia
```powershell
# Reinstalar node_modules
cd frontend
rm -r node_modules
npm install
```

### CORS Error
- Certifique que backend está em `localhost:8000`
- Certifique que frontend está em `localhost:5173`

### Dados insuficientes para CEP
```powershell
# Gerar dados rapidamente
cd backend
python generate_and_analyze.py
# Escolher opção 1 ou 3
```

---

## 📱 Testar com ESP32 Real

### 1. Configurar ESP32

Editar `topicos.ino`:
```cpp
const char* ssid = "SUA_REDE_WIFI";
const char* password = "SUA_SENHA";
const char* serverUrl = "http://SEU_IP:8000/data";
```

### 2. Descobrir seu IP

```powershell
ipconfig | Select-String "IPv4"
```

### 3. Atualizar `.env` no backend

```env
ESP32_IP=192.168.1.xxx
ESP32_READ_INTERVAL=30
```

### 4. Upload para ESP32

1. Abrir Arduino IDE
2. Abrir `topicos.ino`
3. Selecionar placa ESP32
4. Upload

---

## 📊 Exemplo de Uso Completo

### Terminal 1: Backend
```powershell
PS> cd backend
PS> python main.py
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Terminal 2: Frontend
```powershell
PS> cd frontend
PS> npm run dev
VITE ready in 500 ms
➜  Local:   http://localhost:5173/
```

### Terminal 3: Simulação
```powershell
PS> cd backend
PS> python simulate_esp32.py
[INFO] Enviando leitura 1: 22.5°C
[INFO] Resposta: 200 - Amostra 1, Posição 1/5
...
```

### Navegador
1. Acessar: `http://localhost:5173`
2. Ver amostras sendo coletadas
3. Ir para: **📈 Análise CEP**
4. Clicar: **🔬 Gerar Análise CEP**
5. Visualizar resultados completos

---

## ✅ Checklist de Funcionamento

- [ ] Backend rodando na porta 8000
- [ ] Frontend rodando na porta 5173
- [ ] API respondendo em `/health`
- [ ] Simulador enviando dados (ou ESP32)
- [ ] Amostras aparecendo no monitor
- [ ] Pelo menos 5 amostras coletadas
- [ ] Botão "Gerar Análise CEP" habilitado
- [ ] Análise executada com sucesso
- [ ] Gráficos exibidos na tela
- [ ] Relatório HTML disponível

---

## 🎉 Pronto!

Sistema totalmente integrado e funcionando:
- ✅ Backend FastAPI com endpoints CEP
- ✅ Frontend React com interface CEP
- ✅ Análise estatística completa
- ✅ Visualização de gráficos
- ✅ Relatórios detalhados

**Acesse:** `http://localhost:5173` → **📈 Análise CEP** → **🔬 Gerar Análise CEP**
