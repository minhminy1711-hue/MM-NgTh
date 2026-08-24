import React, { useState } from 'react';
import { StudentProfile, BodyMeasurement } from '../types/fitness';
import BodyMetricsCard from './BodyMetricsCard';
import MeasurementHistoryTable from './MeasurementHistoryTable';
import StudentMeasurementFormModal from './StudentMeasurementFormModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, User, Calendar, Phone, Award, Dumbbell, Activity, Plus, CheckCircle2, AlertTriangle, Sparkles, Video, MapPin, Building2 } from 'lucide-react';

interface StudentDetailViewProps {
  student: StudentProfile;
  onBack?: () => void;
  onSaveMeasurement: (studentId: string, measurement: Omit<BodyMeasurement, 'id' | 'bmi' | 'whr'>) => void;
  onStartExerciseAI: (exerciseType: 'squat' | 'lunges' | 'core', studentId: string) => void;
  canManageAllStudents?: boolean;
}

export default function StudentDetailView({
  student,
  onBack,
  onSaveMeasurement,
  onStartExerciseAI,
  canManageAllStudents = false,
}: StudentDetailViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const latestM = student.measurements[student.measurements.length - 1];
  const isCS1 = student.branch === 'HD Nguyễn Văn Trỗi- CS1';

  const handleSaveMeasurement = (data: Omit<BodyMeasurement, 'id' | 'bmi' | 'whr'>) => {
    onSaveMeasurement(student.id, data);
  };

  return (
    <div className="min-h-screen bg-[#0B192C] text-white p-4 md:p-8 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button
                variant="outline"
                size="icon"
                onClick={onBack}
                className="rounded-full border-[#F6ECB7]/30 text-white hover:bg-[#1A2B4C]"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FFD700] tracking-wide">
                  {student.name}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#102038] text-[#F6ECB7] border border-[#FFD700]/30 font-mono">
                  {student.id}
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
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                  Đang hoạt động
                </span>
              </div>
              <p className="text-xs text-[#B0BEC5] mt-0.5">
                Mục tiêu: <strong className="text-white">{student.targetGoal}</strong> • HLV: {student.assignedTrainer}
              </p>
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#102038] hover:bg-[#1A2B4C] text-[#FFD700] border border-[#FFD700]/40 text-xs font-bold gap-1.5 h-9"
            >
              <Plus className="w-4 h-4" />
              Nhập Chỉ Số Đo
            </Button>
            <Button
              onClick={() => onStartExerciseAI('squat', student.id)}
              className="bg-[#FFD700] hover:bg-[#ffe234] text-[#0B192C] font-bold text-xs gap-1.5 h-9 shadow-lg"
            >
              <Dumbbell className="w-4 h-4" />
              Tập AI Ngay
            </Button>
          </div>
        </div>

        {/* Student Profile Quick Strip */}
        <Card className="bg-[#1A2B4C] border border-[#2A3B5C] p-4 text-white">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 text-xs">
            <div className="bg-[#0B192C] p-2.5 rounded-lg border border-[#2A3B5C]">
              <span className="text-[10px] text-[#B0BEC5] block">Năm Sinh / Giới Tính</span>
              <span className="font-bold text-white">{student.birthYear} • {student.gender === 'female' ? 'Nữ' : 'Nam'}</span>
            </div>
            <div className="bg-[#0B192C] p-2.5 rounded-lg border border-[#2A3B5C]">
              <span className="text-[10px] text-[#B0BEC5] block">Số Điện Thoại</span>
              <span className="font-bold text-white">{student.phone}</span>
            </div>
            <div className="bg-[#0B192C] p-2.5 rounded-lg border border-[#2A3B5C]">
              <span className="text-[10px] text-[#B0BEC5] block">Ngày Nhập Học</span>
              <span className="font-bold text-white">{student.joinDate}</span>
            </div>
            <div className="bg-[#0B192C] p-2.5 rounded-lg border border-[#2A3B5C]">
              <span className="text-[10px] text-[#B0BEC5] block">Số Lần Đo InBody</span>
              <span className="font-bold text-[#FFD700]">{student.measurements.length} lần</span>
            </div>
            <div className="bg-[#0B192C] p-2.5 rounded-lg border border-[#2A3B5C]">
              <span className="text-[10px] text-[#B0BEC5] block">Số Buổi AI Chấm Điểm</span>
              <span className="font-bold text-[#FFD700]">{student.postureHistory.length} buổi</span>
            </div>
            <div className="bg-[#0B192C] p-2.5 rounded-lg border border-[#2A3B5C]">
              <span className="text-[10px] text-[#B0BEC5] block">Điểm Tư Thế AI TB</span>
              <span className="font-bold text-emerald-400">
                {student.postureHistory.length > 0
                  ? Math.round(
                      student.postureHistory.reduce((a, b) => a + b.score, 0) /
                        student.postureHistory.length
                    )
                  : 85}
                /100
              </span>
            </div>
          </div>
        </Card>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-[#102038] border border-[#2A3B5C] p-1 grid grid-cols-3 max-w-xl">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-[#FFD700] data-[state=active]:text-[#0B192C] text-xs font-bold"
            >
              📊 Chỉ Số Cơ Thể
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-[#FFD700] data-[state=active]:text-[#0B192C] text-xs font-bold"
            >
              📈 Biến Thiên Đo Lường
            </TabsTrigger>
            <TabsTrigger
              value="posture"
              className="data-[state=active]:bg-[#FFD700] data-[state=active]:text-[#0B192C] text-xs font-bold"
            >
              🤖 Đánh Giá Tư Thế AI ({student.postureHistory.length})
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Body Metrics Card */}
          <TabsContent value="overview" className="space-y-6 mt-0">
            <BodyMetricsCard
              student={student}
              onOpenNewMeasurementModal={() => setIsModalOpen(true)}
              canEdit={true}
            />
          </TabsContent>

          {/* Tab 2: Measurement History Table & Graphs */}
          <TabsContent value="history" className="space-y-6 mt-0">
            <MeasurementHistoryTable
              student={student}
              onOpenNewModal={() => setIsModalOpen(true)}
              canEdit={true}
            />
          </TabsContent>

          {/* Tab 3: AI Posture Assessments */}
          <TabsContent value="posture" className="space-y-6 mt-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#102038] p-4 rounded-xl border border-[#2A3B5C]">
              <div>
                <h3 className="text-lg font-bold text-[#FFD700] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#FFD700]" />
                  Lịch Sử Đánh Giá Động Học Tư Thế Bằng Video AI
                </h3>
                <p className="text-xs text-[#B0BEC5]">
                  Phân tích kỹ thuật các bài tập Squat, Lunges và Siết Cơ Lõi (Core)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => onStartExerciseAI('squat', student.id)}
                  className="bg-[#FFD700] text-[#0B192C] hover:bg-[#ffe234] font-bold text-xs"
                >
                  + Phân Tích Video Squat
                </Button>
                <Button
                  size="sm"
                  onClick={() => onStartExerciseAI('lunges', student.id)}
                  className="bg-[#102038] text-white border border-[#2A3B5C] hover:bg-[#1A2B4C] font-bold text-xs"
                >
                  + Lunges
                </Button>
                <Button
                  size="sm"
                  onClick={() => onStartExerciseAI('core', student.id)}
                  className="bg-[#102038] text-white border border-[#2A3B5C] hover:bg-[#1A2B4C] font-bold text-xs"
                >
                  + Core
                </Button>
              </div>
            </div>

            {student.postureHistory.length === 0 ? (
              <Card className="bg-[#1A2B4C] border border-[#2A3B5C] p-8 text-center text-white">
                <Video className="w-12 h-12 text-[#FFD700] mx-auto mb-3 opacity-60" />
                <p className="font-bold text-lg mb-1">Chưa có buổi đánh giá video AI nào</p>
                <p className="text-xs text-gray-400 max-w-md mx-auto mb-4">
                  Hãy quay hoặc tải lên video bài tập Squat, Lunges hoặc Vòng Eo Core của học viên để AI phân tích góc gối, số reps và độ cân bằng!
                </p>
                <Button
                  onClick={() => onStartExerciseAI('squat', student.id)}
                  className="bg-[#FFD700] text-[#0B192C] font-bold text-xs"
                >
                  Bắt Đầu Phân Tích Video Ngay
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {student.postureHistory.map((session) => (
                  <Card
                    key={session.id}
                    className="bg-[#1A2B4C] border border-[#2A3B5C] text-white p-5 hover:border-[#FFD700]/40 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#2A3B5C] pb-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#0B192C] flex items-center justify-center font-bold text-xs uppercase border border-[#FFD700]/30 text-[#FFD700]">
                          {session.exerciseType}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-base uppercase text-white">
                              Bài Tập {session.exerciseType.toUpperCase()}
                            </span>
                            <span className="text-[11px] text-[#B0BEC5] px-2 py-0.5 rounded bg-[#0B192C]">
                              {session.date}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400">
                            Số lần thực hiện chuẩn: <strong className="text-white">{session.reps} reps</strong>
                            {session.kneeAngle && ` • Góc gối: ${session.kneeAngle}°`}
                            {session.balance && ` • Độ thăng bằng: ${session.balance}%`}
                          </p>
                        </div>
                      </div>

                      {/* Score Badge */}
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <span className="text-[10px] text-gray-400 block uppercase">Điểm AI</span>
                          <span
                            className={`text-2xl font-black ${
                              session.score >= 85
                                ? 'text-emerald-400'
                                : session.score >= 70
                                ? 'text-[#FFD700]'
                                : 'text-rose-400'
                            }`}
                          >
                            {session.score}
                            <span className="text-xs text-gray-400">/100</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Feedback & Errors */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-[#0B192C] rounded-lg border border-[#2A3B5C]">
                        <div className="font-bold text-[#FFD700] mb-1 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Nhận Xét Kỹ Thuật Động Học:
                        </div>
                        <p className="text-gray-300 leading-relaxed">{session.feedback}</p>
                      </div>

                      <div className="p-3 bg-[#0B192C] rounded-lg border border-[#2A3B5C]">
                        <div className="font-bold text-[#F6ECB7] mb-1 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          Lỗi Tư Thế Cần Khắc Phục:
                        </div>
                        {session.errors.length === 0 ? (
                          <p className="text-emerald-400">Không phát hiện lỗi tư thế nghiêm trọng. Tư thế chuẩn!</p>
                        ) : (
                          <ul className="list-disc list-inside text-rose-300 space-y-0.5">
                            {session.errors.map((err, i) => (
                              <li key={i}>{err}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Measurement Entry Modal */}
      <StudentMeasurementFormModal
        student={student}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMeasurement}
        recordedByRole={canManageAllStudents ? 'HLV Trưởng' : 'Học viên tự ghi'}
      />
    </div>
  );
}
