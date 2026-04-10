import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { Activity, AlertTriangle, TrendingUp, User, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";

const progressData = [
  { name: 'Tuần 1', score: 65 },
  { name: 'Tuần 2', score: 72 },
  { name: 'Tuần 3', score: 68 },
  { name: 'Tuần 4', score: 85 },
  { name: 'Tuần 5', score: 82 },
  { name: 'Tuần 6', score: 91 },
];

const errorData = [
  { name: 'Gối quá mũi chân', value: 45, color: '#FFD700' },
  { name: 'Cong lưng', value: 30, color: '#F6ECB7' },
  { name: 'Gót chân nhấc', value: 15, color: '#4CAF50' },
  { name: 'Mất thăng bằng', value: 10, color: '#2196F3' },
];

const techniqueData = [
  { name: 'Squat', value: 88 },
  { name: 'Lunges', value: 75 },
  { name: 'Core', value: 92 },
];

interface DashboardProps {
  userName: string;
  onBack: () => void;
}

export default function Dashboard({ userName, onBack }: DashboardProps) {
  return (
    <div className="min-h-screen bg-[#0B192C] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={onBack} className="rounded-full border-accent/20 hover:bg-accent/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-accent uppercase">Bảng Điều Khiển Dữ Liệu</h1>
              <p className="text-muted-foreground">Phân tích hiệu suất tập luyện của {userName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-card p-2 rounded-lg border border-accent/10">
            <User className="w-5 h-5 text-primary" />
            <span className="font-medium">{userName}</span>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card border-accent/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Điểm Trung Bình</CardTitle>
              <Activity className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">82.5%</div>
              <p className="text-xs text-green-400 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" /> +12% từ tháng trước
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card border-accent/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tổng Số Bài Tập</CardTitle>
              <TrendingUp className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">124</div>
              <p className="text-xs text-muted-foreground mt-1">Hoàn thành trong 30 ngày qua</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-accent/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Cảnh Báo Tư Thế</CardTitle>
              <AlertTriangle className="w-4 h-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">Lỗi cần chú ý trong tuần này</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts */}
        <Tabs defaultValue="progress" className="space-y-6">
          <TabsList className="bg-card border border-accent/10 p-1">
            <TabsTrigger value="progress" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Tiến Trình</TabsTrigger>
            <TabsTrigger value="errors" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Lỗi Thường Gặp</TabsTrigger>
            <TabsTrigger value="techniques" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Kỹ Thuật</TabsTrigger>
          </TabsList>

          <TabsContent value="progress">
            <Card className="bg-card border-accent/10">
              <CardHeader>
                <CardTitle className="text-accent">Xu Hướng Điểm Số</CardTitle>
                <CardDescription>Đánh giá sự cải thiện tư thế qua các tuần</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A3B5C" vertical={false} />
                    <XAxis dataKey="name" stroke="#B0BEC5" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#B0BEC5" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1A2B4C', border: '1px solid rgba(246, 236, 183, 0.2)', borderRadius: '8px' }}
                      itemStyle={{ color: '#FFD700' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#FFD700" 
                      strokeWidth={3} 
                      dot={{ fill: '#FFD700', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="errors">
            <Card className="bg-card border-accent/10">
              <CardHeader>
                <CardTitle className="text-accent">Phân Tích Lỗi Tư Thế</CardTitle>
                <CardDescription>Các lỗi phổ biến nhất được AI ghi nhận</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={errorData} layout="vertical" margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A3B5C" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" stroke="#B0BEC5" fontSize={12} width={120} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255, 215, 0, 0.05)' }}
                      contentStyle={{ backgroundColor: '#1A2B4C', border: '1px solid rgba(246, 236, 183, 0.2)', borderRadius: '8px' }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
                      {errorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="techniques">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card border-accent/10">
                <CardHeader>
                  <CardTitle className="text-accent">Độ Chính Xác Theo Bài Tập</CardTitle>
                  <CardDescription>So sánh hiệu suất giữa các kỹ thuật</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={techniqueData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {techniqueData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#FFD700' : index === 1 ? '#F6ECB7' : '#4CAF50'} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 text-xs">
                    {techniqueData.map((entry, index) => (
                      <div key={entry.name} className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#F6ECB7' : '#4CAF50' }} />
                        <span>{entry.name} ({entry.value}%)</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-accent/10">
                <CardHeader>
                  <CardTitle className="text-accent">Gợi Ý Từ AI</CardTitle>
                  <CardDescription>Lời khuyên tối ưu hóa dựa trên dữ liệu</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-sm font-medium text-primary">Cải thiện Squat</p>
                    <p className="text-xs text-muted-foreground">Hãy chú ý giữ gót chân chạm sàn khi xuống sâu để tăng độ ổn định.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                    <p className="text-sm font-medium text-accent">Duy trì Core</p>
                    <p className="text-xs text-muted-foreground">Độ ổn định cơ trung tâm của bạn rất tốt, hãy thử tăng thời gian giữ tư thế.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm font-medium text-destructive">Cảnh báo Lunges</p>
                    <p className="text-xs text-muted-foreground">Gối trái có xu hướng đổ vào trong, hãy tập trung đẩy gối ra ngoài.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
