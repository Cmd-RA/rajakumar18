"use client";

import React, { useState, useRef } from 'react';
import { Camera, Mic, Upload, X, Loader2, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { aiCaptionFromSpeech } from '@/ai/flows/ai-caption-from-speech';
import { aiModerateCaption } from '@/ai/flows/ai-moderate-caption';
import { AppScreen } from '@/lib/types';
import Image from 'next/image';
import { useFirestore, useUser, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';

interface UploadScreenProps {
  onPostCreated: () => void;
  onNavigate: (screen: AppScreen) => void;
}

export function UploadScreen({ onPostCreated, onNavigate }: UploadScreenProps) {
  const { firestore } = useFirestore();
  const { user } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 1024 * 1024) {
        toast({ title: "File too large", description: "Maximum image size is 1MB", variant: "destructive" });
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSpeechToCaption = async () => {
    setIsRecording(true);
    toast({ title: "Recording...", description: "Speak now to generate a caption." });
    
    setTimeout(async () => {
      setIsRecording(false);
      setIsProcessingAI(true);
      try {
        const mockAudioDataUri = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";
        const result = await aiCaptionFromSpeech({ audioDataUri: mockAudioDataUri });
        setCaption(result.caption);
        toast({ title: "Caption Generated!", description: "AI has transcribed your speech." });
      } catch (error) {
        toast({ title: "AI Error", description: "Failed to process speech. Please try again.", variant: "destructive" });
      } finally {
        setIsProcessingAI(false);
      }
    }, 2000);
  };

  const handleSubmit = async () => {
    if (!preview || !caption) {
      toast({ title: "Missing Info", description: "Please add a photo and a caption.", variant: "destructive" });
      return;
    }

    if (!user || !firestore) {
      toast({ title: "Authentication Required", description: "Please login to post.", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    
    try {
      const moderation = await aiModerateCaption({ caption });
      if (!moderation.isAppropriate) {
        toast({ title: "Content Flagged", description: moderation.reason || "Caption violates our policy.", variant: "destructive" });
        setIsUploading(false);
        return;
      }

      const postData = {
        userId: user.uid,
        username: user.email?.split('@')[0] || 'user',
        userAvatar: user.photoURL || `https://picsum.photos/seed/${user.uid}/200/200`,
        photoUrl: preview, // In production, upload to Storage first
        caption: caption,
        likesCount: 0,
        commentsCount: 0,
        shareCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      addDocumentNonBlocking(collection(firestore, 'posts'), postData);

      toast({ title: "Success!", description: "Your photo is now live on ChannelVista." });
      onPostCreated();
    } catch (error) {
      toast({ title: "Error", description: "Failed to upload post.", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="p-4 border-b border-border bg-card flex justify-between items-center sticky top-0 z-10">
        <button onClick={() => onNavigate('HOME')} className="p-2 hover:bg-muted rounded-full">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-headline font-bold">New Post</h2>
        <Button 
          onClick={handleSubmit} 
          disabled={isUploading || !preview || !caption}
          className="rounded-full px-6 bg-primary font-bold shadow-lg shadow-primary/20"
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Post
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="flex flex-col items-center">
          <Card className="w-full max-w-sm aspect-9-16 relative overflow-hidden bg-muted group border-dashed border-2 flex items-center justify-center">
            {preview ? (
              <>
                <Image src={preview} alt="Upload preview" fill className="object-cover" />
                <button 
                  onClick={() => { setFile(null); setPreview(null); }}
                  className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full backdrop-blur-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div 
                className="flex flex-col items-center space-y-4 cursor-pointer p-8 text-center w-full h-full justify-center"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Camera className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-lg">Upload Photo</p>
                  <p className="text-sm text-muted-foreground">9:16 vertical images work best</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-full">Select from device</Button>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-headline font-semibold text-lg">Caption</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSpeechToCaption} 
              disabled={isRecording || isProcessingAI}
              className={cn("rounded-full border-primary/50 text-primary transition-all", isRecording && "bg-destructive text-white border-destructive animate-pulse")}
            >
              {isRecording ? <Mic className="w-4 h-4 mr-2" /> : <Wand2 className="w-4 h-4 mr-2" />}
              {isRecording ? "Listening..." : "Voice Caption"}
            </Button>
          </div>
          <Textarea 
            placeholder="Write a catchy caption for your channel..." 
            className="min-h-[120px] rounded-2xl bg-card border-border shadow-inner text-base p-4 resize-none"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <p className="text-xs text-muted-foreground font-medium">
            AI Moderation Tip: Avoid copyrighted or downloaded content. Original photos only!
          </p>
        </div>
      </div>
    </div>
  );
}
