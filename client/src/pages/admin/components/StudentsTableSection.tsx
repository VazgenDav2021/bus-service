import { memo } from "react";
import { PaginationControls } from "../../../components/PaginationControls";
import type { StudentListItem } from "../../../types/domain";

export const STUDENT_COLUMN_KEYS = [
  "studentId",
  "name",
  "email",
  "image",
  "status",
  "qrToken",
  "qrUsageCount",
  "qrUsageTotal",
  "actions",
] as const;

export type StudentColumnKey = (typeof STUDENT_COLUMN_KEYS)[number];

type StudentVisibleColumns = Record<StudentColumnKey, boolean>;

interface StudentsTableSectionProps {
  loading: boolean;
  students: StudentListItem[];
  onCreate: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: "all" | "active" | "inactive";
  onStatusFilterChange: (value: "all" | "active" | "inactive") => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  visibleColumns: StudentVisibleColumns;
  onToggleColumn: (column: StudentColumnKey) => void;
  onViewQr: (student: StudentListItem) => void;
  onEdit: (student: StudentListItem) => void;
  onDelete: (student: StudentListItem) => void;
}

export const StudentsTableSection = memo(function StudentsTableSection({
  loading,
  students,
  onCreate,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  page,
  totalPages,
  onPageChange,
  visibleColumns,
  onToggleColumn,
  onViewQr,
  onEdit,
  onDelete,
}: StudentsTableSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-96">
      <div className="p-4 border-b flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Ուսանողներ</h2>
        <button
          onClick={onCreate}
          className="px-3 py-1.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 text-sm font-medium">
          Ստեղծել ուսանող
        </button>
      </div>
      <div className="p-4 border-b border-slate-200 flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Որոնել (ID, անուն, էլ. փոստ)"
          className="w-full max-w-sm px-3 py-2 rounded-lg border border-slate-300 text-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) =>
            onStatusFilterChange(e.target.value as "all" | "active" | "inactive")
          }
          className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white">
          <option value="all">Բոլոր կարգավիճակները</option>
          <option value="active">Միայն ակտիվ</option>
          <option value="inactive">Միայն պասիվ</option>
        </select>
        <details className="relative">
          <summary className="list-none cursor-pointer px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white">
            Սյունակներ
          </summary>
          <div className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white shadow-lg p-3 z-10 space-y-2">
            {[
              { key: "studentId", label: "ID" },
              { key: "name", label: "Անուն" },
              { key: "email", label: "Էլ. փոստ" },
              { key: "image", label: "Նկար" },
              { key: "status", label: "Կարգավիճակ" },
              { key: "qrToken", label: "QR կոդ" },
              { key: "qrUsageCount", label: "QR այսօր" },
              { key: "qrUsageTotal", label: "QR ընդհանուր" },
              { key: "actions", label: "Գործողություն" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={visibleColumns[key as StudentColumnKey]}
                  onChange={() => onToggleColumn(key as StudentColumnKey)}
                />
                {label}
              </label>
            ))}
          </div>
        </details>
      </div>
      {loading ? (
        <div className="p-8 text-center text-slate-500">Բեռնվում է...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-left text-sm text-slate-600">
                {visibleColumns.studentId && <th className="px-4 py-3">ID</th>}
                {visibleColumns.name && <th className="px-4 py-3">Անուն</th>}
                {visibleColumns.email && <th className="px-4 py-3">Էլ. փոստ</th>}
                {visibleColumns.image && <th className="px-4 py-3">Նկար</th>}
                {visibleColumns.status && <th className="px-4 py-3">Կարգավիճակ</th>}
                {visibleColumns.qrToken && <th className="px-4 py-3">QR կոդ</th>}
                {visibleColumns.qrUsageCount && (
                  <th className="px-4 py-3">QR օգտագործում այսօր</th>
                )}
                {visibleColumns.qrUsageTotal && (
                  <th className="px-4 py-3">QR ընդհանուր օգտագործում</th>
                )}
                {visibleColumns.actions && <th className="px-4 py-3">Գործողություն</th>}
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-t border-slate-100">
                  {visibleColumns.studentId && <td className="px-4 py-3">{s.studentId}</td>}
                  {visibleColumns.name && <td className="px-4 py-3">{s.name}</td>}
                  {visibleColumns.email && <td className="px-4 py-3">{s.email ?? "-"}</td>}
                  {visibleColumns.image && (
                    <td className="px-4 py-3">
                      {s.imageUrl ? (
                        <img
                          src={s.imageUrl}
                          alt={s.name}
                          className="h-[176px] w-[176px] min-h-[176px] min-w-[176px] rounded object-cover border border-slate-200"
                        />
                      ) : (
                        <span className="text-slate-400 text-sm">—</span>
                      )}
                    </td>
                  )}
                  {visibleColumns.status && (
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          s.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-200 text-slate-600"
                        }`}>
                        {s.isActive ? "Ակտիվ" : "Պասիվ"}
                      </span>
                    </td>
                  )}
                  {visibleColumns.qrToken && (
                    <td className="px-4 py-3">
                      {s.qrToken ? (
                        <button
                          onClick={() => onViewQr(s)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 text-sm font-medium">
                          Դիտել QR
                        </button>
                      ) : (
                        <span className="text-slate-400 text-sm">—</span>
                      )}
                    </td>
                  )}
                  {visibleColumns.qrUsageCount && (
                    <td className="px-4 py-3">{s.qrUsageCount}</td>
                  )}
                  {visibleColumns.qrUsageTotal && (
                    <td className="px-4 py-3">{s.qrUsageTotal}</td>
                  )}
                  {visibleColumns.actions && (
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEdit(s)}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-medium">
                          Խմբագրել
                        </button>
                        <button
                          onClick={() => onDelete(s)}
                          className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-sm font-medium">
                          Հեռացնել
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
});
