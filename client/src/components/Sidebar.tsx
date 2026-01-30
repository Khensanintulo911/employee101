import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  AlertTriangle, 
  GraduationCap,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Employees", href: "/employees", icon: Users },
  { name: "Leave Requests", href: "/leave", icon: CalendarDays },
  { name: "Disciplinary", href: "/disciplinary", icon: AlertTriangle },
  { name: "Training", href: "/training", icon: GraduationCap },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="flex h-full min-h-screen w-64 flex-col bg-slate-900 text-white shadow-xl">
      <div className="flex h-16 items-center gap-3 px-6 font-display text-xl font-bold tracking-tight text-white border-b border-slate-800">
        <ShieldCheck className="h-6 w-6 text-primary" />
        DevPulse HR
      </div>
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "group flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 cursor-pointer",
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                      isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-slate-800/50 p-3">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            KN
          </div>
          <div>
            <p className="text-xs font-medium text-white">Khensani Ntulo</p>
            <p className="text-xs text-slate-500">k.ntulo@devpulse-hr.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
