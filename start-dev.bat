@echo off
echo ========================================
echo   NyayGuru AI Pro - Development Server
echo ========================================
echo.

echo Starting Backend (FastAPI)...
cd backend
start cmd /k "python -m venv venv 2>nul & venv\Scripts\activate & pip install -r requirements.txt & python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo Starting Frontend (Vite)...
cd ..
start cmd /k "npm run dev"

echo.
echo ========================================
echo   Servers Starting...
echo ========================================
echo.
echo   Frontend: http://localhost:5173
echo   Backend API: http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo.
echo ========================================
pause
