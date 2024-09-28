import React, { useState, useEffect, useCallback, useRef } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ShareIcon from '@mui/icons-material/Share';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { fetchRandomShorts } from '../youtubeService';
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
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  const loadMoreVideos = useCallback(async (count: number = 1) => {
    try {
      setIsLoading(true);
      const newVideos = await Promise.all(
        Array(count).fill(null).map(() => fetchRandomShorts(searchKeyword))
      );
      setVideos(prevVideos => [...prevVideos, ...newVideos]);
    } catch (error) {
      console.error('Error fetching videos:', error);
      showSnackbar('Failed to load videos. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [searchKeyword]);

  useEffect(() => {
    setVideos([]);
    setCurrentIndex(0);
    setIsLoading(true);
    loadMoreVideos(3);
  }, [loadMoreVideos, searchKeyword]);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current && !isScrollingRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const scrollPosition = containerRef.current.scrollTop;
        const newIndex = Math.round(scrollPosition / containerHeight);
        
        if (newIndex !== currentIndex) {
          setCurrentIndex(newIndex);
        }

        // Load more videos when nearing the end
        if (newIndex >= videos.length - 2) {
          loadMoreVideos(3);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [currentIndex, videos.length, loadMoreVideos]);

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
    if (videos[currentIndex]) {
      navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${videos[currentIndex].id}`);
      showSnackbar('Link copied to clipboard.');
    }
  };

  const scrollToIndex = (index: number) => {
    if (containerRef.current) {
      isScrollingRef.current = true;
      containerRef.current.scrollTo({
        top: index * containerRef.current.clientHeight,
        behavior: 'smooth'
      });
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000); // Adjust this timeout if needed to match your scroll animation duration
    }
  };

  const handleNextVideo = () => {
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    scrollToIndex(nextIndex);
  };

  const handlePreviousVideo = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      scrollToIndex(prevIndex);
    }
  };

  if (isLoading && videos.length === 0) {
    return <Loading />;
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{ backgroundColor: '#f0f0f0', height: '100vh', margin: 0, overflow: 'hidden' }}
    >
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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
        sx={{ width: '100%', height: '100%', maxWidth: 800 }}
      >
        <Box
          ref={containerRef}
          sx={{
            flex: 1,
            height: '100%',
            overflowY: 'scroll',
            scrollSnapType: 'y mandatory',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {videos.map((video, index) => (
            <Box
              key={`${video.id}-${index}`}
              sx={{
                height: '100%',
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 2, color: 'black' }}>
                {video.title}
              </Typography>
              <Card sx={{ height: '80%', width: '90%', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                <Box
                  sx={{
                    position: 'relative',
                    height: '100%',
                    width: '100%',
                    paddingTop: '56.25%',
                    overflow: 'hidden',
                  }}
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}?autoplay=${index === currentIndex ? 1 : 0}&controls=0&modestbranding=1`}
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
          ))}
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{ width: 80, backgroundColor: '#f0f0f0', height: '100%' }}
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
            onClick={handlePreviousVideo}
            sx={{ color: 'red', mt: 2, mb: 1 }}
            disabled={currentIndex === 0}
          >
            <ArrowUpwardIcon fontSize="large" />
          </IconButton>
          <IconButton
            onClick={handleNextVideo}
            sx={{ color: 'red', mt: 1 }}
          >
            <ArrowDownwardIcon fontSize="large" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Shorts;