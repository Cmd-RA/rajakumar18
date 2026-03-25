"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulation
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] rounded-3xl p-6">
        <DialogHeader className="space-y-3 text-center">
          <DialogTitle className="text-3xl font-headline font-bold text-primary">ChannelVista</DialogTitle>
          <DialogDescription className="font-medium">
            Join the community of visual storytellers.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="mt-4">
          <TabsList className="grid w-full grid-cols-2 h-12 rounded-xl bg-muted p-1">
            <TabsTrigger value="login" className="rounded-lg">Login</TabsTrigger>
            <TabsTrigger value="signup" className="rounded-lg">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4 pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-bold">Email or Username</Label>
                <Input id="email" placeholder="john_doe" className="rounded-xl" required />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="pass" className="font-bold">Password</Label>
                  <button type="button" className="text-xs text-primary font-bold hover:underline">Forgot?</button>
                </div>
                <Input id="pass" type="password" placeholder="••••••••" className="rounded-xl" required />
              </div>
              <Button type="submit" className="w-full rounded-xl py-6 font-bold text-lg shadow-lg" disabled={loading}>
                {loading ? "Authenticating..." : "Login"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4 pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-user" className="font-bold">Username</Label>
                <Input id="new-user" placeholder="visionary_1" className="rounded-xl" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-pass" className="font-bold">Password</Label>
                <Input id="new-pass" type="password" placeholder="••••••••" className="rounded-xl" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pin" className="font-bold">Secret PIN (For Recovery)</Label>
                <Input id="pin" placeholder="1234" maxLength={4} className="rounded-xl" required />
              </div>
              <Button type="submit" className="w-full rounded-xl py-6 font-bold text-lg shadow-lg" disabled={loading}>
                {loading ? "Creating Account..." : "Create Channel"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground font-bold">Or continue with</span></div>
        </div>

        <Button variant="outline" className="w-full rounded-xl py-6 font-bold border-2 transition-all hover:bg-muted" onClick={handleSubmit}>
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google Login
        </Button>
      </DialogContent>
    </Dialog>
  );
}