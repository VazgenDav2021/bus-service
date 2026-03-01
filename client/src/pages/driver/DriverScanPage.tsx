import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { api } from '../../lib/api';
import type { StudentScanResult } from '../../types/domain';
import { getErrorMessage } from '../../utils/errors';
import { APP_ROUTES } from '../../constants/routes';

const TEMP_HARDCODED_QR_TOKEN = 'QR-8b1da795d00af5c2a0d729ff68a66a0f';

export function DriverScanPage() {
  const navigate = useNavigate();
  const autoScanTriggeredRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [studentInfo, setStudentInfo] = useState<StudentScanResult | null>(null);

  async function handleScan(token: string) {
    if (loading) return;
    setLoading(true);
    try {
      const data = await api.driver.getStudentByQr(token);
      setQrToken(token);
      setStudentInfo(data);
      toast.success(`Ուսանողը գտնվեց՝ ${data.student.name}`);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Չհաջողվեց բեռնել ուսանողի տվյալները'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (autoScanTriggeredRef.current) return;
    autoScanTriggeredRef.current = true;
    void handleScan(TEMP_HARDCODED_QR_TOKEN);
  }, []);

  async function handleSubmitEntrance() {
    if (!qrToken) return;
    setLoading(true);
    try {
      const result = await api.driver.submitBoarding(qrToken);
      toast.success(result.message);
      setQrToken(null);
      setStudentInfo(null);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Չհաջողվեց գրանցել մուտքը'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-lg mx-auto p-4 space-y-4">
        <button
          onClick={() => navigate(APP_ROUTES.driver)}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Վերադառնալ վարորդի վահանակ
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <p className="mb-3 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
            Ժամանակավոր թեստային ռեժիմ՝ օգտագործվում է hardcoded QR token{' '}
            <strong>{TEMP_HARDCODED_QR_TOKEN}</strong>
          </p>
          {/* <QRScanner
            onScan={handleScan}
            onError={(message) => toast.error(message)}
            title="Scan a student QR code"
            disabled={loading}
          /> */}
        </div>

        {studentInfo && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-3">
            <h2 className="text-lg font-semibold text-slate-800">Ուսանողի տվյալներ</h2>
            <p className="text-slate-700">
              Անուն՝ <strong>{studentInfo.student.name}</strong>
            </p>
            <p className="text-slate-700">
              Ուսանողի ID՝ <strong>{studentInfo.student.studentId}</strong>
            </p>
            <p className="text-slate-700">
              Էլ. փոստ՝ <strong>{studentInfo.student.email ?? '-'}</strong>
            </p>
            <p className="text-slate-700">
              Ավտոբուս՝ <strong>{studentInfo.bus.plateNumber}</strong>
            </p>
            <button
              onClick={handleSubmitEntrance}
              disabled={loading}
              className="mt-2 w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white disabled:opacity-60"
            >
              <CheckCircle2 className="w-4 h-4" />
              Գրանցել մուտքը
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
