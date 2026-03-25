
"use client";

import React from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Bell, ShieldAlert, Loader2, ExternalLink, Play } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { useCollection, useFirestore, useUser, useMemoFirebase, updateDocumentNonBlocking, useDoc } from '@/firebase';
import { collection, query, orderBy, doc, increment } from 'firebase/firestore';

export function HomeScreen() {
  const { firestore } = useFirestore();
  const { user } = useUser();

  // Fetch Site Config for Live Video
  const configRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'settings', 'site_config');
  }, [firestore]);
  const { data: config } = useDoc(configRef);

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

  // Helper to format YouTube link for embedding
  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
      return url; // Already an embed link
    }
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0`;
    }
    return url; // Return as is for other platforms
  };

  const embedUrl = getEmbedUrl(config?.liveVideoUrl || '');

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="p-4 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-10 flex justify-between items-center">
        <h2 className="text-xl font-headline font-bold text-primary">ChannelVista Feed</h2>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" className="rounded-full relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full"></span>
          </Button>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="flex flex-col space-y-6 py-4 px-2 sm:px-4">
          
          {/* Top Rank Live Player */}
          {embedUrl && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 px-2">
                <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-destructive">Live Channel Feature</span>
              </div>
              <Card className="overflow-hidden rounded-3xl border-2 border-primary/20 shadow-xl shadow-primary/5 bg-black aspect-video relative">
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </Card>
            </div>
          )}

          {/* Mandatory Social Policy */}
          <Alert className="bg-primary/5 border-primary/20 rounded-2xl border-2 shadow-sm">
            <ShieldAlert className="h-5 w-5 text-primary" />
            <AlertTitle className="text-primary font-bold text-sm">Policy Requirement</AlertTitle>
            <AlertDescription className="text-[11px] leading-relaxed font-medium text-muted-foreground mt-1">
              Join our official channels for real-time notifications, monetization alerts, and live stream updates.
              <div className="flex gap-2 mt-3">
                <a 
                  href="https://whatsapp.com/channel/0029VbCRhwmJkK7DNy58uY0S" 
                  target="_blank" 
                  className="flex-1 bg-green-600 text-white py-2 rounded-xl text-center font-bold text-[10px] hover:bg-green-700 transition-all flex items-center justify-center gap-1"
                >
                  WhatsApp <ExternalLink className="w-3 h-3" />
                </a>
                <a 
                  href="https://t.me/rufnddjdjf" 
                  target="_blank" 
                  className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-center font-bold text-[10px] hover:bg-blue-700 transition-all flex items-center justify-center gap-1"
                >
                  Telegram <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </AlertDescription>
          </Alert>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="mt-4 text-sm text-muted-foreground">Loading feed...</p>
            </div>
          ) : posts && posts.length > 0 ? (
            posts.map((post, index) => (
              <React.Fragment key={post.id}>
                <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-md transition-all hover:shadow-lg">
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                        <AvatarImage src={post.userAvatar} />
                        <AvatarFallback>{post.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-sm">@{post.username || 'anonymous'}</h3>
                        <p className="text-[10px] text-muted-foreground font-medium">
                          {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Just now'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="relative aspect-[9/16] w-full bg-muted overflow-hidden">
                    <Image 
                      src={post.photoUrl} 
                      alt={post.caption}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 640px"
                      priority={index < 2}
                    />
                  </div>

                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-5">
                        <button 
                          onClick={() => handleLike(post.id)}
                          className="group flex items-center space-x-1.5 transition-all active:scale-125"
                        >
                          <Heart className="w-6 h-6 group-hover:fill-destructive group-hover:text-destructive" />
                          <span className="text-sm font-bold">{post.likesCount || 0}</span>
                        </button>
                        <button className="group flex items-center space-x-1.5 transition-colors hover:text-accent">
                          <MessageCircle className="w-6 h-6 group-hover:fill-accent/20" />
                          <span className="text-sm font-bold">{post.commentsCount || 0}</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm leading-relaxed">
                        <span className="font-bold mr-2 text-primary">@{post.username || 'user'}</span>
                        {post.caption}
                      </p>
                    </div>
                  </div>
                </div>

                {/* AdSense Placement */}
                {(index + 1) % 3 === 0 && (
                  <Card className="p-2 border-dashed border-2 border-muted flex items-center justify-center bg-muted/20 h-40 rounded-2xl">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">AdSense Ad Unit</p>
                  </Card>
                )}
              </React.Fragment>
            ))
          ) : (
            <div className="py-20 text-center space-y-4">
              <p className="text-muted-foreground font-medium">No posts in the vision yet.</p>
            </div>
          )}
          
          <div className="h-20 flex items-center justify-center">
            <p className="text-xs text-muted-foreground font-bold italic tracking-wide">✨ Visual Infinity Reached ✨</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
