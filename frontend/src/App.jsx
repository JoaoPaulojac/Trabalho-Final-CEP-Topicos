import React, { useState, useEffect } from 'react';
import TemperatureCard from './components/TemperatureCard';
import CEPAnalysis from './components/CEPAnalysis';

const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [temperature, setTemperature] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiHealth, setApiHealth] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState('monitor'); // 'monitor' ou 'cep'

  // Função para buscar temperatura
  const fetchTemperature = async () => {
    setLoading(true);
    setError(null);
    
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
      setError(err.message);
      console.error('Erro ao buscar temperatura:', err);
    } finally {
      setLoading(false);
    }
  };

  // Função para verificar saúde da API
  const checkHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      setApiHealth(data);
    } catch (err) {
      setApiHealth({ api_status: 'error', esp32_status: 'disconnected' });
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
        fetchTemperature();
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
              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentPage('monitor')}
                  className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                >
                  📊 Monitor
                </button>
                <button
                  onClick={() => setCurrentPage('cep')}
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold"
                >
                  📈 Análise CEP
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
            <div className="text-white text-xl font-bold">🌡️ ESP32 Monitor</div>
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentPage('monitor')}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold"
              >
                📊 Monitor
              </button>
              <button
                onClick={() => setCurrentPage('cep')}
                className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all"
              >
                📈 Análise CEP
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex justify-center items-center p-5" style={{ minHeight: 'calc(100vh - 73px)' }}>
        <div className="max-w-[600px] w-full">
          <header className="text-center mb-8 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
              🌡️ ESP32 Temperature Monitor
            </h1>
            <p className="text-gray-400 text-base md:text-lg">
              Monitoramento em tempo real via FastAPI
            </p>
          </header>

          <div className="flex flex-col sm:flex-row justify-around mb-5 gap-3">
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
                apiHealth?.total_readings > 0
                  ? 'bg-green-500 shadow-[0_0_10px_#2ecc71]' 
                  : 'bg-yellow-500 shadow-[0_0_10px_#f39c12]'
              }`}></span>
              <span>Amostras: {apiHealth?.total_samples || 0} ({apiHealth?.total_readings || 0} leituras)</span>
            </div>
          </div>

          <TemperatureCard
            temperature={temperature}
            loading={loading}
            error={error}
            onRefresh={fetchTemperature}
            autoRefresh={autoRefresh}
            onToggleAutoRefresh={() => setAutoRefresh(!autoRefresh)}
          />

          <footer className="text-center mt-8 text-gray-500 text-sm">
            <p>Desenvolvido com React + FastAPI + ESP32</p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;

