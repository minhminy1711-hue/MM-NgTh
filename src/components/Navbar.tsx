import React from 'react';
import { CurrentUser, StudentProfile } from '../types/fitness';
import { Button } from '@/components/ui/button';
import { ShieldCheck, User, LogOut, Users, Dumbbell, Sparkles, ChevronDown } from 'lucide-react';

interface NavbarProps {
  currentUser: CurrentUser;
  students: StudentProfile[];
  onLogout: () => void;
  onSwitchUser: (user: CurrentUser) => void;
  currentTab: 'admin-students' | 'student-profile' | 'workout-ai' | 'analytics';
  onNavigateTab: (tab: 'admin-students' | 'student-profile' | 'workout-ai' | 'analytics') => void;
}

export default function Navbar({
  currentUser,
  students,
  onLogout,
  onSwitchUser,
  currentTab,
  onNavigateTab,
}: NavbarProps) {
  const [showSwitchDropdown, setShowSwitchDropdown] = React.useState(false);

  return (
    <header className="bg-[#102038] border-b border-[#F6ECB7]/20 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand Info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1 shadow-sm border border-[#FFD700]/50">
                <Dumbbell className="w-5 h-5 text-[#0B192C]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold text-white tracking-wide uppercase">
                    HD FITNESS & YOGA
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-[#FFD700]/20 text-[#FFD700] font-semibold border border-[#FFD700]/30">
                    AI POSTURE
                  </span>
                </div>
                <p className="text-[11px] text-[#B0BEC5] hidden sm:block">
                  HD Fitness & Yoga Center
                </p>
              </div>
            </div>
          </div>

          {/* Role Navigation Buttons */}
          <div className="hidden md:flex items-center gap-1 bg-[#0B192C]/80 p-1 rounded-lg border border-[#F6ECB7]/15">
            {currentUser.role === 'admin' ? (
              <>
                <button
                  onClick={() => onNavigateTab('admin-students')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    currentTab === 'admin-students'
                      ? 'bg-[#FFD700] text-[#0B192C] shadow-sm font-bold'
                      : 'text-[#B0BEC5] hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  Danh Sách Học Viên
                </button>
                <button
                  onClick={() => onNavigateTab('analytics')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    currentTab === 'analytics'
                      ? 'bg-[#FFD700] text-[#0B192C] shadow-sm font-bold'
                      : 'text-[#B0BEC5] hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Thống Kê Thể Trạng
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigateTab('student-profile')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    currentTab === 'student-profile'
                      ? 'bg-[#FFD700] text-[#0B192C] shadow-sm font-bold'
                      : 'text-[#B0BEC5] hover:text-white'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  Hồ Sơ & Chỉ Số Cơ Thể
                </button>
                <button
                  onClick={() => onNavigateTab('workout-ai')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    currentTab === 'workout-ai'
                      ? 'bg-[#FFD700] text-[#0B192C] shadow-sm font-bold'
                      : 'text-[#B0BEC5] hover:text-white'
                  }`}
                >
                  <Dumbbell className="w-3.5 h-3.5" />
                  Tập Luyện Với AI
                </button>
              </>
            )}
          </div>

          {/* User Account & Switcher */}
          <div className="flex items-center gap-2 relative">
            {currentUser.role === 'admin' ? (
              <div className="relative">
                <button
                  onClick={() => setShowSwitchDropdown(!showSwitchDropdown)}
                  className="flex items-center gap-2 bg-[#0B192C] hover:bg-[#152744] border border-rose-500/40 px-3 py-1.5 rounded-lg text-left transition-all"
                  title="Tài khoản Quản trị viên"
                >
                  <div className="w-7 h-7 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center font-bold text-xs border border-rose-500/40">
                    <ShieldCheck className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      {currentUser.name}
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Admin
                      </span>
                    </div>
                    <p className="text-[10px] text-[#B0BEC5]">
                      Toàn quyền quản lý 2 cơ sở
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#B0BEC5]" />
                </button>

                {/* Admin Switcher Dropdown */}
                {showSwitchDropdown && (
                  <div className="absolute right-0 mt-2 w-72 bg-[#1A2B4C] border border-[#FFD700]/30 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="text-[11px] font-bold text-[#F6ECB7] px-2 py-1 uppercase tracking-wider border-b border-[#2A3B5C]">
                      Quyền Quản Trị Viên
                    </div>

                    <div className="p-2 text-xs text-rose-300 bg-rose-950/40 rounded-lg mt-1 border border-rose-500/30">
                      <div className="font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                        Đang đăng nhập: Admin
                      </div>
                      <div className="text-[10px] text-gray-300 mt-0.5">
                        Có thể xem, thêm mới và chỉnh sửa hồ sơ của mọi học viên.
                      </div>
                    </div>

                    <div className="text-[11px] font-bold text-[#F6ECB7] px-2 pt-2 pb-1 uppercase tracking-wider border-b border-[#2A3B5C] mt-2">
                      Xem thử giao diện học viên (Demo)
                    </div>

                    <div className="max-h-48 overflow-y-auto space-y-1 mt-1 pr-1">
                      {students.map((st) => (
                        <button
                          key={st.id}
                          onClick={() => {
                            onSwitchUser({
                              id: st.id,
                              name: st.name,
                              role: 'student',
                              studentId: st.id,
                            });
                            setShowSwitchDropdown(false);
                          }}
                          className="w-full text-left p-2 rounded-lg text-xs flex items-center gap-2 hover:bg-[#0B192C] text-[#B0BEC5] transition-all"
                        >
                          <div className="w-5 h-5 rounded-full bg-[#0B192C] text-[#FFD700] text-[10px] flex items-center justify-center font-bold">
                            {st.name.charAt(0)}
                          </div>
                          <div className="truncate">
                            <div className="font-semibold text-white truncate">{st.name}</div>
                            <div className="text-[10px] text-gray-400 truncate">
                              {st.branch.includes('CS1') ? 'CS1' : 'CS3'} • {st.targetGoal}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Student Account Display (Strictly Isolated - No access to other students' profiles) */
              <div className="flex items-center gap-2 bg-[#0B192C] border border-[#FFD700]/30 px-3 py-1.5 rounded-lg">
                <div className="w-7 h-7 rounded-full bg-[#FFD700]/20 text-[#FFD700] flex items-center justify-center font-bold text-xs border border-[#FFD700]/40">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    {currentUser.name}
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Học viên
                    </span>
                  </div>
                  <p className="text-[10px] text-emerald-400">
                    Chỉ hiển thị hồ sơ cá nhân
                  </p>
                </div>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="border-[#F6ECB7]/20 text-[#B0BEC5] hover:text-rose-300 hover:border-rose-500/40 hover:bg-rose-950/20 text-xs px-2.5 h-9"
              title="Đăng xuất khỏi tài khoản"
            >
              <LogOut className="w-3.5 h-3.5 sm:mr-1" />
              <span className="hidden sm:inline">Đăng Xuất</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
