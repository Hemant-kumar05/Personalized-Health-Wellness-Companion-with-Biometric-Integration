import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Chip,
  OutlinedInput,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const steps = ['Personal Info', 'Physical Attributes', 'Health Goals'];

const activityLevels = [
  { value: 'sedentary', label: 'Sedentary (Little to no exercise)' },
  { value: 'lightly_active', label: 'Lightly Active (Light exercise 1-3 days/week)' },
  { value: 'moderately_active', label: 'Moderately Active (Moderate exercise 3-5 days/week)' },
  { value: 'very_active', label: 'Very Active (Hard exercise 6-7 days/week)' },
  { value: 'extremely_active', label: 'Extremely Active (Very hard exercise, physical job)' },
];

const healthGoalsOptions = [
  'weight_loss',
  'weight_gain',
  'muscle_building',
  'endurance_improvement',
  'strength_building',
  'flexibility_improvement',
  'stress_reduction',
  'better_sleep',
  'general_wellness',
  'disease_prevention',
];

const Register = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Personal Info
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    
    // Physical Attributes
    height: { value: '', unit: 'cm' },
    weight: { value: '', unit: 'kg' },
    activityLevel: '',
    
    // Health Goals
    healthGoals: [],
    dietaryPreferences: [],
    allergies: [],
  });
  
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleHealthGoalsChange = (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      healthGoals: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const validateStep = (step) => {
    const errors = {};
    
    switch (step) {
      case 0: // Personal Info
        if (!formData.email) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email';
        
        if (!formData.password) errors.password = 'Password is required';
        else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
        
        if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm password';
        else if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
        
        if (!formData.firstName) errors.firstName = 'First name is required';
        if (!formData.lastName) errors.lastName = 'Last name is required';
        if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
        if (!formData.gender) errors.gender = 'Gender is required';
        break;
        
      case 1: // Physical Attributes
        if (!formData.height.value) errors['height.value'] = 'Height is required';
        if (!formData.weight.value) errors['weight.value'] = 'Weight is required';
        if (!formData.activityLevel) errors.activityLevel = 'Activity level is required';
        break;
        
      case 2: // Health Goals
        if (formData.healthGoals.length === 0) errors.healthGoals = 'Please select at least one health goal';
        break;
        
      default:
        break;
    }
    
    return errors;
  };

  const handleNext = () => {
    const errors = validateStep(activeStep);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setFormErrors({});
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateStep(activeStep);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const payload = {
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
      };

      const result = await register(payload);
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      // Error is handled in context
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <TextField
              margin="normal"
              required
              fullWidth
              name="firstName"
              label="First Name"
              value={formData.firstName}
              onChange={handleChange}
              error={!!formErrors.firstName}
              helperText={formErrors.firstName}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              error={!!formErrors.lastName}
              helperText={formErrors.lastName}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={!!formErrors.password}
              helperText={formErrors.password}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="dateOfBirth"
              label="Date of Birth"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.dateOfBirth}
              onChange={handleChange}
              error={!!formErrors.dateOfBirth}
              helperText={formErrors.dateOfBirth}
            />
            <FormControl fullWidth margin="normal" required error={!!formErrors.gender}>
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                label="Gender"
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
                <MenuItem value="prefer_not_to_say">Prefer not to say</MenuItem>
              </Select>
              {formErrors.gender && <FormHelperText>{formErrors.gender}</FormHelperText>}
            </FormControl>
          </Box>
        );
        
      case 1:
        return (
          <Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                margin="normal"
                required
                name="height.value"
                label="Height"
                type="number"
                value={formData.height.value}
                onChange={handleChange}
                error={!!formErrors['height.value']}
                helperText={formErrors['height.value']}
                sx={{ flex: 1 }}
              />
              <FormControl margin="normal" sx={{ minWidth: 80 }}>
                <InputLabel>Unit</InputLabel>
                <Select
                  name="height.unit"
                  value={formData.height.unit}
                  onChange={handleChange}
                  label="Unit"
                >
                  <MenuItem value="cm">cm</MenuItem>
                  <MenuItem value="ft_in">ft/in</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                margin="normal"
                required
                name="weight.value"
                label="Weight"
                type="number"
                value={formData.weight.value}
                onChange={handleChange}
                error={!!formErrors['weight.value']}
                helperText={formErrors['weight.value']}
                sx={{ flex: 1 }}
              />
              <FormControl margin="normal" sx={{ minWidth: 80 }}>
                <InputLabel>Unit</InputLabel>
                <Select
                  name="weight.unit"
                  value={formData.weight.unit}
                  onChange={handleChange}
                  label="Unit"
                >
                  <MenuItem value="kg">kg</MenuItem>
                  <MenuItem value="lbs">lbs</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <FormControl fullWidth margin="normal" required error={!!formErrors.activityLevel}>
              <InputLabel>Activity Level</InputLabel>
              <Select
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                label="Activity Level"
              >
                {activityLevels.map((level) => (
                  <MenuItem key={level.value} value={level.value}>
                    {level.label}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.activityLevel && <FormHelperText>{formErrors.activityLevel}</FormHelperText>}
            </FormControl>
          </Box>
        );
        
      case 2:
        return (
          <Box>
            <FormControl fullWidth margin="normal" required error={!!formErrors.healthGoals}>
              <InputLabel>Health Goals</InputLabel>
              <Select
                multiple
                value={formData.healthGoals}
                onChange={handleHealthGoalsChange}
                input={<OutlinedInput label="Health Goals" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value.replace('_', ' ')} size="small" />
                    ))}
                  </Box>
                )}
              >
                {healthGoalsOptions.map((goal) => (
                  <MenuItem key={goal} value={goal}>
                    {goal.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.healthGoals && <FormHelperText>{formErrors.healthGoals}</FormHelperText>}
            </FormControl>
          </Box>
        );
        
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            Join Health Companion
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your personalized wellness profile
          </Typography>

          <Stepper activeStep={activeStep} sx={{ width: '100%', mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            {renderStepContent(activeStep)}

            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ py: 1.5 }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Create Account'
                  )}
                </Button>
              ) : (
                <Button onClick={handleNext} variant="contained">
                  Next
                </Button>
              )}
            </Box>

            {activeStep === 0 && (
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    style={{ 
                      color: '#2E7D32', 
                      textDecoration: 'none',
                      fontWeight: 'medium'
                    }}
                  >
                    Sign in here
                  </Link>
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;