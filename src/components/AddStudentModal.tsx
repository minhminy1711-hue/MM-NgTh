import React, { useState } from 'react';
import { StudentProfile } from '../types/fitness';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, UserPlus, Sparkles } from 'lucide-react';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (
    studentData: Omit<StudentProfile, 'id' | 'measurements' | 'postureHistory'>,
    initialMeasurement?: {
      weight: number;
      height: number;
      bodyFatPercentage?: number;
      chest?: number;
      waist?: number;
      hips?: number;
      thigh?: number;
      notes?: string;
    }
  ) => void;
}

export default function AddStudentModal({ isOpen, onClose, onAdd }: AddStudentModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [branch, setBranch] = useState<StudentProfile['branch']>('HD Nguyễn Văn Trỗi- CS1');
  const [birthYear, setBirthYear] = useState<number>(1998);
  const [targetGoal, setTargetGoal] = useState<StudentProfile['targetGoal']>('Giảm mỡ siết eo');
  const [assignedTrainer, setAssignedTrainer] = useState('HLV Hoàng Nam (HD Fitness)');

  // Initial body metrics
  const [height, setHeight] = useState<number>(160);
  const [weight, setWeight] = useState<number>(55);
  const [waist, setWaist] = useState<number>(68);
  const [hips, setHips] = useState<number>(92);
  const [chest, setChest] = useState<number>(85);
  const [thigh, setThigh] = useState<number>(52);
  const [bodyFat, setBodyFat] = useState<number>(25);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Vui lòng nhập họ tên học viên!');
      return;
    }

    onAdd(
      {
        name: name.trim(),
        phone: phone.trim() || 'Chưa cập nhật',
        email: email.trim() || undefined,
        gender: 'female',
        birthYear: Number(birthYear),
        joinDate: new Date().toISOString().split('T')[0],
        branch,
        targetGoal,
        assignedTrainer,
        status: 'active',
      },
      {
        height: Number(height),
        weight: Number(weight),
        waist: Number(waist),
        hips: Number(hips),
        chest: Number(chest),
        thigh: Number(thigh),
        bodyFatPercentage: Number(bodyFat),
        notes: `Chỉ số đo lúc bắt đầu nhập học tại ${branch}.`,
      }
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl bg-[#1A2B4C] border-2 border-[#FFD700]/50 shadow-2xl my-6 text-white animate-in zoom-in-95 duration-200">
        <CardHeader className="flex flex-row items-center justify-between border-b border-[#2A3B5C] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFD700]/20 flex items-center justify-center border border-[#FFD700]/40">
              <UserPlus className="w-5 h-5 text-[#FFD700]" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-[#FFD700] uppercase tracking-wide">
                Thêm Hồ Sơ Học Viên Mới
              </CardTitle>
              <p className="text-xs text-[#B0BEC5]">
                Đăng ký học viên vào hệ thống quản lý & đo lường AI HD Fitness
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
          <CardContent className="space-y-5 pt-5 max-h-[75vh] overflow-y-auto pr-2">
            
            {/* Personal Information */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-[#F6ECB7] uppercase tracking-wider">
                1. Thông Tin Cá Nhân
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#B0BEC5] font-medium block mb-1">Họ và Tên *</label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Thị Hồng Nhung"
                    className="bg-[#102038] border-[#2A3B5C] text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-[#B0BEC5] font-medium block mb-1">Số Điện Thoại</label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0912 xxx xxx"
                    className="bg-[#102038] border-[#2A3B5C] text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#B0BEC5] font-medium block mb-1">Năm Sinh</label>
                  <Input
                    type="number"
                    value={birthYear}
                    onChange={(e) => setBirthYear(Number(e.target.value))}
                    className="bg-[#102038] border-[#2A3B5C] text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#B0BEC5] font-medium block mb-1">Cơ Sở Tập Luyện (Chi Nhánh) *</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value as any)}
                    className="w-full bg-[#102038] border border-[#FFD700]/50 rounded-md h-9 px-3 text-sm text-[#FFD700] font-bold focus:outline-none focus:border-[#FFD700]"
                  >
                    <option value="HD Nguyễn Văn Trỗi- CS1">📍 HD Nguyễn Văn Trỗi- CS1</option>
                    <option value="HD Phạm Đình Toái- CS3">📍 HD Phạm Đình Toái- CS3</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#B0BEC5] font-medium block mb-1">Mục Tiêu Tập Luyện</label>
                  <select
                    value={targetGoal}
                    onChange={(e) => setTargetGoal(e.target.value as any)}
                    className="w-full bg-[#102038] border border-[#2A3B5C] rounded-md h-9 px-3 text-sm text-white focus:outline-none focus:border-[#FFD700]"
                  >
                    <option value="Giảm mỡ siết eo">Giảm mỡ siết eo</option>
                    <option value="Tăng cơ săn chắc">Tăng cơ săn chắc</option>
                    <option value="Chỉnh sửa tư thế & cột sống">Chỉnh sửa tư thế & cột sống</option>
                    <option value="Phục hồi sau sinh">Phục hồi sau sinh</option>
                    <option value="Tăng cường thể lực">Tăng cường thể lực</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-[#B0BEC5] font-medium block mb-1">HLV Phụ Trách</label>
                  <Input
                    type="text"
                    value={assignedTrainer}
                    onChange={(e) => setAssignedTrainer(e.target.value)}
                    className="bg-[#102038] border-[#2A3B5C] text-white"
                  />
                </div>
              </div>
            </div>

            {/* Initial Body Measurements */}
            <div className="space-y-3 pt-2 border-t border-[#2A3B5C]">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-[#F6ECB7] uppercase tracking-wider">
                  2. Chỉ Số Đo Khởi Đầu (InBody ban đầu)
                </div>
                <span className="text-[11px] text-[#B0BEC5] italic">Tự động tính BMI & WHR</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#102038] p-2.5 rounded-lg border border-[#2A3B5C]">
                  <label className="text-[11px] text-[#B0BEC5] font-medium block mb-1">Chiều cao (cm)</label>
                  <Input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="bg-[#0B192C] border-[#2A3B5C] text-white h-8"
                  />
                </div>
                <div className="bg-[#102038] p-2.5 rounded-lg border border-[#2A3B5C]">
                  <label className="text-[11px] text-[#B0BEC5] font-medium block mb-1">Cân nặng (kg)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="bg-[#0B192C] border-[#2A3B5C] text-[#FFD700] font-bold h-8"
                  />
                </div>
                <div className="bg-[#102038] p-2.5 rounded-lg border border-[#2A3B5C]">
                  <label className="text-[11px] text-[#B0BEC5] font-medium block mb-1">Vòng Eo (cm)</label>
                  <Input
                    type="number"
                    step="0.5"
                    value={waist}
                    onChange={(e) => setWaist(Number(e.target.value))}
                    className="bg-[#0B192C] border-[#2A3B5C] text-white font-bold h-8"
                  />
                </div>
                <div className="bg-[#102038] p-2.5 rounded-lg border border-[#2A3B5C]">
                  <label className="text-[11px] text-[#B0BEC5] font-medium block mb-1">Vòng Mông (cm)</label>
                  <Input
                    type="number"
                    step="0.5"
                    value={hips}
                    onChange={(e) => setHips(Number(e.target.value))}
                    className="bg-[#0B192C] border-[#2A3B5C] text-white font-bold h-8"
                  />
                </div>
              </div>
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
              <Sparkles className="w-4 h-4" />
              Tạo Hồ Sơ Học Viên
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
