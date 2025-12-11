import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8000';

function CEPAnalysis() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);

  // Verificar status ao carregar
  useEffect(() => {
    checkStatus();
  }, []);

  // Verificar status CEP
  const checkStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cep/status`);
      const data = await response.json();
      setStatus(data);
    } catch (err) {
      console.error('Erro ao verificar status CEP:', err);
    }
  };

  // Executar análise CEP combinada
  const runAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/cep/analyze/combined`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao executar análise');
      }

      const data = await response.json();
      setAnalysis(data);
      await checkStatus(); // Atualizar status
    } catch (err) {
      setError(err.message);
      console.error('Erro na análise CEP:', err);
    } finally {
      setLoading(false);
    }
  };

  const canAnalyze = status?.combined_analysis_available || false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1e2f] via-[#252540] to-[#2a2a4a] p-5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
            📊 Análise CEP - Controle Estatístico de Processo
          </h1>
          <p className="text-gray-400 text-base md:text-lg">
            Análise estatística de Temperatura e Umidade
          </p>
        </header>

        {/* Status Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">Status do Sistema</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            {/* Status Temperatura */}
            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                🌡️ Temperatura
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Amostras:</span>
                  <span className="text-white font-semibold">{status?.temperature?.total_samples || 0} / 5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className={status?.temperature?.can_analyze ? 'text-green-400' : 'text-yellow-400'}>
                    {status?.temperature?.can_analyze ? '✓ Pronto' : '⏳ Aguardando'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Relatório:</span>
                  <span className={status?.temperature?.report_exists ? 'text-green-400' : 'text-gray-500'}>
                    {status?.temperature?.report_exists ? '✓' : '✗'}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Umidade */}
            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                💧 Umidade
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Amostras:</span>
                  <span className="text-white font-semibold">{status?.humidity?.total_samples || 0} / 5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className={status?.humidity?.can_analyze ? 'text-green-400' : 'text-yellow-400'}>
                    {status?.humidity?.can_analyze ? '✓ Pronto' : '⏳ Aguardando'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Relatório:</span>
                  <span className={status?.humidity?.report_exists ? 'text-green-400' : 'text-gray-500'}>
                    {status?.humidity?.report_exists ? '✓' : '✗'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Botão Gerar Análise */}
          <button
            onClick={runAnalysis}
            disabled={loading || !canAnalyze}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
              loading || !canAnalyze
                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
            } text-white`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Executando Análise CEP Combinada...
              </span>
            ) : (
              '🔬 Gerar Análise CEP (Temperatura + Umidade)'
            )}
          </button>

          {!canAnalyze && status && (
            <div className="mt-3 text-center text-yellow-400 text-sm">
              ⚠️ Colete pelo menos 5 amostras de temperatura e umidade para realizar a análise
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-xl p-4 mb-6 text-white">
            <strong>❌ Erro:</strong> {error}
          </div>
        )}

        {/* Resultados da Análise Combinada */}
        {analysis && analysis.status === 'success' && (
          <div className="space-y-6">
            {/* Gráficos de Controle - Lado a Lado */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico Temperatura */}
              {analysis.temperature?.chart_base64 && (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">🌡️ Controle X-R - Temperatura</h2>
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = `data:image/png;base64,${analysis.temperature.chart_base64}`;
                        link.download = 'grafico_temperatura.png';
                        link.click();
                      }}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm transition-colors"
                    >
                      📥 Baixar
                    </button>
                  </div>
                  <img
                    src={`data:image/png;base64,${analysis.temperature.chart_base64}`}
                    alt="Gráfico de Controle CEP - Temperatura"
                    className="w-full rounded-lg"
                  />
                </div>
              )}

              {/* Gráfico Umidade */}
              {analysis.humidity?.chart_base64 && (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">💧 Controle X-R - Umidade</h2>
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = `data:image/png;base64,${analysis.humidity.chart_base64}`;
                        link.download = 'grafico_umidade.png';
                        link.click();
                      }}
                      className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white text-sm transition-colors"
                    >
                      📥 Baixar
                    </button>
                  </div>
                  <img
                    src={`data:image/png;base64,${analysis.humidity.chart_base64}`}
                    alt="Gráfico de Controle CEP - Umidade"
                    className="w-full rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Estatísticas - Lado a Lado */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Estatísticas Temperatura */}
              {analysis.temperature?.data && (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <h2 className="text-2xl font-bold text-white mb-4">🌡️ Estatísticas - Temperatura</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">X̄̄</div>
                      <div className="text-2xl font-bold text-white">
                        {analysis.temperature.data.x_double_mean.toFixed(2)}°C
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">R̄</div>
                      <div className="text-2xl font-bold text-white">
                        {analysis.temperature.data.r_mean.toFixed(2)}°C
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">σ</div>
                      <div className="text-2xl font-bold text-white">
                        {analysis.temperature.data.sigma.toFixed(2)}°C
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">Amostras</div>
                      <div className="text-2xl font-bold text-white">
                        {analysis.temperature.data.total_samples}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Estatísticas Umidade */}
              {analysis.humidity?.data && (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <h2 className="text-2xl font-bold text-white mb-4">💧 Estatísticas - Umidade</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">X̄̄</div>
                      <div className="text-2xl font-bold text-white">
                        {analysis.humidity.data.x_double_mean.toFixed(2)}%
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">R̄</div>
                      <div className="text-2xl font-bold text-white">
                        {analysis.humidity.data.r_mean.toFixed(2)}%
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">σ</div>
                      <div className="text-2xl font-bold text-white">
                        {analysis.humidity.data.sigma.toFixed(2)}%
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">Amostras</div>
                      <div className="text-2xl font-bold text-white">
                        {analysis.humidity.data.total_samples}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Limites de Controle - Lado a Lado */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Limites Temperatura */}
              {analysis.temperature?.data && (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <h2 className="text-2xl font-bold text-white mb-4">🌡️ Limites de Controle - Temperatura</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Gráfico X̄</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center bg-red-500/20 rounded p-2">
                          <span className="text-gray-300 text-sm">LSC</span>
                          <span className="font-bold text-white">{analysis.temperature.data.lsc_x_bar.toFixed(2)}°C</span>
                        </div>
                        <div className="flex justify-between items-center bg-green-500/20 rounded p-2">
                          <span className="text-gray-300 text-sm">LC</span>
                          <span className="font-bold text-white">{analysis.temperature.data.x_double_mean.toFixed(2)}°C</span>
                        </div>
                        <div className="flex justify-between items-center bg-red-500/20 rounded p-2">
                          <span className="text-gray-300 text-sm">LIC</span>
                          <span className="font-bold text-white">{analysis.temperature.data.lic_x_bar.toFixed(2)}°C</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Gráfico R</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center bg-red-500/20 rounded p-2">
                          <span className="text-gray-300 text-sm">LSC</span>
                          <span className="font-bold text-white">{analysis.temperature.data.lsc_r.toFixed(2)}°C</span>
                        </div>
                        <div className="flex justify-between items-center bg-green-500/20 rounded p-2">
                          <span className="text-gray-300 text-sm">LC</span>
                          <span className="font-bold text-white">{analysis.temperature.data.r_mean.toFixed(2)}°C</span>
                        </div>
                        <div className="flex justify-between items-center bg-red-500/20 rounded p-2">
                          <span className="text-gray-300 text-sm">LIC</span>
                          <span className="font-bold text-white">{analysis.temperature.data.lic_r.toFixed(2)}°C</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Limites Umidade */}
              {analysis.humidity?.data && (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <h2 className="text-2xl font-bold text-white mb-4">💧 Limites de Controle - Umidade</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Gráfico X̄</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center bg-red-500/20 rounded p-2">
                          <span className="text-gray-300 text-sm">LSC</span>
                          <span className="font-bold text-white">{analysis.humidity.data.lsc_x_bar.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between items-center bg-green-500/20 rounded p-2">
                          <span className="text-gray-300 text-sm">LC</span>
                          <span className="font-bold text-white">{analysis.humidity.data.x_double_mean.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between items-center bg-red-500/20 rounded p-2">
                          <span className="text-gray-300 text-sm">LIC</span>
                          <span className="font-bold text-white">{analysis.humidity.data.lic_x_bar.toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Gráfico R</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center bg-red-500/20 rounded p-2">
                          <span className="text-gray-300 text-sm">LSC</span>
                          <span className="font-bold text-white">{analysis.humidity.data.lsc_r.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between items-center bg-green-500/20 rounded p-2">
                          <span className="text-gray-300 text-sm">LC</span>
                          <span className="font-bold text-white">{analysis.humidity.data.r_mean.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between items-center bg-red-500/20 rounded p-2">
                          <span className="text-gray-300 text-sm">LIC</span>
                          <span className="font-bold text-white">{analysis.humidity.data.lic_r.toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Limites de Especificação - Lado a Lado */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Especificação Temperatura */}
              {analysis.temperature?.data && (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <h2 className="text-2xl font-bold text-white mb-4">🌡️ Limites de Especificação - Temperatura</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">LSE</div>
                      <div className="text-3xl font-bold text-red-400">
                        {analysis.temperature.data.lse}°C
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">LIE</div>
                      <div className="text-3xl font-bold text-blue-400">
                        {analysis.temperature.data.lie}°C
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Especificação Umidade */}
              {analysis.humidity?.data && (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <h2 className="text-2xl font-bold text-white mb-4">💧 Limites de Especificação - Umidade</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">LSE</div>
                      <div className="text-3xl font-bold text-red-400">
                        {analysis.humidity.data.lse}%
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">LIE</div>
                      <div className="text-3xl font-bold text-blue-400">
                        {analysis.humidity.data.lie}%
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Status de Controle - Lado a Lado */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Status Temperatura */}
              {analysis.temperature?.data && (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <h2 className="text-2xl font-bold text-white mb-4">🌡️ Status de Controle - Temperatura</h2>
                  
                  <div className="space-y-3">
                    <div className={`rounded-lg p-4 ${
                      analysis.temperature.data.out_of_control_x === 0 
                        ? 'bg-green-500/20 border border-green-500' 
                        : 'bg-red-500/20 border border-red-500'
                    }`}>
                      <div className="text-white font-semibold mb-1">Gráfico X̄</div>
                      <div className="text-xl font-bold text-white">
                        {analysis.temperature.data.out_of_control_x === 0 ? '✓ SOB CONTROLE' : `✗ ${analysis.temperature.data.out_of_control_x} FORA`}
                      </div>
                    </div>

                    <div className={`rounded-lg p-4 ${
                      analysis.temperature.data.out_of_control_r === 0 
                        ? 'bg-green-500/20 border border-green-500' 
                        : 'bg-red-500/20 border border-red-500'
                    }`}>
                      <div className="text-white font-semibold mb-1">Gráfico R</div>
                      <div className="text-xl font-bold text-white">
                        {analysis.temperature.data.out_of_control_r === 0 ? '✓ SOB CONTROLE' : `✗ ${analysis.temperature.data.out_of_control_r} FORA`}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Umidade */}
              {analysis.humidity?.data && (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <h2 className="text-2xl font-bold text-white mb-4">💧 Status de Controle - Umidade</h2>
                  
                  <div className="space-y-3">
                    <div className={`rounded-lg p-4 ${
                      analysis.humidity.data.out_of_control_x === 0 
                        ? 'bg-green-500/20 border border-green-500' 
                        : 'bg-red-500/20 border border-red-500'
                    }`}>
                      <div className="text-white font-semibold mb-1">Gráfico X̄</div>
                      <div className="text-xl font-bold text-white">
                        {analysis.humidity.data.out_of_control_x === 0 ? '✓ SOB CONTROLE' : `✗ ${analysis.humidity.data.out_of_control_x} FORA`}
                      </div>
                    </div>

                    <div className={`rounded-lg p-4 ${
                      analysis.humidity.data.out_of_control_r === 0 
                        ? 'bg-green-500/20 border border-green-500' 
                        : 'bg-red-500/20 border border-red-500'
                    }`}>
                      <div className="text-white font-semibold mb-1">Gráfico R</div>
                      <div className="text-xl font-bold text-white">
                        {analysis.humidity.data.out_of_control_r === 0 ? '✓ SOB CONTROLE' : `✗ ${analysis.humidity.data.out_of_control_r} FORA`}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Capacidade do Processo - Lado a Lado */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Capacidade Temperatura */}
              {analysis.temperature?.data?.capability && (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <h2 className="text-2xl font-bold text-white mb-4">🌡️ Capacidade - Temperatura</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {analysis.temperature.data.capability.rcp !== null && (
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-gray-400 text-sm mb-1">Cp</div>
                        <div className={`text-2xl font-bold ${
                          analysis.temperature.data.capability.rcp >= 1.33 ? 'text-green-400' :
                          analysis.temperature.data.capability.rcp >= 1.0 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {analysis.temperature.data.capability.rcp.toFixed(3)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {analysis.temperature.data.capability.rcp >= 1.33 ? '✓ Capaz' :
                           analysis.temperature.data.capability.rcp >= 1.0 ? '⚠️ Aceitável' :
                           '✗ Incapaz'}
                        </div>
                      </div>
                    )}

                    {analysis.temperature.data.capability.rcpk !== null && (
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-gray-400 text-sm mb-1">Cpk</div>
                        <div className={`text-2xl font-bold ${
                          analysis.temperature.data.capability.rcpk >= 1.33 ? 'text-green-400' :
                          analysis.temperature.data.capability.rcpk >= 1.0 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {analysis.temperature.data.capability.rcpk.toFixed(3)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {analysis.temperature.data.capability.rcpk >= 1.33 ? '✓ Capaz' :
                           analysis.temperature.data.capability.rcpk >= 1.0 ? '⚠️ Aceitável' :
                           '✗ Incapaz'}
                        </div>
                      </div>
                    )}

                    {analysis.temperature.data.capability.rcps !== null && (
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-gray-400 text-sm mb-1">Cps</div>
                        <div className="text-2xl font-bold text-white">
                          {analysis.temperature.data.capability.rcps.toFixed(3)}
                        </div>
                      </div>
                    )}

                    {analysis.temperature.data.capability.rcpi !== null && (
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-gray-400 text-sm mb-1">Cpi</div>
                        <div className="text-2xl font-bold text-white">
                          {analysis.temperature.data.capability.rcpi.toFixed(3)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Capacidade Umidade */}
              {analysis.humidity?.data?.capability && (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <h2 className="text-2xl font-bold text-white mb-4">💧 Capacidade - Umidade</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {analysis.humidity.data.capability.rcp !== null && (
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-gray-400 text-sm mb-1">Cp</div>
                        <div className={`text-2xl font-bold ${
                          analysis.humidity.data.capability.rcp >= 1.33 ? 'text-green-400' :
                          analysis.humidity.data.capability.rcp >= 1.0 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {analysis.humidity.data.capability.rcp.toFixed(3)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {analysis.humidity.data.capability.rcp >= 1.33 ? '✓ Capaz' :
                           analysis.humidity.data.capability.rcp >= 1.0 ? '⚠️ Aceitável' :
                           '✗ Incapaz'}
                        </div>
                      </div>
                    )}

                    {analysis.humidity.data.capability.rcpk !== null && (
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-gray-400 text-sm mb-1">Cpk</div>
                        <div className={`text-2xl font-bold ${
                          analysis.humidity.data.capability.rcpk >= 1.33 ? 'text-green-400' :
                          analysis.humidity.data.capability.rcpk >= 1.0 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {analysis.humidity.data.capability.rcpk.toFixed(3)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {analysis.humidity.data.capability.rcpk >= 1.33 ? '✓ Capaz' :
                           analysis.humidity.data.capability.rcpk >= 1.0 ? '⚠️ Aceitável' :
                           '✗ Incapaz'}
                        </div>
                      </div>
                    )}

                    {analysis.humidity.data.capability.rcps !== null && (
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-gray-400 text-sm mb-1">Cps</div>
                        <div className="text-2xl font-bold text-white">
                          {analysis.humidity.data.capability.rcps.toFixed(3)}
                        </div>
                      </div>
                    )}

                    {analysis.humidity.data.capability.rcpi !== null && (
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-gray-400 text-sm mb-1">Cpi</div>
                        <div className="text-2xl font-bold text-white">
                          {analysis.humidity.data.capability.rcpi.toFixed(3)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ===== PROBABILIDADE DE SUCESSO ===== */}
              {analysis.probability_analysis && (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mt-6">
                  <h2 className="text-2xl font-bold text-white mb-6">📊 Probabilidade de Sucesso</h2>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Temperatura */}
                    {analysis.probability_analysis.temperature && (
                      <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-4 border border-orange-500/30">
                        <h3 className="text-lg font-semibold text-white mb-4">🌡️ Temperatura</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Taxa de Sucesso:</span>
                            <span className="text-orange-300 font-semibold">{(analysis.probability_analysis.temperature.success_rate * 100).toFixed(2)}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Prob. Exata P(X=n):</span>
                            <span className="text-orange-300 font-semibold">{(analysis.probability_analysis.temperature.exact_probability * 100).toFixed(4)}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Prob. Acumulada P(X≤n):</span>
                            <span className="text-orange-300 font-semibold">{(analysis.probability_analysis.temperature.cumulative_probability * 100).toFixed(4)}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Esperança (μ):</span>
                            <span className="text-orange-300 font-semibold">{analysis.probability_analysis.temperature.expected_value.toFixed(4)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Desvio Padrão (σ):</span>
                            <span className="text-orange-300 font-semibold">{analysis.probability_analysis.temperature.standard_deviation.toFixed(4)}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Umidade */}
                    {analysis.probability_analysis.humidity && (
                      <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/30">
                        <h3 className="text-lg font-semibold text-white mb-4">💧 Umidade</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Taxa de Sucesso:</span>
                            <span className="text-blue-300 font-semibold">{(analysis.probability_analysis.humidity.success_rate * 100).toFixed(2)}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Prob. Exata P(X=n):</span>
                            <span className="text-blue-300 font-semibold">{(analysis.probability_analysis.humidity.exact_probability * 100).toFixed(4)}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Prob. Acumulada P(X≤n):</span>
                            <span className="text-blue-300 font-semibold">{(analysis.probability_analysis.humidity.cumulative_probability * 100).toFixed(4)}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Esperança (μ):</span>
                            <span className="text-blue-300 font-semibold">{analysis.probability_analysis.humidity.expected_value.toFixed(4)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Desvio Padrão (σ):</span>
                            <span className="text-blue-300 font-semibold">{analysis.probability_analysis.humidity.standard_deviation.toFixed(4)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ===== CÁLCULOS DE ARRANJOS ===== */}
              {analysis.arrangements_analysis && (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mt-6">
                  <h2 className="text-2xl font-bold text-white mb-6">🔢 Cálculos de Arranjos</h2>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Temperatura */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-orange-300 mb-4">🌡️ Temperatura</h3>
                      
                      {analysis.arrangements_analysis.temperature_arrangements_5_2 && (
                        <div className="bg-white/5 rounded-lg p-4 border border-orange-500/20">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400 text-sm">A(5,2)</span>
                            <span className="text-orange-300 font-semibold text-lg">{analysis.arrangements_analysis.temperature_arrangements_5_2.arrangements}</span>
                          </div>
                          <div className="text-xs text-gray-500">{analysis.arrangements_analysis.temperature_arrangements_5_2.formula}</div>
                        </div>
                      )}
                      
                      {analysis.arrangements_analysis.temperature_arrangements_5_3 && (
                        <div className="bg-white/5 rounded-lg p-4 border border-orange-500/20">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400 text-sm">A(5,3)</span>
                            <span className="text-orange-300 font-semibold text-lg">{analysis.arrangements_analysis.temperature_arrangements_5_3.arrangements}</span>
                          </div>
                          <div className="text-xs text-gray-500">{analysis.arrangements_analysis.temperature_arrangements_5_3.formula}</div>
                        </div>
                      )}
                    </div>

                    {/* Umidade */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-blue-300 mb-4">💧 Umidade</h3>
                      
                      {analysis.arrangements_analysis.humidity_arrangements_5_2 && (
                        <div className="bg-white/5 rounded-lg p-4 border border-blue-500/20">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400 text-sm">A(5,2)</span>
                            <span className="text-blue-300 font-semibold text-lg">{analysis.arrangements_analysis.humidity_arrangements_5_2.arrangements}</span>
                          </div>
                          <div className="text-xs text-gray-500">{analysis.arrangements_analysis.humidity_arrangements_5_2.formula}</div>
                        </div>
                      )}
                      
                      {analysis.arrangements_analysis.humidity_arrangements_5_3 && (
                        <div className="bg-white/5 rounded-lg p-4 border border-blue-500/20">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400 text-sm">A(5,3)</span>
                            <span className="text-blue-300 font-semibold text-lg">{analysis.arrangements_analysis.humidity_arrangements_5_3.arrangements}</span>
                          </div>
                          <div className="text-xs text-gray-500">{analysis.arrangements_analysis.humidity_arrangements_5_3.formula}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ===== REGRAS DO WESTERN ELECTRIC ===== */}
              {(analysis.temperature?.western_rules || analysis.humidity?.western_rules) && (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mt-6">
                  <h2 className="text-2xl font-bold text-white mb-6">📋 Regras do Western Electric Handbook</h2>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Temperatura */}
                    {analysis.temperature?.western_rules && (
                      <div>
                        <h3 className="text-lg font-semibold text-orange-300 mb-4 flex items-center gap-2">
                          🌡️ Temperatura
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-orange-500/30">
                                <th className="text-left py-3 px-4 text-orange-300 font-semibold">Regra</th>
                                <th className="text-left py-3 px-4 text-orange-300 font-semibold">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(analysis.temperature.western_rules).map(([key, rule]) => (
                                <tr key={key} className="border-b border-white/10 hover:bg-white/5 transition">
                                  <td className="py-3 px-4">
                                    <div className="font-medium text-white">{rule.name}</div>
                                    <div className="text-xs text-gray-400 mt-1">{rule.description}</div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                      rule.violated 
                                        ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                                        : 'bg-green-500/20 text-green-300 border border-green-500/30'
                                    }`}>
                                      {rule.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Umidade */}
                    {analysis.humidity?.western_rules && (
                      <div>
                        <h3 className="text-lg font-semibold text-blue-300 mb-4 flex items-center gap-2">
                          💧 Umidade
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-blue-500/30">
                                <th className="text-left py-3 px-4 text-blue-300 font-semibold">Regra</th>
                                <th className="text-left py-3 px-4 text-blue-300 font-semibold">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(analysis.humidity.western_rules).map(([key, rule]) => (
                                <tr key={key} className="border-b border-white/10 hover:bg-white/5 transition">
                                  <td className="py-3 px-4">
                                    <div className="font-medium text-white">{rule.name}</div>
                                    <div className="text-xs text-gray-400 mt-1">{rule.description}</div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                      rule.violated 
                                        ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                                        : 'bg-green-500/20 text-green-300 border border-green-500/30'
                                    }`}>
                                      {rule.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Resumo de Violações */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      ⚠️ Resumo de Violações
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analysis.temperature?.western_rules && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Temperatura:</span>
                          <span className={`font-semibold ${
                            Object.values(analysis.temperature.western_rules).some(r => r.violated)
                              ? 'text-red-400'
                              : 'text-green-400'
                          }`}>
                            {Object.values(analysis.temperature.western_rules).filter(r => r.violated).length} violação(ões)
                          </span>
                        </div>
                      )}
                      {analysis.humidity?.western_rules && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Umidade:</span>
                          <span className={`font-semibold ${
                            Object.values(analysis.humidity.western_rules).some(r => r.violated)
                              ? 'text-red-400'
                              : 'text-green-400'
                          }`}>
                            {Object.values(analysis.humidity.western_rules).filter(r => r.violated).length} violação(ões)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CEPAnalysis;
