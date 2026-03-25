"use client";

import React, { useState, useEffect } from 'react';
import { AppScreen, User, Post } from '@/lib/types';
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

const MOCK_USER: User = {
  id: 'current-user',
  username: 'aditya_pro',
  displayName: 'Aditya Pro',
  bio: 'Photographer & Visionary | Sharing my perspective 📸',
  avatarUrl: PlaceHolderImages.find(img => img.id === 'avatar-1')?.imageUrl || '',
  followerCount: 4850,
  followingCount: 120,
  isMonetized: false,
  isAdmin: true, // Dev admin
};

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
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('HOME');
  const [currentUser, setCurrentUser] = useState<User | null>(MOCK_USER);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Simulated screen transitions
  const renderScreen = () => {
    switch (currentScreen) {
      case 'HOME':
        return <HomeScreen posts={posts} />;
      case 'UPLOAD':
        return <UploadScreen onPostCreated={(newPost) => setPosts([newPost, ...posts])} onNavigate={setCurrentScreen} />;
      case 'PROFILE':
        return <ProfileScreen user={currentUser} posts={posts.filter(p => p.userId === currentUser?.id)} />;
      case 'DASHBOARD':
        return <DashboardScreen user={currentUser} />;
      case 'ADMIN':
        return <AdminScreen />;
      default:
        return <HomeScreen posts={posts} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar 
          currentScreen={currentScreen} 
          setScreen={setCurrentScreen} 
          user={currentUser} 
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 pb-16 md:pb-0 relative overflow-hidden flex flex-col items-center">
        <div className="w-full max-w-2xl h-full flex flex-col bg-card/50 md:shadow-xl md:my-4 md:rounded-3xl md:border overflow-hidden">
          {renderScreen()}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden">
        <BottomNav 
          currentScreen={currentScreen} 
          setScreen={setCurrentScreen} 
          user={currentUser}
        />
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <Toaster />
    </div>
  );
}