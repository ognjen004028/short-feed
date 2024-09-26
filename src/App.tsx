import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes';


const App: React.FC = () => {
  return (
    <Router>
      <CssBaseline />
      <AppRoutes />
    </Router>
  );
};

export default App;