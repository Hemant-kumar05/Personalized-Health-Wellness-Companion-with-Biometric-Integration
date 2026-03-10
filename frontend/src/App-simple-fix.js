import React, { useState } from 'react';
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
  CircularProgress
} from '@mui/material';

// Simple Auth Context
const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    // Simulate login
    setTimeout(() => {
      setUser({ id: 1, email, name: email.split('@')[0] });
      setLoading(false);
    }, 1000);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Theme
const theme = createTheme({
  palette: {
    primary: { main: '#2E7D32' },
    secondary: { main: '#FF6B35' },
    background: { default: '#F5F7FA' },
  },
});

// Login Component
const Login = () => {
  const { login, loading, user } = useAuth();
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password');

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Health & Wellness Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

// Dashboard Component
const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Health & Wellness Dashboard
          </Typography>
          <Typography sx={{ mr: 2 }}>
            Welcome, {user?.name}
          </Typography>
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Health Overview
            </Typography>
            <Typography variant="h4" color="secondary">8,547</Typography>
            <Typography variant="body2">Steps Today</Typography>
            <Typography variant="h4" color="error">72 bpm</Typography>
            <Typography variant="body2">Heart Rate</Typography>
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Today's Activities
            </Typography>
            <Typography>• Morning Walk - 150 cal</Typography>
            <Typography>• Workout - 320 cal</Typography>
            <Typography>• Meditation - 10 cal</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Total: 480 calories</Typography>
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Recommendations
            </Typography>
            <Typography>🚰 Drink 2 more glasses of water</Typography>
            <Typography>🏃 Add 10 minutes of stretching</Typography>
            <Typography>😴 Sleep 30 minutes earlier tonight</Typography>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Main App
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;