import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  CssBaseline, 
  Container, 
  Typography, 
  Box, 
  Paper,
  TextField,
  Button,
  AppBar,
  Toolbar,
  CircularProgress
} from '@mui/material';
import { AuthProvider, useAuth } from './context/SimpleAuthContext';

// Theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32',
    },
    secondary: {
      main: '#FF6B35',
    },
    background: {
      default: '#F5F7FA',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});

// Navigation Bar
const Navbar = () => {
  const { user, logout } = useAuth();

  console.log('Navbar - user:', user);

  if (!user) {
    console.log('Navbar: no user, not rendering navbar');
    return null;
  }

  console.log('Navbar: rendering navbar for user:', user.name);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Health & Wellness Companion
        </Typography>
        <Typography variant="body2" sx={{ mr: 2 }}>
          Welcome, {user.name}
        </Typography>
        <Button color="inherit" onClick={logout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

// Enhanced Dashboard component
const Dashboard = () => {
  const { user } = useAuth();
  const [healthData, setHealthData] = useState({
    steps: 8547,
    heartRate: 72,
    weight: 68.5,
    sleepHours: 7.5,
    waterIntake: 6,
    calories: 1847
  });

  const [activities, setActivities] = useState([
    { id: 1, name: 'Morning Walk', duration: '30 min', calories: 150, time: '7:00 AM' },
    { id: 2, name: 'Workout', duration: '45 min', calories: 320, time: '6:00 PM' },
    { id: 3, name: 'Meditation', duration: '15 min', calories: 10, time: '9:00 PM' }
  ]);

  const [recommendations, setRecommendations] = useState([
    { id: 1, type: 'hydration', message: 'Drink 2 more glasses of water today', priority: 'high' },
    { id: 2, type: 'exercise', message: 'Add 10 minutes of stretching to your routine', priority: 'medium' },
    { id: 3, type: 'sleep', message: 'Try to sleep 30 minutes earlier tonight', priority: 'low' }
  ]);

  const handleCardClick = (cardType) => {
    console.log(`${cardType} card clicked`);
    // In a real app, this would navigate to detailed pages
    alert(`Opening ${cardType} details...`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome back, {user?.name}! Here's your health summary for today.
      </Typography>

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
        {/* Health Overview Card */}
        <Paper 
          sx={{ 
            p: 3, 
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
            }
          }}
          onClick={() => handleCardClick('Health Overview')}
        >
          <Typography variant="h6" gutterBottom color="primary.main">
            Health Overview
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
            <Box>
              <Typography variant="h4" color="secondary.main">{healthData.steps.toLocaleString()}</Typography>
              <Typography variant="body2" color="text.secondary">Steps Today</Typography>
            </Box>
            <Box>
              <Typography variant="h4" color="error.main">{healthData.heartRate}</Typography>
              <Typography variant="body2" color="text.secondary">Heart Rate (bpm)</Typography>
            </Box>
            <Box>
              <Typography variant="h4" color="info.main">{healthData.weight} kg</Typography>
              <Typography variant="body2" color="text.secondary">Current Weight</Typography>
            </Box>
            <Box>
              <Typography variant="h4" color="success.main">{healthData.sleepHours}h</Typography>
              <Typography variant="body2" color="text.secondary">Sleep Last Night</Typography>
            </Box>
          </Box>
        </Paper>

        {/* Today's Activities Card */}
        <Paper 
          sx={{ 
            p: 3, 
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
            }
          }}
          onClick={() => handleCardClick('Today\'s Activities')}
        >
          <Typography variant="h6" gutterBottom color="primary.main">
            Today's Activities
          </Typography>
          <Box sx={{ mt: 2 }}>
            {activities.map((activity) => (
              <Box key={activity.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, p: 1, backgroundColor: 'grey.50', borderRadius: 1 }}>
                <Box>
                  <Typography variant="body2" fontWeight="bold">{activity.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{activity.time} • {activity.duration}</Typography>
                </Box>
                <Typography variant="body2" color="secondary.main">{activity.calories} cal</Typography>
              </Box>
            ))}
            <Box sx={{ mt: 2, p: 1, backgroundColor: 'primary.light', borderRadius: 1, textAlign: 'center' }}>
              <Typography variant="body2" color="white">
                Total Calories Burned: {activities.reduce((sum, activity) => sum + activity.calories, 0)}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Recommendations Card */}
        <Paper 
          sx={{ 
            p: 3, 
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
            }
          }}
          onClick={() => handleCardClick('Recommendations')}
        >
          <Typography variant="h6" gutterBottom color="primary.main">
            Recommendations
          </Typography>
          <Box sx={{ mt: 2 }}>
            {recommendations.map((rec) => (
              <Box key={rec.id} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'grey.200', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    backgroundColor: rec.priority === 'high' ? 'error.main' : rec.priority === 'medium' ? 'warning.main' : 'success.main',
                    mr: 1 
                  }} />
                  <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                    {rec.type}
                  </Typography>
                </Box>
                <Typography variant="body2">{rec.message}</Typography>
              </Box>
            ))}
            <Button variant="outlined" fullWidth sx={{ mt: 1 }}>
              View All Recommendations
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Quick Stats Row */}
      <Box sx={{ mt: 4, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h5" color="info.main">{healthData.waterIntake}/8</Typography>
          <Typography variant="body2" color="text.secondary">Glasses of Water</Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h5" color="warning.main">{healthData.calories}</Typography>
          <Typography variant="body2" color="text.secondary">Calories Consumed</Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h5" color="success.main">85%</Typography>
          <Typography variant="body2" color="text.secondary">Daily Goal Progress</Typography>
        </Paper>
      </Box>
    </Container>
  );
};

// Registration component
const Register = () => {
  const { register, loading, user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Redirect if already logged in
  if (user) {
    console.log('Register: user already authenticated, redirecting to dashboard');
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Registration form submitted with:', formData);
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password);
      console.log('Registration completed successfully');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Join the Health & Wellness community
          </Typography>
        </Box>
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Account'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Button component={Link} to="/login" variant="text" sx={{ textTransform: 'none' }}>
                Sign In
              </Button>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

// Login component
const Login = () => {
  const { login, loading, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Redirect if already logged in
  if (user) {
    console.log('Login: user already authenticated, redirecting to dashboard');
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with:', email, password);
    try {
      await login(email, password);
      console.log('Login completed successfully');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to your Health & Wellness account
          </Typography>
        </Box>
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">
              Don't have an account?{' '}
              <Button component={Link} to="/register" variant="text" sx={{ textTransform: 'none' }}>
                Create Account
              </Button>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  console.log('ProtectedRoute - user:', user, 'loading:', loading);

  if (loading) {
    console.log('ProtectedRoute: showing loading spinner');
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    console.log('ProtectedRoute: no user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('ProtectedRoute: user authenticated, showing children');
  return children;
};

// Main App Layout
const AppLayout = ({ children }) => {
  return (
    <Box>
      <Navbar />
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        {children}
      </Box>
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppLayout>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch all route - redirect to login if not authenticated, dashboard if authenticated */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </AppLayout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;