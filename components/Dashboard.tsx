import React from 'react';
import { Candidate } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, UserCheck, UserX, Activity } from 'lucide-react';

interface DashboardProps {
  candidates: Candidate[];
}

const COLORS = ['#4F46E5', '#10B981', '#EF4444']; // Indigo, Green, Red

const Dashboard: React.FC<DashboardProps> = ({ candidates }) => {
  // Compute Stats
  const total = candidates.length;
  const shortlisted = candidates.filter(c => c.status === 'Shortlisted').length;
  const rejected = candidates.filter(c => c.status === 'Rejected').length;
  const avgScore = total > 0 ? Math.round(candidates.reduce((acc, c) => acc + c.score, 0) / total) : 0;

  // Chart Data: Status Distribution
  const pieData = [
    { name: 'Pending', value: total - shortlisted - rejected },
    { name: 'Shortlisted', value: shortlisted },
    { name: 'Rejected', value: rejected },
  ].filter(d => d.value > 0);

  // Chart Data: Score Ranges
  const scoreRanges = [
    { name: '0-40', count: candidates.filter(c => c.score < 40).length },
    { name: '40-60', count: candidates.filter(c => c.score >= 40 && c.score < 60).length },
    { name: '60-80', count: candidates.filter(c => c.score >= 60 && c.score < 80).length },
    { name: '80-100', count: candidates.filter(c => c.score >= 80).length },
  ];

  const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: number | string, icon: React.ElementType, color: string }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase">{title}</p>
        <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Candidates" value={total} icon={Users} color="bg-blue-600" />
        <StatCard title="Shortlisted" value={shortlisted} icon={UserCheck} color="bg-emerald-600" />
        <StatCard title="Rejected" value={rejected} icon={UserX} color="bg-red-600" />
        <StatCard title="Average Score" value={`${avgScore}%`} icon={Activity} color="bg-indigo-600" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Score Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreRanges}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{fill: '#64748b'}} />
                <YAxis tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  cursor={{fill: '#f8fafc'}}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Pipeline Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
