import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { currentUser, playlists } from '@/lib/musicData';
import PlaylistCard from '@/components/PlaylistCard';

const Profile = () => {
  const { user } = useOutletContext<{ user: any }>();
  // If no logged in user, use the mock user for demo purposes
  const displayUser = user || currentUser;

  const userPlaylists = playlists.filter(
    (playlist) => playlist.userId === displayUser.id
  );

  return (
    <div className="animate-fade-in">
      <div className="bg-card rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={displayUser.profileImageUrl}
              alt={displayUser.name}
            />
            <AvatarFallback className="text-2xl">
              {displayUser.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{displayUser.name}</h1>
            <p className="text-muted-foreground mb-4">{displayUser.email}</p>

            <div className="flex flex-wrap gap-3">
              <Button>Edit Profile</Button>
              <Button variant="outline">Change Avatar</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Your Playlists</h2>
            <Button className="bg-music-primary hover:bg-music-secondary">
              New Playlist
            </Button>
          </div>

          {userPlaylists.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {userPlaylists.map((playlist) => (
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
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
          <div className="bg-card rounded-lg p-6">
            <div className="grid gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Preferences</h3>
                <div className="flex gap-3">
                  <Button variant="outline">Audio Quality</Button>
                  <Button variant="outline">Notifications</Button>
                  <Button variant="outline">Privacy</Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Account</h3>
                <div className="flex gap-3">
                  <Button variant="outline">Change Password</Button>
                  <Button variant="outline">Subscription</Button>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
