import React, { useState } from 'react';
import { BodyMeasurement, StudentProfile } from '../types/fitness';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Ruler, Scale, HeartPulse, Activity, Check, Sparkles } from 'lucide-react';
import { calculateBMIClassification, calculateWHRClassification } from '../services/storageService';

interface MeasurementModalProps {
  student: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (measurement: Omit<BodyMeasurement, 'id' | 'bmi' | 'whr'>) => void;
  recordedByRole?: string;
}

export default function StudentMeasurementFormModal({
  student,
  isOpen,
  onClose,
  onSave,
  recordedByRole = 'HLV Trung Tâm',
}: MeasurementModalProps) {
  const latestM = student.measurements[student.measurements.length - 1];

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [height, setHeight] = useState<number>(latestM?.height || 160);
  const [weight, setWeight] = useState<number>(latestM?.weight || 55);
  const [bodyFat, setBodyFat] = useState<number>(latestM?.bodyFatPercentage || 24);
  const [muscleMass, setMuscleMass] = useState<number>(latestM?.muscleMass || 21);
  const [visceralFat, setVisceralFat] = useState<number>(latestM?.visceralFat || 4);
  const [bmr, setBmr] = useState<number>(latestM?.bmr || 1280);

  const [chest, setChest] = useState<number>(latestM?.chest || 85);
  const [waist, setWaist] = useState<number>(latestM?.waist || 68);
  const [hips, setHips] = useState<number>(latestM?.hips || 92);
  const [thigh, setThigh] = useState<number>(latestM?.thigh || 52);
  const [arm, setArm] = useState<number>(latestM?.arm || 25);
  const [notes, setNotes] = useState<string>('');
  const [recorder, setRecorder] = useState<string>(recordedByRole);

  if (!isOpen) return null;

  // Live calculations
  const heightM = height > 0 ? height / 100 : 1.6;
  const calculatedBMI = weight > 0 && heightM > 0 ? Number((weight / (heightM * heightM)).toFixed(2)) : 0;
  const calculatedWHR = hips > 0 && waist > 0 ? Number((waist / hips).toFixed(2)) : 0;
  const bmiInfo = calculateBMIClassification(calculatedBMI);
  const whrInfo = calculateWHRClassification(calculatedWHR, student.gender);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!height || !weight || !waist || !hips) {
      alert('Vui lòng điền đầy đủ các chỉ số quan trọng (Chiều cao, Cân nặng, Vòng eo, Vòng mông)!');
      return;
    }

    onSave({
      date,
      height: Number(height),
      weight: Number(weight),
      bodyFatPercentage: bodyFat ? Number(bodyFat) : undefined,
      muscleMass: muscleMass ? Number(muscleMass) : undefined,
      visceralFat: visceralFat ? Number(visceralFat) : undefined,
      bmr: bmr ? Number(bmr) : undefined,
      chest: Number(chest),
      waist: Number(waist),
      hips: Number(hips),
      thigh: Number(thigh),
      arm: arm ? Number(arm) : undefined,
      notes: notes.trim() || 'Chỉ số đo định kỳ.',
      recordedBy: recorder.trim() || 'HLV Trung Tâm',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <Card className="w-full max-w-3xl bg-[#1A2B4C] border-2 border-[#FFD700]/50 shadow-2xl my-6 text-white animate-in zoom-in-95 duration-200">
        <CardHeader className="flex flex-row items-center justify-between border-b border-[#2A3B5C] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFD700]/20 flex items-center justify-center border border-[#FFD700]/40">
              <Scale className="w-5 h-5 text-[#FFD700]" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-[#FFD700] uppercase tracking-wide">
                Nhập Chỉ Số Đo Cơ Thể Mới
              </CardTitle>
              <p className="text-xs text-[#B0BEC5]">
                Học viên: <strong className="text-white">{student.name}</strong> ({student.id}) • {student.targetGoal}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#0B192C] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-5 max-h-[75vh] overflow-y-auto pr-2">
            
            {/* General Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#0B192C]/60 p-4 rounded-xl border border-[#2A3B5C]">
              <div>
                <label className="text-xs font-semibold text-[#F6ECB7] mb-1 block">Ngày Đo</label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-[#102038] border-[#2A3B5C] text-white text-sm h-10"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#F6ECB7] mb-1 block">Người Thực Hiện Đo</label>
                <Input
                  type="text"
                  value={recorder}
                  onChange={(e) => setRecorder(e.target.value)}
                  placeholder="Ví dụ: HLV Hoàng Nam, Học viên tự ghi..."
                  className="bg-[#102038] border-[#2A3B5C] text-white text-sm h-10"
                />
              </div>
            </div>

            {/* InBody & Weight Section */}
            <div>
              <div className="flex items-center gap-2 mb-3 text-sm font-bold text-[#FFD700] uppercase tracking-wider">
                <Activity className="w-4 h-4" />
                1. Trọng Lượng & Thành Phần Cơ Thể (InBody)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-[#102038] p-3 rounded-lg border border-[#2A3B5C]">
                  <label className="text-xs text-[#B0BEC5] font-medium block mb-1">Chiều cao (cm) *</label>
                  <Input
                    type="number"
                    step="0.5"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="bg-[#0B192C] border-[#2A3B5C] text-white font-bold h-9"
                    required
                  />
                </div>

                <div className="bg-[#102038] p-3 rounded-lg border border-[#2A3B5C]">
                  <label className="text-xs text-[#B0BEC5] font-medium block mb-1">Cân nặng (kg) *</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="bg-[#0B192C] border-[#2A3B5C] text-[#FFD700] font-bold h-9"
                    required
                  />
                </div>

                <div className="bg-[#102038] p-3 rounded-lg border border-[#2A3B5C]">
                  <label className="text-xs text-[#B0BEC5] font-medium block mb-1">Tỷ lệ mỡ PBF (%)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={bodyFat}
                    onChange={(e) => setBodyFat(Number(e.target.value))}
                    placeholder="20 - 30%"
                    className="bg-[#0B192C] border-[#2A3B5C] text-white h-9"
                  />
                </div>

                <div className="bg-[#102038] p-3 rounded-lg border border-[#2A3B5C]">
                  <label className="text-xs text-[#B0BEC5] font-medium block mb-1">Khối cơ bắp SMM (kg)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={muscleMass}
                    onChange={(e) => setMuscleMass(Number(e.target.value))}
                    placeholder="18 - 25kg"
                    className="bg-[#0B192C] border-[#2A3B5C] text-white h-9"
                  />
                </div>

                <div className="bg-[#102038] p-3 rounded-lg border border-[#2A3B5C]">
                  <label className="text-xs text-[#B0BEC5] font-medium block mb-1">Mỡ nội tạng (Level 1-12)</label>
                  <Input
                    type="number"
                    value={visceralFat}
                    onChange={(e) => setVisceralFat(Number(e.target.value))}
                    className="bg-[#0B192C] border-[#2A3B5C] text-white h-9"
                  />
                </div>

                <div className="bg-[#102038] p-3 rounded-lg border border-[#2A3B5C]">
                  <label className="text-xs text-[#B0BEC5] font-medium block mb-1">BMR Trao đổi chất (kcal)</label>
                  <Input
                    type="number"
                    value={bmr}
                    onChange={(e) => setBmr(Number(e.target.value))}
                    className="bg-[#0B192C] border-[#2A3B5C] text-white h-9"
                  />
                </div>
              </div>

              {/* Instant BMI calculation preview */}
              <div className="mt-3 bg-[#0B192C] p-3 rounded-lg border border-[#FFD700]/20 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-[#FFD700]" />
                  <span className="text-xs text-[#B0BEC5]">Chỉ số BMI tự động:</span>
                  <span className="text-sm font-bold text-white">{calculatedBMI} kg/m²</span>
                </div>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold bg-[#102038] border border-white/10 ${bmiInfo.color}`}>
                  {bmiInfo.label}
                </span>
              </div>
            </div>

            {/* Circumference Section */}
            <div>
              <div className="flex items-center gap-2 mb-3 text-sm font-bold text-[#FFD700] uppercase tracking-wider">
                <Ruler className="w-4 h-4" />
                2. Số Đo Các Vòng Cơ Thể (cm)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                <div className="bg-[#102038] p-3 rounded-lg border border-[#2A3B5C]">
                  <label className="text-[11px] text-[#B0BEC5] font-medium block mb-1">Vòng Ngực (cm)</label>
                  <Input
                    type="number"
                    step="0.5"
                    value={chest}
                    onChange={(e) => setChest(Number(e.target.value))}
                    className="bg-[#0B192C] border-[#2A3B5C] text-white font-bold h-9"
                    required
                  />
                </div>

                <div className="bg-[#102038] p-3 rounded-lg border border-[#FFD700]/40">
                  <label className="text-[11px] text-[#FFD700] font-bold block mb-1">Vòng Eo (cm) *</label>
                  <Input
                    type="number"
                    step="0.5"
                    value={waist}
                    onChange={(e) => setWaist(Number(e.target.value))}
                    className="bg-[#0B192C] border-[#FFD700]/40 text-[#FFD700] font-bold h-9"
                    required
                  />
                </div>

                <div className="bg-[#102038] p-3 rounded-lg border border-[#FFD700]/40">
                  <label className="text-[11px] text-[#FFD700] font-bold block mb-1">Vòng Mông (cm) *</label>
                  <Input
                    type="number"
                    step="0.5"
                    value={hips}
                    onChange={(e) => setHips(Number(e.target.value))}
                    className="bg-[#0B192C] border-[#FFD700]/40 text-[#FFD700] font-bold h-9"
                    required
                  />
                </div>

                <div className="bg-[#102038] p-3 rounded-lg border border-[#2A3B5C]">
                  <label className="text-[11px] text-[#B0BEC5] font-medium block mb-1">Vòng Đùi (cm)</label>
                  <Input
                    type="number"
                    step="0.5"
                    value={thigh}
                    onChange={(e) => setThigh(Number(e.target.value))}
                    className="bg-[#0B192C] border-[#2A3B5C] text-white h-9"
                    required
                  />
                </div>

                <div className="bg-[#102038] p-3 rounded-lg border border-[#2A3B5C]">
                  <label className="text-[11px] text-[#B0BEC5] font-medium block mb-1">Bắp tay (cm)</label>
                  <Input
                    type="number"
                    step="0.5"
                    value={arm}
                    onChange={(e) => setArm(Number(e.target.value))}
                    className="bg-[#0B192C] border-[#2A3B5C] text-white h-9"
                  />
                </div>
              </div>

              {/* WHR Ratio Preview */}
              <div className="mt-3 bg-[#0B192C] p-3 rounded-lg border border-[#FFD700]/20 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FFD700]" />
                  <span className="text-xs text-[#B0BEC5]">Tỷ lệ Eo/Mông (WHR):</span>
                  <span className="text-sm font-bold text-white">{calculatedWHR}</span>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-[#102038] text-[#F6ECB7] border border-white/10">
                  {whrInfo.label}
                </span>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-semibold text-[#F6ECB7] mb-1.5 block">
                Nhận Xét & Đánh Giá Của HLV / Học Viên
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ghi chú về cảm nhận cơ thể, độ siết cơ, tiến trình ăn uống & tập luyện..."
                rows={3}
                className="w-full bg-[#102038] border border-[#2A3B5C] rounded-lg p-3 text-white text-sm focus:outline-none focus:border-[#FFD700]"
              />
            </div>
          </CardContent>

          <div className="flex items-center justify-end gap-3 p-4 border-t border-[#2A3B5C] bg-[#102038]">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[#2A3B5C] text-[#B0BEC5] hover:text-white"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-[#FFD700] hover:bg-[#ffe234] text-[#0B192C] font-bold px-6 gap-2"
            >
              <Check className="w-4 h-4" />
              Lưu Chỉ Số Đo
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
