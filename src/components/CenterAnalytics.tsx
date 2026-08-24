import React, { useState } from 'react';
import { StudentProfile, BranchLocation } from '../types/fitness';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { Activity, Sparkles, TrendingDown, Users, Flame, Award, Building2, MapPin } from 'lucide-react';

interface CenterAnalyticsProps {
  students: StudentProfile[];
}

export default function CenterAnalytics({ students }: CenterAnalyticsProps) {
  const [selectedBranch, setSelectedBranch] = useState<'all' | BranchLocation>('all');

  const filteredStudents = selectedBranch === 'all'
    ? students
    : students.filter((s) => s.branch === selectedBranch);

  const cs1Students = students.filter((s) => s.branch === 'HD Nguyễn Văn Trỗi- CS1');
  const cs3Students = students.filter((s) => s.branch === 'HD Phạm Đình Toái- CS3');

  // Goal distribution
  const goalCounts: Record<string, number> = {};
  filteredStudents.forEach((s) => {
    goalCounts[s.targetGoal] = (goalCounts[s.targetGoal] || 0) + 1;
  });

  const goalPieData = Object.entries(goalCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ['#FFD700', '#4ade80', '#38bdf8', '#f43f5e', '#a855f7'];

  // Student progress comparison
  const studentComparisonData = filteredStudents.map((s) => {
    const firstM = s.measurements[0];
    const lastM = s.measurements[s.measurements.length - 1];
    const waistDrop = firstM && lastM ? Number((firstM.waist - lastM.waist).toFixed(1)) : 0;
    const currentWeight = lastM ? lastM.weight : 0;
    const currentWaist = lastM ? lastM.waist : 0;
    const avgAiScore = s.postureHistory.length > 0
      ? Math.round(s.postureHistory.reduce((a, b) => a + b.score, 0) / s.postureHistory.length)
      : 85;

    return {
      name: `${s.name.split(' ').slice(-2).join(' ')} (${s.branch === 'HD Nguyễn Văn Trỗi- CS1' ? 'CS1' : 'CS3'})`,
      vòng_eo_hiện_tại: currentWaist,
      số_cm_eo_đã_giảm: Math.max(0, waistDrop),
      điểm_AI_tư_thế: avgAiScore,
      cân_nặng: currentWeight,
      cơ_sở: s.branch,
    };
  });

  // Branch comparative data
  const branchCompareData = [
    {
      cơ_sở: 'CS1 - Ng.Văn Trỗi',
      học_viên: cs1Students.length,
      đợt_đo: cs1Students.reduce((sum, s) => sum + s.measurements.length, 0),
      buổi_AI: cs1Students.reduce((sum, s) => sum + s.postureHistory.length, 0),
    },
    {
      cơ_sở: 'CS3 - Phạm Đình Toái',
      học_viên: cs3Students.length,
      đợt_đo: cs3Students.reduce((sum, s) => sum + s.measurements.length, 0),
      buổi_AI: cs3Students.reduce((sum, s) => sum + s.postureHistory.length, 0),
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B192C] text-white p-4 md:p-8 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Branch Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded bg-[#FFD700]/20 text-[#FFD700] font-bold border border-[#FFD700]/40 uppercase tracking-wider">
                Báo Cáo Tổng Hợp
              </span>
              <span className="text-xs text-[#B0BEC5] flex items-center gap-1">
                <Building2 className="w-3 h-3 text-[#FFD700]" />
                2 Cơ Sở Hoạt Động
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Thống Kê Thể Trạng & Hiệu Quả Tập Luyện Theo Cơ Sở
            </h1>
            <p className="text-xs text-[#B0BEC5] mt-1">
              Tổng hợp dữ liệu nhân trắc cơ thể và chỉ số cải thiện tư thế của học viên HD Nguyễn Văn Trỗi & HD Phạm Đình Toái
            </p>
          </div>

          {/* Branch Filter Segment */}
          <div className="flex items-center gap-1.5 p-1 bg-[#1A2B4C] rounded-xl border border-[#2A3B5C] shrink-0 overflow-x-auto">
            <button
              type="button"
              onClick={() => setSelectedBranch('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                selectedBranch === 'all'
                  ? 'bg-[#FFD700] text-[#0B192C] shadow-md'
                  : 'text-[#B0BEC5] hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Tất Cả ({students.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedBranch('HD Nguyễn Văn Trỗi- CS1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                selectedBranch === 'HD Nguyễn Văn Trỗi- CS1'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-[#B0BEC5] hover:text-sky-300'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              CS1 ({cs1Students.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedBranch('HD Phạm Đình Toái- CS3')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                selectedBranch === 'HD Phạm Đình Toái- CS3'
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
                  : 'text-[#B0BEC5] hover:text-amber-300'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              CS3 ({cs3Students.length})
            </button>
          </div>
        </div>

        {/* Branch Comparison Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-[#1A2B4C] border-2 border-sky-500/30 p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-sky-400" />
                <h3 className="font-extrabold text-sm text-sky-300">HD Nguyễn Văn Trỗi- CS1</h3>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 font-bold border border-sky-500/30">
                {cs1Students.length} học viên
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs mt-3">
              <div className="bg-[#0B192C] p-2 rounded-lg border border-[#2A3B5C]">
                <span className="text-[10px] text-gray-400 block">Đợt Đo InBody</span>
                <span className="font-bold text-[#FFD700] text-sm">
                  {cs1Students.reduce((sum, s) => sum + s.measurements.length, 0)}
                </span>
              </div>
              <div className="bg-[#0B192C] p-2 rounded-lg border border-[#2A3B5C]">
                <span className="text-[10px] text-gray-400 block">Buổi AI Tư Thế</span>
                <span className="font-bold text-emerald-400 text-sm">
                  {cs1Students.reduce((sum, s) => sum + s.postureHistory.length, 0)}
                </span>
              </div>
              <div className="bg-[#0B192C] p-2 rounded-lg border border-[#2A3B5C]">
                <span className="text-[10px] text-gray-400 block">HLV Phụ Trách</span>
                <span className="font-bold text-white text-xs">Võ Minh Quân, Tuấn</span>
              </div>
            </div>
          </Card>

          <Card className="bg-[#1A2B4C] border-2 border-amber-500/30 p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <h3 className="font-extrabold text-sm text-amber-300">HD Phạm Đình Toái- CS3</h3>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 font-bold border border-amber-500/30">
                {cs3Students.length} học viên
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs mt-3">
              <div className="bg-[#0B192C] p-2 rounded-lg border border-[#2A3B5C]">
                <span className="text-[10px] text-gray-400 block">Đợt Đo InBody</span>
                <span className="font-bold text-[#FFD700] text-sm">
                  {cs3Students.reduce((sum, s) => sum + s.measurements.length, 0)}
                </span>
              </div>
              <div className="bg-[#0B192C] p-2 rounded-lg border border-[#2A3B5C]">
                <span className="text-[10px] text-gray-400 block">Buổi AI Tư Thế</span>
                <span className="font-bold text-emerald-400 text-sm">
                  {cs3Students.reduce((sum, s) => sum + s.postureHistory.length, 0)}
                </span>
              </div>
              <div className="bg-[#0B192C] p-2 rounded-lg border border-[#2A3B5C]">
                <span className="text-[10px] text-gray-400 block">HLV Phụ Trách</span>
                <span className="font-bold text-white text-xs">Nguyễn Văn Tuấn, Quân</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Chart 1: Waist reduction progress by student */}
          <Card className="bg-[#1A2B4C] border border-[#2A3B5C] p-5 text-white">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-base font-bold text-[#FFD700] flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                Mức Giảm Vòng Eo (cm) Theo Học Viên
              </CardTitle>
              <p className="text-xs text-[#B0BEC5]">
                {selectedBranch === 'all' ? 'Toàn bộ học viên 2 cơ sở' : `Học viên tại ${selectedBranch}`}
              </p>
            </CardHeader>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studentComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#B0BEC5" fontSize={11} tickLine={false} />
                  <YAxis stroke="#B0BEC5" fontSize={11} domain={[0, 10]} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B192C', border: '1px solid rgba(255, 215, 0, 0.3)', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(val: any) => [`${val} cm`, 'Eo đã giảm']}
                  />
                  <Bar dataKey="số_cm_eo_đã_giảm" fill="#4ade80" radius={[4, 4, 0, 0]} barSize={28}>
                    {studentComparisonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.cơ_sở === 'HD Nguyễn Văn Trỗi- CS1' ? '#38bdf8' : '#FFD700'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Chart 2: Goal Distribution */}
          <Card className="bg-[#1A2B4C] border border-[#2A3B5C] p-5 text-white">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-base font-bold text-[#FFD700] flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Cơ Cấu Mục Tiêu Thể Chất ({filteredStudents.length} Học Viên)
              </CardTitle>
              <p className="text-xs text-[#B0BEC5]">Phân bố theo nhu cầu tập luyện tại trung tâm</p>
            </CardHeader>

            <div className="h-64 w-full flex flex-col sm:flex-row items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={goalPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {goalPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B192C', border: '1px solid rgba(255, 215, 0, 0.3)', borderRadius: '8px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 text-xs pr-4 shrink-0">
                {goalPieData.map((item, idx) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="text-gray-300">{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Chart 3: AI Posture Scores across students */}
          <Card className="lg:col-span-2 bg-[#1A2B4C] border border-[#2A3B5C] p-5 text-white">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-base font-bold text-[#FFD700] flex items-center gap-2">
                <Award className="w-4 h-4" />
                Điểm Đánh Giá Tư Thế Động Học AI Trung Bình
              </CardTitle>
              <p className="text-xs text-[#B0BEC5]">Điểm số kỹ thuật động tác Squat, Lunges và Core chấm bởi AI</p>
            </CardHeader>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studentComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A3B5C" vertical={false} />
                  <XAxis dataKey="name" stroke="#B0BEC5" fontSize={11} tickLine={false} />
                  <YAxis stroke="#B0BEC5" fontSize={11} domain={[0, 100]} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B192C', border: '1px solid rgba(255, 215, 0, 0.3)', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(val: any) => [`${val}/100`, 'Điểm AI']}
                  />
                  <Bar dataKey="điểm_AI_tư_thế" fill="#FFD700" radius={[4, 4, 0, 0]} barSize={32}>
                    {studentComparisonData.map((entry, index) => (
                      <Cell key={`cell-ai-${index}`} fill={entry.cơ_sở === 'HD Nguyễn Văn Trỗi- CS1' ? '#38bdf8' : '#FFD700'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

        </div>

      </div>
    </div>
  );
}
