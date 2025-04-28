import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { playlists } from '@/lib/musicData';
import PlaylistCard from '@/components/PlaylistCard';
import { PlusCircle } from 'lucide-react';

const Playlists = () => {
  const { user } = useOutletContext<{ user: any }>();

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Your Playlists</h1>

        <Button className="bg-music-primary hover:bg-music-secondary">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Playlist
        </Button>
      </div>

      {playlists.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-lg p-8 text-center">
          <h3 className="text-xl font-medium mb-2">No playlists yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first playlist to organize your favorite tracks
          </p>
          <Button className="bg-music-primary hover:bg-music-secondary">
            Create Playlist
          </Button>
        </div>
      )}
    </div>
  );
};

export default Playlists;
