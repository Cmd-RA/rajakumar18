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
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border flex justify-around items-center h-20 pb-4 px-2 z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentScreen === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setScreen(item.id)}
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 w-16 h-16",
              isActive 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 -translate-y-2" 
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <Icon className={cn("w-6 h-6 mb-1", isActive ? "stroke-[3px]" : "stroke-[1.5px]")} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
