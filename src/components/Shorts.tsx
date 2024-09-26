// src/Shorts.tsx
import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ShareIcon from '@mui/icons-material/Share';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { fetchRandomShorts } from '../youtubeService';
import Header from './Header';
import Loading from './Loading';

interface Video {
  id: string;
  title: string;
}

interface ShortsProps {
  searchKeyword: string;
  onSearch: (keyword: string) => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Shorts: React.FC<ShortsProps> = ({ searchKeyword, onSearch }) => {
  const [video, setVideo] = useState<Video | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const loadMoreVideo = useCallback(async () => {
    try {
      const newVideo = await fetchRandomShorts(searchKeyword);
      setVideo(newVideo);
    } catch (error) {
      console.error('Error fetching video:', error);
    }
  }, [searchKeyword]);

  useEffect(() => {
    loadMoreVideo();
  }, [loadMoreVideo]);

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleLike = () => {
    showSnackbar('Like sent!');
  };

  const handleDislike = () => {
    showSnackbar('Dislike sent!');
  };

  const handleShare = () => {
    if (video) {
      navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${video.id}`);
      showSnackbar('Link copied!');
    }
  };

  if (!video) {
    return <Loading />;
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{ backgroundColor: '#f0f0f0', paddingTop: '64px', minHeight: '100vh', margin: 0, overflow: 'hidden' }}
    >
      <Header onSearch={onSearch} />
      <Snackbar
        anchorOrigin={{ vertical:'bottom', horizontal:'center' }}
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Box
        display="flex"
        flexDirection="row"
        sx={{ width: '100%', height: '90vh', maxWidth: 800 }}
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          sx={{ flex: 1, height: '100%', alignItems: 'center' }}
        >
          <Typography variant="h6" sx={{ marginBottom: 2, color: 'black' }}>
            {video.title}
          </Typography>
          <Card sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
            <Box
              sx={{
                position: 'relative',
                height: 'calc(100vh - 64px)', // Adjust to fill the available space
                width: '100%',
                paddingTop: '56.25%', // 16:9 aspect ratio
                overflow: 'hidden',
              }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${video.id}?autoplay=1&controls=0&modestbranding=1`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={video.title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }}
              />
            </Box>
          </Card>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{ width: 80, backgroundColor: '#f0f0f0', height: '100vh' }}
        >
          <IconButton sx={{ mb: 2, color: 'red' }} onClick={handleLike}>
            <ThumbUpIcon />
          </IconButton>
          <IconButton sx={{ mb: 2, color: 'red' }} onClick={handleDislike}>
            <ThumbDownIcon />
          </IconButton>
          <IconButton sx={{ mb: 2, color: 'red' }} onClick={handleShare}>
            <ShareIcon />
          </IconButton>
          <IconButton
            onClick={loadMoreVideo}
            sx={{ color: 'red', mt: 2 }}
          >
            <ArrowDownwardIcon fontSize="large" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Shorts;
