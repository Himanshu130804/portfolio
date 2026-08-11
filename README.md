# Karamvir Attri Portfolio — Split Frontend + Backend

The project is now separated into two independent applications.

## Structure

```text
karamvir-portfolio/
├── frontend/   React + Vite public portfolio and admin UI
├── backend/    Node.js + Express + MongoDB API
└── README.md
```

## 1. Run the backend

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and fill in your private values.

```bash
npm run dev
```

The API runs on `http://localhost:5000` by default.

## 2. Run the frontend

Open another terminal:

```bash
cd frontend
npm install
```

Copy `.env.example` to `.env`.

```env
VITE_API_URL=http://localhost:5000/api
```

Then run:

```bash
npm run dev
```

The frontend normally opens at `http://localhost:5173`.

## Production deployment

### Frontend — Vercel
Deploy only the `frontend` folder. Add:

```env
VITE_API_URL=https://YOUR-BACKEND-DOMAIN/api
```

### Backend — Render / Railway / similar Node host
Deploy only the `backend` folder. Add these environment variables in the hosting dashboard:

```env
MONGO_URI=your-private-mongodb-atlas-string
ADMIN_EMAIL=your-admin-email
ADMIN_PASSWORD=your-admin-password
JWT_SECRET=your-long-random-secret
FRONTEND_URL=https://YOUR-FRONTEND-DOMAIN
```

Never expose `MONGO_URI`, `ADMIN_PASSWORD`, or `JWT_SECRET` in the frontend.

## Admin

After both apps are connected, visit:

```text
https://YOUR-FRONTEND-DOMAIN/admin
```

Use the credentials configured in the backend environment variables.
