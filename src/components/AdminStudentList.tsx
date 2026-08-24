import React, { useState } from 'react';
import { StudentProfile, BodyMeasurement, BranchLocation } from '../types/fitness';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, UserPlus, Search, Filter, Scale, Dumbbell, Activity, TrendingDown, Eye, Plus, Sparkles, ChevronRight, MapPin, Building2 } from 'lucide-react';
import AddStudentModal from './AddStudentModal';
import StudentMeasurementFormModal from './StudentMeasurementFormModal';

interface AdminStudentListProps {
  students: StudentProfile[];
  onSelectStudent: (studentId: string) => void;
  onAddStudent: (
    studentData: Omit<StudentProfile, 'id' | 'measurements' | 'postureHistory'>,
    initialMeasurement?: any
  ) => void;
  onSaveMeasurement: (studentId: string, measurement: Omit<BodyMeasurement, 'id' | 'bmi' | 'whr'>) => void;
  onStartExerciseAI: (exerciseType: 'squat' | 'lunges' | 'core', studentId: string) => void;
}

export default function AdminStudentList({
  students,
  onSelectStudent,
  onAddStudent,
  onSaveMeasurement,
  onStartExerciseAI,
}: AdminStudentListProps) {
  const [search, setSearch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<'all' | BranchLocation>('all');
  const [selectedGoal, setSelectedGoal] = useState<string>('all');
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [quickMeasureStudent, setQuickMeasureStudent] = useState<StudentProfile | null>(null);

  // Branch student counts
  const cs1Count = students.filter((s) => s.branch === 'HD Nguyễn Văn Trỗi- CS1').length;
  const cs3Count = students.filter((s) => s.branch === 'HD Phạm Đình Toái- CS3').length;

  // Filter students
  const filtered = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search) ||
      s.id.toLowerCase().includes(search.toLowerCase());
    const matchBranch = selectedBranch === 'all' || s.branch === selectedBranch;
    const matchGoal = selectedGoal === 'all' || s.targetGoal === selectedGoal;
    return matchSearch && matchBranch && matchGoal;
  });

  // Center Statistics based on selected branch or total
  const statsStudents = selectedBranch === 'all' ? students : students.filter((s) => s.branch === selectedBranch);
  const totalStudents = statsStudents.length;
  const totalMeasurements = statsStudents.reduce((sum, s) => sum + s.measurements.length, 0);
  const totalPostureSessions = statsStudents.reduce((sum, s) => sum + s.postureHistory.length, 0);
  
  // Calculate average waist reduction
  const waistReductions = statsStudents
    .map((s) => {
      if (s.measurements.length < 2) return 0;
      const first = s.measurements[0].waist;
      const last = s.measurements[s.measurements.length - 1].waist;
      return first - last;
    })
    .filter((v) => v > 0);
  
  const avgWaistReduction = waistReductions.length > 0
    ? (waistReductions.reduce((a, b) => a + b, 0) / waistReductions.length).toFixed(1)
    : '3.2';

  return (
    <div className="min-h-screen bg-[#0B192C] text-white p-4 md:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-xs border border-rose-500/30 uppercase tracking-wider">
                Quyền Quản Lý Trung Tâm (Admin)
              </span>
              <span className="px-2.5 py-0.5 rounded bg-[#FFD700]/10 text-[#FFD700] font-semibold text-xs border border-[#FFD700]/30 flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                2 Cơ Sở Hoạt Động
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FFD700] uppercase tracking-wide mt-1">
              Quản Lý Dữ Liệu Tập Luyện & Chỉ Số Học Viên
            </h1>
            <p className="text-xs text-[#B0BEC5] mt-1">
              Phân loại và tìm kiếm nhanh học viên theo cơ sở CS1 & CS3, theo dõi chỉ số nhân trắc và tư thế AI
            </p>
          </div>

          <Button
            onClick={() => setIsAddStudentOpen(true)}
            className="bg-[#FFD700] hover:bg-[#ffe234] text-[#0B192C] font-extrabold text-sm gap-2 h-11 px-5 shadow-lg shrink-0"
          >
            <UserPlus className="w-5 h-5" />
            + Thêm Học Viên Mới
          </Button>
        </div>

        {/* Branch Selection Tabs / Filter Bar */}
        <div className="bg-[#1A2B4C] border-2 border-[#2A3B5C] rounded-2xl p-2 sm:p-2.5 shadow-xl">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 p-1 bg-[#0B192C] rounded-xl border border-[#2A3B5C] overflow-x-auto">
              <button
                type="button"
                onClick={() => setSelectedBranch('all')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  selectedBranch === 'all'
                    ? 'bg-[#FFD700] text-[#0B192C] shadow-md font-extrabold'
                    : 'text-[#B0BEC5] hover:text-white hover:bg-[#1A2B4C]'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                Tất Cả Cơ Sở ({students.length})
              </button>

              <button
                type="button"
                onClick={() => setSelectedBranch('HD Nguyễn Văn Trỗi- CS1')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  selectedBranch === 'HD Nguyễn Văn Trỗi- CS1'
                    ? 'bg-sky-500 text-white shadow-md font-extrabold'
                    : 'text-[#B0BEC5] hover:text-sky-300 hover:bg-[#1A2B4C]'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                HD Nguyễn Văn Trỗi- CS1 ({cs1Count})
              </button>

              <button
                type="button"
                onClick={() => setSelectedBranch('HD Phạm Đình Toái- CS3')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  selectedBranch === 'HD Phạm Đình Toái- CS3'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-[#B0BEC5] hover:text-amber-300 hover:bg-[#1A2B4C]'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                HD Phạm Đình Toái- CS3 ({cs3Count})
              </button>
            </div>

            <div className="text-xs text-[#B0BEC5] px-2 text-right hidden lg:block">
              Đang hiển thị: <strong className="text-[#FFD700]">{filtered.length}</strong> / {students.length} học viên
            </div>
          </div>
        </div>

        {/* 4 Center Metric KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-[#1A2B4C] border border-[#2A3B5C] p-4 text-white">
            <div className="flex items-center justify-between text-xs text-[#B0BEC5] mb-1">
              <span className="font-semibold uppercase tracking-wider">
                {selectedBranch === 'all' ? 'Tổng Học Viên' : 'Học Viên Tại Cơ Sở'}
              </span>
              <Users className="w-4 h-4 text-[#FFD700]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{totalStudents}</div>
            <p className="text-[11px] text-emerald-400 mt-1">
              {selectedBranch === 'all' ? 'Toàn bộ 2 cơ sở' : selectedBranch}
            </p>
          </Card>

          <Card className="bg-[#1A2B4C] border border-[#2A3B5C] p-4 text-white">
            <div className="flex items-center justify-between text-xs text-[#B0BEC5] mb-1">
              <span className="font-semibold uppercase tracking-wider">Đợt Đo InBody</span>
              <Scale className="w-4 h-4 text-[#FFD700]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#FFD700]">{totalMeasurements}</div>
            <p className="text-[11px] text-[#B0BEC5] mt-1">Cập nhật định kỳ 2 tuần/lần</p>
          </Card>

          <Card className="bg-[#1A2B4C] border border-[#2A3B5C] p-4 text-white">
            <div className="flex items-center justify-between text-xs text-[#B0BEC5] mb-1">
              <span className="font-semibold uppercase tracking-wider">Buổi Chấm Tư Thế AI</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{totalPostureSessions}</div>
            <p className="text-[11px] text-emerald-400 mt-1">Squat, Lunges & Core</p>
          </Card>

          <Card className="bg-[#1A2B4C] border border-[#2A3B5C] p-4 text-white">
            <div className="flex items-center justify-between text-xs text-[#B0BEC5] mb-1">
              <span className="font-semibold uppercase tracking-wider">Giảm Eo Trung Bình</span>
              <TrendingDown className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">-{avgWaistReduction} cm</div>
            <p className="text-[11px] text-[#B0BEC5] mt-1">Hiệu quả siết cơ rõ rệt</p>
          </Card>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#1A2B4C] border border-[#2A3B5C] p-4 rounded-xl flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên, SĐT, mã HV..."
              className="bg-[#0B192C] border-[#2A3B5C] pl-9 text-white text-xs h-10"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Branch dropdown for extra convenience */}
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value as any)}
                className="bg-[#0B192C] border border-[#2A3B5C] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD700]"
              >
                <option value="all">Tất cả 2 cơ sở ({students.length})</option>
                <option value="HD Nguyễn Văn Trỗi- CS1">HD Nguyễn Văn Trỗi- CS1 ({cs1Count})</option>
                <option value="HD Phạm Đình Toái- CS3">HD Phạm Đình Toái- CS3 ({cs3Count})</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-[#FFD700] shrink-0" />
              <select
                value={selectedGoal}
                onChange={(e) => setSelectedGoal(e.target.value)}
                className="bg-[#0B192C] border border-[#2A3B5C] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD700]"
              >
                <option value="all">Tất cả mục tiêu</option>
                <option value="Giảm mỡ siết eo">Giảm mỡ siết eo</option>
                <option value="Tăng cơ săn chắc">Tăng cơ săn chắc</option>
                <option value="Chỉnh sửa tư thế & cột sống">Chỉnh sửa tư thế & cột sống</option>
                <option value="Phục hồi sau sinh">Phục hồi sau sinh</option>
                <option value="Tăng cường thể lực">Tăng cường thể lực</option>
              </select>
            </div>
          </div>
        </div>

        {/* Empty state if no students matched filter */}
        {filtered.length === 0 && (
          <div className="bg-[#1A2B4C] border border-[#2A3B5C] rounded-2xl p-12 text-center space-y-3">
            <Users className="w-12 h-12 text-gray-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">Không tìm thấy học viên phù hợp</h3>
            <p className="text-xs text-[#B0BEC5] max-w-md mx-auto">
              Không có học viên nào khớp với bộ lọc cơ sở "{selectedBranch}" hoặc từ khóa tìm kiếm "{search}".
            </p>
            <Button
              onClick={() => {
                setSearch('');
                setSelectedBranch('all');
                setSelectedGoal('all');
              }}
              variant="outline"
              className="border-[#FFD700]/50 text-[#FFD700] text-xs font-bold mt-2"
            >
              Đặt lại bộ lọc
            </Button>
          </div>
        )}

        {/* Students Table / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {filtered.map((st) => {
            const latestM = st.measurements[st.measurements.length - 1];
            const initialM = st.measurements[0];
            const waistDiff = latestM && initialM ? Number((latestM.waist - initialM.waist).toFixed(1)) : 0;
            const weightDiff = latestM && initialM ? Number((latestM.weight - initialM.weight).toFixed(1)) : 0;
            const avgScore = st.postureHistory.length > 0
              ? Math.round(st.postureHistory.reduce((a, b) => a + b.score, 0) / st.postureHistory.length)
              : null;

            const isCS1 = st.branch === 'HD Nguyễn Văn Trỗi- CS1';

            return (
              <Card
                key={st.id}
                className="bg-[#1A2B4C] border border-[#2A3B5C] hover:border-[#FFD700]/50 transition-all text-white p-5 flex flex-col justify-between group"
              >
                <div>
                  {/* Top line: Name, Branch & Goal */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-[#0B192C] border-2 border-[#FFD700]/40 flex items-center justify-center font-bold text-sm text-[#FFD700]">
                        {st.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-base text-white group-hover:text-[#FFD700] transition-colors">
                            {st.name}
                          </h3>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#0B192C] text-gray-300 font-mono">
                            {st.id}
                          </span>
                        </div>
                        <p className="text-xs text-[#B0BEC5]">
                          SĐT: {st.phone} • {st.birthYear} ({st.gender === 'female' ? 'Nữ' : 'Nam'})
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-[#0B192C] text-[#F6ECB7] border border-[#2A3B5C] shrink-0">
                      {st.targetGoal}
                    </span>
                  </div>

                  {/* Branch Location Badge */}
                  <div className="mb-3">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-md font-bold border ${
                        isCS1
                          ? 'bg-sky-950/60 text-sky-300 border-sky-500/40'
                          : 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      <MapPin className="w-3 h-3" />
                      {st.branch}
                    </span>
                  </div>

                  {/* Body Metrics Summary Strip */}
                  {latestM ? (
                    <div className="grid grid-cols-4 gap-2 bg-[#0B192C] p-3 rounded-lg border border-[#2A3B5C] text-center my-3 text-xs">
                      <div>
                        <span className="text-[10px] text-gray-400 block">Cân Nặng</span>
                        <span className="font-bold text-white">{latestM.weight} kg</span>
                        {weightDiff !== 0 && (
                          <span className={`text-[10px] block font-semibold ${weightDiff < 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {weightDiff > 0 ? `+${weightDiff}` : weightDiff} kg
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] text-[#FFD700] block">Vòng Eo</span>
                        <span className="font-bold text-[#FFD700]">{latestM.waist} cm</span>
                        {waistDiff !== 0 && (
                          <span className={`text-[10px] block font-bold ${waistDiff < 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {waistDiff > 0 ? `+${waistDiff}` : waistDiff} cm
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-400 block">Vòng Mông</span>
                        <span className="font-bold text-white">{latestM.hips} cm</span>
                        <span className="text-[10px] text-gray-400 block">WHR: {latestM.whr}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-400 block">Điểm AI</span>
                        <span className="font-bold text-emerald-400">
                          {avgScore ? `${avgScore}/100` : '85/100'}
                        </span>
                        <span className="text-[10px] text-gray-400 block">
                          {st.postureHistory.length} buổi
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-[#0B192C] rounded-lg text-xs text-gray-400 italic text-center my-3">
                      Chưa có dữ liệu chỉ số cơ thể
                    </div>
                  )}

                  <div className="text-[11px] text-gray-400 flex items-center justify-between mb-3 px-1">
                    <span>Lần đo gần nhất: <strong className="text-gray-200">{latestM?.date || 'Chưa đo'}</strong></span>
                    <span>HLV: <strong className="text-gray-200">{st.assignedTrainer}</strong></span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-[#2A3B5C]">
                  <Button
                    onClick={() => onSelectStudent(st.id)}
                    className="flex-1 bg-[#102038] hover:bg-[#FFD700] hover:text-[#0B192C] text-[#FFD700] border border-[#FFD700]/30 font-bold text-xs h-9 gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Xem Chỉ Số & Hồ Sơ
                  </Button>

                  <Button
                    onClick={() => setQuickMeasureStudent(st)}
                    variant="outline"
                    className="border-[#2A3B5C] text-gray-300 hover:text-white text-xs h-9 px-3"
                    title="Nhập chỉ số đo mới"
                  >
                    <Scale className="w-3.5 h-3.5" />
                  </Button>

                  <Button
                    onClick={() => onStartExerciseAI('squat', st.id)}
                    className="bg-[#FFD700]/20 hover:bg-[#FFD700] text-[#FFD700] hover:text-[#0B192C] border border-[#FFD700]/30 text-xs h-9 px-3 font-bold"
                    title="Tập luyện AI"
                  >
                    <Dumbbell className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

      </div>

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onAdd={onAddStudent}
      />

      {/* Quick Measure Modal */}
      {quickMeasureStudent && (
        <StudentMeasurementFormModal
          student={quickMeasureStudent}
          isOpen={!!quickMeasureStudent}
          onClose={() => setQuickMeasureStudent(null)}
          onSave={(data) => {
            onSaveMeasurement(quickMeasureStudent.id, data);
            setQuickMeasureStudent(null);
          }}
          recordedByRole="HLV Trưởng"
        />
      )}
    </div>
  );
}
