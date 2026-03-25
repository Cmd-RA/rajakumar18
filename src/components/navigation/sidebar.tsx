"use client";

import React from 'react';
import { Home, PlusSquare, User, LayoutDashboard, ShieldAlert, LogOut, Settings } from 'lucide-react';
import { AppScreen, User as UserType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SidebarProps {
  currentScreen: AppScreen;
  setScreen: (screen: AppScreen) => void;
  user: UserType | null;
}

export function Sidebar({ currentScreen, setScreen, user }: SidebarProps) {
  const navItems = [
    { id: 'HOME' as AppScreen, icon: Home, label: 'Home' },
    { id: 'UPLOAD' as AppScreen, icon: PlusSquare, label: 'Create Post' },
    { id: 'DASHBOARD' as AppScreen, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'PROFILE' as AppScreen, icon: User, label: 'Channel Profile' },
  ];

  if (user?.isAdmin) {
    navItems.push({ id: 'ADMIN' as AppScreen, icon: ShieldAlert, label: 'Admin Panel' });
  }

  return (
    <aside className="h-screen w-64 bg-card border-r border-border flex flex-col p-6 space-y-8 sticky top-0">
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="text-primary-foreground font-headline font-bold text-xl">CV</span>
        </div>
        <h1 className="text-2xl font-headline font-bold tracking-tight text-primary">ChannelVista</h1>
      </div>

      <nav className="flex-1 flex flex-col space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "stroke-[2.5px]" : "stroke-[1.5px]")} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-border space-y-4">
        {user && (
          <div className="flex items-center space-x-3 px-2">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarImage src={user.avatarUrl} alt={user.username} />
              <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold truncate max-w-[120px]">{user.displayName}</span>
              <span className="text-xs text-muted-foreground">@{user.username}</span>
            </div>
          </div>
        )}
        <button className="flex items-center space-x-3 px-4 py-2 w-full text-muted-foreground hover:text-destructive transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  );
}