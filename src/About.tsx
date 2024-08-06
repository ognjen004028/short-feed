// src/About.tsx
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Header from './Header';

const About: React.FC = () => {
  return (
    <>
      <Header />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{ paddingTop: '15px', minHeight: '25vh', margin: 0}}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
          About
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: '600px', textAlign: 'center' }}>
          short-feed, a YouTube Shorts clone created using React TypeScript <br />
          Github: <a href="https://www.github.com/ognjen004028/short-feed">short-feed by ognjen004028@github.com</a>
        </Typography>
      </Box>
    </>
  );
};

export default About;
