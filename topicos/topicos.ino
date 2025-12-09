#include <WiFi.h>
#include <HTTPClient.h>
#include "DHT.h"

#define DHTPIN 4        // Pino do DHT22 (GPIO 4)
#define DHTTYPE DHT22   // Define o modelo do sensor

DHT dht(DHTPIN, DHTTYPE);

// ========================
// CONFIGURAÇÃO DO WIFI
// ========================
const char* ssid = "VIVOFIBRA-F268";
const char* password = "1E4C26217D";

// ========================
// ENDPOINT DA API
// ========================
const char* apiURL = "http://192.168.15.22:8000/combined";  // <- ALTERE O IP SE NECESSÁRIO

// Intervalo de envio (30 segundos)
unsigned long previousMillis = 0;
const long interval = 30000;


// ====================================================
// FUNÇÃO: ENVIAR DADOS PARA API
// ====================================================
void sendDataToAPI() {
  
  float temperature = dht.readTemperature();   // Celsius
  float humidity = dht.readHumidity();

  // Verifica falha de leitura
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("Falha ao ler o DHT22!");
    return;
  }

  // JSON no formato solicitado
  String jsonData = "{";
  jsonData += "\"temperature\": " + String(temperature, 2) + ", ";
  jsonData += "\"humidity\": " + String(humidity, 2) + ", ";
  jsonData += "\"timestamp\": " + String(millis());
  jsonData += "}";

  Serial.println("Enviando dados para API:");
  Serial.println(jsonData);

  // Envio HTTP
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    http.begin(apiURL);
    http.addHeader("Content-Type", "application/json");

    int httpResponseCode = http.POST(jsonData);

    if (httpResponseCode > 0) {
      Serial.print("Código resposta: ");
      Serial.println(httpResponseCode);
      Serial.println("Retorno da API:");
      Serial.println(http.getString());
    } else {
      Serial.println("Erro ao enviar POST!");
      Serial.println(http.errorToString(httpResponseCode));
    }

    http.end();
  } else {
    Serial.println("WiFi desconectado!");
  }
}


// ====================================================
// SETUP
// ====================================================
void setup() {
  Serial.begin(115200);
  dht.begin();

  Serial.println("Conectando ao WiFi...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi conectado!");
  Serial.print("IP do ESP32: ");
  Serial.println(WiFi.localIP());
  Serial.print("Enviando dados para: ");
  Serial.println(apiURL);

  // Envia primeiro pacote
  sendDataToAPI();
}


// ====================================================
// LOOP
// ====================================================
void loop() {
  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    sendDataToAPI();
  }

  delay(100);
}
