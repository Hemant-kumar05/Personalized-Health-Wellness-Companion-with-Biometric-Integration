# Backend (Node.js + Express + MongoDB)

This folder contains a complete REST API for the **Personalized Health & Wellness Companion with Biometric Integration**.

## Quick start

1) Create env file:
- Copy `.env.example` to `.env`
- Set `MONGO_URI` (local MongoDB example is included)

2) Install deps:

```bash
cd backend
npm install
```

3) (Optional) Seed sample data:

```bash
npm run seed
```

4) Run the API:

```bash
npm run dev
```

API runs on `http://localhost:5000` by default.

## Auth

- Uses JWT (`Authorization: Bearer <token>`)
- Roles: `user`, `expert`, `admin`

## Endpoint list (high level)

### Health
- `GET /health`

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Profile + Reminders
- `GET /api/profile/me`
- `PUT /api/profile/me`
- `GET /api/profile/me/reminders`
- `PUT /api/profile/me/reminders`

### Goals
- `GET /api/goals`
- `POST /api/goals`
- `PUT /api/goals/:id`
- `DELETE /api/goals/:id`

### Biometrics
- `POST /api/biometrics`
- `GET /api/biometrics?type=&range=day|week|month&from=&to=&limit=`
- `GET /api/biometrics/latest`

### Recommendations
- `POST /api/recommendations/generate`
- `GET /api/recommendations/latest?kind=workout|meal|mindfulness`

### Dashboard
- `GET /api/dashboard/summary`

### Experts
- `GET /api/experts`
- `GET /api/experts/:id`
- `PUT /api/experts/me` (expert)

### Bookings
- `GET /api/bookings/me`
- `GET /api/bookings/expert` (expert)
- `POST /api/bookings`
- `PUT /api/bookings/:id/status`

### Community
- `GET /api/community/posts`
- `POST /api/community/posts`
- `GET /api/community/posts/:id`
- `POST /api/community/posts/:id/comments`
- `DELETE /api/community/posts/:id`

### Gamification
- `GET /api/gamification/me`
- `POST /api/gamification/me/active`

### Notifications
- `GET /api/notifications/me`
- `POST /api/notifications/schedule`
- `PUT /api/notifications/me/settings`
- `POST /api/notifications/me/generate-today`

### Admin (admin role)
- `GET /api/admin/users`
- `GET /api/admin/stats`
- `DELETE /api/admin/community/posts/:id`

## Notes

- Email notifications are optional. Configure SMTP env vars to enable.
- Cron runs by default (`CRON_ENABLED=true`).
