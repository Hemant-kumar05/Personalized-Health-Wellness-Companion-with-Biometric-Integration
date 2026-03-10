@echo off
setlocal
cd /d "%~dp0"
echo Starting backend (http://localhost:5000) ...
start "Backend" cmd /k "cd backend && npm run dev"
echo Starting frontend (http://localhost:3001) ...
start "Frontend" cmd /k "cd frontend && set PORT=3001&& npm start"
echo.
echo Open: http://localhost:3001
echo API:  http://localhost:5000/health
