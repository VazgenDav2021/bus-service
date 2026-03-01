import { LogOut, LayoutDashboard } from "lucide-react";

interface AdminHeaderProps {
  onLogout: () => void;
}

export function AdminHeader({ onLogout }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6 text-primary-600" />
          <span className="font-semibold text-slate-800">Ադմինի վահանակ</span>
        </div>
        <button
          onClick={onLogout}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-600">
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
