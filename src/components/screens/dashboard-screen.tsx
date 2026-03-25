"use client";

import React from 'react';
import { User } from '@/lib/types';
import { TrendingUp, DollarSign, Award, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

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

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="rounded-2xl border-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Post Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Average Likes</span>
                    <span className="font-bold">182</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Avg. Comments</span>
                    <span className="font-bold">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Reach this month</span>
                    <span className="font-bold text-accent">+14%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 p-3 bg-green-500/5 rounded-xl border border-green-500/10">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-xs font-bold text-green-700">Good Standing</p>
                    <p className="text-[10px] text-green-600/80">Zero policy violations recorded.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-accent/5 p-4 rounded-2xl border border-accent/10 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-accent">Policy Reminder</p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                ChannelVista rewards original content. Downloaded or copyrighted material is ineligible for monetization and may lead to account suspension.
              </p>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}