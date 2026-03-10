import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { HealthDataProvider } from './context/HealthDataContext';

// Components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import BiometricData from './pages/BiometricData';
import Recommendations from './pages/Recommendations';
import Community from './pages/Community';
import Goals from './pages/Goals';
import Settings from './pages/Settings';

// Theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Green for health/wellness
      light: '#4CAF50',
      dark: '#1B5E20',
    },
    secondary: {
      main: '#FF6B35', // Orange for energy/activity
      light: '#FF8A65',
      dark: '#E64A19',
    },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2D3748',
      secondary: '#4A5568',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          paddingX: 24,
          paddingY: 12,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          borderRadius: 12,
        },
      },
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Main App Layout
const AppLayout = ({ children }) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  if (!user) {
    return children;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8, // Account for navbar height
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppLayout>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HealthDataProvider>
                      <Dashboard />
                    </HealthDataProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <HealthDataProvider>
                      <Dashboard />
                    </HealthDataProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/biometric-data"
                element={
                  <ProtectedRoute>
                    <HealthDataProvider>
                      <BiometricData />
                    </HealthDataProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recommendations"
                element={
                  <ProtectedRoute>
                    <HealthDataProvider>
                      <Recommendations />
                    </HealthDataProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/goals"
                element={
                  <ProtectedRoute>
                    <Goals />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/community"
                element={
                  <ProtectedRoute>
                    <Community />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppLayout>
        </Router>
      </AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '8px',
          },
        }}
      />
    </ThemeProvider>
  );
}

export default App;