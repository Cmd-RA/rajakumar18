"use client";

import React from 'react';
import { Home, PlusSquare, User, LayoutDashboard, ShieldAlert } from 'lucide-react';
import { AppScreen, User as UserType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  currentScreen: AppScreen;
  setScreen: (screen: AppScreen) => void;
  user: UserType | null;
}

export function BottomNav({ currentScreen, setScreen, user }: BottomNavProps) {
  const navItems = [
    { id: 'HOME' as AppScreen, icon: Home, label: 'Home' },
    { id: 'UPLOAD' as AppScreen, icon: PlusSquare, label: 'Upload' },
    { id: 'DASHBOARD' as AppScreen, icon: LayoutDashboard, label: 'Stats' },
    { id: 'PROFILE' as AppScreen, icon: User, label: 'Profile' },
  ];

  if (user?.isAdmin) {
    navItems.push({ id: 'ADMIN' as AppScreen, icon: ShieldAlert, label: 'Admin' });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border flex justify-around items-center h-16 px-4 z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentScreen === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setScreen(item.id)}
            className={cn(
              "flex flex-col items-center justify-center space-y-1 transition-all duration-200",
              isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className={cn("w-6 h-6", isActive && "fill-primary/20")} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}