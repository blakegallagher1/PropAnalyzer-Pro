# PropAnalyzer Pro

PropAnalyzer Pro is a full-stack real estate investment analysis platform combining a FastAPI backend with a Next.js 14 frontend. It provides property management, portfolio tracking, and AI-assisted deal discovery for small to mid-size investors.

## Monorepo Structure

- `backend/` — FastAPI application with PostgreSQL, Redis, Celery, and Alembic.
- `frontend/` — Next.js 14 App Router interface styled with Tailwind CSS and powered by Clerk authentication.
- `docker/` — Dockerfiles for backend and frontend services.
- `docker-compose.yml` — Orchestrates the entire stack for local development.
- `docs/` — Documentation assets (add additional guides here).

## Getting Started

1. Review and customize environment variables in `.env.example`, `backend/.env.example`, and `frontend/.env.local.example`.
2. Run `./setup.sh` to provision dependencies, create virtual environments, and install packages.
3. Start services with `docker-compose up` or use the individual backend/frontend commands described in `SETUP_INSTRUCTIONS.md`.

For full setup, development workflow, and deployment guidance, refer to [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md).
