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
  CircularProgress,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  IconButton,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tabs,
  Tab,
  Badge,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Favorite,
  DirectionsRun,
  LocalDrink,
  Bedtime,
  Restaurant,
  Thermostat,
  BloodtypeOutlined,
  AirOutlined,
  MonitorHeart,
  TrendingUp,
  Group,
  EmojiEvents,
  Add,
  Notifications,
  Settings,
  Share,
  ThumbUp,
  Chat,
  Timer,
  CalendarToday,
  Star,
  Psychology
} from '@mui/icons-material';
import { AuthProvider, useAuth } from './context/SimpleAuthContext';

// Enhanced Theme with better colors and styling
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#ff4081',
      light: '#ff80ab',
      dark: '#e91e63',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#2d3748',
      secondary: '#718096',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
  },
});

// Enhanced Navigation Bar with notifications and user menu
const Navbar = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationCount] = useState(3);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  console.log('Navbar - user:', user);

  if (!user) {
    console.log('Navbar: no user, not rendering navbar');
    return null;
  }

  console.log('Navbar: rendering navbar for user:', user.name);

  return (
    <AppBar position="static" sx={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      boxShadow: '0 4px 20px 0 rgba(0,0,0,.14), 0 7px 10px -5px rgba(0,0,0,.4)'
    }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
          🏥 Health & Wellness Pro
        </Typography>
        
        <IconButton color="inherit" sx={{ mr: 1 }}>
          <Badge badgeContent={notificationCount} color="error">
            <Notifications />
          </Badge>
        </IconButton>
        
        <Typography variant="body2" sx={{ mr: 2 }}>
          Welcome, {user.name}
        </Typography>
        
        <IconButton color="inherit" onClick={handleMenuOpen}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 32, height: 32 }}>
            {user.name.charAt(0)}
          </Avatar>
        </IconButton>
        
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
          <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); logout(); }}>Logout</MenuItem>
        </Menu>
        
        <Button color="inherit" onClick={logout} sx={{ ml: 1 }}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

// Enhanced Dashboard component with advanced features
const Dashboard = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState(0);
  
  // Enhanced health data with more comprehensive metrics
  const [healthData] = useState({
    steps: { value: 8547, target: 10000, unit: 'steps' },
    heartRate: { value: 72, unit: 'bpm', status: 'normal', resting: 65 },
    bloodPressure: { systolic: 118, diastolic: 78, unit: 'mmHg', status: 'optimal' },
    oxygenSat: { value: 98, unit: '%', status: 'excellent' },
    temperature: { value: 98.6, unit: '°F', status: 'normal' },
    weight: { value: 68.5, unit: 'kg', trend: '-0.2kg this week' },
    sleepHours: { value: 7.5, target: 8, unit: 'hours', quality: 'Good' },
    waterIntake: { value: 6, target: 8, unit: 'glasses' },
    calories: { consumed: 1847, burned: 2200, target: 2000 }
  });

  const [activities] = useState([
    { 
      id: 1, 
      name: 'Morning Cardio', 
      duration: '45 min', 
      calories: 380, 
      time: '7:00 AM',
      type: 'cardio',
      intensity: 'high',
      heartRate: '140-160 bpm'
    },
    { 
      id: 2, 
      name: 'Strength Training', 
      duration: '60 min', 
      calories: 420, 
      time: '6:00 PM',
      type: 'strength',
      intensity: 'high',
      heartRate: '120-140 bpm'
    },
    { 
      id: 3, 
      name: 'Yoga Flow', 
      duration: '30 min', 
      calories: 120, 
      time: '9:00 PM',
      type: 'flexibility',
      intensity: 'low',
      heartRate: '80-100 bpm'
    }
  ]);

  const [recommendations] = useState([
    { 
      id: 1, 
      type: 'hydration', 
      message: 'Drink 2 more glasses of water today', 
      priority: 'high',
      icon: <LocalDrink />,
      confidence: 92
    },
    { 
      id: 2, 
      type: 'exercise', 
      message: 'Add 10 minutes of stretching to your routine', 
      priority: 'medium',
      icon: <DirectionsRun />,
      confidence: 85
    },
    { 
      id: 3, 
      type: 'sleep', 
      message: 'Try to sleep 30 minutes earlier tonight', 
      priority: 'low',
      icon: <Bedtime />,
      confidence: 78
    }
  ]);

  // Social feed data
  const [socialPosts] = useState([
    {
      id: 1,
      user: 'Sarah M.',
      avatar: 'S',
      time: '2h ago',
      content: 'Just completed my first 5K run! 🏃‍♀️ Feeling amazing!',
      likes: 24,
      comments: 8,
      achievement: '5K Runner'
    },
    {
      id: 2,
      user: 'Mike T.',
      avatar: 'M',
      time: '4h ago',
      content: 'Hit my water intake goal for 30 days straight! 💧',
      likes: 18,
      comments: 5,
      achievement: 'Hydration Master'
    }
  ]);

  const handleCardClick = (cardType) => {
    console.log(`${cardType} card clicked`);
    alert(`Opening ${cardType} details with advanced analytics...`);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  // Biometric Card Component
  const BiometricCard = ({ title, value, unit, icon, color, trend, target }) => (
    <Card sx={{ 
      cursor: 'pointer',
      background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
      border: `2px solid ${color}30`,
      '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 }
    }}
    onClick={() => handleCardClick(title)}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ color: color, fontWeight: 700 }}>
              {typeof value === 'number' ? value.toLocaleString() : value}
              <Typography variant="body1" component="span" sx={{ ml: 1, color: 'text.secondary' }}>
                {unit}
              </Typography>
            </Typography>
            {target && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" color="textSecondary">
                  Target: {target} {unit}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min((value / target) * 100, 100)} 
                  sx={{ 
                    mt: 0.5, 
                    height: 6, 
                    borderRadius: 3,
                    backgroundColor: `${color}20`,
                    '& .MuiLinearProgress-bar': { backgroundColor: color }
                  }} 
                />
              </Box>
            )}
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center">
            <IconButton 
              sx={{ 
                backgroundColor: `${color}20`,
                color: color,
                mb: 1,
                '&:hover': { backgroundColor: `${color}30` }
              }}
            >
              {icon}
            </IconButton>
            {trend && (
              <Chip 
                label={trend}
                size="small"
                color={trend.includes('+') || trend.includes('excellent') || trend.includes('optimal') ? 'success' : 'warning'}
                sx={{ fontSize: '0.75rem' }}
              />
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
    { id: 1, type: 'hydration', message: 'Drink 2 more glasses of water today', priority: 'high' },
    { id: 2, type: 'exercise', message: 'Add 10 minutes of stretching to your routine', priority: 'medium' },
    { id: 3, type: 'sleep', message: 'Try to sleep 30 minutes earlier tonight', priority: 'low' }
  ]);

  const handleCardClick = (cardType) => {
    console.log(`${cardType} card clicked`);
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

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </AppLayout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;