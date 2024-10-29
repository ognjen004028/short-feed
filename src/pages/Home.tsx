import React, { useEffect, useState, useCallback } from 'react';
import VideoCard from '../components/VideoCard';
import { useAuthStore } from '../store/authStore';
import { fetchShorts, YouTubeVideo } from '../lib/youtube';
import { db } from '../lib/db';
import { Search, Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  const { user } = useAuthStore();
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [watchedVideos, setWatchedVideos] = useState<Set<string>>(new Set());

  const loadVideos = async (search?: string, token?: string) => {
    if (!token) setIsLoading(true);
    try {
      const { videos: newVideos, nextPageToken: newToken } = await fetchShorts(search, token);
      
      if (token) {
        setVideos(prev => [...prev, ...newVideos]);
      } else {
        setVideos(newVideos);
        setCurrentIndex(0);
        setWatchedVideos(new Set()); // Reset watched videos on new search
      }
      
      setNextPageToken(newToken);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadMoreVideos = useCallback(async () => {
    if (isLoadingMore || !nextPageToken) return;
    setIsLoadingMore(true);
    await loadVideos(searchTerm, nextPageToken);
  }, [nextPageToken, isLoadingMore, searchTerm]);

  useEffect(() => {
    loadVideos();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    if (user) {
      await db.saveToSearchHistory(user.id, searchTerm);
    }
    
    setNextPageToken(null);
    await loadVideos(searchTerm);
  };

  const handleNext = async () => {
    if (currentIndex >= videos.length - 3) {
      await loadMoreVideos();
    }
    setCurrentIndex(prev => prev + 1);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleVideoWatch = async (video: YouTubeVideo) => {
    if (!user || watchedVideos.has(video.id)) return;
    
    try {
      await db.saveToWatchHistory(user.id, video.id, video.title);
      setWatchedVideos(prev => new Set(prev).add(video.id));
    } catch (error) {
      console.error('Error saving watch history:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Toaster position="bottom-center" />
      
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search shorts..."
            className="w-full px-4 py-2 pl-10 bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
      </form>

      {isLoading ? (
        <div className="flex justify-center items-center h-[calc(100vh-16rem)]">
          <Loader className="w-8 h-8 animate-spin text-red-500" />
        </div>
      ) : videos.length > 0 ? (
        <div className="flex justify-center">
          <VideoCard
            {...videos[currentIndex]}
            onNext={handleNext}
            onPrevious={handlePrevious}
            hasPrevious={currentIndex > 0}
            onWatch={() => handleVideoWatch(videos[currentIndex])}
            isLoadingMore={isLoadingMore && currentIndex === videos.length - 1}
          />
        </div>
      ) : (
        <div className="text-center text-gray-400">
          No videos found. Try a different search term.
        </div>
      )}
    </div>
  );
}