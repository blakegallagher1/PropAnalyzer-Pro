# PropAnalyzer Pro - Setup Instructions

## Prerequisites
- Docker & Docker Compose
- Node.js 20+
- Python 3.11+
- Git

## Quick Start

### 1. Clone and Setup
```bash
# Create project directory
mkdir propanalyzer-pro
cd propanalyzer-pro

# Initialize git
git init

# Create the file structure as specified
# Copy all code files into their respective locations

# Make setup script executable
chmod +x setup.sh

# Run setup
./setup.sh
```

### 2. Start Development

**Terminal 1 - Database & Redis:**
```bash
docker-compose up postgres redis
```

**Terminal 2 - Backend:**
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```

### 3. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/api/docs

## Development Workflow

### Adding a New Feature
1. Create database models in `backend/app/models/`
2. Create migration: `alembic revision --autogenerate -m "description"`
3. Run migration: `alembic upgrade head`
4. Create API endpoints in `backend/app/api/endpoints/`
5. Create frontend pages in `frontend/app/`
6. Test locally
7. Commit and push

### Running Tests
```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm test
```

## Deployment

### Backend (Railway)
1. Create new Railway project
2. Add PostgreSQL and Redis services
3. Connect GitHub repository
4. Set environment variables
5. Deploy

### Frontend (Vercel)
1. Connect GitHub repository
2. Set environment variables
3. Deploy

## Common Issues

**Database connection error**
- Ensure PostgreSQL is running: `docker-compose ps`
- Check `DATABASE_URL` in `.env`

**Port already in use**
- Change ports in `docker-compose.yml`
- Update `.env` files with new ports

**Module not found**
- Backend: `pip install -r requirements.txt`
- Frontend: `npm install`
