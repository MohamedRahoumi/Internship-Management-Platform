import { useState, useRef, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import api from '../../api/axios';

const QR_READER_ID = 'qr-scanner-element';

const Scanner = () => {
  const [mode, setMode] = useState('camera');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try { scannerRef.current.stop(); } catch {}
      }
    };
  }, []);

  const startCamera = async () => {
    if (scannerRef.current) {
      try { await scannerRef.current.stop(); } catch {}
    }

    setCameraError(null);
    const scanner = new Html5Qrcode(QR_READER_ID);
    scannerRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          scanner.stop().catch(() => {});
          setCameraStarted(false);
          handleScanToken(decodedText);
        },
        () => {}
      );
      setCameraStarted(true);
    } catch (err) {
      setCameraError('Impossible d\'accéder à la caméra. Vérifiez les permissions ou utilisez la saisie manuelle.');
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current) {
      try { await scannerRef.current.stop(); } catch {}
    }
    setCameraStarted(false);
  };

  const handleScanToken = async (qrToken) => {
    if (!qrToken || loading) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await api.post('/attendance/scan', { qr_token: qrToken });
      const intern = res.data?.intern || {};
      const internName = intern?.user ? `${intern.user.prenom || ''} ${intern.user.nom || ''}`.trim() : '';
      const isCheckIn = res.data?.status === 'checked_in';
      const action = isCheckIn ? "check-in" : "check-out";
      setResult({
        type: 'success',
        message: internName
          ? `${action} enregistré — ${internName}`
          : `${action} enregistré avec succès`,
      });
      setToken('');
    } catch (err) {
      setResult({
        type: 'error',
        message: err.response?.data?.message || 'Erreur lors de l\'enregistrement',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!token.trim()) return;
    await handleScanToken(token.trim());
  };

  const switchMode = (newMode) => {
    if (newMode === mode) return;
    if (newMode === 'manual') stopCamera();
    setMode(newMode);
    setResult(null);
    setCameraError(null);
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="transition-all duration-600 ease-out opacity-100 translate-y-0">
        <h1 className="font-cooper-medium text-3xl sm:text-4xl text-ocp-700 tracking-tight">Scanner</h1>
        <p className="text-gray-500 text-sm mt-1">Enregistrer la présence d'un stagiaire</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex bg-ocp-50 rounded-[14px] p-1 mt-6 max-w-xs mx-auto">
        <button
          onClick={() => switchMode('camera')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-[10px] transition-all ${
            mode === 'camera' ? 'bg-white text-ocp-700 shadow-sm' : 'text-gray-500 hover:text-ocp-600'
          }`}
        >
          <i className="fas fa-camera" /> Caméra
        </button>
        <button
          onClick={() => switchMode('manual')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-[10px] transition-all ${
            mode === 'manual' ? 'bg-white text-ocp-700 shadow-sm' : 'text-gray-500 hover:text-ocp-600'
          }`}
        >
          <i className="fas fa-keyboard" /> Manuel
        </button>
      </div>

      <div className="bg-white border border-ocp-500/5 rounded-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-all duration-200 hover:shadow-[0_16px_40px_rgba(2,66,29,0.08)] mt-4 p-6">
        {/* Camera Mode */}
        {mode === 'camera' && (
          <div className="flex flex-col items-center">
            <div
              id={QR_READER_ID}
              className="w-full max-w-sm rounded-[14px] overflow-hidden bg-gray-100"
              style={{ minHeight: cameraStarted ? 'auto' : '220px' }}
            />

            {cameraError && (
              <div className="mt-4 flex items-center gap-2 text-sm font-medium px-4 py-3 rounded-[12px] bg-red-100 text-red-700 w-full">
                <i className="fas fa-exclamation-circle" />
                {cameraError}
              </div>
            )}

            <div className="flex gap-3 mt-4">
              {!cameraStarted ? (
                <button onClick={startCamera}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-[12px] bg-gradient-to-r from-ocp-500 to-ocp-700 text-white hover:opacity-90 transition-all"
                >
                  <i className="fas fa-camera" /> Ouvrir la caméra
                </button>
              ) : (
                <button onClick={stopCamera}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-[12px] bg-red-500 text-white hover:bg-red-600 transition-all"
                >
                  <i className="fas fa-stop" /> Arrêter
                </button>
              )}
            </div>

            <p className="text-xs text-gray-400 mt-4 text-center">
              Placez le QR Code devant la caméra pour scanner automatiquement
            </p>
          </div>
        )}

        {/* Manual Mode */}
        {mode === 'manual' && (
          <>
            <div className="flex flex-col items-center mb-6">
              <div className="w-14 h-14 rounded-[14px] flex items-center justify-center text-white text-xl mb-3" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                <i className="fas fa-qrcode" />
              </div>
              <p className="text-sm text-gray-500 text-center">
                Saisissez le token QR du stagiaire pour enregistrer sa présence
              </p>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="label-field">Token du stagiaire</label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Coller le token ici..."
                  className="input-field text-center text-base font-mono tracking-wider"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading || !token.trim()}
                className="w-full bg-gradient-to-r from-ocp-500 to-ocp-700 text-white font-semibold py-2.5 rounded-[12px] text-sm transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><i className="fas fa-spinner fa-spin" /> Enregistrement...</>
                ) : (
                  <><i className="fas fa-check-circle" /> Enregistrer la présence</>
                )}
              </button>
            </form>
          </>
        )}

        {/* Result Alert */}
        {result && (
          <div className={`mt-6 flex items-center gap-2 text-sm font-medium px-4 py-3 rounded-[12px] ${
            result.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
          }`}>
            <i className={`fas ${result.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} />
            {result.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Scanner;
