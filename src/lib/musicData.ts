import { Album, Artist, Playlist, Track, User } from './types';

// Mock user data
export const currentUser: User = {
  id: 'user1',
  name: 'Пользователь',
  email: 'user@example.com',
  profileImageUrl:
    'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=200&h=200',
};

// Empty arrays for data
export const artists: Artist[] = [];
export const albums: Album[] = [];
export const tracks: Track[] = [];
export const playlists: Playlist[] = [];
export const likedTracks: Track[] = [];

// Helper function to format track duration
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
