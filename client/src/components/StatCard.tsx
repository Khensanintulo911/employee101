import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: "blue" | "green" | "amber" | "red";
}

export function StatCard({ title, value, icon: Icon, trend, trendUp, color = "blue" }: StatCardProps) {
  const colorStyles = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    red: "bg-rose-50 text-rose-600 border-rose-100",
  };

  return (
    <div className="group relative overflow-hidden rounded-xl bg-card p-6 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold font-display tracking-tight text-foreground">{value}</p>
        </div>
        <div className={cn("rounded-xl p-3 border shadow-sm", colorStyles[color])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-xs font-medium">
          <span className={cn(trendUp ? "text-emerald-600" : "text-rose-600", "flex items-center gap-1")}>
            {trend}
          </span>
          <span className="ml-2 text-muted-foreground">vs last month</span>
        </div>
      )}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
}
