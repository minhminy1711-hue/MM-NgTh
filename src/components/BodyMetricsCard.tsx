import React from 'react';
import { BodyMeasurement, StudentProfile } from '../types/fitness';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateBMIClassification, calculateWHRClassification } from '../services/storageService';
import { Scale, Ruler, Flame, TrendingDown, TrendingUp, Sparkles, Activity, HeartPulse } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, RadialBarChart, RadialBar } from 'recharts';

interface BodyMetricsCardProps {
  student: StudentProfile;
  onOpenNewMeasurementModal?: () => void;
  canEdit?: boolean;
}

export default function BodyMetricsCard({
  student,
  onOpenNewMeasurementModal,
  canEdit = true,
}: BodyMetricsCardProps) {
  const measurements = student.measurements;
  if (!measurements || measurements.length === 0) {
    return (
      <Card className="bg-[#1A2B4C] border border-[#2A3B5C] p-6 text-center text-white">
        <p className="text-gray-300 mb-3">Chưa có dữ liệu chỉ số cơ thể nào được ghi nhận.</p>
        {canEdit && onOpenNewMeasurementModal && (
          <button
            onClick={onOpenNewMeasurementModal}
            className="px-4 py-2 bg-[#FFD700] text-[#0B192C] font-bold rounded-lg text-sm"
          >
            Nhập Chỉ Số Đầu Tiên
          </button>
        )}
      </Card>
    );
  }

  const latest = measurements[measurements.length - 1];
  const previous = measurements.length > 1 ? measurements[measurements.length - 2] : null;
  const initial = measurements[0];

  // Deltas from previous & initial
  const weightDelta = previous ? Number((latest.weight - previous.weight).toFixed(1)) : 0;
  const waistDelta = previous ? Number((latest.waist - previous.waist).toFixed(1)) : 0;
  const totalWaistReduction = Number((latest.waist - initial.waist).toFixed(1));
  const fatDelta = previous && latest.bodyFatPercentage && previous.bodyFatPercentage
    ? Number((latest.bodyFatPercentage - previous.bodyFatPercentage).toFixed(1))
    : 0;

  const bmiInfo = calculateBMIClassification(latest.bmi);
  const whrInfo = calculateWHRClassification(latest.whr, student.gender);

  // Circumference chart data
  const circumData = [
    { name: 'Vòng Ngực', value: latest.chest, initial: initial.chest, unit: 'cm' },
    { name: 'Vòng Eo', value: latest.waist, initial: initial.waist, unit: 'cm' },
    { name: 'Vòng Mông', value: latest.hips, initial: initial.hips, unit: 'cm' },
    { name: 'Vòng Đùi', value: latest.thigh, initial: initial.thigh, unit: 'cm' },
    ...(latest.arm ? [{ name: 'Bắp Tay', value: latest.arm, initial: initial.arm || latest.arm, unit: 'cm' }] : []),
  ];

  return (
    <div className="space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#102038] p-4 rounded-xl border border-[#2A3B5C]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30">
              Cập nhật mới nhất: {latest.date}
            </span>
            <span className="text-xs text-[#B0BEC5]">
              (Lần đo thứ #{measurements.length} • Ghi nhận bởi: {latest.recordedBy})
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Bảng Chỉ Số Nhân Trắc & Thành Phần Cơ Thể</h2>
        </div>

        {canEdit && onOpenNewMeasurementModal && (
          <button
            onClick={onOpenNewMeasurementModal}
            className="px-4 py-2 bg-[#FFD700] hover:bg-[#ffe234] text-[#0B192C] font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-md transition-all shrink-0"
          >
            <Scale className="w-4 h-4" />
            + Nhập Đo Chỉ Số Mới
          </button>
        )}
      </div>

      {/* 4 Core Summary Stat Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Weight & BMI */}
        <Card className="bg-[#1A2B4C] border-2 border-[#FFD700]/30 p-4 text-white relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-[#B0BEC5] mb-1">
            <span className="font-semibold uppercase tracking-wider">Cân Nặng & BMI</span>
            <Scale className="w-4 h-4 text-[#FFD700]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#FFD700]">{latest.weight}</span>
            <span className="text-xs text-gray-400">kg</span>
          </div>
          <div className="mt-2 pt-2 border-t border-[#2A3B5C] flex items-center justify-between text-xs">
            <span className="text-gray-300">BMI: <strong className="text-white">{latest.bmi}</strong></span>
            {weightDelta !== 0 && (
              <span className={`flex items-center font-bold text-[11px] ${weightDelta < 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {weightDelta < 0 ? <TrendingDown className="w-3 h-3 mr-0.5" /> : <TrendingUp className="w-3 h-3 mr-0.5" />}
                {weightDelta > 0 ? `+${weightDelta}` : weightDelta} kg
              </span>
            )}
          </div>
          <div className="mt-1 text-[11px] text-gray-400 truncate">
            {bmiInfo.label}
          </div>
        </Card>

        {/* Waist & WHR */}
        <Card className="bg-[#1A2B4C] border border-[#2A3B5C] p-4 text-white">
          <div className="flex items-center justify-between text-xs text-[#B0BEC5] mb-1">
            <span className="font-semibold uppercase tracking-wider">Vòng Eo & Tỉ Lệ WHR</span>
            <Ruler className="w-4 h-4 text-[#FFD700]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{latest.waist}</span>
            <span className="text-xs text-gray-400">cm</span>
          </div>
          <div className="mt-2 pt-2 border-t border-[#2A3B5C] flex items-center justify-between text-xs">
            <span className="text-gray-300">Tỷ lệ Eo/Mông: <strong className="text-white">{latest.whr}</strong></span>
            {totalWaistReduction !== 0 && (
              <span className={`font-bold text-[11px] ${totalWaistReduction < 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {totalWaistReduction > 0 ? `+${totalWaistReduction}` : totalWaistReduction} cm (tổng)
              </span>
            )}
          </div>
          <div className="mt-1 text-[11px] text-emerald-400 truncate">
            {whrInfo.label}
          </div>
        </Card>

        {/* Body Fat % & Muscle Mass */}
        <Card className="bg-[#1A2B4C] border border-[#2A3B5C] p-4 text-white">
          <div className="flex items-center justify-between text-xs text-[#B0BEC5] mb-1">
            <span className="font-semibold uppercase tracking-wider">Tỷ Lệ Mỡ & Cơ Bắp</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {latest.bodyFatPercentage ? `${latest.bodyFatPercentage}%` : '--'}
            </span>
            <span className="text-xs text-gray-400">mỡ</span>
          </div>
          <div className="mt-2 pt-2 border-t border-[#2A3B5C] flex items-center justify-between text-xs">
            <span className="text-gray-300">Khối cơ: <strong className="text-white">{latest.muscleMass || '--'} kg</strong></span>
            {fatDelta !== 0 && (
              <span className={`font-bold text-[11px] ${fatDelta < 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {fatDelta > 0 ? `+${fatDelta}` : fatDelta}%
              </span>
            )}
          </div>
          <div className="mt-1 text-[11px] text-gray-400">
            Mỡ nội tạng: Cấp {latest.visceralFat || 4}
          </div>
        </Card>

        {/* BMR & Posture Health */}
        <Card className="bg-[#1A2B4C] border border-[#2A3B5C] p-4 text-white">
          <div className="flex items-center justify-between text-xs text-[#B0BEC5] mb-1">
            <span className="font-semibold uppercase tracking-wider">Chuyển Hóa & BMR</span>
            <Activity className="w-4 h-4 text-[#FFD700]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#FFD700]">
              {latest.bmr || Math.round(10 * latest.weight + 6.25 * latest.height - 5 * (2026 - student.birthYear) - 161)}
            </span>
            <span className="text-xs text-gray-400">kcal/ngày</span>
          </div>
          <div className="mt-2 pt-2 border-t border-[#2A3B5C] flex items-center justify-between text-xs">
            <span className="text-gray-300">Chiều cao: <strong className="text-white">{latest.height} cm</strong></span>
            <span className="text-emerald-400 font-semibold">Khỏe mạnh</span>
          </div>
          <div className="mt-1 text-[11px] text-gray-400 truncate">
            {student.targetGoal}
          </div>
        </Card>
      </div>

      {/* Visual Circumferences & AI Diagnosis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Bar comparison of body circumferences */}
        <Card className="lg:col-span-2 bg-[#1A2B4C] border border-[#2A3B5C] text-white p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-base font-bold text-[#FFD700] flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                Số Đo Các Vòng Cơ Thể (Hiện Tại vs Khởi Điểm)
              </CardTitle>
              <p className="text-xs text-[#B0BEC5]">So sánh số đo các vòng để theo dõi quá trình siết cơ và giảm mỡ</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={circumData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#B0BEC5" fontSize={11} tickLine={false} />
                <YAxis stroke="#B0BEC5" fontSize={11} domain={[0, 110]} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B192C', border: '1px solid rgba(255, 215, 0, 0.3)', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: any, name: any) => [`${val} cm`, name === 'value' ? 'Hiện tại' : 'Ban đầu']}
                />
                <Bar dataKey="initial" fill="#475569" name="Ban đầu" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="value" fill="#FFD700" name="Hiện tại" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-[#2A3B5C] text-center">
            <div className="bg-[#0B192C] p-2 rounded-lg border border-[#2A3B5C]">
              <span className="text-[10px] text-gray-400 block">Vòng 1 (Ngực)</span>
              <span className="text-sm font-bold text-white">{latest.chest} cm</span>
            </div>
            <div className="bg-[#0B192C] p-2 rounded-lg border border-[#FFD700]/30">
              <span className="text-[10px] text-[#FFD700] block">Vòng 2 (Eo)</span>
              <span className="text-sm font-bold text-[#FFD700]">{latest.waist} cm</span>
            </div>
            <div className="bg-[#0B192C] p-2 rounded-lg border border-[#FFD700]/30">
              <span className="text-[10px] text-[#FFD700] block">Vòng 3 (Mông)</span>
              <span className="text-sm font-bold text-[#FFD700]">{latest.hips} cm</span>
            </div>
            <div className="bg-[#0B192C] p-2 rounded-lg border border-[#2A3B5C]">
              <span className="text-[10px] text-gray-400 block">Vòng Đùi</span>
              <span className="text-sm font-bold text-white">{latest.thigh} cm</span>
            </div>
          </div>
        </Card>

        {/* Right: AI Body Diagnosis & Trainer Advice */}
        <Card className="bg-[#1A2B4C] border border-[#2A3B5C] text-white p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-[#FFD700]" />
              <CardTitle className="text-base font-bold text-[#F6ECB7]">Đánh Giá Thể Trạng & Tư Thế</CardTitle>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-[#0B192C] border border-[#2A3B5C]">
                <div className="font-bold text-[#FFD700] mb-1">🎯 Đánh giá BMI & WHR:</div>
                <p className="text-gray-300 leading-relaxed">{bmiInfo.advice}</p>
              </div>

              <div className="p-3 rounded-lg bg-[#0B192C] border border-emerald-500/30">
                <div className="font-bold text-emerald-300 mb-1">✨ Điểm nổi bật qua các lần đo:</div>
                <p className="text-gray-300 leading-relaxed">
                  {totalWaistReduction < 0
                    ? `Vòng eo đã giảm xuất sắc ${Math.abs(totalWaistReduction)}cm từ buổi đầu nhập học (${initial.waist}cm ➔ ${latest.waist}cm).`
                    : `Chỉ số vòng eo đang duy trì ổn định ở mức ${latest.waist}cm.`}
                </p>
              </div>

              {latest.notes && (
                <div className="p-3 rounded-lg bg-[#0B192C] border border-[#2A3B5C]">
                  <div className="font-bold text-[#F6ECB7] mb-1">📝 Ghi chú từ HLV:</div>
                  <p className="text-gray-300 italic">"{latest.notes}"</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#2A3B5C] text-[11px] text-[#B0BEC5] flex items-center justify-between">
            <span>HLV: <strong className="text-white">{student.assignedTrainer}</strong></span>
            <span>Mục tiêu: <strong className="text-[#FFD700]">{student.targetGoal}</strong></span>
          </div>
        </Card>

      </div>
    </div>
  );
}
