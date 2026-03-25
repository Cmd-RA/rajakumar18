"use client";

import React from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Bell, ShieldAlert, Loader2, ExternalLink, Play, Camera, ShieldCheck, Info } from 'lucide-react';
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

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
      return url;
    }
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0`;
    }
    return url;
  };

  const embedUrl = getEmbedUrl(config?.liveVideoUrl || '');

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="p-4 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-10 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white font-black text-lg italic">CV</span>
          </div>
          <div>
            <h2 className="text-xl font-headline font-black tracking-tighter text-primary">ChannelVista</h2>
            <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Malik Premium</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="secondary" size="icon" className="rounded-2xl shadow-sm relative group active:scale-95 transition-transform">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-destructive border-2 border-card rounded-full"></span>
          </Button>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="flex flex-col space-y-8 py-6 px-3 sm:px-6">
          
          {/* Main Action Header - Button Style */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white p-4 rounded-[1.5rem] shadow-xl shadow-green-500/20 transition-all active:scale-95 font-black text-xs uppercase tracking-tighter">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </button>
            <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-[1.5rem] shadow-xl shadow-blue-500/20 transition-all active:scale-95 font-black text-xs uppercase tracking-tighter">
              <ExternalLink className="w-4 h-4" /> Telegram
            </button>
          </div>

          {/* Top Rank Live Player */}
          {embedUrl && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-destructive rounded-full animate-pulse shadow-lg shadow-destructive/50" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-destructive">Live Vision Channel</span>
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">Master Live</Badge>
              </div>
              <Card className="overflow-hidden rounded-[2.5rem] border-4 border-primary/10 shadow-2xl shadow-primary/10 bg-black aspect-video relative group">
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </Card>
            </div>
          )}

          {/* POLICY ALERT - BIG AND BOLD */}
          <div className="bg-destructive/10 border-2 border-destructive/20 p-6 rounded-[2.5rem] shadow-xl shadow-destructive/5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-destructive/20 rounded-full flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="font-headline font-black text-destructive uppercase tracking-tighter text-xl">Policy Update</h3>
            </div>
            <p className="text-xs font-bold leading-relaxed text-destructive/80">
              Only original photos captured by your mobile camera are allowed. Copyright violations result in permanent bans.
            </p>
            <button className="w-full bg-destructive text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-destructive/20 active:scale-95 transition-all">
              Read Strict Rules
            </button>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
              <p className="font-black text-sm text-primary uppercase tracking-widest">Loading Vision...</p>
            </div>
          ) : posts && posts.length > 0 ? (
            posts.map((post, index) => (
              <React.Fragment key={post.id}>
                <div className="bg-card rounded-[3rem] border border-border overflow-hidden shadow-2xl transition-all hover:-translate-y-1">
                  <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-1 rounded-full bg-gradient-to-tr from-primary to-accent">
                        <Avatar className="h-12 w-12 border-4 border-card">
                          <AvatarImage src={post.userAvatar} />
                          <AvatarFallback className="bg-primary/10 text-primary font-black">
                            {post.username?.[0]?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <h3 className="font-black text-sm flex items-center gap-1 group cursor-pointer">
                          @{post.username || 'anonymous'}
                          <Camera className="w-3 h-3 text-primary group-hover:scale-110 transition-transform" />
                        </h3>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">
                          {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Just now'}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
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
                    <div className="absolute top-6 left-6">
                      <Badge className="bg-black/60 backdrop-blur-xl text-[9px] border-white/20 px-4 py-2 rounded-full font-black uppercase tracking-[0.2em] shadow-xl">
                        Original Vision
                      </Badge>
                    </div>
                  </div>

                  <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-8">
                        <button 
                          onClick={() => handleLike(post.id)}
                          className="flex flex-col items-center group active:scale-150 transition-all"
                        >
                          <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-destructive/10 transition-colors">
                            <Heart className="w-8 h-8 group-hover:fill-destructive group-hover:text-destructive transition-colors" />
                          </div>
                          <span className="text-[10px] font-black mt-1">{post.likesCount || 0}</span>
                        </button>
                        <button className="flex flex-col items-center group active:scale-125 transition-all">
                          <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                            <MessageCircle className="w-8 h-8 group-hover:fill-accent group-hover:text-accent transition-colors" />
                          </div>
                          <span className="text-[10px] font-black mt-1">{post.commentsCount || 0}</span>
                        </button>
                        <button className="flex flex-col items-center group active:scale-125 transition-all">
                          <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <Share2 className="w-8 h-8 group-hover:text-primary transition-colors" />
                          </div>
                          <span className="text-[10px] font-black mt-1">Share</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-muted/30 p-5 rounded-[2rem] border border-border/50 shadow-inner">
                      <p className="text-sm leading-relaxed font-medium">
                        <span className="font-black mr-2 text-primary">@{post.username || 'user'}</span>
                        {post.caption}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ADSENSE PLACEHOLDER - BUTTON STYLE LINK */}
                {(index + 1) % 3 === 0 && (
                  <button className="w-full p-8 border-dashed border-4 border-primary/20 flex flex-col items-center justify-center bg-primary/5 rounded-[3rem] shadow-inner active:scale-95 transition-all">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Info className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-[12px] text-primary/80 font-black uppercase tracking-[0.3em]">AdSense Placement</p>
                    <p className="text-[10px] text-muted-foreground mt-2 font-bold italic">Support Your Local Storytellers</p>
                  </button>
                )}
              </React.Fragment>
            ))
          ) : (
            <div className="py-32 text-center space-y-6">
              <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Camera className="w-12 h-12 text-muted-foreground/50" />
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground font-black text-2xl uppercase tracking-tighter">Empty Feed</p>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto font-medium">Be the first to capture an original vision.</p>
              </div>
              <Button size="lg" className="rounded-2xl px-12 h-14 font-black uppercase tracking-widest shadow-xl shadow-primary/20">Create First Post</Button>
            </div>
          )}
          
          <div className="h-32 flex items-center justify-center">
            <div className="flex items-center gap-4 text-muted-foreground/20">
              <div className="h-px w-12 bg-current" />
              <p className="text-[10px] font-black italic tracking-[0.5em] uppercase">Visual Infinity</p>
              <div className="h-px w-12 bg-current" />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
