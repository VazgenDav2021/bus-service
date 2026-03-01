import { memo } from "react";
import { PaginationControls } from "../../../components/PaginationControls";
import type { BusListItem } from "../../../types/domain";

interface BusesTableSectionProps {
  loading: boolean;
  buses: BusListItem[];
  search: string;
  onSearchChange: (value: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const BusesTableSection = memo(function BusesTableSection({
  loading,
  buses,
  search,
  onSearchChange,
  page,
  totalPages,
  onPageChange,
}: BusesTableSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200">
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Որոնել (համարանիշ, սեփականատեր)"
          className="w-full max-w-sm px-3 py-2 rounded-lg border border-slate-300 text-sm"
        />
      </div>
      {loading ? (
        <div className="p-8 text-center text-slate-500">Բեռնվում է...</div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 text-left text-sm text-slate-600">
              <th className="px-4 py-3">Համարանիշ</th>
              <th className="px-4 py-3">Տարողություն</th>
              <th className="px-4 py-3">Սեփականատեր</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((b) => (
              <tr key={b.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{b.plateNumber}</td>
                <td className="px-4 py-3">{b.capacity}</td>
                <td className="px-4 py-3">{b.owner?.name ?? "-"}</td>
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
