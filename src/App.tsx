// src/App.tsx
import React, { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './Header';
import Shorts from './Shorts';

const App: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState('shorts');

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword || 'shorts');
  };

  return (
    <>
      <CssBaseline />
      <Header onSearch={handleSearch} />
      <Shorts searchKeyword={searchKeyword} />
    </>
  );
};

export default App;
