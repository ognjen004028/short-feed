// src/Header.tsx
import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';

interface HeaderProps {
  onSearch: (keyword: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  };

  const handleSearchSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch(searchKeyword.trim());
    }
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: 'red' }}>
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            YouTube Shorts Clone
          </Typography>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search"
            value={searchKeyword}
            onChange={handleSearchChange}
            onKeyDown={handleSearchSubmit}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ backgroundColor: 'white', borderRadius: 1, ml: 2 }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
