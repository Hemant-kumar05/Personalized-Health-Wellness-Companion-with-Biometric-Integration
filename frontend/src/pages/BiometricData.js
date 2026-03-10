import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import toast from 'react-hot-toast';

import biometricService from '../services/biometricService';

const TYPE_FIELDS = {
  heart_rate: { label: 'Heart rate (bpm)', unit: 'bpm', min: 30, max: 250 },
  weight: { label: 'Weight (kg)', unit: 'kg', min: 20, max: 400 },
  blood_pressure: { label: 'Blood pressure (e.g. 120/80)', unit: '', pattern: /^\d{2,3}\/\d{2,3}$/ },
  sleep_hours: { label: 'Sleep (hours)', unit: 'h', min: 0, max: 24 },
  steps: { label: 'Steps', unit: '', min: 0, max: 200000 },
  calories: { label: 'Calories', unit: 'kcal', min: 0, max: 20000 },
  glucose: { label: 'Glucose (mg/dL)', unit: 'mg/dL', min: 40, max: 600 },
};

const BiometricData = () => {
  const [type, setType] = useState('heart_rate');
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [dateTime, setDateTime] = useState(() => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);

  const fieldMeta = useMemo(() => TYPE_FIELDS[type] || { label: 'Value' }, [type]);

  const load = useCallback(async (t) => {
    try {
      setLoading(true);
      setError(null);
      const res = await biometricService.getBiometricData(t);
      const data = Array.isArray(res?.data) ? res.data : res?.data?.biometricData || [];
      setItems(data);
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to load biometric data';
      setError(msg);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(type);
  }, [type, load]);

  const validateValue = () => {
    const raw = String(value || '').trim();
    if (!raw) return 'Value is required';
    if (type === 'blood_pressure') {
      if (!TYPE_FIELDS.blood_pressure.pattern.test(raw)) return 'Use format like 120/80';
      return null;
    }
    const n = Number(raw);
    if (Number.isNaN(n)) return 'Value must be a number';
    if (fieldMeta.min != null && n < fieldMeta.min) return `Value must be ≥ ${fieldMeta.min}`;
    if (fieldMeta.max != null && n > fieldMeta.max) return `Value must be ≤ ${fieldMeta.max}`;
    return null;
  };

  const handleSubmit = async () => {
    const validation = validateValue();
    if (validation) return toast.error(validation);

    try {
      setSubmitting(true);
      setError(null);

      const raw = String(value || '').trim();
      await biometricService.logBiometricData({
        type,
        value: type === 'blood_pressure' ? raw : Number(raw),
        unit: fieldMeta.unit || undefined,
        notes: notes ? String(notes).trim() : undefined,
        recordedAt: dateTime ? new Date(dateTime).toISOString() : undefined,
      });

      toast.success('Entry added');
      setValue('');
      setNotes('');
      await load(type);
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to add entry';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await biometricService.deleteBiometricData(id);
      toast.success('Entry deleted');
      setItems((prev) => prev.filter((x) => x._id !== id));
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to delete entry';
      toast.error(msg);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Biometric Data
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select value={type} label="Type" onChange={(e) => setType(e.target.value)}>
                <MenuItem value="heart_rate">Heart Rate</MenuItem>
                <MenuItem value="weight">Weight</MenuItem>
                <MenuItem value="blood_pressure">Blood Pressure</MenuItem>
                <MenuItem value="sleep_hours">Sleep</MenuItem>
                <MenuItem value="steps">Steps</MenuItem>
                <MenuItem value="calories">Calories</MenuItem>
                <MenuItem value="glucose">Glucose</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label={fieldMeta.label}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={type === 'blood_pressure' ? '120/80' : ''}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Recorded At"
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField fullWidth label="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
                {submitting ? <CircularProgress size={22} color="inherit" /> : 'Add Entry'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Entries
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : items.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No entries yet for this type.
          </Typography>
        ) : (
          <List dense>
            {items.map((item) => (
              <ListItem
                key={item._id}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(item._id)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={`${item.value}${item.unit ? ` ${item.unit}` : ''}`}
                  secondary={`${new Date(item.recordedAt || item.createdAt).toLocaleString()}${item.notes ? ` — ${item.notes}` : ''}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default BiometricData;