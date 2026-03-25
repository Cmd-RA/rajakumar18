
"use client";

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Trash2, Ban, Video, Save, Send, Bell, Settings, LayoutGrid, Code } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFirestore, setDocumentNonBlocking, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export function AdminScreen() {
  const { firestore } = useFirestore();
  const { toast } = useToast();
  const [liveUrl, setLiveUrl] = useState('');
  const [notificationMsg, setNotificationMsg] = useState('');
  const [adsenseCode, setAdsenseCode] = useState('');

  // Fetch current site config
  const configRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'settings', 'site_config');
  }, [firestore]);

  const { data: config } = useDoc(configRef);

  useEffect(() => {
    if (config) {
      setAdsenseCode(config.adsenseCode || '');
    }
  }, [config]);

  const flaggedPosts = [
    { id: 'f1', user: 'bot_test', reason: 'Possible spam', date: '10m ago' },
    { id: 'f2', user: 'unoriginal_01', reason: 'Copyright', date: '1h ago' },
  ];

  const handleUpdateConfig = () => {
    if (!firestore) return;
    const ref = doc(firestore, 'settings', 'site_config');
    setDocumentNonBlocking(ref, { 
      adsenseCode, 
      updatedAt: new Date().toISOString() 
    }, { merge: true });
    
    toast({ 
      title: "Settings Saved!", 
      description: "AdSense/SEO code has been injected into the site head." 
    });
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
                <Card className="p-4 rounded-2xl bg-card shadow-sm">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Users</p>
                  <p className="text-2xl font-headline font-bold text-primary">1,248</p>
                </Card>
                <Card className="p-4 rounded-2xl bg-card shadow-sm">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Revenue</p>
                  <p className="text-2xl font-headline font-bold text-green-600">$1,420</p>
                </Card>
              </div>

              <Card className="rounded-2xl border-border overflow-hidden shadow-md">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="text-lg font-headline font-bold flex items-center">
                    <Video className="w-5 h-5 mr-2 text-primary" />
                    Live Vision Manager
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex space-x-2">
                    <Input 
                      placeholder="YouTube Embed URL" 
                      value={liveUrl}
                      onChange={(e) => setLiveUrl(e.target.value)}
                      className="rounded-xl"
                    />
                    <Button onClick={() => toast({title: "Updated"})} className="rounded-xl">Save</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card className="rounded-2xl shadow-md p-6 space-y-4">
                <CardTitle className="text-lg font-headline font-bold flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-accent" />
                  Global Broadcast
                </CardTitle>
                <Textarea 
                  className="rounded-2xl min-h-[150px]"
                  placeholder="Type announcement..."
                  value={notificationMsg}
                  onChange={(e) => setNotificationMsg(e.target.value)}
                />
                <Button onClick={() => toast({title: "Sent!"})} className="w-full rounded-xl py-6 font-bold">
                  <Send className="w-4 h-4 mr-2" /> Send to All
                </Button>
              </Card>
            </TabsContent>

            <TabsContent value="moderation" className="space-y-6">
              <Card className="rounded-2xl shadow-md overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {flaggedPosts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell>@{post.user}</TableCell>
                        <TableCell><Badge variant="destructive">{post.reason}</Badge></TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon"><Ban className="w-4 h-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="rounded-2xl shadow-md overflow-hidden">
                <CardHeader className="bg-accent/5">
                  <CardTitle className="text-lg font-headline font-bold flex items-center text-accent">
                    <Code className="w-5 h-5 mr-2" /> SEO & AdSense Setup
                  </CardTitle>
                  <CardDescription>
                    Paste your Google AdSense meta tag or auto-ad script here. This will be injected into every page's head.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <Textarea 
                    placeholder="<!-- Paste your AdSense code here -->"
                    className="min-h-[250px] font-mono text-xs rounded-xl bg-muted/30"
                    value={adsenseCode}
                    onChange={(e) => setAdsenseCode(e.target.value)}
                  />
                  <Button onClick={handleUpdateConfig} className="w-full rounded-xl py-6 font-bold bg-accent hover:bg-accent/90">
                    <Save className="w-4 h-4 mr-2" /> Save & Inject Code
                  </Button>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-6 rounded-2xl">
                  <h4 className="font-bold flex items-center mb-4"><Settings className="w-4 h-4 mr-2" /> System Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Monetization</span><Badge className="bg-green-500">Active</Badge></div>
                    <div className="flex justify-between"><span>AdSense Connection</span><Badge variant="outline">Waiting for Code</Badge></div>
                  </div>
                </Card>
                <Card className="p-6 rounded-2xl">
                  <h4 className="font-bold flex items-center mb-4"><LayoutGrid className="w-4 h-4 mr-2" /> Quick Actions</h4>
                  <Button variant="outline" className="w-full rounded-xl mb-2">Clear Cache</Button>
                  <Button variant="outline" className="w-full rounded-xl">Edit Policies</Button>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}
