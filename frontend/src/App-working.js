import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Typography, Box } from '@mui/material';

// Theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32',
    },
    secondary: {
      main: '#FF6B35',
    },
  },
});

// Simple Home component
const Home = () => (
  <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Health & Wellness Companion
      </Typography>
      <Typography variant="h6" color="text.secondary">
        Your personalized health journey starts here
      </Typography>
    </Box>
  </Container>
);

// Simple Login component
const Login = () => (
  <Container maxWidth="sm" sx={{ mt: 8 }}>
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      <Typography variant="body1">
        Login functionality will be implemented here.
      </Typography>
    </Box>
  </Container>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;