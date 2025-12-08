# Script para simular ESP32 enviando dados para a API
# Execute: python simulate_esp32.py

import requests
import random
import time
import json

API_URL = "http://localhost:8000/data"

def send_temperature():
    # Gera temperatura aleatória entre 15°C e 35°C
    temperature = round(random.uniform(15.0, 35.0), 2)
    
    data = {
        "temperature": temperature,
        "timestamp": int(time.time() * 1000)
    }
    
    try:
        response = requests.post(API_URL, json=data)
        
        if response.status_code == 201:
            result = response.json()
            print(f"✓ Temperatura enviada: {temperature}°C")
            print(f"  → Amostra {result['sample_number']} - Posição {result['position_in_sample']}/5")
            if result.get('sample_complete'):
                print(f"  🎯 Amostra {result['sample_number']} completa!")
        else:
            print(f"✗ Erro: {response.status_code}")
            
    except Exception as e:
        print(f"✗ Erro ao enviar: {e}")

if __name__ == "__main__":
    print("🌡️  Simulador ESP32 - Enviando temperaturas...")
    print(f"   API: {API_URL}")
    print("   Intervalo: 5 segundos")
    print("   Ctrl+C para parar\n")
    
    while True:
        send_temperature()
        time.sleep(5)  # Envia a cada 5 segundos
