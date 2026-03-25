
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
                  <CardDescription>AdSense Compliant | Updated: 2024</CardDescription>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert space-y-4 text-muted-foreground font-medium">
                  <p>At ChannelVista, your privacy is our priority. We collect minimal data (Email, Profile Info) only to provide a better vision sharing experience.</p>
                  <h4 className="text-foreground font-bold">1. Cookie Usage</h4>
                  <p>We use Google AdSense cookies to serve ads based on user interests. Users can opt out via Google Ad Settings.</p>
                  <h4 className="text-foreground font-bold">2. Data Security</h4>
                  <p>All photos and interactions are stored securely on Firebase cloud servers. We never sell your personal data to third parties.</p>
                  <h4 className="text-foreground font-bold">3. Rights</h4>
                  <p>You have the full right to delete your content or request account removal through our customer support dashboard.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="terms" className="space-y-6">
              <Card className="rounded-3xl border-2 border-primary/10 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary font-headline">
                    <ScrollText className="w-6 h-6 mr-2" /> Terms of Service
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert space-y-4 text-muted-foreground font-medium">
                  <h4 className="text-foreground font-bold">1. Content Ownership</h4>
                  <p>You must own the rights to any photo you upload. Copied content will be removed immediately.</p>
                  <h4 className="text-foreground font-bold">2. Monetization Policy</h4>
                  <p>To qualify for earnings, you must reach 5000 followers and maintain an original, policy-compliant channel.</p>
                  <h4 className="text-foreground font-bold">3. Prohibited Content</h4>
                  <p>No adult, violent, or copyright-infringing material. Violators will be banned permanently without payout.</p>
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
                    ChannelVista is a next-generation photo social platform where every user owns a "Channel". Our vision is to empower visual storytellers with monetization and real-time engagement.
                  </p>
                  <p>
                    Built with speed and simplicity in mind, we provide a mobile-first experience that rivals traditional social networks.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <Card className="rounded-3xl border-2 border-primary/10 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary font-headline">
                    <UserCircle className="w-6 h-6 mr-2" /> Contact Malik Team
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center p-4 bg-muted/30 rounded-2xl border border-border">
                    <Mail className="w-5 h-5 mr-4 text-primary" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Support Email</p>
                      <p className="font-bold">rajahribabakumar@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-muted/30 rounded-2xl border border-border">
                    <Phone className="w-5 h-5 mr-4 text-green-600" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">WhatsApp Support</p>
                      <p className="font-bold">+91 9682316132</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-12 text-center text-xs text-muted-foreground">
            <p>&copy; 2024 ChannelVista. Managed by Malik Team.</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
