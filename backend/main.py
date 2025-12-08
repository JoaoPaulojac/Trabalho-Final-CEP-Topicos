from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
from pydantic import BaseModel
import logging
import json
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv
import os

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

# Arquivo JSON para armazenar dados
DATA_FILE = Path("temperature_data.json")

# Configurações do ESP32 (carregadas do .env)
ESP32_IP = os.getenv("ESP32_IP", "192.168.1.100")
ESP32_READ_INTERVAL = int(os.getenv("ESP32_READ_INTERVAL", "30"))

# Tamanho de cada amostra
SAMPLE_SIZE = 5

class TemperatureReading(BaseModel):
    temperature: float
    timestamp: Optional[int] = None

class Sample(BaseModel):
    Amostra: str
    Dados: List[float]

class TemperatureResponse(BaseModel):
    temperature: float
    sample_number: str
    position_in_sample: int
    samples_count: int

class HistoryResponse(BaseModel):
    samples: List[Sample]
    total_samples: int
    total_readings: int
    current_sample: Optional[Sample] = None

# Inicializar arquivo JSON se não existir
def init_data_file():
    if not DATA_FILE.exists():
        DATA_FILE.write_text(json.dumps([], indent=2))
        logger.info("Arquivo de dados criado")

def load_data():
    """Carrega dados do arquivo JSON"""
    try:
        data = json.loads(DATA_FILE.read_text())
        # Se for formato antigo, converte para novo
        if isinstance(data, dict) and "readings" in data:
            return []
        return data if isinstance(data, list) else []
    except Exception as e:
        logger.error(f"Erro ao carregar dados: {e}")
        return []

def save_data(data):
    """Salva dados no arquivo JSON"""
    try:
        DATA_FILE.write_text(json.dumps(data, indent=2))
        logger.info("Dados salvos com sucesso")
    except Exception as e:
        logger.error(f"Erro ao salvar dados: {e}")

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
    Obtém histórico de amostras
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

@app.get("/health")
async def health_check():
    """
    Verifica o status da API
    """
    try:
        data = load_data()
        total_samples = len(data)
        total_readings = sum(len(sample["Dados"]) for sample in data)
        
        current_sample = None
        if data:
            last_sample = data[-1]
            current_sample = {
                "number": last_sample["Amostra"],
                "readings_count": len(last_sample["Dados"]),
                "is_complete": len(last_sample["Dados"]) == SAMPLE_SIZE
            }
        
        return {
            "api_status": "healthy",
            "total_samples": total_samples,
            "total_readings": total_readings,
            "current_sample": current_sample,
            "data_file": str(DATA_FILE.absolute()),
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
    Limpa todo o histórico de leituras
    """
    try:
        save_data([])
        logger.info("Histórico limpo")
        return {"message": "Histórico limpo com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao limpar histórico: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
