import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, User } from 'lucide-react';
import TrackCard from './TrackCard';
import { Track } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';
import { Button } from './ui/button';

interface SearchResult {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover_url: string;
  duration_ms: number;
  spotify_url: string;
  preview_url: string;
  track_url: string;
}

const TrackSearchResults = () => {
  const { user } = useOutletContext<{ user: any }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [libraryTracks, setLibraryTracks] = useState<string[]>([]);
  const { toast } = useToast();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const searchTracks = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (response.ok) {
        setSearchResults(data.tracks);
      } else {
        toast({
          title: 'Search failed',
          description: data.error || 'Failed to search tracks',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        title: 'Search failed',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchTracks(query);
  };

  const handlePlay = (track: SearchResult) => {
    if (track.preview_url) {
      const audio = new Audio(track.preview_url);
      audio.play();
    } else {
      toast({
        title: 'Preview unavailable',
        description: 'No preview available for this track',
        variant: 'destructive',
      });
    }
  };

  const handleToggleLibrary = (track: SearchResult) => {
    setLibraryTracks((prev) =>
      prev.includes(track.id)
        ? prev.filter((id) => id !== track.id)
        : [...prev, track.id]
    );

    toast({
      title: libraryTracks.includes(track.id)
        ? 'Removed from Library'
        : 'Added to Library',
      description: `"${track.title}" has been ${
        libraryTracks.includes(track.id) ? 'removed from' : 'added to'
      } your library.`,
    });
  };

  const handleDownload = async (track: SearchResult) => {
    try {
      toast({
        title: 'Download Started',
        description: `"${track.title}" is being downloaded.`,
      });

      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          track_url: track.track_url,
        }),
      });

      if (response.ok) {
        // Create a blob from the response
        const blob = await response.blob();
        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${track.title} - ${track.artist}.mp3`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({
          title: 'Download Complete',
          description: `"${track.title}" has been downloaded.`,
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Download failed');
      }
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: 'Download Failed',
        description: 'There was an error downloading the track.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="p-4">
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          className="pl-9"
          placeholder="Search for tracks..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Searching...</p>
        </div>
      ) : searchResults.length > 0 ? (
        <div className="space-y-2">
          {searchResults.map((track, index) => (
            <TrackCard
              key={track.id}
              track={{
                id: track.id,
                title: track.title,
                artist: { id: '', name: track.artist, imageUrl: '' },
                album: {
                  id: '',
                  title: track.album,
                  artist: { id: '', name: track.artist, imageUrl: '' },
                  coverUrl: track.cover_url,
                  year: 0,
                },
                duration: Math.floor(track.duration_ms / 1000),
                audioUrl: track.preview_url,
              }}
              index={index}
              isInLibrary={libraryTracks.includes(track.id)}
              onPlay={() => handlePlay(track)}
              onToggleLibrary={() => handleToggleLibrary(track)}
              onDownload={() => handleDownload(track)}
            />
          ))}
        </div>
      ) : searchQuery ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No tracks found</p>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Start typing to search for tracks
          </p>
        </div>
      )}
    </Card>
  );
};

export default TrackSearchResults;