import React, { useEffect, useMemo, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';
import profileService from '../services/profileService';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const displayName = useMemo(
    () => user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.name || 'User',
    [user]
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    fullName: displayName,
    age: '',
    gender: '',
    heightCm: '',
    weightKg: '',
    activityLevel: 'moderate',
    dietaryPreference: 'none',
  });

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await profileService.getMyProfile();
        if (!mounted) return;

        const profile = res.data;
        setForm((prev) => ({
          ...prev,
          fullName: displayName,
          age: profile.age ?? '',
          gender: profile.gender ?? '',
          heightCm: profile.heightCm ?? '',
          weightKg: profile.weightKg ?? '',
          activityLevel: profile.activityLevel ?? 'moderate',
          dietaryPreference: profile.dietaryPreference ?? 'none',
        }));
      } catch (e) {
        const msg = e?.response?.data?.message || 'Failed to load profile';
        if (mounted) setError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [displayName]);

  const onChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const payload = {
        fullName: String(form.fullName || '').trim(),
        age: form.age === '' ? undefined : Number(form.age),
        gender: form.gender || undefined,
        heightCm: form.heightCm === '' ? undefined : Number(form.heightCm),
        weightKg: form.weightKg === '' ? undefined : Number(form.weightKg),
        activityLevel: form.activityLevel || undefined,
        dietaryPreference: form.dietaryPreference || undefined,
      };

      const res = await profileService.updateMyProfile(payload);
      toast.success('Profile saved');
      if (payload.fullName) {
        updateUser({ fullName: payload.fullName });
      }

      // Keep form in sync with server
      const profile = res.data;
      setForm((prev) => ({
        ...prev,
        age: profile.age ?? '',
        gender: profile.gender ?? '',
        heightCm: profile.heightCm ?? '',
        weightKg: profile.weightKg ?? '',
        activityLevel: profile.activityLevel ?? prev.activityLevel,
        dietaryPreference: profile.dietaryPreference ?? prev.dietaryPreference,
      }));
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to save profile';
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Profile Management
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
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={form.fullName}
                onChange={onChange('fullName')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Email" value={user?.email || ''} disabled />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Age"
                type="number"
                value={form.age}
                onChange={onChange('age')}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select value={form.gender} label="Gender" onChange={onChange('gender')}>
                  <MenuItem value="">Not set</MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                  <MenuItem value="prefer_not_to_say">Prefer not to say</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Activity Level</InputLabel>
                <Select value={form.activityLevel} label="Activity Level" onChange={onChange('activityLevel')}>
                  <MenuItem value="sedentary">Sedentary</MenuItem>
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="moderate">Moderate</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="very_active">Very Active</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Height (cm)"
                type="number"
                value={form.heightCm}
                onChange={onChange('heightCm')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Weight (kg)"
                type="number"
                value={form.weightKg}
                onChange={onChange('weightKg')}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Dietary Preference</InputLabel>
                <Select value={form.dietaryPreference} label="Dietary Preference" onChange={onChange('dietaryPreference')}>
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="vegetarian">Vegetarian</MenuItem>
                  <MenuItem value="vegan">Vegan</MenuItem>
                  <MenuItem value="pescatarian">Pescatarian</MenuItem>
                  <MenuItem value="keto">Keto</MenuItem>
                  <MenuItem value="paleo">Paleo</MenuItem>
                  <MenuItem value="halal">Halal</MenuItem>
                  <MenuItem value="kosher">Kosher</MenuItem>
                  <MenuItem value="gluten_free">Gluten free</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button variant="contained" onClick={handleSave} disabled={saving}>
                  {saving ? <CircularProgress size={22} color="inherit" /> : 'Save'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default Profile;