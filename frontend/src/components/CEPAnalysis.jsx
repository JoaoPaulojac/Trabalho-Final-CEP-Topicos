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

  // Executar análise CEP
  const runAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/cep/analyze`, {
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

  // Abrir relatório HTML
  const openReport = () => {
    window.open(`${API_BASE_URL}/cep/report`, '_blank');
  };

  // Baixar gráfico
  const downloadChart = () => {
    window.open(`${API_BASE_URL}/cep/chart`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1e2f] via-[#252540] to-[#2a2a4a] p-5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
            📊 Análise CEP - Controle Estatístico de Processo
          </h1>
          <p className="text-gray-400 text-base md:text-lg">
            Análise estatística dos dados de temperatura coletados
          </p>
        </header>

        {/* Status Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">Status do Sistema</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">Amostras Coletadas</div>
              <div className="text-3xl font-bold text-white">
                {status?.total_samples || 0}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Mínimo necessário: {status?.minimum_required || 5}
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">Análise Disponível</div>
              <div className="text-3xl font-bold">
                {status?.can_analyze ? (
                  <span className="text-green-500">✓ Sim</span>
                ) : (
                  <span className="text-yellow-500">✗ Não</span>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {status?.data_available ? 'Dados suficientes' : 'Aguardando mais dados'}
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">Relatórios Gerados</div>
              <div className="text-sm text-white mt-2">
                <div>Gráfico: {status?.chart_exists ? '✓' : '✗'}</div>
                <div>Relatório HTML: {status?.report_exists ? '✓' : '✗'}</div>
              </div>
            </div>
          </div>

          {/* Botão Gerar Análise */}
          <button
            onClick={runAnalysis}
            disabled={loading || !status?.can_analyze}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
              loading || !status?.can_analyze
                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
            } text-white`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Executando Análise CEP...
              </span>
            ) : (
              '🔬 Gerar Análise CEP'
            )}
          </button>

          {!status?.can_analyze && status && (
            <div className="mt-3 text-center text-yellow-400 text-sm">
              ⚠️ Colete pelo menos {status.minimum_required - status.total_samples} amostra(s) para realizar a análise
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-xl p-4 mb-6 text-white">
            <strong>❌ Erro:</strong> {error}
          </div>
        )}

        {/* Resultados da Análise */}
        {analysis && analysis.status === 'success' && (
          <div className="space-y-6">
            {/* Gráfico */}
            {analysis.chart_base64 && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-white">Gráficos de Controle X-R</h2>
                  <button
                    onClick={downloadChart}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm transition-colors"
                  >
                    📥 Baixar Gráfico
                  </button>
                </div>
                <img
                  src={`data:image/png;base64,${analysis.chart_base64}`}
                  alt="Gráfico de Controle CEP"
                  className="w-full rounded-lg"
                />
              </div>
            )}

            {/* Estatísticas */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Estatísticas do Processo</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">X̄̄ (Média das Médias)</div>
                  <div className="text-2xl font-bold text-white">
                    {analysis.data.x_double_mean.toFixed(2)}°C
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">R̄ (Amplitude Média)</div>
                  <div className="text-2xl font-bold text-white">
                    {analysis.data.r_mean.toFixed(2)}°C
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">σ (Desvio Padrão)</div>
                  <div className="text-2xl font-bold text-white">
                    {analysis.data.sigma.toFixed(2)}°C
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Total de Amostras</div>
                  <div className="text-2xl font-bold text-white">
                    {analysis.data.total_samples}
                  </div>
                </div>
              </div>
            </div>

            {/* Limites de Controle */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Limites de Controle</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gráfico X̄ */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Gráfico X̄ (Média)</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-red-500/20 rounded p-3">
                      <span className="text-gray-300">LSC (Limite Superior)</span>
                      <span className="font-bold text-white">{analysis.data.lsc_x_bar.toFixed(2)}°C</span>
                    </div>
                    <div className="flex justify-between items-center bg-green-500/20 rounded p-3">
                      <span className="text-gray-300">LC (Linha Central)</span>
                      <span className="font-bold text-white">{analysis.data.x_double_mean.toFixed(2)}°C</span>
                    </div>
                    <div className="flex justify-between items-center bg-red-500/20 rounded p-3">
                      <span className="text-gray-300">LIC (Limite Inferior)</span>
                      <span className="font-bold text-white">{analysis.data.lic_x_bar.toFixed(2)}°C</span>
                    </div>
                  </div>
                </div>

                {/* Gráfico R */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Gráfico R (Amplitude)</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-red-500/20 rounded p-3">
                      <span className="text-gray-300">LSC (Limite Superior)</span>
                      <span className="font-bold text-white">{analysis.data.lsc_r.toFixed(2)}°C</span>
                    </div>
                    <div className="flex justify-between items-center bg-green-500/20 rounded p-3">
                      <span className="text-gray-300">LC (Linha Central)</span>
                      <span className="font-bold text-white">{analysis.data.r_mean.toFixed(2)}°C</span>
                    </div>
                    <div className="flex justify-between items-center bg-red-500/20 rounded p-3">
                      <span className="text-gray-300">LIC (Limite Inferior)</span>
                      <span className="font-bold text-white">{analysis.data.lic_r.toFixed(2)}°C</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Limites de Especificação */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Limites de Especificação</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">LSE (Limite Superior)</div>
                  <div className="text-3xl font-bold text-red-400">
                    {analysis.data.lse}°C
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">LIE (Limite Inferior)</div>
                  <div className="text-3xl font-bold text-blue-400">
                    {analysis.data.lie}°C
                  </div>
                </div>
              </div>
            </div>

            {/* Status de Controle */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Status de Controle</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`rounded-lg p-4 ${
                  analysis.data.out_of_control_x === 0 
                    ? 'bg-green-500/20 border border-green-500' 
                    : 'bg-red-500/20 border border-red-500'
                }`}>
                  <div className="text-white font-semibold mb-2">Gráfico X̄</div>
                  <div className="text-2xl font-bold text-white">
                    {analysis.data.out_of_control_x === 0 ? '✓ SOB CONTROLE' : `✗ ${analysis.data.out_of_control_x} FORA DE CONTROLE`}
                  </div>
                </div>

                <div className={`rounded-lg p-4 ${
                  analysis.data.out_of_control_r === 0 
                    ? 'bg-green-500/20 border border-green-500' 
                    : 'bg-red-500/20 border border-red-500'
                }`}>
                  <div className="text-white font-semibold mb-2">Gráfico R</div>
                  <div className="text-2xl font-bold text-white">
                    {analysis.data.out_of_control_r === 0 ? '✓ SOB CONTROLE' : `✗ ${analysis.data.out_of_control_r} FORA DE CONTROLE`}
                  </div>
                </div>
              </div>
            </div>

            {/* Capacidade do Processo */}
            {analysis.data.capability && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-4">Capacidade do Processo</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {analysis.data.capability.rcp !== null && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">Cp (Capacidade Potencial)</div>
                      <div className={`text-2xl font-bold ${
                        analysis.data.capability.rcp >= 1.33 ? 'text-green-400' :
                        analysis.data.capability.rcp >= 1.0 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {analysis.data.capability.rcp.toFixed(3)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {analysis.data.capability.rcp >= 1.33 ? '✓ Capaz' :
                         analysis.data.capability.rcp >= 1.0 ? '⚠️ Aceitável' :
                         '✗ Incapaz'}
                      </div>
                    </div>
                  )}

                  {analysis.data.capability.rcpk !== null && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">Cpk (Capacidade Real)</div>
                      <div className={`text-2xl font-bold ${
                        analysis.data.capability.rcpk >= 1.33 ? 'text-green-400' :
                        analysis.data.capability.rcpk >= 1.0 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {analysis.data.capability.rcpk.toFixed(3)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {analysis.data.capability.rcpk >= 1.33 ? '✓ Capaz' :
                         analysis.data.capability.rcpk >= 1.0 ? '⚠️ Aceitável' :
                         '✗ Incapaz'}
                      </div>
                    </div>
                  )}

                  {analysis.data.capability.rcps !== null && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">Cps (Superior)</div>
                      <div className="text-2xl font-bold text-white">
                        {analysis.data.capability.rcps.toFixed(3)}
                      </div>
                    </div>
                  )}

                  {analysis.data.capability.rcpi !== null && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">Cpi (Inferior)</div>
                      <div className="text-2xl font-bold text-white">
                        {analysis.data.capability.rcpi.toFixed(3)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Botão Relatório Completo */}
            {analysis.report_available && (
              <div className="text-center">
                <button
                  onClick={openReport}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 rounded-xl text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  📄 Ver Relatório Completo (HTML)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CEPAnalysis;
