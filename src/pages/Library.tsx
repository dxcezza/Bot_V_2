import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { albums, tracks } from '@/lib/musicData';
import AlbumCard from '@/components/AlbumCard';
import TrackCard from '@/components/TrackCard';
import { Track } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Library = () => {
  const { user } = useOutletContext<{ user: any }>();
  const [likedTracks, setLikedTracks] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handlePlayTrack = (track: Track) => {
    console.log('Playing track:', track.title);
  };

  const handleToggleLibrary = (track: Track) => {
    setLikedTracks((prev) =>
      prev.includes(track.id)
        ? prev.filter((id) => id !== track.id)
        : [...prev, track.id]
    );
  };

  const handleDownload = (track: Track) => {
    console.log('Downloading track:', track.title);
  };

  const filteredAlbums = albums.filter(
    (album) =>
      album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      album.artist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTracks = tracks.filter(
    (track) =>
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.album.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Библиотека</h1>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            className="pl-9"
            placeholder="Поиск в библиотеке"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="albums" className="w-full">
        <TabsList>
          <TabsTrigger value="albums">Альбомы</TabsTrigger>
          <TabsTrigger value="songs">Треки</TabsTrigger>
        </TabsList>

        <TabsContent value="albums" className="pt-6">
          {filteredAlbums.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredAlbums.map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Альбомы не найдены.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="songs" className="pt-6">
          {filteredTracks.length > 0 ? (
            <div className="bg-card rounded-md p-3">
              {filteredTracks.map((track, index) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  index={index}
                  isInLibrary={likedTracks.includes(track.id)}
                  onPlay={handlePlayTrack}
                  onToggleLibrary={handleToggleLibrary}
                  onDownload={handleDownload}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Треки не найдены.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Library;
