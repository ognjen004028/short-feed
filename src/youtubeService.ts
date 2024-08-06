// src/youtubeService.ts
import axios from 'axios';

const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const MAX_RESULTS = 50; // Number of results per page

export const fetchRandomShorts = async (searchKeyword: string = '#shorts') => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${MAX_RESULTS}&q=${encodeURIComponent(searchKeyword)}&type=video&videoDuration=short&key=${API_KEY}`
    );
    
    const videos = response.data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
    }));

    if (videos.length === 0) {
      throw new Error('No videos found');
    }

    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
    return randomVideo;
  } catch (error) {
    console.error('Error fetching shorts:', error);
    throw error;
  }
};