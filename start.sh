#!/bin/bash

# Ensure we exit on first error
set -e

# Export bun path just in case
export PATH="$HOME/.bun/bin:$PATH"

echo "========================================="
echo "🚀 Starting Vibe LeadGen Agents System"
echo "========================================="

# Start the Python backend in the background
echo "-> Starting Python Backend API..."
cd backend
source venv/bin/activate
python main.py &
BACKEND_PID=$!
cd ..

# Start the Bun React frontend in the background
echo "-> Starting Bun React Frontend..."
cd frontend
bun run dev &
FRONTEND_PID=$!
cd ..

echo "========================================="
echo "✅ System is running!"
echo "   Backend API: http://localhost:8000"
echo "   Frontend UI: http://localhost:5173"
echo ""
echo "Press Ctrl+C to shut down both servers."
echo "========================================="

# Trap Ctrl+C (SIGINT) to kill both background processes gracefully
trap "echo -e '\nShutting down servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT

# Wait indefinitely until interrupted
wait
