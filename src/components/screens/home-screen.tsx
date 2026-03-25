
"use client";

import React from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Bell, ShieldAlert, Loader2, ExternalLink, Play, Camera, ShieldCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CV</span>
          </div>
          <h2 className="text-xl font-headline font-bold text-primary">ChannelVista</h2>
        </div>
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
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-destructive">Top Rank Channel Live</span>
                </div>
                <Badge variant="outline" className="text-[9px] border-primary text-primary">Malik Control</Badge>
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

          {/* STRICT CONTENT POLICY ALERT */}
          <Alert className="bg-destructive/5 border-destructive/20 rounded-2xl border-2 shadow-sm">
            <ShieldAlert className="h-5 w-5 text-destructive" />
            <AlertTitle className="text-destructive font-bold text-sm">Strict Content Policy</AlertTitle>
            <AlertDescription className="text-[11px] leading-relaxed font-medium text-muted-foreground mt-1">
              <p className="mb-2">⚠️ <strong>Original Photos Only:</strong> Only upload photos taken by your mobile camera. </p>
              <p className="text-destructive font-bold">Downloaded images, Google/Pinterest photos, or YouTube screenshots are FORBIDDEN.</p>
              <div className="mt-3 p-2 bg-white rounded-lg border border-destructive/10">
                <p className="text-[9px] font-bold text-muted-foreground uppercase">Violation Result: Account Delete + No Payout</p>
              </div>
            </AlertDescription>
          </Alert>

          {/* Social Policy */}
          <Alert className="bg-primary/5 border-primary/20 rounded-2xl border-2 shadow-sm">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <AlertTitle className="text-primary font-bold text-sm">Follow For Notifications</AlertTitle>
            <AlertDescription className="text-[11px] leading-relaxed font-medium text-muted-foreground mt-1">
              Join our official channels for real-time monetization alerts and updates.
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
              <p className="mt-4 text-sm text-muted-foreground">Refreshing your vision...</p>
            </div>
          ) : posts && posts.length > 0 ? (
            posts.map((post, index) => (
              <React.Fragment key={post.id}>
                <div className="bg-card rounded-[2rem] border border-border overflow-hidden shadow-lg transition-all hover:shadow-2xl">
                  {/* Card Header */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10 ring-2 ring-primary/20 ring-offset-2">
                        <AvatarImage src={post.userAvatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {post.username?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold text-sm flex items-center gap-1">
                          @{post.username || 'anonymous'}
                          <Camera className="w-3 h-3 text-muted-foreground opacity-50" />
                        </h3>
                        <p className="text-[10px] text-muted-foreground font-medium">
                          {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Just now'}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Photo Container */}
                  <div className="relative aspect-[9/16] w-full bg-muted overflow-hidden">
                    <Image 
                      src={post.photoUrl} 
                      alt={post.caption}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 640px"
                      priority={index < 2}
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-black/50 backdrop-blur-md text-[9px] border-none font-bold uppercase tracking-widest">
                        Original Vision
                      </Badge>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <button 
                          onClick={() => handleLike(post.id)}
                          className="group flex flex-col items-center space-y-1 transition-all active:scale-125"
                        >
                          <Heart className="w-7 h-7 text-foreground group-hover:fill-destructive group-hover:text-destructive transition-colors" />
                          <span className="text-[10px] font-black">{post.likesCount || 0}</span>
                        </button>
                        <button className="group flex flex-col items-center space-y-1 transition-colors hover:text-accent">
                          <MessageCircle className="w-7 h-7 group-hover:fill-accent/20" />
                          <span className="text-[10px] font-black">{post.commentsCount || 0}</span>
                        </button>
                        <button className="group flex flex-col items-center space-y-1 transition-colors hover:text-primary">
                          <Share2 className="w-7 h-7" />
                          <span className="text-[10px] font-black">Share</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 bg-muted/30 p-3 rounded-2xl border border-border/50">
                      <p className="text-sm leading-relaxed">
                        <span className="font-black mr-2 text-primary">@{post.username || 'user'}</span>
                        {post.caption}
                      </p>
                    </div>
                  </div>
                </div>

                {/* AdSense Placement */}
                {(index + 1) % 3 === 0 && (
                  <Card className="p-4 border-dashed border-2 border-primary/20 flex flex-col items-center justify-center bg-primary/5 h-48 rounded-[2rem] shadow-inner">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                      <Play className="w-5 h-5 text-primary opacity-50" />
                    </div>
                    <p className="text-[10px] text-primary/60 font-black uppercase tracking-[0.2em]">Google AdSense Space</p>
                    <p className="text-[9px] text-muted-foreground mt-2 font-medium">Supporting Visual Storytellers</p>
                  </Card>
                )}
              </React.Fragment>
            ))
          ) : (
            <div className="py-24 text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-bold text-lg">Your Feed is Empty</p>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">Be the first to share an original vision with the world.</p>
            </div>
          )}
          
          <div className="h-24 flex items-center justify-center">
            <p className="text-[10px] text-muted-foreground font-black italic tracking-[0.3em] uppercase">Visual Infinity</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
