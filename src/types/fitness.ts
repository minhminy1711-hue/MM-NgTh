export type UserRole = 'student' | 'admin';

export type BranchLocation = 'HD Nguyễn Văn Trỗi- CS1' | 'HD Phạm Đình Toái- CS3';

export interface BodyMeasurement {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number; // kg
  height: number; // cm
  bmi: number; // kg/m2
  bodyFatPercentage?: number; // %
  muscleMass?: number; // kg
  visceralFat?: number; // Level 1-12
  bmr?: number; // kcal
  // Body girths (cm)
  chest: number;
  waist: number;
  hips: number;
  thigh: number;
  arm?: number;
  whr: number; // Waist to Hip Ratio
  notes?: string;
  recordedBy: string; // 'HLV Trưởng' | 'Học viên tự ghi' | etc.
}

export interface PostureSession {
  id: string;
  date: string;
  exerciseType: 'squat' | 'lunges' | 'core';
  score: number; // 0-100
  reps: number;
  kneeAngle?: number; // degrees
  balance?: number; // %
  feedback: string;
  errors: string[];
  videoName?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  avatar?: string;
  phone: string;
  email?: string;
  gender: 'female' | 'male';
  birthYear: number;
  joinDate: string;
  branch: BranchLocation;
  targetGoal: 'Giảm mỡ siết eo' | 'Tăng cơ săn chắc' | 'Chỉnh sửa tư thế & cột sống' | 'Phục hồi sau sinh' | 'Tăng cường thể lực';
  assignedTrainer: string;
  status: 'active' | 'inactive';
  measurements: BodyMeasurement[];
  postureHistory: PostureSession[];
}

export interface CurrentUser {
  id: string;
  name: string;
  role: UserRole;
  studentId?: string; // If role is student, references student ID
}
