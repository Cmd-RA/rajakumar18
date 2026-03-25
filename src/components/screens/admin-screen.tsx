"use client";

import React, { useState } from 'react';
import { ShieldAlert, Trash2, Ban, Users, MessageSquare, ExternalLink, Video, Save, Send, Bell, Settings, LayoutGrid } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

export function AdminScreen() {
  const [liveUrl, setLiveUrl] = useState('');
  const [notificationMsg, setNotificationMsg] = useState('');
  const { toast } = useToast();

  const flaggedPosts = [
    { id: 'f1', user: 'bot_test', reason: 'Possible spam', date: '10m ago', content: 'Follow me for free money! Link in bio...' },
    { id: 'f2', user: 'unoriginal_01', reason: 'Likely copyrighted', date: '1h ago', content: 'Found this cool wallpaper on Google.' },
  ];

  const handleUpdateLive = () => {
    toast({ title: "Live Updated", description: "The YouTube embed has been set for all users." });
  };

  const handleSendNotification = () => {
    if (!notificationMsg) return;
    toast({ 
      title: "Notification Sent!", 
      description: "Message has been pushed to the dashboard and external channels." 
    });
    setNotificationMsg('');
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="p-4 border-b border-border bg-card flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <h2 className="text-xl font-headline font-bold flex items-center">
          <ShieldAlert className="w-6 h-6 mr-2 text-primary" />
          Edit Control Panel
        </h2>
        <Badge variant="outline" className="font-bold border-primary text-primary bg-primary/5">Master Admin</Badge>
      </header>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6 h-12 rounded-xl bg-muted p-1">
              <TabsTrigger value="overview" className="rounded-lg">Dashboard</TabsTrigger>
              <TabsTrigger value="notifications" className="rounded-lg">Push</TabsTrigger>
              <TabsTrigger value="moderation" className="rounded-lg">Content</TabsTrigger>
              <TabsTrigger value="settings" className="rounded-lg">System</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 rounded-2xl border-border bg-card shadow-sm">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Users</p>
                  <p className="text-2xl font-headline font-bold text-primary">1,248</p>
                  <div className="mt-2 text-[10px] text-green-600 font-bold">+12 today</div>
                </Card>
                <Card className="p-4 rounded-2xl border-border bg-card shadow-sm">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Posts</p>
                  <p className="text-2xl font-headline font-bold text-accent">5,842</p>
                  <div className="mt-2 text-[10px] text-primary font-bold">158 active ads</div>
                </Card>
                <Card className="p-4 rounded-2xl border-border bg-card shadow-sm">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Ad Revenue</p>
                  <p className="text-2xl font-headline font-bold text-green-600">$1,420</p>
                  <div className="mt-2 text-[10px] text-muted-foreground font-bold">AdSense Estimated</div>
                </Card>
                <Card className="p-4 rounded-2xl border-border bg-card shadow-sm">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Reports</p>
                  <p className="text-2xl font-headline font-bold text-destructive">14</p>
                  <div className="mt-2 text-[10px] text-destructive font-bold">Action required</div>
                </Card>
              </div>

              <Card className="rounded-2xl border-border overflow-hidden shadow-md">
                <CardHeader className="bg-primary/5 pb-4">
                  <CardTitle className="text-lg font-headline font-bold flex items-center">
                    <Video className="w-5 h-5 mr-2 text-primary" />
                    Live Vision Manager
                  </CardTitle>
                  <CardDescription>Update the master live stream for the whole platform</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-muted-foreground">YouTube Embed URL</p>
                    <div className="flex space-x-2">
                      <Input 
                        placeholder="https://www.youtube.com/embed/VIDEO_ID" 
                        value={liveUrl}
                        onChange={(e) => setLiveUrl(e.target.value)}
                        className="rounded-xl"
                      />
                      <Button onClick={handleUpdateLive} className="rounded-xl bg-primary hover:bg-primary/90">
                        <Save className="w-4 h-4 mr-2" /> Save
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card className="rounded-2xl border-border overflow-hidden shadow-md">
                <CardHeader className="bg-accent/5">
                  <CardTitle className="text-lg font-headline font-bold flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-accent" />
                    Global Push Dashboard
                  </CardTitle>
                  <CardDescription>Broadcast messages to app and social channels</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-4">
                    <textarea 
                      className="w-full bg-muted border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-accent resize-none h-40 shadow-inner font-medium"
                      placeholder="Type your official announcement here..."
                      value={notificationMsg}
                      onChange={(e) => setNotificationMsg(e.target.value)}
                    ></textarea>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Button onClick={handleSendNotification} className="rounded-xl bg-primary py-6 font-bold">
                        <Send className="w-4 h-4 mr-2" /> App Alert
                      </Button>
                      <Button variant="outline" className="rounded-xl border-green-500 text-green-600 hover:bg-green-50 py-6 font-bold">
                        <MessageSquare className="w-4 h-4 mr-2" /> WhatsApp Channel
                      </Button>
                      <Button variant="outline" className="rounded-xl border-blue-500 text-blue-600 hover:bg-blue-50 py-6 font-bold">
                        <ExternalLink className="w-4 h-4 mr-2" /> Telegram Group
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="moderation" className="space-y-6">
              <Card className="rounded-2xl shadow-md border-border overflow-hidden">
                <CardHeader className="border-b bg-muted/30">
                  <CardTitle className="text-lg font-headline font-bold">Content Approval Queue</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="font-bold">User</TableHead>
                        <TableHead className="font-bold">Violation</TableHead>
                        <TableHead className="text-right font-bold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {flaggedPosts.map((post) => (
                        <TableRow key={post.id} className="hover:bg-muted/20">
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span>@{post.user}</span>
                              <span className="text-[10px] text-muted-foreground">{post.date}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 font-bold">{post.reason}</Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive hover:bg-destructive/10">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:bg-muted">
                              <Ban className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="rounded-2xl shadow-sm border-border p-6 space-y-4">
                  <h4 className="font-headline font-bold flex items-center text-primary">
                    <Settings className="w-4 h-4 mr-2" /> Monetization Rules
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Global Threshold</span>
                      <Badge className="rounded-lg">5,000 Followers</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">AdSense Integration</span>
                      <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">Enabled</Badge>
                    </div>
                    <Button variant="outline" className="w-full rounded-xl">Update Rules</Button>
                  </div>
                </Card>
                <Card className="rounded-2xl shadow-sm border-border p-6 space-y-4">
                  <h4 className="font-headline font-bold flex items-center text-accent">
                    <LayoutGrid className="w-4 h-4 mr-2" /> Page Management
                  </h4>
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-between rounded-xl hover:bg-muted px-4">
                      <span>Edit Privacy Policy</span>
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" className="w-full justify-between rounded-xl hover:bg-muted px-4">
                      <span>Edit Terms & Conditions</span>
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" className="w-full justify-between rounded-xl hover:bg-muted px-4">
                      <span>About Us Content</span>
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}
