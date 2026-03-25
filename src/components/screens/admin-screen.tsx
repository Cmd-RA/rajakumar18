"use client";

import React, { useState } from 'react';
import { ShieldAlert, Trash2, Ban, Users, MessageSquare, ExternalLink, Video, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export function AdminScreen() {
  const [liveUrl, setLiveUrl] = useState('');
  const { toast } = useToast();

  const flaggedPosts = [
    { id: 'f1', user: 'bot_test', reason: 'Possible spam', date: '10m ago', content: 'Follow me for free money! Link in bio...' },
    { id: 'f2', user: 'unoriginal_01', reason: 'Likely copyrighted', date: '1h ago', content: 'Found this cool wallpaper on Google.' },
  ];

  const handleUpdateLive = () => {
    toast({ title: "Live Updated", description: "The YouTube embed has been set for all users." });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="p-4 border-b border-border bg-card flex justify-between items-center sticky top-0 z-10">
        <h2 className="text-xl font-headline font-bold flex items-center">
          <ShieldAlert className="w-6 h-6 mr-2 text-primary" />
          Master Admin Panel
        </h2>
        <Badge variant="outline" className="font-bold border-primary text-primary">rajahribabakumar@gmail.com</Badge>
      </header>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 rounded-2xl border-border bg-card">
              <p className="text-xs font-bold text-muted-foreground uppercase">Total Users</p>
              <p className="text-2xl font-headline font-bold text-primary">1.2K</p>
            </Card>
            <Card className="p-4 rounded-2xl border-border bg-card">
              <p className="text-xs font-bold text-muted-foreground uppercase">Daily Posts</p>
              <p className="text-2xl font-headline font-bold text-accent">85</p>
            </Card>
            <Card className="p-4 rounded-2xl border-border bg-card">
              <p className="text-xs font-bold text-muted-foreground uppercase">Revenue</p>
              <p className="text-2xl font-headline font-bold text-green-600">$420</p>
            </Card>
            <Card className="p-4 rounded-2xl border-border bg-card">
              <p className="text-xs font-bold text-muted-foreground uppercase">Reports</p>
              <p className="text-2xl font-headline font-bold text-destructive">12</p>
            </Card>
          </div>

          {/* Admin Live Controls */}
          <Card className="rounded-2xl border-border overflow-hidden">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-lg font-headline font-bold flex items-center">
                <Video className="w-5 h-5 mr-2 text-primary" />
                Live Video Manager
              </CardTitle>
              <CardDescription>Embed your YouTube live stream here</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex space-x-2">
                <Input 
                  placeholder="https://www.youtube.com/embed/..." 
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  className="rounded-xl"
                />
                <Button onClick={handleUpdateLive} className="rounded-xl">
                  <Save className="w-4 h-4 mr-2" /> Save
                </Button>
              </div>
              {liveUrl && (
                <div className="aspect-video bg-muted rounded-2xl overflow-hidden">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={liveUrl} 
                    title="Live Stream Preview"
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Moderation Queue */}
          <Card className="rounded-2xl shadow-sm border-border overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-headline font-bold">Moderation Queue</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-bold">User</TableHead>
                    <TableHead className="font-bold">Flag</TableHead>
                    <TableHead className="text-right font-bold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flaggedPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">@{post.user}</TableCell>
                      <TableCell>
                        <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">{post.reason}</Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                          <Ban className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Announcements */}
          <Card className="rounded-2xl border-border p-5 space-y-4">
            <h3 className="font-bold text-sm flex items-center">
              <MessageSquare className="w-4 h-4 mr-2 text-accent" />
              Global Announcement
            </h3>
            <div className="space-y-3">
              <textarea 
                className="w-full bg-muted border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-accent resize-none h-24"
                placeholder="Send message to all users..."
              ></textarea>
              <div className="flex space-x-2">
                <Button size="sm" className="flex-1 rounded-xl bg-green-600 hover:bg-green-700">Send WhatsApp</Button>
                <Button size="sm" className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700">Send Telegram</Button>
              </div>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
