@echo off
chcp 65001 >nul
echo ============================================
echo   ANÁLISE CEP - DADOS DE TEMPERATURA
echo ============================================
echo.

cd /d "%~dp0"

echo [1/3] Verificando ambiente Python...
python --version
if errorlevel 1 (
    echo ❌ Python não encontrado! Instale Python 3.x
    pause
    exit /b 1
)

echo.
echo [2/3] Instalando dependências...
pip install -q pandas matplotlib numpy scipy
if errorlevel 1 (
    echo ⚠️ Aviso: Erro ao instalar dependências
)

echo.
echo [3/3] Executando análise CEP...
echo.
python cep_temperature_analysis.py

echo.
echo ============================================
echo   ANÁLISE CONCLUÍDA
echo ============================================
echo.
echo Arquivos gerados:
if exist "grafico_controle_xr.png" (
    echo   ✓ grafico_controle_xr.png
) else (
    echo   ✗ grafico_controle_xr.png
)
if exist "relatorio_cep_xr.html" (
    echo   ✓ relatorio_cep_xr.html
) else (
    echo   ✗ relatorio_cep_xr.html
)

echo.
echo Deseja abrir o relatório HTML? (S/N)
set /p OPEN_REPORT=
if /i "%OPEN_REPORT%"=="S" (
    start relatorio_cep_xr.html
)

pause
