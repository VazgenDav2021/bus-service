export function buildQrScanUrl(token: string, appBaseUrl?: string): string {
  const baseUrl = appBaseUrl ?? window.location.origin;
  return `${baseUrl}/scan?token=${token}`;
}

export function extractQrToken(decodedText: string): string | null {
  if (decodedText.startsWith('QR-')) {
    return decodedText;
  }
  try {
    const url = new URL(decodedText);
    const token = url.searchParams.get('token');
    if (token && token.startsWith('QR-')) {
      return token;
    }
    return null;
  } catch {
    return null;
  }
}
