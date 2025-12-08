import sys
import os

# Adiciona o diretório CEP-Prova/src ao path para importar os módulos
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'CEP-Prova', 'src'))

from x_r_graphs import XR_graph
from process_capability import calculate_capability

if __name__ == "__main__":
    # Caminho para o arquivo de dados de temperatura
    temperature_data_path = os.path.join(os.path.dirname(__file__), 'temperature_data.json')
    constants_path = os.path.join(os.path.dirname(__file__), '..', 'CEP-Prova', 'src', 'json_files', 'constantes_cep.json')
    
    # Criar instância do gráfico X-R com dados de temperatura
    print("=" * 80)
    print("ANÁLISE CEP - DADOS DE TEMPERATURA")
    print("=" * 80)
    
    xr = XR_graph(data_url=temperature_data_path, constants_url=constants_path)
    
    # Definir limites de especificação para temperatura
    # Exemplo: temperatura ambiente confortável entre 18°C e 28°C
    LSE_TEMP = 28.0  # Limite Superior de Especificação
    LIE_TEMP = 18.0  # Limite Inferior de Especificação
    
    print("\n" + "=" * 80)
    print("LIMITES DE ESPECIFICAÇÃO")
    print("=" * 80)
    xr.set_specification_limits(LSE_TEMP, LIE_TEMP)
    
    # Analisar o status de controle
    print("\n" + "=" * 80)
    print("ANÁLISE DE CONTROLE")
    print("=" * 80)
    xr.analyze_control_status()
    
    # Calcular capacidade do processo
    print("\n" + "=" * 80)
    print("CAPACIDADE DO PROCESSO")
    print("=" * 80)
    calculate_capability(xr, lse=LSE_TEMP, lie=LIE_TEMP, type_chart="X-R")
    
    print("\n" + "=" * 80)
    print("ANÁLISE CONCLUÍDA")
    print("=" * 80)
    print("Relatório HTML gerado: relatorio_cep_xr(LIMITES DE ESPECIFICAÇÃO NORMAL).html")
    print("Gráfico salvo: grafico_controle_xr.png")
