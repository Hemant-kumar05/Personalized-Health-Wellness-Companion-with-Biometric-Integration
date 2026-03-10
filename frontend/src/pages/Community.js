import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CommentIcon from '@mui/icons-material/Comment';
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';
import communityService from '../services/communityService';

const Community = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);

  const [createForm, setCreateForm] = useState({ title: '', body: '', tags: '' });
  const [expandedId, setExpandedId] = useState(null);
  const [details, setDetails] = useState({});
  const [commentDrafts, setCommentDrafts] = useState({});

  const myId = user?._id || user?.id;
  const isAdmin = user?.role === 'admin';

  const normalizedPosts = useMemo(() => (Array.isArray(posts) ? posts : []), [posts]);

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await communityService.listPosts();
      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to load posts';
      setError(msg);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const onCreateChange = (field) => (e) => setCreateForm((p) => ({ ...p, [field]: e.target.value }));

  const handleCreate = async () => {
    const title = String(createForm.title || '').trim();
    const body = String(createForm.body || '').trim();
    if (!title) return toast.error('Title is required');
    if (!body) return toast.error('Body is required');

    const tags = String(createForm.tags || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 10);

    try {
      setSubmitting(true);
      setError(null);
      await communityService.createPost({ title, body, tags });
      toast.success('Post created');
      setCreateForm({ title: '', body: '', tags: '' });
      await loadPosts();
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to create post';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const loadDetails = async (id) => {
    try {
      setDetails((prev) => ({ ...prev, [id]: { ...(prev[id] || {}), loading: true, error: null } }));
      const res = await communityService.getPost(id);
      setDetails((prev) => ({
        ...prev,
        [id]: { loading: false, error: null, post: res.data?.post, comments: res.data?.comments || [] },
      }));
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to load comments';
      setDetails((prev) => ({ ...prev, [id]: { ...(prev[id] || {}), loading: false, error: msg } }));
    }
  };

  const toggleExpand = async (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    if (!details[id]?.post && !details[id]?.loading) {
      await loadDetails(id);
    }
  };

  const handleDelete = async (id) => {
    try {
      await communityService.deletePost(id);
      toast.success('Post removed');
      setPosts((prev) => prev.filter((p) => p._id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to remove post';
      toast.error(msg);
    }
  };

  const handleAddComment = async (postId) => {
    const body = String(commentDrafts[postId] || '').trim();
    if (!body) return toast.error('Comment is required');
    try {
      await communityService.addComment(postId, body);
      toast.success('Comment added');
      setCommentDrafts((prev) => ({ ...prev, [postId]: '' }));
      await loadDetails(postId);
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to add comment';
      toast.error(msg);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Community
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="h6" gutterBottom>
          Create Post
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Title" value={createForm.title} onChange={onCreateChange('title')} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tags (comma separated)"
              value={createForm.tags}
              onChange={onCreateChange('tags')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Body"
              value={createForm.body}
              onChange={onCreateChange('body')}
              multiline
              minRows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" onClick={handleCreate} disabled={submitting}>
                {submitting ? <CircularProgress size={22} color="inherit" /> : 'Post'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">Latest Posts</Typography>
          <Button variant="outlined" onClick={loadPosts} disabled={loading}>
            Refresh
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : normalizedPosts.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No posts yet. Be the first to post.
          </Typography>
        ) : (
          <List>
            {normalizedPosts.map((post) => {
              const authorName = post.author?.fullName || 'Unknown';
              const authorRole = post.author?.role ? String(post.author.role) : '';
              const isOwner = myId && (String(post.author?._id || post.author?.id) === String(myId));
              const canDelete = isOwner || isAdmin;
              const isExpanded = expandedId === post._id;
              const d = details[post._id];

              return (
                <Box key={post._id} sx={{ mb: 2 }}>
                  <ListItem
                    alignItems="flex-start"
                    secondaryAction={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <IconButton aria-label="comments" onClick={() => toggleExpand(post._id)}>
                          <CommentIcon />
                        </IconButton>
                        {canDelete && (
                          <IconButton aria-label="delete" onClick={() => handleDelete(post._id)}>
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={post.title}
                      secondary={
                        <>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {authorName}{authorRole ? ` (${authorRole})` : ''} •{' '}
                            {post.createdAt ? new Date(post.createdAt).toLocaleString() : '—'}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {post.body}
                          </Typography>
                          {Array.isArray(post.tags) && post.tags.length > 0 && (
                            <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              {post.tags.slice(0, 8).map((t) => (
                                <Chip key={t} size="small" label={t} />
                              ))}
                            </Box>
                          )}
                        </>
                      }
                    />
                  </ListItem>

                  {isExpanded && (
                    <Box sx={{ pl: 2, pr: 2, pb: 2 }}>
                      <Divider sx={{ mb: 2 }} />
                      {d?.error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                          {d.error}
                        </Alert>
                      )}
                      {d?.loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                          <CircularProgress size={22} />
                        </Box>
                      ) : (
                        <>
                          <Typography variant="subtitle2" gutterBottom>
                            Comments
                          </Typography>
                          {Array.isArray(d?.comments) && d.comments.length > 0 ? (
                            <List dense>
                              {d.comments.map((c) => (
                                <ListItem key={c._id} alignItems="flex-start">
                                  <ListItemText
                                    primary={c.author?.fullName || 'Unknown'}
                                    secondary={
                                      <>
                                        <Typography variant="body2">{c.body}</Typography>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                          {c.createdAt ? new Date(c.createdAt).toLocaleString() : '—'}
                                        </Typography>
                                      </>
                                    }
                                  />
                                </ListItem>
                              ))}
                            </List>
                          ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              No comments yet.
                            </Typography>
                          )}

                          <Grid container spacing={1} alignItems="center">
                            <Grid item xs={12} md={10}>
                              <TextField
                                fullWidth
                                label="Add a comment"
                                value={commentDrafts[post._id] || ''}
                                onChange={(e) => setCommentDrafts((p) => ({ ...p, [post._id]: e.target.value }))}
                              />
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <Button fullWidth variant="contained" onClick={() => handleAddComment(post._id)}>
                                Send
                              </Button>
                            </Grid>
                          </Grid>
                        </>
                      )}
                    </Box>
                  )}

                  <Divider />
                </Box>
              );
            })}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default Community;