import { QRCodeSVG } from 'qrcode.react';
import { buildQrScanUrl } from '../utils/qr';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  studentName?: string;
}

export function QRCodeDisplay({ value, size = 200, studentName }: QRCodeDisplayProps) {
  const appUrl = import.meta.env.VITE_APP_URL ?? window.location.origin;
  const qrCode = buildQrScanUrl(value, appUrl);
  return (
    <div className="inline-flex flex-col items-center gap-2 p-4 bg-white rounded-lg border border-slate-200">
      {studentName && (
        <p className="text-sm font-medium text-slate-700">{studentName}</p>
      )}
      <QRCodeSVG value={qrCode} size={size} level="M" />
      <p className="text-xs text-slate-500 font-mono break-all max-w-[200px] text-center">
        {value}
      </p>
    </div>
  );
}
