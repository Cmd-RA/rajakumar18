"use client";

import React from 'react';
import { ArrowLeft, ShieldCheck, ScrollText, UserCircle, Mail, Phone, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface PolicyScreenProps {
  onBack: () => void;
}

export function PolicyScreen({ onBack }: PolicyScreenProps) {
  return (
    <div className="flex flex-col h-full bg-background">
      <header className="p-4 border-b border-border bg-card flex items-center sticky top-0 z-10 shadow-sm">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h2 className="text-xl font-headline font-bold">Legal & Policies</h2>
      </header>

      <ScrollArea className="flex-1">
        <div className="p-6">
          <Tabs defaultValue="privacy" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 h-12 rounded-xl bg-muted p-1">
              <TabsTrigger value="privacy" className="rounded-lg text-[10px] sm:text-xs font-bold">Privacy</TabsTrigger>
              <TabsTrigger value="terms" className="rounded-lg text-[10px] sm:text-xs font-bold">Terms</TabsTrigger>
              <TabsTrigger value="about" className="rounded-lg text-[10px] sm:text-xs font-bold">About</TabsTrigger>
              <TabsTrigger value="contact" className="rounded-lg text-[10px] sm:text-xs font-bold">Contact</TabsTrigger>
            </TabsList>

            <TabsContent value="privacy" className="space-y-6">
              <Card className="rounded-3xl border-2 border-primary/10 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary font-headline">
                    <ShieldCheck className="w-6 h-6 mr-2" /> Privacy Policy
                  </CardTitle>
                  <CardDescription>Last Updated: October 2023</CardDescription>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert space-y-4 text-muted-foreground font-medium">
                  <p>At ChannelVista, we prioritize your privacy. This policy outlines how we handle your data.</p>
                  <h4 className="text-foreground font-bold">1. Data We Collect</h4>
                  <p>We collect information provided during signup (Email, Name) and any photos or captions you upload to the platform.</p>
                  <h4 className="text-foreground font-bold">2. Google AdSense & Cookies</h4>
                  <p>We use Google AdSense to serve ads. Google may use cookies to serve ads based on your visit to this site and other sites on the Internet.</p>
                  <h4 className="text-foreground font-bold">3. Content Safety</h4>
                  <p>Our AI moderation system checks captions for policy compliance to ensure a safe community environment.</p>
                  <h4 className="text-foreground font-bold">4. Your Rights</h4>
                  <p>You can delete your posts or request account deletion at any time by contacting support.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="terms" className="space-y-6">
              <Card className="rounded-3xl border-2 border-primary/10 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary font-headline">
                    <ScrollText className="w-6 h-6 mr-2" /> Terms & Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert space-y-4 text-muted-foreground font-medium">
                  <h4 className="text-foreground font-bold">1. User Content</h4>
                  <p>Users are solely responsible for the photos they upload. Content must be original. Copied or copyrighted material is strictly prohibited.</p>
                  <h4 className="text-foreground font-bold">2. Monetization Rules</h4>
                  <p>Monetization is only available to users who reach 5000 followers and comply with Google AdSense policies.</p>
                  <h4 className="text-foreground font-bold">3. Prohibited Behavior</h4>
                  <p>Harassment, spam, and adult content will result in immediate account termination.</p>
                  <h4 className="text-foreground font-bold">4. Live Streams</h4>
                  <p>The Admin (Malik) reserves the right to stream live content to the community.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="about" className="space-y-6">
              <Card className="rounded-3xl border-2 border-primary/10 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary font-headline">
                    <Globe className="w-6 h-6 mr-2" /> About ChannelVista
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground font-medium leading-relaxed">
                  <p>
                    ChannelVista is a premier photo-social platform designed for visual storytellers. Every user on our platform is a "Channel" owner, sharing their unique vision with the world.
                  </p>
                  <p>
                    Our mission is to empower creators by providing a lightweight, fast, and monetizable platform. We blend the best of photography social networks with a YouTube-style growth system.
                  </p>
                  <p>
                    Built with advanced AI features like voice-to-caption and automated moderation, we ensure that original content is rewarded and the community remains safe.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <Card className="rounded-3xl border-2 border-primary/10 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary font-headline">
                    <UserCircle className="w-6 h-6 mr-2" /> Contact Us
                  </CardTitle>
                  <CardDescription>Get in touch with the Malik Team</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center p-4 bg-muted/30 rounded-2xl border border-border">
                    <Mail className="w-5 h-5 mr-4 text-primary" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Official Email</p>
                      <p className="font-bold">rajahribabakumar@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-muted/30 rounded-2xl border border-border">
                    <Phone className="w-5 h-5 mr-4 text-green-600" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Phone / WhatsApp</p>
                      <p className="font-bold">+91 9682316132</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-primary/5 rounded-2xl border border-primary/10">
                    <Globe className="w-5 h-5 mr-4 text-primary" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Location</p>
                      <p className="font-bold">Global / Online Platform</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-12 text-center text-xs text-muted-foreground">
            <p>&copy; 2023 ChannelVista. All Rights Reserved.</p>
            <p className="mt-2 font-bold text-primary">Managed by Malik Team</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
