"use client";

import React from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Bell, ShieldAlert, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';
import { useCollection, useFirestore, useUser, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, doc, increment } from 'firebase/firestore';

export function HomeScreen() {
  const { firestore } = useFirestore();
  const { user } = useUser();

  const postsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'posts'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: posts, isLoading } = useCollection(postsQuery);

  const handleLike = (postId: string) => {
    if (!user || !firestore) return;
    const postRef = doc(firestore, 'posts', postId);
    updateDocumentNonBlocking(postRef, {
      likesCount: increment(1)
    });
  };

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-10 flex justify-between items-center">
        <h2 className="text-xl font-headline font-bold text-primary">ChannelVista Feed</h2>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="flex flex-col space-y-4 py-4 px-2 sm:px-4">
          
          <Alert className="bg-destructive/5 border-destructive/20 rounded-2xl border-2">
            <ShieldAlert className="h-5 w-5 text-destructive" />
            <AlertTitle className="text-destructive font-bold text-sm">Policy Requirement</AlertTitle>
            <AlertDescription className="text-[11px] leading-relaxed font-medium text-muted-foreground mt-1">
              To receive monetization updates and important notifications, you MUST follow our official channels.
              <div className="flex gap-2 mt-2">
                <a 
                  href="https://whatsapp.com/channel/0029VbCRhwmJkK7DNy58uY0S" 
                  target="_blank" 
                  className="flex-1 bg-green-600 text-white p-2 rounded-lg text-center font-bold text-[10px] hover:bg-green-700 transition-colors"
                >
                  Join WhatsApp
                </a>
                <a 
                  href="https://t.me/rufnddjdjf" 
                  target="_blank" 
                  className="flex-1 bg-blue-600 text-white p-2 rounded-lg text-center font-bold text-[10px] hover:bg-blue-700 transition-colors"
                >
                  Join Telegram
                </a>
              </div>
            </AlertDescription>
          </Alert>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="mt-4 text-sm text-muted-foreground">Loading latest visions...</p>
            </div>
          ) : posts && posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm transition-transform duration-300">
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                      <AvatarImage src={post.userAvatar || `https://picsum.photos/seed/${post.userId}/200/200`} />
                      <AvatarFallback>{post.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-sm">@{post.username || 'anonymous'}</h3>
                      <p className="text-[10px] text-muted-foreground font-medium">
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Just now'}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                <div className="relative aspect-9-16 w-full bg-muted overflow-hidden">
                  <Image 
                    src={post.photoUrl || post.imageUrl} 
                    alt={post.caption}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 640px"
                    data-ai-hint="social post"
                  />
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className="group flex items-center space-x-1.5 transition-colors hover:text-primary"
                      >
                        <Heart className="w-6 h-6 group-hover:fill-primary/20" />
                        <span className="text-sm font-semibold">{post.likesCount || 0}</span>
                      </button>
                      <button className="group flex items-center space-x-1.5 transition-colors hover:text-accent">
                        <MessageCircle className="w-6 h-6 group-hover:fill-accent/20" />
                        <span className="text-sm font-semibold">{post.commentsCount || 0}</span>
                      </button>
                    </div>
                    <button className="transition-colors hover:text-primary">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <p className="text-sm leading-relaxed">
                    <span className="font-bold mr-2 text-primary">@{post.username || 'user'}</span>
                    {post.caption}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center">
              <p className="text-muted-foreground">No posts yet. Be the first to share your vision!</p>
            </div>
          )}
          
          <div className="h-10 flex items-center justify-center">
            <p className="text-xs text-muted-foreground font-medium italic">You're all caught up ✨</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
