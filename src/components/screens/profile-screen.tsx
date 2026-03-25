"use client";

import React from 'react';
import { User, Post } from '@/lib/types';
import { Settings, Grid, Bookmark, Users, Activity } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';

interface ProfileScreenProps {
  user: User | null;
  posts: Post[];
}

export function ProfileScreen({ user, posts }: ProfileScreenProps) {
  if (!user) return null;

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="p-4 border-b border-border bg-card flex justify-between items-center sticky top-0 z-10">
        <h2 className="text-xl font-headline font-bold">Channel</h2>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="w-5 h-5" />
        </Button>
      </header>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* User Info Header */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <Avatar className="h-28 w-28 ring-4 ring-primary/20 ring-offset-4 ring-offset-background">
                <AvatarImage src={user.avatarUrl} alt={user.username} />
                <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              {user.isAdmin && (
                <div className="absolute -bottom-1 -right-1 bg-accent text-white p-1 rounded-full border-4 border-background">
                  <Activity className="w-4 h-4" />
                </div>
              )}
            </div>
            
            <div className="space-y-1">
              <h1 className="text-2xl font-headline font-bold">{user.displayName}</h1>
              <p className="text-muted-foreground font-medium">@{user.username}</p>
            </div>

            <p className="max-w-xs text-sm leading-relaxed font-medium">
              {user.bio}
            </p>

            <div className="flex w-full max-w-md justify-around py-4 bg-card rounded-2xl border border-border shadow-sm">
              <div className="text-center group cursor-pointer">
                <p className="text-xl font-headline font-bold text-primary">{posts.length}</p>
                <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Posts</p>
              </div>
              <div className="text-center group cursor-pointer">
                <p className="text-xl font-headline font-bold text-primary">{user.followerCount.toLocaleString()}</p>
                <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Followers</p>
              </div>
              <div className="text-center group cursor-pointer">
                <p className="text-xl font-headline font-bold text-primary">{user.followingCount.toLocaleString()}</p>
                <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Following</p>
              </div>
            </div>

            <div className="flex w-full space-x-3">
              <Button className="flex-1 rounded-xl bg-primary shadow-lg shadow-primary/20">Edit Profile</Button>
              <Button variant="outline" className="flex-1 rounded-xl border-primary/20">Share Channel</Button>
            </div>
          </div>

          {/* Posts Grid */}
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted rounded-xl p-1 h-12">
              <TabsTrigger value="posts" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Grid className="w-4 h-4 mr-2" />
                Posts
              </TabsTrigger>
              <TabsTrigger value="saved" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Bookmark className="w-4 h-4 mr-2" />
                Saved
              </TabsTrigger>
            </TabsList>
            <TabsContent value="posts" className="pt-4">
              {posts.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {posts.map((post) => (
                    <div key={post.id} className="aspect-9-16 relative bg-muted rounded-lg overflow-hidden group">
                      <Image 
                        src={post.imageUrl} 
                        alt={post.caption} 
                        fill 
                        className="object-cover transition-transform group-hover:scale-105" 
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto opacity-50">
                    <Grid className="w-8 h-8" />
                  </div>
                  <p className="text-muted-foreground font-medium">No posts yet. Start sharing!</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="saved" className="pt-4 text-center py-20">
              <p className="text-muted-foreground font-medium">No saved posts found.</p>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}