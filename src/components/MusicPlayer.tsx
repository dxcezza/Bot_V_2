import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Heart,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDuration, tracks } from '@/lib/musicData';
import { Track } from '@/lib/types';

interface MusicPlayerProps {
  className?: string;
}

const MusicPlayer = ({ className }: MusicPlayerProps) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevTrack = () => {
    const currentIndex = tracks.findIndex(
      (track) => track.id === currentTrack?.id
    );
    if (currentIndex > 0) {
      setCurrentTrack(tracks[currentIndex - 1]);
      setCurrentTime(0);
    }
  };

  const handleNextTrack = () => {
    const currentIndex = tracks.findIndex(
      (track) => track.id === currentTrack?.id
    );
    if (currentIndex < tracks.length - 1) {
      setCurrentTrack(tracks[currentIndex + 1]);
      setCurrentTime(0);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (isMuted && value[0] > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleProgressChange = (value: number[]) => {
    setCurrentTime(value[0]);
  };

  if (!currentTrack) return null;

  return (
    <div
      className={cn(
        'bg-card fixed bottom-0 left-0 right-0 p-4 border-t border-border flex items-center z-20',
        className
      )}
    >
      {/* Track info */}
      <div className="flex items-center min-w-[180px] max-w-[240px]">
        <div className="w-12 h-12 rounded overflow-hidden mr-3">
          <img
            src={currentTrack.album.coverUrl}
            alt={currentTrack.album.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-medium truncate">{currentTrack.title}</p>
          <p className="text-xs text-muted-foreground truncate">
            {currentTrack.artist.name}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-2 h-8 w-8"
          onClick={toggleLike}
        >
          <Heart
            className={cn(
              'h-4 w-4',
              isLiked ? 'fill-music-primary text-music-primary' : ''
            )}
          />
        </Button>
      </div>

      {/* Player controls */}
      <div className="flex-1 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handlePrevTrack}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full bg-music-primary text-white border-none hover:bg-music-secondary"
            onClick={handlePlayPause}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleNextTrack}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-full flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {formatDuration(currentTime)}
          </span>
          <Slider
            value={[currentTime]}
            min={0}
            max={currentTrack.duration}
            step={1}
            onValueChange={handleProgressChange}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground">
            {formatDuration(currentTrack.duration)}
          </span>
        </div>
      </div>

      {/* Volume control */}
      <div className="flex items-center gap-2 min-w-[120px] max-w-[200px]">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={toggleMute}
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
        <Slider
          value={[isMuted ? 0 : volume]}
          min={0}
          max={100}
          step={1}
          onValueChange={handleVolumeChange}
          className="flex-1"
        />
      </div>
    </div>
  );
};

export default MusicPlayer;
