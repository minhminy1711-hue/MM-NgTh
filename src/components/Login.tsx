import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, ShieldCheck, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (name: string, role: 'student' | 'admin') => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');

  const handleLogin = () => {
    if (role === 'student') {
      if (!name.trim()) return alert("Vui lòng nhập tên!");
      onLogin(name, 'student');
    } else {
      if (pass === "admin123") {
        onLogin("Ban Quản Lý", 'admin');
      } else {
        alert("Mã quản lý không chính xác!");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-[#07111F]/95 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-[#1A2B4C] border-2 border-primary shadow-2xl overflow-hidden">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-2">
              <img src="https://picsum.photos/seed/fitness-logo/100/100" alt="Logo" className="w-full h-auto object-contain" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-primary uppercase tracking-wider">Vào Tập Luyện</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="flex bg-[#0B192C] p-1 rounded-lg border border-accent/10">
            <button 
              onClick={() => setRole('student')}
              className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${role === 'student' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-white'}`}
            >
              Học Viên
            </button>
            <button 
              onClick={() => setRole('admin')}
              className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${role === 'admin' ? 'bg-destructive text-white shadow-lg' : 'text-muted-foreground hover:text-white'}`}
            >
              Quản Lý
            </button>
          </div>

          {role === 'student' ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <p className="text-center text-sm text-muted-foreground">Hệ thống sẽ tự động ghi nhớ hồ sơ tập luyện của bạn.</p>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Nhập tên của bạn (Vd: Nguyễn Thị A)" 
                  className="pl-10 bg-[#0B192C] border-accent/20 h-12 text-white placeholder:text-muted-foreground/50"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <Button onClick={handleLogin} className="w-full h-12 text-lg font-bold uppercase group">
                Bắt Đầu <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <p className="text-center text-sm text-primary font-medium">Truy cập dữ liệu toàn bộ hệ thống</p>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  type="password"
                  placeholder="Nhập mã Quản lý..." 
                  className="pl-10 bg-[#0B192C] border-accent/20 h-12 text-white placeholder:text-muted-foreground/50"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                />
              </div>
              <Button onClick={handleLogin} variant="destructive" className="w-full h-12 text-lg font-bold uppercase group">
                Truy Cập Quản Trị <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
