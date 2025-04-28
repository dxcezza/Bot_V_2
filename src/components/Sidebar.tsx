import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Home,
  Library,
  ListMusic,
  Music,
  PlusCircle,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { icon: Home, label: 'Главная', path: '/' },
    { icon: Library, label: 'Библиотека', path: '/library' },
    { icon: Heart, label: 'Любимые', path: '/liked' },
    { icon: ListMusic, label: 'Плейлисты', path: '/playlists' },
    { icon: User, label: 'Профиль', path: '/profile' },
  ];

  return (
    <div
      className={cn(
        'bg-sidebar fixed left-0 top-0 h-full transition-all duration-300 flex flex-col text-sidebar-foreground z-10',
        isCollapsed ? 'w-16' : 'w-52'
      )}
    >
      <div className="p-3 flex items-center">
        <Music className="h-6 w-6 text-music-primary" />
        {!isCollapsed && <span className="ml-2 text-lg font-bold">FGMbot</span>}
      </div>

      <div className="border-b border-sidebar-border opacity-50 my-2"></div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1 p-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path}>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    location.pathname === item.path &&
                      'bg-sidebar-accent text-sidebar-accent-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-3">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <Music className="h-4 w-4" /> : 'Свернуть'}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
