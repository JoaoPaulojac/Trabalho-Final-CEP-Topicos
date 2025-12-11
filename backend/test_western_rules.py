#!/usr/bin/env python3
"""
Script para testar a análise CEP com as regras do Western Electric
"""

import requests
import json

API_BASE = "http://localhost:8000"

print("Testando análise CEP combinada com regras do Western Electric...")
print("="*70)

try:
    response = requests.post(f"{API_BASE}/cep/analyze/combined", json={})
    
    if response.status_code == 200:
        data = response.json()
        print("✓ Análise executada com sucesso!\n")
        
        # Verificar se regras estão presentes
        if "temperature" in data and "western_rules" in data["temperature"]:
            print("📊 TEMPERATURA - Regras do Western Electric:")
            print("-" * 70)
            
            temp_rules = data["temperature"]["western_rules"]
            for rule_key, rule_data in temp_rules.items():
                status_icon = "✓" if not rule_data["violated"] else "✗"
                status_text = "OK" if not rule_data["violated"] else "VIOLADA"
                print(f"{status_icon} {rule_data['name']}: {status_text}")
                print(f"  → {rule_data['description']}\n")
            
            violations = sum(1 for r in temp_rules.values() if r["violated"])
            print(f"Total de violações: {violations}\n")
        
        if "humidity" in data and "western_rules" in data["humidity"]:
            print("\n💧 UMIDADE - Regras do Western Electric:")
            print("-" * 70)
            
            hum_rules = data["humidity"]["western_rules"]
            for rule_key, rule_data in hum_rules.items():
                status_icon = "✓" if not rule_data["violated"] else "✗"
                status_text = "OK" if not rule_data["violated"] else "VIOLADA"
                print(f"{status_icon} {rule_data['name']}: {status_text}")
                print(f"  → {rule_data['description']}\n")
            
            violations = sum(1 for r in hum_rules.values() if r["violated"])
            print(f"Total de violações: {violations}\n")
        
        print("\n" + "="*70)
        print("✓ Tabela de regras está funcionando corretamente!")
        
    else:
        print(f"✗ Erro na análise: Status {response.status_code}")
        print(response.json())
        
except Exception as e:
    print(f"✗ Erro ao conectar ao servidor: {e}")
