import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Loading from '../../components/ui/Loading';

const STATUS_META = {
  pending: {
    label: 'En attente de validation',
    bg: 'from-amber-500 to-amber-600',
    icon: 'fa-clock',
    msg: "Votre candidature est en cours d'examen.",
  },
  under_review: {
    label: 'En cours d\'examen',
    bg: 'from-blue-500 to-blue-600',
    icon: 'fa-search',
    msg: "Votre candidature est en cours d'examen.",
  },
  approved: {
    label: 'Approuvée',
    bg: 'from-emerald-500 to-emerald-600',
    icon: 'fa-check-double',
    msg: 'Votre candidature a été approuvée.',
  },
  active: {
    label: 'Acceptée',
    bg: 'from-emerald-500 to-emerald-600',
    icon: 'fa-check-circle',
    msg: 'Votre candidature a été acceptée. Félicitations ! Consultez votre offre de stage envoyée par e-mail et préparez votre arrivée.',
  },
  rejected: {
    label: 'Refusée',
    bg: 'from-red-500 to-red-600',
    icon: 'fa-times-circle',
    msg: "Votre candidature a été refusée.",
  },
};

const QR_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}`.replace('/api', '') + '/api/qrcode';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrError, setQrError] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [enlargeQr, setEnlargeQr] = useState(false);
  const [visible, setVisible] = useState({});
  const initialized = useRef(false);

  useEffect(() => {
    api.get('/dashboard/intern')
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    for (let i = 0; i < 8; i++) {
      setTimeout(() => setVisible((v) => ({ ...v, [i]: true })), 60 + i * 60);
    }
  }, []);

  useEffect(() => {
    const hasToken = data?.intern?.qr_token;
    if (!hasToken) return;
    setQrError(false);
    setQrDataUrl(null);
    api.get('/qrcode', { responseType: 'blob' })
      .then((res) => setQrDataUrl(URL.createObjectURL(res.data)))
      .catch(() => setQrError(true));
  }, [data?.intern?.qr_token]);

  const handleDownloadQr = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(QR_BASE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qr_code_presence.png';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  };

  if (loading) return <Loading />;

  const hasApp = data?.has_application;
  const status = data?.status;
  const intern = data?.intern;
  const qrToken = intern?.qr_token;
  const meta = STATUS_META[status] || null;
  const hasIntern = !!intern;
  const showQr = hasIntern && !!qrToken;

  const quickLinks = hasIntern ? [
    { label: 'Présences', value: data?.attendances_count ?? 0, path: '/intern/attendance', icon: 'fa-calendar-check', color: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
    { label: 'Rapport', value: data?.has_report ? 'Soumis' : '—', path: '/intern/report', icon: 'fa-file-alt', color: 'linear-gradient(135deg, #f59e0b, #d97706)' },
    { label: 'Évaluation', value: data?.has_evaluation ? 'Noté' : '—', path: '/intern/evaluation', icon: 'fa-star', color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
    { label: 'Offre de stage', value: data?.has_offre ? 'Disponible' : '—', path: '/intern/offre-stage', icon: 'fa-file-contract', color: 'linear-gradient(135deg, #00843D, #02421D)' },
    { label: 'Attestation', value: data?.has_certificate ? 'Disponible' : '—', path: '/intern/certificate', icon: 'fa-certificate', color: 'linear-gradient(135deg, #10b981, #059669)' },
  ] : [];

  const fadeCls = (id) =>
    `transition-all duration-600 ease-out ${visible[id] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`;

  return (
    <div>
      {/* Enlarge QR Modal */}
      {enlargeQr && showQr && !qrError && qrDataUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setEnlargeQr(false)}>
          <div className="bg-white rounded-[20px] p-6 shadow-2xl max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <img src={qrDataUrl} alt="QR Code" className="w-64 h-64 mx-auto rounded-xl" />
            <p className="text-center text-xs text-gray-500 mt-4 break-all select-all font-mono">{qrToken}</p>
            <button onClick={() => setEnlargeQr(false)}
              className="btn-primary w-full mt-4 justify-center">Fermer</button>
          </div>
        </div>
      )}

      <div className={fadeCls(0)}>
        <h1 className="font-cooper-medium text-3xl sm:text-4xl text-ocp-700 tracking-tight">Mon tableau de bord</h1>
        <p className="text-gray-500 text-sm mt-1">Vue d'ensemble de votre parcours de stage</p>
      </div>

      {data?.has_active_internship && (
        <div className={fadeCls(1)}>
          <div className="bg-amber-50 border border-amber-200 rounded-[20px] p-4 mt-6 mb-6 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-800">Stage en cours</p>
              <p className="text-sm text-amber-700 mt-1">
                Vous avez déjà un stage en cours. Vous ne pouvez pas déposer une nouvelle candidature tant que votre stage actuel n'est pas terminé.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-8">
        {/* Status Card */}
        <div className={fadeCls(2)}>
          <div className="bg-white border border-ocp-500/5 rounded-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-all duration-200 hover:shadow-[0_16px_40px_rgba(2,66,29,0.08)] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center text-white text-lg bg-gradient-to-r ${meta ? meta.bg : 'from-gray-400 to-gray-500'}`}>
                <i className={`fas ${meta ? meta.icon : 'fa-minus-circle'}`} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-ocp-700">Statut de la candidature</h2>
                <p className="text-xs text-gray-500">Votre situation actuelle</p>
              </div>
            </div>
            <div className="mb-3">
              {meta ? (
                <span className={`inline-block text-[0.75rem] font-semibold px-4 py-1 rounded-full bg-gradient-to-r ${meta.bg} text-white shadow-sm`}>
                  {meta.label}
                </span>
              ) : (
                <span className="inline-block text-[0.75rem] font-semibold px-4 py-1 rounded-full bg-gray-200 text-gray-500">
                  Aucune
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              {!hasApp && "Vous n'avez pas encore soumis de candidature."}
              {meta && meta.msg}
              {status === 'active' && hasIntern && (
                <Link to="/intern/offre-stage" className="block mt-2 text-ocp-600 font-semibold hover:underline">
                  Voir mon offre de stage <i className="fas fa-arrow-right text-xs ml-1" />
                </Link>
              )}
              {status === 'rejected' && data?.rejection_reason && (
                <span className="block mt-2 text-red-600 text-xs bg-red-50 rounded-lg p-3">
                  Motif : {data.rejection_reason}
                </span>
              )}
            </p>
            {!hasApp && (
              <Link to="/intern/application" className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-ocp-500 hover:text-ocp-700 transition-colors">
                Postuler maintenant <i className="fas fa-arrow-right text-xs" />
              </Link>
            )}
          </div>
        </div>

        {/* QR Code Card */}
        <div className={fadeCls(3)}>
          <div className="bg-white border border-ocp-500/5 rounded-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-all duration-200 hover:shadow-[0_16px_40px_rgba(2,66,29,0.08)] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-[14px] flex items-center justify-center text-white text-lg" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                <i className="fas fa-qrcode" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-ocp-700">QR Code de présence</h2>
                <p className="text-xs text-gray-500">Token d'enregistrement</p>
              </div>
            </div>
            {showQr ? (
              <div className="text-center space-y-3">
                <div className="bg-white rounded-[14px] p-3 border border-ocp-500/10 inline-block mx-auto">
                  {qrError || !qrDataUrl ? (
                    <div className="w-[180px] h-[180px] flex items-center justify-center text-gray-400 text-sm">
                      {qrError ? 'QR non disponible' : 'Chargement...'}
                    </div>
                  ) : (
                    <img src={qrDataUrl} alt="QR Code" className="w-[180px] h-[180px] rounded-lg mx-auto" />
                  )}
                </div>
                <p className="text-[0.7rem] text-gray-400 font-mono break-all select-all bg-ocp-50 rounded-lg px-3 py-2 max-w-xs mx-auto">
                  {qrToken}
                </p>
                <div className="flex gap-2 justify-center">
                  <button onClick={handleDownloadQr}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white text-ocp-600 hover:bg-ocp-50 hover:border-ocp-200 transition-all">
                    <i className="fas fa-download" /> Télécharger
                  </button>
                  <button onClick={() => setEnlargeQr(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white text-purple-600 hover:bg-purple-50 hover:border-purple-200 transition-all">
                    <i className="fas fa-expand" /> Agrandir
                  </button>
                </div>
                <p className="text-xs text-gray-400">Présentez ce QR Code au superviseur pour enregistrer votre présence</p>
              </div>
            ) : (
              <div>
                {status === 'rejected' || status === 'pending' || status === 'under_review' ? (
                  <p className="text-sm text-gray-400">Le QR Code sera disponible après acceptation de votre candidature.</p>
                ) : status === 'approved' ? (
                  <p className="text-sm text-gray-400">Le QR Code sera disponible une fois votre stage activé.</p>
                ) : (
                  <p className="text-sm text-gray-400">Disponible après acceptation de la candidature.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      {hasIntern && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-2 mb-8">
          {quickLinks.map((link, i) => (
            <Link
              key={link.label}
              to={link.path}
              className={`block bg-white border border-ocp-500/5 rounded-[20px] p-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(2,66,29,0.08)] hover:border-ocp-500/10 ${
                fadeCls(i + 4).replace('transition-all duration-600 ease-out ', '')
              }`}
            >
              <div
                className="w-11 h-11 rounded-[14px] flex items-center justify-center mb-3 text-white text-lg"
                style={{ background: link.color }}
              >
                <i className={`fas ${link.icon}`} />
              </div>
              <div className="font-cooper-medium text-[1.8rem] font-bold text-ocp-700 leading-tight">{link.value}</div>
              <div className="text-[0.8rem] text-gray-500 font-medium mt-0.5">{link.label}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
