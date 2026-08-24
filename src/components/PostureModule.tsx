import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera, Upload, Loader2, CheckCircle2, AlertCircle, Sparkles, Dumbbell, Play, RotateCcw } from "lucide-react";
import { analyzePosture, AnalysisResult } from '../services/geminiService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StudentProfile } from '../types/fitness';

interface PostureModuleProps {
  type: 'squat' | 'lunges' | 'core';
  student?: StudentProfile;
  onBack: () => void;
  onSaveResult?: (result: AnalysisResult, exerciseType: 'squat' | 'lunges' | 'core') => void;
  onChangeExercise?: (exercise: 'squat' | 'lunges' | 'core') => void;
}

export default function PostureModule({
  type,
  student,
  onBack,
  onSaveResult,
  onChangeExercise,
}: PostureModuleProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exerciseTitles = {
    squat: 'Đánh Giá Kỹ Thuật Squat (Mông Đùi & Cột Sống)',
    lunges: 'Đánh Giá Động Học Lunges (Khớp Gối & Cân Bằng Trục Hông)',
    core: 'Đánh Giá Siết Cơ Lõi & Vòng Eo (Core & Plank)',
  };

  const exerciseGuides = {
    squat: [
      'Hai chân mở rộng bằng vai hoặc rộng hơn một chút, mũi chân hơi chếch 15-30 độ.',
      'Giữ lưng thẳng tự nhiên, siết cơ bụng, đẩy hông ra sau và hạ đùi song song mặt sàn (góc 90 độ).',
      'Đảm bảo khớp gối hướng theo chiều mũi chân và gót chân chạm vững mặt sàn.',
    ],
    lunges: [
      'Bước một chân về phía trước, hạ thấp trọng tâm sao cho cả hai đầu gối gập khoảng 90 độ.',
      'Gối trước không vượt quá mũi chân, gối sau hạ gần chạm sàn.',
      'Giữ thân người thẳng đứng, siết cơ lõi để giữ thăng bằng tối đa.',
    ],
    core: [
      'Giữ tư thế chuẩn (Plank hoặc siết bụng co gối), cơ thể tạo thành một đường thẳng từ vai đến gót chân.',
      'Không võng thắt lưng hoặc nhô mông quá cao, hít thở cơ hoành đều đặn.',
      'Tập trung siết sâu cơ bụng ngang (Transverse Abdominis) để thon gọn vòng 2.',
    ],
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    setVideoPreview(URL.createObjectURL(file));
    setIsAnalyzing(true);
    setResult(null);
    setSavedSuccess(false);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const latestMeasurement = student?.measurements?.[student.measurements.length - 1];
        const analysis = await analyzePosture(base64, type, latestMeasurement);
        
        setResult(analysis);
        setIsAnalyzing(false);

        if (onSaveResult) {
          onSaveResult(analysis, type);
          setSavedSuccess(true);
        }
      };
    } catch (error) {
      console.error("AI Posture analysis failed:", error);
      setIsAnalyzing(false);
      alert("Không thể phân tích video. Vui lòng thử lại!");
    }
  };

  const handleUseDemoVideo = async () => {
    setIsAnalyzing(true);
    setResult(null);
    setSavedSuccess(false);
    setSelectedFileName(`demo_${type}_recording.mp4`);

    // Simulate analysis delay with AI response
    setTimeout(async () => {
      const latestMeasurement = student?.measurements?.[student.measurements.length - 1];
      const analysis = await analyzePosture('', type, latestMeasurement);
      setResult(analysis);
      setIsAnalyzing(false);

      if (onSaveResult) {
        onSaveResult(analysis, type);
        setSavedSuccess(true);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0B192C] text-white p-4 md:p-8 space-y-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={onBack}
              className="rounded-full border-[#F6ECB7]/30 text-white hover:bg-[#1A2B4C]"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-[#FFD700]/20 text-[#FFD700] font-bold border border-[#FFD700]/30 uppercase">
                  AI Computer Vision
                </span>
                {student && (
                  <span className="text-xs text-[#B0BEC5]">
                    Đang chấm điểm cho: <strong className="text-white">{student.name}</strong>
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                {exerciseTitles[type]}
              </h1>
            </div>
          </div>

          {/* Exercise Selector Switcher */}
          {onChangeExercise && (
            <div className="flex items-center bg-[#102038] p-1 rounded-lg border border-[#2A3B5C]">
              <button
                onClick={() => onChangeExercise('squat')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  type === 'squat' ? 'bg-[#FFD700] text-[#0B192C]' : 'text-gray-400 hover:text-white'
                }`}
              >
                Squat
              </button>
              <button
                onClick={() => onChangeExercise('lunges')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  type === 'lunges' ? 'bg-[#FFD700] text-[#0B192C]' : 'text-gray-400 hover:text-white'
                }`}
              >
                Lunges
              </button>
              <button
                onClick={() => onChangeExercise('core')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  type === 'core' ? 'bg-[#FFD700] text-[#0B192C]' : 'text-gray-400 hover:text-white'
                }`}
              >
                Vòng Eo Core
              </button>
            </div>
          )}
        </div>

        {/* Main 2-Column Workout & Analysis Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Video Preview / Upload & Camera Screen */}
          <div className="lg:col-span-7 space-y-4">
            <Card className="bg-[#1A2B4C] border-2 border-[#2A3B5C] overflow-hidden">
              <CardHeader className="bg-[#102038] py-3 px-4 border-b border-[#2A3B5C] flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-[#FFD700] uppercase tracking-wider flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#FFD700]" />
                  Khung Quét Động Học Video AI
                </CardTitle>
                {selectedFileName && (
                  <span className="text-[11px] text-gray-300 truncate max-w-[200px]">
                    {selectedFileName}
                  </span>
                )}
              </CardHeader>

              <div className="relative aspect-video bg-[#07111F] flex items-center justify-center overflow-hidden">
                {videoPreview ? (
                  <video
                    src={videoPreview}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center p-6 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#102038] border-2 border-dashed border-[#FFD700]/50 flex items-center justify-center mx-auto text-[#FFD700]">
                      <Upload className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-white">Tải Video Tập Luyện Của Bạn</p>
                      <p className="text-xs text-[#B0BEC5] max-w-sm mx-auto mt-1">
                        Quay rõ góc nghiêng hoặc toàn thân để AI nhận diện góc khớp gối, trục cột sống và đếm số rep.
                      </p>
                    </div>
                  </div>
                )}

                {/* AI Analyzing Overlay */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-[#0B192C]/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 z-20 animate-in fade-in">
                    <div className="relative mb-4">
                      <Loader2 className="w-12 h-12 text-[#FFD700] animate-spin" />
                      <Sparkles className="w-5 h-5 text-[#FFD700] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                    </div>
                    <h3 className="text-lg font-bold text-[#FFD700]">AI Đang Phân Tích Kỹ Thuật...</h3>
                    <p className="text-xs text-gray-300 mt-1 max-w-xs">
                      Đang tính toán góc mở khớp gối, độ thăng bằng trục hông và đánh giá form chuyển động...
                    </p>
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="p-4 bg-[#102038] border-t border-[#2A3B5C] flex flex-wrap items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="video/*"
                  className="hidden"
                />

                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isAnalyzing}
                  className="flex-1 bg-[#FFD700] hover:bg-[#ffe234] text-[#0B192C] font-extrabold text-xs h-10 gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Chọn & Tải Video Lên
                </Button>

                <Button
                  onClick={handleUseDemoVideo}
                  disabled={isAnalyzing}
                  variant="outline"
                  className="border-[#FFD700]/40 text-[#FFD700] hover:bg-[#FFD700]/10 text-xs h-10 gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  Chạy Thử Nghiệm Mẫu
                </Button>
              </div>
            </Card>

            {/* Exercise Standard Guide Card */}
            <Card className="bg-[#1A2B4C] border border-[#2A3B5C] p-4 text-white">
              <h3 className="text-xs font-bold text-[#F6ECB7] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4 text-[#FFD700]" />
                Tiêu Chuẩn Kỹ Thuật Động Học HD Fitness:
              </h3>
              <ul className="space-y-1.5 text-xs text-gray-300">
                {exerciseGuides[type].map((g, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#0B192C] text-[#FFD700] text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Right Column: AI Analysis Output & Scores */}
          <div className="lg:col-span-5 space-y-4">
            {result ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-3 duration-300">
                
                {/* Score Banner */}
                <Card className="bg-[#1A2B4C] border-2 border-[#FFD700] p-5 text-white shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#B0BEC5] font-semibold uppercase tracking-wider">
                        Kết Quả Đánh Giá AI
                      </span>
                      <h2 className="text-xl font-extrabold text-white mt-0.5">
                        {result.score >= 90
                          ? 'Xuất Sắc!'
                          : result.score >= 75
                          ? 'Đạt Yêu Cầu'
                          : 'Cần Chỉnh Sửa Form'}
                      </h2>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl sm:text-4xl font-black text-[#FFD700]">
                        {result.score}
                      </span>
                      <span className="text-xs text-gray-400">/100</span>
                    </div>
                  </div>

                  {savedSuccess && (
                    <div className="mt-3 py-1 px-2.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Đã tự động lưu kết quả vào hồ sơ tập luyện của học viên!
                    </div>
                  )}

                  {/* 3 Metric Badges */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#2A3B5C] text-center text-xs">
                    <div className="bg-[#0B192C] p-2 rounded-lg border border-[#2A3B5C]">
                      <span className="text-[10px] text-gray-400 block">Số Reps Chuẩn</span>
                      <span className="text-base font-bold text-white">{result.reps} reps</span>
                    </div>
                    <div className="bg-[#0B192C] p-2 rounded-lg border border-[#2A3B5C]">
                      <span className="text-[10px] text-gray-400 block">Góc Khớp Gối</span>
                      <span className="text-base font-bold text-[#FFD700]">
                        {result.kneeAngle ? `${result.kneeAngle}°` : '90°'}
                      </span>
                    </div>
                    <div className="bg-[#0B192C] p-2 rounded-lg border border-[#2A3B5C]">
                      <span className="text-[10px] text-gray-400 block">Độ Thăng Bằng</span>
                      <span className="text-base font-bold text-emerald-400">
                        {result.balance ? `${result.balance}%` : '92%'}
                      </span>
                    </div>
                  </div>
                </Card>

                {/* AI Feedback */}
                <Card className="bg-[#1A2B4C] border border-[#2A3B5C] p-4 text-white space-y-3">
                  <div>
                    <h3 className="text-xs font-bold text-[#FFD700] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-4 h-4 text-[#FFD700]" />
                      Nhận Xét Động Học Chuyên Sâu:
                    </h3>
                    <p className="text-xs text-gray-200 leading-relaxed bg-[#0B192C] p-3 rounded-lg border border-[#2A3B5C]">
                      {result.feedback}
                    </p>
                  </div>

                  {/* Errors */}
                  <div>
                    <h3 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                      Lỗi Kỹ Thuật Ghi Nhận:
                    </h3>
                    {result.errors.length === 0 ? (
                      <div className="text-xs text-emerald-300 bg-[#0B192C] p-2.5 rounded-lg border border-emerald-500/30 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        Form chuẩn xác, không có lỗi chuyển động nguy hiểm!
                      </div>
                    ) : (
                      <ul className="text-xs text-rose-300 bg-[#0B192C] p-3 rounded-lg border border-rose-500/30 space-y-1 list-disc list-inside">
                        {result.errors.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Body Impact */}
                  {result.postureImpact && (
                    <div className="bg-[#0B192C] p-3 rounded-lg border border-[#FFD700]/20">
                      <h4 className="text-[11px] font-bold text-[#F6ECB7] mb-1">
                        🎯 Tác Động Tới Số Đo Vóc Dáng:
                      </h4>
                      <p className="text-xs text-gray-300">{result.postureImpact}</p>
                    </div>
                  )}

                  {/* Muscle Advice */}
                  {result.targetedMuscleAdvice && (
                    <div className="bg-[#0B192C] p-3 rounded-lg border border-blue-500/20">
                      <h4 className="text-[11px] font-bold text-blue-300 mb-1">
                        💡 Lời Khuyên Bài Tập Tiếp Theo:
                      </h4>
                      <p className="text-xs text-gray-300">{result.targetedMuscleAdvice}</p>
                    </div>
                  )}
                </Card>
              </div>
            ) : (
              <Card className="bg-[#1A2B4C] border border-[#2A3B5C] p-8 text-center text-white space-y-4">
                <Sparkles className="w-12 h-12 text-[#FFD700] mx-auto opacity-50" />
                <div>
                  <h3 className="font-bold text-base text-white">Chờ Video Tập Luyện</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                    Tải video lên từ thiết bị hoặc bấm nút "Chạy Thử Nghiệm Mẫu" để xem hệ thống AI phân tích góc khớp và tính điểm.
                  </p>
                </div>
              </Card>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
