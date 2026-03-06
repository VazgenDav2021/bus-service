import { memo } from "react";
import { PaginationControls } from "../../../components/PaginationControls";
import type { DriverListItem } from "../../../types/domain";

interface DriversTableSectionProps {
  loading: boolean;
  drivers: DriverListItem[];
  search: string;
  onSearchChange: (value: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const DriversTableSection = memo(function DriversTableSection({
  loading,
  drivers,
  search,
  onSearchChange,
  page,
  totalPages,
  onPageChange,
}: DriversTableSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200">
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Որոնել (անուն, էլ. փոստ, հեռախոս)"
          className="w-full max-w-sm px-3 py-2 rounded-lg border border-slate-300 text-sm"
        />
      </div>
      {loading ? (
        <div className="p-8 text-center text-slate-500">Բեռնվում է...</div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 text-left text-sm text-slate-600">
              <th className="px-4 py-3">Անուն</th>
              <th className="px-4 py-3">Էլ. փոստ</th>
              <th className="px-4 py-3">Հեռախոս</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((d) => (
              <tr key={d.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{d.name}</td>
                <td className="px-4 py-3">{d.email}</td>
                <td className="px-4 py-3">{d.phone ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
});
