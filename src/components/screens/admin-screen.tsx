
"use client";

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Trash2, Ban, Video, Save, Send, Bell, Settings, LayoutGrid, Code, Activity, RefreshCw } from 'lucide-react';
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
  const [isSaving, setIsSaving] = useState(false);

  // Fetch current site config from Firestore
  const configRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'settings', 'site_config');
  }, [firestore]);

  const { data: config, isLoading: isConfigLoading } = useDoc(configRef);

  useEffect(() => {
    if (config) {
      setAdsenseCode(config.adsenseCode || '');
    }
  }, [config]);

  const handleUpdateConfig = () => {
    if (!firestore) return;
    setIsSaving(true);
    
    const ref = doc(firestore, 'settings', 'site_config');
    setDocumentNonBlocking(ref, { 
      adsenseCode, 
      updatedAt: new Date().toISOString() 
    }, { merge: true });
    
    setTimeout(() => {
      setIsSaving(false);
      toast({ 
        title: "Settings Updated Successfully!", 
        description: "Your AdSense/SEO code is now live and injected into the site head." 
      });
    }, 1000);
  };

  const flaggedPosts = [
    { id: 'f1', user: 'bot_test', reason: 'Possible spam', date: '10m ago' },
    { id: 'f2', user: 'unoriginal_01', reason: 'Copyright violation', date: '1h ago' },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="p-4 border-b border-border bg-card flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
            <ShieldAlert className="w-5 h-5 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-headline font-bold">Owner Control Panel</h2>
        </div>
        <Badge variant="outline" className="font-bold border-primary text-primary bg-primary/5 px-3 py-1">Master Admin</Badge>
      </header>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6 h-12 rounded-xl bg-muted p-1">
              <TabsTrigger value="overview" className="rounded-lg font-bold">Dashboard</TabsTrigger>
              <TabsTrigger value="notifications" className="rounded-lg font-bold">Broadcast</TabsTrigger>
              <TabsTrigger value="moderation" className="rounded-lg font-bold">Moderation</TabsTrigger>
              <TabsTrigger value="settings" className="rounded-lg font-bold">System/Ads</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 rounded-2xl bg-card border-l-4 border-primary shadow-sm">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Users</p>
                  <p className="text-2xl font-headline font-bold text-primary">1,248</p>
                </Card>
                <Card className="p-4 rounded-2xl bg-card border-l-4 border-green-500 shadow-sm">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Estimated Revenue</p>
                  <p className="text-2xl font-headline font-bold text-green-600">$1,420</p>
                </Card>
                <Card className="p-4 rounded-2xl bg-card border-l-4 border-accent shadow-sm">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Live Visions</p>
                  <p className="text-2xl font-headline font-bold text-accent">342</p>
                </Card>
                <Card className="p-4 rounded-2xl bg-card border-l-4 border-destructive shadow-sm">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Flagged Posts</p>
                  <p className="text-2xl font-headline font-bold text-destructive">12</p>
                </Card>
              </div>

              <Card className="rounded-2xl border-border overflow-hidden shadow-md">
                <CardHeader className="bg-primary/5 border-b border-primary/10">
                  <CardTitle className="text-lg font-headline font-bold flex items-center">
                    <Video className="w-5 h-5 mr-2 text-primary" />
                    Live Streaming Manager
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-muted-foreground">Weekly Live Link (YouTube/Telegram)</p>
                    <div className="flex space-x-2">
                      <Input 
                        placeholder="Paste URL here..." 
                        value={liveUrl}
                        onChange={(e) => setLiveUrl(e.target.value)}
                        className="rounded-xl h-12"
                      />
                      <Button onClick={() => toast({title: "Live URL Saved"})} className="rounded-xl px-6 h-12">Save</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card className="rounded-2xl shadow-md p-6 space-y-4">
                <CardHeader className="p-0 mb-2">
                  <CardTitle className="text-lg font-headline font-bold flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-accent" />
                    Global Community Broadcast
                  </CardTitle>
                  <CardDescription className="font-medium">Send a notification to all users across the platform.</CardDescription>
                </CardHeader>
                <Textarea 
                  className="rounded-2xl min-h-[150px] bg-muted/20 p-4"
                  placeholder="Example: Mandatory Update! Join our WhatsApp channel for monetization payouts..."
                  value={notificationMsg}
                  onChange={(e) => setNotificationMsg(e.target.value)}
                />
                <Button onClick={() => toast({title: "Broadcast Sent!"})} className="w-full rounded-xl py-7 font-bold text-lg shadow-lg shadow-accent/20">
                  <Send className="w-5 h-5 mr-2" /> Send Global Notification
                </Button>
              </Card>
            </TabsContent>

            <TabsContent value="moderation" className="space-y-6">
              <Card className="rounded-2xl shadow-md overflow-hidden border-destructive/20">
                <Table>
                  <TableHeader className="bg-destructive/5">
                    <TableRow>
                      <TableHead className="font-bold">User</TableHead>
                      <TableHead className="font-bold">Reason</TableHead>
                      <TableHead className="text-right font-bold">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {flaggedPosts.map((post) => (
                      <TableRow key={post.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">@{post.user}</TableCell>
                        <TableCell><Badge variant="destructive" className="rounded-md">{post.reason}</Badge></TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" className="hover:bg-muted"><Ban className="w-4 h-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="rounded-2xl shadow-md overflow-hidden border-accent/20">
                <CardHeader className="bg-accent/5 border-b border-accent/10">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-headline font-bold flex items-center text-accent">
                      <Code className="w-5 h-5 mr-2" /> SEO & Google AdSense Setup
                    </CardTitle>
                    {isConfigLoading && <RefreshCw className="w-4 h-4 animate-spin text-accent" />}
                  </div>
                  <CardDescription className="font-medium">
                    Paste your AdSense verification code or Auto-Ads script below. This code will be injected into every page's HEAD automatically.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="relative">
                    <Textarea 
                      placeholder="<!-- Paste Google AdSense script or Meta Tags here -->"
                      className="min-h-[300px] font-mono text-xs rounded-xl bg-black/5 p-4 border-2 focus:border-accent transition-all"
                      value={adsenseCode}
                      onChange={(e) => setAdsenseCode(e.target.value)}
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="outline" className="bg-white/80 font-mono text-[10px]">HTML/JS EDITOR</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-accent/5 p-4 rounded-xl border border-accent/20 flex items-start space-x-3">
                    <Activity className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                      <span className="font-bold text-accent">Pro Tip:</span> Once you paste the code and click "Save & Inject", Google's crawlers will be able to detect the code on your site for verification.
                    </p>
                  </div>

                  <Button 
                    onClick={handleUpdateConfig} 
                    disabled={isSaving}
                    className="w-full rounded-2xl py-7 font-bold bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 text-lg transition-transform active:scale-95"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Saving to Database...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" /> 
                        Save & Inject Code Now
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-6 rounded-2xl shadow-sm border-border">
                  <h4 className="font-bold flex items-center mb-4 text-primary"><Settings className="w-4 h-4 mr-2" /> System Monitor</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-muted-foreground">Monetization Engine</span>
                      <Badge className="bg-green-500 border-none">ACTIVE</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-muted-foreground">AdSense Status</span>
                      <Badge variant="outline" className="border-accent text-accent">
                        {adsenseCode ? 'CODE DETECTED' : 'WAITING FOR CODE'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="font-medium text-muted-foreground">Last Update</span>
                      <span className="text-[10px] font-bold text-muted-foreground">
                        {config?.updatedAt ? new Date(config.updatedAt).toLocaleString() : 'Never'}
                      </span>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6 rounded-2xl shadow-sm border-border">
                  <h4 className="font-bold flex items-center mb-4 text-accent"><LayoutGrid className="w-4 h-4 mr-2" /> Malik Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="rounded-xl text-xs h-10 border-primary/20 hover:bg-primary/5">Clear Cache</Button>
                    <Button variant="outline" className="rounded-xl text-xs h-10 border-primary/20 hover:bg-primary/5">Reset Stats</Button>
                    <Button variant="outline" className="rounded-xl text-xs h-10 border-primary/20 hover:bg-primary/5 col-span-2">Edit Terms & Policy</Button>
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
