"use client";

import React, { useState, useEffect } from 'react';
import { AppScreen } from '@/lib/types';
import { BottomNav } from '@/components/navigation/bottom-nav';
import { Sidebar } from '@/components/navigation/sidebar';
import { HomeScreen } from '@/components/screens/home-screen';
import { UploadScreen } from '@/components/screens/upload-screen';
import { ProfileScreen } from '@/components/screens/profile-screen';
import { DashboardScreen } from '@/components/screens/dashboard-screen';
import { AdminScreen } from '@/components/screens/admin-screen';
import { PolicyScreen } from '@/components/screens/policy-screen';
import { AuthModal } from '@/components/auth/auth-modal';
import { Toaster } from '@/components/ui/toaster';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';

const ADMIN_EMAIL = 'rajahribabakumar@gmail.com';

export default function AppContainer() {
  const { user, isUserLoading } = useUser();
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('HOME');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Close auth modal when user signs in
  useEffect(() => {
    if (user) {
      setIsAuthModalOpen(false);
    }
  }, [user]);

  // Handle protected screens
  useEffect(() => {
    if (!user && (currentScreen === 'UPLOAD' || currentScreen === 'DASHBOARD' || currentScreen === 'ADMIN')) {
      setIsAuthModalOpen(true);
      setCurrentScreen('HOME');
    }
  }, [user, currentScreen]);

  const isAdmin = user?.email === ADMIN_EMAIL;
  
  const appUser = user ? {
    id: user.uid,
    username: user.email?.split('@')[0] || 'user',
    displayName: user.displayName || user.email?.split('@')[0] || 'User',
    bio: 'Visual Storyteller',
    avatarUrl: user.photoURL || `https://picsum.photos/seed/${user.uid}/200/200`,
    followerCount: isAdmin ? 15000 : 420,
    followingCount: 150,
    isMonetized: isAdmin,
    isAdmin: isAdmin,
  } : null;

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'HOME':
        return <HomeScreen />;
      case 'UPLOAD':
        return <UploadScreen onPostCreated={() => setCurrentScreen('HOME')} onNavigate={setCurrentScreen} />;
      case 'PROFILE':
        return <ProfileScreen user={appUser} onNavigate={setCurrentScreen} />;
      case 'DASHBOARD':
        return <DashboardScreen user={appUser} />;
      case 'ADMIN':
        return <AdminScreen />;
      case 'POLICIES':
        return <PolicyScreen onBack={() => setCurrentScreen('HOME')} />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      <div className="hidden md:block">
        <Sidebar 
          currentScreen={currentScreen} 
          setScreen={setCurrentScreen} 
          user={appUser} 
        />
      </div>

      <main className="flex-1 pb-16 md:pb-0 relative overflow-hidden flex flex-col items-center">
        <div className="w-full max-w-2xl h-full flex flex-col bg-card/50 md:shadow-xl md:my-4 md:rounded-3xl md:border overflow-hidden">
          {renderScreen()}
        </div>
      </main>

      <div className="md:hidden">
        <BottomNav 
          currentScreen={currentScreen} 
          setScreen={setCurrentScreen} 
          user={appUser}
        />
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <Toaster />
    </div>
  );
}
