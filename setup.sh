#!/bin/bash

set -euo pipefail

echo "🚀 Setting up PropAnalyzer Pro..."

if ! command -v docker >/dev/null 2>&1; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

echo "📝 Creating environment files..."
cp .env.example backend/.env || true
cp frontend/.env.local.example frontend/.env.local || true

if command -v docker-compose >/dev/null 2>&1; then
  compose_cmd="docker-compose"
else
  compose_cmd="docker compose"
fi

echo "🐳 Starting Docker containers..."
$compose_cmd up -d postgres redis

echo "⏳ Waiting for database to be ready..."
sleep 5

echo "📦 Installing backend dependencies..."
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

echo "🗄️ Running database migrations..."
alembic upgrade head || echo "⚠️ Alembic migrations require database connectivity."

echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "1. Backend: cd backend && source venv/bin/activate && uvicorn app.main:app --reload"
echo "2. Frontend: cd frontend && npm run dev"
echo ""
echo "Visit http://localhost:3000 to access the application"
