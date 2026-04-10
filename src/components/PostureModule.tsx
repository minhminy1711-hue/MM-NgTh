import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera, Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { analyzePosture, AnalysisResult } from '@/src/services/geminiService';
import { Card, CardContent } from '@/components/ui/card';

interface PostureModuleProps {
  type: 'squat' | 'lunges' | 'core';
  onBack: () => void;
}

export default function PostureModule({ type, onBack }: PostureModuleProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const titles = {
    squat: 'Phân Tích Squat',
    lunges: 'Phân Tích Lunges',
    core: 'Phân Tích Core'
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Preview
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
    setResult(null);
    setIsAnalyzing(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const analysis = await analyzePosture(base64, type);
        setResult(analysis);
        setIsAnalyzing(false);
      };
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi tải video.");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B192C] flex flex-col">
      <div className="bg-[#1A2B4C] border-b border-accent/10 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack} className="rounded-full border-accent/20 hover:bg-accent/10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-accent uppercase">{titles[type]}</h1>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center p-4 md:p-8 space-y-8 overflow-y-auto">
        <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl border-2 border-primary/30 overflow-hidden shadow-2xl group">
          {videoPreview ? (
            <video src={videoPreview} controls className="w-full h-full object-contain" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground space-y-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Camera className="w-10 h-10 text-primary" />
              </div>
              <p className="text-lg font-medium">Sẵn sàng phân tích AI</p>
              <p className="text-sm opacity-50">Tải lên video tập luyện của bạn</p>
            </div>
          )}
          
          {isAnalyzing && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-xl font-bold text-white animate-pulse">AI đang phân tích tư thế...</p>
              <p className="text-sm text-muted-foreground mt-2">Vui lòng đợi trong giây lát</p>
            </div>
          )}

          <div className="absolute bottom-4 right-4 z-30">
            <input 
              type="file" 
              accept="video/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload}
            />
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full shadow-lg gap-2"
              disabled={isAnalyzing}
            >
              <Upload className="w-4 h-4" />
              Tải Video Lên
            </Button>
          </div>
        </div>

        {/* Results Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <Card className="bg-[#1A2B4C] border-accent/10">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Điểm Kỹ Thuật</p>
              <p className="text-3xl font-bold text-primary">{result ? `${result.score}%` : '--'}</p>
            </CardContent>
          </Card>
          <Card className="bg-[#1A2B4C] border-accent/10">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Số Lần Lặp (Reps)</p>
              <p className="text-3xl font-bold text-white">{result ? result.reps : '0'}</p>
            </CardContent>
          </Card>
          <Card className="bg-[#1A2B4C] border-accent/10">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Độ Thăng Bằng</p>
              <p className="text-3xl font-bold text-accent">{result ? `${result.balance}%` : '--'}</p>
            </CardContent>
          </Card>
        </div>

        {result && (
          <div className="w-full max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="bg-[#1A2B4C] border-primary/20">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <CheckCircle2 className="w-6 h-6" />
                  <h3 className="text-xl font-bold uppercase">Nhận xét từ AI</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {result.feedback}
                </p>
              </CardContent>
            </Card>

            {result.errors.length > 0 && (
              <Card className="bg-destructive/5 border-destructive/20">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="w-6 h-6" />
                    <h3 className="text-xl font-bold uppercase">Lỗi cần khắc phục</h3>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {result.errors.map((error, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm bg-destructive/10 p-2 rounded border border-destructive/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                        {error}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
