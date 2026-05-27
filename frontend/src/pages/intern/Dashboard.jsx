import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import Badge, { statusBadge } from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import { IconCalendar, IconFileText, IconStar, IconCertificate } from '../../components/ui/Icons';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/intern/dashboard')
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  const application = data?.application;
  const status = application?.status;

  const quickLinks = [
    { label: 'Présences', value: data?.attendance_count ?? 0, path: '/intern/attendance', icon: IconCalendar },
    { label: 'Rapport', value: data?.report_status || '—', path: '/intern/report', icon: IconFileText },
    { label: 'Évaluation', value: data?.evaluation_status || '—', path: '/intern/evaluation', icon: IconStar },
    { label: 'Attestation', value: data?.certificate_status || '—', path: '/intern/certificate', icon: IconCertificate },
  ];

  return (
    <div>
      <PageHeader title="Mon tableau de bord" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-md p-5">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Statut de la candidature</h2>
          <div className="mb-2">{status ? statusBadge(status).badge : <Badge color="slate">Aucune</Badge>}</div>
          <p className="text-sm text-slate-600">
            {!status && "Vous n'avez pas encore soumis de candidature."}
            {status === 'pending' && "Votre candidature est en cours d'examen."}
            {status === 'accepted' && 'Félicitations ! Votre candidature a été acceptée.'}
            {status === 'approved' && 'Félicitations ! Votre candidature a été approuvée.'}
            {status === 'active' && 'Votre stage est actif.'}
            {status === 'rejected' && 'Votre candidature a été refusée.'}
          </p>
          {!status && (
            <Link to="/intern/application" className="inline-block mt-3 text-sm font-medium text-blue-700 hover:text-blue-800">
              Postuler maintenant &rarr;
            </Link>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-5">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">QR Code de présence</h2>
          {application?.qr_token ? (
            <div className="bg-slate-50 rounded-md p-4 text-center border border-slate-200">
              <p className="text-xs text-slate-500 mb-2">Votre token unique</p>
              <p className="text-sm font-mono font-bold text-blue-700 break-all select-all">{application.qr_token}</p>
              <p className="text-xs text-slate-400 mt-2">Présentez ce token au superviseur pour enregistrer votre présence</p>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Disponible après acceptation de la candidature.</p>
          )}
        </div>
      </div>

      {application && (status === 'accepted' || status === 'approved' || status === 'active') && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className="bg-white border border-slate-200 rounded-md p-5 hover:border-slate-300 transition-colors"
            >
              <div className="w-9 h-9 bg-slate-100 rounded-md flex items-center justify-center text-slate-500 mb-3">
                <link.icon />
              </div>
              <p className="text-xl font-bold text-slate-900">{link.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{link.label}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;






