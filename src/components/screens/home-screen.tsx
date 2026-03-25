"use client";

import React from 'react';
import { Post } from '@/lib/types';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';

interface HomeScreenProps {
  posts: Post[];
}

export function HomeScreen({ posts }: HomeScreenProps) {
  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-10 flex justify-between items-center">
        <h2 className="text-xl font-headline font-bold">Feed</h2>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="flex flex-col space-y-6 py-4 px-2 sm:px-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm transition-transform duration-300">
              {/* Post Header */}
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                    <AvatarImage src={post.userAvatar} />
                    <AvatarFallback>{post.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-sm">@{post.username}</h3>
                    <p className="text-[10px] text-muted-foreground font-medium">{post.timestamp}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              {/* Post Image (9:16 Aspect) */}
              <div className="relative aspect-9-16 w-full bg-muted overflow-hidden">
                <Image 
                  src={post.imageUrl} 
                  alt={post.caption}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 640px"
                  data-ai-hint="social post"
                />
              </div>

              {/* Interaction Bar */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button className="group flex items-center space-x-1.5 transition-colors hover:text-primary">
                      <Heart className="w-6 h-6 group-hover:fill-primary/20" />
                      <span className="text-sm font-semibold">{post.likes}</span>
                    </button>
                    <button className="group flex items-center space-x-1.5 transition-colors hover:text-accent">
                      <MessageCircle className="w-6 h-6 group-hover:fill-accent/20" />
                      <span className="text-sm font-semibold">{post.comments}</span>
                    </button>
                  </div>
                  <button className="transition-colors hover:text-primary">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
                
                <p className="text-sm leading-relaxed">
                  <span className="font-bold mr-2 text-primary">@{post.username}</span>
                  {post.caption}
                </p>
              </div>
            </div>
          ))}
          
          <div className="h-10 flex items-center justify-center">
            <p className="text-xs text-muted-foreground font-medium italic">You're all caught up ✨</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}