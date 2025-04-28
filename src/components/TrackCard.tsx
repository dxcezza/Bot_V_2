import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Heart, Plus, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDuration } from '@/lib/musicData';
import { Track } from '@/lib/types';

interface TrackCardProps {
  track: Track;
  index: number;
  isInLibrary?: boolean;
  onPlay: (track: Track) => void;
  onToggleLibrary: (track: Track) => void;
  onDownload: (track: Track) => void;
}

const TrackCard = ({
  track,
  index,
  isInLibrary = false,
  onPlay,
  onToggleLibrary,
  onDownload,
}: TrackCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        'flex items-center p-2 rounded-md group',
        isHovered ? 'bg-muted' : 'hover:bg-muted'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-8 text-center flex justify-center items-center">
        {isHovered ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full"
            onClick={() => onPlay(track)}
          >
            <Play className="h-4 w-4" />
          </Button>
        ) : (
          <span className="text-muted-foreground">{index + 1}</span>
        )}
      </div>

      <div className="flex items-center flex-1">
        <div className="w-10 h-10 rounded overflow-hidden mr-3">
          <img
            src={track.album.coverUrl}
            alt={track.album.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="font-medium">{track.title}</p>
          <p className="text-sm text-muted-foreground">{track.artist.name}</p>
        </div>
      </div>

      <div className="text-muted-foreground text-sm">{track.album.title}</div>

      <div className="ml-auto flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity',
            isInLibrary && 'opacity-100'
          )}
          onClick={() => onToggleLibrary(track)}
        >
          {isInLibrary ? (
            <Heart className="h-4 w-4 fill-music-primary text-music-primary" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onDownload(track)}
        >
          <Download className="h-4 w-4" />
        </Button>
        <span className="text-muted-foreground text-sm w-12 text-right">
          {formatDuration(track.duration)}
        </span>
      </div>
    </div>
  );
};

export default TrackCard;
