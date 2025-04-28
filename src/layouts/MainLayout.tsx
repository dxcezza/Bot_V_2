import React, { useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import MusicPlayer from '@/components/MusicPlayer';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import AuthModal from '@/components/auth/AuthModal';
import { User as UserType } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const PUBLIC_ROUTES = ['/'];

const MainLayout = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);

  const handleAuthSuccess = (loggedInUser: UserType) => {
    setUser(loggedInUser);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    toast({
      title: 'Выход выполнен',
      description: 'Вы успешно вышли из аккаунта.',
    });
  };

  // Check if route requires authentication
  if (!user && !PUBLIC_ROUTES.includes(location.pathname)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Требуется авторизация</h1>
        <p className="text-muted-foreground mb-6">
          Пожалуйста, войдите чтобы получить доступ к этому разделу
        </p>
        <Button
          onClick={() => setIsAuthModalOpen(true)}
          className="gap-2 bg-music-primary hover:bg-music-secondary"
        >
          <User className="h-4 w-4" />
          Войти
        </Button>
        <AuthModal
          open={isAuthModalOpen}
          onOpenChange={setIsAuthModalOpen}
          onSuccess={handleAuthSuccess}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar />

      <div
        className={cn(
          'transition-all duration-300 flex-1 pb-24',
          'ml-52 w-[calc(100%-208px)]', // Default width when sidebar is expanded
          'lg:w-[calc(100%-208px)]', // Large screens
          'md:w-[calc(100%-208px)]', // Medium screens
          'sm:w-[calc(100%-64px)]' // Small screens with collapsed sidebar
        )}
      >
        <header className="p-4 flex justify-end">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                  <Avatar>
                    <AvatarImage src={user.profileImageUrl} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => (window.location.href = '/profile')}
                >
                  Профиль
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => (window.location.href = '/settings')}
                >
                  Настройки
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={handleLogout}
                >
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => setIsAuthModalOpen(true)}
              className="gap-2 bg-music-primary hover:bg-music-secondary"
            >
              <User className="h-4 w-4" />
              Войти
            </Button>
          )}
        </header>

        <main className="p-6">
          <Outlet context={{ user }} />
        </main>
      </div>

      <MusicPlayer />

      <AuthModal
        open={isAuthModalOpen}
        onOpenChange={setIsAuthModalOpen}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default MainLayout;
