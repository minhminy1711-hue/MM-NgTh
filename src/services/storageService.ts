import { StudentProfile, BodyMeasurement, PostureSession, CurrentUser } from '../types/fitness';

const STORAGE_KEY_STUDENTS = 'hdfitness_students_data_v2';
const STORAGE_KEY_USER = 'hdfitness_current_user_v2';

export const INITIAL_STUDENTS: StudentProfile[] = [
  {
    id: 'hv-001',
    name: 'Nguyễn Thị Mai',
    phone: '0912 345 678',
    email: 'mainguyen@gmail.com',
    gender: 'female',
    birthYear: 1998,
    joinDate: '2026-01-10',
    branch: 'HD Nguyễn Văn Trỗi- CS1',
    targetGoal: 'Giảm mỡ siết eo',
    assignedTrainer: 'HLV Hoàng Nam (HD Fitness)',
    status: 'active',
    measurements: [
      {
        id: 'm-001-1',
        date: '2026-01-10',
        height: 160,
        weight: 58.5,
        bmi: 22.85,
        bodyFatPercentage: 28.5,
        muscleMass: 21.2,
        visceralFat: 6,
        bmr: 1280,
        chest: 86,
        waist: 74,
        hips: 95,
        thigh: 54,
        arm: 26,
        whr: 0.78,
        notes: 'Buổi đo đầu tiên khi nhập học. Cần chú ý giảm mỡ bụng dưới.',
        recordedBy: 'HLV Hoàng Nam',
      },
      {
        id: 'm-001-2',
        date: '2026-02-15',
        height: 160,
        weight: 56.2,
        bmi: 21.95,
        bodyFatPercentage: 26.0,
        muscleMass: 21.8,
        visceralFat: 5,
        bmr: 1295,
        chest: 85,
        waist: 70.5,
        hips: 94,
        thigh: 52.5,
        arm: 25.2,
        whr: 0.75,
        notes: 'Sau 1 tháng tập Squat và Core: Vòng eo giảm 3.5cm, mỡ giảm 2.5%.',
        recordedBy: 'HLV Hoàng Nam',
      },
      {
        id: 'm-001-3',
        date: '2026-03-20',
        height: 160,
        weight: 54.0,
        bmi: 21.09,
        bodyFatPercentage: 23.5,
        muscleMass: 22.4,
        visceralFat: 4,
        bmr: 1310,
        chest: 85,
        waist: 66,
        hips: 93.5,
        thigh: 51,
        arm: 24.5,
        whr: 0.71,
        notes: 'Tiến triển xuất sắc! Cơ bụng săn chắc, tư thế squat chuẩn góc 90 độ.',
        recordedBy: 'HLV Hoàng Nam',
      },
    ],
    postureHistory: [
      {
        id: 'pos-001',
        date: '2026-03-18',
        exerciseType: 'squat',
        score: 92,
        reps: 15,
        kneeAngle: 88,
        balance: 95,
        feedback: 'Kỹ thuật Squat rất chuẩn, giữ gót chân vững và cột sống trung tính.',
        errors: [],
      },
      {
        id: 'pos-002',
        date: '2026-03-10',
        exerciseType: 'lunges',
        score: 85,
        reps: 12,
        kneeAngle: 92,
        balance: 88,
        feedback: 'Gối sau chạm sàn nhẹ nhàng, lưu ý không để gối trước vượt quá mũi chân.',
        errors: ['Gối trước hơi đổ vào trong ở rep 10'],
      },
      {
        id: 'pos-003',
        date: '2026-02-28',
        exerciseType: 'core',
        score: 96,
        reps: 20,
        balance: 98,
        feedback: 'Khả năng siết cơ lõi và cân bằng khung chậu hoàn hảo.',
        errors: [],
      },
    ],
  },
  {
    id: 'hv-002',
    name: 'Trần Thu Hà',
    phone: '0988 765 432',
    email: 'thuha.tran@gmail.com',
    gender: 'female',
    birthYear: 2001,
    joinDate: '2026-02-01',
    branch: 'HD Phạm Đình Toái- CS3',
    targetGoal: 'Chỉnh sửa tư thế & cột sống',
    assignedTrainer: 'HLV Thu Trang (HD Fitness)',
    status: 'active',
    measurements: [
      {
        id: 'm-002-1',
        date: '2026-02-01',
        height: 165,
        weight: 52.0,
        bmi: 19.1,
        bodyFatPercentage: 22.0,
        muscleMass: 19.5,
        visceralFat: 3,
        bmr: 1240,
        chest: 82,
        waist: 65,
        hips: 90,
        thigh: 49,
        arm: 23,
        whr: 0.72,
        notes: 'Dáng người gầy nhưng hơi gù lưng trên và ưỡn đốt sống thắt lưng (Anterior Pelvic Tilt).',
        recordedBy: 'HLV Thu Trang',
      },
      {
        id: 'm-002-2',
        date: '2026-03-15',
        height: 165,
        weight: 53.5,
        bmi: 19.65,
        bodyFatPercentage: 21.0,
        muscleMass: 20.8,
        visceralFat: 3,
        bmr: 1275,
        chest: 83,
        waist: 64,
        hips: 91.5,
        thigh: 50.5,
        arm: 23.8,
        whr: 0.70,
        notes: 'Tăng 1.3kg cơ bắp, độ thẳng trục cột sống cải thiện 15%.',
        recordedBy: 'HLV Thu Trang',
      },
    ],
    postureHistory: [
      {
        id: 'pos-004',
        date: '2026-03-12',
        exerciseType: 'squat',
        score: 78,
        reps: 12,
        kneeAngle: 82,
        balance: 75,
        feedback: 'Lưng dưới có dấu hiệu hơi uốn cong khi hạ sâu quá 90 độ (Butt wink).',
        errors: ['Cong thắt lưng khi xuống sâu', 'Nhấc nhẹ gót chân phải'],
      },
      {
        id: 'pos-005',
        date: '2026-03-22',
        exerciseType: 'core',
        score: 88,
        reps: 16,
        balance: 90,
        feedback: 'Tư thế siết bụng cải thiện rõ rệt, kiểm soát nhịp thở tốt.',
        errors: [],
      },
    ],
  },
  {
    id: 'hv-003',
    name: 'Lê Hoàng Yến',
    phone: '0903 112 233',
    email: 'hoangyen.le@gmail.com',
    gender: 'female',
    birthYear: 1995,
    joinDate: '2026-01-15',
    branch: 'HD Nguyễn Văn Trỗi- CS1',
    targetGoal: 'Tăng cơ săn chắc',
    assignedTrainer: 'HLV Hoàng Nam (HD Fitness)',
    status: 'active',
    measurements: [
      {
        id: 'm-003-1',
        date: '2026-01-15',
        height: 158,
        weight: 49.0,
        bmi: 19.63,
        bodyFatPercentage: 24.0,
        muscleMass: 18.0,
        visceralFat: 4,
        bmr: 1190,
        chest: 80,
        waist: 63,
        hips: 88,
        thigh: 48,
        arm: 22.5,
        whr: 0.71,
        notes: 'Mục tiêu tăng size vòng 3 và làm dày cơ mông đùi.',
        recordedBy: 'HLV Hoàng Nam',
      },
      {
        id: 'm-003-2',
        date: '2026-03-01',
        height: 158,
        weight: 51.2,
        bmi: 20.51,
        bodyFatPercentage: 22.5,
        muscleMass: 19.8,
        visceralFat: 4,
        bmr: 1250,
        chest: 81,
        waist: 63.5,
        hips: 92,
        thigh: 51,
        arm: 23.5,
        whr: 0.69,
        notes: 'Tăng 4cm vòng mông (Hip: 88cm -> 92cm), mông đùi săn chắc rõ rệt.',
        recordedBy: 'HLV Hoàng Nam',
      },
    ],
    postureHistory: [
      {
        id: 'pos-006',
        date: '2026-03-19',
        exerciseType: 'lunges',
        score: 95,
        reps: 18,
        kneeAngle: 90,
        balance: 96,
        feedback: 'Cô lập đùi trước và cơ mông hoàn hảo, giữ thăng bằng rất tốt.',
        errors: [],
      },
    ],
  },
  {
    id: 'hv-004',
    name: 'Vũ Minh Trang',
    phone: '0977 445 566',
    email: 'minhtrang.vu@gmail.com',
    gender: 'female',
    birthYear: 1992,
    joinDate: '2026-02-20',
    branch: 'HD Phạm Đình Toái- CS3',
    targetGoal: 'Phục hồi sau sinh',
    assignedTrainer: 'HLV Thu Trang (HD Fitness)',
    status: 'active',
    measurements: [
      {
        id: 'm-004-1',
        date: '2026-02-20',
        height: 162,
        weight: 64.0,
        bmi: 24.38,
        bodyFatPercentage: 31.5,
        muscleMass: 20.0,
        visceralFat: 7,
        bmr: 1320,
        chest: 92,
        waist: 82,
        hips: 98,
        thigh: 56,
        arm: 28,
        whr: 0.83,
        notes: 'Sinh bé 8 tháng, cơ bụng có tách cơ (Diastasis Recti nhẹ), cần tập trung phục hồi cơ sàn chậu và cơ lõi.',
        recordedBy: 'HLV Thu Trang',
      },
    ],
    postureHistory: [
      {
        id: 'pos-007',
        date: '2026-03-05',
        exerciseType: 'core',
        score: 82,
        reps: 10,
        balance: 85,
        feedback: 'Kiểm soát nhịp thở cơ hoành tốt, không đẩy phình bụng.',
        errors: ['Lưu ý ép chặt thắt lưng xuống thảm'],
      },
    ],
  },
];

export function getStoredStudents(): StudentProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STUDENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    const parsed: StudentProfile[] = JSON.parse(raw);
    // Ensure all students have a valid branch
    const updated = parsed.map((s, idx) => ({
      ...s,
      branch: s.branch || (idx % 2 === 1 || s.id === 'hv-002' || s.id === 'hv-004' ? 'HD Phạm Đình Toái- CS3' : 'HD Nguyễn Văn Trỗi- CS1'),
    }));
    return updated;
  } catch {
    return INITIAL_STUDENTS;
  }
}

export function saveStoredStudents(students: StudentProfile[]) {
  localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
}

export function getStudentById(id: string): StudentProfile | undefined {
  const students = getStoredStudents();
  return students.find((s) => s.id === id);
}

export function addStudent(newStudent: Omit<StudentProfile, 'id' | 'measurements' | 'postureHistory'>, initialMeasurement?: Partial<BodyMeasurement>): StudentProfile {
  const students = getStoredStudents();
  const id = `hv-${String(students.length + 1).padStart(3, '0')}`;
  
  const measurements: BodyMeasurement[] = [];
  if (initialMeasurement && initialMeasurement.weight && initialMeasurement.height) {
    const heightM = initialMeasurement.height / 100;
    const bmi = Number((initialMeasurement.weight / (heightM * heightM)).toFixed(2));
    const whr = initialMeasurement.waist && initialMeasurement.hips 
      ? Number((initialMeasurement.waist / initialMeasurement.hips).toFixed(2)) 
      : 0.75;
    
    measurements.push({
      id: `m-${id}-1`,
      date: initialMeasurement.date || new Date().toISOString().split('T')[0],
      height: initialMeasurement.height,
      weight: initialMeasurement.weight,
      bmi,
      bodyFatPercentage: initialMeasurement.bodyFatPercentage || 25,
      muscleMass: initialMeasurement.muscleMass || Number((initialMeasurement.weight * 0.38).toFixed(1)),
      visceralFat: initialMeasurement.visceralFat || 4,
      bmr: initialMeasurement.bmr || Math.round(10 * initialMeasurement.weight + 6.25 * initialMeasurement.height - 5 * (2026 - newStudent.birthYear) - 161),
      chest: initialMeasurement.chest || 85,
      waist: initialMeasurement.waist || 70,
      hips: initialMeasurement.hips || 92,
      thigh: initialMeasurement.thigh || 52,
      arm: initialMeasurement.arm || 25,
      whr,
      notes: initialMeasurement.notes || 'Chỉ số đo khởi đầu khi đăng ký.',
      recordedBy: initialMeasurement.recordedBy || 'HLV Trung Tâm',
    });
  }

  const created: StudentProfile = {
    ...newStudent,
    id,
    measurements,
    postureHistory: [],
  };

  students.unshift(created);
  saveStoredStudents(students);
  return created;
}

export function addMeasurementToStudent(studentId: string, measurement: Omit<BodyMeasurement, 'id' | 'bmi' | 'whr'>): BodyMeasurement | null {
  const students = getStoredStudents();
  const student = students.find((s) => s.id === studentId);
  if (!student) return null;

  const heightM = measurement.height / 100;
  const bmi = Number((measurement.weight / (heightM * heightM)).toFixed(2));
  const whr = measurement.hips > 0 ? Number((measurement.waist / measurement.hips).toFixed(2)) : 0;

  const newM: BodyMeasurement = {
    ...measurement,
    id: `m-${studentId}-${Date.now()}`,
    bmi,
    whr,
  };

  student.measurements.push(newM);
  // Sort by date ascending
  student.measurements.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  saveStoredStudents(students);
  return newM;
}

export function addPostureSessionToStudent(studentId: string, session: Omit<PostureSession, 'id'>): PostureSession | null {
  const students = getStoredStudents();
  const student = students.find((s) => s.id === studentId);
  if (!student) return null;

  const newSession: PostureSession = {
    ...session,
    id: `pos-${Date.now()}`,
  };

  student.postureHistory.unshift(newSession);
  saveStoredStudents(students);
  return newSession;
}

export function getStoredCurrentUser(): CurrentUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveStoredCurrentUser(user: CurrentUser | null) {
  if (!user) {
    localStorage.removeItem(STORAGE_KEY_USER);
  } else {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  }
}

// Helpers for calculations
export function calculateBMIClassification(bmi: number): { label: string; color: string; advice: string } {
  if (bmi < 18.5) {
    return { label: 'Gầy (Thiếu cân)', color: 'text-blue-400', advice: 'Cần tăng cường dinh dưỡng giàu protein và tập luyện kháng lực để tăng khối cơ bắp.' };
  }
  if (bmi < 23) {
    return { label: 'Bình thường (Lý tưởng)', color: 'text-green-400', advice: 'Chỉ số chuẩn chuẩn người châu Á. Duy trì bài tập Squat, Lunges và siết cơ Core để duy trì vóc dáng săn chắc.' };
  }
  if (bmi < 25) {
    return { label: 'Thừa cân nhẹ (Tiền béo phì)', color: 'text-amber-400', advice: 'Cần phối hợp bài tập sức mạnh cơ bắp và cardio để giảm mỡ toàn thân, siết vòng eo.' };
  }
  return { label: 'Béo phì độ I / II', color: 'text-red-400', advice: 'Cần điều chỉnh chế độ thâm hụt calo, bảo vệ khớp gối khi tập squat/lunges bằng cách kiểm soát góc độ AI.' };
}

export function calculateWHRClassification(whr: number, gender: 'female' | 'male' = 'female'): { label: string; status: 'good' | 'warning' | 'danger' } {
  if (gender === 'female') {
    if (whr <= 0.75) return { label: 'Dáng chuẩn quả lê / đồng hồ cát (Rất tốt)', status: 'good' };
    if (whr <= 0.85) return { label: 'Mức trung bình (An toàn)', status: 'warning' };
    return { label: 'Nguy cơ tích mỡ nội tạng vùng bụng', status: 'danger' };
  }
  if (whr <= 0.85) return { label: 'Thon gọn (Tốt)', status: 'good' };
  if (whr <= 0.95) return { label: 'Trung bình', status: 'warning' };
  return { label: 'Tích mỡ bụng cao', status: 'danger' };
}
