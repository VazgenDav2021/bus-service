import { memo } from "react";
import { Users } from "lucide-react";

interface AdminRouteNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  paths: {
    students: string;
    studentsCreate: string;
    drivers: string;
    busOwners: string;
    busOwnersCreate: string;
  };
}

export const AdminRouteNav = memo(function AdminRouteNav({
  currentPath,
  onNavigate,
  paths,
}: AdminRouteNavProps) {
  return (
    <nav className="flex gap-2 mb-6 overflow-x-auto pb-2">
      {[
        { key: "students", path: paths.students, label: "Ուսանողներ", icon: Users },
        { key: "drivers", path: paths.drivers, label: "Վարորդներ", icon: Users },
        {
          key: "busOwners",
          path: paths.busOwners,
          label: "Սեփականատերեր",
          icon: Users,
        },
      ].map(({ key, path, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onNavigate(path)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
            currentPath.includes(path)
              ? "bg-primary-600 text-white"
              : "bg-white text-slate-600 border border-slate-200"
          }`}>
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </nav>
  );
});
