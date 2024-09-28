import axios from 'axios';

const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const MAX_RESULTS = 50; // Number of results per page

interface Video {
  id: string;
  title: string;
}

export const fetchRandomShorts = async (searchKeyword: string = '#shorts'): Promise<Video> => {
  try {
    if (!API_KEY) {
      throw new Error('YouTube API key is not set');
    }

    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${MAX_RESULTS}&q=${encodeURIComponent(searchKeyword)}&type=video&videoDuration=short&key=${API_KEY}`
    );
    
    const videos: Video[] = response.data.items.map((item: any) => ({
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