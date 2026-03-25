
"use client";

import React from 'react';
import { User } from '@/lib/types';
import { TrendingUp, DollarSign, Award, Info, CheckCircle2, AlertCircle, Smartphone, Download, Share } from 'lucide-react';
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
      <header className="p-4 border-b border-border bg-card flex items-center sticky top-0 z-10">
        <h2 className="text-xl font-headline font-bold">Channel Dashboard</h2>
      </header>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          
          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 h-12">
              <TabsTrigger value="stats">Stats & Earnings</TabsTrigger>
              <TabsTrigger value="app">Install App</TabsTrigger>
            </TabsList>

            <TabsContent value="stats" className="space-y-6">
              {/* Monetization Card */}
              <Card className="border-2 border-primary/20 bg-primary/5 shadow-xl shadow-primary/5 rounded-3xl overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-2xl font-headline font-bold flex items-center">
                        Monetization
                        {isEligible ? (
                          <CheckCircle2 className="ml-2 w-6 h-6 text-green-500 fill-green-500/10" />
                        ) : (
                          <Award className="ml-2 w-6 h-6 text-primary" />
                        )}
                      </CardTitle>
                      <CardDescription className="font-medium">
                        Earn through ChannelVista AdSense program.
                      </CardDescription>
                    </div>
                    {isEligible && (
                      <div className="bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">
                        ACTIVE
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm font-bold">
                      <span>Growth Progress</span>
                      <span className="text-primary">{user.followerCount} / {monetizationThreshold} Followers</span>
                    </div>
                    <Progress value={progress} className="h-3 bg-primary/10" />
                    {!isEligible && (
                      <p className="text-xs text-muted-foreground flex items-center font-medium">
                        <Info className="w-3 h-3 mr-1" />
                        You need {monetizationThreshold - user.followerCount} more followers to unlock earnings.
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-card/50 border-border p-4 rounded-2xl">
                      <div className="flex items-center space-x-2 text-muted-foreground mb-1">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Estimated Revenue</span>
                      </div>
                      <p className="text-2xl font-headline font-bold">$0.00</p>
                    </Card>
                    <Card className="bg-card/50 border-border p-4 rounded-2xl">
                      <div className="flex items-center space-x-2 text-muted-foreground mb-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Total Earnings</span>
                      </div>
                      <p className="text-2xl font-headline font-bold">$0.00</p>
                    </Card>
                  </div>

                  <Button 
                    disabled={!isEligible} 
                    className="w-full rounded-xl py-6 font-bold text-lg shadow-lg disabled:opacity-50"
                  >
                    {isEligible ? "Setup Payout Account" : "Keep Creating to Unlock"}
                  </Button>
                </CardContent>
              </Card>

              {/* Compliance Reminder */}
              <div className="bg-accent/5 p-4 rounded-2xl border border-accent/10 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-accent">Policy Reminder</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    ChannelVista rewards original content. Downloaded or copyrighted material is ineligible for monetization and may lead to account suspension.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="app" className="space-y-6">
              <Card className="rounded-3xl border-2 border-muted overflow-hidden">
                <CardHeader className="bg-muted/30">
                  <CardTitle className="text-xl font-headline font-bold flex items-center">
                    <Smartphone className="w-6 h-6 mr-2 text-primary" />
                    Install ChannelVista App
                  </CardTitle>
                  <CardDescription>Add this app to your home screen for instant notifications</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4 p-4 bg-muted/20 rounded-2xl">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">1</div>
                      <p className="text-sm font-medium">Open this website in your browser (Chrome or Safari).</p>
                    </div>
                    <div className="flex items-start space-x-4 p-4 bg-muted/20 rounded-2xl">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">2</div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Tap the <span className="font-bold text-primary inline-flex items-center"><Share className="w-3 h-3 mx-1" /> Share</span> button (iPhone) or <span className="font-bold text-primary inline-flex items-center">Menu</span> button (Android).</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 p-4 bg-muted/20 rounded-2xl">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">3</div>
                      <p className="text-sm font-medium">Select <span className="font-bold">"Add to Home Screen"</span> from the options.</p>
                    </div>
                  </div>

                  <Button className="w-full rounded-xl py-6 bg-primary font-bold shadow-lg shadow-primary/20">
                    <Download className="w-5 h-5 mr-2" /> 
                    Show Install Promo
                  </Button>
                </CardContent>
              </Card>

              <div className="bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10 flex items-start space-x-3">
                <Bell className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-blue-700">Why install?</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Installing the app gives you a faster experience and ensures you never miss a live stream or payout alert.
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
