"use client";

import React, { useState, useEffect } from 'react';
import { AppScreen, Post } from '@/lib/types';
import { BottomNav } from '@/components/navigation/bottom-nav';
import { Sidebar } from '@/components/navigation/sidebar';
import { HomeScreen } from '@/components/screens/home-screen';
import { UploadScreen } from '@/components/screens/upload-screen';
import { ProfileScreen } from '@/components/screens/profile-screen';
import { DashboardScreen } from '@/components/screens/dashboard-screen';
import { AdminScreen } from '@/components/screens/admin-screen';
import { AuthModal } from '@/components/auth/auth-modal';
import { Toaster } from '@/components/ui/toaster';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';

const ADMIN_EMAIL = 'rajahribabakumar@gmail.com';

const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    userId: 'user-2',
    username: 'travel_soul',
    userAvatar: PlaceHolderImages.find(img => img.id === 'avatar-2')?.imageUrl || '',
    imageUrl: PlaceHolderImages[0].imageUrl,
    caption: 'Chasing the perfect sunset in the valley. #nature #vibes',
    likes: 245,
    comments: 18,
    timestamp: '2h ago',
  },
  {
    id: 'post-2',
    userId: 'user-3',
    username: 'urban_explorer',
    userAvatar: PlaceHolderImages.find(img => img.id === 'avatar-3')?.imageUrl || '',
    imageUrl: PlaceHolderImages[1].imageUrl,
    caption: 'City lights and late nights. Architecture here is insane.',
    likes: 120,
    comments: 5,
    timestamp: '5h ago',
  },
];

export default function AppContainer() {
  const { user, isUserLoading } = useUser();
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('HOME');
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
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

  // Transfrom Firebase User to App User type
  const isAdmin = user?.email === ADMIN_EMAIL;
  
  const appUser = user ? {
    id: user.uid,
    username: user.email?.split('@')[0] || 'user',
    displayName: user.displayName || user.email?.split('@')[0] || 'User',
    bio: 'Visual Storyteller',
    avatarUrl: user.photoURL || `https://picsum.photos/seed/${user.uid}/200/200`,
    followerCount: isAdmin ? 15000 : 420, // Mock stats for demo
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
        return <HomeScreen posts={posts} />;
      case 'UPLOAD':
        return <UploadScreen onPostCreated={(newPost) => setPosts([newPost, ...posts])} onNavigate={setCurrentScreen} />;
      case 'PROFILE':
        return <ProfileScreen user={appUser} posts={posts.filter(p => p.userId === user?.uid)} onNavigate={setCurrentScreen} />;
      case 'DASHBOARD':
        return <DashboardScreen user={appUser} />;
      case 'ADMIN':
        return <AdminScreen />;
      default:
        return <HomeScreen posts={posts} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
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

      {/* Bottom Nav for Mobile */}
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
