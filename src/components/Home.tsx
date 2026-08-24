import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Dumbbell, Target, LogOut, LayoutDashboard } from 'lucide-react';

interface HomeProps {
  userName: string;
  role: 'student' | 'admin';
  onLogout: () => void;
  onNavigate: (view: 'home' | 'dashboard' | 'squat' | 'lunges' | 'core') => void;
}

const modules = [
  { id: 'squat', title: '1. Squat', desc: 'Mục tiêu: Đùi & Mông toàn diện. Đo góc gập gối và độ ổn định trục cột sống.', icon: Dumbbell },
  { id: 'lunges', title: '2. Lunges', desc: 'Mục tiêu: Cô lập Đùi trước & Mông. Phân tích độ vuông góc (90 độ) của 2 chân.', icon: Activity },
  { id: 'core', title: '3. Vòng Eo (Core)', desc: 'Mục tiêu: Siết eo & Cơ lõi. Đo lường độ nghiêng và độ ổn định cơ trung tâm.', icon: Target },
] as const;

export default function Home({ userName, role, onLogout, onNavigate }: HomeProps) {
  return (
    <div className="min-h-screen bg-[#0B192C]">
      {/* User Bar */}
      <div className="bg-[#1A2B4C] border-b border-accent/10 px-4 py-3 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Activity className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-medium">
              👤 Xin chào, <b className="text-primary">{userName}</b> {role === 'admin' && <span className="text-xs bg-destructive px-1.5 py-0.5 rounded ml-1">Quản lý</span>}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onNavigate('dashboard')}
              className="text-muted-foreground hover:text-primary hover:bg-primary/10 gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Dữ Liệu</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onLogout}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Đăng Xuất</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="relative py-12 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#07111F] to-transparent opacity-50" />
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center space-y-6">
          <div className="flex items-center justify-center mb-4">
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center p-2 shadow-xl border-2 border-[#FFD700]">
                <Dumbbell className="w-10 h-10 text-[#0B192C]" />
              </div>
              <span className="text-xs text-[#FFD700] font-bold uppercase tracking-wider">HD Fitness & Yoga Center</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Trợ lý AI - HD Fitness & Yoga</h1>
          <p className="text-accent italic font-medium text-lg">Hệ thống đánh giá tư thế tập luyện cho hội viên Nữ</p>
          <div className="w-24 h-1 bg-primary rounded-full" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        <p className="text-center text-muted-foreground max-w-2xl mx-auto text-lg">
          Vui lòng chọn kỹ thuật bên dưới để thiết bị AI bắt đầu quét và đo lường các chỉ số động học thời gian thực.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {modules.map((module) => (
            <Card 
              key={module.id} 
              className="group bg-[#1A2B4C] border-accent/10 hover:border-primary transition-all duration-300 cursor-pointer overflow-hidden"
              onClick={() => onNavigate(module.id as any)}
            >
              <CardHeader className="flex flex-col items-center pt-8">
                <div className="w-16 h-16 rounded-2xl bg-[#0B192C] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-accent/10 group-hover:border-primary/50">
                  <module.icon className="w-8 h-8 text-accent group-hover:text-primary transition-colors" />
                </div>
                <CardTitle className="text-2xl font-bold text-accent group-hover:text-primary uppercase tracking-tight transition-colors">
                  {module.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6 pb-8">
                <p className="text-muted-foreground text-sm leading-relaxed min-h-[60px]">
                  {module.desc}
                </p>
                <Button className="w-full rounded-full font-bold uppercase tracking-wide group-hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all">
                  Khởi động AI
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-accent/10 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <p className="text-muted-foreground/50 text-sm">
            © 2026 - Đề tài Nghiên cứu Khoa học Ứng dụng Công nghệ trong Giáo dục Thể chất.
          </p>
          <p className="text-[10px] text-muted-foreground/30 uppercase tracking-widest">
            Powered by Google AI Studio
          </p>
        </div>
      </footer>
    </div>
  );
}
