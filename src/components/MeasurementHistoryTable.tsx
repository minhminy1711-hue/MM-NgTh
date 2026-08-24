import React from 'react';
import { BodyMeasurement, StudentProfile } from '../types/fitness';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Calendar, TrendingDown, History, Ruler, Plus } from 'lucide-react';
import { calculateBMIClassification } from '../services/storageService';

interface MeasurementHistoryTableProps {
  student: StudentProfile;
  onOpenNewModal?: () => void;
  canEdit?: boolean;
}

export default function MeasurementHistoryTable({
  student,
  onOpenNewModal,
  canEdit = true,
}: MeasurementHistoryTableProps) {
  const measurements = [...student.measurements].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const chartData = measurements.map((m, idx) => ({
    name: m.date,
    cân_nặng: m.weight,
    vòng_eo: m.waist,
    vòng_mông: m.hips,
    tỷ_lệ_mỡ: m.bodyFatPercentage || 0,
    khối_cơ: m.muscleMass || 0,
    bmi: m.bmi,
  }));

  return (
    <div className="space-y-6">
      {/* Chart Section */}
      <Card className="bg-[#1A2B4C] border border-[#2A3B5C] text-white p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <CardTitle className="text-base font-bold text-[#FFD700] flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Biểu Đồ Tiến Trình Cơ Thể Qua Các Đợt Đo
            </CardTitle>
            <p className="text-xs text-[#B0BEC5]">
              Theo dõi sự thay đổi Cân Nặng (kg), Vòng Eo (cm), và Vòng Mông (cm)
            </p>
          </div>
          {canEdit && onOpenNewModal && (
            <button
              onClick={onOpenNewModal}
              className="px-3 py-1.5 bg-[#FFD700] text-[#0B192C] font-bold text-xs rounded-lg flex items-center gap-1 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm Lần Đo Mới
            </button>
          )}
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A3B5C" vertical={false} />
              <XAxis dataKey="name" stroke="#B0BEC5" fontSize={11} tickLine={false} />
              <YAxis stroke="#B0BEC5" fontSize={11} domain={['auto', 'auto']} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0B192C',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="vòng_eo"
                name="Vòng Eo (cm)"
                stroke="#FFD700"
                strokeWidth={3}
                dot={{ fill: '#FFD700', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="cân_nặng"
                name="Cân Nặng (kg)"
                stroke="#4ade80"
                strokeWidth={2}
                dot={{ fill: '#4ade80', r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="vòng_mông"
                name="Vòng Mông (cm)"
                stroke="#38bdf8"
                strokeWidth={2}
                dot={{ fill: '#38bdf8', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* History Table */}
      <Card className="bg-[#1A2B4C] border border-[#2A3B5C] text-white overflow-hidden">
        <CardHeader className="bg-[#102038] py-3.5 px-4 border-b border-[#2A3B5C]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-[#F6ECB7] flex items-center gap-2">
              <History className="w-4 h-4 text-[#FFD700]" />
              Lịch Sử Chi Tiết Các Lần Đo Nhân Trắc ({measurements.length} đợt)
            </CardTitle>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0B192C] text-[#B0BEC5] border-b border-[#2A3B5C] uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Ngày Đo</th>
                <th className="py-3 px-3">Cân Nặng</th>
                <th className="py-3 px-3">Chiều Cao / BMI</th>
                <th className="py-3 px-3">% Mỡ / Cơ</th>
                <th className="py-3 px-3">Vòng Ngực</th>
                <th className="py-3 px-3 text-[#FFD700]">Vòng Eo</th>
                <th className="py-3 px-3 text-[#FFD700]">Vòng Mông</th>
                <th className="py-3 px-3">Vòng Đùi</th>
                <th className="py-3 px-3">Tỷ Lệ WHR</th>
                <th className="py-3 px-3">Người Đo & Ghi Chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A3B5C]">
              {measurements.map((m, idx) => {
                const prev = idx > 0 ? measurements[idx - 1] : null;
                const waistDiff = prev ? Number((m.waist - prev.waist).toFixed(1)) : 0;
                const weightDiff = prev ? Number((m.weight - prev.weight).toFixed(1)) : 0;
                const bmiClass = calculateBMIClassification(m.bmi);

                return (
                  <tr key={m.id} className="hover:bg-[#102038]/70 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#FFD700]" />
                      {m.date}
                    </td>
                    <td className="py-3 px-3 font-bold text-white">
                      {m.weight} kg
                      {weightDiff !== 0 && (
                        <span className={`block text-[10px] ${weightDiff < 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          ({weightDiff > 0 ? `+${weightDiff}` : weightDiff} kg)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <div>{m.height} cm</div>
                      <span className={`text-[10px] font-semibold ${bmiClass.color}`}>
                        BMI: {m.bmi}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div>{m.bodyFatPercentage ? `${m.bodyFatPercentage}% mỡ` : '--'}</div>
                      <span className="text-[10px] text-gray-400">
                        {m.muscleMass ? `${m.muscleMass}kg cơ` : ''}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-gray-200">{m.chest} cm</td>
                    <td className="py-3 px-3 font-bold text-[#FFD700] bg-[#FFD700]/5">
                      {m.waist} cm
                      {waistDiff !== 0 && (
                        <span className={`block text-[10px] ${waistDiff < 0 ? 'text-emerald-400 font-bold' : 'text-amber-400'}`}>
                          ({waistDiff > 0 ? `+${waistDiff}` : waistDiff} cm)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-bold text-[#FFD700] bg-[#FFD700]/5">
                      {m.hips} cm
                    </td>
                    <td className="py-3 px-3 text-gray-200">{m.thigh} cm</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-[#0B192C] text-[#F6ECB7] font-semibold border border-[#2A3B5C]">
                        {m.whr}
                      </span>
                    </td>
                    <td className="py-3 px-3 max-w-[200px]">
                      <div className="text-[11px] text-gray-300 truncate font-medium">{m.recordedBy}</div>
                      {m.notes && <div className="text-[10px] text-gray-400 line-clamp-1 italic">"{m.notes}"</div>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
