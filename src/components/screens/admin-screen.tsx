"use client";

import React from 'react';
import { ShieldAlert, Trash2, Ban, Users, MessageSquare, ExternalLink, Video } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export function AdminScreen() {
  const flaggedPosts = [
    { id: 'f1', user: 'bot_test', reason: 'Possible spam', date: '10m ago', content: 'Follow me for free money! Link in bio...' },
    { id: 'f2', user: 'unoriginal_01', reason: 'Likely copyrighted', date: '1h ago', content: 'Found this cool wallpaper on Google.' },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="p-4 border-b border-border bg-card flex justify-between items-center sticky top-0 z-10">
        <h2 className="text-xl font-headline font-bold flex items-center">
          <ShieldAlert className="w-6 h-6 mr-2 text-primary" />
          Admin Control Center
        </h2>
        <Badge variant="outline" className="font-bold border-primary text-primary">Master Admin</Badge>
      </header>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Admin Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 flex flex-col items-center justify-center space-y-2 text-center hover:bg-muted/50 cursor-pointer transition-colors rounded-2xl border-border">
              <Video className="w-6 h-6 text-primary" />
              <span className="text-xs font-bold">Live Stream</span>
            </Card>
            <Card className="p-4 flex flex-col items-center justify-center space-y-2 text-center hover:bg-muted/50 cursor-pointer transition-colors rounded-2xl border-border">
              <Users className="w-6 h-6 text-accent" />
              <span className="text-xs font-bold">User Mgmt</span>
            </Card>
            <Card className="p-4 flex flex-col items-center justify-center space-y-2 text-center hover:bg-muted/50 cursor-pointer transition-colors rounded-2xl border-border">
              <Trash2 className="w-6 h-6 text-destructive" />
              <span className="text-xs font-bold">Cleanup</span>
            </Card>
            <Card className="p-4 flex flex-col items-center justify-center space-y-2 text-center hover:bg-muted/50 cursor-pointer transition-colors rounded-2xl border-border">
              <ExternalLink className="w-6 h-6 text-muted-foreground" />
              <span className="text-xs font-bold">Settings</span>
            </Card>
          </div>

          {/* Moderate Posts Table */}
          <Card className="rounded-2xl shadow-sm border-border overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-headline font-bold">Moderation Queue</CardTitle>
              <CardDescription>AI Flagged or User Reported content</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-bold">User</TableHead>
                    <TableHead className="font-bold">Flag</TableHead>
                    <TableHead className="font-bold hidden sm:table-cell">Details</TableHead>
                    <TableHead className="text-right font-bold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flaggedPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">@{post.user}</TableCell>
                      <TableCell>
                        <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 text-[10px]">{post.reason}</Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <p className="text-xs text-muted-foreground truncate max-w-[150px] italic">"{post.content}"</p>
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

          {/* System Performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="rounded-2xl border-border p-5 space-y-4">
              <h3 className="font-bold text-sm flex items-center">
                <Video className="w-4 h-4 mr-2 text-primary" />
                Live Video Embed
              </h3>
              <div className="aspect-video bg-muted rounded-xl flex items-center justify-center border-2 border-dashed border-border group overflow-hidden relative">
                <div className="text-center space-y-2">
                   <Video className="w-8 h-8 text-muted-foreground mx-auto" />
                   <p className="text-xs text-muted-foreground font-medium">Embed YouTube Live URL</p>
                   <Button size="sm" variant="outline" className="rounded-full">Update Link</Button>
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl border-border p-5 space-y-4">
              <h3 className="font-bold text-sm flex items-center">
                <MessageSquare className="w-4 h-4 mr-2 text-accent" />
                Announcement
              </h3>
              <div className="space-y-3">
                <textarea 
                  className="w-full bg-muted border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-accent resize-none h-24"
                  placeholder="Push to WhatsApp/Telegram Channel..."
                ></textarea>
                <Button size="sm" className="w-full rounded-xl bg-accent hover:bg-accent/90">Send to all users</Button>
              </div>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}