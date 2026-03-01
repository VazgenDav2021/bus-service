import type { StudentListItem } from "../../../types/domain";

interface StudentEditModalProps {
  student: StudentListItem | null;
  loading: boolean;
  form: {
    name: string;
    email: string;
    isActive: boolean;
    image: File | null;
  };
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onIsActiveChange: (value: boolean) => void;
  onImageChange: (file: File | null) => void;
}

export function StudentEditModal({
  student,
  loading,
  form,
  onClose,
  onSubmit,
  onNameChange,
  onEmailChange,
  onIsActiveChange,
  onImageChange,
}: StudentEditModalProps) {
  if (!student) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={() => !loading && onClose()}>
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-200 p-6"
        onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Խմբագրել ուսանողին
        </h3>
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            value={form.name}
            onChange={(e) => onNameChange(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-slate-300"
            placeholder="Անուն"
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-300"
            placeholder="Էլ. փոստ (ոչ պարտադիր)"
          />
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => onIsActiveChange(e.target.checked)}
            />
            Ակտիվ ուսանող
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onImageChange(e.target.files?.[0] ?? null)}
            className="w-full px-4 py-2 rounded-lg border border-slate-300"
          />
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-60">
              Չեղարկել
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-60">
              {loading ? "Պահվում է..." : "Պահպանել"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
