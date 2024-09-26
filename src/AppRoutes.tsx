import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Shorts from './components/Shorts';
import About from './About';

const AppRoutes: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>('shorts');

  return (
    <Routes>
      <Route path="/" element={<Shorts searchKeyword={searchKeyword} onSearch={setSearchKeyword} />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
};

export default AppRoutes;