import React, { useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  Button,
} from '@mui/material';
import {
  MonitorHeart,
  TrendingUp,
  Psychology,
  EmojiEvents,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useHealthData } from '../context/HealthDataContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const { summary, loading, fetchBiometricSummary } = useHealthData();

  const displayName = user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.name || 'User';

  useEffect(() => {
    fetchBiometricSummary();
  }, [fetchBiometricSummary]);

  if (loading) {
    return <LoadingSpinner message="Loading your dashboard..." />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.firstName || displayName}! 👋
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Here's your health overview for today
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* User Stats Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  {user?.firstName?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6">{displayName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Level {user?.level || 1}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label={`${user?.points || 0} points`} 
                  size="small" 
                  color="primary" 
                />
                <Chip 
                  label={`BMI: ${user?.bmi || 'N/A'}`} 
                  size="small" 
                  variant="outlined" 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <MonitorHeart color="primary" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h6">
                    {summary?.latest?.heart_rate?.value || '--'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Heart Rate (bpm)
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <TrendingUp color="success" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h6">
                    {summary?.latest?.weight?.value || '--'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Weight ({summary?.latest?.weight?.unit || 'kg'})
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Psychology color="secondary" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h6">
                    {summary?.latest?.sleep_duration?.value || '--'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Sleep (hours)
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <EmojiEvents color="warning" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h6">
                    {user?.streaks?.currentWorkoutStreak || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Workout Streak
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Today: {summary?.today?.totalEntries || 0} data entries logged
              </Typography>
              <Box sx={{ mt: 2 }}>
                {summary?.today?.types?.map((type) => (
                  <Chip 
                    key={type} 
                    label={type.replace('_', ' ')} 
                    size="small" 
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
              <Button 
                variant="outlined" 
                size="small" 
                sx={{ mt: 2 }}
                href="/biometric-data"
              >
                View All Data
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Recommendations */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Today's Recommendations
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Personalized suggestions based on your data
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2">
                  🏃‍♂️ 30-minute cardio workout
                </Typography>
                <Typography variant="body2">
                  🥗 High-protein lunch
                </Typography>
                <Typography variant="body2">
                  💧 Drink 2 more glasses of water
                </Typography>
              </Box>
              <Button 
                variant="outlined" 
                size="small" 
                sx={{ mt: 2 }}
                href="/recommendations"
              >
                View All Recommendations
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Goals Progress */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Health Goals
              </Typography>
              <Grid container spacing={2}>
                {user?.healthGoals?.slice(0, 4).map((goal) => (
                  <Grid item xs={12} sm={6} md={3} key={goal}>
                    <Box sx={{ 
                      p: 2, 
                      border: '1px solid', 
                      borderColor: 'divider', 
                      borderRadius: 1,
                      textAlign: 'center'
                    }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {goal.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        In Progress
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Button 
                variant="outlined" 
                size="small" 
                sx={{ mt: 2 }}
                href="/goals"
              >
                Manage Goals
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;