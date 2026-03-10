import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Alert
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
  Notifications,
  ExpandMore,
  Share,
  ThumbUp,
  Chat,
  Star,
  Psychology,
  ShowChart,
  Timeline,
  Assessment,
  History,
  TrendingDown,
  Warning,
  CheckCircle
} from '@mui/icons-material';
import { Line, Bar, Doughnut, Area } from 'react-chartjs-2';
import { AuthProvider, useAuth } from './context/SimpleAuthContext';

// Enhanced Theme
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
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600 },
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

// Enhanced Navigation Bar
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
      </Toolbar>
    </AppBar>
  );
};

// Enhanced Detail Dialog Component with Real Analytics
const DetailDialog = ({ open, onClose, metric, data }) => {
  if (!metric || !data) return null;

  // Generate realistic historical data
  const generateHistoricalData = (baseValue, days = 30) => {
    const data = [];
    const labels = [];
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      
      const variance = (Math.random() - 0.5) * 0.2; // 20% variance
      data.push(Math.round((baseValue + baseValue * variance) * 100) / 100);
    }
    return { labels, data };
  };

  const getMetricDetails = () => {
    switch (metric) {
      case 'steps':
        const stepsHistory = generateHistoricalData(data.steps.value, 14);
        return {
          title: 'Steps Analysis',
          icon: <DirectionsRun />,
          color: '#4caf50',
          chartData: {
            labels: stepsHistory.labels,
            datasets: [{
              label: 'Daily Steps',
              data: stepsHistory.data,
              borderColor: '#4caf50',
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              fill: true,
              tension: 0.4,
            }]
          },
          insights: [
            { type: 'success', text: 'You\'re 15% above your daily average this week!' },
            { type: 'info', text: 'Best day: 12,547 steps on Monday' },
            { type: 'warning', text: 'Try to maintain consistency on weekends' }
          ],
          recommendations: [
            'Take a 10-minute walk after lunch',
            'Use stairs instead of elevators',
            'Park farther from destinations'
          ],
          stats: {
            'Weekly Average': '9,234 steps',
            'Monthly Total': '267,890 steps',
            'Best Streak': '12 days above target',
            'Calories Burned': '2,847 cal (estimated)'
          }
        };

      case 'heartRate':
        const hrHistory = generateHistoricalData(data.heartRate.value, 14);
        return {
          title: 'Heart Rate Analysis',
          icon: <Favorite />,
          color: '#f44336',
          chartData: {
            labels: hrHistory.labels,
            datasets: [{
              label: 'Resting Heart Rate',
              data: hrHistory.data,
              borderColor: '#f44336',
              backgroundColor: 'rgba(244, 67, 54, 0.1)',
              fill: true,
              tension: 0.4,
            }]
          },
          insights: [
            { type: 'success', text: 'Your resting heart rate has improved by 8% this month' },
            { type: 'info', text: 'Currently in the "Good" range for your age group' },
            { type: 'info', text: 'Average during workouts: 145-165 bpm' }
          ],
          recommendations: [
            'Continue regular cardio exercise',
            'Monitor heart rate during high-intensity workouts',
            'Consider heart rate variability tracking'
          ],
          stats: {
            'Resting HR Range': '65-75 bpm',
            'Max HR (workout)': '178 bpm',
            'Recovery Rate': 'Excellent',
            'Monthly Trend': '↓ 3 bpm improvement'
          }
        };

      case 'bloodPressure':
        return {
          title: 'Blood Pressure Analysis',
          icon: <BloodtypeOutlined />,
          color: '#9c27b0',
          chartData: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [
              {
                label: 'Systolic',
                data: [120, 118, 116, 118],
                borderColor: '#9c27b0',
                backgroundColor: 'rgba(156, 39, 176, 0.1)',
              },
              {
                label: 'Diastolic', 
                data: [80, 78, 76, 78],
                borderColor: '#673ab7',
                backgroundColor: 'rgba(103, 58, 183, 0.1)',
              }
            ]
          },
          insights: [
            { type: 'success', text: 'Your blood pressure is in the optimal range' },
            { type: 'info', text: 'Consistent readings indicate good cardiovascular health' },
            { type: 'success', text: 'No significant fluctuations detected' }
          ],
          recommendations: [
            'Maintain current diet and exercise routine',
            'Continue limiting sodium intake',
            'Keep stress levels manageable',
            'Monitor readings weekly'
          ],
          stats: {
            'Category': 'Optimal',
            'Average Systolic': '118 mmHg',
            'Average Diastolic': '78 mmHg',
            'Risk Level': 'Low'
          }
        };

      case 'oxygenSat':
        return {
          title: 'Oxygen Saturation Analysis',
          icon: <AirOutlined />,
          color: '#00bcd4',
          chartData: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              label: 'SpO2 Level (%)',
              data: [98, 97, 98, 99, 98, 97, 98],
              borderColor: '#00bcd4',
              backgroundColor: 'rgba(0, 188, 212, 0.1)',
              fill: true,
            }]
          },
          insights: [
            { type: 'success', text: 'Excellent oxygen saturation levels' },
            { type: 'info', text: 'Consistent readings indicate healthy lung function' },
            { type: 'success', text: 'All readings above 95% (normal range)' }
          ],
          recommendations: [
            'Continue regular aerobic exercise',
            'Practice deep breathing exercises',
            'Maintain good posture for optimal breathing',
            'Monitor during high-altitude activities'
          ],
          stats: {
            'Average SpO2': '98%',
            'Range': '97-99%',
            'Status': 'Excellent',
            'Trend': 'Stable'
          }
        };

      case 'temperature':
        return {
          title: 'Body Temperature Analysis',
          icon: <Thermostat />,
          color: '#ff9800',
          chartData: {
            labels: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'],
            datasets: [{
              label: 'Temperature (°F)',
              data: [97.8, 98.2, 98.6, 99.0, 98.8, 98.4],
              borderColor: '#ff9800',
              backgroundColor: 'rgba(255, 152, 0, 0.1)',
              fill: true,
            }]
          },
          insights: [
            { type: 'success', text: 'Normal daily temperature variation' },
            { type: 'info', text: 'Typical circadian rhythm pattern observed' },
            { type: 'success', text: 'No signs of fever or hypothermia' }
          ],
          recommendations: [
            'Monitor for any significant changes',
            'Stay hydrated in hot weather',
            'Dress appropriately for temperature',
            'Track during illness for health monitoring'
          ],
          stats: {
            'Average': '98.6°F',
            'Daily Range': '97.8-99.0°F',
            'Status': 'Normal',
            'Circadian Pattern': 'Healthy'
          }
        };

      case 'weight':
        const weightHistory = generateHistoricalData(data.weight.value, 30);
        return {
          title: 'Weight Analysis',
          icon: <MonitorHeart />,
          color: '#607d8b',
          chartData: {
            labels: weightHistory.labels,
            datasets: [{
              label: 'Weight (kg)',
              data: weightHistory.data,
              borderColor: '#607d8b',
              backgroundColor: 'rgba(96, 125, 139, 0.1)',
              fill: true,
              tension: 0.4,
            }]
          },
          insights: [
            { type: 'success', text: 'Healthy weight loss trend of 0.2kg this week' },
            { type: 'info', text: 'BMI: 22.1 (Normal range)' },
            { type: 'success', text: 'Consistent progress toward your goal' }
          ],
          recommendations: [
            'Continue current diet and exercise plan',
            'Focus on strength training to maintain muscle mass',
            'Track measurements beyond just weight',
            'Celebrate non-scale victories'
          ],
          stats: {
            'BMI': '22.1 (Normal)',
            'Monthly Change': '-0.8 kg',
            'Goal Progress': '78% complete',
            'Body Fat %': '18% (estimated)'
          }
        };

      case 'sleep':
        return {
          title: 'Sleep Analysis',
          icon: <Bedtime />,
          color: '#3f51b5',
          chartData: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
              {
                label: 'Sleep Duration (hours)',
                data: [7.5, 8.0, 7.2, 7.8, 6.9, 8.5, 8.2],
                borderColor: '#3f51b5',
                backgroundColor: 'rgba(63, 81, 181, 0.1)',
              },
              {
                label: 'Sleep Quality (1-10)',
                data: [8, 9, 7, 8, 6, 9, 8],
                borderColor: '#673ab7',
                backgroundColor: 'rgba(103, 58, 183, 0.1)',
                yAxisID: 'y1',
              }
            ]
          },
          insights: [
            { type: 'success', text: 'Good average sleep duration of 7.5 hours' },
            { type: 'warning', text: 'Friday shows shorter sleep - avoid late nights' },
            { type: 'info', text: 'Weekend recovery sleep is excellent' }
          ],
          recommendations: [
            'Maintain consistent bedtime routine',
            'Limit screen time 1 hour before bed',
            'Keep bedroom cool and dark',
            'Try relaxation techniques for better quality'
          ],
          stats: {
            'Average Duration': '7.5 hours',
            'Sleep Efficiency': '92%',
            'Deep Sleep': '23% of total',
            'REM Sleep': '21% of total'
          }
        };

      case 'hydration':
        return {
          title: 'Hydration Analysis',
          icon: <LocalDrink />,
          color: '#2196f3',
          chartData: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              label: 'Water Intake (glasses)',
              data: [6, 8, 5, 7, 6, 9, 8],
              backgroundColor: ['#2196f3', '#4caf50', '#f44336', '#ff9800', '#2196f3', '#4caf50', '#4caf50'],
              borderColor: '#2196f3',
              borderWidth: 2,
            }]
          },
          insights: [
            { type: 'warning', text: 'Wednesday and Friday show lower intake' },
            { type: 'success', text: 'Great hydration on weekends!' },
            { type: 'info', text: 'Average intake is 75% of recommended amount' }
          ],
          recommendations: [
            'Set hourly water reminders',
            'Keep a water bottle at your desk',
            'Drink a glass before each meal',
            'Monitor urine color for hydration status'
          ],
          stats: {
            'Daily Average': '7 glasses',
            'Weekly Total': '49 glasses',
            'Goal Achievement': '75%',
            'Best Day': 'Saturday (9 glasses)'
          }
        };

      default:
        return null;
    }
  };

  const details = getMetricDetails();
  if (!details) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton sx={{ color: details.color }}>
            {details.icon}
          </IconButton>
          <Typography variant="h6">{details.title}</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Chart Section */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                  <ShowChart /> Historical Trends
                </Typography>
                <Box sx={{ height: 300, mt: 2 }}>
                  <Line 
                    data={details.chartData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'top' },
                        tooltip: {
                          mode: 'index',
                          intersect: false,
                        },
                      },
                      scales: {
                        x: { display: true },
                        y: { display: true },
                        ...(details.chartData.datasets[1]?.yAxisID && {
                          y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            grid: { drawOnChartArea: false },
                          }
                        })
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Stats Section */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                  <Assessment /> Key Statistics
                </Typography>
                {Object.entries(details.stats).map(([key, value]) => (
                  <Box key={key} sx={{ mb: 1.5 }}>
                    <Typography variant="body2" color="textSecondary">{key}</Typography>
                    <Typography variant="h6" color="primary">{value}</Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Insights Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
              <Psychology /> AI Health Insights
            </Typography>
            <Grid container spacing={2}>
              {details.insights.map((insight, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Alert 
                    severity={insight.type} 
                    variant="outlined"
                    icon={
                      insight.type === 'success' ? <CheckCircle /> :
                      insight.type === 'warning' ? <Warning /> :
                      <TrendingUp />
                    }
                  >
                    {insight.text}
                  </Alert>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Recommendations Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
              <Star /> Personalized Recommendations
            </Typography>
            <List>
              {details.recommendations.map((rec, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Chip 
                      label={index + 1} 
                      size="small" 
                      color="primary" 
                      sx={{ width: 24, height: 24 }} 
                    />
                  </ListItemIcon>
                  <ListItemText primary={rec} />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">Close</Button>
        <Button variant="contained" startIcon={<Share />}>Share Report</Button>
      </DialogActions>
    </Dialog>
  );
};

// Biometric Card Component
const BiometricCard = ({ title, value, unit, icon, color, trend, target, onClick }) => (
  <Card sx={{ 
    cursor: 'pointer',
    background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
    border: `2px solid ${color}30`,
  }}
  onClick={onClick}
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

// Activity Tracker Component
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
          {activities.map((activity) => (
            <ListItem key={activity.id} sx={{ 
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
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

// AI Insights Component
const AIInsights = () => {
  const [insights] = useState([
    {
      id: 1,
      type: 'trend',
      title: 'Heart Rate Trend Analysis',
      message: 'Your resting heart rate has improved by 8% this month, indicating enhanced cardiovascular fitness.',
      confidence: 95,
      action: 'Continue current cardio routine'
    },
    {
      id: 2,
      type: 'nutrition',
      title: 'Hydration Optimization',
      message: 'Analysis shows 20% better performance on days with optimal hydration. Consider increasing intake on workout days.',
      confidence: 88,
      action: 'Set hydration reminders for active days'
    },
    {
      id: 3,
      type: 'sleep',
      title: 'Sleep Quality Correlation',
      message: 'Sleep efficiency correlates with next-day activity levels. Your 92% efficiency is excellent.',
      confidence: 91,
      action: 'Maintain consistent sleep schedule'
    }
  ]);

  return (
    <Card sx={{ background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom display="flex" alignItems="center">
          <Psychology sx={{ mr: 1, color: 'secondary.main' }} />
          AI Health Insights
        </Typography>
        {insights.map((insight) => (
          <Accordion key={insight.id} sx={{ mb: 1, boxShadow: 'none', border: '1px solid rgba(0,0,0,0.1)' }}>
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
    { name: 'Breakfast', calories: 420, time: '8:00 AM', items: ['Oatmeal with berries', 'Greek yogurt', 'Almonds'] },
    { name: 'Lunch', calories: 650, time: '12:30 PM', items: ['Grilled chicken salad', 'Quinoa bowl', 'Avocado'] },
    { name: 'Dinner', calories: 580, time: '7:00 PM', items: ['Baked salmon', 'Brown rice', 'Steamed vegetables'] },
    { name: 'Snacks', calories: 197, time: 'Various', items: ['Apple with peanut butter', 'Protein shake', 'Mixed nuts'] }
  ]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom display="flex" alignItems="center">
          <Restaurant sx={{ mr: 1, color: 'success.main' }} />
          Nutrition Tracking
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {Object.entries(nutritionData).map(([key, data]) => (
            <Grid item xs={6} sm={3} key={key}>
              <Box textAlign="center">
                <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'uppercase' }}>
                  {key}
                </Typography>
                <Box sx={{ position: 'relative', display: 'inline-flex', mb: 1 }}>
                  <CircularProgress
                    variant="determinate"
                    value={(data.consumed / data.target) * 100}
                    size={60}
                    thickness={6}
                    sx={{ 
                      color: key === 'calories' ? 'primary.main' : 
                             key === 'protein' ? 'secondary.main' :
                             key === 'carbs' ? 'warning.main' : 'info.main'
                    }}
                  />
                  <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}>
                    <Typography variant="caption" component="div" color="textSecondary">
                      {Math.round((data.consumed / data.target) * 100)}%
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2">
                  {data.consumed}/{data.target}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Typography variant="subtitle2" gutterBottom>Today's Meals</Typography>
        {meals.map((meal) => (
          <Box key={meal.name} sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            p: 2,
            mb: 1,
            bgcolor: 'background.paper',
            borderRadius: 2,
            border: '1px solid rgba(0,0,0,0.1)'
          }}>
            <Box>
              <Typography variant="body2" fontWeight={500}>
                {meal.name}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {meal.time}
              </Typography>
              <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                {meal.items.join(' • ')}
              </Typography>
            </Box>
            <Chip 
              label={`${meal.calories} cal`}
              size="small"
              color="success"
            />
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

// Social Feed Component
const SocialFeed = () => {
  const [socialPosts] = useState([
    {
      id: 1,
      user: 'Sarah Mitchell',
      avatar: 'S',
      time: '2h ago',
      content: 'Just completed my first 5K run in under 30 minutes! 🏃‍♀️ The training program really works!',
      likes: 24,
      comments: 8,
      achievement: '5K Champion'
    },
    {
      id: 2,
      user: 'Mike Thompson',
      avatar: 'M',
      time: '4h ago',
      content: 'Hit my water intake goal for 30 days straight! 💧 Feeling more energized than ever.',
      likes: 18,
      comments: 5,
      achievement: 'Hydration Master'
    },
    {
      id: 3,
      user: 'Emma Rodriguez',
      avatar: 'E',
      time: '6h ago',
      content: 'New personal record on bench press - 120lbs! 💪 Consistency pays off.',
      likes: 31,
      comments: 12,
      achievement: 'Strength Warrior'
    },
    {
      id: 4,
      user: 'David Chen',
      avatar: 'D',
      time: '8h ago',
      content: 'Completed a week of meditation sessions. Mental health is just as important as physical! 🧘‍♂️',
      likes: 15,
      comments: 7,
      achievement: 'Mindfulness Guru'
    }
  ]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom display="flex" alignItems="center">
          <Group sx={{ mr: 1, color: 'primary.main' }} />
          Community Feed
        </Typography>
        {socialPosts.map((post) => (
          <Box key={post.id} sx={{ 
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: 2,
            p: 2,
            mb: 2,
            bgcolor: 'background.paper'
          }}>
            <Box display="flex" alignItems="center" mb={1}>
              <Avatar sx={{ width: 40, height: 40, mr: 2, bgcolor: 'primary.main' }}>
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
            <Typography variant="body2" paragraph sx={{ ml: 7 }}>
              {post.content}
            </Typography>
            <Box display="flex" alignItems="center" gap={2} sx={{ ml: 7 }}>
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
        ))}
      </CardContent>
    </Card>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('');

  // Enhanced health data
  const [healthData] = useState({
    steps: { value: 8547, target: 10000, unit: 'steps' },
    heartRate: { value: 72, unit: 'bpm', status: 'normal' },
    bloodPressure: { systolic: 118, diastolic: 78, unit: 'mmHg', status: 'optimal' },
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
    <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          🌟 Welcome Back, {user?.name}!
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Here's your comprehensive health overview for today
        </Typography>
      </Box>

      {/* Tabs for different sections */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={handleTabChange} centered>
          <Tab label="Health Dashboard" />
          <Tab label="Activities" />
          <Tab label="Nutrition" />
          <Tab label="Community" />
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
                  value={healthData.steps.value}
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

      {/* Activities Tab */}
      <TabPanel value={selectedTab} index={1}>
        <ActivityTracker />
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

      {/* Enhanced Detail Dialog */}
      <DetailDialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        metric={selectedMetric}
        data={healthData}
      />
    </Container>
  );
};

// Enhanced Login Component
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