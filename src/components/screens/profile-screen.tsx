
"use client";

import React, { useState } from 'react';
import { User, AppScreen } from '@/lib/types';
import { Settings, Grid, Bookmark, Activity, MessageCircle, Send, Award, Info, Loader2, LifeBuoy } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { useCollection, useFirestore, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface ProfileScreenProps {
  user: User | null;
  onNavigate: (screen: AppScreen) => void;
}

export function ProfileScreen({ user, onNavigate }: ProfileScreenProps) {
  const { firestore } = useFirestore();
  const { toast } = useToast();
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [complaintMsg, setComplaintMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userPostsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'posts'),
      where('userId', '==', user.id),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, user]);

  const { data: posts, isLoading } = useCollection(userPostsQuery);

  if (!user) return null;

  const threshold = 5000;
  const isEligible = user.followerCount >= threshold;

  const handleSubmitComplaint = () => {
    if (!complaintMsg.trim() || !firestore) return;
    setIsSubmitting(true);
    
    addDocumentNonBlocking(collection(firestore, 'complaints'), {
      userId: user.id,
      username: user.username,
      message: complaintMsg,
      status: 'pending',
      createdAt: new Date().toISOString()
    }).then(() => {
      setIsSubmitting(false);
      setIsSupportOpen(false);
      setComplaintMsg('');
      toast({
        title: "Complaint Received",
        description: "Our team will review your message soon.",
      });
    });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="p-4 border-b border-border bg-card flex justify-between items-center sticky top-0 z-10">
        <h2 className="text-xl font-headline font-bold">Channel Profile</h2>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="w-5 h-5" />
        </Button>
      </header>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          <Alert className="bg-primary/10 border-primary/20 rounded-2xl">
            <Info className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary font-bold">Important Notification</AlertTitle>
            <AlertDescription className="text-xs font-medium">
              Join our channels to get instant updates about monetization and live streams.
              <div className="flex space-x-4 mt-3">
                <a href="https://whatsapp.com/channel/0029VbCRhwmJkK7DNy58uY0S" target="_blank" className="flex items-center text-green-600 font-bold hover:underline">
                  <MessageCircle className="w-4 h-4 mr-1" /> WhatsApp
                </a>
                <a href="https://t.me/rufnddjdjf" target="_blank" className="flex items-center text-blue-600 font-bold hover:underline">
                  <Send className="w-4 h-4 mr-1" /> Telegram
                </a>
              </div>
            </AlertDescription>
          </Alert>

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
              <div className="flex items-center justify-center space-x-2">
                <h1 className="text-2xl font-headline font-bold">{user.displayName}</h1>
                {isEligible && <Award className="w-5 h-5 text-yellow-500" />}
              </div>
              <p className="text-muted-foreground font-medium">@{user.username}</p>
            </div>

            <p className="max-w-xs text-sm leading-relaxed font-medium">
              {user.bio}
            </p>

            <div className="flex w-full max-w-md justify-around py-4 bg-card rounded-2xl border border-border shadow-sm">
              <div className="text-center group cursor-pointer">
                <p className="text-xl font-headline font-bold text-primary">{posts?.length || 0}</p>
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
              <Button 
                onClick={() => onNavigate('DASHBOARD')}
                className="flex-1 rounded-xl bg-primary shadow-lg shadow-primary/20"
              >
                Dashboard
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 rounded-xl border-primary/20 flex items-center gap-2"
                onClick={() => setIsSupportOpen(true)}
              >
                <LifeBuoy className="w-4 h-4" /> Support
              </Button>
            </div>
          </div>

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
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : posts && posts.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {posts.map((post) => (
                    <div key={post.id} className="aspect-9-16 relative bg-muted rounded-lg overflow-hidden group">
                      <Image 
                        src={post.photoUrl || post.imageUrl} 
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

      <Dialog open={isSupportOpen} onOpenChange={setIsSupportOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-headline font-bold">Contact Customer Support</DialogTitle>
            <DialogDescription className="font-medium">
              Having issues with your account or monetization? Send us a message and the Malik team will assist you.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea 
              placeholder="Describe your problem or feedback..." 
              className="min-h-[150px] rounded-2xl p-4 bg-muted/20"
              value={complaintMsg}
              onChange={(e) => setComplaintMsg(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button 
              className="w-full rounded-xl py-6 font-bold" 
              onClick={handleSubmitComplaint}
              disabled={isSubmitting || !complaintMsg.trim()}
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Submit Complaint
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
