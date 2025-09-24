# Alertify

Alertify is a modern MERN application for creating and delivering organization-wide alerts with per-user read/snooze tracking, admin targeting, and analytics.

<img width="1914" height="923" alt="Screenshot 2025-09-25 003413" src="https://github.com/user-attachments/assets/2c855f20-9f79-4630-b7b4-b77c8316eeba" />
<img width="1884" height="966" alt="Screenshot 2025-09-25 012613" src="https://github.com/user-attachments/assets/247a45b0-7d93-47dd-badf-c0ba33025978" />
<img width="1898" height="914" alt="Screenshot 2025-09-25 012837" src="https://github.com/user-attachments/assets/9a994db5-228e-48a0-a5d3-8db90c34c88a" />
<img width="1881" height="958" alt="Screenshot 2025-09-25 012637" src="https://github.com/user-attachments/assets/f910d579-15be-40b1-8e7d-efe161e98150" />

## Tech Stack
- Backend: Node.js, Express, Mongoose (MongoDB), JWT
- Frontend: React (Vite + Mantine UI), React Router

---

## Prerequisites
- Node.js 18+
- MongoDB running locally (or Atlas URI)

---

## Quick Start (Development)
Open two terminals.

Terminal 1 – Backend:
```powershell
cd backend
# Set required environment variables (Windows PowerShell example):
$env:MONGO_URI="mongodb://127.0.0.1:27017/prd-alert-platform"
$env:JWT_SECRET="dev_secret"
# Optional in dev: restrict CORS origin
# $env:CORS_ORIGIN="http://localhost:5174"

npm install
npm run dev
```
You should see "MongoDB Connected..." and "Server started on port 5001".

Terminal 2 – Frontend:
```powershell
cd frontend
# Point the frontend to the backend API
$env:VITE_API_URL="http://localhost:5001/api"

npm install
npm run dev
```
Open the app at:
- http://localhost:5174

Login and Signup are available at `/login` and `/signup`.

---

## Production Build and Run
1) Build the frontend:
```bash
cd frontend
npm run build
```
2) Start the backend in production (which also serves the built frontend):
```powershell
cd ../backend
# Set production env vars
$env:NODE_ENV="production"
$env:MONGO_URI="mongodb://127.0.0.1:27017/prd-alert-platform"
$env:JWT_SECRET="change_me"
$env:PORT="5001"
# Optional (recommended): set your deployed origin
# $env:CORS_ORIGIN="https://your-domain.com"

npm start
```
Then open your server URL (e.g., `http://localhost:5001`). The backend serves API under `/api` and static frontend from `frontend/dist`.

---

## Environment Variables
Backend (.env):
- `MONGO_URI` (required)
- `JWT_SECRET` (required)
- `PORT` (default: 5001)
- `CORS_ORIGIN` (recommended in production)
- `SEED_ON_START` (optional, dev)

Frontend (.env):
- `VITE_API_URL` (required) – Base URL of backend API, e.g. `http://localhost:5001/api`

> Note: If you cannot create `.env` files, you can export these variables in your shell as shown above.

---

## What to Demo (Interviewer Notes)
- Admin creates alerts with visibility scope: Organization / Team / Specific Users
- Users see alerts automatically (polling + focus-based refresh)
- Per-user state: Mark as Read, Snooze (independent per user)
- Target lists (users/teams) in Create Alert auto-refresh (new signups appear without reload)
- JWT auth with role-based access (Admin/User)
- Modern UI: dark bluish theme, split hero on auth pages, subtle animations

---

## Project Scripts
Backend (`backend/package.json`):
- `npm run dev` – Start with nodemon
- `npm start` – Start in production

Frontend (`frontend/package.json`):
- `npm run dev` – Vite dev server (default port 5174)
- `npm run build` – Production build
- `npm run preview` – Preview the production build

---

## Troubleshooting
- Database not visible in MongoDB:
  - MongoDB only lists a DB after at least one document is written. Sign up once to create a user.
- Frontend shows blank screen:
  - Ensure `VITE_API_URL` matches the backend (e.g., `http://localhost:5001/api`). Hard refresh (Ctrl+Shift+R).
- CORS errors:
  - Set `CORS_ORIGIN` on backend to your frontend origin.

---

## Author
Made by Bhuvnesh Sahu
