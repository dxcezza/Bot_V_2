import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { likedTracks } from '@/lib/musicData';
import TrackCard from '@/components/TrackCard';
import { Track } from '@/lib/types';
import { Heart } from 'lucide-react';

const LikedSongs = () => {
  const { user } = useOutletContext<{ user: any }>();
  const [userLikedTracks, setUserLikedTracks] = useState<Track[]>(likedTracks);

  const handlePlayTrack = (track: Track) => {
    console.log('Playing track:', track.title);
  };

  const handleToggleLibrary = (track: Track) => {
    setUserLikedTracks((prev) =>
      prev.some((t) => t.id === track.id)
        ? prev.filter((t) => t.id !== track.id)
        : [...prev, track]
    );
  };

  const handleDownload = (track: Track) => {
    console.log('Downloading track:', track.title);
  };

  const isInLibrary = (track: Track) => {
    return userLikedTracks.some((t) => t.id === track.id);
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-b from-music-secondary to-music-dark p-8 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-36 h-36 bg-music-primary rounded-lg flex items-center justify-center">
            <Heart className="h-20 w-20 text-white" />
          </div>

          <div>
            <p className="text-sm uppercase tracking-wider mb-1">Плейлист</p>
            <h1 className="text-4xl font-bold mb-2">Любимые треки</h1>
            <p className="text-muted-foreground">
              {user ? user.name : 'Вы'} • {userLikedTracks.length} треков
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <Button className="bg-music-primary hover:bg-music-secondary">
          Воспроизвести все
        </Button>
        <Button variant="outline">Случайный порядок</Button>
      </div>

      {userLikedTracks.length > 0 ? (
        <div className="bg-card rounded-md p-3">
          {userLikedTracks.map((track, index) => (
            <TrackCard
              key={track.id}
              track={track}
              index={index}
              isInLibrary={isInLibrary(track)}
              onPlay={handlePlayTrack}
              onToggleLibrary={handleToggleLibrary}
              onDownload={handleDownload}
            />
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-lg p-8 text-center">
          <h3 className="text-xl font-medium mb-2">Нет любимых треков</h3>
          <p className="text-muted-foreground mb-4">
            Начните добавлять треки в избранное
          </p>
          <Button
            variant="outline"
            onClick={() => (window.location.href = '/library')}
          >
            Просмотреть библиотеку
          </Button>
        </div>
      )}
    </div>
  );
};

export default LikedSongs;
