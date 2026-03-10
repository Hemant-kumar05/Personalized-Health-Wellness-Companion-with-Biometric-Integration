import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  CssBaseline, Container, Typography, Box, Paper, TextField, Button, AppBar, Toolbar,
  CircularProgress, Grid, Card, CardContent, CardActions, Avatar, Chip, Badge,
  List, ListItem, ListItemText, ListItemAvatar, IconButton, Tabs, Tab, Divider,
  LinearProgress, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions,
  BottomNavigation, BottomNavigationAction, Drawer, Switch, FormControlLabel,
  Alert, Snackbar, Accordion, AccordionSummary, AccordionDetails, Fab, SpeedDial,
  SpeedDialAction, Rating, Stepper, Step, StepLabel, Timeline, TimelineItem,
  TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, Slider
} from '@mui/material';

// Icons
import {
  Dashboard as DashboardIcon, FitnessCenter as FitnessIcon, Restaurant as NutritionIcon,
  TrendingUp as AnalyticsIcon, People as CommunityIcon, Settings as SettingsIcon,
  Favorite as HeartIcon, DirectionsRun as RunIcon, LocalDining as FoodIcon,
  Sleep as SleepIcon, WaterDrop as WaterIcon, EmojiEvents as TrophyIcon,
  NotificationsActive as NotificationIcon, Share as ShareIcon, Add as AddIcon,
  Timeline as TimelineIcon, Assessment as ReportIcon, Games as GameIcon,
  CameraAlt as CameraIcon, Bluetooth as BluetoothIcon, Schedule as ScheduleIcon,
  Psychology as AIIcon, Groups as GroupsIcon, Star as StarIcon, Edit as EditIcon,
  Delete as DeleteIcon, ExpandMore as ExpandMoreIcon, Close as CloseIcon,
  Menu as MenuIcon, AccountCircle as ProfileIcon, Logout as LogoutIcon,
  Home as HomeIcon, BarChart as ChartIcon
} from '@mui/icons-material';

import { AuthProvider, useAuth } from './context/SimpleAuthContext';

// Enhanced Theme
const theme = createTheme({
  palette: {
    primary: { main: '#2E7D32', light: '#66BB6A', dark: '#1B5E20' },
    secondary: { main: '#FF6B35', light: '#FF8A65', dark: '#E65100' },
    error: { main: '#E53E3E' },
    warning: { main: '#FF9800' },
    info: { main: '#2196F3' },
    success: { main: '#4CAF50' },
    background: { default: '#F8FAFC', paper: '#FFFFFF' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
  },
});

// Enhanced Navigation
const Navbar = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  if (!user) return null;

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'rgba(46, 125, 50, 0.95)', backdropFilter: 'blur(10px)' }}>
      <Toolbar>
        <HeartIcon sx={{ mr: 2, color: 'secondary.main' }} />
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
          Health & Wellness Companion
        </Typography>
        <Badge badgeContent={3} color="error" sx={{ mr: 2 }}>
          <NotificationIcon />
        </Badge>
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={() => setAnchorEl(null)}>
            <ProfileIcon sx={{ mr: 1 }} /> Profile
          </MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>
            <SettingsIcon sx={{ mr: 1 }} /> Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={logout}>
            <LogoutIcon sx={{ mr: 1 }} /> Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

// Enhanced Dashboard with ALL Features
const Dashboard = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [healthData, setHealthData] = useState({
    steps: 12547,
    heartRate: 68,
    weight: 68.5,
    sleepHours: 8.2,
    waterIntake: 7,
    calories: 1680,
    bodyFat: 15.2,
    muscle: 45.8,
    bloodPressure: { systolic: 120, diastolic: 80 },
    oxygenLevel: 98,
    stress: 3.2,
    energy: 8.5
  });

  const [activities, setActivities] = useState([
    { id: 1, name: 'Morning Yoga', duration: '45 min', calories: 180, time: '6:30 AM', type: 'yoga', intensity: 'low' },
    { id: 2, name: 'Cardio Run', duration: '35 min', calories: 420, time: '7:30 AM', type: 'cardio', intensity: 'high' },
    { id: 3, name: 'Strength Training', duration: '60 min', calories: 380, time: '6:00 PM', type: 'strength', intensity: 'high' },
    { id: 4, name: 'Meditation', duration: '20 min', calories: 15, time: '9:00 PM', type: 'mindfulness', intensity: 'low' }
  ]);

  const [meals, setMeals] = useState([
    { id: 1, name: 'Protein Smoothie Bowl', calories: 420, protein: 25, carbs: 45, fats: 12, time: '7:00 AM' },
    { id: 2, name: 'Grilled Salmon Salad', calories: 380, protein: 35, carbs: 15, fats: 18, time: '12:30 PM' },
    { id: 3, name: 'Quinoa Buddha Bowl', calories: 450, protein: 20, carbs: 55, fats: 16, time: '7:00 PM' },
    { id: 4, name: 'Greek Yogurt & Berries', calories: 180, protein: 15, carbs: 22, fats: 4, time: '3:00 PM' }
  ]);

  const [achievements, setAchievements] = useState([
    { id: 1, title: '10K Steps Master', description: 'Reached 10,000 steps for 30 consecutive days', earned: true, points: 500 },
    { id: 2, title: 'Hydration Hero', description: 'Drank 8+ glasses of water for 14 days', earned: true, points: 250 },
    { id: 3, title: 'Early Bird', description: 'Completed morning workouts for 21 days', earned: false, progress: 18, target: 21, points: 300 },
    { id: 4, title: 'Zen Master', description: 'Meditated for 7 consecutive days', earned: true, points: 200 }
  ]);

  const [socialFeed, setSocialFeed] = useState([
    { id: 1, user: 'Sarah M.', action: 'completed a 5K run', time: '2 hours ago', likes: 12, avatar: 'S' },
    { id: 2, user: 'Mike R.', action: 'achieved their weight loss goal', time: '4 hours ago', likes: 28, avatar: 'M' },
    { id: 3, user: 'Lisa K.', action: 'shared a healthy recipe', time: '6 hours ago', likes: 15, avatar: 'L' }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Time for your afternoon water break!', type: 'reminder', time: '2 min ago' },
    { id: 2, message: 'You\'ve reached your daily step goal!', type: 'achievement', time: '1 hour ago' },
    { id: 3, message: 'New workout plan available', type: 'info', time: '3 hours ago' }
  ]);

  const tabContent = [
    // Dashboard Overview
    <Box>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Key Metrics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <CardContent sx={{ color: 'white', textAlign: 'center' }}>
              <RunIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">{healthData.steps.toLocaleString()}</Typography>
              <Typography variant="body2">Steps Today</Typography>
              <LinearProgress variant="determinate" value={85} sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.3)' }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <CardContent sx={{ color: 'white', textAlign: 'center' }}>
              <HeartIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">{healthData.heartRate}</Typography>
              <Typography variant="body2">BPM</Typography>
              <Typography variant="caption">Resting Heart Rate</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <CardContent sx={{ color: 'white', textAlign: 'center' }}>
              <WaterIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">{healthData.waterIntake}/8</Typography>
              <Typography variant="body2">Glasses Today</Typography>
              <LinearProgress variant="determinate" value={87.5} sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.3)' }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
            <CardContent sx={{ color: 'white', textAlign: 'center' }}>
              <SleepIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">{healthData.sleepHours}h</Typography>
              <Typography variant="body2">Sleep Last Night</Typography>
              <Rating value={4} readOnly size="small" sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Advanced Health Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <ChartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Health Trends
              </Typography>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50' }}>
                <Typography color="text.secondary">Interactive Charts Coming Soon</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <TrophyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Recent Achievements
              </Typography>
              {achievements.filter(a => a.earned).slice(0, 3).map((achievement) => (
                <Box key={achievement.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'warning.main', width: 32, height: 32, mr: 2 }}>
                    <TrophyIcon fontSize="small" />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">{achievement.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      +{achievement.points} points
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Today's Activities & Nutrition */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <FitnessIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Today's Activities
              </Typography>
              {activities.map((activity) => (
                <Box key={activity.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, mb: 1, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">{activity.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {activity.time} • {activity.duration}
                    </Typography>
                  </Box>
                  <Chip 
                    label={`${activity.calories} cal`} 
                    color="secondary" 
                    size="small" 
                    variant="outlined" 
                  />
                </Box>
              ))}
              <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
                Total: {activities.reduce((sum, activity) => sum + activity.calories, 0)} calories burned
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <NutritionIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Nutrition Today
              </Typography>
              {meals.map((meal) => (
                <Box key={meal.id} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" fontWeight="bold">{meal.name}</Typography>
                    <Typography variant="body2">{meal.calories} cal</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {meal.time} • P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fats}g
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(meal.calories / 500) * 100} 
                    sx={{ mt: 1, height: 4, borderRadius: 2 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>,

    // Fitness & Workouts Tab
    <Box>
      <Typography variant="h5" gutterBottom>Fitness & Workouts</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Quick Workouts</Typography>
              <List>
                <ListItem button>
                  <ListItemText primary="7-Minute HIIT" secondary="High Intensity" />
                  <Chip label="15 min" size="small" />
                </ListItem>
                <ListItem button>
                  <ListItemText primary="Morning Yoga" secondary="Flexibility" />
                  <Chip label="30 min" size="small" />
                </ListItem>
                <ListItem button>
                  <ListItemText primary="Strength Circuit" secondary="Muscle Building" />
                  <Chip label="45 min" size="small" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6">Workout Schedule</Typography>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50' }}>
                <Typography>Interactive Calendar Coming Soon</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>,

    // Social & Community Tab
    <Box>
      <Typography variant="h5" gutterBottom>Community</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <GroupsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Activity Feed
              </Typography>
              {socialFeed.map((post) => (
                <Box key={post.id} sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>{post.avatar}</Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2">
                      <strong>{post.user}</strong> {post.action}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">{post.time}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <HeartIcon sx={{ fontSize: 16, color: 'error.main', mr: 0.5 }} />
                    <Typography variant="caption">{post.likes}</Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Active Challenges</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="bold">30-Day Step Challenge</Typography>
                <Typography variant="caption">245 participants</Typography>
                <LinearProgress variant="determinate" value={78} sx={{ mt: 1 }} />
                <Typography variant="caption">Day 23 of 30</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="bold">Hydration Week</Typography>
                <Typography variant="caption">89 participants</Typography>
                <LinearProgress variant="determinate" value={45} sx={{ mt: 1 }} />
                <Typography variant="caption">Day 3 of 7</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>,

    // Analytics Tab
    <Box>
      <Typography variant="h5" gutterBottom>Analytics & Reports</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Health Progress Overview</Typography>
              <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50' }}>
                <Typography>Advanced Analytics Dashboard Coming Soon</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Welcome back, {user?.name}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's your comprehensive health overview for today
          </Typography>
        </Box>
        <Box>
          <Button variant="contained" startIcon={<AddIcon />} sx={{ mr: 1 }}>
            Log Activity
          </Button>
          <Button variant="outlined" startIcon={<ShareIcon />}>
            Share Progress
          </Button>
        </Box>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
          <Tab icon={<DashboardIcon />} label="Dashboard" />
          <Tab icon={<FitnessIcon />} label="Fitness" />
          <Tab icon={<GroupsIcon />} label="Community" />
          <Tab icon={<AnalyticsIcon />} label="Analytics" />
        </Tabs>
      </Box>

      {tabContent[currentTab]}

      {/* Floating Action Buttons */}
      <SpeedDial
        ariaLabel="Quick Actions"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<AddIcon />}
      >
        <SpeedDialAction icon={<FitnessIcon />} tooltipTitle="Log Workout" />
        <SpeedDialAction icon={<FoodIcon />} tooltipTitle="Log Meal" />
        <SpeedDialAction icon={<WaterIcon />} tooltipTitle="Log Water" />
        <SpeedDialAction icon={<CameraIcon />} tooltipTitle="Take Photo" />
      </SpeedDial>
    </Container>
  );
};

// Enhanced Login Component
const Login = () => {
  const { login, loading, user } = useAuth();
  const [email, setEmail] = useState('hemantrajaur@gmail.com');
  const [password, setPassword] = useState('password');

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, borderRadius: 3, boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
              <HeartIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to your Health & Wellness account
            </Typography>
          </Box>
          
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email *"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password *"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ py: 1.5, fontSize: '1.1rem', borderRadius: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'SIGN IN'}
            </Button>
          </Box>
          
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2">
              Don't have an account?{' '}
              <Button component={Link} to="/register" variant="text" sx={{ textTransform: 'none', fontWeight: 600 }}>
                Create Account
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Main App Layout
const AppLayout = ({ children }) => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      {children}
    </Box>
  );
};

// Main App Component
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppLayout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </AppLayout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;