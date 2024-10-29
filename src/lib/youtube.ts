const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeVideo {
  id: string;
  title: string;
  author: string;
  thumbnailUrl: string;
  videoUrl: string;
  likes: number;
  comments: number;
}

export async function fetchShorts(searchTerm?: string, pageToken?: string): Promise<{ videos: YouTubeVideo[], nextPageToken: string | null }> {
  try {
    const query = searchTerm ? `${searchTerm} shorts` : 'shorts';
    const response = await fetch(
      `${YOUTUBE_API_URL}/search?part=snippet&maxResults=50&q=${query}&type=video&videoDuration=short&key=${YOUTUBE_API_KEY}${pageToken ? `&pageToken=${pageToken}` : ''}`
    );
    const data = await response.json();

    if (!data.items?.length) return { videos: [], nextPageToken: null };

    const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
    const statsResponse = await fetch(
      `${YOUTUBE_API_URL}/videos?part=statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    );
    const statsData = await statsResponse.json();

    const videos = data.items.map((item: any, index: number) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      author: item.snippet.channelTitle,
      thumbnailUrl: item.snippet.thumbnails.high.url,
      videoUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
      likes: parseInt(statsData.items[index]?.statistics.likeCount) || 0,
      comments: parseInt(statsData.items[index]?.statistics.commentCount) || 0,
    }));

    // Shuffle the videos array
    const shuffledVideos = [...videos].sort(() => Math.random() - 0.5);

    return {
      videos: shuffledVideos,
      nextPageToken: data.nextPageToken || null
    };
  } catch (error) {
    console.error('Error fetching YouTube shorts:', error);
    return { videos: [], nextPageToken: null };
  }
}