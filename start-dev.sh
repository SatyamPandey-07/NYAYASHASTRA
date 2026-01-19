#!/bin/bash

echo "========================================"
echo "  NyayGuru AI Pro - Development Server"
echo "========================================"
echo

# Start Backend
echo "Starting Backend (FastAPI)..."
cd backend
python -m venv venv 2>/dev/null
source venv/bin/activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait for backend
echo "Waiting for backend to start..."
sleep 5

# Start Frontend
echo "Starting Frontend (Vite)..."
cd ..
npm run dev &
FRONTEND_PID=$!

echo
echo "========================================"
echo "  Servers Running"
echo "========================================"
echo
echo "  Frontend: http://localhost:5173"
echo "  Backend API: http://localhost:8000"
echo "  API Docs: http://localhost:8000/docs"
echo
echo "  Press Ctrl+C to stop all servers"
echo "========================================"

# Wait for Ctrl+C
wait
