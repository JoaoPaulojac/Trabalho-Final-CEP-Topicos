import React from 'react';

function HumidityCard({ humidity, loading, error, onRefresh }) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 hover:border-white/30 transition-all duration-300">
      {/* Cabeçalho */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-3">💧</div>
        <h2 className="text-2xl font-bold text-white mb-2">Umidade do Ar</h2>
        <p className="text-gray-400 text-sm">Medição em tempo real</p>
      </div>

      {/* Display de umidade */}
      <div className="text-center mb-8">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-gray-400">Carregando dados...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500 rounded-xl p-4 mb-4">
            <p className="text-red-300 font-semibold mb-2">❌ Erro ao obter umidade</p>
            <p className="text-sm text-red-400">{error}</p>
          </div>
        ) : humidity !== null ? (
          <div>
            <div className="text-7xl font-bold text-white mb-2 drop-shadow-lg">
              {humidity.toFixed(1)}
              <span className="text-4xl text-blue-400">%</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              <span>Última leitura</span>
            </div>
          </div>
        ) : (
          <div className="text-gray-400">
            <div className="text-5xl mb-3">📊</div>
            <p>Nenhuma leitura disponível</p>
            <p className="text-sm mt-2">Aguardando dados do ESP32...</p>
          </div>
        )}
      </div>

      {/* Indicador de nível de umidade */}
      {humidity !== null && !loading && !error && (
        <div className="mb-6">
          <div className="bg-white/5 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${
                humidity < 30 ? 'bg-red-500' :
                humidity < 40 ? 'bg-orange-500' :
                humidity < 60 ? 'bg-green-500' :
                humidity < 70 ? 'bg-blue-500' :
                'bg-purple-500'
              }`}
              style={{ width: `${Math.min(humidity, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Seco (0%)</span>
            <span>Ideal (40-60%)</span>
            <span>Úmido (100%)</span>
          </div>
          <div className="text-center mt-3">
            <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${
              humidity < 30 ? 'bg-red-500/20 text-red-300' :
              humidity < 40 ? 'bg-orange-500/20 text-orange-300' :
              humidity < 60 ? 'bg-green-500/20 text-green-300' :
              humidity < 70 ? 'bg-blue-500/20 text-blue-300' :
              'bg-purple-500/20 text-purple-300'
            }`}>
              {humidity < 30 ? '🔥 Muito Seco' :
               humidity < 40 ? '⚠️ Seco' :
               humidity < 60 ? '✅ Ideal' :
               humidity < 70 ? '💧 Úmido' :
               '💦 Muito Úmido'}
            </span>
          </div>
        </div>
      )}

      {/* Botão de atualizar */}
      <div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span className={loading ? 'animate-spin' : ''}>🔄</span>
          {loading ? 'Atualizando...' : 'Atualizar'}
        </button>
      </div>
    </div>
  );
}

export default HumidityCard;
