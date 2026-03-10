# Personalized Health & Wellness Companion with Biometric Integration

A MERN stack application that provides AI-driven, personalized health and wellness recommendations based on biometric data and user preferences.

## 🚀 Features

### Core Modules
- **User Registration & Health Profile Management** - Secure authentication with comprehensive health profiles
- **Biometric Data Integration** - Manual input and API integration with fitness trackers
- **AI-Powered Recommendations** - Personalized workout plans, meal plans, and mindfulness exercises
- **Interactive Health Dashboards** - Visual progress tracking with charts and analytics
- **Community & Expert Network** - Social features and expert consultations
- **Gamification System** - Streaks, badges, and achievement tracking
- **Smart Notifications** - AI-driven reminders and personalized alerts

## 🛠️ Technology Stack

- **Backend:** Node.js, Express.js, MongoDB, JWT Authentication
- **Frontend:** React.js, Material-UI, Chart.js, Recharts
- **AI Integration:** Third-party AI APIs for personalized recommendations
- **Optional Integrations:** Fitbit API, Google Fit, Apple HealthKit, Video Conferencing APIs

## 📁 Project Structure

```
health-wellness-companion/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.js
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (Community Server or Atlas)
- npm or yarn

### 1) Backend setup

```bash
cd backend
npm install
```

Create env file:

- Copy `backend/.env.example` → `backend/.env`
- Set at minimum:
	- `JWT_SECRET`
	- `MONGO_URI` (default local example is already included)

Optional: seed demo accounts/data:

```bash
cd backend
npm run seed
```

Run API:

```bash
cd backend
npm run dev
```

Backend runs on: `http://localhost:5000`

Health check: `GET http://localhost:5000/health`

### 2) Frontend setup

```bash
cd frontend
npm install
```

Run the frontend:

```bash
cd frontend
set PORT=3001&& npm start
```

Frontend runs on: `http://localhost:3001`

Note: if port `3001` is already in use, CRA will ask and may start on `3002`.

### 3) One-click (Windows)

You can also start both with:

```bat
start-all.bat
```

## 🔑 Demo login (seeded)

After running `npm run seed` in the backend, you can log in with:

- Email: `user@example.com`
- Password: `Password123!`

## 🔌 Key API Endpoints

All API routes are under `/api/*`.

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 📊 Key API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Biometric Data
- `POST /api/biometrics` - Log biometric data
- `GET /api/biometrics/summary` - Summary
- `GET /api/biometrics/:type` - List by type (compat route)
- `GET /api/biometrics/trends/:type` - Trends

### Recommendations
- `POST /api/recommendations/generate` - Generate workout/meal/mindfulness
- `GET /api/recommendations/latest?kind=workout|meal|mindfulness` - Latest docs

### Progress & Goals
- `GET /api/goals` - List goals
- `POST /api/goals` - Create goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

## 🎯 Development Roadmap

### Week 1: Foundation
- Authentication system
- User profiles and health goals
- Basic biometric data logging

### Week 2: AI Integration
- Recommendation engine setup
- Dashboard with charts
- Progress tracking

### Week 3: Advanced Features
- Community features
- Gamification system
- Expert network

### Week 4: Polish & Deploy
- Testing and optimization
- UI/UX refinements
- Production deployment

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS protection
- Helmet security headers

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT
