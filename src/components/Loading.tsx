import React from 'react';
import { LinearProgress, Typography } from '@mui/material';

const Loading: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Loading...
      </Typography>

      <LinearProgress
        variant="indeterminate"
        sx={{
          width: '30%',
          height: 10,
          borderRadius: 5,
          backgroundColor: 'rgba(225, 225, 225, 0.5)',
          '& .MuiLinearProgress-bar': {
            backgroundColor: 'red',
          },
        }}
      />
    </div>
  );
};

export default Loading;