from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from typing import Optional, List, Dict
from pydantic import BaseModel
import logging
import json
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv
import os
import sys
import base64

# Carregar variáveis de ambiente
load_dotenv()

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="ESP32 Temperature Monitor API", version="1.0.0")

# Configurar CORS para permitir requisições do React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique o domínio do front-end
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Arquivos JSON para armazenar dados
DATA_FILE = Path("temperature_data.json")
HUMIDITY_FILE = Path("humidity_data.json")

# Configurações do ESP32 (carregadas do .env)
ESP32_IP = os.getenv("ESP32_IP", "192.168.1.100")
ESP32_READ_INTERVAL = int(os.getenv("ESP32_READ_INTERVAL", "30"))

# Tamanho de cada amostra
SAMPLE_SIZE = 5

class TemperatureReading(BaseModel):
    temperature: float
    timestamp: Optional[int] = None

class HumidityReading(BaseModel):
    humidity: float
    timestamp: Optional[int] = None

class CombinedReading(BaseModel):
    temperature: float
    humidity: float
    timestamp: Optional[int] = None

class Sample(BaseModel):
    Amostra: str
    Dados: List[float]

class TemperatureResponse(BaseModel):
    temperature: float
    sample_number: str
    position_in_sample: int
    samples_count: int

class HumidityResponse(BaseModel):
    humidity: float
    sample_number: str
    position_in_sample: int
    samples_count: int

class CombinedResponse(BaseModel):
    temperature: float
    humidity: float
    sample_number: str
    position_in_sample: int
    samples_count: int

class HistoryResponse(BaseModel):
    samples: List[Sample]
    total_samples: int
    total_readings: int
    current_sample: Optional[Sample] = None

# Inicializar arquivos JSON se não existirem
def init_data_file():
    if not DATA_FILE.exists():
        DATA_FILE.write_text(json.dumps([], indent=2))
        logger.info("Arquivo de temperatura criado")
    if not HUMIDITY_FILE.exists():
        HUMIDITY_FILE.write_text(json.dumps([], indent=2))
        logger.info("Arquivo de umidade criado")

def load_data(file_path=DATA_FILE):
    """Carrega dados do arquivo JSON"""
    try:
        data = json.loads(file_path.read_text())
        # Se for formato antigo, converte para novo
        if isinstance(data, dict) and "readings" in data:
            return []
        return data if isinstance(data, list) else []
    except Exception as e:
        logger.error(f"Erro ao carregar dados de {file_path}: {e}")
        return []

def save_data(data, file_path=DATA_FILE):
    """Salva dados no arquivo JSON"""
    try:
        file_path.write_text(json.dumps(data, indent=2))
        logger.info(f"Dados salvos com sucesso em {file_path}")
    except Exception as e:
        logger.error(f"Erro ao salvar dados em {file_path}: {e}")

def get_current_sample(data):
    """Retorna a amostra atual (incompleta ou None)"""
    if not data or not isinstance(data, list):
        return None
    
    last_sample = data[-1]
    
    # Verificar se a amostra tem a estrutura correta
    if not isinstance(last_sample, dict) or "Dados" not in last_sample:
        return None
    
    if len(last_sample["Dados"]) < SAMPLE_SIZE:
        return last_sample
    return None

def create_new_sample(data):
    """Cria uma nova amostra"""
    sample_number = len(data) + 1
    new_sample = {
        "Amostra": str(sample_number),
        "Dados": []
    }
    data.append(new_sample)
    return new_sample

# Inicializar arquivo ao iniciar a API
init_data_file()

@app.get("/")
async def root():
    """Endpoint raiz com informações da API"""
    return {
        "message": "ESP32 Temperature Monitor API",
        "version": "1.0.0",
        "description": "API que recebe dados do ESP32 via POST",
        "endpoints": {
            "POST /data": "ESP32 envia temperatura (usado pelo ESP32)",
            "GET /temperature": "Obter última leitura de temperatura",
            "GET /history": "Obter histórico de leituras",
            "GET /health": "Verificar status da API",
            "DELETE /history": "Limpar histórico"
        }
    }

@app.post("/data", status_code=201)
async def receive_data(reading: TemperatureReading):
    """
    Endpoint para ESP32 enviar dados de temperatura via POST
    Agrupa dados em amostras de 5 leituras
    """
    try:
        # Carregar dados existentes
        data = load_data()
        
        # Verificar se há amostra atual incompleta
        current_sample = get_current_sample(data)
        
        # Se não há amostra ou está completa, criar nova
        if current_sample is None:
            current_sample = create_new_sample(data)
        
        # Adicionar temperatura à amostra atual
        current_sample["Dados"].append(reading.temperature)
        
        # Informações para resposta
        sample_number = current_sample["Amostra"]
        position = len(current_sample["Dados"])
        is_complete = len(current_sample["Dados"]) == SAMPLE_SIZE
        
        # Salvar
        save_data(data)
        
        logger.info(f"Temperatura {reading.temperature}°C adicionada à Amostra {sample_number} (Posição {position}/5)")
        
        return {
            "message": "Dados recebidos com sucesso",
            "temperature": reading.temperature,
            "sample_number": sample_number,
            "position_in_sample": position,
            "sample_complete": is_complete,
            "total_samples": len(data)
        }
        
    except Exception as e:
        logger.error(f"Erro ao processar dados: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao processar dados: {str(e)}")

@app.get("/temperature", response_model=TemperatureResponse)
async def get_temperature():
    """
    Obtém a última leitura de temperatura
    """
    try:
        data = load_data()
        
        if not data:
            raise HTTPException(
                status_code=404,
                detail="Nenhuma leitura disponível. ESP32 ainda não enviou dados."
            )
        
        # Pegar última amostra e última temperatura
        last_sample = data[-1]
        if not last_sample["Dados"]:
            raise HTTPException(
                status_code=404,
                detail="Nenhuma leitura disponível."
            )
        
        last_temp = last_sample["Dados"][-1]
        
        return {
            "temperature": last_temp,
            "sample_number": last_sample["Amostra"],
            "position_in_sample": len(last_sample["Dados"]),
            "samples_count": len(data)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao obter temperatura: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@app.get("/history", response_model=HistoryResponse)
async def get_history(limit: Optional[int] = None):
    """
    Obtém histórico de amostras de temperatura
    """
    try:
        data = load_data()
        
        # Aplicar limite se especificado
        samples = data[-limit:] if limit else data
        
        # Calcular total de leituras
        total_readings = sum(len(sample["Dados"]) for sample in data)
        
        return {
            "samples": samples,
            "total_samples": len(data),
            "total_readings": total_readings,
            "current_sample": data[-1] if data else None
        }
        
    except Exception as e:
        logger.error(f"Erro ao obter histórico: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

# ==================== HUMIDITY ENDPOINTS ====================

@app.get("/humidity", response_model=HumidityResponse)
async def get_humidity():
    """
    Obtém a última leitura de umidade
    """
    try:
        data = load_data(HUMIDITY_FILE)
        
        if not data:
            raise HTTPException(
                status_code=404,
                detail="Nenhuma leitura disponível. ESP32 ainda não enviou dados."
            )
        
        # Pegar última amostra e última umidade
        last_sample = data[-1]
        if not last_sample["Dados"]:
            raise HTTPException(
                status_code=404,
                detail="Nenhuma leitura disponível."
            )
        
        last_humidity = last_sample["Dados"][-1]
        
        return {
            "humidity": last_humidity,
            "sample_number": last_sample["Amostra"],
            "position_in_sample": len(last_sample["Dados"]),
            "samples_count": len(data)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao obter umidade: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@app.post("/humidity", status_code=201)
async def receive_humidity(reading: HumidityReading):
    """
    Endpoint para ESP32 enviar dados de umidade via POST
    Agrupa dados em amostras de 5 leituras
    """
    try:
        # Carregar dados existentes
        data = load_data(HUMIDITY_FILE)
        
        # Verificar se há amostra atual incompleta
        current_sample = get_current_sample(data)
        
        # Se não há amostra ou está completa, criar nova
        if current_sample is None:
            current_sample = create_new_sample(data)
        
        # Adicionar umidade à amostra atual
        current_sample["Dados"].append(reading.humidity)
        
        # Informações para resposta
        sample_number = current_sample["Amostra"]
        position = len(current_sample["Dados"])
        is_complete = len(current_sample["Dados"]) == SAMPLE_SIZE
        
        # Salvar
        save_data(data, HUMIDITY_FILE)
        
        logger.info(f"Umidade {reading.humidity}% adicionada à Amostra {sample_number} (Posição {position}/5)")
        
        return {
            "message": "Dados de umidade recebidos com sucesso",
            "humidity": reading.humidity,
            "sample_number": sample_number,
            "position_in_sample": position,
            "sample_complete": is_complete,
            "total_samples": len(data)
        }
        
    except Exception as e:
        logger.error(f"Erro ao processar dados de umidade: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao processar dados: {str(e)}")

@app.post("/combined", status_code=201)
async def receive_combined(reading: CombinedReading):
    """
    Endpoint para ESP32 enviar temperatura e umidade simultaneamente
    """
    try:
        # Processar temperatura
        temp_data = load_data(DATA_FILE)
        temp_sample = get_current_sample(temp_data)
        if temp_sample is None:
            temp_sample = create_new_sample(temp_data)
        temp_sample["Dados"].append(reading.temperature)
        save_data(temp_data, DATA_FILE)
        
        # Processar umidade
        hum_data = load_data(HUMIDITY_FILE)
        hum_sample = get_current_sample(hum_data)
        if hum_sample is None:
            hum_sample = create_new_sample(hum_data)
        hum_sample["Dados"].append(reading.humidity)
        save_data(hum_data, HUMIDITY_FILE)
        
        sample_number = temp_sample["Amostra"]
        position = len(temp_sample["Dados"])
        
        logger.info(f"Temperatura {reading.temperature}°C e Umidade {reading.humidity}% - Amostra {sample_number} ({position}/5)")
        
        return {
            "message": "Dados combinados recebidos com sucesso",
            "temperature": reading.temperature,
            "humidity": reading.humidity,
            "sample_number": sample_number,
            "position_in_sample": position,
            "sample_complete": position == SAMPLE_SIZE,
            "total_samples": len(temp_data)
        }
        
    except Exception as e:
        logger.error(f"Erro ao processar dados combinados: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao processar dados: {str(e)}")

@app.get("/humidity", response_model=HumidityResponse)
async def get_humidity():
    """
    Obtém a última leitura de umidade
    """
    try:
        data = load_data(HUMIDITY_FILE)
        
        if not data:
            raise HTTPException(
                status_code=404,
                detail="Nenhuma leitura de umidade disponível. ESP32 ainda não enviou dados."
            )
        
        # Pegar última amostra e última umidade
        last_sample = data[-1]
        if not last_sample["Dados"]:
            raise HTTPException(
                status_code=404,
                detail="Nenhuma leitura de umidade disponível."
            )
        
        last_hum = last_sample["Dados"][-1]
        
        return {
            "humidity": last_hum,
            "sample_number": last_sample["Amostra"],
            "position_in_sample": len(last_sample["Dados"]),
            "samples_count": len(data)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao obter umidade: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@app.get("/humidity/history", response_model=HistoryResponse)
async def get_humidity_history(limit: Optional[int] = None):
    """
    Obtém histórico de amostras de umidade
    """
    try:
        data = load_data(HUMIDITY_FILE)
        
        # Aplicar limite se especificado
        samples = data[-limit:] if limit else data
        
        # Calcular total de leituras
        total_readings = sum(len(sample["Dados"]) for sample in data)
        
        return {
            "samples": samples,
            "total_samples": len(data),
            "total_readings": total_readings,
            "current_sample": data[-1] if data else None
        }
        
    except Exception as e:
        logger.error(f"Erro ao obter histórico de umidade: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@app.get("/health")
async def health_check():
    """
    Verifica o status da API
    """
    try:
        # Dados de temperatura
        temp_data = load_data(DATA_FILE)
        temp_total_samples = len(temp_data)
        temp_total_readings = sum(len(sample["Dados"]) for sample in temp_data)
        
        temp_current_sample = None
        if temp_data:
            last_sample = temp_data[-1]
            temp_current_sample = {
                "number": last_sample["Amostra"],
                "readings_count": len(last_sample["Dados"]),
                "is_complete": len(last_sample["Dados"]) == SAMPLE_SIZE
            }
        
        # Dados de umidade
        hum_data = load_data(HUMIDITY_FILE)
        hum_total_samples = len(hum_data)
        hum_total_readings = sum(len(sample["Dados"]) for sample in hum_data)
        
        hum_current_sample = None
        if hum_data:
            last_sample = hum_data[-1]
            hum_current_sample = {
                "number": last_sample["Amostra"],
                "readings_count": len(last_sample["Dados"]),
                "is_complete": len(last_sample["Dados"]) == SAMPLE_SIZE
            }
        
        return {
            "api_status": "healthy",
            "temperature": {
                "total_samples": temp_total_samples,
                "total_readings": temp_total_readings,
                "current_sample": temp_current_sample
            },
            "humidity": {
                "total_samples": hum_total_samples,
                "total_readings": hum_total_readings,
                "current_sample": hum_current_sample
            },
            "data_files": {
                "temperature": str(DATA_FILE.absolute()),
                "humidity": str(HUMIDITY_FILE.absolute())
            },
            "esp32_config": {
                "expected_ip": ESP32_IP,
                "read_interval": ESP32_READ_INTERVAL
            }
        }
        
    except Exception as e:
        return {
            "api_status": "error",
            "error": str(e)
        }

@app.delete("/history")
async def clear_history():
    """
    Limpa todo o histórico de temperatura
    """
    try:
        save_data([], DATA_FILE)
        logger.info("Histórico de temperatura limpo")
        return {"message": "Histórico de temperatura limpo com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao limpar histórico: {str(e)}")

@app.delete("/humidity/history")
async def clear_humidity_history():
    """
    Limpa todo o histórico de umidade
    """
    try:
        save_data([], HUMIDITY_FILE)
        logger.info("Histórico de umidade limpo")
        return {"message": "Histórico de umidade limpo com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao limpar histórico de umidade: {str(e)}")

@app.delete("/history/all")
async def clear_all_history():
    """
    Limpa todo o histórico (temperatura e umidade)
    """
    try:
        save_data([], DATA_FILE)
        save_data([], HUMIDITY_FILE)
        logger.info("Histórico completo limpo")
        return {"message": "Todo histórico limpo com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao limpar histórico: {str(e)}")

# ==================== CEP ENDPOINTS ====================

class CEPAnalysisResponse(BaseModel):
    status: str
    message: str
    data: Optional[Dict] = None
    chart_base64: Optional[str] = None
    report_available: bool = False

@app.post("/cep/analyze")
async def analyze_cep():
    """
    Executa análise CEP nos dados de temperatura
    """
    try:
        # Verificar se há dados suficientes
        data = load_data()
        
        if len(data) < 5:
            raise HTTPException(
                status_code=400,
                detail=f"Dados insuficientes para análise CEP. Necessário mínimo 5 amostras, encontradas {len(data)}"
            )
        
        # Adicionar path do CEP-Prova
        cep_path = Path(__file__).parent.parent / "CEP-Prova" / "src"
        if str(cep_path) not in sys.path:
            sys.path.append(str(cep_path))
        
        from x_r_graphs import XR_graph
        from process_capability import calculate_capability
        
        # Caminhos
        temperature_data_path = str(DATA_FILE.absolute())
        constants_path = str(cep_path / "json_files" / "constantes_cep.json")
        
        # Criar gráfico X-R
        logger.info("Iniciando análise CEP...")
        xr = XR_graph(data_url=temperature_data_path, constants_url=constants_path)
        
        # Limites de especificação
        LSE_TEMP = 28.0
        LIE_TEMP = 18.0
        
        xr.set_specification_limits(LSE_TEMP, LIE_TEMP)
        xr.analyze_control_status()
        calculate_capability(xr, lse=LSE_TEMP, lie=LIE_TEMP, type_chart="X-R")
        
        # Ler gráfico gerado
        chart_path = Path(__file__).parent / "grafico_controle_xr.png"
        chart_base64 = None
        
        if chart_path.exists():
            with open(chart_path, "rb") as f:
                chart_base64 = base64.b64encode(f.read()).decode('utf-8')
        
        # Preparar dados de resposta
        analysis_data = {
            "x_double_mean": float(xr.x_double_mean),
            "r_mean": float(xr.r_mean),
            "sigma": float(xr.sigma),
            "lsc_x_bar": float(xr.lsc_x_bar_graph),
            "lic_x_bar": float(xr.lic_x_bar_graph),
            "lsc_r": float(xr.lsc_r_bar_graph),
            "lic_r": float(xr.lic_r_bar_graph),
            "lse": LSE_TEMP,
            "lie": LIE_TEMP,
            "total_samples": len(data),
            "out_of_control_x": int(len(xr.df[(xr.df['X_bar'] > xr.lsc_x_bar_graph) | (xr.df['X_bar'] < xr.lic_x_bar_graph)])),
            "out_of_control_r": int(len(xr.df[xr.df['R'] > xr.lsc_r_bar_graph]))
        }
        
        # Adicionar capacidade do processo se disponível
        if hasattr(xr, 'capability'):
            analysis_data['capability'] = {
                'rcp': float(xr.capability.rcp) if xr.capability.rcp else None,
                'rcpk': float(xr.capability.rcpk) if xr.capability.rcpk else None,
                'rcps': float(xr.capability.rcps) if xr.capability.rcps else None,
                'rcpi': float(xr.capability.rcpi) if xr.capability.rcpi else None,
            }
        
        logger.info("Análise CEP concluída com sucesso")
        
        return {
            "status": "success",
            "message": "Análise CEP executada com sucesso",
            "data": analysis_data,
            "chart_base64": chart_base64,
            "report_available": True
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro na análise CEP: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Erro ao executar análise CEP: {str(e)}")

@app.get("/cep/chart")
async def get_cep_chart():
    """
    Retorna o gráfico CEP gerado
    """
    try:
        chart_path = Path(__file__).parent / "grafico_controle_xr.png"
        
        if not chart_path.exists():
            raise HTTPException(
                status_code=404,
                detail="Gráfico não encontrado. Execute a análise CEP primeiro."
            )
        
        return FileResponse(
            path=chart_path,
            media_type="image/png",
            filename="grafico_controle_xr.png"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao obter gráfico: {str(e)}")

@app.get("/cep/report")
async def get_cep_report():
    """
    Retorna o relatório HTML gerado
    """
    try:
        report_path = Path(__file__).parent / "relatorio_cep_xr.html"
        
        if not report_path.exists():
            raise HTTPException(
                status_code=404,
                detail="Relatório não encontrado. Execute a análise CEP primeiro."
            )
        
        return FileResponse(
            path=report_path,
            media_type="text/html",
            filename="relatorio_cep_xr.html"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao obter relatório: {str(e)}")

@app.get("/cep/status")
async def get_cep_status():
    """
    Verifica se há análise CEP disponível (temperatura e umidade)
    """
    try:
        temp_data = load_data(DATA_FILE)
        hum_data = load_data(HUMIDITY_FILE)
        
        temp_chart_path = Path(__file__).parent / "grafico_controle_xr_temperature.png"
        hum_chart_path = Path(__file__).parent / "grafico_controle_xr_humidity.png"
        temp_report_path = Path(__file__).parent / "relatorio_cep_temperature.html"
        hum_report_path = Path(__file__).parent / "relatorio_cep_humidity.html"
        
        return {
            "temperature": {
                "data_available": len(temp_data) >= 5,
                "total_samples": len(temp_data),
                "minimum_required": 5,
                "chart_exists": temp_chart_path.exists(),
                "report_exists": temp_report_path.exists(),
                "can_analyze": len(temp_data) >= 5
            },
            "humidity": {
                "data_available": len(hum_data) >= 5,
                "total_samples": len(hum_data),
                "minimum_required": 5,
                "chart_exists": hum_chart_path.exists(),
                "report_exists": hum_report_path.exists(),
                "can_analyze": len(hum_data) >= 5
            },
            "combined_analysis_available": len(temp_data) >= 5 and len(hum_data) >= 5
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao verificar status CEP: {str(e)}")

@app.post("/cep/analyze/combined")
async def analyze_cep_combined():
    """
    Executa análise CEP completa de temperatura E umidade
    """
    try:
        # Verificar dados
        temp_data = load_data(DATA_FILE)
        hum_data = load_data(HUMIDITY_FILE)
        
        if len(temp_data) < 5:
            raise HTTPException(
                status_code=400,
                detail=f"Dados de temperatura insuficientes. Necessário 5 amostras, encontradas {len(temp_data)}"
            )
        
        if len(hum_data) < 5:
            raise HTTPException(
                status_code=400,
                detail=f"Dados de umidade insuficientes. Necessário 5 amostras, encontradas {len(hum_data)}"
            )
        
        # Path CEP-Prova
        cep_path = Path(__file__).parent.parent / "CEP-Prova" / "src"
        if str(cep_path) not in sys.path:
            sys.path.append(str(cep_path))
        
        from x_r_graphs import XR_graph
        from process_capability import calculate_capability
        
        constants_path = str(cep_path / "json_files" / "constantes_cep.json")
        
        # ===== ANÁLISE TEMPERATURA =====
        logger.info("Analisando temperatura...")
        temp_xr = XR_graph(data_url=str(DATA_FILE.absolute()), constants_url=constants_path)
        
        LSE_TEMP = 28.0
        LIE_TEMP = 18.0
        temp_xr.set_specification_limits(LSE_TEMP, LIE_TEMP)
        temp_xr.analyze_control_status()
        calculate_capability(temp_xr, lse=LSE_TEMP, lie=LIE_TEMP, type_chart="X-R")
        
        # Renomear arquivos de temperatura
        temp_chart_old = Path(__file__).parent / "grafico_controle_xr.png"
        temp_chart_new = Path(__file__).parent / "grafico_controle_xr_temperature.png"
        if temp_chart_old.exists():
            import shutil
            shutil.move(str(temp_chart_old), str(temp_chart_new))
        
        temp_report_old = Path(__file__).parent / "relatorio_cep_xr.html"
        temp_report_new = Path(__file__).parent / "relatorio_cep_temperature.html"
        if temp_report_old.exists():
            import shutil
            shutil.move(str(temp_report_old), str(temp_report_new))
        
        # Ler gráfico temperatura
        temp_chart_base64 = None
        if temp_chart_new.exists():
            with open(temp_chart_new, "rb") as f:
                temp_chart_base64 = base64.b64encode(f.read()).decode('utf-8')
        
        # Dados temperatura
        temp_analysis = {
            "x_double_mean": float(temp_xr.x_double_mean),
            "r_mean": float(temp_xr.r_mean),
            "sigma": float(temp_xr.sigma),
            "lsc_x_bar": float(temp_xr.lsc_x_bar_graph),
            "lic_x_bar": float(temp_xr.lic_x_bar_graph),
            "lsc_r": float(temp_xr.lsc_r_bar_graph),
            "lic_r": float(temp_xr.lic_r_bar_graph),
            "lse": LSE_TEMP,
            "lie": LIE_TEMP,
            "total_samples": len(temp_data),
            "out_of_control_x": int(len(temp_xr.df[(temp_xr.df['X_bar'] > temp_xr.lsc_x_bar_graph) | (temp_xr.df['X_bar'] < temp_xr.lic_x_bar_graph)])),
            "out_of_control_r": int(len(temp_xr.df[temp_xr.df['R'] > temp_xr.lsc_r_bar_graph]))
        }
        
        if hasattr(temp_xr, 'capability'):
            temp_analysis['capability'] = {
                'rcp': float(temp_xr.capability.rcp) if temp_xr.capability.rcp else None,
                'rcpk': float(temp_xr.capability.rcpk) if temp_xr.capability.rcpk else None,
                'rcps': float(temp_xr.capability.rcps) if temp_xr.capability.rcps else None,
                'rcpi': float(temp_xr.capability.rcpi) if temp_xr.capability.rcpi else None,
            }
        
        # ===== ANÁLISE UMIDADE =====
        logger.info("Analisando umidade...")
        hum_xr = XR_graph(data_url=str(HUMIDITY_FILE.absolute()), constants_url=constants_path)
        
        LSE_HUM = 70.0
        LIE_HUM = 40.0
        hum_xr.set_specification_limits(LSE_HUM, LIE_HUM)
        hum_xr.analyze_control_status()
        calculate_capability(hum_xr, lse=LSE_HUM, lie=LIE_HUM, type_chart="X-R")
        
        # Renomear arquivos de umidade
        hum_chart_old = Path(__file__).parent / "grafico_controle_xr.png"
        hum_chart_new = Path(__file__).parent / "grafico_controle_xr_humidity.png"
        if hum_chart_old.exists():
            import shutil
            shutil.move(str(hum_chart_old), str(hum_chart_new))
        
        hum_report_old = Path(__file__).parent / "relatorio_cep_xr.html"
        hum_report_new = Path(__file__).parent / "relatorio_cep_humidity.html"
        if hum_report_old.exists():
            import shutil
            shutil.move(str(hum_report_old), str(hum_report_new))
        
        # Ler gráfico umidade
        hum_chart_base64 = None
        if hum_chart_new.exists():
            with open(hum_chart_new, "rb") as f:
                hum_chart_base64 = base64.b64encode(f.read()).decode('utf-8')
        
        # Dados umidade
        hum_analysis = {
            "x_double_mean": float(hum_xr.x_double_mean),
            "r_mean": float(hum_xr.r_mean),
            "sigma": float(hum_xr.sigma),
            "lsc_x_bar": float(hum_xr.lsc_x_bar_graph),
            "lic_x_bar": float(hum_xr.lic_x_bar_graph),
            "lsc_r": float(hum_xr.lsc_r_bar_graph),
            "lic_r": float(hum_xr.lic_r_bar_graph),
            "lse": LSE_HUM,
            "lie": LIE_HUM,
            "total_samples": len(hum_data),
            "out_of_control_x": int(len(hum_xr.df[(hum_xr.df['X_bar'] > hum_xr.lsc_x_bar_graph) | (hum_xr.df['X_bar'] < hum_xr.lic_x_bar_graph)])),
            "out_of_control_r": int(len(hum_xr.df[hum_xr.df['R'] > hum_xr.lsc_r_bar_graph]))
        }
        
        if hasattr(hum_xr, 'capability'):
            hum_analysis['capability'] = {
                'rcp': float(hum_xr.capability.rcp) if hum_xr.capability.rcp else None,
                'rcpk': float(hum_xr.capability.rcpk) if hum_xr.capability.rcpk else None,
                'rcps': float(hum_xr.capability.rcps) if hum_xr.capability.rcps else None,
                'rcpi': float(hum_xr.capability.rcpi) if hum_xr.capability.rcpi else None,
            }
        
        logger.info("Análise CEP combinada concluída com sucesso")
        
        return {
            "status": "success",
            "message": "Análise CEP combinada executada com sucesso",
            "temperature": {
                "data": temp_analysis,
                "chart_base64": temp_chart_base64,
                "report_available": temp_report_new.exists()
            },
            "humidity": {
                "data": hum_analysis,
                "chart_base64": hum_chart_base64,
                "report_available": hum_report_new.exists()
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro na análise CEP combinada: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Erro ao executar análise CEP: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
