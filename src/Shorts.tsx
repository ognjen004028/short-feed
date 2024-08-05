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
import { fetchRandomShorts } from './youtubeService';

interface Video {
  id: string;
  title: string;
}

interface ShortsProps {
  searchKeyword: string;
}

const Shorts: React.FC<ShortsProps> = ({ searchKeyword }) => {
  const [video, setVideo] = useState<Video | null>(null);

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

  if (!video) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{ backgroundColor: '#f0f0f0', paddingTop: '64px', minHeight: '100vh', margin: 0, overflow: 'hidden' }}
    >
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
          <IconButton sx={{ mb: 2, color: 'red' }}>
            <ThumbUpIcon />
          </IconButton>
          <IconButton sx={{ mb: 2, color: 'red' }}>
            <ThumbDownIcon />
          </IconButton>
          <IconButton sx={{ mb: 2, color: 'red' }}>
            <ShareIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              loadMoreVideo();
            }}
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
