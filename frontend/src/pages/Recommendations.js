import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  Grid,
} from '@mui/material';
import toast from 'react-hot-toast';

import recommendationService from '../services/recommendationService';

const Recommendations = () => {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [docs, setDocs] = useState([]);

  const latestByKind = useMemo(() => {
    const byKind = { workout: null, meal: null, mindfulness: null };
    const arr = Array.isArray(docs) ? docs : [];
    for (const d of arr) {
      const k = d?.kind;
      if (!k) continue;
      if (!byKind[k]) byKind[k] = d;
    }
    return byKind;
  }, [docs]);

  const loadLatest = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await recommendationService.getLatest();
      setDocs(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to load recommendations';
      setError(msg);
      setDocs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLatest();
  }, [loadLatest]);

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      setError(null);
      await recommendationService.generate();
      toast.success('New recommendations generated');
      await loadLatest();
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to generate recommendations';
      setError(msg);
      toast.error(msg);
    } finally {
      setGenerating(false);
    }
  };

  const renderDoc = (doc) => {
    if (!doc) return <Typography variant="body2" color="text.secondary">No data.</Typography>;
    const content = doc.content || {};

    if (doc.kind === 'workout') {
      return (
        <>
          {Array.isArray(content.plan) && content.plan.length > 0 && (
            <List dense>
              {content.plan.map((p, idx) => (
                <ListItem key={idx}>
                  <ListItemText primary={`${p.day || ''}: ${p.activity || ''}`.trim()} />
                </ListItem>
              ))}
            </List>
          )}
          {Array.isArray(content.tips) && content.tips.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              Tips: {content.tips.join(', ')}
            </Typography>
          )}
        </>
      );
    }

    if (doc.kind === 'meal') {
      return (
        <>
          {content.dietaryPreference && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Preference: {content.dietaryPreference}
            </Typography>
          )}
          {Array.isArray(content.suggestions) && content.suggestions.length > 0 ? (
            <List dense>
              {content.suggestions.map((s, idx) => (
                <ListItem key={idx}>
                  <ListItemText primary={s.meal || `Meal ${idx + 1}`} secondary={s.idea || ''} />
                </ListItem>
              ))}
            </List>
          ) : null}
        </>
      );
    }

    if (doc.kind === 'mindfulness') {
      return (
        <>
          {Array.isArray(content.exercises) && content.exercises.length > 0 ? (
            <List dense>
              {content.exercises.map((x, idx) => (
                <ListItem key={idx}>
                  <ListItemText primary={x.name || `Exercise ${idx + 1}`} secondary={x.minutes ? `${x.minutes} min` : ''} />
                </ListItem>
              ))}
            </List>
          ) : null}
        </>
      );
    }

    return <Typography variant="body2">{doc.title || 'Recommendation'}</Typography>;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        AI Recommendations
      </Typography>

      <Paper sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Button variant="contained" onClick={handleGenerate} disabled={generating}>
            {generating ? <CircularProgress size={22} color="inherit" /> : 'Generate New'}
          </Button>
          <Button variant="outlined" onClick={loadLatest} disabled={loading || generating}>
            Refresh
          </Button>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : docs.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No recommendations yet. Click “Generate New”.
          </Typography>
        ) : (
          <>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
              Latest generated: {docs[0]?.createdAt ? new Date(docs[0].createdAt).toLocaleString() : '—'}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Workout
                  </Typography>
                  {renderDoc(latestByKind.workout)}
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Meal
                  </Typography>
                  {renderDoc(latestByKind.meal)}
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Mindfulness
                  </Typography>
                  {renderDoc(latestByKind.mindfulness)}
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Recommendations;