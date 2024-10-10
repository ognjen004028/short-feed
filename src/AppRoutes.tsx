import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Shorts from './components/Shorts';
import About from './About';
import Header from './components/Header';
import LoginRegister from './components/LoginRegister';

const AppRoutes: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>('shorts');

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  return (
    <>
      <Header onSearch={handleSearch} />
      <Routes>
        <Route path="/" element={<Shorts searchKeyword={searchKeyword} onSearch={handleSearch} />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<LoginRegister />} />
      </Routes>
    </>
  );
};

export default AppRoutes;