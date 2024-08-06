// src/Header.tsx
import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import { Link as RouterLink, useLocation } from 'react-router-dom';

interface HeaderProps {
  onSearch?: (keyword: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const isShortsPage = location.pathname === '/';

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && onSearch) {
      const keyword = searchTerm.trim() === '' ? 'shorts' : searchTerm;
      onSearch(keyword);
    }
  };

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: 'red' }}>
        <Toolbar sx={{ justifyContent: 'center' }}>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {isShortsPage ? 'YouTube Shorts Clone' : 'About'}
            </Typography>
            {isShortsPage && onSearch && (
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyPress={handleSearchKeyPress}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ backgroundColor: 'white', borderRadius: 1, ml: 2 }}
              />
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{ width: 250, '& .MuiDrawer-paper': { width: 250 } }}  // Adjust the width value as needed
      >
        <List>
          <ListItem button component={RouterLink} to="/" onClick={toggleDrawer(false)}>
            <ListItemText primary="Shorts" />
          </ListItem>
          <ListItem button component={RouterLink} to="/about" onClick={toggleDrawer(false)}>
            <ListItemText primary="About" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Header;
