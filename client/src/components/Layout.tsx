import { Sidebar } from "./Sidebar";
import { Toaster } from "./ui/toaster";

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  action?: React.ReactNode;
}

export function Layout({ children, title, action }: LayoutProps) {
  return (
    <div className="flex h-screen bg-slate-50/50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur-md">
          <h1 className="font-display text-2xl font-bold text-slate-800">{title}</h1>
          <div className="flex items-center gap-4">{action}</div>
        </header>
        <div className="p-8">
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
}
