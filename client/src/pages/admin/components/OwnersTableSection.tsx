import { memo } from "react";
import { PaginationControls } from "../../../components/PaginationControls";
import type { OwnerListItem } from "../../../types/domain";

interface OwnersTableSectionProps {
  loading: boolean;
  owners: OwnerListItem[];
  onCreate: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const OwnersTableSection = memo(function OwnersTableSection({
  loading,
  owners,
  onCreate,
  search,
  onSearchChange,
  page,
  totalPages,
  onPageChange,
}: OwnersTableSectionProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Ավտոբուսի սեփականատերեր</h2>
          <button
            onClick={onCreate}
            className="px-3 py-1.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 text-sm font-medium">
            Ստեղծել սեփականատեր
          </button>
        </div>
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
                <th className="px-4 py-3">Ավտոբուսներ</th>
              </tr>
            </thead>
            <tbody>
              {owners.map((o) => (
                <tr key={o.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">{o.name}</td>
                  <td className="px-4 py-3">{o.email}</td>
                  <td className="px-4 py-3">{o.phone ?? "-"}</td>
                  <td className="px-4 py-3">{o._count?.buses ?? 0}</td>
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
    </div>
  );
});
