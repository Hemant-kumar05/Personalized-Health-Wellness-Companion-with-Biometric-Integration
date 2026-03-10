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
  Switch,
  FormControlLabel,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import toast from 'react-hot-toast';

import goalService from '../services/goalService';

const Goals = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [goals, setGoals] = useState([]);

  const [createForm, setCreateForm] = useState({
    type: 'steps',
    target: '',
    unit: '',
    endDate: '',
  });

  const [edits, setEdits] = useState({});

  const normalizedGoals = useMemo(() => (Array.isArray(goals) ? goals : []), [goals]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await goalService.listMyGoals();
      setGoals(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to load goals';
      setError(msg);
      setGoals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onCreateChange = (field) => (e) => setCreateForm((p) => ({ ...p, [field]: e.target.value }));

  const handleCreate = async () => {
    const target = Number(createForm.target);
    if (!createForm.type) return toast.error('Type is required');
    if (!createForm.target || Number.isNaN(target) || target <= 0) return toast.error('Target must be a positive number');

    try {
      setSubmitting(true);
      setError(null);
      await goalService.createGoal({
        type: createForm.type,
        target,
        unit: createForm.unit || '',
        endDate: createForm.endDate ? new Date(createForm.endDate).toISOString() : undefined,
      });
      toast.success('Goal created');
      setCreateForm((p) => ({ ...p, target: '', unit: '', endDate: '' }));
      await load();
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to create goal';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const getEdit = (goal) => {
    if (edits[goal._id]) return edits[goal._id];
    const pad = (n) => String(n).padStart(2, '0');
    const toDateInput = (iso) => {
      if (!iso) return '';
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return '';
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    };
    return {
      target: goal.target ?? '',
      unit: goal.unit ?? '',
      endDate: toDateInput(goal.endDate),
      active: goal.active !== false,
    };
  };

  const setEditField = (id, field, value) => {
    setEdits((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: value },
    }));
  };

  const handleSave = async (goal) => {
    const edit = getEdit(goal);
    const target = Number(edit.target);
    if (!edit.target || Number.isNaN(target) || target <= 0) return toast.error('Target must be a positive number');

    try {
      await goalService.updateGoal(goal._id, {
        target,
        unit: edit.unit || '',
        endDate: edit.endDate ? new Date(edit.endDate).toISOString() : null,
        active: !!edit.active,
      });
      toast.success('Goal updated');
      setEdits((prev) => {
        const next = { ...prev };
        delete next[goal._id];
        return next;
      });
      await load();
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to update goal';
      toast.error(msg);
    }
  };

  const handleDelete = async (id) => {
    try {
      await goalService.deleteGoal(id);
      toast.success('Goal deleted');
      setGoals((prev) => prev.filter((g) => g._id !== id));
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to delete goal';
      toast.error(msg);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Health Goals
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="h6" gutterBottom>
          Create Goal
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select value={createForm.type} label="Type" onChange={onCreateChange('type')}>
                <MenuItem value="weight">Weight</MenuItem>
                <MenuItem value="steps">Steps</MenuItem>
                <MenuItem value="sleep">Sleep</MenuItem>
                <MenuItem value="calories">Calories</MenuItem>
                <MenuItem value="workouts">Workouts</MenuItem>
                <MenuItem value="hydration">Hydration</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField fullWidth label="Target" type="number" value={createForm.target} onChange={onCreateChange('target')} />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField fullWidth label="Unit (optional)" value={createForm.unit} onChange={onCreateChange('unit')} />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="End Date (optional)"
              type="date"
              value={createForm.endDate}
              onChange={onCreateChange('endDate')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" onClick={handleCreate} disabled={submitting}>
                {submitting ? <CircularProgress size={22} color="inherit" /> : 'Create'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Your Goals
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : normalizedGoals.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No goals yet. Create one above.
          </Typography>
        ) : (
          <List>
            {normalizedGoals.map((goal) => {
              const edit = getEdit(goal);
              return (
                <ListItem
                  key={goal._id}
                  alignItems="flex-start"
                  secondaryAction={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <IconButton aria-label="save" onClick={() => handleSave(goal)}>
                        <SaveIcon />
                      </IconButton>
                      <IconButton aria-label="delete" onClick={() => handleDelete(goal._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                        <Typography variant="subtitle1" sx={{ minWidth: 110, textTransform: 'capitalize' }}>
                          {goal.type}
                        </Typography>
                        <TextField
                          size="small"
                          label="Target"
                          type="number"
                          value={edit.target}
                          onChange={(e) => setEditField(goal._id, 'target', e.target.value)}
                          sx={{ width: 130 }}
                        />
                        <TextField
                          size="small"
                          label="Unit"
                          value={edit.unit}
                          onChange={(e) => setEditField(goal._id, 'unit', e.target.value)}
                          sx={{ width: 130 }}
                        />
                        <TextField
                          size="small"
                          label="End Date"
                          type="date"
                          value={edit.endDate}
                          onChange={(e) => setEditField(goal._id, 'endDate', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={!!edit.active}
                              onChange={(e) => setEditField(goal._id, 'active', e.target.checked)}
                            />
                          }
                          label={edit.active ? 'Active' : 'Inactive'}
                        />
                      </Box>
                    }
                    secondary={`Created: ${goal.createdAt ? new Date(goal.createdAt).toLocaleString() : '—'}`}
                  />
                </ListItem>
              );
            })}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default Goals;