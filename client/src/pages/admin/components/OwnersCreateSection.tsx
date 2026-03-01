import { memo } from "react";
import { Plus } from "lucide-react";

interface OwnersCreateSectionProps {
  form: {
    name: string;
    email: string;
    phone: string;
    password: string;
  };
  onSubmit: (e: React.FormEvent) => void;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}

export const OwnersCreateSection = memo(function OwnersCreateSection({
  form,
  onSubmit,
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onPasswordChange,
}: OwnersCreateSectionProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Ավելացնել ավտոբուսի սեփականատեր
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
            placeholder="Էլ. փոստ"
            value={form.email}
            onChange={(e) => onEmailChange(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-slate-300"
          />
          <input
            placeholder="Հեռախոս (ոչ պարտադիր)"
            value={form.phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-300"
          />
          <input
            type="text"
            placeholder="Գաղտնաբառ"
            value={form.password}
            onChange={(e) => onPasswordChange(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-slate-300"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg">
            Ստեղծել ավտոբուսի սեփականատեր
          </button>
        </form>
      </div>
    </div>
  );
});
