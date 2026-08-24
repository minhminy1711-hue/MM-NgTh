import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, ShieldCheck, ArrowRight, Dumbbell, Sparkles, CheckCircle2, MapPin, Search, Lock, Eye, EyeOff, AlertCircle, HelpCircle } from 'lucide-react';
import { StudentProfile, CurrentUser, BranchLocation } from '../types/fitness';

interface LoginProps {
  students: StudentProfile[];
  onLogin: (user: CurrentUser) => void;
}

// Helper to remove accents for flexible Vietnamese name matching
function removeAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

export default function Login({ students, onLogin }: LoginProps) {
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [branchFilter, setBranchFilter] = useState<'all' | BranchLocation>('all');
  
  // Student Login Input state
  const [studentInput, setStudentInput] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [studentError, setStudentError] = useState<string | null>(null);
  const [showDemoList, setShowDemoList] = useState(false);

  // Admin Login state
  const [adminPass, setAdminPass] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  // Matching students based on input
  const matchingStudents = useMemo(() => {
    const q = studentInput.trim();
    if (!q) return [];
    const normQ = removeAccents(q);
    const cleanDigits = q.replace(/\D/g, '');

    return students.filter((s) => {
      const matchBranch = branchFilter === 'all' || s.branch === branchFilter;
      if (!matchBranch) return false;

      const normName = removeAccents(s.name);
      const matchName = normName.includes(normQ);
      const sDigits = s.phone.replace(/\D/g, '');
      const matchPhone = cleanDigits.length >= 3 && sDigits.includes(cleanDigits);
      const matchId = s.id.toLowerCase().includes(normQ);

      return matchName || matchPhone || matchId;
    });
  }, [students, studentInput, branchFilter]);

  const handleStudentLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setStudentError(null);

    const q = studentInput.trim();
    if (!q && !selectedStudent) {
      setStudentError('Vui lòng nhập Họ & Tên, Số điện thoại hoặc Mã học viên đã đăng ký tại HD Fitness!');
      return;
    }

    let target: StudentProfile | undefined = selectedStudent || undefined;

    if (!target) {
      // Find exact or best match
      const normQ = removeAccents(q);
      const cleanDigits = q.replace(/\D/g, '');

      target = students.find((s) => {
        const normName = removeAccents(s.name);
        const sDigits = s.phone.replace(/\D/g, '');
        return normName === normQ || (cleanDigits.length >= 7 && sDigits === cleanDigits) || s.id.toLowerCase() === normQ;
      });

      if (!target && matchingStudents.length === 1) {
        target = matchingStudents[0];
      }
    }

    if (target) {
      onLogin({
        id: target.id,
        name: target.name,
        role: 'student',
        studentId: target.id,
      });
    } else {
      setStudentError(
        `Không tìm thấy thông tin học viên "${q}". Vui lòng kiểm tra lại họ tên / SĐT hoặc chọn cơ sở tương ứng!`
      );
    }
  };

  const handleSelectDemoStudent = (st: StudentProfile) => {
    setStudentInput(st.name);
    setSelectedStudent(st);
    setStudentError(null);
    setShowDemoList(false);
  };

  const handleAdminLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAdminError(null);

    const validPasswords = ['admin123', 'admin', 'hdfitness2026', 'hd2026'];
    if (validPasswords.includes(adminPass.trim())) {
      onLogin({
        id: 'admin-01',
        name: 'Ban Quản Lý (HLV Trưởng)',
        role: 'admin',
      });
    } else {
      setAdminError('Mật khẩu quản trị viên không chính xác! (Mặc định: admin123)');
    }
  };

  return (
    <div className="fixed inset-0 bg-[#07111F]/95 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg bg-[#1A2B4C] border-2 border-[#FFD700]/60 shadow-2xl overflow-hidden text-white">
        
        {/* Header with HD Fitness Branding */}
        <CardHeader className="text-center pb-3 bg-gradient-to-b from-[#102038] to-[#1A2B4C] border-b border-[#2A3B5C]">
          <div className="flex justify-center mb-3">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center p-2 shadow-lg border-2 border-[#FFD700]">
              <Dumbbell className="w-8 h-8 text-[#0B192C]" />
            </div>
          </div>
          <CardTitle className="text-2xl font-black text-[#FFD700] uppercase tracking-wider">
            HD FITNESS & YOGA
          </CardTitle>
          <p className="text-xs text-[#B0BEC5] mt-1">
            Hệ Thống Quản Lý Chỉ Số Cơ Thể & Đánh Giá Động Học AI
          </p>
        </CardHeader>

        <CardContent className="space-y-5 pt-5">
          {/* Role Toggle Selector */}
          <div className="flex bg-[#0B192C] p-1.5 rounded-xl border border-[#2A3B5C]">
            <button
              type="button"
              onClick={() => {
                setRole('student');
                setStudentError(null);
              }}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                role === 'student'
                  ? 'bg-[#FFD700] text-[#0B192C] shadow-md font-extrabold'
                  : 'text-[#B0BEC5] hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              Đăng Nhập Học Viên
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('admin');
                setAdminError(null);
              }}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                role === 'admin'
                  ? 'bg-rose-600 text-white shadow-md font-extrabold'
                  : 'text-[#B0BEC5] hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Quản Trị Viên (Admin)
            </button>
          </div>

          {/* Student Login Flow */}
          {role === 'student' ? (
            <form onSubmit={handleStudentLogin} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="p-3 rounded-lg bg-[#0B192C] border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <span>
                  <strong>Bảo mật thông tin:</strong> Mỗi học viên chỉ có quyền xem dữ liệu cơ thể, chỉ số InBody và lịch sử tập luyện AI của <strong>chính mình</strong>.
                </span>
              </div>

              {/* Branch Filter Tabs for Student */}
              <div>
                <label className="text-xs font-bold text-[#F6ECB7] block mb-1.5 flex items-center justify-between">
                  <span>Cơ Sở Đang Tập Luyện:</span>
                  <span className="text-[11px] text-[#B0BEC5] font-normal">Chọn cơ sở để tìm nhanh</span>
                </label>
                <div className="grid grid-cols-3 gap-1 bg-[#0B192C] p-1 rounded-lg border border-[#2A3B5C]">
                  <button
                    type="button"
                    onClick={() => {
                      setBranchFilter('all');
                      setSelectedStudent(null);
                    }}
                    className={`py-1.5 text-[11px] font-bold rounded transition-all ${
                      branchFilter === 'all'
                        ? 'bg-[#FFD700] text-[#0B192C]'
                        : 'text-[#B0BEC5] hover:text-white'
                    }`}
                  >
                    Tất cả ({students.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBranchFilter('HD Nguyễn Văn Trỗi- CS1');
                      setSelectedStudent(null);
                    }}
                    className={`py-1.5 text-[11px] font-bold rounded transition-all truncate px-1 ${
                      branchFilter === 'HD Nguyễn Văn Trỗi- CS1'
                        ? 'bg-sky-500 text-white'
                        : 'text-[#B0BEC5] hover:text-sky-300'
                    }`}
                    title="HD Nguyễn Văn Trỗi- CS1"
                  >
                    CS1: Ng.Văn Trỗi
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBranchFilter('HD Phạm Đình Toái- CS3');
                      setSelectedStudent(null);
                    }}
                    className={`py-1.5 text-[11px] font-bold rounded transition-all truncate px-1 ${
                      branchFilter === 'HD Phạm Đình Toái- CS3'
                        ? 'bg-amber-500 text-slate-950 font-extrabold'
                        : 'text-[#B0BEC5] hover:text-amber-300'
                    }`}
                    title="HD Phạm Đình Toái- CS3"
                  >
                    CS3: Ph.Đình Toái
                  </button>
                </div>
              </div>

              {/* Student Name/Phone Input Field */}
              <div>
                <label className="text-xs font-bold text-[#F6ECB7] block mb-1.5">
                  Nhập Họ & Tên hoặc Số Điện Thoại Học Viên: *
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FFD700]" />
                  <Input
                    type="text"
                    value={studentInput}
                    onChange={(e) => {
                      setStudentInput(e.target.value);
                      setSelectedStudent(null);
                      setStudentError(null);
                    }}
                    placeholder="VD: Nguyễn Thị Mai, 0912 345 678, hoặc hv-001..."
                    className="pl-9 pr-3 bg-[#0B192C] border-2 border-[#FFD700]/50 h-11 text-white placeholder:text-gray-500 text-xs sm:text-sm font-medium focus-visible:ring-[#FFD700]"
                    autoFocus
                  />
                </div>
              </div>

              {/* Instant Search Matches suggestion dropdown if typed */}
              {studentInput.trim().length > 0 && (
                <div className="space-y-1.5 bg-[#0B192C] p-2.5 rounded-xl border border-[#2A3B5C]">
                  <div className="text-[11px] font-bold text-[#B0BEC5] px-1 flex items-center justify-between">
                    <span>Kết quả tìm thấy ({matchingStudents.length}):</span>
                    <span className="text-[10px] text-gray-400">Nhấp để xác thực tài khoản</span>
                  </div>

                  {matchingStudents.length > 0 ? (
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {matchingStudents.map((st) => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => {
                            setSelectedStudent(st);
                            setStudentInput(st.name);
                            setStudentError(null);
                          }}
                          className={`w-full text-left p-2 rounded-lg border text-xs flex items-center justify-between transition-all ${
                            selectedStudent?.id === st.id
                              ? 'bg-[#FFD700]/20 border-[#FFD700] text-white font-bold'
                              : 'bg-[#102038] border-[#2A3B5C] text-[#B0BEC5] hover:border-[#FFD700]/40'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#0B192C] text-[#FFD700] flex items-center justify-center font-bold text-[10px] border border-[#FFD700]/30">
                              {st.name.charAt(0)}
                            </div>
                            <div>
                              <div className="text-white font-semibold flex items-center gap-1.5">
                                <span>{st.name}</span>
                                <span className={`text-[9px] px-1 py-0.2 rounded font-bold border ${
                                  st.branch === 'HD Nguyễn Văn Trỗi- CS1'
                                    ? 'bg-sky-950/70 text-sky-300 border-sky-500/40'
                                    : 'bg-amber-950/70 text-amber-300 border-amber-500/40'
                                }`}>
                                  {st.branch === 'HD Nguyễn Văn Trỗi- CS1' ? 'CS1' : 'CS3'}
                                </span>
                              </div>
                              <div className="text-[10px] text-gray-400">SĐT: {st.phone} • {st.targetGoal}</div>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400 font-bold">
                            Xác nhận ✓
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-2 text-xs text-amber-400/90 text-center italic">
                      Chưa tìm thấy học viên khớp với "{studentInput}". Vui lòng kiểm tra lại chính tả hoặc cơ sở!
                    </div>
                  )}
                </div>
              )}

              {/* Selected Confirmed Badge */}
              {selectedStudent && (
                <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between text-xs text-emerald-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-bold text-white">{selectedStudent.name} ({selectedStudent.id})</div>
                      <div className="text-[10px] text-emerald-300">{selectedStudent.branch} • {selectedStudent.targetGoal}</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 rounded text-emerald-300 font-bold">
                    Sẵn sàng vào
                  </span>
                </div>
              )}

              {/* Error display */}
              {studentError && (
                <div className="p-2.5 rounded-lg bg-rose-950/70 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{studentError}</span>
                </div>
              )}

              {/* Login Button */}
              <div className="pt-1">
                <Button
                  type="submit"
                  className="w-full h-11 bg-[#FFD700] hover:bg-[#ffe234] text-[#0B192C] text-sm font-extrabold uppercase group shadow-lg"
                >
                  Truy Cập Hồ Sơ Của Tôi <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              {/* Collapsible Demo helper */}
              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => setShowDemoList(!showDemoList)}
                  className="text-[11px] text-[#B0BEC5] hover:text-[#FFD700] underline inline-flex items-center gap-1 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  {showDemoList ? 'Ẩn danh sách học viên mẫu' : 'Xem danh sách học viên mẫu để thử nghiệm nhanh'}
                </button>

                {showDemoList && (
                  <div className="mt-2 p-2 bg-[#0B192C] rounded-lg border border-[#2A3B5C] text-left max-h-36 overflow-y-auto space-y-1">
                    <div className="text-[10px] font-bold text-[#FFD700] pb-1 border-b border-[#2A3B5C]">
                      Bấm vào học viên bất kỳ để tự động điền:
                    </div>
                    {students.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => handleSelectDemoStudent(st)}
                        className="w-full text-left p-1.5 rounded hover:bg-[#102038] text-[11px] flex items-center justify-between text-gray-300 hover:text-white"
                      >
                        <span>{st.name} ({st.branch.includes('CS1') ? 'CS1' : 'CS3'})</span>
                        <span className="text-[10px] text-gray-400 font-mono">{st.phone}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </form>
          ) : (
            /* Admin Login Flow */
            <form onSubmit={handleAdminLogin} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="p-3 rounded-lg bg-[#0B192C] border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>
                  <strong>Phân quyền Quản Lý (Admin):</strong> Cho phép quản lý <strong>toàn bộ học viên cả 2 cơ sở CS1 & CS3</strong>, xem mọi chỉ số InBody, nhập số đo mới và quản lý thống kê.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-[#F6ECB7] mb-1.5 block">
                  Mật Khẩu Quản Trị Viên (Mặc định: <code className="text-[#FFD700] bg-black/40 px-1 py-0.5 rounded">admin123</code>):
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FFD700]" />
                  <Input
                    type={showAdminPass ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu quản lý (admin123)..."
                    className="pl-9 pr-10 bg-[#0B192C] border-2 border-rose-500/40 focus-visible:border-rose-400 h-11 text-white placeholder:text-gray-500 text-xs sm:text-sm"
                    value={adminPass}
                    onChange={(e) => {
                      setAdminPass(e.target.value);
                      setAdminError(null);
                    }}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPass(!showAdminPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {adminError && (
                <div className="p-2.5 rounded-lg bg-rose-950/70 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{adminError}</span>
                </div>
              )}

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full h-11 bg-rose-600 hover:bg-rose-500 text-white text-sm font-extrabold uppercase group shadow-lg"
                >
                  Đăng Nhập Quản Trị Trung Tâm <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

