
"use client";

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Trash2, Ban, Video, Save, Send, Bell, Settings, LayoutGrid, Code, Activity, RefreshCw, MessageSquare, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFirestore, setDocumentNonBlocking, useDoc, useMemoFirebase, useCollection, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { doc, collection, query, orderBy } from 'firebase/firestore';

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

  // Fetch user complaints
  const complaintsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'complaints'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: complaints, isLoading: isComplaintsLoading } = useCollection(complaintsQuery);

  useEffect(() => {
    if (config) {
      setAdsenseCode(config.adsenseCode || '');
      setLiveUrl(config.liveVideoUrl || '');
    }
  }, [config]);

  const handleUpdateConfig = () => {
    if (!firestore) return;
    setIsSaving(true);
    
    const ref = doc(firestore, 'settings', 'site_config');
    setDocumentNonBlocking(ref, { 
      adsenseCode, 
      liveVideoUrl: liveUrl,
      updatedAt: new Date().toISOString() 
    }, { merge: true });
    
    setTimeout(() => {
      setIsSaving(false);
      toast({ 
        title: "System Updated!", 
        description: "AdSense and Live Video settings are now live." 
      });
    }, 1000);
  };

  const handleResolveComplaint = (id: string) => {
    if (!firestore) return;
    const ref = doc(firestore, 'complaints', id);
    updateDocumentNonBlocking(ref, { status: 'resolved' });
    toast({ title: "Complaint Marked as Resolved" });
  };

  const handleDeleteComplaint = (id: string) => {
    if (!firestore) return;
    const ref = doc(firestore, 'complaints', id);
    deleteDocumentNonBlocking(ref);
    toast({ title: "Complaint Deleted" });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="p-4 border-b border-border bg-card flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
            <ShieldAlert className="w-5 h-5 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-headline font-bold">Malik Master Control</h2>
        </div>
        <Badge variant="outline" className="font-bold border-primary text-primary bg-primary/5 px-3 py-1">Owner Access</Badge>
      </header>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6 h-12 rounded-xl bg-muted p-1">
              <TabsTrigger value="overview" className="rounded-lg font-bold text-[10px] sm:text-xs">Dashboard</TabsTrigger>
              <TabsTrigger value="support" className="rounded-lg font-bold text-[10px] sm:text-xs">Complaints</TabsTrigger>
              <TabsTrigger value="notifications" className="rounded-lg font-bold text-[10px] sm:text-xs">Broadcast</TabsTrigger>
              <TabsTrigger value="moderation" className="rounded-lg font-bold text-[10px] sm:text-xs">Posts</TabsTrigger>
              <TabsTrigger value="settings" className="rounded-lg font-bold text-[10px] sm:text-xs">AdSense/SEO</TabsTrigger>
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
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Open Tickets</p>
                  <p className="text-2xl font-headline font-bold text-accent">{complaints?.filter(c => c.status === 'pending').length || 0}</p>
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
                  <CardDescription className="font-medium">Update the top-rank live video for all vision channels.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-muted-foreground">YouTube/Vimeo Embed URL</p>
                    <div className="flex space-x-2">
                      <Input 
                        placeholder="https://www.youtube.com/watch?v=..." 
                        value={liveUrl}
                        onChange={(e) => setLiveUrl(e.target.value)}
                        className="rounded-xl h-12"
                      />
                      <Button onClick={handleUpdateConfig} disabled={isSaving} className="rounded-xl px-6 h-12">
                        {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Set Live"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="support" className="space-y-6">
              <Card className="rounded-2xl shadow-md overflow-hidden">
                <CardHeader className="bg-primary/5 border-b border-primary/10">
                  <CardTitle className="text-lg font-headline font-bold flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-primary" />
                    Customer Support Dashboard
                  </CardTitle>
                  <CardDescription className="font-medium">Manage user feedback and monetization complaints.</CardDescription>
                </CardHeader>
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="font-bold">User</TableHead>
                        <TableHead className="font-bold">Message</TableHead>
                        <TableHead className="font-bold">Status</TableHead>
                        <TableHead className="text-right font-bold">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isComplaintsLoading ? (
                        <TableRow><TableCell colSpan={4} className="text-center py-10"><RefreshCw className="w-6 h-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
                      ) : complaints && complaints.length > 0 ? (
                        complaints.map((c) => (
                          <TableRow key={c.id} className="hover:bg-muted/30">
                            <TableCell className="font-bold">@{c.username}</TableCell>
                            <TableCell className="max-w-xs"><p className="text-xs truncate" title={c.message}>{c.message}</p></TableCell>
                            <TableCell>
                              <Badge variant={c.status === 'pending' ? 'destructive' : 'default'} className="rounded-md">
                                {c.status.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right space-x-1">
                              {c.status === 'pending' && (
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-green-600 hover:bg-green-50"
                                  onClick={() => handleResolveComplaint(c.id)}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-destructive hover:bg-destructive/5"
                                onClick={() => handleDeleteComplaint(c.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow><TableCell colSpan={4} className="text-center py-20 text-muted-foreground font-medium">No complaints found.</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="rounded-2xl shadow-md overflow-hidden border-accent/20">
                <CardHeader className="bg-accent/5 border-b border-accent/10">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-headline font-bold flex items-center text-accent">
                      <Code className="w-5 h-5 mr-2" /> SEO & AdSense Master Editor
                    </CardTitle>
                    {isConfigLoading && <RefreshCw className="w-4 h-4 animate-spin text-accent" />}
                  </div>
                  <CardDescription className="font-medium">
                    Paste Google AdSense script or Meta Tags. Changes reflect on all pages.
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
                  </div>
                  <Button 
                    onClick={handleUpdateConfig} 
                    disabled={isSaving}
                    className="w-full rounded-2xl py-7 font-bold bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 text-lg transition-transform active:scale-95"
                  >
                    {isSaving ? <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                    Save & Update Site System
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}
