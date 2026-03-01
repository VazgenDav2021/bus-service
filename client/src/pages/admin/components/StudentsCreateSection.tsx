import { memo } from "react";
import { Plus, X } from "lucide-react";
import { QRCodeDisplay } from "../../../components/QRCodeDisplay";

interface StudentsCreateSectionProps {
  createdStudentQR: { studentId: string; name: string; qrToken: string } | null;
  onCloseCreatedQr: () => void;
  onSubmit: (e: React.FormEvent) => void;
  form: {
    name: string;
    email: string;
    isActive: boolean;
    image: File | null;
  };
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onIsActiveChange: (value: boolean) => void;
  onImageChange: (file: File | null) => void;
}

export const StudentsCreateSection = memo(function StudentsCreateSection({
  createdStudentQR,
  onCloseCreatedQr,
  onSubmit,
  form,
  onNameChange,
  onEmailChange,
  onIsActiveChange,
  onImageChange,
}: StudentsCreateSectionProps) {
  return (
    <div className="space-y-6">
      {createdStudentQR && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-green-800">
              Ուսանողը ստեղծվել է — QR կոդ
            </h3>
            <button
              onClick={onCloseCreatedQr}
              className="p-1 rounded hover:bg-green-100 text-green-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-4">
            <QRCodeDisplay
              value={createdStudentQR.qrToken}
              size={180}
              studentName={createdStudentQR.name}
            />
          </div>
          <p className="mt-3 text-sm text-green-700">
            Տպեք կամ կիսվեք այս QR կոդը ուսանողի հետ։ Վարորդները այն
            սկանավորում են երթերի ընթացքում։
          </p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Ավելացնել ուսանող
        </h2>
        <form onSubmit={onSubmit} className="space-y-3 max-w-md">
          <input
            placeholder="Անուն"
            value={form.name}
            onChange={(e) => onNameChange(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-slate-300"
          />
          <input
            type="email"
            placeholder="Էլ. փոստ (ոչ պարտադիր)"
            value={form.email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-300"
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
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg">
            Ստեղծել ուսանող
          </button>
        </form>
      </div>
    </div>
  );
});
