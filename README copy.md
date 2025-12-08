# 🌡️ ESP32 Temperature Monitor

Sistema completo de monitoramento de temperatura com ESP32, FastAPI e React.

## 📋 Arquitetura

```
ESP32 (Sensor DS18B20) ←→ FastAPI (Backend) ←→ React (Frontend)
```

- **ESP32**: Lê temperatura do sensor DS18B20 e expõe API REST
- **FastAPI**: API intermediária que consulta o ESP32 e serve dados para o frontend
- **React**: Interface web moderna para visualização em tempo real

## 🚀 Instalação e Configuração

### 1. ESP32 (Hardware)

#### Componentes Necessários:
- ESP32
- Sensor de temperatura DS18B20
- Resistor de 4.7kΩ (pull-up)

#### Conexões:
```
DS18B20 VCC  → ESP32 3.3V
DS18B20 GND  → ESP32 GND
DS18B20 DATA → ESP32 GPIO 4 (com resistor de 4.7kΩ entre DATA e VCC)
```

#### Configuração:
1. Abra o arquivo `topicos.ino` no Arduino IDE
2. Instale as bibliotecas necessárias:
   - WiFi (built-in)
   - WebServer (built-in)
   - OneWire
   - DallasTemperature

3. Configure seu WiFi:
```cpp
const char* ssid = "Seu_WiFi";        // Nome da sua rede
const char* password = "Sua_Senha";   // Senha da sua rede
```

4. Faça o upload para o ESP32
5. Abra o Serial Monitor (115200 baud) e anote o **IP do ESP32**

### 2. Backend (FastAPI)

#### Pré-requisitos:
- Python 3.8+

#### Instalação:
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

#### Configuração:
Edite `backend/main.py` e altere o IP do ESP32:
```python
ESP32_IP = "192.168.1.100"  # Substitua pelo IP do seu ESP32
```

#### Executar:
```powershell
python main.py
```

A API estará disponível em: `http://localhost:8000`

#### Endpoints da API:
- `GET /` - Informações da API
- `GET /temperature` - Obter temperatura atual
- `GET /health` - Verificar status da API e ESP32
- `GET /config` - Obter configuração atual
- `POST /config` - Atualizar IP do ESP32

### 3. Frontend (React)

#### Pré-requisitos:
- Node.js 16+

#### Instalação:
```powershell
cd frontend
npm install
```

#### Executar:
```powershell
npm run dev
```

O frontend estará disponível em: `http://localhost:3000`

## 🎯 Como Usar

1. **Inicie o ESP32**: Verifique se está conectado ao WiFi e anote o IP
2. **Inicie o Backend**: Configure o IP do ESP32 e execute a API
3. **Inicie o Frontend**: Acesse via navegador

### Recursos do Frontend:
- 📊 Visualização em tempo real da temperatura
- 🎨 Cores dinâmicas baseadas na temperatura:
  - 🔵 Azul: < 20°C (Frio)
  - 🟢 Verde: 20-30°C (Agradável)
  - 🔴 Vermelho: > 30°C (Quente)
- 🔄 Auto-refresh a cada 5 segundos
- ⚙️ Configuração do IP do ESP32 via interface
- 📡 Indicadores de status da API e ESP32

## 📁 Estrutura do Projeto

```
MCU-esp32-sensor/
├── topicos.ino              # Código do ESP32
├── backend/
│   ├── main.py             # API FastAPI
│   └── requirements.txt    # Dependências Python
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Componente principal
│   │   ├── App.css
│   │   ├── components/
│   │   │   ├── TemperatureCard.jsx
│   │   │   ├── TemperatureCard.css
│   │   │   ├── ConfigPanel.jsx
│   │   │   └── ConfigPanel.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🔧 Troubleshooting

### ESP32 não conecta ao WiFi
- Verifique SSID e senha
- Certifique-se que o roteador está operando em 2.4GHz (ESP32 não suporta 5GHz)

### Backend não conecta ao ESP32
- Verifique se o IP está correto
- Teste acessando `http://IP_DO_ESP32/readings` no navegador
- Certifique-se de estar na mesma rede

### Frontend não carrega dados
- Verifique se o backend está rodando em `http://localhost:8000`
- Abra o console do navegador (F12) para ver erros
- Verifique CORS no backend

### Sensor retorna -127°C
- Verifique as conexões físicas
- Confirme o resistor pull-up de 4.7kΩ
- Teste outro sensor DS18B20

## 🛠️ Tecnologias Utilizadas

- **ESP32**: Microcontrolador com WiFi
- **Arduino**: Framework para programação do ESP32
- **FastAPI**: Framework web Python moderno e rápido
- **React**: Biblioteca JavaScript para interfaces
- **Vite**: Build tool para React
- **Axios**: Cliente HTTP (embutido no fetch API)

## 📝 Notas

- O sistema funciona em rede local (LAN)
- Para acesso externo, configure port forwarding no roteador
- Considere usar HTTPS em produção
- O auto-refresh consome mais energia - desative se não necessário

## 🤝 Contribuindo

Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas features
- Fazer pull requests

## 📄 Licença

Este projeto é de código aberto e está disponível para uso educacional.

---

**Desenvolvido com ❤️ usando ESP32 + FastAPI + React**

Descrição

ESP32
1
Placa de desenvolvimento (DevKit V1 ou similar)

DS18B20
1
Sensor de temperatura digital

Resistor
1
4.7kΩ (para pull-up)

Jumpers
3
Para conexões

Protoboard
1
Opcional

🚀 Como Instalar e Usar

Pré-requisitos

Ter a Arduino IDE instalada e configurada para placas ESP32.

Bibliotecas Necessárias

No Gerenciador de Bibliotecas da IDE (Ctrl+Shift+I), instale:

OneWire (por Paul Stoffregen)

DallasTemperature (por Miles Burton)

Configuração

Clone este repositório ou baixe o arquivo .ino.

Abra o arquivo na Arduino IDE.

Edite as seguintes linhas com suas credenciais Wi-Fi:

const char* ssid = "NOME_DA_SUA_REDE";
const char* password = "SENHA_DA_SUA_REDE";


Conecte o ESP32 via USB.

Selecione a placa correta em Ferramentas > Placa.

Faça o Upload.

Acessando o Monitor

Abra o Monitor Serial (115200 baud).

Reinicie o ESP32 (botão EN/RST).

Copie o Endereço IP que aparecerá no terminal (ex: 192.168.1.15).

Cole no navegador do seu celular ou computador conectado à mesma rede.

📂 Estrutura do Código

Backend (C++): Configura o WiFi, lê o sensor usando a biblioteca DallasTemperature e serve os endpoints / (HTML) e /readings (JSON).

Frontend (HTML/CSS/JS): Armazenado na memória flash do ESP32 (PROGMEM). Utiliza fetch API para solicitar dados assincronamente.

🤝 Contribuição

Sinta-se à vontade para fazer um fork deste projeto e enviar pull requests.

📄 Licença

Este projeto está sob a licença MIT.
