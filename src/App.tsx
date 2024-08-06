// src/App.tsx
import React, { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Shorts from './Shorts';
import About from './About';

const App: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>('shorts');

  return (
    <Router>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Shorts searchKeyword={searchKeyword} onSearch={setSearchKeyword} />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
};

export default App;
