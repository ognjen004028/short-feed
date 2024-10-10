import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Tab, Tabs } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../api/auth';

const LoginRegister: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setError('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      if (activeTab === 0) {
        // Login
        const response = await login(email, password);
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId);
        navigate('/');
      } else {
        // Register
        await register(username, email, password);
        setActiveTab(0); // Switch to login tab after successful registration
        setError('Registration successful. Please log in.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 64px)', // Adjust for AppBar height
        pt: 8, // Add padding top to account for AppBar
      }}
    >
      <Typography variant="h4" sx={{ mb: 4 }}>
        {activeTab === 0 ? 'Login' : 'Register'}
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%', maxWidth: 400, mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>
      </Box>
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 400 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {activeTab === 1 && (
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete={activeTab === 0 ? "current-password" : "new-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, backgroundColor: 'red', '&:hover': { backgroundColor: 'darkred' } }}
        >
          {activeTab === 0 ? 'Login' : 'Register'}
        </Button>
      </Box>
    </Box>
  );
};

export default LoginRegister;
