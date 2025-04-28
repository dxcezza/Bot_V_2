export interface User {
  id: string;
  name: string;
  email: string;
  profileImageUrl?: string;
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Album {
  id: string;
  title: string;
  artist: Artist;
  coverUrl: string;
  year: number;
}

export interface Track {
  id: string;
  title: string;
  artist: Artist;
  album: Album;
  duration: number;
  audioUrl: string;
}

export interface Playlist {
  id: string;
  name: string;
  coverUrl?: string;
  userId: string;
  tracks: Track[];
  createdAt: Date;
}
