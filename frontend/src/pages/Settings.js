import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import profileService from '../services/profileService';

const normalizeReminderSettings = (data) => {
  const s = data || {};
  const section = (x) => ({ enabled: !!x?.enabled, time: x?.time || '' });
  return {
    water: section(s.water),
    workout: section(s.workout),
    sleep: section(s.sleep),
    meal: section(s.meal),
    timezone: s.timezone || 'UTC',
  };
};

const Settings = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState(() => normalizeReminderSettings(null));

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await profileService.getReminderSettings();
        if (!mounted) return;
        setSettings(normalizeReminderSettings(res.data));
      } catch (e) {
        const msg = e?.response?.data?.message || 'Failed to load settings';
        if (mounted) setError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, []);

  const setSectionField = (section, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...(prev[section] || {}), [field]: value },
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      const payload = {
        water: settings.water,
        workout: settings.workout,
        sleep: settings.sleep,
        meal: settings.meal,
        timezone: settings.timezone,
      };
      const res = await profileService.updateReminderSettings(payload);
      setSettings(normalizeReminderSettings(res.data));
      toast.success('Settings saved');
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to save settings';
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Paper sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              Reminder Settings
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!settings.water.enabled}
                      onChange={(e) => setSectionField('water', 'enabled', e.target.checked)}
                    />
                  }
                  label="Water reminders"
                />
                <TextField
                  fullWidth
                  label="Water reminder time"
                  type="time"
                  value={settings.water.time}
                  onChange={(e) => setSectionField('water', 'time', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  disabled={!settings.water.enabled}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!settings.workout.enabled}
                      onChange={(e) => setSectionField('workout', 'enabled', e.target.checked)}
                    />
                  }
                  label="Workout reminders"
                />
                <TextField
                  fullWidth
                  label="Workout reminder time"
                  type="time"
                  value={settings.workout.time}
                  onChange={(e) => setSectionField('workout', 'time', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  disabled={!settings.workout.enabled}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!settings.sleep.enabled}
                      onChange={(e) => setSectionField('sleep', 'enabled', e.target.checked)}
                    />
                  }
                  label="Sleep reminders"
                />
                <TextField
                  fullWidth
                  label="Sleep reminder time"
                  type="time"
                  value={settings.sleep.time}
                  onChange={(e) => setSectionField('sleep', 'time', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  disabled={!settings.sleep.enabled}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!settings.meal.enabled}
                      onChange={(e) => setSectionField('meal', 'enabled', e.target.checked)}
                    />
                  }
                  label="Meal reminders"
                />
                <TextField
                  fullWidth
                  label="Meal reminder time"
                  type="time"
                  value={settings.meal.time}
                  onChange={(e) => setSectionField('meal', 'time', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  disabled={!settings.meal.enabled}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Timezone"
                  value={settings.timezone}
                  onChange={(e) => setSettings((p) => ({ ...p, timezone: e.target.value }))}
                  helperText="Example: UTC"
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
              <Button variant="contained" onClick={handleSave} disabled={saving}>
                {saving ? <CircularProgress size={22} color="inherit" /> : 'Save'}
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Account
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button color="error" variant="outlined" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Settings;