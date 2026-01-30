import { Layout } from "@/components/Layout";
import { StatCard } from "@/components/StatCard";
import { useEmployees } from "@/hooks/use-employees";
import { useLeaveRequests } from "@/hooks/use-leave";
import { useDisciplinaryRecords } from "@/hooks/use-discipline";
import { Users, CalendarClock, AlertTriangle, GraduationCap } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

/**
 * Dashboard Component
 * 
 * Provides an executive overview of HR metrics, including total employees,
 * pending leave requests, active leave, and disciplinary cases.
 * 
 * @returns {JSX.Element} The rendered dashboard page
 */
export default function Dashboard() {
  const { data: employees } = useEmployees();
  const { data: leaveRequests } = useLeaveRequests();
  const { data: disciplinary } = useDisciplinaryRecords();

  const activeEmployees = employees?.filter(e => e.isActive).length || 0;
  const pendingLeave = leaveRequests?.filter(l => l.status === "Pending").length || 0;
  const totalDisciplinary = disciplinary?.length || 0;
  const leaveToday = leaveRequests?.filter(l => {
    const today = new Date().toISOString().split("T")[0];
    return l.startDate <= today && l.endDate >= today && l.status === "Approved";
  }).length || 0;

  // Mock data for chart - in a real app, aggregate from database
  const deptData = [
    { name: "Engineering", count: 12 },
    { name: "HR", count: 4 },
    { name: "Sales", count: 8 },
    { name: "Finance", count: 5 },
    { name: "Operations", count: 10 },
  ];

  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <Layout title="Executive Dashboard">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Employees"
          value={activeEmployees}
          icon={Users}
          color="blue"
          trend="+2.5%"
          trendUp={true}
        />
        <StatCard
          title="Pending Leave"
          value={pendingLeave}
          icon={CalendarClock}
          color="amber"
          trend="Requires Action"
          trendUp={false}
        />
        <StatCard
          title="On Leave Today"
          value={leaveToday}
          icon={GraduationCap} // Using as placeholder for "out of office"
          color="green"
        />
        <StatCard
          title="Disciplinary Cases"
          value={totalDisciplinary}
          icon={AlertTriangle}
          color="red"
          trend="-1.2%"
          trendUp={true}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="mb-6 font-display text-lg font-semibold text-slate-800">Employee Distribution by Department</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f1f5f9' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-display text-lg font-semibold text-slate-800">Recent Activity</h3>
          <div className="space-y-4">
            {leaveRequests?.slice(0, 5).map((request) => (
              <div key={request.id} className="flex items-start gap-3 rounded-lg border border-slate-50 bg-slate-50/50 p-3">
                <div className="mt-0.5 rounded-full bg-blue-100 p-1.5 text-blue-600">
                  <CalendarClock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Leave Request #{request.id}</p>
                  <p className="text-xs text-slate-500">
                    {request.type} • {request.status}
                  </p>
                </div>
              </div>
            ))}
            {!leaveRequests?.length && (
              <div className="text-center text-sm text-muted-foreground py-8">
                No recent activity found.
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
