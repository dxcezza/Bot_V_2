import React from 'react';
import { Link } from 'react-router-dom';
import { Album } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AlbumCardProps {
  album: Album;
  className?: string;
}

const AlbumCard = ({ album, className }: AlbumCardProps) => {
  return (
    <Link
      to={`/album/${album.id}`}
      className={cn('music-card group', className)}
    >
      <div className="music-card-img relative">
        <img
          src={album.coverUrl}
          alt={album.title}
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
      <h3 className="font-medium truncate">{album.title}</h3>
      <p className="text-sm text-muted-foreground truncate">
        {album.artist.name} • {album.year}
      </p>
    </Link>
  );
};

export default AlbumCard;
