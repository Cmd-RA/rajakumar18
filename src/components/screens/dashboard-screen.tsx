"use client";

import React from 'react';
import { User } from '@/lib/types';
import { TrendingUp, DollarSign, Award, Info, CheckCircle2, AlertCircle, Smartphone, Download, Share, Layout } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DashboardScreenProps {
  user: User | null;
}

export function DashboardScreen({ user }: DashboardScreenProps) {
  if (!user) return null;

  const monetizationThreshold = 5000;
  const progress = Math.min((user.followerCount / monetizationThreshold) * 100, 100);
  const isEligible = user.followerCount >= monetizationThreshold;

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="p-4 border-b border-border bg-card flex items-center sticky top-0 z-10 shadow-sm">
        <h2 className="text-xl font-headline font-bold">Monetization Dashboard</h2>
      </header>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          
          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 h-12 rounded-xl bg-muted p-1">
              <TabsTrigger value="stats" className="rounded-lg">Earnings</TabsTrigger>
              <TabsTrigger value="app" className="rounded-lg">Get App</TabsTrigger>
            </TabsList>

            <TabsContent value="stats" className="space-y-6">
              {/* AdSense Top Ad */}
              <Card className="p-2 border-dashed border-2 border-muted flex items-center justify-center bg-muted/10 h-20 rounded-2xl">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">AdSense Ad Space</p>
              </Card>

              {/* Monetization Card */}
              <Card className="border-2 border-primary/20 bg-primary/5 shadow-xl shadow-primary/5 rounded-3xl overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-2xl font-headline font-bold flex items-center">
                        Channel Revenue
                        {isEligible ? (
                          <CheckCircle2 className="ml-2 w-6 h-6 text-green-500 fill-green-500/10" />
                        ) : (
                          <Award className="ml-2 w-6 h-6 text-primary" />
                        )}
                      </CardTitle>
                      <CardDescription className="font-medium">
                        Monetize your original photo visions with AdSense.
                      </CardDescription>
                    </div>
                    {isEligible && (
                      <div className="bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20 shadow-sm animate-pulse">
                        LIVE
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-muted-foreground">Follower Goal</span>
                      <span className="text-primary">{user.followerCount.toLocaleString()} / {monetizationThreshold.toLocaleString()}</span>
                    </div>
                    <div className="relative pt-1">
                      <Progress value={progress} className="h-4 bg-primary/10 rounded-full" />
                    </div>
                    {!isEligible && (
                      <p className="text-xs text-muted-foreground flex items-center font-bold bg-white/50 p-2 rounded-lg border border-primary/10">
                        <Info className="w-4 h-4 mr-2 text-primary" />
                        Complete the goal to start showing Ads on your channel.
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-card/80 border-border p-4 rounded-2xl shadow-sm">
                      <div className="flex items-center space-x-2 text-muted-foreground mb-1">
                        <TrendingUp className="w-4 h-4 text-accent" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Monthly Views</span>
                      </div>
                      <p className="text-2xl font-headline font-bold">12.5K</p>
                    </Card>
                    <Card className="bg-card/80 border-border p-4 rounded-2xl shadow-sm">
                      <div className="flex items-center space-x-2 text-muted-foreground mb-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Total Earned</span>
                      </div>
                      <p className="text-2xl font-headline font-bold">$0.00</p>
                    </Card>
                  </div>

                  <Button 
                    disabled={!isEligible} 
                    className="w-full rounded-2xl py-7 font-bold text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]"
                  >
                    {isEligible ? "Connect Google AdSense" : `Need ${monetizationThreshold - user.followerCount} More Followers`}
                  </Button>
                </CardContent>
              </Card>

              {/* Compliance Reminder */}
              <div className="bg-destructive/5 p-4 rounded-2xl border border-destructive/10 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-destructive">AdSense Policy Compliance</p>
                  <p className="text-[11px] leading-relaxed text-muted-foreground font-medium">
                    To maintain monetization, only upload original content. Google AdSense will reject accounts with copied or copyrighted photos.
                  </p>
                </div>
              </div>

              {/* Bottom Ad Placeholder */}
              <Card className="p-2 border-dashed border-2 border-muted flex items-center justify-center bg-muted/10 h-32 rounded-2xl">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">AdSense Wide Frame</p>
              </Card>
            </TabsContent>

            <TabsContent value="app" className="space-y-6">
              <Card className="rounded-3xl border-2 border-muted shadow-lg overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4">
                  <CardTitle className="text-xl font-headline font-bold flex items-center">
                    <Smartphone className="w-6 h-6 mr-2 text-primary" />
                    Official Web-App
                  </CardTitle>
                  <CardDescription className="font-medium">Install ChannelVista for instant payout alerts</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0 shadow-sm">1</div>
                      <p className="text-sm font-bold leading-tight pt-1">Open this site in Chrome or Safari browser.</p>
                    </div>
                    <div className="flex items-start space-x-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0 shadow-sm">2</div>
                      <div className="space-y-2">
                        <p className="text-sm font-bold leading-tight pt-1">Tap the <span className="text-primary inline-flex items-center font-black"><Share className="w-3 h-3 mx-1" /> Share</span> or <span className="text-primary font-black">Menu</span> icon.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0 shadow-sm">3</div>
                      <p className="text-sm font-bold leading-tight pt-1">Click <span className="font-black text-primary">"Add to Home Screen"</span></p>
                    </div>
                  </div>

                  <Button className="w-full rounded-2xl py-7 bg-primary font-bold shadow-xl shadow-primary/20 text-lg transition-transform active:scale-95">
                    <Download className="w-5 h-5 mr-2" /> 
                    Show Install Promo
                  </Button>
                </CardContent>
              </Card>

              <div className="bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10 flex items-start space-x-3">
                <Layout className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-blue-700">Mobile Optimization</p>
                  <p className="text-[11px] leading-relaxed text-muted-foreground font-medium">
                    The app version provides a seamless full-screen experience for browsing and uploading high-quality visions.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

        </div>
      </ScrollArea>
    </div>
  );
}
