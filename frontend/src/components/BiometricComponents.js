// Biometric Integration Components
import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Grid, Alert, CircularProgress,
  List, ListItem, ListItemText, ListItemIcon, Switch, FormControlLabel,
  Dialog, DialogTitle, DialogContent, DialogActions, Stepper, Step, StepLabel,
  Avatar, Chip, LinearProgress, Timeline, TimelineItem, TimelineSeparator,
  TimelineConnector, TimelineContent, TimelineDot, Paper, IconButton
} from '@mui/material';

import {
  Bluetooth, Watch, Smartphone, Favorite, DirectionsRun, Sleep,
  TrendingUp, Assessment, Settings, Sync, CheckCircle, Warning,
  Error as ErrorIcon, Info, MonitorHeart, Thermostat, Opacity,
  Psychology, Air, Speed, FitnessCenter
} from '@mui/icons-material';

// Biometric Device Manager
export const BiometricDeviceManager = () => {
  const [connectedDevices, setConnectedDevices] = useState([
    { id: 1, name: 'Apple Watch Series 9', type: 'smartwatch', connected: true, battery: 78, lastSync: '2 min ago' },
    { id: 2, name: 'Fitbit Charge 5', type: 'fitness_tracker', connected: false, battery: null, lastSync: '2 hours ago' },
    { id: 3, name: 'Oura Ring Gen3', type: 'smart_ring', connected: true, battery: 92, lastSync: '5 min ago' }
  ]);

  const [availableDevices, setAvailableDevices] = useState([
    { id: 4, name: 'Samsung Galaxy Watch', type: 'smartwatch', distance: '2.3m' },
    { id: 5, name: 'Garmin Forerunner', type: 'gps_watch', distance: '5.1m' }
  ]);

  const [scanning, setScanning] = useState(false);

  const handleDeviceConnect = (deviceId) => {
    setScanning(true);
    setTimeout(() => {
      const device = availableDevices.find(d => d.id === deviceId);
      if (device) {
        setConnectedDevices(prev => [...prev, { ...device, connected: true, battery: 85, lastSync: 'Just now' }]);
        setAvailableDevices(prev => prev.filter(d => d.id !== deviceId));
      }
      setScanning(false);
    }, 2000);
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'smartwatch': return <Watch />;
      case 'fitness_tracker': return <FitnessCenter />;
      case 'smart_ring': return <MonitorHeart />;
      case 'gps_watch': return <Speed />;
      default: return <Bluetooth />;
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Connected Devices
            </Typography>
            {connectedDevices.map((device) => (
              <Box key={device.id} sx={{ display: 'flex', alignItems: 'center', p: 2, mb: 1, bgcolor: 'success.light', borderRadius: 2, color: 'success.contrastText' }}>
                <Avatar sx={{ mr: 2, bgcolor: 'success.main' }}>
                  {getDeviceIcon(device.type)}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" fontWeight="bold">{device.name}</Typography>
                  <Typography variant="caption">
                    Battery: {device.battery}% • Last sync: {device.lastSync}
                  </Typography>
                </Box>
                <Chip 
                  icon={<CheckCircle />} 
                  label="Connected" 
                  color="success" 
                  size="small" 
                  variant="filled"
                />
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Available Devices</Typography>
              <Button 
                variant="contained" 
                startIcon={scanning ? <CircularProgress size={16} /> : <Bluetooth />}
                onClick={() => setScanning(true)}
                disabled={scanning}
              >
                {scanning ? 'Scanning...' : 'Scan'}
              </Button>
            </Box>
            {availableDevices.map((device) => (
              <Box key={device.id} sx={{ display: 'flex', alignItems: 'center', p: 2, mb: 1, bgcolor: 'grey.100', borderRadius: 2 }}>
                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                  {getDeviceIcon(device.type)}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body1">{device.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Distance: {device.distance}
                  </Typography>
                </Box>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => handleDeviceConnect(device.id)}
                  disabled={scanning}
                >
                  Connect
                </Button>
              </Box>
            ))}
            {availableDevices.length === 0 && (
              <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                No devices found. Make sure your devices are in pairing mode.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// Real-time Health Monitoring
export const HealthMonitoring = () => {
  const [realTimeData, setRealTimeData] = useState({
    heartRate: 68,
    bloodPressure: { systolic: 120, diastolic: 80 },
    oxygenSaturation: 98,
    bodyTemperature: 98.6,
    stressLevel: 3.2,
    respiratoryRate: 16,
    hrvScore: 42,
    skinConductance: 2.1
  });

  const [monitoring, setMonitoring] = useState(false);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    let interval;
    if (monitoring) {
      interval = setInterval(() => {
        setRealTimeData(prev => ({
          ...prev,
          heartRate: prev.heartRate + Math.floor(Math.random() * 6) - 3,
          oxygenSaturation: Math.max(95, Math.min(100, prev.oxygenSaturation + Math.random() * 2 - 1)),
          stressLevel: Math.max(1, Math.min(10, prev.stressLevel + Math.random() * 0.4 - 0.2))
        }));
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [monitoring]);

  const metrics = [
    { label: 'Heart Rate', value: `${realTimeData.heartRate} BPM`, icon: <Favorite />, status: 'normal', color: 'error' },
    { label: 'Blood Pressure', value: `${realTimeData.bloodPressure.systolic}/${realTimeData.bloodPressure.diastolic}`, icon: <MonitorHeart />, status: 'normal', color: 'info' },
    { label: 'Oxygen Level', value: `${realTimeData.oxygenSaturation}%`, icon: <Air />, status: 'normal', color: 'primary' },
    { label: 'Body Temp', value: `${realTimeData.bodyTemperature}°F`, icon: <Thermostat />, status: 'normal', color: 'warning' },
    { label: 'Stress Level', value: `${realTimeData.stressLevel.toFixed(1)}/10`, icon: <Psychology />, status: 'low', color: 'success' },
    { label: 'Respiratory Rate', value: `${realTimeData.respiratoryRate} /min`, icon: <Air />, status: 'normal', color: 'info' }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Real-time Health Monitoring</Typography>
        <FormControlLabel
          control={<Switch checked={monitoring} onChange={(e) => setMonitoring(e.target.checked)} />}
          label="Live Monitoring"
        />
      </Box>

      <Grid container spacing={2}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: `${metric.color}.main`, mr: 2 }}>
                    {metric.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {metric.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {metric.label}
                    </Typography>
                  </Box>
                </Box>
                <Chip 
                  label={metric.status.toUpperCase()} 
                  color={metric.status === 'normal' ? 'success' : metric.status === 'low' ? 'info' : 'warning'}
                  size="small"
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {monitoring && (
        <Alert severity="info" sx={{ mt: 3 }}>
          Live monitoring is active. Data is being collected from your connected devices.
        </Alert>
      )}
    </Box>
  );
};

// Health Insights & AI Analysis
export const HealthInsights = () => {
  const insights = [
    {
      id: 1,
      type: 'recommendation',
      title: 'Optimal Workout Time Detected',
      description: 'Based on your heart rate variability, your body is most ready for intense workouts between 10 AM - 12 PM.',
      confidence: 92,
      action: 'Schedule Workout',
      icon: <FitnessCenter />
    },
    {
      id: 2,
      type: 'warning',
      title: 'Sleep Quality Declining',
      description: 'Your deep sleep has decreased by 15% over the past week. Consider adjusting your bedtime routine.',
      confidence: 87,
      action: 'View Sleep Tips',
      icon: <Sleep />
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Stress Management Improving',
      description: 'Your average stress levels have improved by 23% since starting meditation practice.',
      confidence: 95,
      action: 'Continue Program',
      icon: <Psychology />
    }
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>AI Health Insights</Typography>
      
      <Grid container spacing={3}>
        {insights.map((insight) => (
          <Grid item xs={12} key={insight.id}>
            <Card sx={{ borderLeft: 4, borderLeftColor: insight.type === 'warning' ? 'warning.main' : insight.type === 'achievement' ? 'success.main' : 'info.main' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar sx={{ 
                    bgcolor: insight.type === 'warning' ? 'warning.main' : insight.type === 'achievement' ? 'success.main' : 'info.main',
                    mr: 2 
                  }}>
                    {insight.icon}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>{insight.title}</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      {insight.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ mr: 1 }}>Confidence:</Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={insight.confidence} 
                          sx={{ width: 100, mr: 1 }}
                        />
                        <Typography variant="caption">{insight.confidence}%</Typography>
                      </Box>
                      <Button variant="outlined" size="small">
                        {insight.action}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};