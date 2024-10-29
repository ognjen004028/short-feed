import React, { useEffect } from 'react';
import { Heart, ThumbsDown, Share2, ArrowUp, ArrowDown, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

interface VideoCardProps {
  videoUrl: string;
  title: string;
  author: string;
  likes: number;
  onNext: () => void;
  onPrevious: () => void;
  hasPrevious: boolean;
  isLoadingMore: boolean;
  onWatch?: () => void;
}

export default function VideoCard({ 
  videoUrl, 
  title, 
  author, 
  likes,
  onNext,
  onPrevious,
  hasPrevious,
  isLoadingMore,
  onWatch
}: VideoCardProps) {
  useEffect(() => {
    // Call onWatch when the video is displayed
    onWatch?.();
  }, [videoUrl, onWatch]);

  const handleLike = () => {
    toast.success('Like sent!');
  };

  const handleDislike = () => {
    toast.success('Dislike sent!');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`https://youtube.com/watch?v=${videoUrl.split('/').pop()}`);
    toast.success('Link copied!');
  };

  return (
    <div className="relative w-full max-w-[350px] aspect-[9/16] bg-zinc-900 rounded-xl overflow-hidden">
      <iframe
        src={`${videoUrl}?autoplay=1&controls=1&rel=0`}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <h3 className="font-bold text-lg line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-300">@{author}</p>
      </div>

      <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-6">
        <button 
          onClick={handleLike}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <Heart className="w-7 h-7" />
          <span className="text-sm">{likes}</span>
        </button>

        <button 
          onClick={handleDislike}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ThumbsDown className="w-7 h-7" />
        </button>

        <button 
          onClick={handleShare}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <Share2 className="w-7 h-7" />
        </button>

        <button 
          onClick={onPrevious}
          disabled={!hasPrevious}
          className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
        >
          <ArrowUp className="w-7 h-7" />
        </button>

        <button 
          onClick={onNext}
          disabled={isLoadingMore}
          className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
        >
          {isLoadingMore ? (
            <Loader className="w-7 h-7 animate-spin" />
          ) : (
            <ArrowDown className="w-7 h-7" />
          )}
        </button>
      </div>
    </div>
  );
}