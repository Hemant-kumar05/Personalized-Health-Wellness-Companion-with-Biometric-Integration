import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Badge,
  Menu,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  Switch,
  FormControlLabel
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
  ExpandMore,
  Share,
  ThumbUp,
  Chat,
  Timer,
  CalendarToday,
  Star,
  Psychology
} from '@mui/icons-material';
import { Line, Bar, Pie, Doughnut, Radar } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/SimpleAuthContext';

// Advanced Theme with animations and gradients
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
      background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
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
          backdropFilter: 'blur(10px)',
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

// Advanced Navigation Bar with notifications and user menu
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

  if (!user) return null;

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
      </Toolbar>
    </AppBar>
  );
};

// Advanced Biometric Card with real-time monitoring
const BiometricCard = ({ title, value, unit, icon, color, trend, onClick, target }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card 
      onClick={onClick}
      sx={{ 
        cursor: 'pointer',
        background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
        border: `2px solid ${color}30`,
        position: 'relative',
        overflow: 'visible',
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ color: color, fontWeight: 700 }}>
              {value}
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
                  value={(value / target) * 100} 
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
                color={trend.includes('+') ? 'success' : 'warning'}
                sx={{ fontSize: '0.75rem' }}
              />
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  </motion.div>
);

// Activity Tracking Component
const ActivityTracker = () => {
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

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom display="flex" alignItems="center">
          <DirectionsRun sx={{ mr: 1, color: 'primary.main' }} />
          Today's Activities
        </Typography>
        <List>
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ListItem sx={{ 
                bgcolor: 'background.paper',
                mb: 1,
                borderRadius: 2,
                border: '1px solid rgba(0,0,0,0.1)'
              }}>
                <ListItemIcon>
                  <Chip 
                    label={activity.type}
                    color="primary"
                    size="small"
                    variant="outlined"
                  />
                </ListItemIcon>
                <ListItemText
                  primary={activity.name}
                  secondary={
                    <Box>
                      <Typography variant="caption" display="block">
                        {activity.time} • {activity.duration} • {activity.calories} cal
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        HR: {activity.heartRate} • {activity.intensity} intensity
                      </Typography>
                    </Box>
                  }
                />
                <Chip 
                  label={`${activity.calories} cal`}
                  color="success"
                  size="small"
                />
              </ListItem>
            </motion.div>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

// AI-Powered Insights Component
const AIInsights = () => {
  const [insights] = useState([
    {
      id: 1,
      type: 'trend',
      title: 'Heart Rate Trend',
      message: 'Your resting heart rate has improved by 8% this month. Keep up the cardio!',
      confidence: 95,
      action: 'Continue current exercise routine'
    },
    {
      id: 2,
      type: 'nutrition',
      title: 'Hydration Optimization',
      message: 'Based on your activity level, increase water intake by 20% on workout days.',
      confidence: 88,
      action: 'Drink 2 extra glasses on active days'
    },
    {
      id: 3,
      type: 'sleep',
      title: 'Sleep Quality Analysis',
      message: 'Your sleep efficiency is 92%. Consider reducing screen time 1 hour before bed.',
      confidence: 91,
      action: 'Set evening phone reminder'
    }
  ]);

  return (
    <Card sx={{ background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom display="flex" alignItems="center">
          <Psychology sx={{ mr: 1, color: 'secondary.main' }} />
          AI Health Insights
        </Typography>
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Accordion sx={{ mb: 1, boxShadow: 'none', border: '1px solid rgba(0,0,0,0.1)' }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box display="flex" alignItems="center" width="100%">
                  <Star sx={{ color: 'warning.main', mr: 1 }} />
                  <Box flexGrow={1}>
                    <Typography variant="subtitle2">{insight.title}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      Confidence: {insight.confidence}%
                    </Typography>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  {insight.message}
                </Typography>
                <Chip 
                  label={insight.action}
                  color="primary"
                  size="small"
                  variant="outlined"
                />
              </AccordionDetails>
            </Accordion>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};

// Nutrition Tracker Component
const NutritionTracker = () => {
  const [nutritionData] = useState({
    calories: { consumed: 1847, target: 2200 },
    protein: { consumed: 120, target: 150 },
    carbs: { consumed: 180, target: 220 },
    fats: { consumed: 65, target: 80 }
  });

  const [meals] = useState([
    { name: 'Breakfast', calories: 420, time: '8:00 AM', items: ['Oatmeal', 'Berries', 'Almonds'] },
    { name: 'Lunch', calories: 650, time: '12:30 PM', items: ['Chicken Salad', 'Quinoa', 'Avocado'] },
    { name: 'Dinner', calories: 580, time: '7:00 PM', items: ['Salmon', 'Brown Rice', 'Vegetables'] },
    { name: 'Snacks', calories: 197, time: 'Various', items: ['Apple', 'Greek Yogurt', 'Nuts'] }
  ]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom display="flex" alignItems="center">
          <Restaurant sx={{ mr: 1, color: 'success.main' }} />
          Nutrition Tracking
        </Typography>
        
        {/* Macro nutrients */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {Object.entries(nutritionData).map(([key, data]) => (
            <Grid item xs={6} sm={3} key={key}>
              <Box textAlign="center">
                <Typography variant="caption" color="textSecondary">
                  {key.toUpperCase()}
                </Typography>
                <CircularProgress
                  variant="determinate"
                  value={(data.consumed / data.target) * 100}
                  size={60}
                  thickness={6}
                  sx={{ display: 'block', mx: 'auto', mb: 1 }}
                />
                <Typography variant="body2">
                  {data.consumed}/{data.target}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Meals */}
        <Typography variant="subtitle2" gutterBottom>Today's Meals</Typography>
        {meals.map((meal, index) => (
          <motion.div
            key={meal.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                p: 1,
                mb: 1,
                bgcolor: 'background.paper',
                borderRadius: 1,
                border: '1px solid rgba(0,0,0,0.1)'
              }}
            >
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {meal.name}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {meal.time} • {meal.items.join(', ')}
                </Typography>
              </Box>
              <Chip 
                label={`${meal.calories} cal`}
                size="small"
                color="success"
              />
            </Box>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};

// Social Features Component
const SocialFeed = () => {
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
    },
    {
      id: 3,
      user: 'Emma L.',
      avatar: 'E',
      time: '6h ago',
      content: 'New PR on bench press! 120lbs 💪',
      likes: 31,
      comments: 12,
      achievement: 'Strength Champion'
    }
  ]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom display="flex" alignItems="center">
          <Group sx={{ mr: 1, color: 'primary.main' }} />
          Community Feed
        </Typography>
        {socialPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Box sx={{ 
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: 2,
              p: 2,
              mb: 2,
              bgcolor: 'background.paper'
            }}>
              <Box display="flex" alignItems="center" mb={1}>
                <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}>
                  {post.avatar}
                </Avatar>
                <Box flexGrow={1}>
                  <Typography variant="subtitle2">{post.user}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {post.time}
                  </Typography>
                </Box>
                <Chip 
                  label={post.achievement}
                  size="small"
                  color="warning"
                  icon={<EmojiEvents />}
                />
              </Box>
              <Typography variant="body2" paragraph>
                {post.content}
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <Button 
                  size="small" 
                  startIcon={<ThumbUp />}
                  sx={{ textTransform: 'none' }}
                >
                  {post.likes}
                </Button>
                <Button 
                  size="small" 
                  startIcon={<Chat />}
                  sx={{ textTransform: 'none' }}
                >
                  {post.comments}
                </Button>
                <IconButton size="small">
                  <Share />
                </IconButton>
              </Box>
            </Box>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};

// Workout Planner Component
const WorkoutPlanner = () => {
  const [workoutPlan] = useState([
    {
      id: 1,
      name: 'Upper Body Strength',
      duration: '45 min',
      exercises: 8,
      difficulty: 'Intermediate',
      equipment: ['Dumbbells', 'Bench'],
      calories: '350-400'
    },
    {
      id: 2,
      name: 'HIIT Cardio',
      duration: '30 min',
      exercises: 6,
      difficulty: 'Advanced',
      equipment: ['Bodyweight'],
      calories: '300-350'
    },
    {
      id: 3,
      name: 'Yoga Flow',
      duration: '60 min',
      exercises: 12,
      difficulty: 'Beginner',
      equipment: ['Mat'],
      calories: '150-200'
    }
  ]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom display="flex" alignItems="center">
          <DirectionsRun sx={{ mr: 1, color: 'warning.main' }} />
          Workout Planner
        </Typography>
        <Grid container spacing={2}>
          {workoutPlan.map((workout, index) => (
            <Grid item xs={12} sm={6} md={4} key={workout.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card sx={{ 
                  border: '2px solid transparent',
                  '&:hover': { 
                    borderColor: 'primary.main',
                    transform: 'scale(1.02)',
                    transition: 'all 0.2s'
                  }
                }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      {workout.name}
                    </Typography>
                    <Box display="flex" gap={1} mb={1}>
                      <Chip label={workout.difficulty} size="small" color="primary" />
                      <Chip label={`${workout.duration}`} size="small" variant="outlined" />
                    </Box>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {workout.exercises} exercises • {workout.calories} cal
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Equipment: {workout.equipment.join(', ')}
                    </Typography>
                    <Button 
                      fullWidth 
                      variant="outlined" 
                      size="small" 
                      sx={{ mt: 1 }}
                    >
                      Start Workout
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

// Main Dashboard Component with all advanced features
const Dashboard = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('');

  // Advanced health data with more metrics
  const [healthData] = useState({
    steps: { value: 8547, target: 10000, unit: 'steps' },
    heartRate: { value: 72, unit: 'bpm', status: 'normal' },
    bloodPressure: { systolic: 118, diastolic: 78, unit: 'mmHg' },
    oxygenSat: { value: 98, unit: '%', status: 'excellent' },
    temperature: { value: 98.6, unit: '°F', status: 'normal' },
    weight: { value: 68.5, unit: 'kg', trend: '-0.2kg' },
    sleepHours: { value: 7.5, target: 8, unit: 'hours' },
    waterIntake: { value: 6, target: 8, unit: 'glasses' },
    calories: { consumed: 1847, burned: 2200, target: 2000 }
  });

  const handleMetricClick = (metric) => {
    setSelectedMetric(metric);
    setDialogOpen(true);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
        {/* Welcome Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              🌟 Welcome Back, {user?.name}!
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Here's your comprehensive health overview for today
            </Typography>
          </Box>
        </motion.div>

        {/* Tabs for different sections */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={selectedTab} onChange={handleTabChange} centered>
            <Tab label="Health Dashboard" />
            <Tab label="Activities & Workouts" />
            <Tab label="Nutrition & Meals" />
            <Tab label="Community & Social" />
            <Tab label="AI Insights" />
          </Tabs>
        </Box>

        {/* Health Dashboard Tab */}
        <TabPanel value={selectedTab} index={0}>
          <Grid container spacing={3}>
            {/* Primary Health Metrics */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={4} lg={3}>
                  <BiometricCard
                    title="Steps"
                    value={healthData.steps.value.toLocaleString()}
                    unit={healthData.steps.unit}
                    icon={<DirectionsRun />}
                    color="#4caf50"
                    trend="+8.2%"
                    target={healthData.steps.target}
                    onClick={() => handleMetricClick('steps')}
                  />
                </Grid>
                <Grid item xs={6} sm={4} lg={3}>
                  <BiometricCard
                    title="Heart Rate"
                    value={healthData.heartRate.value}
                    unit={healthData.heartRate.unit}
                    icon={<Favorite />}
                    color="#f44336"
                    trend="Normal"
                    onClick={() => handleMetricClick('heartRate')}
                  />
                </Grid>
                <Grid item xs={6} sm={4} lg={3}>
                  <BiometricCard
                    title="Blood Pressure"
                    value={`${healthData.bloodPressure.systolic}/${healthData.bloodPressure.diastolic}`}
                    unit={healthData.bloodPressure.unit}
                    icon={<BloodtypeOutlined />}
                    color="#9c27b0"
                    trend="Optimal"
                    onClick={() => handleMetricClick('bloodPressure')}
                  />
                </Grid>
                <Grid item xs={6} sm={4} lg={3}>
                  <BiometricCard
                    title="Oxygen Saturation"
                    value={healthData.oxygenSat.value}
                    unit={healthData.oxygenSat.unit}
                    icon={<AirOutlined />}
                    color="#00bcd4"
                    trend="Excellent"
                    onClick={() => handleMetricClick('oxygenSat')}
                  />
                </Grid>
                <Grid item xs={6} sm={4} lg={3}>
                  <BiometricCard
                    title="Temperature"
                    value={healthData.temperature.value}
                    unit={healthData.temperature.unit}
                    icon={<Thermostat />}
                    color="#ff9800"
                    trend="Normal"
                    onClick={() => handleMetricClick('temperature')}
                  />
                </Grid>
                <Grid item xs={6} sm={4} lg={3}>
                  <BiometricCard
                    title="Weight"
                    value={healthData.weight.value}
                    unit={healthData.weight.unit}
                    icon={<MonitorHeart />}
                    color="#607d8b"
                    trend={healthData.weight.trend}
                    onClick={() => handleMetricClick('weight')}
                  />
                </Grid>
                <Grid item xs={6} sm={4} lg={3}>
                  <BiometricCard
                    title="Sleep"
                    value={healthData.sleepHours.value}
                    unit={healthData.sleepHours.unit}
                    icon={<Bedtime />}
                    color="#3f51b5"
                    target={healthData.sleepHours.target}
                    onClick={() => handleMetricClick('sleep')}
                  />
                </Grid>
                <Grid item xs={6} sm={4} lg={3}>
                  <BiometricCard
                    title="Hydration"
                    value={healthData.waterIntake.value}
                    unit={healthData.waterIntake.unit}
                    icon={<LocalDrink />}
                    color="#2196f3"
                    target={healthData.waterIntake.target}
                    onClick={() => handleMetricClick('hydration')}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Daily Progress Summary */}
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                height: 'fit-content'
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    📊 Daily Progress
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Overall Health Score
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={87} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        '& .MuiLinearProgress-bar': { backgroundColor: '#4caf50' }
                      }} 
                    />
                    <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
                      87%
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2">Calories Burned</Typography>
                      <Typography variant="h6">{healthData.calories.burned}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">Active Minutes</Typography>
                      <Typography variant="h6">142</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Activities & Workouts Tab */}
        <TabPanel value={selectedTab} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <ActivityTracker />
            </Grid>
            <Grid item xs={12} lg={6}>
              <WorkoutPlanner />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Nutrition Tab */}
        <TabPanel value={selectedTab} index={2}>
          <NutritionTracker />
        </TabPanel>

        {/* Community Tab */}
        <TabPanel value={selectedTab} index={3}>
          <SocialFeed />
        </TabPanel>

        {/* AI Insights Tab */}
        <TabPanel value={selectedTab} index={4}>
          <AIInsights />
        </TabPanel>

        {/* Detailed Metric Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Details
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" paragraph>
              Detailed analysis and historical data for {selectedMetric} will be displayed here.
              This would include charts, trends, and personalized recommendations.
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Feature coming soon with advanced analytics and AI-powered insights!
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </motion.div>
  );
};

// Login Component (Enhanced)
const Login = () => {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, 'New User');
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={10} sx={{ 
          p: 4, 
          borderRadius: 4,
          background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)'
        }}>
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" component="h1" gutterBottom>
              🏥 Health & Wellness Pro
            </Typography>
            <Typography variant="h6" color="textSecondary">
              {isLogin ? 'Welcome Back!' : 'Join Our Community'}
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
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
              sx={{ 
                mb: 2,
                height: 48,
                background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a6fd8 0%, #6a4190 100%)',
                }
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </Button>
            
            <Button
              fullWidth
              variant="text"
              onClick={() => setIsLogin(!isLogin)}
              sx={{ textTransform: 'none' }}
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </Button>
          </form>
        </Paper>
      </motion.div>
    </Container>
  );
};

// Main App Component
const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
      >
        <CircularProgress size={60} sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        <Navbar />
        <Routes>
          <Route 
            path="/" 
            element={user ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/login" 
            element={!user ? <Login /> : <Navigate to="/" />} 
          />
        </Routes>
      </Box>
    </Router>
  );
};

// Root App with Providers
const AppWithProviders = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AuthProvider>
      <App />
    </AuthProvider>
  </ThemeProvider>
);

export default AppWithProviders;