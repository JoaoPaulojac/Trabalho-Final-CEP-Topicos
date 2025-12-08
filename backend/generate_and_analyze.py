"""
Script para gerar dados de temperatura e executar análise CEP automaticamente
"""
import json
import random
from datetime import datetime
import sys
import os

def generate_temperature_samples(num_samples=5, readings_per_sample=5, 
                                 mean_temp=23.0, std_dev=5.0):
    """
    Gera amostras de temperatura simuladas
    
    Args:
        num_samples: Número de amostras a gerar
        readings_per_sample: Número de leituras por amostra
        mean_temp: Temperatura média
        std_dev: Desvio padrão
    
    Returns:
        Lista de amostras no formato JSON
    """
    samples = []
    
    for i in range(1, num_samples + 1):
        readings = [
            round(random.gauss(mean_temp, std_dev), 2)
            for _ in range(readings_per_sample)
        ]
        
        samples.append({
            "Amostra": str(i),
            "Dados": readings
        })
    
    return samples


def save_temperature_data(samples, filename="temperature_data.json"):
    """Salva os dados em JSON"""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(samples, f, indent=2, ensure_ascii=False)
    print(f"✓ Dados salvos em: {filename}")


def run_cep_analysis():
    """Executa a análise CEP"""
    print("\n" + "="*80)
    print("EXECUTANDO ANÁLISE CEP")
    print("="*80)
    
    # Adiciona o path do CEP-Prova
    sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'CEP-Prova', 'src'))
    
    try:
        from x_r_graphs import XR_graph
        from process_capability import calculate_capability
        
        # Caminhos dos arquivos
        temperature_data_path = os.path.join(os.path.dirname(__file__), 'temperature_data.json')
        constants_path = os.path.join(os.path.dirname(__file__), '..', 'CEP-Prova', 'src', 
                                     'json_files', 'constantes_cep.json')
        
        # Criar gráfico X-R
        xr = XR_graph(data_url=temperature_data_path, constants_url=constants_path)
        
        # Limites de especificação
        LSE_TEMP = 28.0
        LIE_TEMP = 18.0
        
        xr.set_specification_limits(LSE_TEMP, LIE_TEMP)
        xr.analyze_control_status()
        calculate_capability(xr, lse=LSE_TEMP, lie=LIE_TEMP, type_chart="X-R")
        
        print("\n✓ Análise CEP concluída com sucesso!")
        print(f"  - Gráfico: grafico_controle_xr.png")
        print(f"  - Relatório: relatorio_cep_xr.html")
        
        return True
        
    except Exception as e:
        print(f"\n✗ Erro na análise CEP: {e}")
        import traceback
        traceback.print_exc()
        return False


def main():
    """Função principal"""
    print("="*80)
    print("GERADOR DE DADOS E ANÁLISE CEP - TEMPERATURA")
    print("="*80)
    print(f"Data/Hora: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Menu de opções
    print("\nOpções:")
    print("1. Gerar novos dados simulados e analisar")
    print("2. Analisar dados existentes (temperature_data.json)")
    print("3. Gerar apenas dados simulados")
    
    choice = input("\nEscolha uma opção (1-3): ").strip()
    
    if choice == "1":
        print("\n--- GERANDO DADOS SIMULADOS ---")
        num_samples = int(input("Número de amostras (padrão 5): ") or "5")
        samples = generate_temperature_samples(num_samples=num_samples)
        save_temperature_data(samples)
        run_cep_analysis()
        
    elif choice == "2":
        print("\n--- ANALISANDO DADOS EXISTENTES ---")
        if not os.path.exists("temperature_data.json"):
            print("✗ Arquivo temperature_data.json não encontrado!")
            return
        run_cep_analysis()
        
    elif choice == "3":
        print("\n--- GERANDO DADOS SIMULADOS ---")
        num_samples = int(input("Número de amostras (padrão 5): ") or "5")
        samples = generate_temperature_samples(num_samples=num_samples)
        save_temperature_data(samples)
        print("✓ Dados gerados! Use a opção 2 para analisar.")
        
    else:
        print("✗ Opção inválida!")
        return
    
    print("\n" + "="*80)
    print("PROCESSO CONCLUÍDO")
    print("="*80)


if __name__ == "__main__":
    main()
