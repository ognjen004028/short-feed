import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { History, Search, User, Trash2 } from 'lucide-react';
import { db, WatchHistoryItem, SearchHistoryItem } from '../lib/db';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user } = useAuthStore();
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [isDeleting, setIsDeleting] = useState({
    watch: false,
    search: false
  });

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    if (!user) return;
    
    try {
      const [watchData, searchData] = await Promise.all([
        db.getWatchHistory(user.id),
        db.getSearchHistory(user.id)
      ]);
      
      setWatchHistory(watchData);
      setSearchHistory(searchData);
    } catch (error) {
      console.error('Error loading history:', error);
      toast.error('Failed to load history');
    }
  };

  const handleClearWatchHistory = async () => {
    if (!user || !confirm('Are you sure you want to clear your watch history?')) return;
    
    setIsDeleting(prev => ({ ...prev, watch: true }));
    try {
      await db.clearWatchHistory(user.id);
      setWatchHistory([]);
      toast.success('Watch history cleared');
    } catch (error) {
      console.error('Error clearing watch history:', error);
      toast.error('Failed to clear watch history');
    } finally {
      setIsDeleting(prev => ({ ...prev, watch: false }));
    }
  };

  const handleClearSearchHistory = async () => {
    if (!user || !confirm('Are you sure you want to clear your search history?')) return;
    
    setIsDeleting(prev => ({ ...prev, search: true }));
    try {
      await db.clearSearchHistory(user.id);
      setSearchHistory([]);
      toast.success('Search history cleared');
    } catch (error) {
      console.error('Error clearing search history:', error);
      toast.error('Failed to clear search history');
    } finally {
      setIsDeleting(prev => ({ ...prev, search: false }));
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-zinc-900 rounded-2xl p-8">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">@{user.username}</h1>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-red-500" />
                <h2 className="text-xl font-bold">Watch History</h2>
              </div>
              <button
                onClick={handleClearWatchHistory}
                disabled={isDeleting.watch || watchHistory.length === 0}
                className="flex items-center space-x-1 text-sm text-red-500 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear</span>
              </button>
            </div>
            <div className="space-y-2">
              {watchHistory.length > 0 ? (
                watchHistory.map((item) => (
                  <div
                    key={item.id}
                    className="bg-zinc-800 p-4 rounded-lg flex justify-between items-center"
                  >
                    <span className="line-clamp-1">{item.video_title}</span>
                    <span className="text-sm text-gray-400 shrink-0 ml-4">
                      {formatDate(item.watched_at)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-center py-4">
                  No watch history
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-red-500" />
                <h2 className="text-xl font-bold">Search History</h2>
              </div>
              <button
                onClick={handleClearSearchHistory}
                disabled={isDeleting.search || searchHistory.length === 0}
                className="flex items-center space-x-1 text-sm text-red-500 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear</span>
              </button>
            </div>
            <div className="space-y-2">
              {searchHistory.length > 0 ? (
                searchHistory.map((item) => (
                  <div
                    key={item.id}
                    className="bg-zinc-800 p-4 rounded-lg flex justify-between items-center"
                  >
                    <span>{item.search_term}</span>
                    <span className="text-sm text-gray-400 ml-4">
                      {formatDate(item.searched_at)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-center py-4">
                  No search history
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}