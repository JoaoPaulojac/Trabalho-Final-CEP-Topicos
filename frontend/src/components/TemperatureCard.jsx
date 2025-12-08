import React from 'react';

function TemperatureCard({ temperature, loading, error, onRefresh, autoRefresh, onToggleAutoRefresh }) {
  
  const getTemperatureColor = (temp) => {
    if (temp === null || temp === undefined) return 'text-white';
    if (temp < 20) return 'text-[#4cc9f0]'; // Azul (frio)
    if (temp >= 20 && temp < 30) return 'text-[#2ecc71]'; // Verde (agradável)
    return 'text-[#e74c3c]'; // Vermelho (quente)
  };

  const getTemperatureStatus = (temp) => {
    if (temp === null || temp === undefined) return 'Aguardando leitura...';
    if (temp < 20) return 'Frio';
    if (temp >= 20 && temp < 30) return 'Agradável';
    return 'Quente';
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] border border-white/20 text-center mb-5">
      <div className="text-6xl mb-2.5 animate-float">🌡️</div>
      <div className="tracking-[2px] text-[#ccc] text-sm mb-5">TEMPERATURA ATUAL</div>
      
      <div className="my-5 flex items-start justify-center gap-1.5">
        {error ? (
          <div className="flex flex-col items-center gap-2.5 text-[#e74c3c] text-base">
            <span className="text-5xl">⚠️</span>
            <span>{error}</span>
          </div>
        ) : (
          <>
            <span 
              className={`text-[5rem] font-bold leading-none transition-colors duration-500 drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)] ${getTemperatureColor(temperature)}`}
            >
              {loading ? '...' : temperature !== null ? temperature.toFixed(1) : '--'}
            </span>
            <span className="text-3xl text-gray-400 mt-2.5">°C</span>
          </>
        )}
      </div>

      {temperature !== null && !error && (
        <div className={`text-xl font-bold mb-5 uppercase tracking-wide transition-colors duration-500 ${getTemperatureColor(temperature)}`}>
          {getTemperatureStatus(temperature)}
        </div>
      )}

      <div className="flex flex-col gap-4 mt-8">
        <button 
          className={`bg-gradient-to-r from-[#4cc9f0] to-[#4361ee] border-none px-8 py-4 text-white rounded-full text-lg font-bold cursor-pointer shadow-[0_4px_15px_rgba(67,97,238,0.4)] transition-all duration-300 uppercase ${
            loading 
              ? 'bg-gray-600 cursor-wait transform-none' 
              : 'hover:translate-y-[-2px] hover:shadow-[0_6px_20px_rgba(67,97,238,0.6)] active:scale-[0.98]'
          }`}
          onClick={onRefresh}
          disabled={loading}
        >
          {loading ? 'LENDO SENSOR...' : 'ATUALIZAR MEDIÇÃO'}
        </button>

        <label className="flex items-center justify-center gap-2.5 text-[#ccc] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={onToggleAutoRefresh}
            className="w-[18px] h-[18px] cursor-pointer accent-[#4cc9f0]"
          />
          <span>Auto-refresh (5s)</span>
        </label>
      </div>

      {!error && (
        <div className="text-[0.85rem] text-gray-500 mt-5">
          {loading ? 'Aguardando resposta...' : 'Clique para atualizar a temperatura'}
        </div>
      )}
    </div>
  );
}

export default TemperatureCard;

