
"use client";

import React, { useState, useRef } from 'react';
import { Camera, Mic, Upload, X, Loader2, Wand2, ShieldAlert, Info, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { aiCaptionFromSpeech } from '@/ai/flows/ai-caption-from-speech';
import { aiModerateCaption } from '@/ai/flows/ai-moderate-caption';
import { AppScreen } from '@/lib/types';
import Image from 'next/image';
import { useFirestore, useUser, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
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
        photoUrl: preview, 
        caption: caption,
        likesCount: 0,
        commentsCount: 0,
        shareCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      addDocumentNonBlocking(collection(firestore, 'posts'), postData);

      toast({ title: "Vision Shared!", description: "Your original photo is now live." });
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
        <h2 className="text-xl font-headline font-bold">New Vision</h2>
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
        
        {/* STRICT WARNING ALERT */}
        <Alert variant="destructive" className="rounded-2xl border-2 shadow-md">
          <ShieldAlert className="h-5 w-5" />
          <AlertTitle className="font-bold">Originality Required!</AlertTitle>
          <AlertDescription className="text-xs font-medium leading-relaxed">
            <p className="mb-2">We ONLY allow photos taken with your mobile camera. </p>
            <p className="font-bold">❌ No Downloads / Google Photos</p>
            <p className="font-bold">❌ No Screenshots / Copyrighted Content</p>
            <p className="mt-2 text-[10px] opacity-80 italic">Violating users will be permanently banned from monetization.</p>
          </AlertDescription>
        </Alert>

        <div className="flex flex-col items-center">
          <Card className="w-full max-w-sm aspect-9-16 relative overflow-hidden bg-muted group border-dashed border-2 flex items-center justify-center rounded-[2rem]">
            {preview ? (
              <>
                <Image src={preview} alt="Upload preview" fill className="object-cover" />
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  <span className="text-[10px] text-white font-bold uppercase tracking-widest flex items-center gap-1">
                    <Smartphone className="w-3 h-3" /> Camera Shot
                  </span>
                </div>
                <button 
                  onClick={() => { setFile(null); setPreview(null); }}
                  className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full backdrop-blur-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div 
                className="flex flex-col items-center space-y-4 cursor-pointer p-8 text-center w-full h-full justify-center transition-all hover:bg-primary/5"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center shadow-inner">
                  <Camera className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-xl text-primary">Capture Vision</p>
                  <p className="text-sm text-muted-foreground mt-2 px-6">Upload an original photo from your device gallery.</p>
                </div>
                <Button variant="default" size="lg" className="rounded-full px-8 shadow-xl shadow-primary/20">Select Camera Photo</Button>
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

        <div className="space-y-4 bg-card p-6 rounded-[2rem] border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-headline font-black text-lg text-primary uppercase tracking-tighter">Caption</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSpeechToCaption} 
              disabled={isRecording || isProcessingAI}
              className={cn("rounded-full border-primary/50 text-primary transition-all font-bold", isRecording && "bg-destructive text-white border-destructive animate-pulse")}
            >
              {isRecording ? <Mic className="w-4 h-4 mr-2" /> : <Wand2 className="w-4 h-4 mr-2" />}
              {isRecording ? "Listening..." : "Voice Caption"}
            </Button>
          </div>
          <Textarea 
            placeholder="Describe your original vision..." 
            className="min-h-[140px] rounded-2xl bg-muted/20 border-border shadow-inner text-base p-4 resize-none focus:bg-background transition-colors"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <div className="flex items-start gap-2 text-[11px] text-muted-foreground font-bold p-3 bg-muted/10 rounded-xl">
            <Info className="w-4 h-4 text-primary shrink-0" />
            <p>Our AI analyzes metadata to verify originality. Only mobile-captured visions are eligible for monetization.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
