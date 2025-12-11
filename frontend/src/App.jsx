import React, { useState, useEffect } from 'react';
import TemperatureCard from './components/TemperatureCard';
import HumidityCard from './components/HumidityCard';
import CEPAnalysis from './components/CEPAnalysis';

const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [loadingTemp, setLoadingTemp] = useState(false);
  const [loadingHum, setLoadingHum] = useState(false);
  const [errorTemp, setErrorTemp] = useState(null);
  const [errorHum, setErrorHum] = useState(null);
  const [apiHealth, setApiHealth] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState('monitor'); // 'monitor' ou 'cep'

  // Função para buscar temperatura
  const fetchTemperature = async () => {
    setLoadingTemp(true);
    setErrorTemp(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/temperature`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setTemperature(data.temperature);
    } catch (err) {
      setErrorTemp(err.message);
      console.error('Erro ao buscar temperatura:', err);
    } finally {
      setLoadingTemp(false);
    }
  };

  // Função para buscar umidade
  const fetchHumidity = async () => {
    setLoadingHum(true);
    setErrorHum(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/humidity`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setHumidity(data.humidity);
    } catch (err) {
      setErrorHum(err.message);
      console.error('Erro ao buscar umidade:', err);
    } finally {
      setLoadingHum(false);
    }
  };

  // Função para buscar ambos
  const fetchBoth = () => {
    fetchTemperature();
    fetchHumidity();
  };

  // Função para verificar saúde da API
  const checkHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      setApiHealth(data);
    } catch (err) {
      setApiHealth({ api_status: 'error' });
      console.error('Erro ao verificar saúde da API:', err);
    }
  };

  // Verificar saúde ao carregar
  useEffect(() => {
    checkHealth();
  }, []);

  // Auto-refresh
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchBoth();
      }, 5000); // Atualiza a cada 5 segundos
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  // Renderizar página CEP
  if (currentPage === 'cep') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1e1e2f] via-[#252540] to-[#2a2a4a]">
        {/* Navegação */}
        <nav className="bg-white/5 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="text-white text-xl font-bold">🌡️ ESP32 Monitor</div>
              <div className="flex gap-2 flex-wrap justify-end">
                <button
                  onClick={() => setCurrentPage('monitor')}
                  className="px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all text-sm md:text-base"
                >
                  📊 Monitor
                </button>
                <button
                  onClick={() => setCurrentPage('cep')}
                  className="px-3 py-2 rounded-lg bg-blue-500 text-white font-semibold text-sm md:text-base"
                >
                  📈 CEP
                </button>
              </div>
            </div>
          </div>
        </nav>
        
        <CEPAnalysis />
      </div>
    );
  }

  // Renderizar página principal (Monitor)
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1e2f] via-[#252540] to-[#2a2a4a]">
      {/* Navegação */}
      <nav className="bg-white/5 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-white text-xl font-bold">🌡️💧 ESP32 Monitor</div>
            <div className="flex gap-2 flex-wrap justify-end">
              <button
                onClick={() => setCurrentPage('monitor')}
                className="px-3 py-2 rounded-lg bg-blue-500 text-white font-semibold text-sm md:text-base"
              >
                📊 Monitor
              </button>
              <button
                onClick={() => setCurrentPage('cep')}
                className="px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all text-sm md:text-base"
              >
                📈 CEP
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="p-5" style={{ minHeight: 'calc(100vh - 73px)' }}>
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-8 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
              🌡️ ESP32 Climate Monitor 💧
            </h1>
            <p className="text-gray-400 text-base md:text-lg">
              Monitoramento de Temperatura e Umidade em tempo real
            </p>
          </header>

          {/* Status da API */}
          <div className="flex flex-col md:flex-row justify-center mb-6 gap-3 max-w-4xl mx-auto">
            <div className={`flex items-center gap-2 px-5 py-3 bg-white/10 backdrop-blur-md rounded-full text-white text-sm border border-white/20 flex-1 justify-center`}>
              <span className={`w-2.5 h-2.5 rounded-full animate-pulse-slow ${
                apiHealth?.api_status === 'healthy' 
                  ? 'bg-green-500 shadow-[0_0_10px_#2ecc71]' 
                  : 'bg-red-500 shadow-[0_0_10px_#e74c3c]'
              }`}></span>
              <span>API: {apiHealth?.api_status || 'checking...'}</span>
            </div>
            
            <div className={`flex items-center gap-2 px-5 py-3 bg-white/10 backdrop-blur-md rounded-full text-white text-sm border border-white/20 flex-1 justify-center`}>
              <span className={`w-2.5 h-2.5 rounded-full animate-pulse-slow ${
                apiHealth?.temperature?.total_readings > 0
                  ? 'bg-green-500 shadow-[0_0_10px_#2ecc71]' 
                  : 'bg-yellow-500 shadow-[0_0_10px_#f39c12]'
              }`}></span>
              <span>🌡️ Temp: {apiHealth?.temperature?.total_samples || 0} ({apiHealth?.temperature?.total_readings || 0})</span>
            </div>

            <div className={`flex items-center gap-2 px-5 py-3 bg-white/10 backdrop-blur-md rounded-full text-white text-sm border border-white/20 flex-1 justify-center`}>
              <span className={`w-2.5 h-2.5 rounded-full animate-pulse-slow ${
                apiHealth?.humidity?.total_readings > 0
                  ? 'bg-green-500 shadow-[0_0_10px_#2ecc71]' 
                  : 'bg-yellow-500 shadow-[0_0_10px_#f39c12]'
              }`}></span>
              <span>💧 Umid: {apiHealth?.humidity?.total_samples || 0} ({apiHealth?.humidity?.total_readings || 0})</span>
            </div>
          </div>

          {/* Cards de Temperatura e Umidade lado a lado */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto mb-6">
            <TemperatureCard
              temperature={temperature}
              loading={loadingTemp}
              error={errorTemp}
              onRefresh={fetchTemperature}
            />

            <HumidityCard
              humidity={humidity}
              loading={loadingHum}
              error={errorHum}
              onRefresh={fetchHumidity}
            />
          </div>

          {/* Botão de Auto-Refresh Centralizado */}
          <div className="max-w-md mx-auto mb-8">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`w-full font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl flex items-center justify-center gap-3 text-lg ${
                autoRefresh
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white animate-pulse-slow'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
              }`}
            >
              <span className="text-2xl">{autoRefresh ? '⏸️' : '▶️'}</span>
              <span>{autoRefresh ? 'Auto-Refresh Ativo (5s)' : 'Ativar Auto-Refresh (5s)'}</span>
            </button>
            {autoRefresh && (
              <p className="text-center text-gray-400 text-sm mt-3">
                ⚡ Atualizando automaticamente a cada 5 segundos
              </p>
            )}
          </div>

          <footer className="text-center mt-8 text-gray-500 text-sm">
            <p>Desenvolvido com React + FastAPI + ESP32 + CEP</p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;

