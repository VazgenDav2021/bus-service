import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { extractQrToken } from '../../utils/qr';

interface QRScannerProps {
  onScan: (token: string) => void;
  onError?: (error: string) => void;
  title?: string;
  disabled?: boolean;
}

export function QRScanner({
  onScan,
  onError,
  title = 'Սկանավորեք ուսանողի QR կոդը',
  disabled = false,
}: QRScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || disabled) return;

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1,
    };

    const scanner = new Html5Qrcode('qr-reader');
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          const token = extractQrToken(decodedText);
          if (token) {
            onScan(token);
          } else {
            onError?.('QR կոդի ձևաչափը անվավեր է');
          }
        },
        () => {}
      )
      .then(() => {
        setHasPermission(true);
        setError(null);
      })
      .catch((err: Error) => {
        setHasPermission(false);
        setError(err.message || 'Տեսախցիկի մուտքը մերժված է');
      });

    return () => {
      scanner
        .stop()
        .then(() => {
          scanner.clear();
          scannerRef.current = null;
        })
        .catch(() => {});
    };
  }, [disabled, onScan, onError]);

  if (disabled) {
    return (
      <div className="aspect-square max-w-sm mx-auto bg-slate-200 rounded-xl flex items-center justify-center">
        <p className="text-slate-500">Սկանավորելու համար սկսեք հերթափոխը</p>
      </div>
    );
  }

  if (hasPermission === false || error) {
    return (
      <div className="aspect-square max-w-sm mx-auto bg-slate-100 rounded-xl flex flex-col items-center justify-center p-4 gap-2">
        <p className="text-red-600 text-sm text-center">{error}</p>
        <p className="text-slate-500 text-xs text-center">
          Թույլատրեք տեսախցիկի մուտքը և թարմացրեք էջը
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-slate-600 text-center">{title}</p>
      <div
        id="qr-reader"
        ref={containerRef}
        className="rounded-xl overflow-hidden border-2 border-primary-500"
      />
    </div>
  );
}
