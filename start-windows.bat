@echo off
echo ==========================================
echo Starting Don's Grounded AI Empire...
echo ==========================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed! 
    echo Please download and install it from https://nodejs.org/
    pause
    exit /b
)

echo [1/2] Installing dependencies (this might take a minute)...
call npm install

echo.
echo [2/2] Starting the local server...
echo.
echo Once the server starts, open your browser to: http://localhost:3000
echo.
call npm run dev

pause
