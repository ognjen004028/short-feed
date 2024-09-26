// src/About.tsx
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Header from './components/Header';

const About: React.FC = () => {
  return (
    <>
      <Header />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{ paddingTop: '65px', minHeight: '25vh', margin: 0}}
      >
        <Typography variant="h4" sx={{ mt: 2, mb: 2 }}>
          About
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: '500px', textAlign: 'center', mb: 2 }}>
          <b>short-feed,</b> a YouTube Shorts clone created using React TypeScript <br />
          GitHub: <a href="https://www.github.com/ognjen004028/short-feed">short-feed by ognjen004028@github.com</a> <br />
          
        </Typography>
        <Typography>
          <a href='/'>Back to Shorts page</a>
        </Typography>
      </Box>
    </>
  );
};

export default About;
