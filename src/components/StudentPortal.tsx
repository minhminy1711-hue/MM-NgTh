import React, { useState } from 'react';
import { StudentProfile, BodyMeasurement } from '../types/fitness';
import BodyMetricsCard from './BodyMetricsCard';
import MeasurementHistoryTable from './MeasurementHistoryTable';
import StudentMeasurementFormModal from './StudentMeasurementFormModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dumbbell, Plus, Sparkles, Trophy, Video, CheckCircle2, AlertTriangle, Calendar, Heart, MapPin } from 'lucide-react';

interface StudentPortalProps {
  student: StudentProfile;
  onSaveMeasurement: (studentId: string, measurement: Omit<BodyMeasurement, 'id' | 'bmi' | 'whr'>) => void;
  onStartExerciseAI: (exerciseType: 'squat' | 'lunges' | 'core', studentId: string) => void;
}

export default function StudentPortal({
  student,
  onSaveMeasurement,
  onStartExerciseAI,
}: StudentPortalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const latestM = student.measurements[student.measurements.length - 1];
  const initialM = student.measurements[0];
  const totalWaistDrop = latestM && initialM ? Number((initialM.waist - latestM.waist).toFixed(1)) : 0;
  const totalWeightDrop = latestM && initialM ? Number((initialM.weight - latestM.weight).toFixed(1)) : 0;
  const isCS1 = student.branch === 'HD Nguyễn Văn Trỗi- CS1';

  return (
    <div className="min-h-screen bg-[#0B192C] text-white p-4 md:p-8 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Student Welcome Hero Banner */}
        <Card className="bg-gradient-to-r from-[#102038] via-[#1A2B4C] to-[#102038] border-2 border-[#FFD700]/30 p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/40">
                  Cổng Thông Tin Học Viên
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-md font-bold border flex items-center gap-1 ${
                    isCS1
                      ? 'bg-sky-950/70 text-sky-300 border-sky-500/40'
                      : 'bg-amber-950/70 text-amber-300 border-amber-500/40'
                  }`}
                >
                  <MapPin className="w-3 h-3" />
                  {student.branch}
                </span>
                <span className="text-xs text-[#B0BEC5] font-mono">Mã: {student.id}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Xin chào, <span className="text-[#FFD700]">{student.name}</span>!
              </h1>
              <p className="text-xs text-gray-300 max-w-xl">
                Mục tiêu hiện tại: <strong className="text-[#FFD700]">{student.targetGoal}</strong> • HLV đồng hành:{' '}
                <strong className="text-white">{student.assignedTrainer}</strong>
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#102038] hover:bg-[#1A2B4C] text-[#FFD700] border border-[#FFD700]/40 text-xs font-bold gap-1.5 h-10 px-4"
              >
                <Plus className="w-4 h-4" />
                Cập Nhật Chỉ Số Đo
              </Button>
              <Button
                onClick={() => onStartExerciseAI('squat', student.id)}
                className="bg-[#FFD700] hover:bg-[#ffe234] text-[#0B192C] font-extrabold text-xs gap-1.5 h-10 px-5 shadow-lg"
              >
                <Dumbbell className="w-4 h-4" />
                Tập Luyện AI Ngay
              </Button>
            </div>
          </div>

          {/* Motivational Achievement Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-[#2A3B5C]/60 text-xs">
            <div className="bg-[#0B192C]/80 p-3 rounded-lg border border-[#2A3B5C]">
              <span className="text-[10px] text-gray-400 block">Vòng Eo Hiện Tại</span>
              <span className="text-lg font-black text-[#FFD700]">{latestM?.waist || '--'} cm</span>
              {totalWaistDrop > 0 && (
                <span className="text-[10px] text-emerald-400 font-semibold block">
                  (Giảm -{totalWaistDrop}cm từ lúc bắt đầu)
                </span>
              )}
            </div>

            <div className="bg-[#0B192C]/80 p-3 rounded-lg border border-[#2A3B5C]">
              <span className="text-[10px] text-gray-400 block">Cân Nặng Hiện Tại</span>
              <span className="text-lg font-black text-white">{latestM?.weight || '--'} kg</span>
              {totalWeightDrop !== 0 && (
                <span className="text-[10px] text-emerald-400 font-semibold block">
                  {totalWeightDrop > 0 ? `Giảm -${totalWeightDrop}kg` : `Tăng +${Math.abs(totalWeightDrop)}kg`}
                </span>
              )}
            </div>

            <div className="bg-[#0B192C]/80 p-3 rounded-lg border border-[#2A3B5C]">
              <span className="text-[10px] text-gray-400 block">Điểm Tư Thế AI TB</span>
              <span className="text-lg font-black text-emerald-400">
                {student.postureHistory.length > 0
                  ? Math.round(
                      student.postureHistory.reduce((a, b) => a + b.score, 0) /
                        student.postureHistory.length
                    )
                  : 85}
                /100
              </span>
              <span className="text-[10px] text-gray-400 block">Phong độ rất tốt</span>
            </div>

            <div className="bg-[#0B192C]/80 p-3 rounded-lg border border-[#2A3B5C]">
              <span className="text-[10px] text-gray-400 block">Lần Đo Gần Nhất</span>
              <span className="text-sm font-bold text-white mt-1 block">{latestM?.date || 'Chưa đo'}</span>
              <span className="text-[10px] text-[#F6ECB7] block">{student.measurements.length} đợt đã đo</span>
            </div>
          </div>
        </Card>

        {/* Navigation Tabs for Student */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-[#102038] border border-[#2A3B5C] p-1 grid grid-cols-3 max-w-xl">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-[#FFD700] data-[state=active]:text-[#0B192C] text-xs font-bold"
            >
              📊 Chỉ Số Của Tôi
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-[#FFD700] data-[state=active]:text-[#0B192C] text-xs font-bold"
            >
              📈 Tiến Trình & Lịch Sử
            </TabsTrigger>
            <TabsTrigger
              value="ai-workouts"
              className="data-[state=active]:bg-[#FFD700] data-[state=active]:text-[#0B192C] text-xs font-bold"
            >
              🤖 Video AI Chấm Điểm ({student.postureHistory.length})
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: My Body Metrics */}
          <TabsContent value="overview" className="space-y-6 mt-0">
            <BodyMetricsCard
              student={student}
              onOpenNewMeasurementModal={() => setIsModalOpen(true)}
              canEdit={true}
            />
          </TabsContent>

          {/* Tab 2: Measurement History Table */}
          <TabsContent value="history" className="space-y-6 mt-0">
            <MeasurementHistoryTable
              student={student}
              onOpenNewModal={() => setIsModalOpen(true)}
              canEdit={true}
            />
          </TabsContent>

          {/* Tab 3: AI Workouts & Training Modules */}
          <TabsContent value="ai-workouts" className="space-y-6 mt-0">
            {/* Quick Exercise Launcher */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-[#1A2B4C] border border-[#2A3B5C] hover:border-[#FFD700]/50 transition-all p-5 text-white flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#0B192C] text-[#FFD700] flex items-center justify-center font-black text-sm mb-3 border border-[#FFD700]/30">
                    SQ
                  </div>
                  <h3 className="font-bold text-base text-white">Bài Tập Squat Chuẩn</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Đo góc gối 90 độ, kiểm soát thắt lưng và kích hoạt cơ mông đùi săn chắc.
                  </p>
                </div>
                <Button
                  onClick={() => onStartExerciseAI('squat', student.id)}
                  className="mt-4 bg-[#FFD700] hover:bg-[#ffe234] text-[#0B192C] font-bold text-xs w-full"
                >
                  Tải Video Squat Đánh Giá
                </Button>
              </Card>

              <Card className="bg-[#1A2B4C] border border-[#2A3B5C] hover:border-[#FFD700]/50 transition-all p-5 text-white flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#0B192C] text-[#FFD700] flex items-center justify-center font-black text-sm mb-3 border border-[#FFD700]/30">
                    LU
                  </div>
                  <h3 className="font-bold text-base text-white">Bài Tập Lunges Động Học</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Kiểm tra cân bằng cơ thể, tránh đổ gối vào trong và định hình vòng 3.
                  </p>
                </div>
                <Button
                  onClick={() => onStartExerciseAI('lunges', student.id)}
                  className="mt-4 bg-[#102038] hover:bg-[#1A2B4C] text-[#FFD700] border border-[#FFD700]/40 font-bold text-xs w-full"
                >
                  Tải Video Lunges Đánh Giá
                </Button>
              </Card>

              <Card className="bg-[#1A2B4C] border border-[#2A3B5C] hover:border-[#FFD700]/50 transition-all p-5 text-white flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#0B192C] text-[#FFD700] flex items-center justify-center font-black text-sm mb-3 border border-[#FFD700]/30">
                    CR
                  </div>
                  <h3 className="font-bold text-base text-white">Bài Tập Siết Cơ Lõi (Core)</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Đánh giá độ ổn định cơ hoành, siết thon gọn vòng 2 và bảo vệ cột sống.
                  </p>
                </div>
                <Button
                  onClick={() => onStartExerciseAI('core', student.id)}
                  className="mt-4 bg-[#102038] hover:bg-[#1A2B4C] text-[#FFD700] border border-[#FFD700]/40 font-bold text-xs w-full"
                >
                  Tải Video Core Đánh Giá
                </Button>
              </Card>
            </div>

            {/* List of past AI assessments */}
            <div className="space-y-4 pt-4">
              <h3 className="text-base font-bold text-[#FFD700] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FFD700]" />
                Lịch Sử Các Buổi AI Chấm Điểm Kỹ Thuật
              </h3>

              {student.postureHistory.length === 0 ? (
                <Card className="bg-[#1A2B4C] border border-[#2A3B5C] p-6 text-center text-white">
                  <p className="text-gray-400 text-xs">Bạn chưa có buổi chấm điểm video nào. Hãy bấm nút trên để tải video tập luyện đầu tiên nhé!</p>
                </Card>
              ) : (
                student.postureHistory.map((session) => (
                  <Card
                    key={session.id}
                    className="bg-[#1A2B4C] border border-[#2A3B5C] text-white p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-[#2A3B5C] pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm uppercase text-white">
                          {session.exerciseType} ({session.reps} reps)
                        </span>
                        <span className="text-xs text-gray-400">• Ngày {session.date}</span>
                      </div>
                      <span className="font-black text-xl text-[#FFD700]">{session.score}/100</span>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed">{session.feedback}</p>

                    {session.errors.length > 0 && (
                      <div className="p-2.5 bg-[#0B192C] rounded-lg border border-rose-500/30 text-xs text-rose-300">
                        <strong>Lưu ý cải thiện:</strong> {session.errors.join(', ')}
                      </div>
                    )}
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Measurement Entry Modal */}
      <StudentMeasurementFormModal
        student={student}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => onSaveMeasurement(student.id, data)}
        recordedByRole="Học viên tự ghi"
      />
    </div>
  );
}
