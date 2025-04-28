import React from 'react';
import { Link } from 'react-router-dom';
import { Playlist } from '@/lib/types';
import { cn } from '@/lib/utils';

interface PlaylistCardProps {
  playlist: Playlist;
  className?: string;
}

const PlaylistCard = ({ playlist, className }: PlaylistCardProps) => {
  return (
    <Link
      to={`/playlist/${playlist.id}`}
      className={cn('music-card group', className)}
    >
      <div className="music-card-img relative">
        <img
          src={
            playlist.coverUrl ||
            'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=400&h=400'
          }
          alt={playlist.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <div className="w-10 h-10 rounded-full bg-music-primary flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>
      </div>
      <h3 className="font-medium truncate">{playlist.name}</h3>
      <p className="text-sm text-muted-foreground truncate">
        {playlist.tracks.length} songs
      </p>
    </Link>
  );
};

export default PlaylistCard;
