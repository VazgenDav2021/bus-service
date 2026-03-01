import { X } from "lucide-react";
import { QRCodeDisplay } from "../../../components/QRCodeDisplay";

interface StudentQrViewerModalProps {
  data: { studentId: string; name: string; qrToken: string } | null;
  onClose: () => void;
}

export function StudentQrViewerModal({ data, onClose }: StudentQrViewerModalProps) {
  if (!data) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}>
      <div
        className="bg-white rounded-xl p-6 max-w-sm"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">QR կոդ — {data.name}</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        <QRCodeDisplay value={data.qrToken} size={220} studentName={data.name} />
      </div>
    </div>
  );
}
