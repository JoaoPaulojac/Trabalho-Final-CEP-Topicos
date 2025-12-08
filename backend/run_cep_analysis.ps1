# Script para executar análise CEP de temperatura
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "  ANÁLISE CEP - DADOS DE TEMPERATURA" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan

# Verificar se está no diretório correto
$currentDir = Get-Location
Write-Host "`nDiretório atual: $currentDir" -ForegroundColor Yellow

# Instalar dependências se necessário
Write-Host "`n[1/3] Verificando dependências..." -ForegroundColor Green
pip install -q -r requirements.txt

# Executar a análise
Write-Host "`n[2/3] Executando análise CEP..." -ForegroundColor Green
python cep_temperature_analysis.py

# Verificar arquivos gerados
Write-Host "`n[3/3] Verificando arquivos gerados..." -ForegroundColor Green
if (Test-Path "grafico_controle_xr.png") {
    Write-Host "✓ Gráfico gerado: grafico_controle_xr.png" -ForegroundColor Green
} else {
    Write-Host "✗ Gráfico não encontrado" -ForegroundColor Red
}

if (Test-Path "../CEP-Prova/src/relatorio_cep_xr(LIMITES DE ESPECIFICAÇÃO NORMAL).html") {
    Write-Host "✓ Relatório HTML gerado com sucesso" -ForegroundColor Green
} else {
    Write-Host "✗ Relatório HTML não encontrado" -ForegroundColor Red
}

Write-Host "`n===========================================" -ForegroundColor Cyan
Write-Host "  ANÁLISE CONCLUÍDA" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
