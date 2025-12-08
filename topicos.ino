#include <WiFi.h>
#include <HTTPClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>

const char* ssid = "Nome da rede";
const char* password = "Senha";

// URL da API FastAPI (altere para o IP do seu computador)
const char* apiURL = "http://192.168.1.10:8000/data";  // ALTERE ESTE IP!

const int oneWireBus = 4; // O pino de DADOS do sensor vai no GPIO 4
OneWire oneWire(oneWireBus);
DallasTemperature sensors(&oneWire);

// Intervalo de envio (30 segundos)
unsigned long previousMillis = 0;
const long interval = 30000;


// ====================================================
// FUNÇÃO PARA ENVIAR DADOS PARA A API
// ====================================================

void sendDataToAPI() {
  // Lê temperatura do sensor
  sensors.requestTemperatures(); 
  float temperatureC = sensors.getTempCByIndex(0);
  
  // Verifica se deu erro de leitura (-127)
  if(temperatureC == -127.00) {
    Serial.println("Erro ao ler o sensor!");
    return;
  }

  // Cria JSON para enviar
  String jsonData = "{\"temperature\": " + String(temperatureC, 2) + 
                    ", \"timestamp\": " + String(millis()) + "}";
  
  Serial.println("Enviando dados para API...");
  Serial.println("Temperatura: " + String(temperatureC) + "°C");
  
  // Verifica WiFi
  if(WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    // Inicia conexão HTTP
    http.begin(apiURL);
    http.addHeader("Content-Type", "application/json");
    
    // Envia POST
    int httpResponseCode = http.POST(jsonData);
    
    if(httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Código de resposta: " + String(httpResponseCode));
      Serial.println("Resposta: " + response);
    } else {
      Serial.println("Erro no POST: " + String(httpResponseCode));
      Serial.println("Erro: " + http.errorToString(httpResponseCode));
    }
    
    http.end();
  } else {
    Serial.println("WiFi desconectado!");
  }
}

// ====================================================
// SETUP E LOOP
// ====================================================

void setup() {
  Serial.begin(115200);

  // Inicia Sensor
  sensors.begin();

  // Conecta WiFi
  WiFi.begin(ssid, password);
  Serial.print("Conectando ao WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("");
  Serial.println("Conectado ao WiFi!");
  Serial.print("IP do ESP32: ");
  Serial.println(WiFi.localIP());
  Serial.print("Enviando dados para: ");
  Serial.println(apiURL);
  
  // Faz primeiro envio
  sendDataToAPI();
}

void loop() {
  unsigned long currentMillis = millis();
  
  // Envia dados a cada intervalo definido
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    sendDataToAPI();
  }
  
  delay(100);
}
